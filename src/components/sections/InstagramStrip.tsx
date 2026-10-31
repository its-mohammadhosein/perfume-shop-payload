import Image from 'next/image'

import { Heading } from '@/components/ui/Heading'
import { Heart, ICON_STROKE } from '@/components/ui/Icon'
import type { FileAsset, InstagramTile } from '@/data/types'
import { cn } from '@/utilities/ui'

type InstagramStripProps = {
  title: string
  handle: string
  href: string
  arrow: FileAsset
  tiles: InstagramTile[]
  className?: string
}

/** "Connect to our Instagram": 2px rule on top, title + handle (30%), six tiles (70%). Home and About. */
export function InstagramStrip({
  title,
  handle,
  href,
  arrow,
  tiles,
  className,
}: InstagramStripProps) {
  return (
    <div
      className={cn(
        'grid gap-[30px] border-t-2 border-primary pt-[30px] md:grid-cols-[40fr_60fr] lg:grid-cols-[30fr_70fr] lg:pt-10',
        className,
      )}
    >
      <div className="flex flex-col justify-center">
        <Heading className="mb-5" size="section">
          {title}
        </Heading>
        <a
          className="inline-flex w-fit items-center gap-2 border-b-2 border-current text-base font-semibold text-title capitalize hover:text-body"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {handle}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG */}
          <img alt="" className="h-2.5 w-auto" src={arrow.src} />
        </a>
      </div>

      {/* Source: a carousel showing 2 / 3 tiles below 1025px, all six in a row on desktop */}
      <ul className="scrollbar-none flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain md:gap-5 lg:grid lg:grid-cols-6 lg:overflow-visible">
        {tiles.map((tile, i) => (
          <li
            key={i}
            className="shrink-0 basis-[calc((100%-10px)/2)] snap-start md:basis-[calc((100%-40px)/3)] lg:basis-auto"
          >
            <a
              aria-label={`Instagram post ${i + 1}`}
              className="group/tile relative block aspect-square overflow-hidden"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt={tile.image.alt}
                className="object-cover"
                fill
                sizes="(min-width: 1025px) 12vw, 33vw"
                src={tile.image.src}
              />
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-sm font-semibold text-white opacity-0 transition-opacity group-hover/tile:opacity-100">
                <Heart aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
                {tile.likes}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
