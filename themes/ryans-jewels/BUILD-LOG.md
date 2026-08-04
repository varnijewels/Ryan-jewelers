# Ryan Jewelers — build log

A running record of everything created or changed while porting the Figma design
into this SvelteKit storefront. Kept so the next store can reuse the same recipe
instead of rediscovering it.

**Design source:** Figma `Ryan Jewels Web` — file `XMPW8wCwQOrnp0c4uRBLJ5`
· desktop `1:5407` (1440) · tablet `63:40011` (744) · mobile `77:106779` (412)

**Active theme:** `PUBLIC_STOREFRONT_THEME='ryans-jewels'` in `.env`

---

## 1. Reusable recipe (start here for a new store)

The theme system is switchable — nothing below replaces the app, it only adds a
new selectable theme. To stand up another store, repeat these seven steps.

| # | Step | Files to touch |
| --- | --- | --- |
| 1 | Register the theme name | `src/lib/theme/index.ts` → `AVAILABLE_THEMES` |
| 2 | Add its web fonts | `src/lib/theme/index.ts` → `THEME_FONTS` |
| 3 | Add its colour tokens | `src/app.css` → `[data-theme='<name>']` block |
| 4 | Create the theme folder | `src/lib/theme/<name>/` |
| 5 | Register the homepage | `src/lib/theme/homepages.ts` |
| 6 | Register SEO/meta copy | `src/lib/theme/homepage-content.ts` |
| 7 | Branch the nav/footer | `src/lib/components/nav/nav.svelte` (+ footer) |

**Component build order** (smallest first — never start from the page):
micro primitives → reusable commerce components → layout chrome → page sections
→ page composition.

**Data rule:** live commerce data (products, prices, stock, ratings, compare-at
prices, discounts) comes from the API only. Everything else on the homepage —
hero copy, banners, section headings, promo tiles, decorative images — lives in
the theme's static content module.

### Gotchas worth carrying forward

| Gotcha | Fix |
| --- | --- |
| `app.css` tracks **all** `h1–h6` at `letter-spacing: 0.8px`. Figma headings have none, so headlines wrap one line early and section heights drift. | Set `letter-spacing: normal` on every heading whose source has no tracking. |
| Chrome rounds fractional `border-width` down to 1px at DPR 1, so a 1.5px Figma rule renders as 1px. | Draw it with `box-shadow: inset 0 0 0 1.5px <colour>` instead. |
| Figma trims value text to cap height (`text-box-trim`), so a 32px number reports an 18px box. | Set `line-height` to the source's reported box height. |
| The same trim applies to **small stacked labels**, not just big numbers — the header's Order / & Return / Hello! block ran 51 tall instead of 28 and pushed its icon to the top. Check any icon-beside-two-lines cluster. | Give each line the source's trimmed `line-height` (8 / 11 / 10 here), then the icon lines up on its own. |
| Tablet/mobile Figma frames often use **unthemed** component instances (magenta `#a80139`, yellow `#ffd60a`). | Take the colour from the themed desktop instance, not the breakpoint frame. |
| Figma asset URLs expire in ~7 days. | Download to `static/<theme>/` immediately; never hot-link. |
| Multi-part vector icons come back as fragments, not one SVG. | Compose them from the reported insets, or re-export the leaf node. |
| Figma exports can be 3000px+ / 8 MB. | `sips -Z 700 <file> --out <file>` before committing. |
| A `max-width: 1440px` container leaves dead margins on wide screens and does **not** match the designer's own 1920 artboard. | Fixed px gutters, no cap — see "How the layout fills wide screens". |
| Percentage padding resolves against the *containing block*, not the viewport, so a nested `4.2361%` lands short. | Either use px, or restate the percentage against the inner box. |
| Fixed-width children inside a stretched row leave visible gaps (the lookbook grid did this at 1920). | Give the child a share of the row (`flex: 0 0 <n>%` / `1fr`) and let the tile fill its cell. |

### Breakpoints

| Range | Source frame |
| --- | --- |
| ≥ 1280 | desktop 1440 contract, verbatim; gutters stay fixed and the content stretches |
| 1024–1279 | desktop layout, gutters relaxed to 40 (app-side translation) |
| 640–1023 | tablet 744 frame |
| ≤ 639 | mobile 412 frame |

