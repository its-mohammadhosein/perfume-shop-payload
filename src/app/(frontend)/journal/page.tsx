import type { Metadata } from 'next'

import { PostCard } from '@/components/blog/PostCard'
import { Container } from '@/components/ui/Container'
import { PageTitle } from '@/components/ui/PageTitle'
import { posts } from '@/data'
import { pageMetadata } from '@/utilities/pageMetadata'

export const metadata: Metadata = pageMetadata({
  title: 'Journal',
  description: 'Stories, guides and inspiration from the world of fragrance.',
  path: '/journal',
  image: posts[0]!.image,
})

export default function JournalPage() {
  return (
    <>
      <PageTitle>Journal</PageTitle>

      <Container className="py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i === 0} />
          ))}
        </div>
      </Container>
    </>
  )
}
