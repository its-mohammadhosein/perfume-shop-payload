/** Cleanup returned by every animation module. */
export type AnimationCleanup = () => void

/**
 * Every animation module has this shape: plain DOM in, cleanup out.
 * Keeping the signature stable lets the body be rewritten with GSAP later without touching components.
 */
export type AnimationInit<O = undefined> = (el: HTMLElement, opts?: O) => AnimationCleanup
