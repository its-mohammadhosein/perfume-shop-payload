import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import type { BannerBlock, CodeBlock, Media, MediaBlock, Post } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Nodes = DefaultNodeTypes | SerializedBlockNode<BannerBlock | CodeBlock | MediaBlock>

// Images sit 80/60/40px away from the text around them, like the converted post body
const blockY = 'my-10 md:my-[60px] lg:my-20'

function PostImage({ media }: { media: number | Media | null | undefined }) {
  if (!media || typeof media !== 'object' || !media.url) return null
  return (
    <figure className={blockY}>
      <Image
        alt={media.alt ?? ''}
        className="h-auto w-full"
        height={media.height ?? 742}
        sizes="(min-width: 1030px) 1000px, 100vw"
        src={media.url}
        width={media.width ?? 1200}
      />
    </figure>
  )
}

const bannerStyles: Record<BannerBlock['style'], string> = {
  info: 'border-line bg-muted',
  success: 'border-success/40 bg-success/10',
  warning: 'border-warning/50 bg-warning/10',
  error: 'border-[#e01020]/40 bg-[#e01020]/5',
}

const converters: JSXConvertersFunction<Nodes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    // Internal links can point at posts (journal) or template pages
    internalDocToHref: ({ linkNode }) => {
      const { relationTo, value } = linkNode.fields.doc ?? {}
      const slug = typeof value === 'object' && value ? (value as { slug?: string }).slug : ''
      return relationTo === 'posts' ? `/journal/${slug}` : `/${slug}`
    },
  }),
  upload: ({ node }) => <PostImage media={node.value as Media} />,
  blocks: {
    mediaBlock: ({ node }) => <PostImage media={node.fields.media} />,
    banner: ({ node }) => (
      <div className={cn('mb-5 border px-[25px] py-5', bannerStyles[node.fields.style])}>
        <RichText converters={converters} data={node.fields.content} disableContainer />
      </div>
    ),
    code: ({ node }) => (
      <pre className="mb-5 overflow-x-auto bg-ink p-5 text-sm leading-[1.6] text-white">
        <code>{node.fields.code}</code>
      </pre>
    ),
  },
})

/**
 * Lexical post content styled like the converted html base post: 20px paragraph spacing,
 * 1.6em section headings, and the 80/60/40 block gap before a section that follows body text.
 */
export function PostRichText({ content }: { content: Post['content'] }) {
  return (
    <RichText
      className={cn(
        '[&_p]:mb-5',
        '[&_h1]:mb-5 [&_h1]:text-[2em] [&_h1]:leading-[1.3]',
        '[&_h2]:mb-5 [&_h2]:text-[1.6em] [&_h2]:leading-[1.4]',
        '[&_h3]:mb-5 [&_h3]:text-[1.3em] [&_h3]:leading-[1.4]',
        '[&_h4]:mb-5 [&_h4]:text-[1.1em] [&_h4]:leading-[1.4]',
        // A new section straight after body text gets the block gap (source: "Final Thoughts")
        '[&_p+:is(h2,h3)]:mt-10 md:[&_p+:is(h2,h3)]:mt-[60px] lg:[&_p+:is(h2,h3)]:mt-20',
        '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mb-1.5',
        '[&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:text-lg [&_blockquote]:text-heading',
        '[&_hr]:my-10 [&_hr]:border-line',
        '[&_a]:underline [&_a]:underline-offset-2',
        '[&_strong]:font-semibold [&_strong]:text-heading',
        '[&>:last-child]:mb-0',
      )}
      converters={converters}
      data={content}
    />
  )
}
