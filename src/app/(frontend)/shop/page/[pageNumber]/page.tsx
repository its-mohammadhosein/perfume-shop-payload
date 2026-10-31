import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { paginate, products } from '@/data'

import { ShopArchive } from '../../shopArchive'

type Props = {
  params: Promise<{ pageNumber: string }>
  searchParams: Promise<{ category?: string }>
}

export function generateStaticParams() {
  const { totalPages } = paginate(products, 1)
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ pageNumber: String(i + 2) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageNumber } = await params
  const { totalPages } = paginate(products, 1)
  return { title: `Shop - Page ${pageNumber} of ${totalPages}` }
}

export default async function ShopPaged({ params, searchParams }: Props) {
  const { pageNumber } = await params
  const { category } = await searchParams
  const page = Number(pageNumber)
  if (page === 1) redirect('/shop')
  if (!Number.isInteger(page) || page < 1) notFound()
  if (page > paginate(products, 1).totalPages) notFound()
  return <ShopArchive category={category} page={page} />
}
