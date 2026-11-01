import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArchivePage } from '@/components/archive/ArchivePage'
import { getProductsByCollection } from '@/data'
import { getFragranceCollection, getFragranceCollections } from '@/shop/queries'
import { notFoundMetadata, pageMetadata } from '@/utilities/pageMetadata'

type Props = { params: Promise<{ slug: string }> }

// Collections added later render on first visit; edits refresh every page (revalidateSite hook)
export async function generateStaticParams() {
  const collections = await getFragranceCollections()
  return collections.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await getFragranceCollection(slug)
  return collection
    ? pageMetadata({
        title: collection.name,
        description: collection.summary,
        path: `/collection/${slug}`,
        image: collection.image,
      })
    : notFoundMetadata
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = await getFragranceCollection(slug)
  if (!collection) notFound()

  // Each collection has 12 products, so it fits on one page
  return (
    <ArchivePage
      description={collection.description}
      filters={{ collection: collection.slug }}
      hideCollectionFilter
      hrefFor={() => `/collection/${collection.slug}`}
      products={getProductsByCollection(collection.slug)}
      title={collection.name}
    />
  )
}
