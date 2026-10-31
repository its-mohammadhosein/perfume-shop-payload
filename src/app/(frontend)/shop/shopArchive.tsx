import { ArchivePage } from '@/components/archive/ArchivePage'
import { categories, products } from '@/data'
import type { CategorySlug } from '@/data/types'

export const SHOP_DESCRIPTION =
  'These perfumes give you a sense of confidence and uniqueness that’s impossible to ignore.'

/** Shared by /shop and /shop/page/[n]; `?category=` narrows to men's or women's fragrances. */
export function ShopArchive({ page, category }: { page: number; category?: string }) {
  const activeCategory = categories.find((c) => c.slug === category)
  const list = activeCategory
    ? products.filter((p) => p.category === (activeCategory.slug as CategorySlug))
    : products
  const query = activeCategory ? `?category=${activeCategory.slug}` : ''

  return (
    <ArchivePage
      description={SHOP_DESCRIPTION}
      filters={{ category: activeCategory?.slug }}
      hrefFor={(p) => (p === 1 ? `/shop${query}` : `/shop/page/${p}${query}`)}
      page={page}
      products={list}
      title={activeCategory?.name ?? 'Perfumes'}
    />
  )
}
