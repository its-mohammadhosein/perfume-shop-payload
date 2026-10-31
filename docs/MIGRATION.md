# MIGRATION.md — Porting the HTML Base to the Payload App

How every page of the **html base** (`../woodmart-perfume`) is rebuilt as **React / Next.js components with Tailwind** in this repo (the **payload app**).

Reference docs in the html base:

- [`README.md`](../../woodmart-perfume/README.md): page inventory, content, and gaps
- [`DESIGN.md`](../../woodmart-perfume/DESIGN.md): tokens, type scale, and component specs

---

## 1. Goal and ground rules

| Rule | Meaning |
| ---- | ------- |
| **Visual parity first** | Each page should match the html base at desktop (≥1025px), tablet (769–1024px) and mobile (≤768px). |
| **Static data** | Content comes from typed files in `src/data/`, extracted from the html base. Nothing is read from Payload yet. |
| **No new Payload collections** | Don't add Products, Collections, etc. to `payload.config.ts`. Leave the existing collections (`Pages`, `Posts`, `Media`, `Categories`, `Users`) and globals (`Header`, `Footer`) untouched. |
| **Replace the template frontend** | Keep the Payload admin, the `(payload)` routes, and the backend config. Replace the `(frontend)` routes, header, footer, blocks, heros, and theme. |
| **Logic is not important** | Cart, checkout, wishlist, filters, search, sorting, newsletter, and comments can be static UI or simple local state. No API calls. |
| **Animations in plain JS** | Write each animation as an isolated vanilla-JS module (§7) so it can be swapped for **GSAP** later without touching components. |
| **No WoodMart code** | WoodMart CSS, JS, and the icon font are proprietary. Use them as a visual reference only. Icons come from `lucide-react`, which is already installed. |

---

## 2. Route map

The original URLs are kept so pages can be compared side by side with the html base. The one exception is blog posts, which move to `/journal/[slug]`.

Wherever the source is ⚠️ or ❌, use **dummy data** in the same shape as the real data (see §5).

| URL | Next.js route (`src/app/(frontend)/…`) | Source in html base | Status of source |
| --- | -------------------------------------- | ------------------- | ---------------- |
| `/` | `page.tsx` | `perfumes/index.html` | ✅ full |
| `/shop`, `/shop/page/[n]` | `shop/page.tsx`, `shop/page/[pageNumber]/page.tsx` | `shop/…` (6 pages) | ✅ full |
| `/product/[slug]` (72) | `product/[slug]/page.tsx` + `generateStaticParams` | `product/abyss-bleu` | ⚠️ one example. The other 71 reuse the template with card data |
| `/collection/[slug]` (6) | `collection/[slug]/page.tsx` | `collection/opus-essence` | ⚠️ one example |
| `/olfactive-family/[slug]` (9) | `olfactive-family/[slug]/page.tsx` | none | ❌ reuse the shop archive layout |
| `/journal` | `journal/page.tsx` | `journal/index.html` | ✅ full |
| `/journal/[slug]` (6) | `journal/[slug]/page.tsx` + `generateStaticParams` | `2025/10/28/scent-sensibility` | ⚠️ one example. Other 5 posts have card data only. The old WP URL `/YYYY/MM/DD/slug` is **not** kept. |
| `/about-us` | `about-us/page.tsx` | `about-us/index.html` | ✅ full |
| `/cart` | `cart/page.tsx` | `cart/index.html` | ✅ empty state only |
| `/wishlist` | `wishlist/page.tsx` | `wishlist/index.html` | ✅ empty state only |
| `/checkout` | `checkout/page.tsx` | none (mirror = cart) | ❌ standard checkout layout styled per DESIGN.md, with dummy order data |
| `/contact-us`, `/faq`, `/refund`, `/cookies`, `/terms`, `/privacy` | `(info)/[slug]/page.tsx` | none | ❌ one text-page template with dummy copy (FAQ reuses the About accordion) |
| `/my-account`, `/compare`, `/fragrances` | `my-account/…`, `compare/…`, `fragrances/…` | none | ❌ low priority; simple pages with dummy content |
| 404 | `not-found.tsx` | none | Restyle |

