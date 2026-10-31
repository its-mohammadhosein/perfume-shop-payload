# STEPS.md — Implementation Checklist

The working checklist for the migration described in [`MIGRATION.md`](MIGRATION.md). Tick each box when its step is done and verified.

**Reference docs in the html base:** [`README.md`](../../woodmart-perfume/README.md) (pages and content) and [`DESIGN.md`](../../woodmart-perfume/DESIGN.md) (design spec).
**Source files:** `../woodmart-perfume/perfumes/` (open the matching page next to the new one when checking).

---

## Decisions in force

| Topic | Decision |
| ----- | -------- |
| Content | Static typed data in `src/data/`. **No new Payload collections.** Existing collections and globals stay untouched. |
| Missing content | Dummy data with the same structure and length as the real content, marked `dummy: true` or `// DUMMY`. |
| Template frontend | Replaced. The Payload admin and backend config stay. |
| Post URLs | `/journal/[slug]` |
| Promo popup | Dropped |
| Animations | Plain-JS modules in `src/animations/`, run through `useAnimation`. They become GSAP later. |
| Logic | Not a priority. Cart, wishlist, filters, search, and forms are static UI or local state. |

## Environment notes

- Node **v24.21.0** and pnpm **12.9.1** are installed, but `package.json` `engines` asks for Node `^22.23.4 || >=24.22.1` and pnpm `^9–^11`. This only causes warnings (no `engine-strict`); `tsc` passes. Upgrade Node to ≥24.22.1 when convenient.
- The static frontend needs no database. The admin (`/admin`) still uses `DATABASE_URL` from `.env`.
- The payload app has **no git remote** yet, so commits can't be pushed.
- **Dev server CSS quirk:** with Turbopack on this machine, editing only a `.tsx` file sometimes doesn't regenerate Tailwind CSS, so new classes have no effect. Restart `pnpm dev` (editing `globals.css` content also works). Production builds are not affected.

## Checks after each step

1. `pnpm exec tsc --noEmit` passes
2. `pnpm lint` passes (once Phase 0 is done)
3. The page renders in `pnpm dev` and looks like the html base at **≥1025px**, **769–1024px** and **≤768px**

---

## Phase 0 — Foundation ✅

### 0.1 Remove template frontend routes
Delete `src/app/(frontend)/[slug]/`, `posts/`, `search/` and `(sitemaps)/`. These render the template's Pages/Posts from the database.
Keep `next/preview`, `next/exit-preview`, `next/seed` (admin-only helpers), `layout.tsx`, `page.tsx`, `not-found.tsx` and `globals.css`. These get rewritten below.
**Done when:** only the kept files remain under `(frontend)`.

### 0.2 Remove template frontend components
Delete the frontend-only code. **Keep everything the admin or backend imports.**

| Delete | Keep (backend or admin depends on it) |
| ------ | ------------------------------------- |
| `src/blocks/*/Component*.tsx`, `src/blocks/Form/{Checkbox,Country,Email,Error,Message,Number,Select,State,Text,Textarea,Width}/`, `blocks/Form/fields.tsx`, `blocks/Code/CopyButton.tsx`, `blocks/RenderBlocks.tsx`, `blocks/RelatedPosts/` | `src/blocks/*/config.ts` (used by Pages/Posts collections) |
| `src/heros/*` except `config.ts` | `src/heros/config.ts` |
| `src/components/*` except the two on the right | `src/components/BeforeDashboard/`, `src/components/BeforeLogin/` (admin import map) |
| `src/Header/Component*.tsx`, `src/Header/Nav/`, `src/Footer/Component.tsx` | `src/Header/{config.ts,RowLabel.tsx,hooks/}`, `src/Footer/{config.ts,RowLabel.tsx,hooks/}` |
| `src/providers/` (theme and header-theme; there is no dark mode) | `src/fields/`, `src/access/`, `src/hooks/`, `src/endpoints/` |
| `src/search/Component.tsx` | `src/search/beforeSync.ts`, `src/search/fieldOverrides.ts` |
| Frontend-only `src/utilities/*` (deleted only if `tsc` shows nothing imports them) | `utilities/{deepMerge,getURL,generatePreviewPath,ui}.ts` |

