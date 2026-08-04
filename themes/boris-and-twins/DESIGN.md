# Boris & Twins — Theme Design Notes ("Golden Legacy")

Source: `static/Boris & Twins/` (18 static HTML pages + `css/roots.css`, `css/style.css`, `css/responsive.css`).
A fine-jewelry storefront. `roots.css` `:root` custom properties are the authoritative token source.

## Tokens (see `theme.css` / `design-tokens.json`)
- **Primary / brand** `--maroon #9E260E` (deep terracotta-maroon). Used for CTAs, price-old strikethrough,
  active tabs, icon accents, focus ring.
- **Foreground** `--ink #202020`. **Body bg** white. **Muted text** `--muted #595454`.
- **Secondary band** `--cream #FBF2EE` (benefits bar background).
- **Accent** `--gold #E2A53C` (review stars, sparkle star).
- **Borders** `--line #E9E9E9` / `--line-2 #D9D9D9`. **Radius** 6px (buttons 5–8px).
- **Container** 1440px, side gutter 60px desktop → 32px (≤1024) → 18px (≤640).
- **Ease** `cubic-bezier(.22,.61,.36,1)`, transitions ~.25s.

## Typography
- **Headings** Bodoni Moda (source `--serif`), weight 400, letter-spacing .04em, uppercase for product names.
- **Body** Jost (source `--sans`); **Chivo** for uppercase eyebrows / text-links.

## Homepage sections (order preserved from source `index.html`)
1. **Hero** — centered serif "GOLDEN LEGACY" title, full-bleed banner, "Quiet Straight" caption, glass "Watch now" pill.
2. **Explore Our Signature Collection** — 4 category tiles (Pendent / Chain / Rings / Earring) → catalogue search.
3. **Our Most Loved Design** — 5-col product grid, **live API products** (fallback static jewelry when API empty).
4. **Benefits bar** — cream band, 4 items (Free Shipping, Costume Jewelry, Expert Support, 30 Day Return), maroon icons.
5. **Effortless Sparkle** — figure + 2×2 mini-cards, maroon eyebrow, gold star.
6. **Crafting narrative** — large serif paragraph with inline images.
7. **Best Sellers** — tabs (Ring's/Bracelet/Earring's/Chain) + 5-col grid, live products.
8. **All The Happy Review** — testimonial with gold star rating and index counter.
9. **#B&TJEWELRY** — 6-col Instagram gallery with hover overlay.

## Component mapping (source → app)
- Product card → `BorisAndTwinsProductCard.svelte` (wraps `ProductCardRenderer`; preserves wishlist + add-to-cart).
  Bordered card, serif uppercase name, `price-now` + maroon strikethrough `price-old`, maroon "Add" button, wish-btn.
- Header → `BorisAndTwinsNav.svelte` (theme-specific, wired in `nav.svelte` by `activeThemeName`). Reproduces the
  source header exactly: announce bar (mobile) / centered tagline "MADE TO ORDER : CRAFTED WITHIN 7-10 DAYS",
  **Chonburi** maroon logo, 1px vertical dividers between icon slots, and the mega-menu row
  (ALL JEWELRY ⌄ · VINTAGE JEWELRY · CUSTOM JEWELRY · SERVICE · ABOUT · CONTACT, Chivo 16px #595454 → maroon hover).
  Reuses app `MsSearch` / `CartSidebar` / `ProfileDropdown` / `AuthButton` so search, cart, and auth keep working;
  wishlist link + count rendered locally. Mobile hamburger opens `navModule.openSidebar`.
- Footer → `BorisAndTwinsFooter.svelte` (theme-specific, wired in `common/footer.svelte`). Reproduces the source
  footer exactly: brand (Bodoni 700 maroon) + newsletter row; 4 link columns (About **B&T** / Order & support /
  customer service / contact us) + payment-card block (Mastercard, PayPal, Visa, Amex, Apple Pay, Discover as inline
  SVGs); bottom bar with copyright + circular social icons (Instagram, WhatsApp, Facebook, Twitter). Obvious source
  typos ("TARCK", "BORIES", "REVERED") cleaned; links mapped to real app routes.
- **Always build theme-specific Nav + Footer to match the source** — do not leave the generic app chrome.
- Icons → `@lucide/svelte` (Truck, Gem, Headphones, RotateCcw, Star, Play, ArrowRight, ChevronDown, Menu, UserRound,
  Heart, Camera for the IG overlay — this Lucide build has no `Instagram` glyph; footer socials use inline SVGs).

## Fonts
Bodoni Moda (headings/footer brand) · Jost (body) · Chivo (eyebrows, nav, tagline) · **Chonburi** (header logo).
Loaded via `THEME_FONTS['boris-and-twins']` in `src/lib/theme/index.ts` and `fonts.html`.

## Wiring (how this theme is applied)
- Colors: `[data-theme='boris-and-twins']` block in `src/app.css`.
- Registry: `AVAILABLE_THEMES` + `THEME_FONTS` in `src/lib/theme/index.ts`.
- Homepage component: `src/lib/theme/boris-and-twins/BorisAndTwinsHomepage.svelte` → registered in `homepages.ts`.
- Homepage content: `src/lib/theme/boris-and-twins/homepage-content.ts` → registered in `homepage-content.ts`.
- Assets: `static/boris-and-twins/images/…` (copied from source `assets/images`).
- Active theme selected via `.env` `PUBLIC_STOREFRONT_THEME='boris-and-twins'` (admin store setting overrides env when present).

## Fidelity rules honored
- Live commerce (products/prices) comes from the API only; theme content (hero copy, tiles, benefits, footer) is static.
- Static jewelry cards render only as an empty-state fallback and hide cart controls (no invented live products).
- Source palette balance preserved: maroon CTAs + cream benefit band + gold stars, not a single dominant color.
