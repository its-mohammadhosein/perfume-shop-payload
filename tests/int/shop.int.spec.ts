import { describe, expect, it } from 'vitest'

import { buildNavigation, toCollection } from '@/shop/map'
import type { FragranceCollection, Header, Media } from '@/payload-types'

// In-memory fixtures only: nothing is written to the database
const media = (id: number, url: string) =>
  ({ id, url, width: 1920, height: 1080, alt: '' }) as Media

const doc = (
  id: number,
  slug: string,
  name: string,
  gender: 'her' | 'him',
  extra: Partial<FragranceCollection> = {},
) =>
  ({
    id,
    slug,
    name,
    gender,
    summary: `${name} summary`,
    description: `${name} description`,
    image: media(id, `/api/media/file/${slug}.webp`),
    updatedAt: '',
    createdAt: '',
    ...extra,
  }) as FragranceCollection

const collections = [
  doc(1, 'etheria', 'Étheria', 'her'),
  doc(2, 'opus-essence', 'Opus Essence', 'her'),
  doc(3, 'nocturne-essence', 'Nocturne Essence', 'him', { placeholder: true }),
].map(toCollection)

const header: Pick<Header, 'navItems'> = {
  navItems: [
    { label: 'New', url: '/shop' },
    {
      label: 'Fragrances',
      url: '/fragrances',
      hasMegaMenu: true,
      megaMenu: {
        columns: [
          { label: 'Collections for Her', url: '/shop?category=womens-fragrances', source: 'her' },
          { label: 'Collections for Him', url: '/shop?category=mens-fragrances', source: 'him' },
          { label: 'All Collections', url: '/shop', source: 'all' },
          {
            label: 'Gifts',
            url: '/gifts',
            source: 'custom',
            links: [{ label: 'Samples', url: '/shop?size=2ml' }],
          },
        ],
        featured: { collection: 2 },
      },
    },
  ],
}

describe('shop collection mapping', () => {
  it('maps a Payload collection to the UI shape', () => {
    expect(collections[0]).toMatchObject({
      id: 1,
      slug: 'etheria',
      name: 'Étheria',
      gender: 'her',
      image: { src: '/api/media/file/etheria.webp', alt: 'Étheria' },
    })
    expect(collections[2]!.dummy).toBe(true)
  })

  it('falls back to a placeholder image when the image was deleted', () => {
    const c = toCollection(doc(9, 'lost', 'Lost', 'her', { image: 9 }))
    expect(c.image.src).toMatch(/perfumes-placeholder-products/)
  })
})

describe('buildNavigation', () => {
  const { nav, mobileNav } = buildNavigation(header, collections)
  const mega = nav[1]!.megaMenu!

  it('fills automatic columns from the collections, in order', () => {
    expect(nav[0]).toEqual({ label: 'New', href: '/shop' })
    expect(mega.columns.map((c) => c.links.map((l) => l.label))).toEqual([
      ['Étheria', 'Opus Essence'],
      ['Nocturne Essence'],
      ['Étheria', 'Opus Essence', 'Nocturne Essence'],
      ['Samples'],
    ])
    expect(mega.columns[0]!.links[0]!.href).toBe('/collection/etheria')
  })

  it('builds the picture card from the chosen collection, with overrides', () => {
    expect(mega.featured).toMatchObject({
      title: 'Opus Essence',
      text: 'Opus Essence summary',
      href: '/collection/opus-essence',
      image: { src: '/api/media/file/opus-essence.webp' },
    })

    const overridden = buildNavigation(
      {
        navItems: [
          {
            ...header.navItems![1]!,
            megaMenu: {
              ...header.navItems![1]!.megaMenu,
              featured: { collection: collections[1]! as never, title: 'Holiday Edit' },
            },
          },
        ],
      },
      collections,
    ).nav[0]!.megaMenu!.featured
    expect(overridden?.title).toBe('Holiday Edit')
    expect(overridden?.text).toBe('Opus Essence summary')
  })

  it('leaves the card out when no collection is chosen', () => {
    const { nav: noCard } = buildNavigation(
      { navItems: [{ ...header.navItems![1]!, megaMenu: { columns: [] } }] },
      collections,
    )
    // No columns means no mega menu at all
    expect(noCard[0]!.megaMenu).toBeUndefined()
  })

  it('builds the mobile menu around the same items', () => {
    expect(mobileNav.map((i) => i.label)).toEqual([
      'Home',
      'New',
      'Fragrances',
      'Contact us',
      'Wishlist',
      'Compare',
      'Login / Register',
    ])
    expect(mobileNav[2]!.children?.map((c) => c.label)).toEqual([
      'Collections for Her',
      'Collections for Him',
      'All Collections',
      'Gifts',
    ])
  })

  it('returns only the fixed mobile entries when the header is empty', () => {
    const empty = buildNavigation(null, collections)
    expect(empty.nav).toEqual([])
    expect(empty.mobileNav).toHaveLength(5)
  })
})