**Done when:** `tsc` passes and `/admin` still compiles (the import map is unchanged).

### 0.3 Fonts
Copy `Satoshi-Regular.woff2`, `Satoshi-Medium.woff2` and `Satoshi-Bold.woff2` from `woodmart-perfume/perfumes/wp-content/uploads/sites/32/2025/11/` to `src/fonts/`.
Load them with `next/font/local` as weights 400, 500 and 600, `display: swap`, exposed as the CSS variable `--font-satoshi`. Remove the Geist imports.
**Done when:** the body renders in Satoshi.

### 0.4 Tailwind tokens and base styles
Rewrite `src/app/(frontend)/globals.css` from DESIGN.md:
- **`@theme`:**
  - colours: `primary #292724`, `primary-hover #1C1918`, `heading #242424`, `title #333333`, `body #767676`, `footer #111211`, `ink #212121`, `band #F1F1F1`, `muted #F7F7F7`, `muted-hover #EFEFEF`, `arrow #F9F9F9`, the gray scale, `success #459647`, `warning #E0B252`, `line rgba(0,0,0,.1)`
  - `--font-sans` set to Satoshi
  - breakpoints: `md` 768px, `lg` 1024px
- **Utilities:** `container-wd` (max-width 1800px, padding-inline 15px). Type-scale utilities with three steps each: `text-display` 36/48/84, `text-feature` 28/36/62, `text-hero` 32/48/56, `text-section` 28/36/48, `text-page` 28/36/44, `text-statement` 18/24/30, `text-lead` 16/20/25. Section spacing: `mb-section` 60/80/120 and `mb-block` 40/60/80.
- **Base:** body 16px (18px at `md`), line-height 1.6, colour `body`, white background, antialiased. Headings weight 500, colour `heading`, line-height 1.2. Focus outline 2px dotted. Radius 0 and no shadows by default.
- Remove the shadcn variables, `@custom-variant dark`, `tw-animate-css` and the `@source inline` safelist. Simplify `tailwind.config.mjs` to the typography plugin settings only (used for post bodies).

**Done when:** a test page shows the right colours, font and type scale at each breakpoint.

### 0.5 Root layout
Rewrite `src/app/(frontend)/layout.tsx`: `<html lang="en">` with the Satoshi variable and `<body>`. Remove `Providers`, `InitTheme`, `AdminBar` and draft-mode handling. Render `<Header />`, `<main>` and `<Footer />` as placeholders until Phase 2.
Keep `metadata` (metadataBase, Open Graph) and set the default title to "Perfumes".
**Done when:** `/` renders a blank page with the placeholder header and footer.

### 0.6 UI primitives (`src/components/ui/`)
- `Container`: the 1800px container
- `Section`: wrapper with section spacing
- `Heading`: `as` (h1–h6) + `size` (display / feature / hero / section / page / statement)
- `Button`: built with `cva`. Variants: `primary`, `black`, `white`, `bordered`, `outline`, `link`, `default`. Sizes: `sm` 36px, `md` 42px, `lg` 48px, `xl` 56px. Renders a `<button>` or a Next `<Link>` when given `href`.
- `Price`: formats as `$250.00`
- `Icon`: re-exports the `lucide-react` icons we use (search, heart, shopping bag, chevrons, arrows, close, menu, plus/minus, Instagram) at the right stroke and size
- `cn()` stays in `src/utilities/ui.ts`

**Done when:** a `/dev/ui` playground page (removed in Phase 10) shows every primitive.

### 0.7 Animation infrastructure
- `src/hooks/useAnimation.ts`: `useAnimation(ref, init, opts?)` calls `init(el, opts)` on mount and the returned cleanup on unmount.
- `src/animations/types.ts`: `type AnimationInit<O> = (el: HTMLElement, opts?: O) => () => void`
- `src/animations/reducedMotion.ts`: `prefersReducedMotion()` helper
- `src/animations/README.md`: the module rules (plain JS, no React inside, always return a cleanup, respect reduced motion, one module per behaviour, written so GSAP can replace it)

**Done when:** a sample module runs through the hook on the playground page.

