import { expect, test } from '@playwright/test'

import {
  collections,
  infoPages,
  olfactiveFamilies,
  paginate,
  posts,
  products,
} from '../../src/data'

// Every frontend route, built from the same data the pages use
const { totalPages } = paginate(products, 1)
const routes = [
  '/',
  '/shop',
  ...Array.from({ length: totalPages - 1 }, (_, i) => `/shop/page/${i + 2}`),
  '/fragrances',
  ...collections.map((c) => `/collection/${c.slug}`),
  ...olfactiveFamilies.map((f) => `/olfactive-family/${f.slug}`),
  ...products.map((p) => `/product/${p.slug}`),
  '/journal',
  ...posts.map((p) => `/journal/${p.slug}`),
  '/about-us',
  ...infoPages.map((p) => `/${p.slug}`),
  '/cart',
  '/checkout',
  '/wishlist',
  '/compare',
  '/my-account',
]

test.describe('Frontend smoke test', () => {
  for (const route of routes) {
    test(`${route} renders without console errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
      page.on('pageerror', (err) => errors.push(err.message))

      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('header').first()).toBeVisible()
      await expect(page.locator('footer').first()).toBeVisible()
      expect(errors).toEqual([])
    })
  }

  test('unknown URLs render the styled 404', async ({ page }) => {
    for (const route of ['/does-not-exist', '/shop/does-not-exist', '/product/does-not-exist']) {
      const response = await page.goto(route)
      expect(response?.status()).toBe(404)
      await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
      await expect(page.locator('main').getByRole('link', { name: 'Return to shop' })).toBeVisible()
    }
  })
})
