import { prefersReducedMotion } from './reducedMotion'
import type { AnimationInit } from './types'

export type HeroSliderOptions = {
  /** Autoplay delay in ms (0 disables) */
  interval?: number
}

/**
 * Crossfade slider.
 * Markup inside `el`: `[data-slide]` slides, `[data-slide-dot]` buttons, optional
 * `[data-slide-prev]` / `[data-slide-next]`. The visible slide and its dot get
 * `data-active="true"`; hidden slides are made `inert`. Fades are CSS transitions.
 */
export const initHeroSlider: AnimationInit<HeroSliderOptions> = (el, opts) => {
  const slides = [...el.querySelectorAll<HTMLElement>('[data-slide]')]
  const dots = [...el.querySelectorAll<HTMLElement>('[data-slide-dot]')]
  const prev = el.querySelector<HTMLElement>('[data-slide-prev]')
  const next = el.querySelector<HTMLElement>('[data-slide-next]')
  if (slides.length < 2) return () => {}

  const interval = prefersReducedMotion() ? 0 : (opts?.interval ?? 6000)
  let current = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let paused = false

  const show = (index: number) => {
    current = (index + slides.length) % slides.length
    slides.forEach((s, i) => {
      s.dataset.active = String(i === current)
      s.inert = i !== current
    })
    dots.forEach((d, i) => {
      d.dataset.active = String(i === current)
      d.setAttribute('aria-current', String(i === current))
    })
    schedule()
  }

  const schedule = () => {
    clearTimeout(timer)
    if (interval && !paused) timer = setTimeout(() => show(current + 1), interval)
  }

  const onDot = (e: Event) => {
    const i = dots.indexOf(e.currentTarget as HTMLElement)
    if (i >= 0) show(i)
  }
  const onPrev = () => show(current - 1)
  const onNext = () => show(current + 1)
  const onEnter = () => {
    paused = true
    clearTimeout(timer)
  }
  const onLeave = () => {
    paused = false
    schedule()
  }

  dots.forEach((d) => d.addEventListener('click', onDot))
  prev?.addEventListener('click', onPrev)
  next?.addEventListener('click', onNext)
  el.addEventListener('pointerenter', onEnter)
  el.addEventListener('pointerleave', onLeave)
  show(0)

  return () => {
    clearTimeout(timer)
    dots.forEach((d) => d.removeEventListener('click', onDot))
    prev?.removeEventListener('click', onPrev)
    next?.removeEventListener('click', onNext)
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointerleave', onLeave)
  }
}
