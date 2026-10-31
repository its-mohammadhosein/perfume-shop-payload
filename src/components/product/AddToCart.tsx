'use client'

import { useId, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Heart, ICON_STROKE, Minus, Plus } from '@/components/ui/Icon'

/**
 * Quantity + "Add to cart" (primary) + "Buy now" (outline), full width, and the wishlist link.
 * UI only: nothing is added to a cart until commerce logic exists.
 */
export function AddToCart({ productName }: { productName: string }) {
  const id = useId()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const stepClass =
    'flex w-[30px] cursor-pointer items-center justify-center text-title hover:bg-muted disabled:cursor-default disabled:opacity-40'

  return (
    <div className="w-full max-w-[640px]">
      <div className="mb-2.5 flex gap-2.5">
        <div className="flex h-12 border border-line">
          <button
            aria-label="Decrease quantity"
            className={stepClass}
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            type="button"
          >
            <Minus aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
          </button>
          <label className="sr-only" htmlFor={id}>
            {productName} quantity
          </label>
          <input
            className="w-[42px] border-0 text-center text-base text-title [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            id={id}
            inputMode="numeric"
            min={1}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            type="number"
            value={quantity}
          />
          <button
            aria-label="Increase quantity"
            className={stepClass}
            onClick={() => setQuantity((q) => q + 1)}
            type="button"
          >
            <Plus aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
          </button>
        </div>
        <Button className="flex-1" onClick={() => setAdded(true)} size="lg">
          {added ? 'Added to cart' : 'Add to cart'}
        </Button>
      </div>
      <Button fullWidth size="lg" variant="outline">
        Buy now
      </Button>
      <button
        className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-title hover:text-title-hover"
        type="button"
      >
        <Heart aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
        Add to wishlist
      </button>
    </div>
  )
}
