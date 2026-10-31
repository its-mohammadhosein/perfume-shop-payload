'use client'

import Link from 'next/link'
import React, { useCallback, useState } from 'react'

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ICON_STROKE,
  Shuffle,
  User,
  type IconType,
} from '@/components/ui/Icon'
import type { MobileNavItem } from '@/data/types'
import { cn } from '@/utilities/ui'

import { OffCanvas } from './OffCanvas'
import { SearchForm, type SearchItem } from './SearchForm'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
  items: MobileNavItem[]
  searchItems: SearchItem[]
}

const icons: Record<NonNullable<MobileNavItem['icon']>, IconType> = {
  wishlist: Heart,
  compare: Shuffle,
  account: User,
}

const linkClass =
  'flex min-h-[50px] w-full items-center gap-2 border-b border-line px-5 text-sm font-semibold text-title'

/** Drill-down menu: sub-panels slide in from the right (CSS transition). */
export function MobileMenu({ open, onClose, items, searchItems }: MobileMenuProps) {
  const [submenu, setSubmenu] = useState<MobileNavItem | null>(null)

  const close = useCallback(() => {
    onClose()
    setSubmenu(null)
  }, [onClose])

  return (
    <OffCanvas bare className="w-[300px]" onClose={close} open={open} side="left" title="Menu">
      <div className="relative z-10 shadow-[0_2px_8px_rgb(0_0_0/8%)]">
        <SearchForm items={searchItems} onNavigate={close} variant="bare" />
      </div>

      <nav aria-label="Mobile" className="relative overflow-hidden">
        <ul
          className={cn('transition-transform duration-300', submenu && '-translate-x-full')}
          inert={Boolean(submenu)}
        >
          {items.map((item) => {
            const Icon = item.icon && icons[item.icon]
            return (
              <li key={item.href} className="flex">
                <Link className={linkClass} href={item.href} onClick={close}>
                  {Icon && <Icon aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />}
                  {item.label}
                </Link>
                {item.children && (
                  <button
                    aria-label={`Open ${item.label} submenu`}
                    className="flex w-[50px] shrink-0 cursor-pointer items-center justify-center border-b border-l border-line"
                    onClick={() => setSubmenu(item)}
                    type="button"
                  >
                    <ChevronRight aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        <ul
          className={cn(
            'absolute inset-0 bg-white transition-transform duration-300',
            !submenu && 'translate-x-full',
          )}
          inert={!submenu}
        >
          <li>
            <button
              className={cn(linkClass, 'cursor-pointer bg-muted')}
              onClick={() => setSubmenu(null)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
              Back
            </button>
          </li>
          {submenu?.children?.map((child) => (
            <li key={child.href}>
              <Link className={linkClass} href={child.href} onClick={close}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </OffCanvas>
  )
}
