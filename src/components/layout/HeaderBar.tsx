'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useRef, useState } from 'react'

import { initStickyHeader } from '@/animations/stickyHeader'
import { Container } from '@/components/ui/Container'
import { ChevronDown, ICON_STROKE, Menu, Search, ShoppingCart } from '@/components/ui/Icon'
import type { FileAsset, MobileNavItem, NavItem } from '@/data/types'
import { useAnimation } from '@/hooks/useAnimation'
import { cn } from '@/utilities/ui'

import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { SearchForm, type SearchItem } from './SearchForm'
import { SideCart } from './SideCart'

export type HeaderBarProps = {
  /** Transparent header over the home hero */
  overlap: boolean
  nav: NavItem[]
  mobileNav: MobileNavItem[]
  logos: { white: FileAsset; black: FileAsset }
  searchItems: SearchItem[]
}

type Panel = 'menu' | 'cart' | 'search' | null

const toolClass =
  'relative flex cursor-pointer items-center gap-2 text-lg font-medium text-title transition-colors hover:text-title-hover header-light:text-white header-light:hover:text-white/70'

function Count({ value }: { value: number }) {
  return <span>{value}</span>
}

function Logo({ logos }: { logos: HeaderBarProps['logos'] }) {
  const common = 'h-auto w-[150px] lg:w-[240px]'
  return (
    <Link aria-label="Perfumes home" className="block" href="/">
      <Image
        alt=""
        className={cn(common, 'hidden header-light:block')}
        height={30}
        priority
        src={logos.white.src}
        unoptimized
        width={276}
      />
      <Image
        alt=""
        className={cn(common, 'header-light:hidden')}
        height={30}
        priority
        src={logos.black.src}
        unoptimized
        width={276}
      />
    </Link>
  )
}

