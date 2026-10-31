import type { Metadata } from 'next'

import { SHOP_DESCRIPTION, ShopArchive } from './shopArchive'

export const metadata: Metadata = {
  title: 'Shop',
  description: SHOP_DESCRIPTION,
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function ShopPage({ searchParams }: Props) {
  const { category } = await searchParams
  return <ShopArchive category={category} page={1} />
}
