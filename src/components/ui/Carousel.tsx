'use client'

import React, { Children, useRef } from 'react'

import { initCarousel } from '@/animations/carousel'
import { useAnimation } from '@/hooks/useAnimation'
import { cn } from '@/utilities/ui'

import { Heading } from './Heading'
import { ChevronLeft, ChevronRight, ICON_STROKE } from './Icon'

type CarouselProps = {
  /** Section title shown left of the arrows */
  title?: React.ReactNode
  /** Width of each slide per breakpoint, e.g. "basis-1/2 lg:basis-1/3" */
  slideClassName: string
  /** Gap between slides, e.g. "gap-2.5 lg:gap-5" (none for bordered product carousels) */
  gapClassName?: string
  /** Product-grid style 1px lines around slides */
  bordered?: boolean
  /** Hide the arrow header (navigation by drag/swipe only) */
  arrows?: boolean
  label?: string
  className?: string
  children: React.ReactNode
}

const arrowClass =
  'flex size-[35px] cursor-pointer items-center justify-center rounded-full border border-line bg-arrow text-title transition-opacity hover:text-body disabled:cursor-default disabled:opacity-40 md:size-[42px]'

export function Carousel({
  title,
  slideClassName,
  gapClassName,
  bordered = false,
  arrows = true,
  label,
  className,
  children,
}: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null)
  useAnimation(ref, initCarousel)

  return (
    <div
      ref={ref}
      aria-label={label ?? (typeof title === 'string' ? title : undefined)}
      aria-roledescription="carousel"
      className={cn('group/carousel', className)}
      role="region"
    >
      <div
        className={cn(
          'mb-5 flex items-center justify-between gap-5 md:mb-[25px]',
          !title && !arrows && 'hidden',
        )}
      >
        {title && <Heading size="section">{title}</Heading>}
        <div
          className={cn(
            'ml-auto flex shrink-0 gap-2.5 group-data-[scrollable=false]/carousel:invisible',
            !arrows && 'hidden',
          )}
        >
          <button aria-label="Previous" className={arrowClass} data-carousel-prev type="button">
            <ChevronLeft aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
          </button>
          <button aria-label="Next" className={arrowClass} data-carousel-next type="button">
            <ChevronRight aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
          </button>
        </div>
      </div>

      <ul
        className={cn(
          'scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain',
          bordered && 'border-t border-l border-line-card',
          gapClassName,
        )}
        data-carousel-track
      >
        {Children.map(children, (child) => (
          <li
            className={cn(
              'shrink-0 snap-start',
              bordered && 'border-r border-b border-line-card',
              slideClassName,
            )}
          >
            {child}
          </li>
        ))}
      </ul>
    </div>
  )
}
