'use client'

import React, { useCallback, useState } from 'react'

import { OffCanvas } from '@/components/layout/OffCanvas'
import { ICON_STROKE, Menu } from '@/components/ui/Icon'

/** "Filters" button that opens the filter sidebar from the right (as in the html base). */
export function ShopFilters({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2 text-lg font-semibold text-title hover:text-title-hover"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
        Filters
      </button>
      <OffCanvas
        className="w-[340px] lg:w-[440px]"
        onClose={close}
        open={open}
        side="right"
        title="Filters"
      >
        {children}
      </OffCanvas>
    </>
  )
}
