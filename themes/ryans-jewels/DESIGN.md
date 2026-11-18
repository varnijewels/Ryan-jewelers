# Ryan Jewelers — theme design notes

> **Homepage sections 2–16 are documented in [BUILD-LOG.md](./BUILD-LOG.md)** —
> per-section Figma node IDs, the reusable-component inventory, the cross-store
> recipe, and the verification results. This file covers the header contract and
> the shared token/asset foundations.

## Reference smooth page scrolling — 2026-11-18

- Verified the live Armani Gold root layout `0.Dag1M-Fb.js`: Lenis **1.3.26**, desktop query `(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)`, `lerp: 0.05`, automatic RAF, anchors, nested scrolling, navigation inertia cancellation and reduced-motion support.
- Add the exact Lenis package and its scoped stylesheet; this dependency supplies the reference's complete wheel/touch/anchor behavior instead of a custom wheel interceptor. Keep controller code in Ryan's `page-scroll.ts`, initialize only for the Ryan theme from the existing root layout, and destroy/recreate it when desktop eligibility changes. Mobile/coarse input and reduced motion stay native.
- Ryan's drawers lock `body` rather than the reference's root overflow. Observe only body style/class changes and explicitly stop/start Lenis for that lock, preserving nested cart/menu scrolling. Keep the reference's other options; use this body-lock bridge in place of its root-only `autoToggle`.
- Synchronize the existing root navigation/hash/top reset through an immediate forced Lenis reset so old wheel momentum never leaks into the next route. Retain native reset behavior when Lenis is inactive. Add a Ryan-only CSS reduced-motion fallback. No page transforms, custom content wrappers, changes to sticky headers, carousel motion or other storefront themes.
- Verify actual wheel easing, desktop/native eligibility changes, nested scrolling, drawer locks, navigation reset and cleanup against the real Lenis package, then run restyle guard and production build. Browser access is unavailable, so final visual comparison remains pending.

## Reference continuous scrolling — 2026-11-18

- Verified the live Armani Gold homepage's `bn-sales-carousel` in its shipped `28.BnxSfcls.js`: Embla with `loop: true`, `align: start`, and AutoScroll at `speed: 1`, `startDelay: 1500`, hover pause and interaction resume. This continuous motion supersedes the previous three-second card stepping and instant rewind.
- Use the already installed `embla-carousel-svelte` action and `embla-carousel-auto-scroll` in `RjProductRow`. Keep the real cards as direct track children, add an overflow-hidden viewport, and let Embla move/recycle slides for a seamless loop. Preserve card widths, gaps, responsive sizing, category tabs, image galleries, metal selection and existing pause/play control.
- Retain explicit hover/touch, visibility, reduced-motion and user-pause handling. Pause keyboard focus within product cards; category-tab focus must allow the newly selected category to start scrolling. Disable the plugin's independent interaction restart so those controls stay authoritative; resume through the same 1.5-second start delay. Reinitialize at the first slide after a category change, refresh arrow state on selection/reinit, and let the action destroy its animation, observers and listeners on unmount.
- Verify actual continuous transforms, looping, pause/resume, manual arrows, category changes, reduced motion, no overflow and cleanup with component tests using the real installed carousel engine, then run restyle checks and a production build. Browser access is currently unavailable, so live visual comparison remains pending.

## Featured row automatic scrolling — 2026-11-18

- Keep the existing native horizontal product track and category filters. Advance one card every three seconds with smooth scrolling, returning to the first product after the end. Measure card width/gap and available overflow so desktop, tablet and mobile use the same behavior.
- Pause while hovered, keyboard-focused or touched, skip hidden browser tabs, and provide a compact pause/play button beside the existing arrows. Reduced-motion preference starts paused and disables smooth manual movement; remove timers/listeners on unmount and recreate the timer when the category/track changes. Refresh arrow disabled states when the track appears or resizes.
- Scope: `RjProductRow` and its existing `RjFilterBar`; no duplicated products, new carousel dependency, image-gallery changes or other homepage sections. Verify timed movement, wrap, pause/resume, touch/focus, category changes, no overflow, reduced motion and cleanup with component tests, restyle guards and production build.

## Homepage category product coverage — 2026-11-18

- The homepage previously fetched only engagement and latest-product search pages, so local Pendants/Earrings tabs could be empty despite a populated catalog. Add the existing pendant and earring category routes to the parallel client-side search requests, normalized through `realCatalogUrl`. Keep the shared product list, real-data/demo filtering, deduplication, white-gold ordering and nonblocking initial HTML. This fixes both the featured row and best-seller tabs without changing card behavior or other themes. Verify the live category search results through the existing category filter, scoped tests and production build.

## Product row controls — 2026-11-18

