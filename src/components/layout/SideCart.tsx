'use client'

import { Button } from '@/components/ui/Button'
import { ShoppingBag } from '@/components/ui/Icon'

import { OffCanvas } from './OffCanvas'

type SideCartProps = {
  open: boolean
  onClose: () => void
}

/** Side cart. The cart is always empty until commerce logic exists. */
export function SideCart({ open, onClose }: SideCartProps) {
  return (
    <OffCanvas onClose={onClose} open={open} side="right" title="Shopping cart">
      <div className="flex h-full flex-col items-center justify-center px-5 py-10 text-center">
        <ShoppingBag aria-hidden="true" className="mb-5 text-gray-300" size={80} strokeWidth={1} />
        <p className="mb-6 text-base text-title">No products in the cart.</p>
        <Button href="/shop" onClick={onClose} size="md">
          Return to shop
        </Button>
      </div>
    </OffCanvas>
  )
}
