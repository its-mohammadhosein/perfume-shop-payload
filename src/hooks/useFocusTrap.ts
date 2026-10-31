'use client'

import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** While `active`, Tab and Shift+Tab cycle through the focusable elements inside `ref` (modal dialogs). */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!active || !el) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (item) => item.offsetParent !== null || item === document.activeElement,
      )
      if (items.length === 0) return
      const first = items[0]!
      const last = items[items.length - 1]!
      if (
        e.shiftKey &&
        (document.activeElement === first || !el.contains(document.activeElement))
      ) {
        e.preventDefault()
        last.focus()
      } else if (
        !e.shiftKey &&
        (document.activeElement === last || !el.contains(document.activeElement))
      ) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [ref, active])
}
