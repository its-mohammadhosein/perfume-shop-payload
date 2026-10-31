import { logos, mainNav, mobileNav, products } from '@/data'

import { HeaderSwitch } from './HeaderSwitch'
import type { SearchItem } from './SearchForm'

// Only what the client-side search needs, not the whole product data
const searchItems: SearchItem[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  price: p.price,
  image: p.images[0]!,
}))

export function Header() {
  return (
    <HeaderSwitch logos={logos} mobileNav={mobileNav} nav={mainNav} searchItems={searchItems} />
  )
}
