'use client'

import React, { useId, useState } from 'react'

import { Heading } from '@/components/ui/Heading'
import { cn } from '@/utilities/ui'

type PromoTabsProps = {
  title: string
  /** Panels are rendered on the server; this component only switches between them */
  tabs: { label: string; content: React.ReactNode }[]
}

/** "Promotional Offers": title on the left, text tabs on the right (WoodMart "alt" design). */
export function PromoTabs({ title, tabs }: PromoTabsProps) {
  const id = useId()
  const [active, setActive] = useState(0)

  // WAI-ARIA tabs: arrows / Home / End move between tabs; only the active tab is in the Tab order
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = tabs.length - 1
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const index = next > last ? 0 : next < 0 ? last : next
    setActive(index)
    document.getElementById(`${id}-tab-${index}`)?.focus()
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 md:mb-[25px]">
        <Heading size="section">{title}</Heading>
        <div aria-label={title} className="flex gap-[30px]" onKeyDown={onKeyDown} role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              aria-controls={`${id}-panel-${i}`}
              aria-selected={i === active}
              className={cn(
                'cursor-pointer border-b-2 pb-0.5 text-base font-medium capitalize transition-colors md:text-lg',
                i === active
                  ? 'border-heading text-heading'
                  : 'border-transparent text-body hover:text-heading',
              )}
              id={`${id}-tab-${i}`}
              onClick={() => setActive(i)}
              role="tab"
              tabIndex={i === active ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          aria-labelledby={`${id}-tab-${i}`}
          className={cn('animate-[fade-in_0.4s_ease]', i !== active && 'hidden')}
          id={`${id}-panel-${i}`}
          role="tabpanel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
