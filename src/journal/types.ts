import type { ImageAsset, Tag } from '@/data/types'
import type { Post } from '@/payload-types'

/** A Payload post shaped for the journal UI (cards, post page, navigation). */
export type JournalPost = {
  id: number
  slug: string
  title: string
  /** ISO date (YYYY-MM-DD) of `publishedAt`, falling back to `createdAt` */
  date: string
  /** First category title, shown as "Category / date" on cards */
  category?: string
  image?: ImageAsset
  excerpt: string
  authorName?: string
  tags: Tag[]
  content: Post['content']
}