- In the existing `RjFilterBar`, put All/Rings/Pendants/Earrings on the left and the previous/next arrows on the right. Swap the DOM order for matching keyboard order; retain the existing spacing, responsive sizes, active underline, filtering callbacks and scroll controls.

## Card interaction refinement — 2026-11-18

- Use off-black `--rj-ink` for card hearts. Keep the existing light gold image borders.
- `RjProductCard` owns the real image gallery and metal selection for both catalog cards and carousel tiles; `RjCarouselCard` retains its existing renderer and size variants while delegating the card content. Reveal previous/next image buttons on hover and keyboard focus; keep them visible on touch. Load full product details once as a card nears the viewport (with hover/focus fallback) so metal choices appear without interaction, wrap through real images, preserve the current image on request failure and allow retry. A known single-image product has no inactive gallery arrows.
- Put actual available metal swatches at the right of the price row. The live store uses `Metal Type` for White/Rose/Yellow Gold, so `metalVariantChoices` accepts that field while preferring explicit `Metal Color` when present. Selecting a metal updates its image, price, MRP and product/variant link; cache grouped products, disable selection while loading, and retain the previous choice on failure. Do not invent unavailable color variants.
- Diamond photographs get a gentle one-shot hover/focus float and small gold sparkle. Honor reduced motion. Verify galleries, wraparound, lazy loading, retry, metal changes, price/link consistency and real backend metadata with scoped tests and the production build.

## Real diamond cut photos — 2026-11-18

- Replace the Perfect Cut line-art icons with the ten original shape photographs supplied at `https://armanigold.varnijewels.com/blue-nile/shape-<shape>.jpg` (round, oval, radiant, pear, cushion, princess, asscher, emerald, marquise, heart). Local copies live in `static/ryans-jewels/shapes/real/`; the images are unchanged.
- Reuse the existing heading, shape labels/order and `uiShape` filter links. Render the natural square photo canvas with `object-fit: contain`, no old icon rotations, and lazy loading. Use one row of ten on desktop and five columns/two rows on tablet/mobile so every shape stays available.
- Validate all JPEGs, unique assets, local image responses and the matching shape links on the rendered homepage.

## Current product-card refinement — 2026-11-18

The supplied 14:45 product-card screenshot supersedes the older centered/bordered-tile card treatments. Apply it to `RjProductCard` (homepage row, PLP, trending, related products, checkout recommendations), `RjCarouselCard` (best sellers, offers, lookbook), and the wishlist's existing product presentation.

- White square image area with an 8px radius and a 1px light gold frame. The theme token `--rj-card-border` mixes the existing brand gold at 20% with white; use no dark frame, outer colored panel or heavy shadow.
- Keep real product images centered with `object-fit: contain` and modest 20px/12px desktop/mobile inset. Place the small existing heart treatment at the top left. Existing wishlist remove/buy actions and all product links remain.
- Left-align title, price and comparison price beneath the image with 16px desktop/10px mobile horizontal inset. Use regular 16px title/price type, 12px comparison type and 13px discount type. Adapt the screenshot's pink/teal accents to the existing theme ink, muted text and gold; retain readable text contrast.
- Render comparison prices/discounts only from valid API values above the actual selling price. Reuse `discountPercent`; never invent prices, ratings or discounts. Keep the available metal-selection controls beside the price, as requested in the follow-up interaction refinement.
- Remove caller overrides that force rectangular media, fixed tile heights or smaller unrelated card typography. Keep listing filters/sort, pagination, carousels, account confirmation flows and other themes intact. Verify pricing edge cases with `tests/ryans-card-pricing.test.ts`, restyle guards, the production build, and homepage/PLP responses; visual comparison depends on browser preview availability.

## Current header refinement — 2026-11-18

The supplied KAY header screenshot supersedes sections 2.1/2.2 and the header's responsive/verification notes below. Scope is the Ryan header only; existing commerce services, categories, account/cart actions and mobile sidebar stay in place.

