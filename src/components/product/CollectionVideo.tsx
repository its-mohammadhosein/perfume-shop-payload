'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Play } from '@/components/ui/Icon'
import type { ImageAsset } from '@/data/types'

/** Cover image with a play button; loads the YouTube player only after a click. */
export function CollectionVideo({
  cover,
  url,
  title,
}: {
  cover: ImageAsset
  url: string
  title: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative h-[420px] overflow-hidden bg-footer lg:h-[840px]">
      {playing ? (
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
          src={url}
          title={title}
        />
      ) : (
        <button
          aria-label={`Play video: ${title}`}
          className="group/video absolute inset-0 cursor-pointer"
          onClick={() => setPlaying(true)}
          type="button"
        >
          <Image alt={cover.alt} className="object-cover" fill sizes="100vw" src={cover.src} />
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover/video:bg-black/20" />
          <span className="absolute top-1/2 left-1/2 flex size-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-title transition-transform group-hover/video:scale-110">
            <Play
              aria-hidden="true"
              className="ml-1"
              fill="currentColor"
              size={26}
              strokeWidth={0}
            />
          </span>
        </button>
      )}
    </div>
  )
}
