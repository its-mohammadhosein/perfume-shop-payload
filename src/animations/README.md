# Animations

Plain-JS animation modules. Components never contain animation code; they only call `useAnimation`.

**Decision (2026-10-31): no GSAP.** The modules stay plain JS. They are small, already respect reduced motion, and GSAP would add 25–70 KB per page for little visible gain (the carousel would even get worse: native scroll-snap beats GSAP dragging on phones).

## Rules

1. **One module per behaviour.** Each file exports `init<Name>: AnimationInit<Options>` (see `types.ts`).
2. **Plain DOM only.** No React and no animation libraries inside a module. The module receives the root element and finds children through `data-*` attributes (e.g. `[data-marquee-track]`).
3. **Always return a cleanup** that removes listeners, cancels frames and timers, and resets inline styles.
4. **Respect reduced motion.** Check `prefersReducedMotion()` and skip or shorten the motion.
5. **Use CSS when CSS can do it.** Simple hover effects (card overlays, banner reveals) are Tailwind `group-hover` classes, not modules.
6. Components connect a module with `useAnimation(ref, initX, opts)` from `@/hooks/useAnimation`.

## Inventory

| Module            | Used by                       | Behaviour                                                                                                    |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `marquee.ts`      | Home and About marquee        | Infinite horizontal loop, pauses off screen                                                                  |
| `stickyHeader.ts` | Header (every page)           | Fixed after scrolling, hides on scroll down, slides in on scroll up; switches overlap tone                   |
| `heroSlider.ts`   | Home hero                     | Crossfade, 5s autoplay (paused on hover, off for reduced motion), numbered dots, side arrows                 |
| `carousel.ts`     | All carousels (`ui/Carousel`) | Arrow buttons scroll one slide, disable at the ends; mouse drag with snap on release; touch is native scroll |
| `cardGallery.ts`  | Product cards (desktop)       | Pointer position over the image picks which gallery image shows                                              |
| `scrollTop.ts`    | Scroll-to-top button          | Shows after 400px; smooth scroll to top                                                                      |
| `accordion.ts`    | About FAQ (`ui/Accordion`)    | Height animation on open / close (0.3s), opening one item closes the others, reduced motion skips it         |

**CSS-only (no module):** off-canvas slide and overlay fade (`OffCanvas`), mega menu fade and rise (`HeaderBar`), mobile drill-down slide (`MobileMenu`), featured-card zoom (`MegaMenu`), product card icon fade (`ProductCard`), post image zoom (`PostCard`), collection banner rise and button reveal (`CollectionBanners`), tab panel fade (`PromoTabs`), hero slide text rise (`HeroSlider`), product lightbox fade (`ProductGallery`), related-posts side arrows sliding in on hover (`Carousel` `arrowPosition="sides"`), accordion plus → minus (`Accordion`).

**Scroll-snap only (no module, no arrows):** collection banners and Instagram tiles on mobile (swipe rows below 769px / 1025px).

**Changing a module:** keep the `AnimationInit` signature and the module can be rewritten in place (with any library) without touching components.