### How the layout fills wide screens

Frame `186:56688` is the designer's **1920** header artboard, and it settles the
question: the gutters stay at a **fixed 61px** and the content stretches — they
are not percentages, and there is no max-width cap. At 1920 its content box
measures 1798 (1920 − 61 − 61), which the build reproduces exactly.

So the rule for this theme is:

- **outer gutters** — fixed px, straight from the frame (61 for most sections)
- **no `max-width` cap** on any section container
- **inner column splits** — percentages of the content box, so rows keep the
  frame's proportions instead of one column absorbing all the extra width
- **fixed-size children** (product cards, the lookbook panel, the name-plate
  panel) keep their source box only where the source scrolls them; everywhere
  else they are a share of the row

Verified with no horizontal scroll at 320 / 360 / 412 / 600 / 744 / 900 / 1024 /
1280 / 1440 / 1600 / 1920 / 2560.

---

## 2. Files created

### Theme layer — `src/lib/theme/ryans-jewels/`

| File | What it is | Reusable? |
| --- | --- | --- |
| `nav-content.ts` | static header copy (labels, hrefs, placeholders) | pattern |
| `home-content.ts` | all static homepage copy + per-breakpoint geometry | pattern |
| `homepage-content.ts` | SEO title/description overrides | pattern |
| `RyansJewelsNav.svelte` | header, all 3 breakpoints | per-store |
| `RyansJewelsHomepage.svelte` | page composition only | pattern |
| `RjHero.svelte` | section 2 hero | per-store |
| `RjChatWidget.svelte` | floating help widget | **yes** |
| `RjTrustRow.svelte` | section 3 trust badges + slide counter | **yes** |
| `RjRuleHeading.svelte` | rule-flanked heading primitive | **yes** |
| `RjDiamondShapes.svelte` | section 4 shape picker | per-store |
| `RjProductCard.svelte` | borderless centred card (section 5) | **yes** |
| `RjFilterBar.svelte` | arrow rule + category tabs | **yes** |
| `RjProductRow.svelte` | section 5 product row | **yes** |
| `RjMarquee.svelte` | sections 6 + 10, `variant="shapes"\|"taglines"` | **yes** |
| `RjRarePassion.svelte` | section 7 | per-store |
| `RjCategoryTabs.svelte` | shared tab list, `size="lg"\|"md"` | **yes** |
| `RjSectionHead.svelte` | eyebrow + display title + tabs | **yes** |
| `RjCarouselCard.svelte` | boxed product tile, `size="md"\|"lg"` | **yes** |
| `RjCarousel.svelte` | drag track + custom scrollbar rail | **yes** |
| `RjBestSellers.svelte` | section 8 | pattern |
| `RjDiamondCluster.svelte` | decorative diamond cluster (SVG) | per-store |
| `RjCustomiseCard.svelte` | customisation promo tile | pattern |
| `RjNamePlate.svelte` | section 9 | per-store |
| `RjCountdown.svelte` | offer countdown timer | **yes** |
| `RjArrowRule.svelte` | twin arrow-tipped rules, `gap` prop | **yes** |
| `RjLookbook.svelte` | section 11 | pattern |
| `RjWideBanner.svelte` | section 12 | pattern |
| `RjTrending.svelte` | section 13 | pattern |
| `RjEnquiry.svelte` | section 14 — live enquiry form | pattern |
| `RjFaq.svelte` | section 15 — accordion | **yes** |
| `RjInstagram.svelte` | section 16a — social strip | **yes** |
| `RyansJewelsFooter.svelte` | full footer, all 3 breakpoints | per-store |
| `footer-content.ts` | footer + Instagram static copy | pattern |

### Assets — `static/ryans-jewels/`

`logo.png` · `icons/` (header) · `shapes/` · `marquee/` · `home/` (section art,
stat icons, badges, name-plate renders, lookbook photography)

### Tooling — `scripts/`

