# Development Notes

## Product details latest Figma refinements (not pushed)

- Matched Figma node `216:41922`: added the 30px product-section offset, the three-tone Metal Color row, and removed the previous Expedite Delivery Date card.
- Metal swatches use admin-store variation values when available and update the selected product variant; products without selectable metal variants keep the same Figma swatch presentation.
- Cart, Buy Now, Share, ZIP lookup and all existing product-detail functionality remain unchanged.
- Verification: logic self-check, scoped diff check, production build, and 1440px/mobile browser checks pass with no page errors.

## Homepage hero video (not pushed)

- Replaced only the Ryan Jewelers homepage hero image with the exact MP4 video fill from Figma node `1:6861` inside screen `1:6509`.
- The existing image remains the poster/fallback; hero sizing, responsive crops, link, chat widget and every other homepage section are unchanged.
- Added asset: `static/ryans-jewels/home/hero.mp4`.
- Verification: `npm run build` passes; desktop 1920px and mobile 412px browser checks confirm the MP4 autoplays muted, loops, advances frames and has no page errors. The repository-wide `npm run check` remains blocked by its existing unrelated diagnostics.

## Product details page batch (not pushed)

- Base Git commit: `9aaea88` on `main`.
- Added the Ryan Jewelers Figma product-details layout to the shared `/products/[slug]` route, so every listing product opens the same details view.
- Product title, gallery, thumbnails, prices, discount, category, stock, description, variants/options, specifications and related products use live admin-store data.
- Gallery selection, variant selection, quantity, wishlist/login fallback, Add to Bag, Buy Now and sharing are wired to the existing commerce state.
- Added exact exported Figma icons/payment marks under `static/ryans-jewels/product/` and responsive desktop/tablet/mobile styling.
- Node `1:16809` stays exact at 1440px (1320px content, 648px columns, 24px gap) and scales responsively at 1920px (1760px content, 864px columns, 32px gap).
- Node `1:16873` customise-variation section uses its original Figma filter, arrow, diamond, metal and 16-layer ring SVG assets; the three cards stay connected to admin product options/variants.
- Variation-card icons are 21px; Diamond heading stays left-aligned while all selected values are centered and use 22px Sarala Bold.
- Payment logos use the Figma container sizes and image crop offsets, removing source-image whitespace while preserving the original assets.
- Gallery actions preserve each SVG's native aspect ratio; the supplied square `comper.svg` fills its action button while heart and eye are no longer forced into square dimensions.
- Product-detail actions are wired: logged-out wishlist opens login, selected variants toggle wishlist, compare persists locally, price breakup toggles, Customise opens the native selector, cart/buy/share return feedback, and ZIP input supports Enter lookup plus browser location.
- Existing non-Ryan themes, product listing UI, navigation and footer were not changed.
- Verification: logic self-check, `npm run check`, `npm run build`, desktop/mobile screenshots and a browser variant-selection/page-error check pass.

## Latest development batch

- Previous base Git commit: `7bfc48a` on `main`
- Push target: `https://github.com/varnijewels/Ryan-jewelers.git`
- Product-list filter animation:
  - Filter icon stays upright; its two slider knobs move in opposite directions with lively easing between Show/Hide states.
  - Desktop sidebar slides/fades while the product grid expands or contracts smoothly.
  - Responsive filter drawer uses the same softer easing without changing its UI.
  - Reduced-motion preference disables the transitions.
- Product-list “View as” controls match the supplied reference: filled gold grid icon and grey outlined list icon.
- Modified files:
  - `src/lib/theme/ryans-jewels/RyansJewelsListingPage.svelte`
  - `DEV_NOTES.md`
- Verification: `git diff --check` and `npm run build` pass.

## Push checklist

1. Update this note with any newer local changes.
2. Run the relevant test/build.
3. Show `git status --short` and summarize changed files.
4. Commit and push only after the user says to push.
