import { prefersReducedMotion } from './reducedMotion'
import type { AnimationInit } from './types'

const DURATION = 300

/**
 * Accordion open / close with a height animation. Opening one item closes the others.
 * Markup inside `el`:
 *   [data-accordion-item]     one per item; gets `data-open` while open
 *   [data-accordion-trigger]  the item's button (`aria-expanded` is kept in sync)
 *   [data-accordion-panel]    the item's content, `hidden` while closed
 */
export const initAccordion: AnimationInit = (el) => {
  const items = [...el.querySelectorAll<HTMLElement>('[data-accordion-item]')]
  const running = new Map<HTMLElement, Animation>()

  const setOpen = (item: HTMLElement, open: boolean) => {
    const trigger = item.querySelector<HTMLElement>('[data-accordion-trigger]')
    const panel = item.querySelector<HTMLElement>('[data-accordion-panel]')
    if (!trigger || !panel || (item.dataset.open !== undefined) === open) return

    trigger.setAttribute('aria-expanded', String(open))
    if (open) item.dataset.open = ''
    else delete item.dataset.open

    // Start from the current height so a reversed toggle mid-animation doesn't jump
    const from = panel.hidden ? 0 : panel.getBoundingClientRect().height
    running.get(panel)?.cancel()
    panel.hidden = false
    const to = open ? panel.scrollHeight : 0

    if (prefersReducedMotion()) {
      panel.hidden = !open
      return
    }
    panel.style.overflow = 'hidden'
    const anim = panel.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: DURATION,
      easing: 'ease',
    })
    running.set(panel, anim)
    anim.onfinish = () => {
      running.delete(panel)
      panel.style.overflow = ''
      panel.hidden = !open
    }
  }

  const onClick = (e: MouseEvent) => {
    const trigger = (e.target as HTMLElement).closest('[data-accordion-trigger]')
    const item = trigger?.closest<HTMLElement>('[data-accordion-item]')
    if (!item || !items.includes(item)) return
    const open = item.dataset.open === undefined
    if (open) items.forEach((other) => other !== item && setOpen(other, false))
    setOpen(item, open)
  }

  el.addEventListener('click', onClick)
  return () => {
    el.removeEventListener('click', onClick)
    running.forEach((anim) => anim.cancel())
    running.clear()
  }
}
