import registry from './generated/images.json'

import type { FileAsset, ImageAsset } from './types'

type RegistryEntry = { src: string; width?: number; height?: number }

const images = registry as Record<string, RegistryEntry>

/** Keys use the html base upload path of the original, e.g. "2025/11/abyss-bleu.jpeg" */
export function hasImage(key: string): boolean {
  return key in images
}

/** Raster image with intrinsic size for next/image. Throws if the image was not extracted. */
export function image(key: string, alt = ''): ImageAsset {
  const entry = images[key]
  if (!entry) throw new Error(`Image not found in registry: ${key}`)
  if (!entry.width || !entry.height) throw new Error(`Image has no dimensions (use file()): ${key}`)
  return { src: entry.src, width: entry.width, height: entry.height, alt }
}

/** SVG or video */
export function file(key: string): FileAsset {
  const entry = images[key]
  if (!entry) throw new Error(`File not found in registry: ${key}`)
  return { src: entry.src }
}
