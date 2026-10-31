import scraped from './generated/products.json'
import detail from './generated/product-detail.json'
import { hasImage, image } from './images'
import { collections, olfactiveFamilies } from './taxonomies'
import type { CategorySlug, FragranceNotes, Product, ProductSize } from './types'

/**
 * Per-fragrance assignments. The html base only shows these for Abyss Bleu (Nocturne Essence;
 * Aldehyde, Fresh) and the Opus Essence members (all Floral). Everything else is DUMMY, chosen so
 * the totals match the shop filter counts: 12 products per collection and
 * Aldehyde 15, Amber 27, Chypre 21, Floral 18, Fougere 21, Fresh 24, Leather 3, Spicy 21, Woody 9.
 */
const fragrances: Record<string, { collection: string; olfactive: string[] }> = {
  // For her
  'aurora-flame': { collection: 'opus-essence', olfactive: ['floral', 'amber'] },
  'crimson-dusk': { collection: 'opus-essence', olfactive: ['floral', 'spicy'] },
  'ember-glow': { collection: 'opus-essence', olfactive: ['floral', 'chypre'] },
  'solstice-bloom': { collection: 'opus-essence', olfactive: ['floral', 'fougere'] },
  'aurora-haze': { collection: 'etheria', olfactive: ['amber', 'fresh'] },
  'amethyst-haze': { collection: 'etheria', olfactive: ['floral', 'aldehyde'] },
  'peach-serenity': { collection: 'etheria', olfactive: ['fresh', 'fougere'] },
  'violet-eclipse': { collection: 'etheria', olfactive: ['chypre', 'leather'] },
  'amber-bloom': { collection: 'celeste-aura', olfactive: ['amber', 'floral', 'woody'] },
  'golden-veil': { collection: 'celeste-aura', olfactive: ['amber', 'woody', 'spicy'] },
  'nocturne-glow': { collection: 'celeste-aura', olfactive: ['amber', 'chypre'] },
  'twilight-ember': { collection: 'celeste-aura', olfactive: ['amber', 'spicy'] },
  // For him
  'abyss-bleu': { collection: 'nocturne-essence', olfactive: ['aldehyde', 'fresh'] },
  'cobalt-shadow': { collection: 'nocturne-essence', olfactive: ['fresh', 'chypre'] },
  'midnight-azure': { collection: 'nocturne-essence', olfactive: ['fresh', 'amber'] },
  'obsidian-tide': { collection: 'nocturne-essence', olfactive: ['chypre', 'spicy', 'amber'] },
  'arctic-dusk': { collection: 'velours-noir', olfactive: ['fresh', 'fougere', 'aldehyde'] },
  'celestial-surge': { collection: 'velours-noir', olfactive: ['fougere', 'spicy'] },
  'eclipse-verde': { collection: 'velours-noir', olfactive: ['fougere', 'chypre', 'woody'] },
  'tidal-obscura': { collection: 'velours-noir', olfactive: ['chypre', 'spicy'] },
  'celestial-frost': { collection: 'elysian-bloom', olfactive: ['fresh', 'aldehyde'] },
  'glacier-bloom': { collection: 'elysian-bloom', olfactive: ['fresh', 'fougere'] },
  'lunar-mist': { collection: 'elysian-bloom', olfactive: ['aldehyde', 'amber'] },
  'neptune-veil': { collection: 'elysian-bloom', olfactive: ['fougere', 'spicy'] },
}

