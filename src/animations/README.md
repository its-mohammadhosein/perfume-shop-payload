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

| Module            | Used by                       | Behaviour                                                                                                    | GSAP notes                                                               |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `marquee.ts`      | Home and About marquee        | Infinite horizontal loop, pauses off screen                                                                  | One infinite `xPercent` tween                                            |
| `stickyHeader.ts` | Header (every page)           | Fixed after scrolling, hides on scroll down, slides in on scroll up; switches overlap tone                   | ScrollTrigger `onUpdate` with direction; tween `yPercent`                |
| `heroSlider.ts`   | Home hero                     | Crossfade, 5s autoplay (paused on hover, off for reduced motion), numbered dots, side arrows                 | Timeline per slide; stagger bottle, title, button                        |
| `carousel.ts`     | All carousels (`ui/Carousel`) | Arrow buttons scroll one slide, disable at the ends; mouse drag with snap on release; touch is native scroll | Draggable + inertia, or Observer; keep scroll-snap as the no-JS fallback |
| `cardGallery.ts`  | Product cards (desktop)       | Pointer position over the image picks which gallery image shows                                              | Crossfade tween between images                                           |
| `scrollTop.ts`    | Scroll-to-top button          | Shows after 400px; smooth scroll to top                                                                      | ScrollToPlugin                                                           |
| `accordion.ts`    | About FAQ (`ui/Accordion`)    | Height animation on open / close (0.3s), opening one item closes the others, reduced motion skips it         | Height tween to `auto`; keep `hidden` as the closed state                |

**CSS-only (no module):** off-canvas slide and overlay fade (`OffCanvas`), mega menu fade and rise (`HeaderBar`), mobile drill-down slide (`MobileMenu`), featured-card zoom (`MegaMenu`), product card icon fade (`ProductCard`), post image zoom (`PostCard`), collection banner rise and button reveal (`CollectionBanners`), tab panel fade (`PromoTabs`), hero slide text rise (`HeroSlider`).
