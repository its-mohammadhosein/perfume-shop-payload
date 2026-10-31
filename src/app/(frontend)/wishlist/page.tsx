import type { Metadata } from 'next'

import { EmptyState } from '@/components/commerce/EmptyState'
import { Container } from '@/components/ui/Container'
import { PageTitle } from '@/components/ui/PageTitle'

export const metadata: Metadata = { title: 'Wishlist' }

export default function WishlistPage() {
  return (
    <>
      <PageTitle>Wishlist</PageTitle>
      <Container className="py-10">
        <EmptyState
          icon="heart"
          text={`You don't have any products in the wishlist yet. You will find a lot of interesting products on our "Shop" page.`}
          title="This wishlist is empty."
        />
      </Container>
    </>
  )
}
