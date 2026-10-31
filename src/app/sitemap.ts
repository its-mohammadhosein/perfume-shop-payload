import type { MetadataRoute } from 'next'

import { collections, infoPages, olfactiveFamilies, paginate, posts, products } from '@/data'
import { getServerSideURL } from '@/utilities/getURL'

/** Every indexable page of the static site (cart, checkout, account, wishlist and compare are left out). */
export default function sitemap(): MetadataRoute.Sitemap {
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
