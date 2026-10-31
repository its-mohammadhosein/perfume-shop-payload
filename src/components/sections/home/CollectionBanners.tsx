import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import type { CollectionBanner } from '@/data/types'

/**
 * Two square collection banners. On hover the text block rises and the button fades in
 * (pure CSS, 0.3s / 0.4s like the html base). On touch sizes the button is always shown.
 */
export function CollectionBanners({ banners }: { banners: CollectionBanner[] }) {
  return (
    <div className="grid md:grid-cols-2">
      {banners.map((banner) => {
        const href = `/collection/${banner.collectionSlug}`
        return (
          <div
            key={banner.collectionSlug}
            className="group/banner relative flex aspect-square items-end justify-center overflow-hidden p-[30px] text-center text-white lg:p-[50px]"
          >
            <Image
              alt={banner.image.alt}
              className="object-cover"
              fill
              sizes="(min-width: 769px) 50vw, 100vw"
              src={banner.image.src}
            />
            <Link
              aria-label={banner.title}
              className="absolute inset-0"
              href={href}
              tabIndex={-1}
            />
            <div className="relative max-w-[550px] transition-transform duration-300 lg:translate-y-[50px] lg:group-hover/banner:translate-y-0">
              <h2 className="mb-2.5 text-section text-white">
                <Link href={href} className="text-white hover:text-white">
                  {banner.title}
                </Link>
              </h2>
              <p className="text-white/90">{banner.text}</p>
              <div className="mt-[5px] pt-5 transition duration-400 lg:translate-y-[15px] lg:opacity-0 lg:group-hover/banner:translate-y-0 lg:group-hover/banner:opacity-100 lg:group-focus-within/banner:opacity-100">
                <Button href={href} size="lg" variant="black">
                  View Collection
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
