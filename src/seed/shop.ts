/**
 * Imports the shop data from the static html-base extraction (src/data) into Payload.
 * Run it yourself with `pnpm seed:shop`; it targets whatever DATABASE_URL (and BLOB_READ_WRITE_TOKEN)
 * the environment has. It only adds what is missing, so running it again never overwrites edits
 * made in the admin.
 */
import configPromise from '@payload-config'
import path from 'path'
import { getPayload, type Payload } from 'payload'

import { collections } from '@/data/taxonomies'
import type { ImageAsset } from '@/data/types'
import type { Header } from '@/payload-types'

// Hooks skip revalidatePath (there is no Next server while seeding)
const context = { disableRevalidate: true }

// Payload may rename an upload (e.g. "-1" when public/media already has the name), so uploads made
// in this run are remembered by source path rather than found again by filename
const uploaded = new Map<string, number>()

/** Uploads a static image from public/ to Media once, reusing the upload when it already exists */
async function mediaFor(payload: Payload, asset: ImageAsset): Promise<number> {
  const known = uploaded.get(asset.src)
  if (known) return known

  const id = await uploadMedia(payload, asset)
  uploaded.set(asset.src, id)
  return id
}

async function uploadMedia(payload: Payload, asset: ImageAsset): Promise<number> {
  const filePath = path.join(process.cwd(), 'public', asset.src)
  const filename = path.basename(filePath)
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: { filename: { equals: filename } },
  })
  if (existing.docs[0]) return existing.docs[0].id

  const doc = await payload.create({
    collection: 'media',
    context,
    data: { alt: asset.alt },
    filePath,
  })
  payload.logger.info(`  uploaded ${filename}`)
  return doc.id
}

async function seedCollections(payload: Payload): Promise<Map<string, number>> {
  payload.logger.info('- Fragrance collections')
  const ids = new Map<string, number>()

  // Created in the static order (for her first), which becomes the admin drag-and-drop order
  for (const c of collections) {
    const existing = await payload.find({
      collection: 'fragrance-collections',
      depth: 0,
      limit: 1,
      where: { slug: { equals: c.slug } },
    })
    if (existing.docs[0]) {
      payload.logger.info(`  skipped ${c.slug} (already exists)`)
      ids.set(c.slug, existing.docs[0].id)
      continue
    }

    const doc = await payload.create({
      collection: 'fragrance-collections',
      context,
      data: {
        name: c.name,
        slug: c.slug,
        generateSlug: false,
        gender: c.gender,
        summary: c.summary,
        description: c.description,
        image: await mediaFor(payload, { ...c.image, alt: `${c.name} collection` }),
        placeholder: Boolean(c.dummy),
      },
    })
    payload.logger.info(`  created ${c.slug}`)
    ids.set(c.slug, doc.id)
  }
  return ids
}

/** The html base menu: Fragrances opens the mega menu with the Opus Essence card */
function headerMenu(collectionIds: Map<string, number>): NonNullable<Header['navItems']> {
  return [
    { label: 'New', url: '/shop' },
    {
      label: 'Fragrances',
      url: '/fragrances',
      hasMegaMenu: true,
      megaMenu: {
        columns: [
          {
            label: 'Collections for Her',
            url: '/shop?category=womens-fragrances',
            source: 'her',
          },
          {
            label: 'Collections for Him',
            url: '/shop?category=mens-fragrances',
            source: 'him',
          },
          { label: 'All Collections', url: '/shop', source: 'all' },
        ],
        featured: { collection: collectionIds.get('opus-essence') ?? null },
      },
    },
    { label: 'Journal', url: '/journal' },
    { label: 'About Us', url: '/about-us' },
  ]
}

async function seedHeader(payload: Payload, collectionIds: Map<string, number>) {
  payload.logger.info('- Header')
  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  if (header.navItems?.length) {
    payload.logger.info('  skipped (the menu already has items)')
    return
  }
  await payload.updateGlobal({
    slug: 'header',
    context,
    data: { navItems: headerMenu(collectionIds) },
  })
  payload.logger.info('  created the main menu')
}

const payload = await getPayload({ config: configPromise })
payload.logger.info('Seeding shop data...')
const collectionIds = await seedCollections(payload)
await seedHeader(payload, collectionIds)
payload.logger.info('Shop data seeded.')
