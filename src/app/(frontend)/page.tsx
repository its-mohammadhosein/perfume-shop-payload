import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

// Placeholder until Phase 4 (home sections). The dark block stands in for the hero under the
// transparent header.
export default function HomePage() {
  return (
    <>
      <div className="flex min-h-screen items-end bg-[#3b0f04] pb-24">
        <Container className="text-center">
          <Heading as="h1" size="hero" className="text-white">
            Perfumes
          </Heading>
        </Container>
      </div>
      <div className="h-[150vh]" />
    </>
  )
}
