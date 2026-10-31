import { prefersReducedMotion } from './reducedMotion'
import type { AnimationInit } from './types'

/** Shows `el` (sets data-visible) after scrolling down; click scrolls back to the top. */
export const initScrollTop: AnimationInit<{ offset?: number }> = (el, opts) => {
  const offset = opts?.offset ?? 400
  let frame = 0

  const update = () => {
    frame = 0
    el.dataset.visible = String(window.scrollY > offset)
  }
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  const onClick = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  el.addEventListener('click', onClick)

  return () => {
    window.removeEventListener('scroll', onScroll)
    el.removeEventListener('click', onClick)
    cancelAnimationFrame(frame)
  }
}
