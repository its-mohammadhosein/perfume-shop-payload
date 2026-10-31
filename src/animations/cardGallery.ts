import type { AnimationInit } from './types'

/**
 * Product card image cycling (WoodMart "grid gallery"): the card image is split into vertical
 * zones; hovering a zone shows that image. Desktop pointers only.
 * Markup: images marked `[data-gallery-image]`; the visible one gets `data-active="true"`.
 */
export const initCardGallery: AnimationInit = (el) => {
  const images = [...el.querySelectorAll<HTMLElement>('[data-gallery-image]')]
  if (images.length < 2 || !window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) {
    return () => {}
  }

  let current = 0
  const show = (index: number) => {
    if (index === current) return
    images[current]!.dataset.active = 'false'
    images[index]!.dataset.active = 'true'
    current = index
  }

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const zone = Math.floor(((e.clientX - rect.left) / rect.width) * images.length)
    show(Math.min(images.length - 1, Math.max(0, zone)))
  }
  const onLeave = () => show(0)

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    show(0)
  }
}
