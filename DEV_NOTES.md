# Development Notes

## Latest development batch

- Previous base Git commit: `e201fdd` on `main`
- Push target: `https://github.com/varnijewels/Ryan-jewelers.git`
- Git push policy: push only when the user explicitly asks.
- Guest account popup:
  - Opens directly below the account arrow with an `8px` gap.
  - Popup width: `250px`; padding: `14px 14px 10px`.
  - Sign-in button: full inner width (`222px`), `40px` height, Sarala Regular `16px/24px`.
  - Menu rows: `42px` height, Sarala Regular `16px/24px`, `10px` column gap.
  - Supplied SVG icons render at `21×21px` with `1.2px` stroke.
- Modified files:
  - `src/lib/theme/ryans-jewels/RyansJewelsNav.svelte`
  - `static/ryans-jewels/icons/order-history.svg`
  - `static/ryans-jewels/icons/track-order.svg`
  - `static/ryans-jewels/icons/rewards.svg`
  - `static/ryans-jewels/icons/my-profile.svg`
- Verification before push: `git diff --check` passes.

## Push checklist

1. Update this note with any newer local changes.
2. Run the relevant test/build.
3. Show `git status --short` and summarize changed files.
4. Commit and push only after the user says to push.
