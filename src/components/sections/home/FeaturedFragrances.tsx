import Image from 'next/image'

import { ProductCard } from '@/components/product/ProductCard'
import { Carousel } from '@/components/ui/Carousel'
import { getProduct } from '@/data'
import type { FeatureCard } from '@/data/types'

/**
 * 55 / 45 row: a square image card (title + text over the photo) next to the product card.
 * In the html base these are two carousels; here each slide holds one pair.
 */
export function FeaturedFragrances({ cards }: { cards: FeatureCard[] }) {
  return (
    <Carousel label="Featured fragrances" slideClassName="basis-full">
      {cards.map((card) => {
        const product = getProduct(card.productSlug)
        return (
          <div key={card.title} className="grid items-center gap-[30px] md:grid-cols-[55fr_45fr]">
            <div className="relative aspect-square overflow-hidden p-[30px] text-white lg:p-[50px]">
              <Image
                alt={card.image.alt}
                className="object-cover"
                fill
                sizes="(min-width: 769px) 55vw, 100vw"
                src={card.image.src}
              />
              <div className="relative max-w-[600px]">
                <h2 className="mb-2.5 text-feature text-white">{card.title}</h2>
                <p className="text-lead text-white">{card.text}</p>
              </div>
            </div>
            {product && (
              <div className="mx-auto w-full max-w-[553px] border border-line-card">
                <ProductCard product={product} sizes="(min-width: 769px) 40vw, 100vw" />
              </div>
            )}
          </div>
        )
      })}
    </Carousel>
  )
}
