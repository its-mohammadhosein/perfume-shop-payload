'use client'

import { usePathname } from 'next/navigation'

import { HeaderBar, type HeaderBarProps } from './HeaderBar'

type HeaderProps = Omit<HeaderBarProps, 'overlap'>

/**
 * Picks the header variant from the route. The bar is keyed by variant so the sticky module
 * re-initialises when navigating between the home page (overlap) and other pages (solid).
 */
export function HeaderSwitch(props: HeaderProps) {
  const overlap = usePathname() === '/'
  return (
    // Reserves the header height on solid pages; the overlap header floats over the hero
    <div className={overlap ? 'relative' : 'relative h-[72px] lg:h-[92px]'}>
      <HeaderBar key={overlap ? 'overlap' : 'solid'} overlap={overlap} {...props} />
    </div>
  )
}
