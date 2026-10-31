'use client'

import { useRef } from 'react'

import { initScrollTop } from '@/animations/scrollTop'
import { ChevronUp, ICON_STROKE } from '@/components/ui/Icon'
import { useAnimation } from '@/hooks/useAnimation'

export function ScrollToTop() {
  const ref = useRef<HTMLButtonElement>(null)
  useAnimation(ref, initScrollTop)

  return (
    <button
      ref={ref}
      aria-label="Scroll to top"
      className="pointer-events-none fixed right-5 bottom-5 z-30 flex size-[50px] cursor-pointer items-center justify-center rounded-full bg-white text-title opacity-0 shadow-[0_0_9px_rgb(0_0_0/10%)] transition-opacity duration-300 hover:text-body data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100"
      type="button"
    >
      <ChevronUp aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
    </button>
  )
}
