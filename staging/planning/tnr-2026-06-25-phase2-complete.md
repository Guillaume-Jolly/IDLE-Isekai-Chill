# TNR — 2026-06-25 — Phase 2 COMPLETE

## Commands

- **build**: OK (`tsc -b && vite build`, exit 0)
- **lint**: FAIL pre-existing (8 errors, 13 warnings repo-wide; unchanged files e.g. `useGameSettings.tsx`, `GachaOpening.tsx`, `lootExplain.ts`)
- **lint (changed files)**: OK — `vite.config.ts` clean; minimal `src/` path updates only (`companionAssets.ts`, `devVisualRepoPaths.ts`, `integratedPortraitPrompts.ts`)
- **validate:link-corpus**: OK (7500 conversations, exit 0)

## Asset moves executed

### Lot 3 — Myrions

| Source | Destination | Count |
|--------|-------------|-------|
| `public/assets/minigames/capture/myrions/cutout/*.png` | `assets/Myrions/{biomeId}/cutout/` | 102 |
| `public/assets/minigames/dressage/myrions/chibi/*.png` | `assets/Myrions/{biomeId}/chibi/` | 102 |
| `public/assets/minigames/capture/myrions/silhouette/*.png` | `assets/Myrions/{biomeId}/silhouette/` | 85 |
| Redirect READMEs | `public/.../myrions/{cutout,chibi,silhouette}/` | 3 |

**Biomes**: 8 catalogue + `disagrea-event` (Disagrea Myrions + chimerelle LR).

**Sources reconciled**: `assets/minigames/` chibi/cutout source trees retained (no runtime duplicates to archive).

### Lot 4 — Compagnons

| Source | Destination | Count |
|--------|-------------|-------|
| `public/assets/companions/{id}/affinity-{1-5}.png` | `assets/Compagnons/{id}/affinite/` | 95 |
| `public/assets/companions/{id}/emotion-*.png` | `assets/Compagnons/{id}/cutouts/` | 152 |
| `public/assets/companions/{id}/chibi.png` | `assets/Compagnons/{id}/chibis/` | 19 |
| `public/assets/companions/{id}/affinity-4-nsfw.png` | `assets/Compagnons/{id}/NSFW/` | 4 |
| `assets/event-disagrea/integrated/companions/` | `assets/Compagnons/{id}/Autres/disagrea-integrated/` | 24 |
| Redirect README | `public/assets/companions/` | 1 |

**Companion IDs**: 15 village + 4 Disagrea (19 total).

### Lot 5 — Legacy cleanup

| Source | Destination | Count |
|--------|-------------|-------|
| `public/companions/` mirror | git deletions + README redirect | 270 (hardlinked to `public/assets/companions/` on Windows — content preserved in `assets/Compagnons/`) |

No separate `old_assets/public-companions-legacy/` copy needed (identical inode, already moved via assets path).

## Code changes

- `vite.config.ts`: `repoMyrionAssetsPlugin`, `repoCompanionAssetsPlugin`; `repoEventDisagreaAssetsPlugin` resolves integrated from `assets/Compagnons/{id}/Autres/disagrea-integrated/`
- `scripts/minigame-asset-paths.mjs`: `myrionAssetPaths`, `companionAssetPaths`
- `scripts/apply-phase2-myrions-companions.mjs`: one-shot migration (reusable)
- Import/promote scripts updated: `import-myrions-assets.mjs`, `import-myrions-chibis.mjs`, `import-disagrea-assets.mjs`, `promote-companion-visual-pack.mjs`, `regenerate-emotion-cutouts.mjs`, `regenerate-village-chibis.mjs`, `restore-companion-ai-art.mjs`, `promote-disagrea-integrated-affinity.mjs`, `inventory-assets-manifest.mjs`
- `src/data/companionAssets.ts`, `devVisualRepoPaths.ts`, `integratedPortraitPrompts.ts`: integrated repo paths only
- **Runtime URL helpers unchanged** in `minigameAssets.ts` and `companionAssets.ts` (public URL strings)

## Build smoke

- `dist/assets/minigames/capture/myrions/cutout/`: 103 PNG (102 + README or extra)
- `dist/assets/minigames/dressage/myrions/chibi/`: 103 PNG
- `dist/assets/companions/`: 270 PNG (flat runtime layout preserved)
- Manifest regenerated: 1720 images — `runtime:myrions` 289, `runtime:companions` 294, `runtime:background` 56

## Runtime URLs verified unchanged

| URL pattern | Served from |
|-------------|-------------|
| `/assets/minigames/capture/myrions/cutout/{speciesId}.png` | `assets/Myrions/{biomeId}/cutout/{speciesId}.png` |
| `/assets/minigames/dressage/myrions/chibi/{speciesId}.png` | `assets/Myrions/{biomeId}/chibi/{speciesId}.png` |
| `/assets/minigames/capture/myrions/silhouette/{speciesId}.png` | `assets/Myrions/{biomeId}/silhouette/{speciesId}.png` |
| `/minigames/palmons/{speciesId}.png` | legacy rewrite → cutout path above |
| `/minigames/palmons/chibi/{speciesId}.png` | legacy rewrite → chibi path above |
| `/minigames/palmons/silhouettes/{speciesId}.png` | legacy rewrite → silhouette path above |
| `/assets/companions/{id}/affinity-{n}.png` | `assets/Compagnons/{id}/affinite/` |
| `/assets/companions/{id}/emotion-{emotion}.png` | `assets/Compagnons/{id}/cutouts/` |
| `/assets/companions/{id}/chibi.png` | `assets/Compagnons/{id}/chibis/` |
| `/assets/companions/{id}/affinity-4-nsfw.png` | `assets/Compagnons/{id}/NSFW/` |
| `/companions/{id}/...` | legacy rewrite → `/assets/companions/...` |
| `/dev-assets/event-disagrea/integrated/companions/{id}/...` | `assets/Compagnons/{id}/Autres/disagrea-integrated/` |

Background + Gacha URLs unchanged from prior lots (see `tnr-2026-06-25-phase2-background.md`, `tnr-2026-06-25-phase2-gacha.md`).

## Smoke (manual — not run in agent)

| # | Check | Status |
|---|-------|--------|
| 1 | Chasse — Myrion cutout visible | ☐ user |
| 2 | Dressage — chibi visible | ☐ user |
| 3 | Compagnon portrait affinity | ☐ user |
| 4 | Emotion cutout in link UI | ☐ user |
| 5 | Disagrea dev gallery integrated scenes | ☐ user |
| A1 | No 404 on `/assets/minigames/capture/myrions/cutout/moussprout.png` | ☐ user |
| A2 | No 404 on `/assets/companions/talia/affinity-1.png` | ☐ user |

## Blockers for Phase 3

- None blocking — Phase 2 complete.
- Phase 3 scope: refactor `vite.config.ts` to single-root `assets/` (remove per-lot plugins), update `publicAssetUrl` / path helpers in `src/` if desired, shrink `public/` to minimal static shell.
- Hub minigame presentations/stages remain empty placeholders (`.gitkeep` only).
- Talia guide cutouts still under `public/assets/minigames/capture/companions/talia/` (out of Phase 2 scope).

## Sign-off

- [x] Phase 2 COMPLETE — ready for Phase 3 (Vite single-root refactor)
