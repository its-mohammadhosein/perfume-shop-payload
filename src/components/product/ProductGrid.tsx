import type { Product } from '@/data/types'
import { cn } from '@/utilities/ui'

import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  /** Line above the first row (shop archive) */
  topBorder?: boolean
  /** Prioritise the first images (above the fold) */
  priorityCount?: number
  className?: string
}

/** Bordered product grid: 4 / 3 / 2 columns, no gap, 1px lines between cards. */
export function ProductGrid({
  products,
  topBorder = false,
  priorityCount = 0,
  className,
}: ProductGridProps) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 border-l border-line-card md:grid-cols-3 lg:grid-cols-4',
        topBorder && 'border-t',
        className,
      )}
    >
      {products.map((product, i) => (
        <li key={product.slug} className="border-r border-b border-line-card">
          <ProductCard priority={i < priorityCount} product={product} />
        </li>
      ))}
    </ul>
  )
}
