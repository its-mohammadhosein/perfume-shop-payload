import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AddToCart } from '@/components/product/AddToCart'
import { CollectionVideo } from '@/components/product/CollectionVideo'
import { ProductAttributes } from '@/components/product/ProductAttributes'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductNotes } from '@/components/product/ProductNotes'
import { SizeSwitcher } from '@/components/product/SizeSwitcher'
import { Carousel } from '@/components/ui/Carousel'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { Price } from '@/components/ui/Price'
import {
  collections,
  collectionVideoUrl,
  file,
  getProduct,
  getProductsByCollection,
  getSizes,
  products,
} from '@/data'
import { notFoundMetadata, pageMetadata } from '@/utilities/pageMetadata'

type Props = { params: Promise<{ slug: string }> }

const noteIcons = [
  file('2025/11/prf-infobox-1.svg'),
  file('2025/11/prf-infobox-2.svg'),
  file('2025/11/prf-infobox-3.svg'),
] as const

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return notFoundMetadata
  return pageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/product/${slug}`,
    image: product.images[0],
  })
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const collection = collections.find((c) => c.slug === product.collection)
  // Other products of the collection, 100ml first, excluding this fragrance
  const related = getProductsByCollection(product.collection)
    .filter((p) => p.fragranceSlug !== product.fragranceSlug)
    .sort((a, b) => Number(b.size === '100ml') - Number(a.size === '100ml'))
    .slice(0, 8)

  return (
    <Container className="pt-5 md:pt-[30px]">
      {/* Gallery | sticky summary */}
      <div className="mb-10 grid items-start gap-[30px] md:mb-[60px] md:grid-cols-2 lg:mb-20 lg:gap-[60px]">
        <ProductGallery images={product.images} name={product.name} video={product.video} />

        <div className="flex flex-col gap-[30px] lg:sticky lg:top-[100px]">
          <div>
            <Heading as="h1" className="mb-4" size="page">
              {product.name}
            </Heading>
            <p className="text-base md:text-lg">{product.shortDescription}</p>
          </div>
          <SizeSwitcher current={product.slug} sizes={getSizes(product.fragranceSlug)} />
          <Price amount={product.price} className="text-2xl" regular={product.regularPrice} />
          <AddToCart productName={product.name} />
          <ProductAttributes product={product} />
        </div>
      </div>

      {/* Collection story + notes */}
      {collection && (
        <section className="mb-10 md:mb-[60px] lg:mb-20">
          <Heading className="mb-5 md:mb-[25px]" size="section">
            {collection.name} Collection
          </Heading>
          <div className="mb-10">
            <CollectionVideo
              cover={collection.image}
              title={`${collection.name} Collection`}
              url={collectionVideoUrl}
            />
          </div>
          <p className="mb-10 max-w-[1000px] text-base md:text-lg">{product.description}</p>
          <ProductNotes icons={[...noteIcons]} notes={product.notes} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-section">
          <Carousel bordered slideClassName="basis-1/2 md:basis-1/4" title="From Collection">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Carousel>
        </section>
      )}
    </Container>
  )
}
