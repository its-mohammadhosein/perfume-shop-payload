import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { buildNavigation, toCollection, type ShopCollection } from './map'

/** Fragrance collections in their admin (drag-and-drop) order; empty when the database is unreachable. */
export const getFragranceCollections = cache(async (): Promise<ShopCollection[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'fragrance-collections',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: '_order',
    })
    return docs.map(toCollection)
  } catch (error) {
    console.error('Could not load fragrance collections', error)
    return []
  }
})

export const getFragranceCollection = cache(async (slug: string) => {
  const collections = await getFragranceCollections()
  return collections.find((c) => c.slug === slug)
})

/** Main and mobile menus from the Header global */
export const getNavigation = cache(async () => {
  const [header, collections] = await Promise.all([
    getPayload({ config: configPromise })
      .then((payload) => payload.findGlobal({ slug: 'header', depth: 1, overrideAccess: false }))
      .catch((error) => {
        console.error('Could not load the header', error)
        return null
      }),
    getFragranceCollections(),
  ])
  return buildNavigation(header, collections)
})