| File | Purpose |
| --- | --- |
| `rj-shot.mjs` | element screenshot + computed-style measurement at 1440 / 744 / 412 |
| `rj-fontcheck.mjs` | confirm every theme web font actually loaded |
| `rj-textwidth.mjs` | measure text runs to debug wrapping |
| `rj-wrapcheck.mjs` | dump per-line rects + inherited type properties |
| `rj-page-audit.mjs` | whole-page order / overflow / console-error audit |
| `rj-fullpage.mjs` | scaled full-page screenshot |
| `rj-gutters.mjs` | per-section gutter / content-width table at any widths |
| `rj-overflow.mjs` | find the exact element causing a horizontal scrollbar |
| `rj-cards.mjs` | product-card box sizes across breakpoints |
| `rj-fonts-applied.mjs` | which family/size/weight actually landed on each heading |
| `rj-clip.mjs` | screenshot a range between two selectors |

These are store-agnostic — copy them into the next project as-is.

## 3. Files modified (all additive — other themes untouched)

| File | Change |
| --- | --- |
| `src/lib/theme/index.ts` | added `ryans-jewels` to `AVAILABLE_THEMES`; added its `THEME_FONTS` entry (Inria Serif, Sarala, Afacad, Inter, Rozha One, **Red Rose**) |
| `src/lib/theme/homepages.ts` | registered `RyansJewelsHomepage` |
| `src/lib/theme/homepage-content.ts` | registered `ryansJewelsContent` |
| `src/app.css` | added the `[data-theme='ryans-jewels']` token block |
| `src/lib/components/nav/nav.svelte` | added a `ryans-jewels` branch |
| `src/lib/components/nav/cart-sidebar.svelte` | **optional** `trigger` snippet prop |
| `src/lib/components/nav/profile-dropdown.svelte` | **optional** `trigger` snippet prop |
| `src/lib/components/common/footer.svelte` | added a `ryans-jewels` branch |
| `src/routes/(www)/+page.svelte` | passes `trendingProducts` to the theme homepage |
| `src/lib/theme/ryans-jewels/RjFilterBar.svelte` | now composes `RjArrowRule` + `RjCategoryTabs` |
| `src/lib/theme/ryans-jewels/RjProductCard.svelte` | added a `size` prop (`default` \| `wide`) |
| `src/lib/theme/ryans-jewels/RjRuleHeading.svelte` | `letter-spacing: normal` + `text-transform: uppercase` |

The two shared nav edits are additive: omit `trigger` and the original default
button renders, so every other theme behaves exactly as before.

---

## 4. Homepage sections

Order is by desktop y-coordinate.

| # | Section | Desktop | Tablet | Mobile | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Header (gold bar + logo/search + nav) | `63:83424` | — | — | done |
| 2 | Hero + chat widget | `1:5755` | `63:40034` | `77:106848` | done |
| 3 | Trust badges + slide counter | `1:5497` | `63:40035` | `77:106850` | done |
| 4 | Find your perfect cut (9 shapes) | `1:5518` | `63:40058` | `77:106871` | done |
| 5 | Featured products + filter tabs | `1:5651` | `63:40187` | `77:107006` | done |
| 6 | Shape marquee | `1:5756` | `63:40435` | `77:107113` | done |
| 7 | Designed with rare passion | `1:5871` | `63:40291` | `77:107227` | done |
| 8 | Best sellers carousel + rail | `1:6003` | `63:40324` | `77:107262` | done |
| 9 | Personalised name plate | `1:6110` | `63:40549` | `77:107373` | done |
| 10 | Tagline marquee | `1:5870` | `63:40616` | `77:107438` | done |
| 11 | Lookbook + countdown | `1:6474` | `63:40805` | `77:107447` | done |
| 12 | Wide "Glamorous Gifts" banner | `1:6201` | `63:40625` | `77:107518` | done |
| 13 | Trending collection grid | `1:6213` | `63:40637` | `77:107530` | done |
| 14 | Enquiry form | `1:6426` | `63:40742` | `77:107636` | done |
| 15 | FAQ accordion + side images | `1:6431` | `63:40782` | `77:107676` | done |
| 16a | Instagram strip | `1:6323` | `63:40958` | `77:107699` | done |
| 16b | Footer (global) | `1:6335` | `63:40969` | `77:107710` | done |

