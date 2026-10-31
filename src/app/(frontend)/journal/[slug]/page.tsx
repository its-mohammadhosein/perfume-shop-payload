import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AuthorBio } from '@/components/blog/AuthorBio'
import { CommentForm } from '@/components/blog/CommentForm'
import { PostCard } from '@/components/blog/PostCard'
import { PostContent } from '@/components/blog/PostContent'
import { PostNav } from '@/components/blog/PostNav'
import { PostTags } from '@/components/blog/PostTags'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { Carousel } from '@/components/ui/Carousel'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { WdIcon } from '@/components/ui/Icon'
import { formatPostDate, getAdjacentPosts, getPost, getRelatedPosts, posts } from '@/data'
import { getServerSideURL } from '@/utilities/getURL'
import { notFoundMetadata, pageMetadata } from '@/utilities/pageMetadata'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return notFoundMetadata
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${slug}`,
    image: post.image,
    type: 'article',
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { newer, older } = getAdjacentPosts(slug)
  const related = getRelatedPosts(slug)
  const url = `${getServerSideURL()}/journal/${post.slug}`

  return (
    <Container className="py-10">
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
              <p className="inline-flex flex-wrap items-center gap-[5px] text-gray-400">
                <span className="hidden md:inline">Posted by</span>
                <Image
                  alt=""
                  className="rounded-full"
                  height={18}
                  src={post.author.avatar.src}
                  width={18}
                />
                <Link className="text-gray-400 hover:text-gray-500" href="/journal">
                  {post.author.name}
                </Link>
              </p>
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
        </header>

        <div className="mx-auto flex max-w-(--container-post) flex-col gap-5">
          <PostContent blocks={post.blocks} />

          <footer className="flex flex-col gap-10">
            <AuthorBio author={post.author} />
            <div className="flex flex-wrap items-center justify-between gap-5">
              <PostTags tags={post.tags} />
              <ShareButtons image={post.image.src} title={post.title} url={url} />
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
                    key={p.slug}
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
