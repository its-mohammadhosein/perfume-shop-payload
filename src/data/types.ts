// Static content model. Mirrors what the html base shows; Payload collections come later.

/** Marks content that is placeholder (not in the html base) and must be replaced later */
type Dummy = { dummy?: boolean }

export type ImageAsset = {
  src: string
  width: number
  height: number
  alt: string
}

/** Video or SVG: no intrinsic size needed */
export type FileAsset = {
  src: string
}

export type Gender = 'her' | 'him'
export type CategorySlug = 'mens-fragrances' | 'womens-fragrances'
export type ProductSize = '100ml' | '50ml' | '2ml'

export type Category = {
  slug: CategorySlug
  name: string
  gender: Gender
}

export type OlfactiveFamily = {
  slug: string
  name: string
}

export type Collection = Dummy & {
  slug: string
  name: string
  gender: Gender
  /** Short text for the mega menu card */
  summary: string
  description: string
  image: ImageAsset
}

export type FragranceNotes = {
  top: string[]
  heart: string[]
  base: string[]
}

export type Product = Dummy & {
  id: number
  slug: string
  /** Full name including size, e.g. "Abyss Bleu 100ml" */
  name: string
  fragranceSlug: string
  fragranceName: string
  size: ProductSize
  price: number
  regularPrice?: number
  sku: string
  inStock: boolean
  category: CategorySlug
  gender: Gender
  collection: string
  olfactive: string[]
  /** First image is the main one; the rest cycle on hover */
  images: ImageAsset[]
  shortDescription: string
  description: string
  notes: FragranceNotes
  /** Product video shown as the first gallery item (only mirrored for Abyss Bleu) */
  video?: FileAsset
}

type PostFlowBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; image: ImageAsset }

/** Flow content, plus side-by-side rows (text | image) */
export type PostBlock = PostFlowBlock | { type: 'columns'; columns: PostFlowBlock[][] }

export type Author = Dummy & {
  slug: string
  name: string
  bio: string
  avatar: ImageAsset
}

export type Tag = {
  slug: string
  name: string
}

export type Post = Dummy & {
  slug: string
  title: string
  /** ISO date, e.g. "2025-10-28" */
  date: string
  category: string
  image: ImageAsset
  excerpt: string
  author: Author
  tags: Tag[]
  blocks: PostBlock[]
}

export type NavLink = {
  label: string
  href: string
}

export type MegaMenuColumn = {
  title: NavLink
  links: NavLink[]
}

export type NavItem = NavLink & {
  megaMenu?: {
    columns: MegaMenuColumn[]
    featured: {
      title: string
      text: string
      href: string
      image: ImageAsset
    }
  }
}

export type MobileNavItem = NavLink & {
  children?: NavLink[]
  icon?: 'wishlist' | 'compare' | 'account'
}

export type SocialLink = {
  network: 'facebook' | 'x' | 'instagram' | 'youtube'
  href: string
}

export type HeroSlide = {
  title: string
  cta: NavLink
  bottle: ImageAsset
  background: ImageAsset
  /** Shown behind the image while it loads */
  backgroundColor: string
}

export type FeatureCard = {
  title: string
  text: string
  image: ImageAsset
  productSlug: string
}

export type CollectionBanner = {
  collectionSlug: string
  title: string
  text: string
  image: ImageAsset
}

export type InstagramTile = {
  image: ImageAsset
  likes: number
  comments: number
}

export type FaqItem = {
  question: string
  answer: string
}

export type InfoCard = {
  title: string
  text: string
  icon: FileAsset
}

export type InfoPage = Dummy & {
  slug: string
  title: string
  intro: string
  sections: { heading: string; paragraphs: string[] }[]
}
