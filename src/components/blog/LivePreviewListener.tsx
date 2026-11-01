'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

import { getClientSideURL } from '@/utilities/getURL'

/** In the admin's live preview, re-renders the post each time the draft autosaves. */
export function LivePreviewListener() {
  const router = useRouter()
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={getClientSideURL()} />
}
