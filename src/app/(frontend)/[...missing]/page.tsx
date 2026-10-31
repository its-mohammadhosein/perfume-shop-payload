import { notFound } from 'next/navigation'

import { notFoundMetadata } from '@/utilities/pageMetadata'

// Unmatched URLs would otherwise skip the site layout: the app has two root layouts (site and
// Payload admin), so Next falls back to its bare default 404. Routing them here renders
// (frontend)/not-found.tsx inside the header and footer instead.
export const metadata = notFoundMetadata

export default function CatchAll() {
  notFound()
}
