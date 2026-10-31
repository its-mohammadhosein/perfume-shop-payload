import type { Metadata } from 'next'

import { EmptyState } from '@/components/commerce/EmptyState'
import { Container } from '@/components/ui/Container'
import { PageTitle } from '@/components/ui/PageTitle'
import { pageMetadata } from '@/utilities/pageMetadata'

export const metadata: Metadata = pageMetadata({
  title: 'Compare',
  path: '/compare',
  noIndex: true,
})

// Not mirrored in the html base; wording follows WoodMart's compare empty state
export default function ComparePage() {
  return (
    <>
      <PageTitle>Compare</PageTitle>
      <Container className="py-10">
        <EmptyState
          icon="compare"
          text='No products added in the compare list. You must add some products to compare them. You will find a lot of interesting products on our "Shop" page.'
          title="Compare list is empty."
        />
      </Container>
    </>
  )
}
