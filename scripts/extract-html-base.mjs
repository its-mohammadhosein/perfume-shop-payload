/**
 * One-off extraction of content and images from the html base (static WoodMart mirror).
 *
 *   node scripts/extract-html-base.mjs [path-to-woodmart-perfume]
 *
 * Writes:
 *   src/data/generated/*.json   facts scraped from the html base (committed)
 *   public/images/**            the best local copy of every referenced image
 *
 * Hand-written data (src/data/*.ts) builds on these files and fills gaps with dummy data.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const BASE = path.resolve(process.argv[2] ?? path.join(ROOT, '../woodmart-perfume'))
const SITE = path.join(BASE, 'perfumes')
const UPLOAD_DIRS = [
  path.join(SITE, 'wp-content/uploads/sites/32'),
  path.join(BASE, 'wp-content/uploads'),
]
const OUT_DATA = path.join(ROOT, 'src/data/generated')
const OUT_IMAGES = path.join(ROOT, 'public/images')

// Images not needed by the new site
const SKIP_IMAGE = [/^2026\/02\/prf-popup/, /favicon/]

const read = (rel) => fs.readFileSync(path.join(SITE, rel), 'utf8')

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')

const text = (html) =>
  decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

const between = (s, start, end) => {
  const i = s.indexOf(start)
  if (i < 0) throw new Error(`Marker not found: ${start}`)
  const j = end ? s.indexOf(end, i) : -1
  return s.slice(i, j < 0 ? undefined : j)
}

const stripNoise = (html) =>
  html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '')

/* ------------------------------------------------------------------------ */
/* Images                                                                    */
/* ------------------------------------------------------------------------ */

