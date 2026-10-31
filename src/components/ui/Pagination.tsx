import Link from 'next/link'

import { cn } from '@/utilities/ui'

import { ChevronRight, ICON_STROKE } from './Icon'

type PaginationProps = {
  page: number
  totalPages: number
  /** Builds the URL of a page, e.g. 1 -> "/shop", 2 -> "/shop/page/2" */
  hrefFor: (page: number) => string
  className?: string
}

const itemClass =
  'inline-flex h-[34px] min-w-[34px] items-center justify-center px-[5px] text-sm font-semibold text-gray-900 transition-colors'

export function Pagination({ page, totalPages, hrefFor, className }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className={cn('flex justify-center', className)}>
      <ul className="flex items-center gap-1">
        {pages.map((p) => (
          <li key={p}>
            {p === page ? (
              <span aria-current="page" className={cn(itemClass, 'bg-primary text-white')}>
                {p}
              </span>
            ) : (
              <Link className={cn(itemClass, 'hover:bg-muted')} href={hrefFor(p)}>
                {p}
              </Link>
            )}
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link
              aria-label="Next page"
              className={cn(itemClass, 'hover:bg-muted')}
              href={hrefFor(page + 1)}
            >
              <ChevronRight aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