### 0.8 Phase 0 checks
`tsc`, `lint`, and `pnpm dev` all pass, and both `/` and `/admin` load.

---

## Phase 1 — Data and assets ✅

> **As built:** one script (`scripts/extract-html-base.mjs`) does both the extraction and the image copy. The scraped facts are committed as JSON in `src/data/generated/`, not git-ignored in `scripts/out/`. `collections.ts` and `olfactive.ts` are merged into `taxonomies.ts`. `tests/int/data.int.spec.ts` checks the data against the html base counts.

### 1.1 Types (`src/data/types.ts`)
`Product`, `ProductSize`, `Fragrance`, `Collection`, `OlfactiveFamily`, `Gender`, `Category`, `Post`, `Author`, `NavItem`, `MegaMenuColumn`, `FooterColumn`, `HeroSlide`, `FeatureCard`, `CollectionBanner`, `InstagramTile`, `FaqItem`, `InfoPage`. Each type has an optional `dummy?: boolean`.

### 1.2 Extraction script (`scripts/extract-html-base.mjs`)
A one-off Node script with no dependencies. It reads `../woodmart-perfume/perfumes` and writes JSON to `scripts/out/`:
- **Products** from `shop/index.html` and `shop/page/2–6`: id, name, slug, price, size, category, card images (main + gallery)
- **Abyss Bleu details:** short description, attributes, notes, gallery, video
- **Opus Essence membership** (12 products)
- **Posts** from `journal/index.html` (title, slug, date, image), plus the full body of *Scent & Sensibility*
- **Image list** used by all pages
- **Navigation**, **home** and **about** content

The script is committed so the extraction can be repeated; `scripts/out/` is git-ignored.

### 1.3 Data files (`src/data/`)
| File | Content |
| ---- | ------- |
| `products.ts` | 72 products. Sizes of one fragrance are linked by `fragranceSlug`. Descriptions and notes are real for Abyss Bleu, dummy for the rest. Collection, olfactive families and gender are assigned so counts match the shop filters (12 per collection; Aldehyde 15, Amber 27, Chypre 21, Floral 18, Fougere 21, Fresh 24, Leather 3, Spicy 21, Woody 9). |
| `collections.ts` | 6 collections: slug, name, gender, description, image |
| `olfactive.ts` | 9 families: slug, name, image |
| `posts.ts` | 6 posts plus author *Mr. Mackay*. Bodies are dummy except *Scent & Sensibility*. |
| `navigation.ts` | Header menu, Fragrances mega menu, mobile menu, footer columns, social links |
| `home.ts` | Hero slides, featured fragrances, collection banners, Instagram tiles |
| `about.ts` | Intro, story, FAQ, "Why choose" cards |
| `pages.ts` | Dummy copy for contact, faq, refund, cookies, terms, privacy, my-account and compare, plus a dummy checkout order |

### 1.4 Data helpers (`src/data/index.ts`)
`getProduct(slug)`, `getSizes(fragranceSlug)`, `getProductsByCollection`, `getProductsByOlfactive`, `getProductsByCategory`, `paginate(items, page, perPage = 12)`, `getPost(slug)`, `getRelatedPosts`, `getCollection(slug)`.

### 1.5 Assets (`scripts/copy-assets.mjs`)
Copies only the referenced images, using the **largest original** of each (no WordPress `-WxH` copies):

| Destination | Contents |
| ----------- | -------- |
| `public/images/products/` | Product images |
| `public/images/site/` | Hero, banners, about, journal and Instagram images |
| `public/images/brand/` | Logos, marquee star, infobox SVGs |
| `public/videos/` | `perfumes-product-video.webm` |

Image paths in `src/data` point to these locations. `next/image` handles resizing.

**Done when:** every data file type-checks, every image path in `src/data` exists in `public/`, and `public/` stays a reasonable size (report the total).

---

## Phase 2 — Global layout ✅

> **As built:** the mega menu is a centred 1320px box with the Her and Him columns stacked, then All Collections, then the featured card, as in the html base. Nav hover fades to 70% instead of underlining. Hovering the menu dims the page. The search is a dropdown under "Search" with instant results, not an off-canvas panel. Dropdown, off-canvas and drill-down motion are CSS transitions; only the sticky header and scroll-to-top are animation modules.

