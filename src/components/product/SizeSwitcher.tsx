import Link from 'next/link'

import type { Product } from '@/data/types'
import { cn } from '@/utilities/ui'

const label: Record<Product['size'], string> = {
  '100ml': '100ml',
  '50ml': '50ml',
  '2ml': '2ml Sample',
}

/**
 * "Size" linked variations: each size is its own product, so the swatches are links.
 * Text swatch style 2: 45px tall, 1px inset border, 2px dark border when active.
 */
export function SizeSwitcher({ sizes, current }: { sizes: Product[]; current: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
      <span className="text-lg font-medium text-title">Size</span>
      <ul className="flex flex-wrap gap-2.5">
        {sizes.map((p) => {
          const active = p.slug === current
          return (
            <li key={p.slug}>
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex h-[45px] min-w-[45px] items-center justify-center px-[9px] text-base font-semibold text-gray-900 transition-shadow',
                  active
                    ? 'shadow-[inset_0_0_0_2px_var(--color-gray-900)]'
                    : 'shadow-[inset_0_0_0_1px_var(--color-line-card)] hover:shadow-[inset_0_0_0_1px_var(--color-gray-900)]',
                )}
                href={`/product/${p.slug}`}
                scroll={false}
              >
                {label[p.size]}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
