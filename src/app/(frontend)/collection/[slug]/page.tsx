import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArchivePage } from '@/components/archive/ArchivePage'
import { collections, getProductsByCollection } from '@/data'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = collections.find((c) => c.slug === slug)
  return collection ? { title: collection.name, description: collection.summary } : {}
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = collections.find((c) => c.slug === slug)
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
