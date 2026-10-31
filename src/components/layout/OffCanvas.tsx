'use client'

import React, { useEffect, useRef } from 'react'

import { ICON_STROKE, X } from '@/components/ui/Icon'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cn } from '@/utilities/ui'

type OffCanvasProps = {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  /** Accessible name, shown in the panel header */
  title: string
  /** Hide the title + close bar (mobile menu: closes via overlay or Escape) */
  bare?: boolean
  className?: string
  children: React.ReactNode
}

/** Slide-in side panel (cart, mobile menu, shop filters). Slide is a CSS transition. */
export function OffCanvas({
  open,
  onClose,
  side = 'right',
  title,
  bare = false,
  className,
  children,
}: OffCanvasProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('button, a, input')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.style.overflow = overflow
      previous?.focus()
    }
  }, [open, onClose])

  return (
    <div className="contents">
      <div
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-50 bg-black/70 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        aria-label={title}
        aria-modal="true"
        className={cn(
          'fixed top-0 bottom-0 z-50 flex w-[340px] max-w-[85vw] flex-col bg-white text-title transition-transform duration-300',
          side === 'right' ? 'right-0' : 'left-0',
          !open && (side === 'right' ? 'translate-x-full' : '-translate-x-full'),
          className,
        )}
        inert={!open}
        role="dialog"
      >
        {!bare && (
          <div className="flex min-h-[73px] items-center justify-between border-b border-line px-[15px]">
            <span className="text-[22px] font-medium text-heading">{title}</span>
            <button
              className="flex cursor-pointer items-center gap-1.5 text-[17px] font-semibold text-title hover:text-body"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
              Close
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
