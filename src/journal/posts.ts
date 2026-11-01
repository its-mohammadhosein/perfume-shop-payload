import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Post } from '@/payload-types'

import { toJournalPost } from './map'
import type { JournalPost } from './types'

const published: Where = { _status: { equals: 'published' } }

const getClient = () => getPayload({ config: configPromise })

/** Published posts, newest first. Returns [] if the database can't be reached (keeps Home rendering). */
export const getJournalPosts = cache(async (limit = 100): Promise<JournalPost[]> => {
  try {
    const payload = await getClient()
    const { docs } = await payload.find({
      collection: 'posts',
      where: published,
      sort: '-publishedAt',
      limit,
      depth: 1,
      overrideAccess: false,
    })
    return docs.map(toJournalPost)
  } catch (error) {
    console.error('Could not load journal posts', error)
    return []
  }
})

/** One post by slug. In draft mode (admin preview) drafts are returned too. */
export const getJournalPost = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, published] },
    draft,
    limit: 1,
    pagination: false,
    depth: 2,
    overrideAccess: draft,
  })
  const post = docs[0]
  if (!post) return null

  // Related posts chosen in the admin, else the latest other posts
  const chosen = (post.relatedPosts ?? []).filter(
    (p): p is Post => typeof p === 'object' && p._status !== 'draft',
  )
  const related = chosen.length
    ? chosen.map(toJournalPost)
    : (await getJournalPosts(6)).filter((p) => p.id !== post.id).slice(0, 5)

  return { post: toJournalPost(post), related, draft }
})

/** Newer and older published neighbours by publish date (post navigation bar). */
export async function getAdjacentJournalPosts(post: JournalPost) {
  const all = await getJournalPosts()
  const i = all.findIndex((p) => p.id === post.id)
  if (i === -1) return {}
  return { newer: all[i - 1], older: all[i + 1] }
}

/** Slugs of every published post (static params, sitemap). */
export async function getJournalSlugs(): Promise<string[]> {
  return (await getJournalPosts()).map((p) => p.slug)
}
