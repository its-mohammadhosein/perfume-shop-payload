'use client'

import React, { useRef } from 'react'

import { initMarquee } from '@/animations/marquee'
import { useAnimation } from '@/hooks/useAnimation'
import { cn } from '@/utilities/ui'

function Star({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 64 64">
      <path d="M32 64C31.0735 33.6838 30.3162 32.9312 0 32C30.3162 31.0735 31.0689 30.3162 32 0C32.9264 30.3162 33.6838 31.0689 64 32C33.6838 32.9312 32.9312 33.6746 32 64Z" />
    </svg>
  )
}

type MarqueeProps = {
  items: string[]
  /** Seconds per loop */
  duration?: number
  className?: string
}

export function Marquee({ items, duration = 45, className }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)
  useAnimation(ref, initMarquee, { duration })

  // Repeat the words so one copy is wider than the widest screen; the track holds two copies
  const copy = Array.from({ length: 4 }, () => items).flat()

  return (
    <div ref={ref} className={cn('overflow-hidden text-display font-medium text-heading', className)}>
      <p className="sr-only">{items.join(', ')}</p>
      <div aria-hidden="true" className="flex w-max will-change-transform" data-marquee-track>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {copy.map((item, i) => (
              <span key={i} className="flex items-center">
                <span className="px-[0.35em] whitespace-nowrap">{item}</span>
                <Star className="size-[0.55em] shrink-0 text-footer" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
