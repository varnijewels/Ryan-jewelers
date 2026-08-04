# Reskin Report — Boris & Twins ("Golden Legacy")

**Source:** `static/Boris & Twins` (18 HTML pages, 3 CSS files)
**Store:** Boris & Twins — fine jewelry storefront
**Generated:** 2026-07-06 (auto pass), corrected by hand same day.

## Palette (final roles)
Derived from the source `:root` custom properties in `css/roots.css` (authoritative),
not the auto color-frequency guess.

| Role | Hex | Source token |
|---|---|---|
| background | `#ffffff` | `--white` |
| foreground | `#202020` | `--ink` |
| primary | `#9E260E` | `--maroon` (brand) |
| primary-foreground | `#ffffff` | — |
| secondary | `#FBF2EE` | `--cream` (benefits band) |
| secondary-foreground | `#202020` | `--ink` |
| accent | `#E2A53C` | `--gold` (review stars / highlights) |
| accent-foreground | `#151515` | `--darkblack` |
| muted | `#F1EFEC` | warm light surface |
| muted-foreground | `#595454` | `--muted` |
| border / input | `#E9E9E9` | `--line` |
| destructive | `#C0392B` | error red |

## Typography
- Heading: **Bodoni Moda** (source `--serif` = `'Bodoni 72 old style'`; Bodoni Moda is the
  web-loaded match), weight 400, letter-spacing `.04em`.
- Body: **Jost** (source `--sans`), with Chivo for uppercase text-links/labels.
- Weights loaded: 300, 400, 500, 600, 700.

## Geometry
- Radius: `6px` (buttons 5–8px in source; 6px is the dominant value).
- Container: `1440px` (source `--maxw`), side gutter `--pad` 60px desktop.
- Transition: `.25s` with ease `cubic-bezier(.22, .61, .36, 1)`.
- Shadow: subtle `0 1px 2px hsl(0 0% 0% / .05)` — source relies on 1px borders, not heavy shadows.

## Sections detected for restyle
header · hero · explore/signature collection · product-card · product-grid ·
benefits bar (cream) · testimonial/review · instagram gallery · newsletter · footer

## Corrections applied over the auto pass
The auto generator mapped the literal word **"maroon"** (from `--maroon:#9E260E`) to the CSS
**named color** `maroon` = `#800000` and promoted that phantom to `primary`, demoting the real
brand color to `destructive`. Fixed the role table accordingly. Also fixed: broken
`--font-heading: 'var(--serif)'`, a nonsensical `25s` transition (→ `.25s`), a
`box-shadow: inset 0 0 0 1px var(--maroon)` that referenced an app-nonexistent variable, a
duplicated 18× font `<link>` block (deduped), and the store name/themeColor.

## Files
- `theme.css` — `:root` token block (drop into `src/app.css`).
- `tailwind.theme.cjs` — Tailwind `theme.extend` (colors, fonts, radius, container).
- `fonts.html` — Google Fonts links (Bodoni Moda + Jost + Chivo).
- `design-tokens.json` — full token analysis + corrected roles + raw source props.
- `store.config.json` — store metadata.

No warnings.
