import type { Metadata } from 'next'

import { SHOP_DESCRIPTION, ShopArchive } from './shopArchive'
import { pageMetadata } from '@/utilities/pageMetadata'

export const metadata: Metadata = pageMetadata({
  title: 'Shop',
  description: SHOP_DESCRIPTION,
  path: '/shop',
})

type Props = { searchParams: Promise<{ category?: string }> }

export default async function ShopPage({ searchParams }: Props) {
  const { category } = await searchParams
  return <ShopArchive category={category} page={1} />
}