// DUMMY notes, picked per olfactive family
const notePool: Record<string, FragranceNotes> = {
  aldehyde: {
    top: ['Aldehydes', 'Bergamot'],
    heart: ['Iris', 'Rose'],
    base: ['White Musk', 'Vetiver'],
  },
  amber: {
    top: ['Mandarin', 'Pink Pepper'],
    heart: ['Amber', 'Labdanum'],
    base: ['Vanilla', 'Benzoin'],
  },
  chypre: {
    top: ['Bergamot', 'Blackcurrant'],
    heart: ['Rose', 'Jasmine'],
    base: ['Oakmoss', 'Patchouli'],
  },
  floral: { top: ['Pear', 'Neroli'], heart: ['Peony', 'Jasmine'], base: ['Musk', 'Cashmeran'] },
  fougere: {
    top: ['Lavender', 'Lemon'],
    heart: ['Geranium', 'Clary Sage'],
    base: ['Tonka Bean', 'Oakmoss'],
  },
  fresh: {
    top: ['Grapefruit', 'Sea Salt'],
    heart: ['Marine Accord', 'Mint'],
    base: ['Driftwood', 'Ambroxan'],
  },
  leather: {
    top: ['Saffron', 'Cardamom'],
    heart: ['Leather', 'Violet'],
    base: ['Suede', 'Birch Tar'],
  },
  spicy: {
    top: ['Pink Pepper', 'Cardamom'],
    heart: ['Cinnamon', 'Clove'],
    base: ['Tobacco', 'Amberwood'],
  },
  woody: {
    top: ['Cypress', 'Elemi'],
    heart: ['Cedarwood', 'Oud'],
    base: ['Sandalwood', 'Vetiver'],
  },
}

function dummyNotes(olfactive: string[]): FragranceNotes {
  const pools = olfactive.map((slug) => notePool[slug]!)
  const pick = (part: keyof FragranceNotes) =>
    [...new Set(pools.flatMap((p) => p[part]))].slice(0, 4)
  return { top: pick('top'), heart: pick('heart'), base: pick('base') }
}

const familyName = (slug: string) => olfactiveFamilies.find((f) => f.slug === slug)?.name ?? slug
const collectionName = (slug: string) => collections.find((c) => c.slug === slug)?.name ?? slug

function dummyCopy(fragranceName: string, olfactive: string[], collection: string) {
  const families = olfactive.map((s) => familyName(s).toLowerCase())
  const familyText =
    families.length > 1 ? `${families.slice(0, -1).join(', ')} and ${families.at(-1)}` : families[0]
  return {
    shortDescription: `A ${familyText} fragrance from the ${collectionName(collection)} collection.`,
    description: `${fragranceName} is a refined ${familyText} composition from the ${collectionName(collection)} collection. It opens bright and expressive, settles into a rich and elegant heart, and leaves a lasting, intimate trail on the skin. Thoughtfully balanced and easy to wear, ${fragranceName} is made for moments you want to remember.`,
  }
}

const sizeOrder: ProductSize[] = ['100ml', '50ml', '2ml']

export const products: Product[] = scraped.map((p) => {
  const assignment = fragrances[p.fragranceSlug]
  if (!assignment) throw new Error(`No assignment for fragrance ${p.fragranceSlug}`)
  const isDetailed = p.fragranceSlug === detail.slug
  const copy = isDetailed
    ? { shortDescription: detail.shortDescription, description: detail.collectionBlurb.description }
    : dummyCopy(p.fragranceName, assignment.olfactive, assignment.collection)
  const imageKeys = p.images.filter(hasImage)

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    fragranceSlug: p.fragranceSlug,
    fragranceName: p.fragranceName,
    size: p.size as ProductSize,
    price: p.price,
    sku: p.sku,
    inStock: p.inStock,
    category: p.category as CategorySlug,
    gender: p.category === 'womens-fragrances' ? 'her' : 'him',
    collection: assignment.collection,
    olfactive: assignment.olfactive,
    images: imageKeys.map((key) => image(key, p.name)),
    ...copy,
    notes: isDetailed ? (detail.notes as FragranceNotes) : dummyNotes(assignment.olfactive),
    ...(isDetailed ? {} : { dummy: true }),
  }
})

export const productVideo = detail.video

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

/** All sizes of the same fragrance, 100ml first */
export function getSizes(fragranceSlug: string): Product[] {
  return products
    .filter((p) => p.fragranceSlug === fragranceSlug)
    .sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size))
}

export function getProductsByCollection(slug: string): Product[] {
  return products.filter((p) => p.collection === slug)
}

export function getProductsByOlfactive(slug: string): Product[] {
  return products.filter((p) => p.olfactive.includes(slug))
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug)
}

export function getProductsBySlugs(slugs: string[]): Product[] {
  return slugs.map((slug) => {
    const product = getProduct(slug)
    if (!product) throw new Error(`Unknown product: ${slug}`)
    return product
  })
}
