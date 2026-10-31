# Animations

Plain-JS animation modules. They will be rewritten with **GSAP** later, so components must never contain animation code. They only call `useAnimation`.

## Rules

1. **One module per behaviour.** Each file exports `init<Name>: AnimationInit<Options>` (see `types.ts`).
2. **Plain DOM only.** No React and no animation libraries inside a module. The module receives the root element and finds children through `data-*` attributes (e.g. `[data-marquee-track]`).
3. **Always return a cleanup** that removes listeners, cancels frames and timers, and resets inline styles.
4. **Respect reduced motion.** Check `prefersReducedMotion()` and skip or shorten the motion.
5. **Use CSS when CSS can do it.** Simple hover effects (card overlays, banner reveals) are Tailwind `group-hover` classes, not modules.
6. Components connect a module with `useAnimation(ref, initX, opts)` from `@/hooks/useAnimation`.

## Inventory

| Module | Used by | GSAP notes |
| ------ | ------- | ---------- |
| `marquee.ts` | Home and About marquee | One infinite `xPercent` tween |
