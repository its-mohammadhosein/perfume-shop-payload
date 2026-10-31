import Image from 'next/image'
import Link from 'next/link'

import { formatPostDate } from '@/data/posts'
import type { Post } from '@/data/types'
import { cn } from '@/utilities/ui'

type PostCardProps = {
  post: Post
  sizes?: string
  className?: string
}

/** Journal card: near-square image, "Category / date" meta, title. */
export function PostCard({
  post,
  sizes = '(min-width: 769px) 33vw, 100vw',
  className,
}: PostCardProps) {
  const href = `/journal/${post.slug}`
  return (
    <article className={cn('group/post', className)}>
      <Link
        aria-label={post.title}
        className="relative mb-[18px] block aspect-[588/598] overflow-hidden bg-muted"
        href={href}
        tabIndex={-1}
      >
        <Image
          alt={post.image.alt}
          className="object-cover transition-transform duration-500 group-hover/post:scale-105"
          fill
          sizes={sizes}
          src={post.image.src}
        />
      </Link>
      <p className="mb-1.5 flex items-center gap-1.5 text-base text-gray-400">
        <span>{post.category}</span>
        <span aria-hidden="true">/</span>
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </p>
      <h3 className="text-xl leading-[1.3] font-medium">
        <Link className="text-heading hover:text-title-hover" href={href}>
          {post.title}
        </Link>
      </h3>
    </article>
  )
}
