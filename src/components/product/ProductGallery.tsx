'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'

import { ChevronLeft, ChevronRight, ICON_STROKE, X } from '@/components/ui/Icon'
import type { FileAsset, ImageAsset } from '@/data/types'
import { cn } from '@/utilities/ui'

type ProductGalleryProps = {
  images: ImageAsset[]
  /** Muted looping video shown over the first image */
  video?: FileAsset
  name: string
}

/**
 * WoodMart "thumbs grid bottom combined 3" on desktop: a 5-column grid with a 50px gap where the
 * first item spans the full width and the rest alternate 3+2 / 2+3 columns.
 * Below 1025px it is a swipeable one-per-view strip. Clicking an image opens a lightbox.
 */
function spanClass(index: number) {
  const n = index + 1
  if (n === 1) return 'lg:col-span-5'
  return (n - 2) % 4 === 0 || (n >= 5 && (n - 5) % 4 === 0) ? 'lg:col-span-3' : 'lg:col-span-2'
}

export function ProductGallery({ images, video, name }: ProductGalleryProps) {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      <ul className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto lg:grid lg:grid-cols-5 lg:items-center lg:gap-[50px] lg:overflow-visible">
        {images.map((image, i) => (
          <li key={image.src} className={cn('shrink-0 basis-full snap-start', spanClass(i))}>
            <button
              aria-label={`Open image ${i + 1} of ${images.length}`}
              className="relative block aspect-[7/8] w-full cursor-zoom-in overflow-hidden bg-muted"
              onClick={() => setOpen(i)}
              type="button"
            >
              <Image
                alt={i === 0 ? name : ''}
                className="object-cover"
                fill
                priority={i === 0}
                sizes={
                  i === 0 ? '(min-width: 1025px) 50vw, 100vw' : '(min-width: 1025px) 30vw, 100vw'
                }
                src={image.src}
              />
              {i === 0 && video && (
                <video
                  aria-hidden="true"
                  autoPlay
                  className="absolute inset-0 size-full object-cover"
                  loop
                  muted
                  playsInline
                  poster={image.src}
                  src={video.src}
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox images={images} index={open} onChange={setOpen} onClose={close} />
      )}
    </>
  )
}

function Lightbox({
  images,
  index,
  onChange,
  onClose,
}: {
  images: ImageAsset[]
  index: number
  onChange: (i: number) => void
  onClose: () => void
}) {
  const go = useCallback(
    (delta: number) => onChange((index + delta + images.length) % images.length),
    [index, images.length, onChange],
  )

  useEffect(() => {
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.style.overflow = overflow
    }
  }, [go, onClose])

  const image = images[index]!
  const navClass =
    'absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer p-3 text-white/80 hover:text-white'

  return (
    <div
      aria-label="Image viewer"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex animate-[fade-in_0.25s_ease] items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
    >
      <button
        aria-label="Close"
        autoFocus
        className="absolute top-4 right-4 z-10 cursor-pointer p-2 text-white/80 hover:text-white"
        onClick={onClose}
        type="button"
      >
        <X aria-hidden="true" size={28} strokeWidth={ICON_STROKE} />
      </button>
      <button
        aria-label="Previous image"
        className={cn(navClass, 'left-2')}
        onClick={(e) => {
          e.stopPropagation()
          go(-1)
        }}
        type="button"
      >
        <ChevronLeft aria-hidden="true" size={36} strokeWidth={1} />
      </button>
      <div
        className="relative h-[85vh] w-[min(90vw,calc(85vh*0.875))]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image alt={image.alt} className="object-contain" fill sizes="90vw" src={image.src} />
      </div>
      <button
        aria-label="Next image"
        className={cn(navClass, 'right-2')}
        onClick={(e) => {
          e.stopPropagation()
          go(1)
        }}
        type="button"
      >
        <ChevronRight aria-hidden="true" size={36} strokeWidth={1} />
      </button>
      <p className="absolute bottom-4 text-sm text-white/70">
        {index + 1} / {images.length}
      </p>
    </div>
  )
}