**Template routes to remove:** `[slug]/`, `posts/**`, `search/`, `(sitemaps)/` (they read the `Pages`/`Posts` collections). Keep `next/preview`, `next/exit-preview`, and `next/seed` for now. They only serve the admin and can be removed later.

---

## 3. Folder structure (proposed)

```
src/
├── app/(frontend)/            routes from §2, plus layout.tsx and globals.css
├── data/                      static content (typed)
│   ├── types.ts               Product, Fragrance, Collection, OlfactiveFamily, Post, Author, NavItem…
│   ├── products.ts            72 products (24 fragrances × 3 sizes)
│   ├── collections.ts         6 collections
│   ├── olfactive.ts           9 olfactive families
│   ├── posts.ts               6 posts and 1 author
│   ├── navigation.ts          header menu, mega menu, mobile menu, footer links
│   ├── home.ts                hero slides, featured fragrances, banners, Instagram tiles
│   └── about.ts               story, FAQ, "Why choose" cards
├── components/
│   ├── ui/                    primitives: Button, Container, Section, Heading, Input, Icon, Price, Accordion, Tabs
│   ├── layout/                Header, MegaMenu, MobileMenu, Footer, OffCanvas, SideCart, SearchPanel
│   ├── product/               ProductCard, ProductGrid, ProductCarousel, ProductGallery, SizeSwitcher, AttributesTable, NotesList, AddToCart
│   ├── archive/               ShopHeader, FilterSidebar, Pagination
│   ├── blog/                  PostCard, PostCarousel, PostHeader, AuthorBox, PostNav, CommentForm
│   └── sections/              page sections (HeroSlider, NewIn, OlfactoryFamilies, Marquee, FeaturedFragrances, PromoTabs, CollectionBanners, JournalArticles, InstagramStrip, …)
├── animations/                vanilla-JS animation modules (§7)
├── hooks/                     useAnimation, useOffCanvas, useLocalCart (simple local state)
└── fonts/                     Satoshi .woff2 files
public/images/                 images copied from the html base (§6)
```

**Template code to delete** once nothing imports it: `src/blocks/**`, `src/heros/**`, `src/components/{Card,CollectionArchive,PageRange,Pagination,RichText,LivePreviewListener}`, `src/providers/HeaderTheme` and `Theme` (no dark mode), the template's `src/components/ui/*` (shadcn), and `src/Header/Component*.tsx` / `src/Footer/Component.tsx`.
The `Header`/`Footer` **globals' `config.ts`** stay, because they are registered in `payload.config.ts`.

---

## 4. Styling foundation (Tailwind v4)

All values come from [`DESIGN.md`](../../woodmart-perfume/DESIGN.md).

1. **Tokens in `@theme`** (`globals.css`). Replace the shadcn `oklch` variables and Geist fonts with:
   - colours: `primary #292724`, `primary-hover #1C1918`, `heading #242424`, `title #333`, `body #767676`, `footer #111211`, `band #F1F1F1`, `muted #F7F7F7`, the gray scale, `success`, `warning`
   - `--font-sans: Satoshi, Arial, Helvetica, sans-serif`
   - `--radius: 0`, no shadows
   - container: max width 1800px, 15px side padding
