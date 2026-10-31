import { prefersReducedMotion } from './reducedMotion'
import type { AnimationInit } from './types'

/**
 * WoodMart "sticky real + scroll slide + hide on scroll" header.
 *
 * Attributes set on `el` (styling lives in Tailwind classes):
 *   data-sticky="true"        past the header: fixed, white, dark text
 *   data-hidden="true"        scrolling down while sticky: slid up out of view
 *   data-header-tone          "light" only while an overlap header sits over the hero
 * The element's `data-overlap="true"` marks the transparent home variant.
 */
export const initStickyHeader: AnimationInit = (el) => {
  const overlap = el.dataset.overlap === 'true'
  const reduced = prefersReducedMotion()
  let lastY = window.scrollY
  let sticky = false
  let frame = 0

  const setSticky = (next: boolean) => {
    if (next === sticky) return
    sticky = next
    // Switching between absolute and fixed must not animate
    el.style.transition = 'none'
    el.dataset.sticky = String(next)
    el.dataset.headerTone = overlap && !next ? 'light' : 'dark'
    requestAnimationFrame(() => {
      el.style.transition = ''
    })
  }

  const update = () => {
    frame = 0
    const y = window.scrollY
    const threshold = el.offsetHeight * 2

    if (y <= el.offsetHeight) {
      setSticky(false)
      el.dataset.hidden = 'false'
    } else if (y > threshold) {
      const goingDown = y > lastY
      if (!sticky) {
        setSticky(true)
        el.dataset.hidden = String(goingDown && !reduced)
      } else if (Math.abs(y - lastY) > 4) {
        el.dataset.hidden = String(goingDown && !reduced)
      }
    }
    lastY = y
  }

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
    delete el.dataset.sticky
    delete el.dataset.hidden
    el.dataset.headerTone = overlap ? 'light' : 'dark'
    el.style.transition = ''
  }
}
