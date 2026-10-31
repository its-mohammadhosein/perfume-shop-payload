'use client'

import React, { useRef } from 'react'

import { initCardGallery } from '@/animations/cardGallery'
import { useAnimation } from '@/hooks/useAnimation'

/** Wraps the stacked card images and runs the hover image cycling. */
export function CardGallery({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useAnimation(ref, initCardGallery)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
