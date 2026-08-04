# Ryan Jewelers — theme design notes

> **Homepage sections 2–16 are documented in [BUILD-LOG.md](./BUILD-LOG.md)** —
> per-section Figma node IDs, the reusable-component inventory, the cross-store
> recipe, and the verification results. This file covers the header contract and
> the shared token/asset foundations.

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
