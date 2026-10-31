import { EmptyState } from '@/components/commerce/EmptyState'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="py-20 lg:py-[120px]">
      <EmptyState
        as="h1"
        icon={<span className="font-medium">404</span>}
        text="It looks like nothing was found at this location. The page may have moved, or the link may be out of date."
        title="Page not found"
      />
    </Container>
  )
}
