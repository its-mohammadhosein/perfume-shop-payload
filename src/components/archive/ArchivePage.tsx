import { ProductGrid } from '@/components/product/ProductGrid'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Pagination } from '@/components/ui/Pagination'
import { paginate } from '@/data'
import type { Product } from '@/data/types'
import { getFragranceCollections } from '@/shop/queries'

import { FilterSidebar } from './FilterSidebar'
import { ShopFilters } from './ShopFilters'

type ArchivePageProps = {
  title: string
  description: string
  /** All products of this archive (before pagination) */
  products: Product[]
  page?: number
  /** URL of a given page of this archive */
  hrefFor: (page: number) => string
  filters?: React.ComponentProps<typeof FilterSidebar>['active']
  hideCollectionFilter?: boolean
}

/**
 * Shop / collection / olfactive-family archive: title + "Filters" toggle, description, then a
 * full-width grey band holding the bordered product grid and pagination (12 per page).
 */
export async function ArchivePage({
  title,
  description,
  products,
  page = 1,
  hrefFor,
  filters,
  hideCollectionFilter,
}: ArchivePageProps) {
  const { items, totalPages } = paginate(products, page)
  const collections = await getFragranceCollections()

  return (
    <>
      <Container className="pt-5 md:pt-[30px]">
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5">
          <Heading as="h1" className="mb-0" size="page">
            {title}
          </Heading>
          <ShopFilters>
            <FilterSidebar
              active={filters}
              collections={collections}
              hideCollections={hideCollectionFilter}
              products={products}
            />
          </ShopFilters>
        </div>
        <p className="mt-4 mb-[25px] max-w-[1000px] text-base md:text-lg">{description}</p>
      </Container>

      <section aria-label={`${title} products`} className="bg-band pb-5">
        {items.length > 0 ? (
          <ProductGrid priorityCount={4} products={items} topBorder />
        ) : (
          <p className="py-20 text-center">No products were found matching your selection.</p>
        )}
        <Pagination className="mt-5" hrefFor={hrefFor} page={page} totalPages={totalPages} />
      </section>
    </>
  )
}
