import { prefersReducedMotion } from './reducedMotion'
import type { AnimationInit } from './types'

export type MarqueeOptions = {
  /** Seconds for one full loop (WoodMart: 45s) */
  duration?: number
}

/**
 * Infinite horizontal scroll.
 * Markup: `el` contains a `[data-marquee-track]` whose content is rendered twice in a row;
 * the track moves left by half its width per loop, then wraps.
 */
export const initMarquee: AnimationInit<MarqueeOptions> = (el, opts) => {
  const track = el.querySelector<HTMLElement>('[data-marquee-track]')
  if (!track || prefersReducedMotion()) return () => {}

  const duration = (opts?.duration ?? 45) * 1000
  let frame = 0
  let start: number | null = null
  let paused = false
  let offset = 0

  const step = (now: number) => {
    if (start === null) start = now - offset * duration
    if (!paused) {
      offset = ((now - start) % duration) / duration
      track.style.transform = `translate3d(${-offset * 50}%, 0, 0)`
    } else {
      start = now - offset * duration
    }
    frame = requestAnimationFrame(step)
  }

  // Pause while off screen to save work
  const observer = new IntersectionObserver(([entry]) => {
    paused = !entry?.isIntersecting
  })
  observer.observe(el)

  frame = requestAnimationFrame(step)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    track.style.transform = ''
  }
}
