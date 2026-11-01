import Link from 'next/link'

import { formatPrice } from '@/components/ui/Price'
import { categories, olfactiveFamilies } from '@/data'
import type { Collection, Product } from '@/data/types'
import { cn } from '@/utilities/ui'

type FilterSidebarProps = {
  /** Products of the current archive; options and counts are derived from them */
  products: Product[]
  /** Fragrance collections from Payload */
  collections: Collection[]
  /** Hide the collection filter on a collection page */
  hideCollections?: boolean
  /** Active slugs, highlighted in the lists */
  active?: { category?: string; collection?: string; olfactive?: string }
}

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line px-[15px] py-[25px] last:border-b-0">
      <h2 className="mb-5 text-lg font-medium text-title md:text-xl">{title}</h2>
      {children}
    </section>
  )
}

function OptionList({
  options,
}: {
  options: { label: string; href: string; count?: number; active?: boolean }[]
}) {
  return (
    <ul className="max-h-[223px] space-y-2 overflow-y-auto">
      {options.map((o) => (
        <li key={o.href}>
          <Link
            className={cn(
              'flex items-center justify-between gap-3 text-base text-body hover:text-title',
              o.active && 'font-medium text-title',
            )}
            href={o.href}
          >
            <span>{o.label}</span>
            {o.count !== undefined && (
              <span className="min-w-[30px] border border-line px-1.5 text-center text-xs leading-5">
                {o.count}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/**
 * Static filter widgets (Category, Price, Collection, Olfactive family, Stock status).
 * Links navigate to the matching archive page; there is no query filtering yet.
 */
export function FilterSidebar({
  products,
  collections,
  hideCollections,
  active = {},
}: FilterSidebarProps) {
  const count = (pred: (p: Product) => boolean) => products.filter(pred).length
  const prices = products.map((p) => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)

  const categoryOptions = categories
    .filter((c) => count((p) => p.category === c.slug) > 0)
    .map((c) => ({
      label: c.name,
      href: `/shop?category=${c.slug}`,
      active: active.category === c.slug,
    }))

  const collectionOptions = collections
    .map((c) => ({
      label: c.name,
      href: `/collection/${c.slug}`,
      count: count((p) => p.collection === c.slug),
      active: active.collection === c.slug,
    }))
    .filter((o) => o.count > 0)
    .sort((a, b) => a.label.localeCompare(b.label))

  const olfactiveOptions = olfactiveFamilies
    .map((f) => ({
      label: f.name,
      href: `/olfactive-family/${f.slug}`,
      count: count((p) => p.olfactive.includes(f.slug)),
      active: active.olfactive === f.slug,
    }))
    .filter((o) => o.count > 0)

  return (
    <div>
      {categoryOptions.length > 0 && (
        <Widget title="Category">
          <OptionList options={categoryOptions} />
        </Widget>
      )}

      <Widget title="Filter by price">
        {/* Static range UI */}
        <div className="relative mb-4 h-[3px] bg-line">
          <span className="absolute inset-y-0 right-0 left-0 bg-primary" />
          <span className="absolute top-1/2 left-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white" />
          <span className="absolute top-1/2 right-0 size-3.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-body">
            Price: <span className="font-medium text-title">{formatPrice(min)}</span> —{' '}
            <span className="font-medium text-title">{formatPrice(max)}</span>
          </span>
          <button
            className="min-h-9 cursor-pointer bg-muted px-3.5 text-xs font-semibold text-title hover:bg-muted-hover"
            type="button"
          >
            Filter
          </button>
        </div>
      </Widget>

      {!hideCollections && collectionOptions.length > 0 && (
        <Widget title="Collection">
          <OptionList options={collectionOptions} />
        </Widget>
      )}

      {olfactiveOptions.length > 0 && (
        <Widget title="Olfactive family">
          <OptionList options={olfactiveOptions} />
        </Widget>
      )}

      <Widget title="Stock status">
        <ul className="space-y-2">
          {['On sale', 'In stock', 'On backorder'].map((label) => (
            <li key={label}>
              <label className="flex cursor-pointer items-center gap-2.5 text-base text-body hover:text-title">
                <input className="size-4 accent-primary" type="checkbox" />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </Widget>
    </div>
  )
}
