import Image from 'next/image'
import Link from 'next/link'

import type { MegaMenuColumn, NavItem } from '@/data/types'

type MegaMenuProps = {
  menu: NonNullable<NavItem['megaMenu']>
  onNavigate: () => void
}

function LinkColumn({ column, onNavigate }: { column: MegaMenuColumn; onNavigate: () => void }) {
  return (
    <div>
      <Link
        className="mb-3 block text-xl font-semibold text-title capitalize hover:text-title-hover"
        href={column.title.href}
        onClick={onNavigate}
      >
        {column.title.label}
      </Link>
      <ul className="space-y-2">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              className="text-lg text-body hover:text-title"
              href={link.href}
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * "Fragrances" dropdown: all columns but the last stacked, the last column, and the featured
 * collection card (left out when none is chosen in the Header global).
 */
export function MegaMenu({ menu, onNavigate }: MegaMenuProps) {
  const { columns, featured } = menu
  const stacked = columns.slice(0, -1)
  const last = columns.at(-1)

  return (
    <div className="grid grid-cols-3 gap-[30px] px-[60px] py-10">
      <div className="space-y-5">
        {stacked.map((col) => (
          <LinkColumn key={col.title.label} column={col} onNavigate={onNavigate} />
        ))}
      </div>
      {last && <LinkColumn column={last} onNavigate={onNavigate} />}

      {featured && (
        <Link
          className="group/card relative flex h-[300px] items-end justify-center overflow-hidden p-[25px] text-center text-white"
          href={featured.href}
          onClick={onNavigate}
        >
          <Image
            alt={featured.image.alt}
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            fill
            sizes="400px"
            src={featured.image.src}
          />
          <span className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          <span className="relative">
            <span className="mb-2 block text-[28px] leading-[1.2] font-medium">
              {featured.title}
            </span>
            <span className="block text-sm leading-[1.5] text-white/90">{featured.text}</span>
          </span>
        </Link>
      )}
    </div>
  )
}