Note: section 16 is labelled "testimonials" in the original handoff, but the
source frame is an **Instagram strip**, not testimonials.

### Section notes

**7 — Designed with rare passion.** Full-bleed `#fafafa`, 686 tall at 1440.
Desktop is a two-column split (text + stats left, 424×567 image card right,
card sitting 50px higher); tablet/mobile stack text → card → stats. The
`.rj-passion-col` wrapper collapses to `display: contents` below 1024 so `order`
can interleave the card without duplicating markup. Gutters are asymmetric in
the source: 61 left, 83 right (61 + 712 + 160 + 424 + 83 = 1440). The "30% Off"
hexagon overhangs the card's bottom-left corner at every breakpoint, carried as
padding on the media box so it stays in flow.

**8 — Best sellers carousel.** The track deliberately bleeds past the container
on the right (source frame is 1525 wide inside a 1440 page) while the scrollbar
rail stays inside the 1318 grid. The rail thumb is sized from the real scroll
ratio, not the mock's fixed one-card width, so it stays truthful for any product
count. Introduced `RjCarouselCard` — a boxed tile distinct from section 5's
borderless card. Fed from `homepageModule.featuredProducts`.

**9 — Personalised name plate.** Violet panel beside the collection column on
desktop; a full-width band above it on tablet/mobile. The three tiles are
theme-owned customisation promos (no price, "Customise now" CTA), so the mock's
static "5.5" rating is deliberately **not** reproduced. Panel CTA overlaps the
bottom of the name-plate render, matching the source.

**11 — Lookbook + countdown.** Sticky-tall lifestyle image on the left (315×810
with a 1.6px white inset rule), 2×3 product grid on the right. Header carries a
live countdown; the mock's frozen 21:59:08:08 is replaced by a real timer
counting to `offerEndsAt` in theme content. Mobile drops to one 163 image beside
a single 188 column of two cards — the extra four are hidden, matching the frame.

**12 — Wide banner.** Inset 1320×360 card on desktop (61 gutters), full-bleed on
tablet and mobile. The model cut-out is a fixed window onto an over-scaled PNG;
the same crop percentages (`w 100%`, `top -66.34%`) hold at every breakpoint.

**13 — Trending collection.** Reuses `RjRuleHeading`, `RjArrowRule` and
`RjProductCard`. Only the track gutters are section-specific — section 5 keeps
61 at tablet, this one drops to 20 — which is why the card gained a `size`
prop instead of the row being shared.

**14 — Enquiry form.** Wired to the app's existing `enquiryService.create`, the
same call the product-page enquiry modal makes. The source's single "Email &
Mobile number" field is split into the service's `email` and `phone` arguments.
The three upload wells are real file pickers with thumbnail previews; since the
enquiry API takes no attachments, the chosen file names are appended to the
message rather than dropped. Desktop leads with the logo mark on white; tablet
and mobile swap in the gold diamond cluster over the marble plate — both are
the source's own per-breakpoint choices.

**15 — FAQ.** Marble plate plus two 70%-opacity decorative panels on desktop;
below 1024 the plate moves to the enquiry section and the right panel is
dropped, exactly as the frames do it. The source draws only the collapsed
state, so the expand behaviour and the answer copy are app-side additions —
**the answers are factual placeholders and need client review**.

**16 — Instagram strip + footer.** The strip is homepage content; the footer is
global and renders through `src/lib/components/common/footer.svelte` like the
other theme footers. The newsletter form goes through the shared
`NewsletterRenderer` composable, so subscription logic is not reimplemented.
The mock's "All Rights revered." typo is corrected to "Reserved", and its
literal "your company" placeholder is replaced by the theme's `brandName`.

---

## 5. Open questions for the client

1. **Real category slugs.** `nav-content.ts` and `home-content.ts` currently
   guess `/categories/rings`, `/categories/earrings`, `/categories/pendants`,
   `/customise`, `/about-us`, `/contact-us`, `/gift-card`.
2. **Section 8 product source.** The API exposes only `featuredProducts` and
   `trendingProducts` for three product sections. Section 5 uses the first four
   featured, section 8 the full featured list, section 13 trending. Confirm.