- Map the screenshot's three bands to `RyansJewelsNav.svelte`: a 32px Daily Deals utility row, a 56px white desktop navigation row, and a 44px announcement strip. Per the latest request, the Daily Deals utility row uses brand/button gold `#ac8735` with white text/icons; the lower offer strip is white with dark `--rj-heading` text. Keep the Ryan ink/line tokens and screenshot header accent `#2c3543`. The positioned navigation row has `z-index: 1`, keeping its mega menus above the following announcement strip.
- Offer-strip interaction follows the live KAY promo bar: four-second looping messages, Previous / Pause or Play / Next controls at left, centered message and its matching CTA at right. `RjAnnouncementBar.svelte` owns this behavior and preserves the white surface, top border, and lower stacking layer. Copy/links live in `nav-content.ts`; pause on hover/focus, default to paused for reduced motion, hide inactive slides from focus/assistive technology, and clear timers/listeners on unmount. Verify rotation, wrapping, controls, links, reduced motion and cleanup with `tests/ryans-announcement.test.ts`.
- Per the follow-up request, render the wordmark as uppercase `RYAN JEWELERS` in the existing Inria Serif brand family: 20px desktop, 18px mobile, 16px below 390px. Match the homepage hero button gold (#ac8735) and omit the RJ monogram.
- Header edge spacing: 40px on desktop/tablet and 24px at mobile widths up to 639px. Apply matching gutters to the utility row, navigation, search panel and announcement controls/CTA.
- Desktop: wordmark left, existing Home/categories centered, Ring Builder, search icon, then account/wishlist/bag controls right. Ring Builder has no border; focus outlines remain.
- Keep all existing autocomplete, result selection, form submission, mega-menu, account and cart behavior. A native `details` disclosure opens the existing search form; Enter/Space activate its summary. Utility/offer copy lives in `nav-content.ts` and uses existing store/contact, policy, tracking and offers routes; no third-party credit/appointment features are introduced.
- Below 1200px, reuse the mobile sidebar trigger and arrange the brand/actions above Ring Builder and search. Below 640px, simplify utility links and reduce icon spacing; retain the wordmark and all commerce controls without horizontal overflow.
- Implementation order: update this contract and theme-owned copy, restyle the existing header markup/CSS, run the restyle guard and production build, then verify rendered header content and routes. Browser visual checks depend on preview availability.

**Design source:** Figma `Ryan Jewels Web` — file `XMPW8wCwQOrnp0c4uRBLJ5`, page *Design System* (`36:38244`).

There is no `stores/ryans-jewels` static HTML/CSS folder for this theme, so `npm run design:extract`
(which requires `--source stores/<store>`) does not apply. The section contract below was extracted
directly from the Figma nodes via the Figma MCP `get_design_context` output and is the reference for
verification.

Active theme is selected by `PUBLIC_STOREFRONT_THEME='ryans-jewels'` in `.env`, resolved by
`src/lib/theme/index.ts` and applied as `data-theme="ryans-jewels"` on the app shell.

---

## 1. Tokens

Declared in `src/app.css` under `[data-theme='ryans-jewels']`.

| Token | Value | Source |
| --- | --- | --- |
| `--primary` / `--rj-gold` | `#cca646` (`43 56.8% 53.7%`) | Figma variable `--ryan-jewelers-theme` |
| `--foreground` / `--rj-ink` | `#404040` | style *Menu Text* |
| `--rj-ink-2` | `#606060` | "Order" label, " or " |
| `--rj-line` | `#e5e5e5` | header bottom border (`63:83358`) |
| `--rj-line-2` | `#d9d9d9` | search input border |
| `--rj-input-text` | `#252c32` | style *Dark Gray / Dark Gray 2* |
| `--rj-input-icon` | `#b0babf` | style *Mid Gray / Mid Gray 5* |
| `--rj-cream` | `#faf6ea` | soft gold hover panel |
| `--rj-surface` | `#f4f4f4` | image/skeleton placeholder |
| `--radius` | `6px` | search input radius |

**Fonts** (loaded per-theme via `getThemeFontsUrl`):
`Inria Serif` (wordmark) · `Sarala` (nav, labels) · `Afacad` (utility bar, account) · `Inter` (search input).

---

## 2. Sections implemented

### 2.1 Utility bar — `1:5409`

- Background `#cca646`, height **56**, padding **17px 61px**, inner max **1440**, content row `space-between`.
- Left group, gap **25**: `Daily Deals` · gift icon 20 + `Gift Card` (gap 10) · music-play icon 20 + `Help & Contact` (gap 10).
- Right group, gap **25**: truck icon 21 + `Enter postal code` (gap 12) · globe icon 21 (gap 10) + [`IN` · 1px×19 white rule · `English` · chevron 18] gap 6.
- All text: Afacad Regular **16 / #fff**.

### 2.2 Header — `63:83424` (logged out) / `63:83358` (logged in)

- Background `#fff`, min-height **155**, padding **22px 61px**, column gap **22**, bottom border `1px #e5e5e5`.

**Row 1** (gap 30, centered):

| Element | Contract |
| --- | --- |
| Logo mark | 55×52 crop box; image `left -59.69% / top -39% / w 206.72% / h 221.3%` (source node transform) |
| Wordmark | `Ryan Jewelers`, Inria Serif Regular **26 / #cca646**, gap 12 from mark |
| Search | h **40**, radius **6**, border `1px #d9d9d9`; text Inter 400 **14** / lh 24 / ls **-0.084px** / `#252c32`; pad-left 15, icon 24 at top 7 / right 7. Width is `flex: 1; max-width: 669px` — the source frame's fixed 669 overflows its own 1318 inner box, so the app honours the 61px gutter instead and caps at 669. |
| Order & Return | icon 24 + column gap 5 → `Order` Sarala Regular **12 / #606060**, `& Return` Sarala Bold **16 / #404040**; gap 6, align start |
| Cart (empty) | width **86**, `justify-between`, align end: badged-cart icon 24 + `Add Cart` Sarala Bold **14 / #404040** |
| Cart (has items) | gap **4**, align end: cart icon **27** with live qty overlaid at inset `top 7.87% / right 25% / bottom 49.54% / left 41.67%`, Sarala Bold **18 / #cca646** |
| Account (guest) | user icon 24 + gap 10 + column w **118** gap 4: `Hello!` Afacad **16 / #404040`; `Sign in` **14 / #cca646** underlined + ` or ` **16 / #606060** + `register` **14 / #cca646** underlined + chevron 14 |
| Account (signed in) | profile-circle icon 24 + `Hello! Good Morning` Afacad **16 / #404040** + user name **16 / #cca646** + chevron 14 |

Actions group gap **25**.

**Row 2** (`space-between`, centered):

- Left, gap **15**: `Home` Sarala **16 / #404040** · 1px×20 `#cca646` rule · list gap **22**:
  `Lab Grown Diamond ⌄`, `All Jewellery ⌄`, `Rings`, `Earrings`, `Customise`, `About us`, `Contact`.
  Caret is 10.183×4.563, gap 8 from label. Hover → `#cca646`; no persistent active colour (source keeps all labels `#404040`).
- Right, gap **10**: two-layer 3D gift composition — base 27×31 at `0,0` plus mirrored 17×19 at `+19,+12`
  (`rotate(180deg) scaleY(-1)`); the base uses the *premium* asset when signed in, *color* otherwise —
  then gap 5: `Best Offers` Sarala **16 / #404040** + arrow-right 18.

---

## 3. Assets

`static/ryans-jewels/`

- `logo.png` — exported logo (cropped in CSS to the RJ mark).
- `icons/gift-box-3d.png`, `icons/gift-box-3d-premium.png` — Best Offers composition.
- `icons/*.svg` — reference copies of every exported vector. The header **inlines** these paths as
  SVG so `currentColor` can drive the white-on-gold utility bar and `#404040` header states; the
  files are kept so the source geometry stays traceable.

## 4. Structure

```
src/lib/theme/ryans-jewels/
  nav-content.ts        theme-owned static copy (labels, hrefs, placeholders)
  RyansJewelsNav.svelte header markup + scoped CSS
```

Wired in `src/lib/components/nav/nav.svelte` behind `activeThemeName === 'ryans-jewels'`.

**Reused app logic (not reimplemented):** `MsSearchRenderer` (autocomplete, Enter → `/products?search=`),
`CartSidebar` (cart state + panel), `ProfileDropdown` (account menu), `AuthButton` (auth modal),
`NavModule` (mobile sidebar, sign-out). `CartSidebar` and `ProfileDropdown` gained an **optional**
`trigger` snippet prop so a theme can supply its own trigger markup; omitting it keeps the original
default button, so every other theme is unchanged.

## 5. Responsive

Figma supplies the 1440 desktop frame only; the breakpoints below are the app-side translation.

| Range | Behaviour |
| --- | --- |
| ≥1280 | Exact contract above (61px gutters). |
| 1024–1279 | Gutters 32px; menu list scrolls horizontally if needed. |
| ≤1023 | Postal code hidden; Order & Return, account text and `Add Cart` label hidden — icons only. |
| ≤767 | Utility bar 44px with icon-only Gift Card / Help; header becomes a grid — burger + brand + actions on row 1, full-width search on row 2; menu list scrolls; `Best Offers` collapses to gift + arrow. |

## 6. Verification

Measured in Chromium at 1440×900 against the contract — utility bar 56 / `rgb(204,166,70)`,
header 155 with `1px rgb(229,229,229)` bottom border, padding `22px 61px`, gap 22, logo mark 55×52,
wordmark 26px `rgb(204,166,70)` Inria Serif, search h40 r6 `rgb(217,217,217)` Inter 14 ls -0.084px,
actions gap 25, cart 86 wide `space-between`, menu divider 1×20 gold, menu gap 22, caret 10.2×4.6,
gift 27×31 + 17×19 at +19/+12, all 8 menu labels present, no broken images.

`npm run build` passes. `check-restyle.js` cannot run (repo is not a git checkout and the two touched
shared components are additive prop changes, not restyles) — logic preservation was verified by
inspection instead: all `$effect`/`onMount`/`onDestroy`/`bind:`/transition/snippet blocks and the
original default triggers are intact.
