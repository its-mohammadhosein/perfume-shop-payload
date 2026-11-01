import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Post } from '../../../payload-types'

// Posts are shown at /journal/<slug>, listed on /journal and in the Home "Journal Articles" carousel
const revalidateJournal = (slug: string | null | undefined) => {
  revalidatePath(`/journal/${slug}`)
  revalidatePath('/journal')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating post at path: /journal/${doc.slug}`)

      revalidateJournal(doc.slug)
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      payload.logger.info(`Revalidating old post at path: /journal/${previousDoc.slug}`)

      revalidateJournal(previousDoc.slug)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateJournal(doc?.slug)
  }

  return doc
}
