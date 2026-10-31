import Link from 'next/link'
import { Fragment } from 'react'

import { collections, olfactiveFamilies } from '@/data'
import type { Product } from '@/data/types'

/** Bordered attribute list: Collection, Olfactive Family, Perfume (for him / for her). */
export function ProductAttributes({ product }: { product: Product }) {
  const collection = collections.find((c) => c.slug === product.collection)
  const rows = [
    {
      label: 'Collection',
      values: collection ? [{ name: collection.name, href: `/collection/${collection.slug}` }] : [],
    },
    {
      label: 'Olfactive Family',
      values: product.olfactive.map((slug) => ({
        name: olfactiveFamilies.find((f) => f.slug === slug)?.name ?? slug,
        href: `/olfactive-family/${slug}`,
      })),
    },
    {
      label: 'Perfume',
      values: [
        {
          name: product.gender === 'her' ? 'For Her' : 'For Him',
          href: `/shop?category=${product.category}`,
        },
      ],
    },
  ]

  return (
    <dl className="w-full max-w-[640px] border-t border-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-b border-line py-3"
        >
          <dt className="text-lg font-medium text-title">{row.label}</dt>
          <dd className="text-base">
            {row.values.map((v, i) => (
              <Fragment key={v.href}>
                {i > 0 && ', '}
                <Link className="text-body hover:text-title" href={v.href}>
                  {v.name}
                </Link>
              </Fragment>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}
