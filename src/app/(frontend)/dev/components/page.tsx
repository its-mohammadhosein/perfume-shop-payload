import type { Metadata } from 'next'

import { PostCard } from '@/components/blog/PostCard'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Carousel } from '@/components/ui/Carousel'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Pagination } from '@/components/ui/Pagination'
import { Section } from '@/components/ui/Section'
import { getProductsBySlugs, newInSlugs, paginate, posts, products } from '@/data'

// Development playground for shared commerce and blog UI (Phase 3). Removed in Phase 10.
export const metadata: Metadata = { title: 'Components playground', robots: { index: false } }

export default function ComponentsPlayground() {
  const page = paginate(products, 1)

  return (
    <div className="pt-10">
      <Container>
        <Section>
          <Carousel bordered slideClassName="basis-1/2 md:basis-1/3" title="New In">
            {getProductsBySlugs(newInSlugs).map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(min-width: 769px) 33vw, 50vw" />
            ))}
          </Carousel>
        </Section>

        <Section>
          <Carousel
            gapClassName="gap-2.5 md:gap-5"
            slideClassName="basis-full md:basis-[calc((100%-40px)/3)]"
            title="Journal Articles"
          >
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Carousel>
        </Section>
      </Container>

      <Section>
        <Container>
          <Heading className="mb-6" size="section">
            Product grid
          </Heading>
        </Container>
        <ProductGrid priorityCount={4} products={page.items} topBorder />
        <Pagination
          className="mt-10"
          hrefFor={(p) => (p === 1 ? '/shop' : `/shop/page/${p}`)}
          page={1}
          totalPages={page.totalPages}
        />
      </Section>
    </div>
  )
}
