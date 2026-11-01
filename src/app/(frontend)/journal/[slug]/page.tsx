import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AuthorBio } from '@/components/blog/AuthorBio'
import { CommentForm } from '@/components/blog/CommentForm'
import { LivePreviewListener } from '@/components/blog/LivePreviewListener'
import { PostCard } from '@/components/blog/PostCard'
import { PostNav } from '@/components/blog/PostNav'
import { PostRichText } from '@/components/blog/PostRichText'
import { PostTags } from '@/components/blog/PostTags'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { Carousel } from '@/components/ui/Carousel'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { User, WdIcon } from '@/components/ui/Icon'
import { formatPostDate } from '@/journal/format'
import { getAdjacentJournalPosts, getJournalPost, getJournalSlugs } from '@/journal/posts'
import { getServerSideURL } from '@/utilities/getURL'
import { notFoundMetadata, pageMetadata } from '@/utilities/pageMetadata'

type Props = { params: Promise<{ slug: string }> }

// Published posts are prebuilt; new ones render on first visit. Saving a post in the admin
// refreshes its page (collections/Posts/hooks/revalidatePost.ts); this is the fallback.
export const revalidate = 600

export async function generateStaticParams() {
  return (await getJournalSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getJournalPost(decodeURIComponent(slug))
  if (!result) return notFoundMetadata
  const { post } = result
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${post.slug}`,
    image: post.image,
    type: 'article',
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const result = await getJournalPost(decodeURIComponent(slug))
  if (!result) notFound()

  const { post, related, draft } = result
  const { newer, older } = await getAdjacentJournalPosts(post)
  const url = `${getServerSideURL()}/journal/${post.slug}`

  return (
    <Container className="py-10">
      {draft && <LivePreviewListener />}
      <article>
        {/* Header: date, title, author | featured image */}
        <header className="mb-10 flex flex-col gap-[30px] border-b-2 border-primary pb-10 md:flex-row">
          <div className="flex min-w-px flex-1 flex-col gap-5 md:justify-center">
            <p className="leading-none text-gray-400">
              <time dateTime={post.date}>On {formatPostDate(post.date, 'long')}</time>
            </p>
            <Heading as="h1" size="section">
              {post.title}
            </Heading>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-[15px] leading-none">
              {post.authorName && (
                <p className="inline-flex flex-wrap items-center gap-[5px] text-gray-400">
                  <span className="hidden md:inline">Posted by</span>
                  <span
                    aria-hidden="true"
                    className="flex size-[18px] items-end justify-center overflow-hidden rounded-full bg-[#c5c5c5] text-white"
                  >
                    <User className="-mb-0.5 size-[15px]" fill="currentColor" strokeWidth={0} />
                  </span>
                  <Link className="text-gray-400 hover:text-gray-500" href="/journal">
                    {post.authorName}
                  </Link>
                </p>
              )}
              <Link
                aria-label="0 comments"
                className="relative inline-flex h-[1.65em] w-[1.32em] items-center justify-center text-[1.1em] text-gray-400 hover:text-gray-500"
                href="#respond"
              >
                <WdIcon className="size-[1em]" name="comment" />
                <span className="absolute top-[-5%] left-[55%] flex h-[1.4em] min-w-[1.4em] items-center justify-center rounded-[1em] bg-primary px-[.2em] text-[.6em] leading-none text-white">
                  0
                </span>
              </Link>
            </div>
          </div>
          {post.image && (
            <div className="min-w-px flex-1">
              <Image
                alt={post.image.alt}
                className="h-auto w-full"
                height={post.image.height}
                priority
                sizes="(min-width: 769px) 50vw, 100vw"
                src={post.image.src}
                width={post.image.width}
              />
            </div>
          )}
        </header>

        <div className="mx-auto flex max-w-(--container-post) flex-col gap-5">
          <PostRichText content={post.content} />

          <footer className="mt-5 flex flex-col gap-10">
            {post.authorName && <AuthorBio author={{ name: post.authorName }} />}
            <div className="flex flex-wrap items-center justify-between gap-5">
              {post.tags.length > 0 && <PostTags tags={post.tags} />}
              <ShareButtons image={post.image?.src ?? ''} title={post.title} url={url} />
            </div>
            <PostNav newer={newer} older={older} />

            {related.length > 0 && (
              <Carousel
                arrowPosition="sides"
                gapClassName="gap-2.5 lg:gap-5"
                slideClassName="basis-full md:basis-[calc((100%-10px)/2)] lg:basis-[calc((100%-20px)/2)]"
                title="Related posts"
                titleClassName="text-[28px] lg:text-4xl"
              >
                {related.map((p) => (
                  <PostCard
                    key={p.id}
                    aspect="wide"
                    post={p}
                    sizes="(min-width: 769px) 490px, 100vw"
                  />
                ))}
              </Carousel>
            )}

            <div id="respond" className="scroll-mt-[100px]">
              <CommentForm />
            </div>
          </footer>
        </div>
      </article>
    </Container>
  )
}
