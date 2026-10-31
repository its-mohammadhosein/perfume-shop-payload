'use client'

import React, { useId, useRef } from 'react'

import { initAccordion } from '@/animations/accordion'
import { useAnimation } from '@/hooks/useAnimation'

type AccordionProps = {
  items: { title: string; content: React.ReactNode }[]
  className?: string
}

/**
 * WoodMart accordion "simple" style: 20px questions, plus opener on the right, 1px separators
 * between items, 20px spacing. All items start closed, as in the source.
 */
export function Accordion({ items, className }: AccordionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useAnimation(ref, initAccordion)

  return (
    <div ref={ref} className={className}>
      {items.map((item, i) => (
        <div key={i} className="group/acc border-line-soft not-first:border-t" data-accordion-item>
          <h3 className="text-xl leading-[1.4] font-medium">
            <button
              aria-controls={`${id}-${i}`}
              aria-expanded="false"
              className="flex w-full cursor-pointer items-center justify-between gap-2.5 py-5 text-start text-heading"
              data-accordion-trigger
              type="button"
            >
              {item.title}
              {/* Plus; the vertical bar turns flat (minus) while open */}
              <span aria-hidden="true" className="relative size-4 shrink-0 text-gray-300">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform group-data-open/acc:rotate-90" />
              </span>
            </button>
          </h3>
          <div hidden data-accordion-panel id={`${id}-${i}`}>
            <div className="pb-5">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
