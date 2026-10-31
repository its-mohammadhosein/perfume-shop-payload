import React from 'react'

import { Button } from '@/components/ui/Button'
import { WdIcon } from '@/components/ui/Icon'
import type { WdGlyph } from '@/components/ui/wdGlyphs'

type EmptyStateProps = {
  /** woodmart-font glyph shown above the title, or custom content (e.g. "404") */
  icon: WdGlyph | React.ReactNode
  title: string
  text: React.ReactNode
  as?: 'h1' | 'h2'
}

/**
 * WoodMart empty block (cart, wishlist, compare, 404): a very light icon at 3.4× the title size,
 * a 24/40px title, grey text (max 535px) and a primary "Return to shop" button.
 */
export function EmptyState({ icon, title, text, as: Title = 'h2' }: EmptyStateProps) {
  return (
    <div className="text-center">
      <Title className="mb-5 text-2xl leading-[1.2] lg:text-[40px]">
        <span aria-hidden="true" className="mb-5 block text-[3.4em] leading-none text-black/7">
          {typeof icon === 'string' ? (
            <WdIcon className="mx-auto size-[1em]" name={icon as WdGlyph} />
          ) : (
            icon
          )}
        </span>
        {title}
      </Title>
      <p className="mx-auto mb-5 max-w-[535px]">{text}</p>
      <Button href="/shop" size="md">
        Return to shop
      </Button>
    </div>
  )
}
