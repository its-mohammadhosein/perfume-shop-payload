import { prefersReducedMotion } from './reducedMotion'
import type { AnimationInit } from './types'

/**
 * Scroll-snap carousel controls.
 * Markup inside `el`:
 *   [data-carousel-track]  horizontally scrolling list (CSS scroll-snap)
 *   [data-carousel-prev] / [data-carousel-next]  arrow buttons (get `disabled` at the ends)
 * Adds mouse drag-to-scroll; touch uses native scrolling.
 */
export const initCarousel: AnimationInit = (el) => {
  const track = el.querySelector<HTMLElement>('[data-carousel-track]')
  if (!track) return () => {}
  const prev = el.querySelector<HTMLButtonElement>('[data-carousel-prev]')
  const next = el.querySelector<HTMLButtonElement>('[data-carousel-next]')
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'

  const slideWidth = () =>
    (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? track.clientWidth

  const updateArrows = () => {
    const max = track.scrollWidth - track.clientWidth - 1
    if (prev) prev.disabled = track.scrollLeft <= 1
    if (next) next.disabled = track.scrollLeft >= max
    el.dataset.scrollable = String(max > 0)
  }

  const onPrev = () => track.scrollBy({ left: -slideWidth(), behavior })
  const onNext = () => track.scrollBy({ left: slideWidth(), behavior })

  // Mouse drag: disable snapping while dragging, then let it settle on release
  let dragging = false
  let moved = false
  let startX = 0
  let startScroll = 0

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    dragging = true
    moved = false
    startX = e.clientX
    startScroll = track.scrollLeft
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - startX
    if (!moved && Math.abs(dx) > 5) {
      moved = true
      track.style.scrollSnapType = 'none'
      track.style.cursor = 'grabbing'
      track.setPointerCapture(e.pointerId)
    }
    if (moved) track.scrollLeft = startScroll - dx
  }
  const onPointerUp = () => {
    if (!dragging) return
    dragging = false
    track.style.cursor = ''
    if (moved) {
      // Snap to the nearest slide
      const w = slideWidth()
      const target = Math.round(track.scrollLeft / w) * w
      track.style.scrollSnapType = ''
      track.scrollTo({ left: target, behavior })
    }
  }
  // Swallow the click that ends a drag so links inside slides don't fire
  const onClick = (e: MouseEvent) => {
    if (moved) {
      e.preventDefault()
      e.stopPropagation()
      moved = false
    }
  }
  const preventImageDrag = (e: DragEvent) => e.preventDefault()

  prev?.addEventListener('click', onPrev)
  next?.addEventListener('click', onNext)
  track.addEventListener('scroll', updateArrows, { passive: true })
  track.addEventListener('pointerdown', onPointerDown)
  track.addEventListener('pointermove', onPointerMove)
  track.addEventListener('pointerup', onPointerUp)
  track.addEventListener('pointercancel', onPointerUp)
  track.addEventListener('click', onClick, true)
  track.addEventListener('dragstart', preventImageDrag)
  const resize = new ResizeObserver(updateArrows)
  resize.observe(track)
  updateArrows()

  return () => {
    prev?.removeEventListener('click', onPrev)
    next?.removeEventListener('click', onNext)
    track.removeEventListener('scroll', updateArrows)
    track.removeEventListener('pointerdown', onPointerDown)
    track.removeEventListener('pointermove', onPointerMove)
    track.removeEventListener('pointerup', onPointerUp)
    track.removeEventListener('pointercancel', onPointerUp)
    track.removeEventListener('click', onClick, true)
    track.removeEventListener('dragstart', preventImageDrag)
    resize.disconnect()
  }
}
