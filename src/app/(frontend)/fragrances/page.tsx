import type { Metadata } from 'next'

import { CollectionBanners } from '@/components/sections/home/CollectionBanners'
import { Container } from '@/components/ui/Container'
import { PageTitle } from '@/components/ui/PageTitle'
import { collections } from '@/data'
import { pageMetadata } from '@/utilities/pageMetadata'

const description =
  'Six collections, each with its own mood: from airy florals to deep, smoky woods. Choose a collection to explore its fragrances.'

export const metadata: Metadata = pageMetadata({
  title: 'Fragrances',
  description,
  path: '/fragrances',
})

/** Collections overview (not mirrored in the html base): every collection as a banner. */
export default function FragrancesPage() {
  return (
    <>
      <PageTitle>Fragrances</PageTitle>
      <Container className="pb-10">
        <p className="mb-[25px] max-w-[1000px] text-base md:text-lg">{description}</p>
        <CollectionBanners
          stackOnMobile
          banners={collections.map((c) => ({
            collectionSlug: c.slug,
            title: c.name,
            text: c.description,
            image: c.image,
          }))}
        />
      </Container>
    </>
  )
}
