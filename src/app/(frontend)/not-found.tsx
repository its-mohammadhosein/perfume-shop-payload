import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <Heading as="h1" size="page" className="mb-5">
        404
      </Heading>
      <p className="mb-8">This page could not be found.</p>
      <Button href="/shop" variant="primary" size="lg">
        Return to shop
      </Button>
    </Container>
  )
}
