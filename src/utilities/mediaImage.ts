import type { ImageAsset } from '@/data/types'
import type { Media } from '@/payload-types'

/** A populated Media upload as an image for next/image; undefined when missing or not populated. */
export function mediaImage(
  media: number | Media | null | undefined,
  fallbackAlt: string,
): ImageAsset | undefined {
  if (!media || typeof media !== 'object' || !media.url) return undefined
  return {
    src: media.url,
    width: media.width ?? 1200,
    height: media.height ?? 742,
    alt: media.alt || fallbackAlt,
  }
}