export function HeaderBar({ overlap, nav, mobileNav, logos, searchItems }: HeaderBarProps) {
  const ref = useRef<HTMLElement>(null)
  useAnimation(ref, initStickyHeader)

  const [panel, setPanel] = useState<Panel>(null)
  const [megaOpen, setMegaOpen] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const megaToggle = useRef<HTMLButtonElement>(null)

  const closePanel = useCallback(() => setPanel(null), [])
  const toggle = (p: Panel) => setPanel((current) => (current === p ? null : p))

  // Hover intent: small delay so the menu doesn't flicker when the pointer passes over
  const openMega = () => {
    clearTimeout(megaTimer.current)
    megaTimer.current = setTimeout(() => setMegaOpen(true), 80)
  }
  const closeMega = () => {
    clearTimeout(megaTimer.current)
    megaTimer.current = setTimeout(() => setMegaOpen(false), 150)
  }

  return (
    <>
      <header
        ref={ref}
        className={cn(
          'absolute inset-x-0 top-0 z-40 transition-transform duration-300',
          'data-[sticky=true]:fixed data-[sticky=true]:bg-white data-[sticky=true]:shadow-[0_0_9px_rgb(0_0_0/10%)]',
          'data-[hidden=true]:-translate-y-full',
          !overlap && 'bg-white',
        )}
        data-header-tone={overlap ? 'light' : 'dark'}
        data-overlap={overlap}
      >
        <Container>
          <div className="flex h-(--header-h) items-center border-b-2 border-primary header-light:border-white lg:h-(--header-h-lg)">
            {/* Mobile: menu | logo | cart */}
            <div className="flex flex-1 lg:hidden">
              <button
                aria-expanded={panel === 'menu'}
                aria-label="Open menu"
                className={toolClass}
                onClick={() => toggle('menu')}
                type="button"
              >
                <Menu aria-hidden="true" size={24} strokeWidth={ICON_STROKE} />
              </button>
            </div>

            {/* Logo and tools columns share the free space so the nav sits at the page centre */}
            <div className="flex flex-1 justify-center lg:justify-start">
              <Logo logos={logos} />
            </div>

            {/* Desktop navigation */}
            <nav aria-label="Main" className="hidden justify-center lg:flex">
              <ul className="flex items-center">
                {nav.map((item) =>
                  item.megaMenu ? (
                    <li
                      key={item.href}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) setMegaOpen(false)
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Escape' || !megaOpen) return
                        setMegaOpen(false)
                        megaToggle.current?.focus()
                      }}
                      onMouseEnter={openMega}
                      onMouseLeave={closeMega}
                    >
                      {/* Keyboard: Tab passes the closed menu; the toggle (shown on focus) opens it */}
                      <div className="relative" onMouseEnter={openMega}>
                        <NavLink
                          active={megaOpen}
                          hasDropdown
                          href={item.href}
                          label={item.label}
                        />
                        <button
                          ref={megaToggle}
                          aria-controls="mega-menu"
                          aria-expanded={megaOpen}
                          className="sr-only cursor-pointer focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-2 focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:bg-white focus-visible:px-2 focus-visible:text-xs focus-visible:whitespace-nowrap focus-visible:text-title"
                          onClick={() => setMegaOpen((open) => !open)}
                          type="button"
                        >
                          {item.label} menu
                        </button>
                      </div>
                      {/* Dims the page while the mega menu is open. It sits inside the <li>, so the
                          pointer reaching it is the "left the menu" signal (no mouseleave fires). */}
                      <div
                        aria-hidden="true"
                        className={cn(
                          'fixed inset-0 -z-10 bg-black/40 transition-opacity duration-250',
                          megaOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                        )}
                        onClick={() => setMegaOpen(false)}
                        onMouseEnter={closeMega}
                      />
                      <div
                        onMouseEnter={openMega}
                        className={cn(
                          'absolute top-[calc(100%-10px)] left-1/2 w-[min(1320px,calc(100vw-30px))] -translate-x-1/2 bg-white text-title transition-[opacity,translate] duration-250',
                          megaOpen
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-[15px] opacity-0',
                        )}
                        id="mega-menu"
                        inert={!megaOpen}
                      >
                        <MegaMenu menu={item.megaMenu} onNavigate={() => setMegaOpen(false)} />
                      </div>
                    </li>
                  ) : (
                    <li key={item.href}>
                      <NavLink href={item.href} label={item.label} />
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* Tools */}
            <div className="flex flex-1 items-center justify-end gap-[25px]">
              <div className="relative hidden lg:block">
                <button
                  aria-expanded={panel === 'search'}
                  className={toolClass}
                  onClick={() => toggle('search')}
                  type="button"
                >
                  <Search aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
                  Search
                </button>
                {panel === 'search' && (
                  <div className="absolute top-[calc(100%+30px)] right-0 w-[400px] border border-line bg-white p-5">
                    <SearchForm autoFocus items={searchItems} onNavigate={closePanel} />
                  </div>
                )}
              </div>
              <Link className={cn(toolClass, 'hidden lg:flex')} href="/wishlist">
                Wishlist
                <Count value={0} />
              </Link>
              <button
                aria-expanded={panel === 'cart'}
                className={cn(toolClass, 'hidden lg:flex')}
                onClick={() => toggle('cart')}
                type="button"
              >
                Cart
                <Count value={0} />
              </button>
              <button
                aria-label="Open cart"
                className={cn(toolClass, 'lg:hidden')}
                onClick={() => toggle('cart')}
                type="button"
              >
                <ShoppingCart aria-hidden="true" size={22} strokeWidth={ICON_STROKE} />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        items={mobileNav}
        onClose={closePanel}
        open={panel === 'menu'}
        searchItems={searchItems}
      />
      <SideCart onClose={closePanel} open={panel === 'cart'} />
    </>
  )
}

type NavLinkProps = { href: string; label: string; active?: boolean; hasDropdown?: boolean }

function NavLink({ href, label, active, hasDropdown }: NavLinkProps) {
  return (
    <Link
      className={cn(
        'flex h-(--header-h-lg) items-center gap-1 px-[15px] text-lg font-medium text-title transition-colors hover:text-title-hover header-light:text-white header-light:hover:text-white/70',
        active && 'text-title-hover header-light:text-white/70',
      )}
      href={href}
    >
      {label}
      {hasDropdown && <ChevronDown aria-hidden="true" size={12} strokeWidth={ICON_STROKE} />}
    </Link>
  )
}
