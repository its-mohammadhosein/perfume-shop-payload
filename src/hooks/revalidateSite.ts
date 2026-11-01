import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import { revalidatePath } from 'next/cache'

// Shop data and the header appear on almost every page (menu, filters, cards), so a change
// refreshes the whole site instead of tracking each path. The seed script sets disableRevalidate.
const revalidateAll = (payload: { logger: { info: (msg: string) => void } }, what: string) => {
  payload.logger.info(`Revalidating all pages (${what} changed)`)
  revalidatePath('/', 'layout')
}

export const revalidateSite: CollectionAfterChangeHook = ({ doc, collection, req }) => {
  if (!req.context.disableRevalidate) revalidateAll(req.payload, collection.slug)
  return doc
}

export const revalidateSiteOnDelete: CollectionAfterDeleteHook = ({ doc, collection, req }) => {
  if (!req.context.disableRevalidate) revalidateAll(req.payload, collection.slug)
  return doc
}

export const revalidateSiteGlobal: GlobalAfterChangeHook = ({ doc, global, req }) => {
  if (!req.context.disableRevalidate) revalidateAll(req.payload, global.slug)
  return doc
}
