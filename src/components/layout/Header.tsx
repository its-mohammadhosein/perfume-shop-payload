import { logos, products } from '@/data'
import { getNavigation } from '@/shop/queries'

import { HeaderSwitch } from './HeaderSwitch'
import type { SearchItem } from './SearchForm'

// Only what the client-side search needs, not the whole product data
const searchItems: SearchItem[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  price: p.price,
  image: p.images[0]!,
}))

/** Menus come from the Header global (Payload admin → Globals → Header). */
export async function Header() {
  const { nav, mobileNav } = await getNavigation()
  return <HeaderSwitch logos={logos} mobileNav={mobileNav} nav={nav} searchItems={searchItems} />
}
