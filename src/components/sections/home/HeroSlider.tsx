'use client'

import Image from 'next/image'
import { useRef } from 'react'

import { initHeroSlider } from '@/animations/heroSlider'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from '@/components/ui/Icon'
import type { HeroSlide } from '@/data/types'
import { useAnimation } from '@/hooks/useAnimation'

/** Full-height crossfade hero under the transparent header. */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const ref = useRef<HTMLElement>(null)
  useAnimation(ref, initHeroSlider, { interval: 5000 })

  return (
    <section
      ref={ref}
      aria-label="Featured fragrances"
      aria-roledescription="carousel"
      className="relative mb-section min-h-svh overflow-hidden"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          aria-label={`${i + 1} of ${slides.length}`}
          aria-roledescription="slide"
          className="group/slide absolute inset-0 opacity-0 transition-opacity duration-700 data-[active=true]:z-10 data-[active=true]:opacity-100"
          data-active={i === 0}
          data-slide
          role="group"
          style={{ backgroundColor: slide.backgroundColor }}
        >
          <Image
            alt={slide.background.alt}
            className="object-cover"
            fill
            priority={i === 0}
            sizes="100vw"
            src={slide.background.src}
          />
          <div className="relative flex h-full flex-col items-center justify-end px-[15px] pt-[100px] pb-[100px] text-center lg:pt-[120px]">
            <div className="flex translate-y-5 flex-col items-center opacity-0 transition duration-700 group-data-[active=true]/slide:translate-y-0 group-data-[active=true]/slide:opacity-100 group-data-[active=true]/slide:delay-200">
              <Image
                alt=""
                className="mb-6 h-auto w-[120px] md:w-[140px]"
                height={slide.bottle.height}
                priority={i === 0}
                src={slide.bottle.src}
                width={slide.bottle.width}
              />
              <h2 className="mb-[30px] max-w-[506px] text-hero text-white lg:max-w-[660px]">
                {slide.title}
              </h2>
              <Button href={slide.cta.href} size="lg">
                {slide.cta.label}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button
        aria-label="Previous slide"
        className="absolute top-1/2 left-2.5 z-20 hidden -translate-y-1/2 cursor-pointer p-2 text-white hover:text-white/70 lg:block"
        data-slide-prev
        type="button"
      >
        <ChevronLeft aria-hidden="true" size={28} strokeWidth={1.25} />
      </button>
      <button
        aria-label="Next slide"
        className="absolute top-1/2 right-2.5 z-20 hidden -translate-y-1/2 cursor-pointer p-2 text-white hover:text-white/70 lg:block"
        data-slide-next
        type="button"
      >
        <ChevronRight aria-hidden="true" size={28} strokeWidth={1.25} />
      </button>

      {/* "01 ——  02 —  03 —" pagination */}
      <div className="absolute inset-x-0 bottom-[25px] z-20 flex justify-center gap-[30px]">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            aria-label={`Show slide ${i + 1}`}
            className="group/dot flex cursor-pointer items-center gap-1.5 text-lg font-semibold text-white"
            data-active={i === 0}
            data-slide-dot
            type="button"
          >
            {String(i + 1).padStart(2, '0')}
            <span className="h-[2px] w-5 bg-current transition-[width] duration-500 group-data-[active=true]/dot:w-14" />
          </button>
        ))}
      </div>
    </section>
  )
}
