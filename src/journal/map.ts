import type { ImageAsset } from '@/data/types'
import type { Media, Post } from '@/payload-types'

import type { JournalPost } from './types'

// Pure mapping from Payload posts to the journal UI (no Payload or Next imports, so it's unit-testable)

function toImage(media: Post['heroImage'], fallbackAlt: string): ImageAsset | undefined {
  if (!media || typeof media !== 'object' || !media.url) return undefined
  const m = media as Media
  return { src: m.url!, width: m.width ?? 1200, height: m.height ?? 742, alt: m.alt || fallbackAlt }
}

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

/** Plain text of the first paragraph, for the excerpt when the SEO description is empty */
function firstParagraph(content: Post['content']): string {
  const paragraph = (content?.root?.children as LexicalNode[] | undefined)?.find(
    (n) => n.type === 'paragraph',
  )
  const text = (node?: LexicalNode): string =>
    node ? (node.text ?? '') + (node.children ?? []).map(text).join('') : ''
  const value = text(paragraph).trim()
  return value.length > 160 ? `${value.slice(0, value.lastIndexOf(' ', 157))}…` : value
}

export function toJournalPost(post: Post): JournalPost {
  const categories = (post.categories ?? []).filter((c) => typeof c === 'object')
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: (post.publishedAt ?? post.createdAt).slice(0, 10),
    category: categories[0]?.title,
    image: toImage(post.heroImage ?? post.meta?.image, post.title),
    excerpt: post.meta?.description || firstParagraph(post.content),
    authorName: post.populatedAuthors?.find((a) => a.name)?.name ?? undefined,
    tags: categories.map((c) => ({ slug: c.slug, name: c.title })),
    content: post.content,
  }
}
