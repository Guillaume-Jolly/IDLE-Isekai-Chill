# TNR — 2026-06-25 — Phase 2 lot Background

## Commands

- **build**: OK (`tsc -b && vite build`, exit 0)
- **lint**: FAIL pre-existing (8 errors, 13 warnings repo-wide via `npm run lint`; unchanged files e.g. `useGameSettings.tsx`, `vite-env.d.ts`, `lootExplain.ts`)
- **lint (changed files)**: OK — `vite.config.ts` clean; no `src/` changes this lot
- **validate:link-corpus**: N/A (link corpus untouched)

## Asset moves executed

| Source | Destination | Count |
|--------|-------------|-------|
| `public/assets/minigames/capture/biomes/*.png` | `assets/Background/{biomeId}/capture-wide.png` + `capture-portrait.png` | 18 PNG |
| `public/assets/minigames/dressage/enclosures/*.png` | `assets/Background/{biomeId}/dressage-wide.png` + `dressage-portrait.png` | 18 PNG |
| `assets/event-disagrea/backgrounds/` | `assets/Background/disagrea-event/` (affinity, minigame sources, manifest) | 22 files |
| `public/assets/minigames/capture/biomes/` | Redirect README only | 1 |
| `public/assets/minigames/dressage/enclosures/` | Redirect README only | 1 |

**Total git renames (lot Background)**: 58. Runtime canonical tree: `assets/Background/` (9 biomes × 4 PNG + disagrea-event extras).

Biomes: `prairie-solaire`, `foret-ancienne`, `marais-brumeux`, `montagnes-cristallines`, `desert-rouge`, `rivage-corallien`, `volcan-noir`, `ruines-astrales`, `disagrea-event`.

**Duplicates reconciled**: No biome PNG duplicates found under `assets/minigames/` (only Myrion/chibi sources). Nothing archived to `old_assets/` for this lot.

**Note (disagrea-event)**: Git index shows cross-renames between public runtime PNGs and `minigame/` sources on Windows; on-disk content verified identical (same byte sizes). Runtime files at biome root (`capture-wide.png`, etc.) are correct.

## Code changes

- `vite.config.ts`: `repoBackgroundAssetsPlugin` — dev middleware maps runtime URLs → `assets/Background/`; build copies to `dist/assets/minigames/capture/biomes/` and `dist/assets/minigames/dressage/enclosures/`
- `scripts/minigame-asset-paths.mjs`: `backgroundAssetPaths` helpers
- Import/promote scripts updated to write/read `assets/Background/`:
  - `import-biome-backgrounds.mjs`, `import-enclosure-portraits.mjs`
  - `generate-biome-portraits.mjs`, `generate-enclosure-portraits.mjs`
  - `import-disagrea-assets.mjs`, `import-myrions-assets.mjs`
  - `promote-companion-visual-pack.mjs`, `staging/setup-companion-visual-pack.mjs`
  - `inventory-assets-manifest.mjs` (class `runtime:background`)
- **No `src/` changes** — runtime paths in `minigameAssets.ts` unchanged

## Build smoke

- `dist/assets/minigames/capture/biomes/`: 18 PNG copied
- `dist/assets/minigames/dressage/enclosures/`: 18 PNG copied
- Manifest regenerated: 1990 images, 56 classified `runtime:background`

## Runtime URLs verified unchanged

| URL pattern | Served from |
|-------------|-------------|
| `/assets/minigames/capture/biomes/{biomeId}.png` | `assets/Background/{biomeId}/capture-wide.png` |
| `/assets/minigames/capture/biomes/{biomeId}-portrait.png` | `assets/Background/{biomeId}/capture-portrait.png` |
| `/assets/minigames/dressage/enclosures/{biomeId}.png` | `assets/Background/{biomeId}/dressage-wide.png` |
| `/assets/minigames/dressage/enclosures/{biomeId}-portrait.png` | `assets/Background/{biomeId}/dressage-portrait.png` |
| `/minigames/biomes/{biomeId}.png` | legacy rewrite → capture path above |
| `/minigames/enclosures/{biomeId}.png` | legacy rewrite → dressage path above |

Disagrea story/event paths in `disagreaStory.ts` and `eventDisagreaPack.ts` use the same runtime URLs — no change needed.

Hub backgrounds (`public/assets/minigames/hub/`): only `.gitkeep` — out of scope.

## Smoke (manual — not run in agent)

| # | Check | Status |
|---|-------|--------|
| 4 | Chasse — biome fond visible (ex. prairie-solaire) | ☐ user |
| 5 | Dressage — enclos fond visible | ☐ user |
| D3 | Biome disagrea-event capture | ☐ user |
| D4 | Disagrea dressage enclos | ☐ user |
| A1 | No 404 on `/assets/minigames/capture/biomes/prairie-solaire.png` | ☐ user |
| A5 | Biome background capture scene | ☐ user |

## 404 found

- None detected in build output or grep of `src/`

## Blockers for lot 3 (Myrions)

- None blocking — Background lot complete.
- Lot 3 scope: `public/assets/minigames/capture/myrions/cutout/`, `dressage/myrions/chibi/`, silhouettes → `assets/Myrions/{biomeId}/`
- Needs new vite plugin (or extend pattern) for Myrion runtime URLs; `assets/minigames/` partial source merge still pending per mapping
- Hub presentations/stages remain empty placeholders

## Sign-off

- [x] Prêt lot 3 Myrions (pending user go)
