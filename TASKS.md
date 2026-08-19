# Tasks

## Active

## Waiting On

- [ ] **Configure secure card payments and saved-card tokens** - waiting on Ryan/Varni backend or payment-provider configuration since 2026-08-15
  - Live `GET /api/payment-methods` succeeds but returns an empty `data` array, so checkout has no active gateway to open.
  - Saved cards require provider-tokenized payment methods plus a backend endpoint that returns only masked metadata (`brand`, `last4`, expiry and token ID).
  - Never store raw card numbers or CVV in this frontend, local storage or the Litekart database.
- [ ] **Allow non-purchased users to submit product reviews** - waiting on Ryan/Varni backend repository access or API-team change since 2026-08-14
  - Confirmed policy: any signed-in user may review; purchase is not required.
  - Current endpoint `POST /api/products/ratings-and-reviews` rejects non-purchasers with `You have not purchased this product or variant.`
  - Backend change should remove the purchase check while retaining authentication, one review per user/product and moderation protection.
  - Frontend review form and submission are already connected; alternate `POST /api/reviews` is unavailable (`404`).

## Someday

## Done
