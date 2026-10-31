import scraped from './generated/posts.json'
import body from './generated/post-body.json'
import { image } from './images'
import type { Author, Post, PostBlock } from './types'

export const author: Author = {
  slug: 'mr-mackay',
  name: body.author.name,
  bio: body.author.bio,
  // Only an 18x18 thumbnail exists in the html base
  avatar: image(body.author.avatar, body.author.name),
}

function toBlocks(blocks: typeof body.blocks): PostBlock[] {
  return blocks.map((b) =>
    b.type === 'image'
      ? { type: 'image', image: image(b.image!, '') }
      : { type: b.type as 'heading' | 'paragraph', text: b.text! },
  )
}

// DUMMY body for posts that are not mirrored; same rhythm as the real one
function dummyBlocks(title: string): PostBlock[] {
  return [
    {
      type: 'paragraph',
      text: `${title} explores how fragrance shapes the way we feel, remember, and present ourselves. From the first spray to the last lingering note, a perfume tells a story that unfolds over hours, and learning to read that story makes every choice more personal.`,
    },
    { type: 'image', image: image('2025/10/prf-blog-post-1.jpg') },
    { type: 'heading', text: '1. Understanding the Notes' },
    {
      type: 'paragraph',
      text: 'Every fragrance is built in layers. Top notes greet you first and fade quickly, heart notes form the character of the scent, and base notes stay with you the longest. Knowing how these layers interact helps you predict how a perfume will evolve on your skin.',
    },
    { type: 'heading', text: '2. Finding Your Signature' },
    {
      type: 'paragraph',
      text: 'A signature scent should feel effortless. Start with the families you are naturally drawn to, test on skin rather than paper, and give each fragrance time to settle before deciding. The right one will feel like an extension of you.',
    },
    { type: 'image', image: image('2025/10/prf-blog-post-2.jpg') },
    { type: 'heading', text: '3. Wearing Fragrance Well' },
    {
      type: 'paragraph',
      text: 'Apply to pulse points, avoid rubbing your wrists together, and remember that less is often more. Store bottles away from heat and light so the composition stays true from the first spray to the last.',
    },
    { type: 'heading', text: 'Final Thoughts' },
    {
      type: 'paragraph',
      text: 'Fragrance is one of the most personal ways to express yourself. Take your time, trust your instincts, and explore our collections to discover the scent that speaks to you.',
    },
  ]
}

const excerptOf = (blocks: PostBlock[]) => {
  const first = blocks.find((b) => b.type === 'paragraph')
  const text = first && first.type === 'paragraph' ? first.text : ''
  return text.length > 160 ? `${text.slice(0, text.lastIndexOf(' ', 157))}…` : text
}

// Newest first, as on the journal page
export const posts: Post[] = scraped.map((p) => {
  const isReal = p.slug === body.slug
  const blocks = isReal ? toBlocks(body.blocks) : dummyBlocks(p.title)
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    image: image(p.image, p.title),
    excerpt: excerptOf(blocks),
    author,
    // Real tags only exist for the mirrored post
    tags: isReal ? body.tags : [body.tags[0]!, body.tags[2]!],
    blocks,
    ...(isReal ? {} : { dummy: true }),
  }
})

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAdjacentPosts(slug: string): { newer?: Post; older?: Post } {
  const i = posts.findIndex((p) => p.slug === slug)
  return { newer: posts[i - 1], older: posts[i + 1] }
}

export function getRelatedPosts(slug: string, limit = 5): Post[] {
  return posts.filter((p) => p.slug !== slug).slice(0, limit)
}

export function formatPostDate(date: string, style: 'short' | 'long' = 'short'): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: style === 'short' ? 'short' : 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
