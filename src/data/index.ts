export * from './about'
export * from './home'
export * from './images'
export * from './navigation'
export * from './pages'
export * from './products'
export * from './taxonomies'
export type * from './types'

/** Simple page slicing for archives (WooCommerce showed 12 per page) */
export function paginate<T>(items: T[], page: number, perPage = 12) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  return {
    items: items.slice((page - 1) * perPage, page * perPage),
    page,
    totalPages,
  }
}