### 2.1 Header shell (`components/layout/Header.tsx`)
- Two variants: **overlap** (home: transparent, white logo and links, 2px white bottom border, sits over the hero) and **solid** (other pages: white background, black logo, 2px `primary` bottom border)
- Height 90px (70px at ≤1024px)
- Layout: logo left, nav centre, tools right
- The variant comes from the route (home = overlap)

### 2.2 Desktop navigation and mega menu
- Items: New, **Fragrances** (mega menu), Journal, About Us. Links are 18px / 500.
- Mega menu: three columns (Collections for Her, Collections for Him, All Collections) with 20px titles and 18px items. Beside them, a featured collection card (cover image 300px tall, bottom-aligned white title and blurb). Content width 1320px, no shadow.
- Opens on hover or focus with a short delay (`animations/dropdown.ts`)

### 2.3 Header tools
Search (opens the search panel), wishlist icon with count `0`, and cart icon with count `0` plus the "items" label (opens the side cart). Counts come from a tiny local store.

### 2.4 Off-canvas system
`components/layout/OffCanvas.tsx` (side `left`/`right`, width, overlay, close button) plus `animations/offcanvas.ts` (slide, focus trap, Esc to close, body scroll lock).
Used by the side cart (empty state + "Return to shop"), the search panel (input + dummy results), the mobile menu, and the shop filters.

### 2.5 Mobile menu (≤1024px)
A hamburger opens the off-canvas drill-down menu: Home, New, Fragrances (with sub-panels Her / Him / All), Journal, About us, Contact us, Wishlist, Compare, Login / Register.
Sub-panels slide in (`animations/drilldown.ts`).

### 2.6 Sticky header
`animations/stickyHeader.ts`: after scrolling past the header, it becomes fixed and slides in from the top (90px tall; solid style even on home).

### 2.7 Footer
- Background `footer`, white text, padding 80/60/40
- Columns at 50% / 25% / 25%:
  - brand statement (`text-statement`) + "Insider Access" newsletter (email input + white button; submit does nothing)
  - two link columns (18px / 500, hover 80% white)
- Bottom bar: 2px white top border, copyright and social icons
- Mobile order: the two link columns side by side, then the brand/newsletter row

### 2.8 Scroll-to-top
A fixed button that appears after scrolling (`animations/scrollTop.ts`).

**Done when:** the header (both variants), mega menu, mobile menu, side cart, search panel and footer match the html base on `/`.

---

## Phase 3 — Shared commerce and blog UI ✅

> **As built:** cards and grid follow the html base: the title sits top-left and the price bottom-left over the image, with 60px of right padding at every size so titles wrap before the heart icon. Grid borders are `rgba(0,0,0,.105)` (new `line-card` token). The carousel has no mobile drag scrollbar; touch uses native swipe. Pagination's current-page style (filled primary) is a guess and gets checked against the shop page in Phase 5. Playground: `/dev/components`.

### 3.1 ProductCard
- 7:8 image with `next/image`
- Overlay with title + price at the bottom (padding 25 / 60 / 25 / 25) that slides up on hover
- Wishlist icon top-right and add-to-cart icon bottom-right; they fade in on hover and are always visible at ≤1024px
- Hover cycles the gallery images (`animations/cardGallery.ts`, desktop only)
- Hover effects are pure CSS (`group-hover`) except the image cycling

### 3.2 ProductGrid
Columns 4 / 3 / 2 (desktop / tablet / mobile), **0 gap**.

### 3.3 Carousel (`components/ui/Carousel.tsx` + `animations/carousel.ts`)
- Scroll-snap track with a configurable slides-per-view per breakpoint and gap
- Arrows: 42px circles, `#F9F9F9` background with a border, grouped together; 35px on mobile
- Pointer drag, and a drag scrollbar on mobile
- Reused by New In, Promo tabs, Journal, From Collection, Related posts and Instagram

### 3.4 Pagination
Numbered pages plus a next arrow, colour `#333`, links to `/shop/page/[n]`.

### 3.5 PostCard
Image, category label ("Perfumes"), date badge, title. Used by the journal grid and carousels.

