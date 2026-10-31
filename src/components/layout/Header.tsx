import Link from 'next/link'

import { Container } from '@/components/ui/Container'

// Placeholder until Phase 2 (global layout)
export function Header() {
  return (
    <header className="border-b-2 border-primary">
      <Container className="flex h-(--header-h) items-center lg:h-(--header-h-lg)">
        <Link href="/" className="text-xl font-medium">
          Perfumes
        </Link>
      </Container>
    </header>
  )
}
