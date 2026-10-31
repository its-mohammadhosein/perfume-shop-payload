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
  /** `sides`: plain arrows outside the track, shown on hover at ≥1025px (related posts) */
  arrowPosition?: 'header' | 'sides'
  /** Overrides the default `text-section` title size */
  titleClassName?: string
  label?: string
  className?: string
  children: React.ReactNode
}

const arrowClass =
  'flex size-[35px] cursor-pointer items-center justify-center rounded-full border border-line bg-arrow text-title transition-opacity hover:text-body disabled:cursor-default disabled:opacity-40 md:size-[42px]'

// WoodMart "wd-pos-sep wd-hover-1": 50px arrows beside the track, sliding in on hover. Desktop only:
// below 1025px they would sit outside the viewport, and the track swipes there anyway.
const sideArrowClass =
  'absolute top-[calc(50%-25px)] z-10 hidden size-[50px] cursor-pointer items-center justify-center text-gray-800 transition-all hover:text-gray-500 disabled:cursor-default disabled:text-gray-400 group-data-[scrollable=false]/carousel:invisible lg:pointer-events-none lg:flex lg:opacity-0 lg:group-hover/carousel:pointer-events-auto lg:group-hover/carousel:translate-x-0 lg:group-hover/carousel:opacity-100'

export function Carousel({
  title,
  slideClassName,
  gapClassName,
  bordered = false,
  arrows = true,
  arrowPosition = 'header',
  titleClassName,
  label,
  className,
  children,
}: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null)
  useAnimation(ref, initCarousel)
  const sides = arrows && arrowPosition === 'sides'

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
          !title && (!arrows || sides) && 'hidden',
        )}
      >
        {title && (
          <Heading className={titleClassName} size={titleClassName ? 'none' : 'section'}>
            {title}
          </Heading>
        )}
        {/* Not rendered in `sides` mode: initCarousel binds the first prev/next it finds */}
        {!sides && (
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
        )}
      </div>

      <div className="relative">
        {sides && (
          <>
            <button
              aria-label="Previous"
              className={cn(sideArrowClass, 'right-full lg:translate-x-[-30px]')}
              data-carousel-prev
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={24} strokeWidth={ICON_STROKE} />
            </button>
            <button
              aria-label="Next"
              className={cn(sideArrowClass, 'left-full lg:translate-x-[30px]')}
              data-carousel-next
              type="button"
            >
              <ChevronRight aria-hidden="true" size={24} strokeWidth={ICON_STROKE} />
            </button>
          </>
        )}
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
    </div>
  )
}