**Done when:** a playground page shows one card of each type, a grid and a carousel at all three breakpoints.

---

## Phase 4 — Home (`/`) ✅

> **As built:** all sections are in `components/sections/home/` plus the shared `sections/InstagramStrip`. The featured row (4.5) is one carousel whose slides each pair an image card with its product card. The html base uses two separate carousels; this version adds small arrows above it. The brand statement (4.10) is part of the footer, so there's no separate section. Promo tab panels are rendered on the server and only switched on the client. `Carousel` gained an `arrows` prop.

Build each section in `components/sections/home/` from `src/data/home.ts`, and compare each one against `perfumes/index.html`.

| Step | Section | Key specs |
| ---- | ------- | --------- |
| 4.1 | **HeroSlider** | 3 slides, `min-h-screen`, image with solid colour fallback (`#8B6798`, `#73452E`, `#3B0F04`). Content bottom-centred: 140px image (120px mobile), `text-hero` title (max 660px), primary/black "Buy now". Padding 120/100 top, 100 bottom. Crossfade and autoplay with dots (`animations/heroSlider.ts`). Sits under the overlap header. |
| 4.2 | **NewIn** | `text-section` "New In" + product carousel |
| 4.3 | **OlfactoryFamilies** | "Shop by Olfactory Family" + row of bordered large buttons/tiles (Floral … Fougere), horizontal scroll on mobile |
| 4.4 | **Marquee** | "Ethereal · Sensory · Signature" at `text-display`, colour `#242424`, star separator, 45s loop (`animations/marquee.ts`) |
| 4.5 | **FeaturedFragrances** | Ember Glow, Golden Veil, Midnight Azure. Each has a 1:1 cover with a `text-feature` white title and `text-lead` white text (max 600px, padding 50/30), followed by a product card. |
| 4.6 | **PromoTabs** | "Promotional Offers" title on the left; tabs All / For Her / For Him on the right (18px). The panels are product carousels filtered by gender. |
| 4.7 | **CollectionBanners** | Nocturne Essence and Étheria. 1:1 cover, content bottom-centred, `text-section` title. On hover the content rises 50px and the text and "View Collection" (black button) fade in; CSS only. |
| 4.8 | **JournalArticles** | "Journal Articles" + post carousel |
| 4.9 | **InstagramStrip** | "Connect to our Instagram" + 6 tiles (6 / 3 / 2) + "@xtemos.studio" XL link button |
| 4.10 | **Statement** | The brand statement above the footer, if it isn't already part of the footer |

**Done when:** all sections match at three breakpoints, and section spacing is 120/80/60.

---

## Phase 5 — Archives ✅

> **As built:** one `components/archive/ArchivePage` serves all archive routes. The filter panel opens from the **right**, as in the source, and its options and counts are computed from the products on that page, which reproduces the source's Opus Essence counts exactly. `/shop?category=…` filters by category, because the mega menu links there. Olfactive-family pages paginate with `?page=`. `/shop/page/1` redirects to `/shop`. The pagination current-page style is confirmed from the source (`color #fff; background primary`).

### 5.1 ShopLayout (shared)
- Grey band (`#F1F1F1`) header with the page title (`text-page`), description and a "Filters" toggle
- 12-per-page grid and pagination
- `FilterSidebar` as an off-canvas panel (440px, 340px on tablet) with:
  - Category (Men's / Women's)
  - Price slider (static UI)
  - Collection (with counts)
  - Olfactive family (with counts)
  - Stock status

  Filter links navigate to the matching archive page; there is no query filtering.

### 5.2 Routes
| Route | Content |
| ----- | ------- |
| `/shop` | Page 1 |
| `/shop/page/[pageNumber]` | Pages 2–6, with `generateStaticParams` |
| `/collection/[slug]` | 6 collections; title and description from the collection data |
| `/olfactive-family/[slug]` | 9 families; dummy description |

**Done when:** `/shop` and `/collection/opus-essence` match the html base; the other routes render correctly.

---

## Phase 6 — Product page (`/product/[slug]`)

