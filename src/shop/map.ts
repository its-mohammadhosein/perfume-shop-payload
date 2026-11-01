import { image } from '@/data/images'
import type { Collection, MobileNavItem, NavItem, NavLink } from '@/data/types'
import type { FragranceCollection, Header } from '@/payload-types'
import { mediaImage } from '@/utilities/mediaImage'

// Pure mapping from Payload docs to the shop UI types (no Payload or Next imports, so it's unit-testable)

/** Shown when a collection's image was deleted from Media */
const fallbackImage = (alt: string) => image('2025/11/perfumes-placeholder-products-opt.jpg', alt)

export type ShopCollection = Collection & { id: number }

export function toCollection(doc: FragranceCollection): ShopCollection {
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    gender: doc.gender,
    summary: doc.summary,
    description: doc.description,
    image: mediaImage(doc.image, doc.name) ?? fallbackImage(doc.name),
    ...(doc.placeholder ? { dummy: true } : {}),
  }
}

export const collectionHref = (slug: string) => `/collection/${slug}`

type HeaderNavItem = NonNullable<Header['navItems']>[number]
type HeaderColumn = NonNullable<NonNullable<HeaderNavItem['megaMenu']>['columns']>[number]

function columnLinks(column: HeaderColumn, collections: ShopCollection[]): NavLink[] {
  if (column.source === 'custom') {
    return (column.links ?? []).map((l) => ({ label: l.label, href: l.url }))
  }
  return collections
    .filter((c) => column.source === 'all' || c.gender === column.source)
    .map((c) => ({ label: c.name, href: collectionHref(c.slug) }))
}

function featuredCard(
  featured: NonNullable<HeaderNavItem['megaMenu']>['featured'],
  collections: ShopCollection[],
): NonNullable<NavItem['megaMenu']>['featured'] {
  const ref = featured?.collection
  const id = typeof ref === 'object' && ref ? ref.id : ref
  const collection = collections.find((c) => c.id === id)
  if (!collection) return undefined
  return {
    title: featured?.title || collection.name,
    text: featured?.text || collection.summary,
    href: collectionHref(collection.slug),
    image: mediaImage(featured?.image, collection.name) ?? collection.image,
  }
}

/** Mobile-only entries around the Header global's items (account tools aren't in the desktop bar) */
const mobileStart: MobileNavItem[] = [{ label: 'Home', href: '/' }]
const mobileEnd: MobileNavItem[] = [
  { label: 'Contact us', href: '/contact-us' },
  { label: 'Wishlist', href: '/wishlist', icon: 'wishlist' },
  { label: 'Compare', href: '/compare', icon: 'compare' },
  { label: 'Login / Register', href: '/my-account', icon: 'account' },
]

/** Desktop and mobile menus from the Header global; automatic columns list the collections. */
export function buildNavigation(
  header: Pick<Header, 'navItems'> | null | undefined,
  collections: ShopCollection[],
): { nav: NavItem[]; mobileNav: MobileNavItem[] } {
  const nav: NavItem[] = (header?.navItems ?? []).map((item) => {
    const columns = item.hasMegaMenu ? (item.megaMenu?.columns ?? []) : []
    if (columns.length === 0) return { label: item.label, href: item.url }
    return {
      label: item.label,
      href: item.url,
      megaMenu: {
        columns: columns.map((col) => ({
          title: { label: col.label, href: col.url },
          links: columnLinks(col, collections),
        })),
        featured: featuredCard(item.megaMenu?.featured, collections),
      },
    }
  })

  const mobileNav: MobileNavItem[] = [
    ...mobileStart,
    ...nav.map((item) => ({
      label: item.label,
      href: item.href,
      ...(item.megaMenu ? { children: item.megaMenu.columns.map((col) => col.title) } : {}),
    })),
    ...mobileEnd,
  ]

  return { nav, mobileNav }
}
