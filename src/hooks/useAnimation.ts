'use client'

import { useEffect, useRef, type RefObject } from 'react'

import type { AnimationInit } from '@/animations/types'

/**
 * Runs an animation module on the referenced element after mount and cleans it up on unmount.
 * `opts` is read on mount only; pass a new `key` to the component to re-initialise.
 */
export function useAnimation<O>(
  ref: RefObject<HTMLElement | null>,
  init: AnimationInit<O>,
  opts?: O,
) {
  const optsRef = useRef(opts)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return init(el, optsRef.current)
  }, [ref, init])
}