| Step | Part | Key specs |
| ---- | ---- | --------- |
| 6.1 | Route | `generateStaticParams` for all 72 slugs; `notFound()` otherwise; metadata per product |
| 6.2 | **Gallery** | Thumbnail grid layout, 50px gap, video slide, simple lightbox (`animations/lightbox.ts`) |
| 6.3 | **Summary** | Sticky (top offset 100px on desktop). Title `text-page` 500. Short description. **Size switcher** (100ml / 50ml / 2ml Sample, linking to the sibling product). Price. Quantity ± (local state). Full-width **Add to cart** (primary) + **Buy now** (outline). Add to wishlist. |
| 6.4 | **Attributes** | Collection, Olfactive Family, Perfume. Rows have 20px bottom padding and a 2px `#111211` bottom border. |
| 6.5 | **Collection blurb and description** | "From Collection" text, long description, Top / Heart / Base notes rows (same border style) |
| 6.6 | **Image band** | Full-width image, 840px tall (420px on tablet) |
| 6.7 | **From Collection carousel** | Other products from the same collection |

**Done when:** `/product/abyss-bleu` matches the html base, and other slugs render with dummy text.

---

## Phase 7 — Journal

| Step | Part | Key specs |
| ---- | ---- | --------- |
| 7.1 | `/journal` | Grid of 6 PostCards (3 / 3 / 1, gap 20) |
| 7.2 | `/journal/[slug]` | `generateStaticParams` for 6 posts. Meta row (date, "Posted by Mr. Mackay", comment count). Title `text-section`. Body max 1000px with H2 sections (typography plugin restyled to the tokens). Section blocks spaced 80/60/40. |
| 7.3 | Post footer | Tags. Author box (`rgba(0,0,0,.04)` background, 25px padding). Prev/next bar (2px `#292724` top and bottom borders). "Related posts" carousel. "Leave a Reply" form (static, 38/26 title). |

**Done when:** `/journal/scent-sensibility` matches the html base's post page.

---

## Phase 8 — About (`/about-us`)

| Step | Part | Key specs |
| ---- | ---- | --------- |
| 8.1 | Intro | H1 at 62 / 54 / 32, intro paragraph at 20 / 18 / 16 |
| 8.2 | Marquee | Reuses `Marquee` |
| 8.3 | Our Story + FAQ | Text, image block (min-height 444px, 205px on mobile), FAQ accordion (`components/ui/Accordion.tsx`: 20px questions, 1px `rgba(0,0,0,.11)` separators, height animation) |
| 8.4 | Why Choose WoodMart? | 4 cards with SVG icons, left aligned, 2 per row on tablet |
| 8.5 | Instagram | Reuses `InstagramStrip` |

**Done when:** `/about-us` matches the html base.

---

## Phase 9 — Utility pages

| Step | Route | Content |
| ---- | ----- | ------- |
| 9.1 | `/cart` | Empty state: icon, "Your cart is currently empty.", text, primary "Return to shop" |
| 9.2 | `/wishlist` | Empty state: "This wishlist is empty." |
| 9.3 | `/checkout` | Two columns: billing form (static inputs, 42px, 1px border) and order summary with a dummy order. Step heading at 28px. |
| 9.4 | `/(info)/[slug]` | contact-us (dummy contact info and form), faq (Accordion), refund, cookies, terms, privacy. One text-page template with dummy copy. |
| 9.5 | `/my-account`, `/compare`, `/fragrances` | `/my-account`: static login/register forms. `/compare`: empty state. `/fragrances`: collections overview built from the collection data. |
| 9.6 | `not-found.tsx` | Restyled 404 with a link back to the shop |

**Done when:** every link in the header, mega menu, mobile menu and footer resolves to a page (no 404s).

---

## Phase 10 — Polish

| Step | Task | Details |
| ---- | ---- | ------- |
| 10.1 | Metadata | Title, description and Open Graph image for every route. Remove the template's `@payloadcms` Twitter creator. |
| 10.2 | Accessibility | Landmarks, skip link, alt text, focus states, keyboard support for menus, off-canvas panels, tabs, accordion and carousels; `prefers-reduced-motion` in every animation module |
| 10.3 | Responsive QA | Check every route at 375, 768, 1024, 1280 and 1920px against the html base. Fix differences. |
| 10.4 | Tests | Replace `tests/e2e/frontend.e2e.spec.ts` with a smoke test that visits every route and checks for no console errors |
| 10.5 | Cleanup | Remove the `/dev/*` playground pages and unused dependencies (e.g. `geist`, Radix packages, `tw-animate-css`). `tsc`, `lint` and `pnpm build` must pass. |
| 10.6 | Animation inventory | Update `src/animations/README.md` with every module, where it's used, and notes for the GSAP conversion |

