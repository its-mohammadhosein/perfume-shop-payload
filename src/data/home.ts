import { file, image } from './images'
import { products } from './products'
import { collections, olfactiveFamilies } from './taxonomies'
import type { CollectionBanner, FeatureCard, HeroSlide, InstagramTile } from './types'

// The html base hero buttons link to "#"; they point at the matching pages here
export const heroSlides: HeroSlide[] = [
  {
    title: 'New Fragrance in the Opus Essence',
    cta: { label: 'Buy now', href: '/collection/opus-essence' },
    bottle: image('2025/11/prf-slide-1-bottle-1-opt.png', ''),
    background: image('2025/12/prf-slide-1-bg-ov.jpg', ''),
    backgroundColor: '#8b6798',
  },
  {
    title: 'Deep Fragrance With a Refined Intensity',
    cta: { label: 'Buy now', href: '/collection/velours-noir' },
    bottle: image('2025/11/prf-slide-2-bottle-1-opt.png', ''),
    background: image('2025/12/prf-slide-2-bg-ov.jpg', ''),
    backgroundColor: '#73452e',
  },
  {
    title: 'Light Fragrance with a Silky Touch',
    cta: { label: 'Buy now', href: '/collection/etheria' },
    bottle: image('2025/11/prf-slide-3-bottle-1-opt.png', ''),
    background: image('2025/12/prf-slide-3-bg-ov.jpg', ''),
    backgroundColor: '#3b0f04',
  },
]

/** "New In" carousel: first products in shop order */
export const newInSlugs = products.slice(0, 6).map((p) => p.slug)

/** "Promotional Offers" tabs (All / For Her / For Him) */
export const promoSlugs = products.slice(0, 8).map((p) => p.slug)

/** "Shop by Olfactory Family", in the order shown on the home page */
export const homeOlfactiveFamilies = [
  'floral',
  'woody',
  'amber',
  'chypre',
  'leather',
  'aldehyde',
  'spicy',
  'fougere',
].map((slug) => olfactiveFamilies.find((f) => f.slug === slug)!)

export const marqueeWords = ['Ethereal', 'Sensory', 'Signature']
export const marqueeStar = file('2025/11/prf-marquee-figure.svg')

export const featureCards: FeatureCard[] = [
  {
    title: 'Ember Glow',
    text: 'Radiant blend of citrus, florals, and warm musks, evoking the magic of a starlit night in Los Angeles. Luminous, sensual, and endlessly captivating.',
    image: image('2025/11/prf-slide-banner-bg-2.jpg', 'Ember Glow'),
    productSlug: 'ember-glow',
  },
  {
    title: 'Golden Veil',
    text: 'Luxury fusion of rich rose and warm oud, inspired by the golden dunes at sunrise. Opulent, velvety, and timelessly elegant.',
    image: image('2025/11/prf-slide-banner-bg-3.jpg', 'Golden Veil'),
    productSlug: 'golden-veil',
  },
  {
    title: 'Midnight Azure',
    text: 'Refreshing burst of citrus and oceanic notes, capturing the feeling of a sunlit dip in crystal-clear waters—energizing, crisp, and effortlessly luxurious.',
    image: image('2025/12/prf-slide-banner-bg-1.jpg', 'Midnight Azure'),
    productSlug: 'midnight-azure',
  },
]

const bannerFor = (slug: string, imageKey: string): CollectionBanner => {
  const c = collections.find((col) => col.slug === slug)!
  return {
    collectionSlug: slug,
    title: c.name,
    text: c.description,
    image: image(imageKey, c.name),
  }
}

export const collectionBanners: CollectionBanner[] = [
  bannerFor('nocturne-essence', '2025/12/prf-latest-collections-banner-1-opt.jpg'),
  bannerFor('etheria', '2025/12/prf-latest-collections-banner-2-opt.jpg'),
]

export const instagram = {
  title: 'Connect to our Instagram',
  handle: '@xtemos.studio',
  href: 'https://www.instagram.com/xtemos.studio/',
  arrow: file('2025/11/wd-merchandise-long-arrow-black.svg'),
  tiles: (
    [
      [6078, 366],
      [2620, 644],
      [2656, 408],
      [5773, 461],
      [8341, 171],
      [6436, 205],
    ] as const
  ).map(([likes, comments], i): InstagramTile => ({
    image: image(`2025/11/prf-inst-${i + 1}.jpg`, 'Instagram post'),
    likes,
    comments,
  })),
}
