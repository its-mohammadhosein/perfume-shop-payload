import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { PostRichText } from '@/components/blog/PostRichText'
import { toJournalPost } from '@/journal/map'
import type { Media, Post } from '@/payload-types'

// next/image needs the Next runtime; a plain <img> is enough to check the markup
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement('img', props),
}))

// In-memory fixtures only: nothing is written to the database
const text = (value: string, format = 0) => ({ type: 'text', text: value, format, version: 1 })
const paragraph = (...children: object[]) => ({ type: 'paragraph', children, version: 1 })
const heading = (tag: string, value: string) => ({
  type: 'heading',
  tag,
  children: [text(value)],
  version: 1,
})

const media = {
  id: 7,
  alt: 'Bottle on a rock',
  url: '/api/media/file/bottle.jpg',
  width: 1200,
  height: 742,
  mimeType: 'image/jpeg',
} as Media

const content = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      paragraph(text('Fragrance is more than just a scent. '), text('It is memory.', 1)),
      { type: 'upload', relationTo: 'media', value: media, version: 1 },
      heading('h2', '1. Everyday Elegance'),
      paragraph(text('A signature scent is like a second skin.')),
      heading('h2', 'Final Thoughts'),
      {
        type: 'block',
        version: 1,
        fields: { blockType: 'code', code: 'const scent = "amber"', language: 'typescript' },
      },
    ],
  },
} as unknown as Post['content']

const post = {
  id: 1,
  title: 'Scent & Sensibility',
  slug: 'scent-sensibility',
  content,
  heroImage: media,
  categories: [{ id: 3, title: 'Perfumes', slug: 'perfumes' }],
  populatedAuthors: [{ id: '1', name: 'Mr. Mackay' }],
  publishedAt: '2025-10-28T14:27:14.000Z',
  createdAt: '2025-10-20T10:00:00.000Z',
  updatedAt: '2025-10-28T14:27:14.000Z',
  _status: 'published',
} as unknown as Post

describe('journal post mapping', () => {
  it('maps a Payload post to the journal UI shape', () => {
    const p = toJournalPost(post)
    expect(p).toMatchObject({
      slug: 'scent-sensibility',
      title: 'Scent & Sensibility',
      date: '2025-10-28',
      category: 'Perfumes',
      authorName: 'Mr. Mackay',
      tags: [{ slug: 'perfumes', name: 'Perfumes' }],
      image: {
        src: '/api/media/file/bottle.jpg',
        width: 1200,
        height: 742,
        alt: 'Bottle on a rock',
      },
    })
  })

  it('uses the first paragraph as the excerpt when there is no SEO description', () => {
    expect(toJournalPost(post).excerpt).toBe('Fragrance is more than just a scent. It is memory.')
    expect(toJournalPost({ ...post, meta: { description: 'From SEO' } }).excerpt).toBe('From SEO')
  })

  it('copes with a post that has no image, category, author or publish date', () => {
    const p = toJournalPost({
      ...post,
      heroImage: null,
      categories: [],
      populatedAuthors: [],
      publishedAt: null,
    })
    expect(p.image).toBeUndefined()
    expect(p.category).toBeUndefined()
    expect(p.authorName).toBeUndefined()
    expect(p.date).toBe('2025-10-20')
  })
})

describe('PostRichText', () => {
  const html = renderToStaticMarkup(React.createElement(PostRichText, { content }))

  it('renders paragraphs, bold text, headings and code blocks', () => {
    expect(html).toContain(
      '<p>Fragrance is more than just a scent. <strong>It is memory.</strong></p>',
    )
    expect(html).toContain('<h2>1. Everyday Elegance</h2>')
    expect(html).toContain('<code>const scent = &quot;amber&quot;</code>')
  })

  it('renders uploaded images with their alt text and block spacing', () => {
    expect(html).toMatch(
      /<figure class="my-10 md:my-\[60px\] lg:my-20"><img[^>]*alt="Bottle on a rock"/,
    )
    expect(html).toContain('src="/api/media/file/bottle.jpg"')
  })

  it('applies the post body styles on the wrapper', () => {
    expect(html).toContain('[&amp;_h2]:text-[1.6em]')
    expect(html).toContain('lg:[&amp;_p+:is(h2,h3)]:mt-20')
  })
})
