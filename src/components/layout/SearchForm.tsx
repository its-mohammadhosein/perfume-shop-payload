'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useId, useState } from 'react'

import { ICON_STROKE, Search } from '@/components/ui/Icon'
import { formatPrice } from '@/components/ui/Price'
import type { ImageAsset } from '@/data/types'
import { cn } from '@/utilities/ui'

export type SearchItem = {
  slug: string
  name: string
  price: number
  image: ImageAsset
}

type SearchFormProps = {
  items: SearchItem[]
  onNavigate?: () => void
  autoFocus?: boolean
  /** `bare`: borderless field filling its row (mobile menu) */
  variant?: 'boxed' | 'bare'
  className?: string
}

/** Product search with instant results (client-side filter over static data). */
export function SearchForm({
  items,
  onNavigate,
  autoFocus,
  variant = 'boxed',
  className,
}: SearchFormProps) {
  const id = useId()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results =
    q.length > 1 ? items.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 6) : []

  return (
    <div className={cn('text-title', className)}>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor={id} className="sr-only">
          Search for products
        </label>
        <input
          autoComplete="off"
          autoFocus={autoFocus}
          className={cn(
            'w-full bg-transparent pr-11 text-base outline-none',
            variant === 'boxed'
              ? 'h-[42px] border px-4 focus:border-line-focus'
              : 'h-[70px] border-0 px-5 font-medium placeholder:text-body',
          )}
          id={id}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          type="search"
          value={query}
        />
        <button
          aria-label="Search"
          className={cn(
            'absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center',
            variant === 'boxed' ? 'w-11' : 'w-[60px]',
          )}
          type="submit"
        >
          <Search
            aria-hidden="true"
            size={variant === 'boxed' ? 18 : 22}
            strokeWidth={ICON_STROKE}
          />
        </button>
      </form>

      {q.length > 1 && (
        <div className={variant === 'boxed' ? 'mt-3' : 'px-5 pb-3'} aria-live="polite">
          {results.length === 0 ? (
            <p className="py-3 text-sm text-body">No products found.</p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((item) => (
                <li key={item.slug}>
                  <Link
                    className="flex items-center gap-3 py-2.5 hover:text-title-hover"
                    href={`/product/${item.slug}`}
                    onClick={onNavigate}
                  >
                    <Image
                      alt=""
                      className="h-[57px] w-[50px] shrink-0 object-cover"
                      height={57}
                      sizes="50px"
                      src={item.image.src}
                      width={50}
                    />
                    <span className="flex-1 text-base font-medium">{item.name}</span>
                    <span className="text-sm text-body">{formatPrice(item.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
