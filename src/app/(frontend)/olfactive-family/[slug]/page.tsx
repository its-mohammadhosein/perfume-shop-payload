import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArchivePage } from '@/components/archive/ArchivePage'
import { getProductsByOlfactive, olfactiveFamilies } from '@/data'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

// DUMMY: the html base has no olfactive-family pages, so there is no real description
const describe = (name: string) =>
  `Discover our ${name.toLowerCase()} fragrances: compositions built around the character of the ${name.toLowerCase()} family, from fresh first impressions to a lasting, elegant trail.`

export function generateStaticParams() {
  return olfactiveFamilies.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const family = olfactiveFamilies.find((f) => f.slug === slug)
  return family ? { title: `${family.name} fragrances`, description: describe(family.name) } : {}
}

export default async function OlfactiveFamilyPage({ params, searchParams }: Props) {
  const { slug } = await params
  const family = olfactiveFamilies.find((f) => f.slug === slug)
  if (!family) notFound()
  const page = Math.max(1, Number((await searchParams).page) || 1)

  return (
    <ArchivePage
      description={describe(family.name)}
      filters={{ olfactive: family.slug }}
      hrefFor={(p) =>
        p === 1 ? `/olfactive-family/${family.slug}` : `/olfactive-family/${family.slug}?page=${p}`
      }
      page={page}
      products={getProductsByOlfactive(family.slug)}
      title={family.name}
    />
  )
}
