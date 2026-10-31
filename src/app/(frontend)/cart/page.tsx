import type { Metadata } from 'next'

import { CheckoutSteps } from '@/components/commerce/CheckoutSteps'
import { EmptyState } from '@/components/commerce/EmptyState'
import { Container } from '@/components/ui/Container'
import { PageTitle } from '@/components/ui/PageTitle'
import { pageMetadata } from '@/utilities/pageMetadata'

export const metadata: Metadata = pageMetadata({ title: 'Cart', path: '/cart', noIndex: true })

// The cart is always empty until commerce logic exists
export default function CartPage() {
  return (
    <>
      <PageTitle>
        <h1 className="sr-only">Cart</h1>
        <CheckoutSteps current="cart" />
      </PageTitle>
      <Container className="py-10">
        <EmptyState
          icon="emptyCart"
          text='Before proceed to checkout you must add some products to your shopping cart. You will find a lot of interesting products on our "Shop" page.'
          title="Your cart is currently empty."
        />
      </Container>
    </>
  )
}