2. **Font:** load `Satoshi-Regular/Medium/Bold.woff2` with `next/font/local` (weights 400/500/600).
3. **Breakpoints:** use Tailwind's `md` (768px) and `lg` (1024px), which match WoodMart's. Drop the template's custom `sm/xl/2xl` overrides unless needed.
4. **Type scale:** add named utilities for each style in DESIGN.md §3, each with three steps. For example `text-section` is 28px, 36px at `md`, and 48px at `lg`. Planned names: `text-display`, `text-feature`, `text-hero`, `text-section`, `text-page`, `text-statement`, `text-lead`.
5. **Section spacing utilities:** `space-section` (60 / 80 / 120) and `space-block` (40 / 60 / 80).
6. **Base layer:** body 18px/1.6 (16px on mobile), headings weight 500 / line-height 1.2, 2px dotted focus outline.
7. **Buttons:** one `Button` component with `variant` (primary, black, white, bordered, outline, link, default) and `size` (sm, md, lg, xl) props mapped to DESIGN.md §6. `class-variance-authority` is already installed.
8. Remove `tw-animate-css`, `@tailwindcss/typography` overrides, and the `@source inline` safelist if nothing uses them. Keep `typography` only for post body text.

---

## 5. Static data plan

| File | Content | Where it comes from |
| ---- | ------- | ------------------- |
| `products.ts` | slug, name, size, price, images (main + hover/gallery), category (men/women), collection, olfactive families, gender, short description, notes | **Shop pages 1–6:** name, slug, price, images, category. **Abyss Bleu page:** full detail fields. The other 71 products get **dummy** descriptions and notes. |
| `collections.ts` | slug, name, gender, description, image | Mega menu, home banners, collection page, shop filter counts. Missing descriptions or images are **dummy**. |
| `olfactive.ts` | slug, name, image/icon | Home "Shop by Olfactory Family" and filter list |
| `posts.ts` | slug, date, title, excerpt, image, tags, body, author | Journal page (cards). Full body only for *Scent & Sensibility*; the other 5 posts get **dummy** bodies. |
| `pages.ts` | Copy for info pages (contact, FAQ, refund, cookies, terms, privacy), checkout dummy order | **Dummy** |
| `navigation.ts` | header, mega menu, mobile menu, footer columns | Home page HTML |
| `home.ts` / `about.ts` | section copy and images | Home / About HTML |

**Dummy data rule:** whatever the html base doesn't provide is filled with dummy data in the same shape and of similar length to the real content, so layouts look right. Mark dummy entries (e.g. `dummy: true` or a `// DUMMY` comment) so they're easy to find and replace later.

**Known data gaps** (from README §8): which collection and olfactive families each product belongs to is only known for Abyss Bleu and the 12 Opus Essence products. The rest are assigned dummy values so the filter counts match (12 per collection). Copy and imagery are demo content; replace them before production.

Extraction can be done by hand or with a one-off script that reads the html base and writes `src/data/*.ts`. A script is recommended for the 72 products. It would live in `scripts/` and is not part of the app.

---

## 6. Assets

- Copy only the images that pages actually reference from `woodmart-perfume/perfumes/wp-content/uploads/sites/32/` into `public/images/`, keeping their filenames. Use the **largest original** of each image (e.g. `abyss-bleu.jpeg`, 700×800) and let `next/image` produce the smaller sizes. The WordPress pre-resized copies (`-430x491`, `-263x300`, …) are not needed.
- Logos (`prf-logotype-white.svg`, `prf-logotype-black.svg`), the marquee star, and the infobox SVGs go to `public/images/brand/`.
- Product video `perfumes-product-video.webm` → `public/videos/`.
- Satoshi fonts → `src/fonts/`.
- Images are **not** uploaded to the Payload `Media` collection in this phase.
- Replace the favicon later; the current one is WoodMart-branded.

---

## 7. Animations (plain JS now, GSAP later)

Each animation is a module in `src/animations/` with the same shape:

```ts
// src/animations/marquee.ts
export function initMarquee(el: HTMLElement, opts?: MarqueeOptions): () => void {
  // set up listeners and requestAnimationFrame here; return a cleanup function
}
```

A single hook connects them to React: `useAnimation(ref, initMarquee, opts)`. It runs `init` on mount and cleanup on unmount.
Components never contain animation code. Converting to GSAP later means rewriting the module body while the signature stays the same.
Every module respects `prefers-reduced-motion`.

