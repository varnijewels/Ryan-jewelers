# Development Notes

## Latest development batch

- Previous base Git commit: `95c7faf` on `main`
- Push target: `https://github.com/varnijewels/Ryan-jewelers.git`
- Product-list filter animation:
  - Filter icon rotates and its slider knobs shift smoothly between Show/Hide states.
  - Desktop sidebar slides/fades while the product grid expands or contracts smoothly.
  - Responsive filter drawer uses the same softer easing without changing its UI.
  - Reduced-motion preference disables the transitions.
- Modified files:
  - `src/lib/theme/ryans-jewels/RyansJewelsListingPage.svelte`
  - `DEV_NOTES.md`
- Verification: `git diff --check` and `npm run build` pass.

## Push checklist

1. Update this note with any newer local changes.
2. Run the relevant test/build.
3. Show `git status --short` and summarize changed files.
4. Commit and push only after the user says to push.