/** Upload URL or relative path -> logical key of the original, e.g. "2025/11/abyss-bleu.jpeg" */
function imageKey(url) {
  const m = url.match(/uploads\/(?:sites\/32\/)?(\d{4}\/\d{2}\/[^"')\s?#]+)/)
  if (!m) return null
  let key = decodeURIComponent(m[1])
  key = key.replace(/(\.(?:jpe?g|png|gif))\.webp$/i, '$1')
  key = key.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1')
  if (SKIP_IMAGE.some((re) => re.test(key))) return null
  return key
}

/** Every upload referenced by an html string (img, srcset, data attrs, css backgrounds, links, video) */
function collectImageKeys(html) {
  const keys = new Set()
  for (const m of html.matchAll(/[^\s"'(,]*uploads\/[^\s"'),]+/g)) {
    const key = imageKey(m[0])
    if (key && /\.(jpe?g|png|webp|svg|gif|webm|mp4)$/i.test(key)) keys.add(key)
  }
  return keys
}

/** Best local file for a logical key: original webp > original > largest resized copy */
function resolveLocal(key) {
  const dir = path.dirname(key)
  const file = path.basename(key)
  const ext = path.extname(file)
  const stem = file.slice(0, -ext.length)
  for (const uploads of UPLOAD_DIRS) {
    const abs = path.join(uploads, dir)
    if (!fs.existsSync(abs)) continue
    const files = fs.readdirSync(abs)
    for (const name of [`${file}.webp`, file]) if (files.includes(name)) return path.join(abs, name)
    const sized = files
      .map((f) => {
        const m = f.match(
          new RegExp(
            `^${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)x(\\d+)${ext.replace('.', '\\.')}(\\.webp)?$`,
            'i',
          ),
        )
        return m ? { f, w: Number(m[1]), webp: Boolean(m[3]) } : null
      })
      .filter(Boolean)
      .sort((a, b) => b.w - a.w || Number(b.webp) - Number(a.webp))
    if (sized[0]) return path.join(abs, sized[0].f)
  }
  return null
}

async function copyImages(keys) {
  const registry = {}
  const missing = []
  let bytes = 0
  for (const key of [...keys].sort()) {
    const src = resolveLocal(key)
    if (!src) {
      missing.push(key)
      continue
    }
    const outExt = src.endsWith('.webp') ? '.webp' : path.extname(src)
    const outName = path.basename(key, path.extname(key)) + outExt
    const outRel = path.posix.join(path.dirname(key), outName)
    const dest = path.join(OUT_IMAGES, outRel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    bytes += fs.statSync(dest).size

    const entry = { src: `/images/${outRel}` }
    if (!/\.(svg|webm|mp4)$/i.test(outName)) {
      const meta = await sharp(dest).metadata()
      entry.width = meta.width
      entry.height = meta.height
    }
    registry[key] = entry
  }
  return { registry, missing, bytes }
}

/* ------------------------------------------------------------------------ */
/* Products (shop pages 1-6)                                                 */
/* ------------------------------------------------------------------------ */

const SIZES = [
  { suffix: ' 2ml Sample', slug: '-2ml-sample', size: '2ml' },
  { suffix: ' 50ml', slug: '-50ml', size: '50ml' },
  { suffix: ' 100ml', slug: '', size: '100ml' },
]

function parseProductCards(html) {
  const chunks = html.split('<div class="wd-product wd-col').slice(1)
  return chunks.map((chunk) => {
    const cls = chunk.slice(0, chunk.indexOf('"'))
    const slug = chunk.match(/\/product\/([^/"]+)\//)[1]
    const name = text(
      chunk.match(/<h3 class="wd-loop-prod-title[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)[1],
    )
    const priceHtml = chunk.match(/<span class="price">([\s\S]*?)<\/span>\s*<\/div>/)[1]
    const amounts = [...priceHtml.matchAll(/<\/span>([\d.,]+)<\/bdi>/g)].map((m) =>
      Number(m[1].replace(/,/g, '')),
    )
    const slides = [...chunk.matchAll(/data-image-url="([^"]+)"/g)].map((m) => imageKey(m[1]))
    const fallback = imageKey(chunk.match(/<img[^>]*src="([^"]+)"/)[1])
    const size = SIZES.find((s) => name.endsWith(s.suffix))
    return {
      id: Number(chunk.match(/data-id="(\d+)"/)[1]),
      slug,
      name,
      fragranceName: name.slice(0, -size.suffix.length),
      fragranceSlug: size.slug ? slug.slice(0, -size.slug.length) : slug,
      size: size.size,
      price: amounts.at(-1),
      ...(amounts.length > 1 ? { regularPrice: amounts[0] } : {}),
      category: cls.match(/product_cat-([a-z-]+)/)[1],
      inStock: /\binstock\b/.test(cls),
      sku: chunk.match(/data-product_sku="([^"]*)"/)?.[1] ?? '',
      images: (slides.length ? slides : [fallback]).filter(Boolean),
    }
  })
}

/* ------------------------------------------------------------------------ */
/* Product detail (only Abyss Bleu is mirrored)                              */
/* ------------------------------------------------------------------------ */

function parseProductDetail(html) {
  const main = stripNoise(between(html, 'role="main"', 'From Collection'))
  const attrRows = [
    ...main.matchAll(/<tr class="woocommerce-product-attributes-item[\s\S]*?<\/tr>/g),
  ].map((m) => ({
    label: text(m[0].match(/<span class="wd-attr-name[^"]*">([\s\S]*?)<\/span>/)[1]),
    values: [...m[0].matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((a) => ({
      name: text(a[2]).replace(/\s*,$/, ''),
      slug: a[1].replace(/\/$/, '').split('/').pop(),
    })),
  }))
  const notes = Object.fromEntries(
    [
      ...main.matchAll(
        /<h2[^>]*>\s*(Top|Heart|Base) Notes:\s*<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g,
      ),
    ].map((m) => [m[1].toLowerCase(), text(m[2]).split(/\s*,\s*/)]),
  )
  const blurb = main.match(/<h2[^>]*>([^<]*Collection)<\/h2>([\s\S]*?)<h2/)
  return {
    slug: 'abyss-bleu',
    shortDescription: text(
      main.match(/woocommerce-product-details__short-description">([\s\S]*?)<\/div>/)[1],
    ),
    gallery: [...main.matchAll(/data-large_image="([^"]+)"/g)]
      .map((m) => imageKey(m[1]))
      .filter(Boolean),
    video: imageKey(main.match(/(\S*perfumes-product-video\.webm)/)[1]),
    attributes: attrRows,
    collectionBlurb: {
      title: text(blurb[1]),
      image: imageKey(blurb[2].match(/<img[^>]*src="([^"]+)"/)[1]),
      videoUrl: decode(blurb[2].match(/href="(https:\/\/www\.youtube\.com[^"]+)"/)[1]),
      description: text(blurb[2].match(/<p[^>]*>([\s\S]*?)<\/p>/)[1]),
    },
    notes,
  }
}

/* ------------------------------------------------------------------------ */
/* Journal                                                                   */
/* ------------------------------------------------------------------------ */

function parsePostCards(html) {
  const main = between(html, 'role="main"', 'wd-footer')
  const seen = new Map()
  for (const m of main.matchAll(/<article[\s\S]*?<\/article>/g)) {
    const card = m[0]
    const link = card.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/"]+)\//)
    if (!link || seen.has(link[4])) continue
    seen.set(link[4], {
      slug: link[4],
      title: text(card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)[1]),
      date: `${link[1]}-${link[2]}-${link[3]}`,
      category: 'Perfumes',
      image: imageKey(card.match(/<img[^>]*src="([^"]+)"/)[1]),
    })
  }
  return [...seen.values()]
}

function parsePostBody(html) {
  const body = stripNoise(between(html, 'class="wd-single-post-content', '<h4'))
  const blocks = []
  for (const m of body.matchAll(
    /<h2[^>]*>([\s\S]*?)<\/h2>|<p[^>]*>([\s\S]*?)<\/p>|<img[^>]*src="([^"]+)"[^>]*>/g,
  )) {
    if (m[1]) blocks.push({ type: 'heading', text: text(m[1]) })
    else if (m[2] && text(m[2])) blocks.push({ type: 'paragraph', text: text(m[2]) })
    else if (m[3]) {
      const key = imageKey(m[3])
      if (key) blocks.push({ type: 'image', image: key })
    }
  }
  const authorHtml = between(html, '<h4', 'View all posts')
  return {
    slug: 'scent-sensibility',
    blocks,
    tags: [...html.matchAll(/\/blog\/blog-tag\/([^/]+)\/"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
      slug: m[1],
      name: text(m[2]),
    })),
    author: {
      name: text(authorHtml.match(/<h4[^>]*>([\s\S]*?)<\/h4>/)[1]).replace(/^About\s+/, ''),
      bio: text(authorHtml.match(/<\/h4>([\s\S]*)/)[1]),
      avatar: imageKey(html.match(/[^"]*uploads\/2018\/10\/avatar-home\.jpg/)[0]),
    },
  }
}

/* ------------------------------------------------------------------------ */

async function main() {
  if (!fs.existsSync(SITE)) throw new Error(`html base not found at ${SITE}`)

  const shopPages = ['shop/index.html', ...[2, 3, 4, 5, 6].map((n) => `shop/page/${n}/index.html`)]
  const products = shopPages.flatMap((p) => parseProductCards(read(p)))

  const collectionHtml = read('collection/opus-essence/index.html')
  const collectionMembers = {
    'opus-essence': parseProductCards(between(collectionHtml, 'role="main"', 'wd-footer')).map(
      (p) => p.slug,
    ),
  }

  const productDetail = parseProductDetail(read('product/abyss-bleu/index.html'))
  const posts = parsePostCards(read('journal/index.html'))
  const postBody = parsePostBody(read('2025/10/28/scent-sensibility/index.html'))

  // Every image referenced by the pages we rebuild
  const pages = [
    'index.html',
    'about-us/index.html',
    'product/abyss-bleu/index.html',
    'collection/opus-essence/index.html',
    'journal/index.html',
    '2025/10/28/scent-sensibility/index.html',
    'cart/index.html',
    'wishlist/index.html',
    ...shopPages,
  ]
  const keys = new Set()
  for (const p of pages) for (const k of collectImageKeys(read(p))) keys.add(k)
  for (const p of products) for (const k of p.images) keys.add(k)
  // Size-specific originals (100ml: name, 50ml: name-2, 2ml: name-3) for every fragrance
  for (const p of products)
    keys.add(`2025/11/${p.fragranceSlug}${{ '100ml': '', '50ml': '-2', '2ml': '-3' }[p.size]}.jpeg`)

  const { registry, missing, bytes } = await copyImages(keys)

  fs.mkdirSync(OUT_DATA, { recursive: true })
  const write = (name, data) =>
    fs.writeFileSync(path.join(OUT_DATA, name), JSON.stringify(data, null, 2) + '\n')
  write('products.json', products)
  write('collection-members.json', collectionMembers)
  write('product-detail.json', productDetail)
  write('posts.json', posts)
  write('post-body.json', postBody)
  write('images.json', registry)

  console.log(
    `products: ${products.length} (${new Set(products.map((p) => p.fragranceSlug)).size} fragrances)`,
  )
  console.log(
    `categories: ${JSON.stringify(products.reduce((a, p) => ({ ...a, [p.category]: (a[p.category] ?? 0) + 1 }), {}))}`,
  )
  console.log(`opus-essence members: ${collectionMembers['opus-essence'].length}`)
  console.log(
    `posts: ${posts.length}, post blocks: ${postBody.blocks.length}, tags: ${postBody.tags.length}`,
  )
  console.log(
    `images: ${Object.keys(registry).length} copied (${(bytes / 1024 / 1024).toFixed(1)} MB)`,
  )
  if (missing.length)
    console.log(`images missing locally (${missing.length}):\n  ${missing.join('\n  ')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
