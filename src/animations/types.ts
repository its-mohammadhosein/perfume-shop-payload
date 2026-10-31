/** Cleanup returned by every animation module. */
export type AnimationCleanup = () => void

/**
 * Every animation module has this shape: plain DOM in, cleanup out.
 * Keeping the signature stable lets a module body be rewritten without touching components.
 */
export type AnimationInit<O = undefined> = (el: HTMLElement, opts?: O) => AnimationCleanup