3. **Ratings and metal swatches.** The API returns neither, so both clusters are
   hidden. They appear automatically once the API provides them.
4. **Enquiry form (section 14).** POST to the existing `/enquiry` backend, or
   UI-only?
5. **`offerEndsAt`** for the section 11 countdown needs a real campaign date
   (`home-content.ts` → `lookbook`).
6. **FAQ answers** in `home-content.ts` → `faq.items` are placeholders written to
   make the accordion functional; replace with the client's wording.
7. **Instagram profile URL** in `footer-content.ts` → `instagramStrip.href`.
8. **Enquiry attachments** — the API stores no files, so upload names are only
   appended to the message. Confirm whether real uploads are needed.

---

## 6. Verify loop

```bash
npm run dev -- --port 5173 --host 127.0.0.1        # background
node scripts/rj-shot.mjs "<selector>" "<name>" '<measure-json>'
npx svelte-check --threshold error --output machine | grep ryans-jewels
npm run build
```

Measure computed styles against the source contract at 1440, 744 and 412 and
element-screenshot each section (`locator(sel).screenshot()`) — the header is
sticky and covers viewport-clipped shots.

Known pre-existing noise, not caused by this work:

- repo-wide `svelte-check` errors about `$lib/core/services`, `$lib/components/ui/*`
- API 422 "Invalid credentials" from the wishlist endpoint
- `effect_orphan` / `lifecycle_outside_component` in dev → stop the server,
  `rm -rf node_modules/.vite`, restart (stale Vite dep cache, not a code bug)

**Disk:** this machine runs out of space mid-build. Keep ≥ 2 GB free
(`df -h /`); clear `node_modules/.vite`, `.svelte-kit/output`, `npm cache clean --force`.


---

## 7. Final verification (all 16 sections)

| Check | Result |
| --- | --- |
| `npm run build` | passes |
| `svelte-check` | only the pre-existing `$lib/core/services` resolution error (the shared enquiry modal imports the same path) |
| Section order | all 15 root sections present and in source order at 1440 / 744 / 412 |
| Horizontal scroll | none at any breakpoint (overflow lives inside `overflow-x: auto` tracks by design) |
| Console errors | none beyond the pre-existing wishlist 422 |
| Page height | 8712 desktop (Figma frame 8569) · 8516 tablet · 7614 mobile |

Per-section computed styles were measured against the source contract with
`scripts/rj-shot.mjs`; every section matched its frame's box sizes, gaps,
type scale and colours within a pixel unless noted above.


---

## 8. Gutter & margin reference (desktop 1440)

Measured from the running build; every value traces to its Figma frame. Gutters
stay at these px values on wider screens — only the content box grows.

| Section | Gutter L | Gutter R | Content @1440 | Content @1920 |
| --- | --- | --- | --- | --- |
| Header — utility bar + nav rows | 61 | 61 | 1318 | 1798 |
| 2 Hero | 0 | 0 | full-bleed | full-bleed |
| 3 Trust row | 61 | 61 | 1318 | 1798 |
| 4 Find your perfect cut | 61 | 61 | 1318 | 1798 |
| 5 Featured products | 61 | 61 | 1318 | 1798 |
| 6 / 10 Marquee | 0 | 0 | full-bleed | full-bleed |
| 7 Rare passion | 61 | **83** | 1296 | 1776 |
| 8 Best sellers — head + rail | 61 | 61 | 1318 | 1798 |
| 8 Best sellers — track | 61 | bleeds right | scrolls | scrolls |
| 9 Name plate — band | 0 | 0 | full-bleed | full-bleed |
| 9 Name plate — collection column | 632 | 60 | 748 | 1228 |
| 11 Lookbook — head | 77 | 60 | 1303 | 1783 |
| 11 Lookbook — body | 60 | 60 | 1320 | 1800 |
| 12 Wide banner — card edge | 60 | 60 | 1320 | 1800 |
| 12 Wide banner — inner (card has `px 24`) | 84 | 84 | 1272 | 1752 |
| 13 Trending — heading | 60 | 60 | 1320 | 1800 |
| 13 Trending — bar + grid | 62 | 62 | 1316 | 1796 |
| 14 Enquiry | 61 | 61 | 1318 | 1798 |
| 15 FAQ | 115 | 115 | 1210 | 1690 |
| 16a Instagram | 61 | 61 | 1318 | 1798 |
| 16b Footer body | 59 | 59 | 1322 | 1802 |
| 16b Legal bar | 61 | 61 | 1318 | 1798 |

