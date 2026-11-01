import type { MetadataRoute } from 'next'

import { infoPages, olfactiveFamilies, paginate, products } from '@/data'
import { getJournalPosts } from '@/journal/posts'
import { getFragranceCollections } from '@/shop/queries'
import { getServerSideURL } from '@/utilities/getURL'

// Refreshed when a post is published or shop data changes (revalidatePost / revalidateSite hooks)
export const revalidate = 600

/** Every indexable page (cart, checkout, account, wishlist and compare are left out). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, collections] = await Promise.all([getJournalPosts(), getFragranceCollections()])
  const url = (path: string) => `${getServerSideURL()}${path}`
  const { totalPages } = paginate(products, 1)

  const paths = [
    '/',
    '/shop',
    ...Array.from({ length: totalPages - 1 }, (_, i) => `/shop/page/${i + 2}`),
    '/fragrances',
    ...collections.map((c) => `/collection/${c.slug}`),
    ...olfactiveFamilies.map((f) => `/olfactive-family/${f.slug}`),
    ...products.map((p) => `/product/${p.slug}`),
    '/journal',
    '/about-us',
    ...infoPages.map((p) => `/${p.slug}`),
  ]

  return [
    ...paths.map((path) => ({ url: url(path) })),
    ...posts.map((p) => ({ url: url(`/journal/${p.slug}`), lastModified: p.date })),
  ]
}
