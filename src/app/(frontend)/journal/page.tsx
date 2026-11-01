import type { Metadata } from 'next'

import { PostCard } from '@/components/blog/PostCard'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PageTitle } from '@/components/ui/PageTitle'
import { getJournalPosts } from '@/journal/posts'
import { pageMetadata } from '@/utilities/pageMetadata'

export const metadata: Metadata = pageMetadata({
  title: 'Journal',
  description: 'Stories, guides and inspiration from the world of fragrance.',
  path: '/journal',
})

// Refreshed when a post is published (revalidatePost hook); this is the fallback
export const revalidate = 600

export default async function JournalPage() {
  const posts = await getJournalPosts()

  return (
    <>
      <PageTitle>Journal</PageTitle>

      <Container className="py-10">
        {posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i === 0} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="mx-auto mb-5 max-w-[535px]">
              No journal posts have been published yet. Please check back soon.
            </p>
            <Button href="/shop" size="md">
              Return to shop
            </Button>
          </div>
        )}
      </Container>
    </>
  )
}