| Animation | Where | Plain-JS approach now | Notes for GSAP later |
| --------- | ----- | --------------------- | -------------------- |
| Hero slider (fade, autoplay, dots) | Home | Opacity crossfade with timer + dot buttons | Timeline per slide |
| Carousels (arrows, drag) | New In, Promo, Journal, From Collection, Instagram | CSS scroll-snap track; arrows call `scrollBy`; pointer-drag | Draggable / Observer |
| Marquee | Home, About | `requestAnimationFrame` translateX loop on duplicated content (45s per loop) | Infinite tween |
| Sticky header (slide in on scroll) | All pages | Scroll listener toggles a class; CSS transform | ScrollTrigger |
| Mega menu / dropdowns | Header | Hover/focus intent with small delay; CSS opacity/transform | |
| Off-canvas panels (cart, search, mobile menu, filters) | All / Shop | Class toggle + focus trap + body scroll lock | |
| Mobile drill-down menu | Header (≤1024px) | Slide panels with translateX | |
| Product card hover (info slide-up, icons fade, image cycle) | Grids | **CSS only** (`group-hover`); image cycling on pointer move in JS | Optional |
| Collection banner hover reveal | Home | **CSS only** (`group-hover` translate/opacity, 0.3s / 0.4s) | Optional |
| Tabs | Home "Promotional Offers" | React state; fade between panels | |
| Accordion | About FAQ | React state + height transition | |
| Product gallery (thumbs, video, lightbox) | Product page | React state; simple lightbox | |
| Scroll-to-top | All pages | Scroll listener + smooth scroll | |

Simple hover effects stay **CSS-only**; JS is used only where CSS can't do the job.

---

## 8. Build order

Each phase ends with a side-by-side visual check against the html base at the three breakpoints.

| Phase | Scope | Done when |
| ----- | ----- | --------- |
| **0. Foundation** | Remove template frontend pieces (§3); tokens, font, base styles (§4); `Container`, `Section`, `Heading`, `Button`, `Icon`; `useAnimation` | Blank page renders with Satoshi and the correct colours; build passes |
| **1. Data & assets** | `src/data/*` (§5), image copy (§6) | All 72 products, 6 collections, 6 posts are typed and imported without errors |
| **2. Global layout** | Header (overlap + solid variants), mega menu, mobile drill-down, footer, newsletter UI, off-canvas shells (cart/search) | Header and footer match on every route |
| **3. Shared commerce UI** | ProductCard, ProductGrid, ProductCarousel, Price, Pagination | Shop grid matches visually |
| **4. Home** | All 10 sections (README §6) | Home matches the html base |
| **5. Archives** | Shop (+ pages 2–6), collection, olfactive-family; filter sidebar (static) | All archive routes render |
| **6. Product page** | Gallery, size switcher, attributes, notes, "From Collection"; 72 static pages | Abyss Bleu matches; others render with placeholder text |
| **7. Journal** | Journal list, post page, author box, related posts, comment form (static) | Scent & Sensibility matches |
| **8. About** | Intro, marquee, story, FAQ, "Why choose", Instagram | About matches |
| **9. Utility pages** | Cart and wishlist empty states, checkout layout, info pages, 404 | All routes in §2 exist |
| **10. Polish** | Accessibility pass, metadata/SEO per page, Lighthouse, Playwright screenshot tests (`tests/e2e`) | Agreed checks pass |

---

## 9. Later phases (out of scope now)

- Convert `src/animations/*` to **GSAP**
- Move `src/data/*` into **Payload collections and blocks**, with a seed script, once collections are allowed
- Real commerce logic: cart state, checkout, payments, wishlist persistence, filters and search
- Replace the demo copy and imagery with real brand content

---

## 10. Open questions

None right now.

**Resolved (2026-10-31):**

- **Post URLs:** use `/journal/[slug]`.
- **Missing pages and missing data:** use dummy data and simple layouts for now (§2, §5).
- **Promo popup:** dropped. It is not built.
- **Step-by-step checklist:** see [`STEPS.md`](STEPS.md).