Section 7's asymmetry is the source's own: 61 + 712 + 160 + 424 + 83 = 1440.

### Tablet 744 / mobile 412

The source frames do **not** use one gutter throughout — each section carries its
own, so these are reproduced rather than normalised.

| Section | Tablet 744 | Mobile 412 |
| --- | --- | --- |
| 3 Trust row · 5 Featured products | 40 | 15 |
| 7 Rare passion | 15 | 15 |
| 8 Best sellers | 25 (head/rail), track inset 10 | 16 head · 15 track/rail |
| 9 Name plate | 0 band · 25 collection | 0 band · 15 cards |
| 11 Lookbook | 25 | 15 |
| 12 Wide banner | 0 (full-bleed, card `px 24`) | 0 (full-bleed, card `px 12`) |
| 13 Trending | 25 | 19.5 heading · 16 bar · 10 track |
| 14 Enquiry · 15 FAQ | 25 | 16 |
| 16a Instagram | 30 | 16 |
| 16b Footer | 24 body · 25 legal | 20 |

### Vertical rhythm (desktop)

| Section | Padding top | Padding bottom |
| --- | --- | --- |
| 7 Rare passion | 50 | 50 |
| 8 Best sellers | 50 | 50 (rail sits 55 under the track) |
| 11 Lookbook | 50 | 50 (head 50 above the body) |
| 12 Wide banner | 50 | 50 |
| 13 Trending | 50 | 50 (heading 40 above the bar, bar 30 above the grid) |
| 14 Enquiry | 105 | 48 |
| 15 FAQ | 97 | 176 (the marble plate is 700 tall) |
| 16a Instagram | 50 | 50 |
| 16b Footer | 28 | 28 + a 50-tall gold legal bar |

### Grid gaps

| Where | Gap |
| --- | --- |
| Product rows (sections 5, 13) | 61 |
| Best sellers carousel (8) | 25 |
| Lookbook grid (11) | 20 both ways |
| Name plate tiles (9) | 30 |
| Instagram tiles (16a) | 20 |
| Footer USP columns (16b) | 35 + 1px rule + 35 |
| Footer link columns | 55 |

### Header actions block (63:83434)

The cluster on the right of header row 1 is 385 × 28 and every text box is
trimmed to cap height — this is the piece most likely to look "off" if the trim
is missed.

| Part | Box | Detail |
| --- | --- | --- |
| Order & Return | 97×24 at y2 | icon 24, gap 6, text column 67×24 |
| — "Order" | 67×**8** | Sarala 12 / #606060 |
| — "& Return" | 67×**11** | Sarala Bold 16 / #404040, 5 under "Order" |
| Add Cart | 86×24 at y2, gap 25 | icon 24 + label at x28, bottom-aligned |
| Account | 152×28, gap 25 | icon 24 centred, text column 118×28 at gap 10 |
| — "Hello!" | 118×**10** | Afacad 16 / #404040 |
| — auth line | 118×**14** | "Sign in or register" 10 tall + 14 arrow, gap 5 |

Right-aligned to the 61 gutter: at 1440 the group starts at x994 (1379 − 385).

### Fonts

| Family | Used for |
| --- | --- |
| **Inria Serif** | the "Ryan Jewelers" wordmark (header + footer), 26 |
| **Rozha One** | every display heading — section titles, stat values, badges, footer column titles |
| **Sarala** | body copy, nav labels, product text, buttons, form labels |
| **Red Rose** | the name-plate panel (32/22/17/14) and its "Create a one-of-a-kind piece." lede |
| **Afacad** | the gold utility bar and the account block |
| **Inter** | the desktop search field only |

All six load from one Google Fonts request in `src/lib/theme/index.ts` →
`THEME_FONTS['ryans-jewels']`, and `scripts/rj-fonts-applied.mjs` confirms each
one actually lands on its elements.
