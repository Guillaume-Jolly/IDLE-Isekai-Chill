# Next Task

## Active Task

**Assets 2.0 — Phase 5: main commit prep**

Phase 4 WebP assessed and **deferred** (2026-06-25). Assessment: `staging/planning/phase4-webp-assessment.md`.

## User Goal

Single `assets/` source-of-truth tree with minimal `public/`:

- `assets/Compagnons/<id>/affinite|cutouts|chibis|NSFW|Autres/<batch>/` ✅
- `assets/Background/<biomeId>/` ✅
- `assets/Myrions/<biomeId>/` ✅
- `assets/Gacha/` ✅
- Unified Vite plugin (`vite.repo-assets.ts`) ✅
- `old_assets/` for archived unused assets
- `staging/` and `Input chatgpt/` untouched

## Immediate Step

**Relecture globale avec user** — `staging/planning/global-2.0-readiness-audit.md`

⚠️ **Aucun push `main` autorisé** — user n'a pas donné le go pour écraser main. Phase 5 subagent lancé par erreur ; rien n'a été poussé sur main.

Ordre :
1. Valider checklist P0 ensemble (Input chatgpt, TNR, smoke)
2. Commit baseline local + Backup
3. P1 optionnel (miroirs public/assets, lint)
4. **Go explicite user** requis pour tout push main

## Phase 4 outcome (deferred)

- Verdict: **DEFER** — WebP not necessary before 2.0 commit
- 1 149 images scanned (`assets/` + `public/`), 667 > 1 MB; runtime critical path ~2.7–5.1 MB per capture scene (on-demand)
- WebP already in use: village `panorama-base.webp`, gacha `opening.webm`/`.webp`, cinema frames 00–05
- If perf issues later: selective opaque biome backgrounds only (~40–50 MB potential savings) — requires user approval

## Completed (Phase 3)

- Consolidated 4 vite plugins → `repoAssetsPlugin` in `vite.repo-assets.ts`
- `legacyPublicAssetPlugin` + mapping table exported from same module
- Talia guide cutouts: `public/.../talia/` → `assets/Compagnons/talia/Autres/guide/` (10 files)
- Scripts: `minigame-asset-paths.mjs` + 5 import/promote scripts → `assets/` paths
- Redirect READMEs updated (gacha, biomes, myrions, companions, talia guides)
- Manifest regenerated (1720 images)

## Coordination

- **Guillaume (user)** — sole decision maker. No Codex coordination.
- Cutouts v3 promote: **stopped** — do not resume without explicit user request.
- Backup before major work: `git push origin HEAD:Backup --force` (user authorized).
- **No commit** unless user explicitly asks.

## Validation For Any Cleanup Commit

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

Visual smoke: companions, Myrions, gacha, minigames, Disagrea event, Talia guide overlay — see TNR checklist.

## Hard Exclusions

- Do not delete assets — move to `old_assets/`.
- Do not touch `Input chatgpt/`.
- Do not push to `main` without user sign-off.
- Do not remove content from `staging/` (OK to add/move .md to planning).
- Do not convert assets to WebP unless user explicitly reopens Phase 4 after perf evidence.

## Phase 5 blockers (none critical)

- ~606 PNG mirrors under `public/assets/` (~189 MB) — archive target before clean baseline
- Readiness audit: `staging/planning/global-2.0-readiness-audit.md`
- Lint: 8 errors + 13 warnings pre-existing (confirmed 2026-06-25)
