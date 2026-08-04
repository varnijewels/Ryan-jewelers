# Development Notes

## Latest development batch

- Previous base Git commit: `fd66ba8` on `main`
- Push target: `https://github.com/varnijewels/Ryan-jewelers.git`
- Ryan Jewels mega menu:
  - Desktop top-level items, nested items, links and thumbnails now come from the admin store's mega-menu/header-menu data.
  - The admin `Home` item keeps the existing separate Home position and divider.
  - Admin categories with children open a Ryan-styled dynamic panel; leaf categories remain direct links.
  - Mobile already used the same admin category hierarchy, so desktop and responsive navigation now share the admin source.
  - Static Ryan menu content remains only as a loading/API-failure fallback.
- Modified files:
  - `src/lib/theme/ryans-jewels/RyansJewelsNav.svelte`
  - `src/lib/theme/ryans-jewels/RjAdminMegaMenu.svelte`
  - `src/lib/theme/ryans-jewels/admin-menu.ts`
  - `tests/ryans-admin-menu.test.ts`
  - `DEV_NOTES.md`
- Verification: live admin API response checked, targeted Vitest passes, `git diff --check` passes, and `npm run build` passes.

## Push checklist

1. Update this note with any newer local changes.
2. Run the relevant test/build.
3. Show `git status --short` and summarize changed files.
4. Commit and push only after the user says to push.
