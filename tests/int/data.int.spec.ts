// @vitest-environment node
import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { collections, getSizes, heroSlides, olfactiveFamilies, paginate, products } from '@/data'
import registry from '@/data/generated/images.json'

const publicDir = path.resolve(__dirname, '../../public')

describe('static data', () => {
  it('has 72 products: 24 fragrances in 3 sizes', () => {
    expect(products).toHaveLength(72)
    const fragrances = new Set(products.map((p) => p.fragranceSlug))
    expect(fragrances.size).toBe(24)
    for (const slug of fragrances)
      expect(getSizes(slug).map((p) => p.size)).toEqual(['100ml', '50ml', '2ml'])
  })

  it('matches the shop filter counts from the html base', () => {
    for (const c of collections)
      expect(
        products.filter((p) => p.collection === c.slug),
        c.slug,
      ).toHaveLength(12)

    const expected: Record<string, number> = {
      aldehyde: 15,
      amber: 27,
      chypre: 21,
      floral: 18,
      fougere: 21,
      fresh: 24,
      leather: 3,
      spicy: 21,
      woody: 9,
    }
    for (const f of olfactiveFamilies) {
      expect(
        products.filter((p) => p.olfactive.includes(f.slug)),
        f.slug,
      ).toHaveLength(expected[f.slug]!)
    }
  })

  it('keeps collection gender consistent with product category', () => {
    for (const p of products) {
      expect(collections.find((c) => c.slug === p.collection)?.gender, p.slug).toBe(p.gender)
    }
  })

  it('has real detail for Abyss Bleu and dummy for the rest', () => {
    const abyss = products.find((p) => p.slug === 'abyss-bleu')!
    expect(abyss.dummy).toBeUndefined()
    expect(abyss.notes.top).toContain('Bergamot')
    expect(products.filter((p) => p.dummy)).toHaveLength(69)
  })

  it('points every image at a file in public/', () => {
    for (const entry of Object.values(registry)) {
      expect(fs.existsSync(path.join(publicDir, entry.src)), entry.src).toBe(true)
    }
    for (const p of products) expect(p.images.length, p.slug).toBeGreaterThan(0)
    expect(heroSlides).toHaveLength(3)
  })

  it('paginates the shop into 6 pages of 12', () => {
    expect(paginate(products, 1).totalPages).toBe(6)
    expect(paginate(products, 6).items).toHaveLength(12)
  })
})
