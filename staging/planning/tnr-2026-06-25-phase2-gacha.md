# TNR — 2026-06-25 — Phase 2 lot Gacha

## Commands

- **build**: OK (`node node_modules/typescript/bin/tsc -b && node node_modules/vite/bin/vite.js build`, exit 0)
- **lint**: FAIL pre-existing (8 errors, 13 warnings repo-wide via `npm run lint`; unchanged files e.g. `useGameSettings.tsx`, `vite-env.d.ts`)
- **lint (changed files)**: OK except pre-existing `GachaOpening.tsx` set-state-in-effect (not introduced by this lot)
- **validate:link-corpus**: N/A (link corpus untouched)

## Asset moves executed

| Source | Destination | Count |
|--------|-------------|-------|
| `public/gacha/icons/` | `assets/Gacha/icons/` | 16 SVG |
| `public/gacha/events/` | `assets/Gacha/events/` | 2 PNG |
| `public/gacha/cinema/` | `assets/Gacha/cinema/` | 29 files (video, frames, hostess) |
| `assets/gacha-frames/` | `assets/Gacha/sources/frames/` | 3 PNG |
| `assets/gacha/event/disagrea/manifest.json` | `assets/Gacha/event/disagrea/manifest.json` | 1 |
| Duplicate disagrea PNGs (public mirror) | `old_assets/gacha-event-disagrea-source-2026-06-25/` | 8 PNG + README |
| `public/gacha/` | Redirect README only | 1 |

**Total git renames**: 58. Runtime canonical tree: `assets/Gacha/` (50 tracked files).

## Code changes

- `vite.config.ts`: `repoGachaAssetsPlugin` — dev middleware `/gacha/*` → `assets/Gacha/`; build copies to `dist/gacha/` (excludes `sources/`)
- Scripts: `build-gacha-video.mjs`, `build-disagrea-gacha-video.mjs`, `import-disagrea-gacha-cinema.mjs`, `inventory-assets-manifest.mjs`
- `GachaOpening.tsx`: dev hint path updated

Runtime URLs unchanged: `/gacha/icons/…`, `/gacha/events/…`, `/gacha/cinema/…`

## Build smoke

- `dist/gacha/`: 48 files copied (cinema, events, icons, disagrea frames)
- Grep: no stale `public/gacha` refs in `src/` (runtime paths stay `/gacha/*`)

## Smoke (manual — not run in agent)

| # | Check | Status |
|---|-------|--------|
| 6 | Gacha UI opens | ☐ user |
| A6 | Disagrea cinema frames load | ☐ user |
| A1 | No 404 on `/gacha/icons/gift.svg` | ☐ user |

## 404 found

- None detected in build output or grep of `src/`

## Notes

- Windows: `assets/gacha` and `assets/Gacha` share one folder on disk; git index uses `assets/Gacha/` for Linux CI.
- `public/gacha/README.md` left as redirect note (dir not deleted).

## Blockers for lot 2 (Background)

- None blocking — gacha lot complete.
- Background lot is larger (~18 biome PNGs + dressage/hub paths), needs vite/public path strategy similar to gacha or extension of existing `/minigames/` rewrites.
- `assets/minigames/` source tree must be reconciled with `public/assets/minigames/` after move.

## Sign-off

- [x] Prêt lot 2 Background (pending user go)
