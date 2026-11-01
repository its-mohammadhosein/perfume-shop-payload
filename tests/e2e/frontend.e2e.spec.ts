import { expect, test } from '@playwright/test'

import { collections, infoPages, olfactiveFamilies, paginate, products } from '../../src/data'

// Every static frontend route, built from the same data the pages use. Journal posts come from
// Payload, so they're checked separately by following the links on /journal.
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

  test('every published journal post renders (none is fine: the list shows an empty state)', async ({
    page,
  }) => {
    await page.goto('/journal')
    const hrefs = await page
      .locator('main a[href^="/journal/"]')
      .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href')!))])
    if (hrefs.length === 0) {
      await expect(page.getByText('No journal posts have been published yet.')).toBeVisible()
    }
    for (const href of hrefs) {
      const response = await page.goto(href)
      expect(response?.status(), href).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('article')).toBeVisible()
    }
  })

  test('unknown URLs render the styled 404', async ({ page }) => {
    for (const route of ['/does-not-exist', '/shop/does-not-exist', '/product/does-not-exist']) {
      const response = await page.goto(route)
      expect(response?.status()).toBe(404)
      await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
      await expect(page.locator('main').getByRole('link', { name: 'Return to shop' })).toBeVisible()
    }
  })
})
