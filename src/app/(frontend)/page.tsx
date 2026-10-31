import { PostCard } from '@/components/blog/PostCard'
import { ProductCard } from '@/components/product/ProductCard'
import { CollectionBanners } from '@/components/sections/home/CollectionBanners'
import { FeaturedFragrances } from '@/components/sections/home/FeaturedFragrances'
import { HeroSlider } from '@/components/sections/home/HeroSlider'
import { OlfactoryFamilies } from '@/components/sections/home/OlfactoryFamilies'
import { PromoTabs } from '@/components/sections/home/PromoTabs'
import { InstagramStrip } from '@/components/sections/InstagramStrip'
import { Marquee } from '@/components/sections/Marquee'
import { Carousel } from '@/components/ui/Carousel'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import {
  collectionBanners,
  featureCards,
  getProductsBySlugs,
  heroSlides,
  homeOlfactiveFamilies,
  instagram,
  marqueeWords,
  newInSlugs,
  posts,
  promoSlugs,
} from '@/data'
import type { Product } from '@/data/types'

function ProductCarousel({ products, perView }: { products: Product[]; perView: 3 | 4 }) {
  return (
    <Carousel
      arrows={false}
      bordered
      label="Products"
      slideClassName={
        perView === 4 ? 'basis-1/2 md:basis-1/3 lg:basis-1/4' : 'basis-1/2 md:basis-1/3'
      }
    >
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </Carousel>
  )
}

export default function HomePage() {
  const promo = getProductsBySlugs(promoSlugs)

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <Container>
        <Section>
          <Carousel bordered slideClassName="basis-1/2 md:basis-1/3" title="New In">
            {getProductsBySlugs(newInSlugs).map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(min-width: 769px) 33vw, 50vw" />
            ))}
          </Carousel>
        </Section>

        <Section>
          <OlfactoryFamilies families={homeOlfactiveFamilies} />
        </Section>
      </Container>

      <Section>
        <Marquee items={marqueeWords} />
      </Section>

      <Container>
        <Section>
          <FeaturedFragrances cards={featureCards} />
        </Section>

        <Section>
          <PromoTabs
            tabs={[
              { label: 'All', content: <ProductCarousel perView={4} products={promo} /> },
              {
                label: 'For Her',
                content: (
                  <ProductCarousel perView={4} products={promo.filter((p) => p.gender === 'her')} />
                ),
              },
              {
                label: 'For Him',
                content: (
                  <ProductCarousel perView={4} products={promo.filter((p) => p.gender === 'him')} />
                ),
              },
            ]}
            title="Promotional Offers"
          />
        </Section>

        <Section>
          <CollectionBanners banners={collectionBanners} />
        </Section>

        <Section>
          <Carousel
            gapClassName="gap-2.5 md:gap-5"
            slideClassName="basis-full md:basis-[calc((100%-40px)/3)]"
            title="Journal Articles"
          >
            {posts.slice(0, 5).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </Carousel>
        </Section>

        <InstagramStrip className="pb-[45px]" {...instagram} />
      </Container>
    </>
  )
}
