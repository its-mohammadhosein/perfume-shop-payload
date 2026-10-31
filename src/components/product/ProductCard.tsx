import Image from 'next/image'
import Link from 'next/link'

import { Heart, ICON_STROKE, ShoppingCart } from '@/components/ui/Icon'
import { Price } from '@/components/ui/Price'
import type { Product } from '@/data/types'
import { cn } from '@/utilities/ui'

import { CardGallery } from './CardGallery'

type ProductCardProps = {
  product: Product
  /** next/image `sizes` for the grid this card sits in */
  sizes?: string
  priority?: boolean
  className?: string
}

const actionClass =
  'absolute right-[7px] flex cursor-pointer items-center justify-center p-2.5 text-title transition-opacity duration-300 hover:text-title-hover focus-visible:opacity-100 lg:right-2.5 lg:p-[15px] lg:opacity-0 lg:group-hover/card:opacity-100'

/**
 * WoodMart loop card: the 7:8 image fills the card, the title sits top-left and the price
 * bottom-left over it. Wishlist and add-to-cart icons appear on hover (always on touch sizes).
 */
export function ProductCard({
  product,
  sizes = '(min-width: 769px) 25vw, 50vw',
  priority,
  className,
}: ProductCardProps) {
  const href = `/product/${product.slug}`
  // Hover cycling uses up to 4 images, like the html base
  const images = product.images.slice(0, 4)

  return (
    <div className={cn('group/card relative', className)}>
      <CardGallery className="relative aspect-[7/8] overflow-hidden bg-muted">
        <Link aria-label={product.name} className="absolute inset-0" href={href} tabIndex={-1}>
          {images.map((image, i) => (
            <Image
              key={image.src}
              alt={i === 0 ? image.alt : ''}
              className="object-cover transition-opacity duration-300 data-[active=false]:opacity-0"
              data-active={i === 0}
              data-gallery-image
              fill
              priority={priority && i === 0}
              sizes={sizes}
              src={image.src}
            />
          ))}
        </Link>
      </CardGallery>

      {/* 60px right padding at every size keeps the title clear of the wishlist icon */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-[15px] pr-[60px] pl-2 md:pl-[15px] lg:py-[25px] lg:pl-[25px]">
        <h3 className="text-base leading-[1.3] font-medium text-title md:text-lg">
          <Link className="pointer-events-auto hover:text-title-hover" href={href}>
            {product.name}
          </Link>
        </h3>
        <Price
          amount={product.price}
          className="pointer-events-auto"
          regular={product.regularPrice}
        />
      </div>

      <button
        aria-label={`Add ${product.name} to wishlist`}
        className={cn(actionClass, 'top-[7px] lg:top-2.5')}
        type="button"
      >
        <Heart aria-hidden="true" className="size-4 lg:size-5" strokeWidth={ICON_STROKE} />
      </button>
      <button
        aria-label={`Add ${product.name} to cart`}
        className={cn(actionClass, 'bottom-[7px] lg:bottom-2.5')}
        type="button"
      >
        <ShoppingCart aria-hidden="true" className="size-4 lg:size-5" strokeWidth={ICON_STROKE} />
      </button>
    </div>
  )
}