---

## Progress log

| Date | Step | Note |
| ---- | ---- | ---- |
| 2026-10-31 | 0.1–0.2 | Template frontend routes, components, providers and unused utilities removed. Block/hero configs, RowLabels, BeforeDashboard/BeforeLogin, search hooks kept for the admin. `utilities/canUseDOM.ts` kept (used by `getURL`). |
| 2026-10-31 | 0.3–0.5 | Satoshi in `src/fonts/` via `next/font/local`. `globals.css` rewritten with tokens, type-scale and spacing utilities; breakpoints set to exactly 769px / 1025px. New root layout with skip link and placeholder Header/Footer. |
| 2026-10-31 | 0.6–0.7 | `Container`, `Section`, `Heading`, `Button`, `Price`, `Icon` in `components/ui/`. `useAnimation` hook, `animations/{types,reducedMotion,marquee}.ts`, and the `Marquee` component. Playground at `/dev/ui`. |
| 2026-10-31 | 0.8 | `tsc` passes. `pnpm lint` was already crashing before these changes (`FlatCompat` + eslint-config-next 16); fixed by importing the native flat configs. It now passes with 4 warnings, all in untouched template files. `/`, `/dev/ui` and a 404 render in `pnpm dev`. `next dev` adds a Next.js agent-rules block to `CLAUDE.md` on every run. |
| 2026-10-31 | 1.1–1.5 | `scripts/extract-html-base.mjs`: 72 products (24 fragrances, 36 men's / 36 women's), Opus Essence members, Abyss Bleu detail, 6 posts + full body of *Scent & Sensibility*, and 115 images (4.0 MB) copied to `public/images/` with dimensions read by `sharp`. 24 gallery images were never mirrored and are skipped. Data in `src/data/` (types, images registry, taxonomies, products, posts, navigation, home, about, pages). Collection and olfactive assignments are dummy but reproduce the shop filter counts exactly. 7 data tests pass. |
| 2026-10-31 | 2.1–2.8 | Header (overlap on `/`, solid elsewhere; boxed 2px border; logo 240/150px), mega menu, search dropdown, side cart, mobile drill-down menu, sticky header (hide on scroll down, show on scroll up, verified at all four states), footer (50/50 statement row, inline newsletter, brand icons, payments), scroll-to-top. Compared with the html base via Playwright screenshots at 1440px and 390px. Fixed along the way: `next.config.ts` `images.localPatterns` now allows `/images/**`; `cn()` now knows the custom `text-*` sizes (tailwind-merge was dropping `text-hero` next to `text-white`). |
| 2026-10-31 | 3.1–3.5 | `ProductCard` (+ `CardGallery` and `animations/cardGallery.ts`), `ProductGrid`, `ui/Carousel` (+ `animations/carousel.ts`), `ui/Pagination`, `blog/PostCard`, `scrollbar-none` utility. Verified with screenshots: carousel next scrolls one slide (470px at 1440px), hover cycles images, no console errors; desktop and mobile match the html base. |
| 2026-10-31 | 4.1–4.10 | Home page: hero slider (`animations/heroSlider.ts`, 5s autoplay as in the source), New In, olfactory family buttons, marquee (spacing matched to the source), featured fragrances, promotional tabs, collection banners, journal carousel, Instagram strip. Built from the source block CSS; one screenshot check at 1440px and 390px with no console errors. |
| 2026-10-31 | 5.1–5.2 | `/shop`, `/shop/page/[2-6]`, `/collection/[slug]` (6), `/olfactive-family/[slug]` (9). `ArchivePage`, `FilterSidebar` (Category, Price (static), Collection, Olfactive family, Stock status), `ShopFilters` off-canvas. Route statuses checked (page 7 and unknown slugs return 404). One screenshot check, no console errors. |
