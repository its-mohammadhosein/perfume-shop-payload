import type { Metadata } from 'next'

import { aboutIntro } from '@/data'
import type { ImageAsset } from '@/data/types'

export const SITE_NAME = 'Perfumes'
export const SITE_DESCRIPTION =
  'WoodMart Fragrances: luxury perfume collections for her and for him, crafted from the finest natural ingredients.'

// 1920×1080 atelier photo; used when a page has no image of its own
const DEFAULT_IMAGE = aboutIntro.image

type PageMetadataOptions = {
  /** Page title; the layout template adds " - Perfumes". Omit on the home page. */
  title?: string
  description?: string
  /** Path of the page, e.g. "/journal"; resolved against `metadataBase` */
  path: string
  image?: ImageAsset
  type?: 'website' | 'article'
  /** Cart, checkout, account and similar pages that shouldn't be indexed */
  noIndex?: boolean
}

/**
 * Full metadata for a route: title, description, canonical URL, Open Graph and Twitter card.
 * Next replaces (doesn't merge) `openGraph` between layout and page, so every page sets all of it.
 */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex,
}: PageMetadataOptions): Metadata {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME
  const images = [
    { url: image.src, width: image.width, height: image.height, alt: image.alt || fullTitle },
  ]
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: { type, siteName: SITE_NAME, title: fullTitle, description, url: path, images },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images },
    ...(noIndex && { robots: { index: false, follow: true } }),
  }
}

/** For routes that end in notFound(): the 404 shouldn't be indexed or claim a canonical URL */
export const notFoundMetadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}
