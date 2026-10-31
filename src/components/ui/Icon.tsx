// UI icons (replaces the proprietary woodmart-font). Import icons from here, not from lucide-react directly,
// so the icon set can be swapped in one place.
export {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Facebook,
  Heart,
  Instagram,
  Menu,
  Minus,
  Play,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Shuffle,
  Twitter,
  User,
  X,
  Youtube,
} from 'lucide-react'

import { type WdGlyph, wdGlyphs } from './wdGlyphs'

export type { LucideIcon as IconType, LucideProps as IconProps } from 'lucide-react'

/** Default stroke width for the thin WoodMart-like look */
export const ICON_STROKE = 1.5

/** Icon drawn from a woodmart-font glyph (brand marks and the few shapes Lucide lacks) */
export function WdIcon({ name, className }: { name: WdGlyph; className?: string }) {
  const { width, path } = wdGlyphs[name]
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox={`0 0 ${width} 1024`}>
      <path d={path} />
    </svg>
  )
}
