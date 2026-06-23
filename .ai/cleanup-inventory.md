# Cleanup Inventory - 2026-06-24

## Decision

Target direction: get Disagrea online, but do not publish it from the current mixed working tree.

The safe path is:

1. Preserve and commit the AI coordination layer.
2. Isolate the minigame asset path migration.
3. Validate the app against the migrated runtime paths.
4. Then integrate Disagrea assets/runtime on top of that stable base.
5. Keep generated release artifacts and old asset backups out of gameplay commits unless explicitly needed.

## Working Tree Categories

Snapshot from `git status --short --untracked-files=all` on 2026-06-24.

| Group | Count | Meaning | Risk |
|---|---:|---|---|
| coordination | 13 | `AGENTS.md`, `.ai/*`, `.cursor/rules/*` | Low. Safe to commit first. |
| minigame migration deletes | 318 | tracked `public/minigames/*` removed | Medium. Intended relocation, but must be paired with new paths. |
| minigame migration adds | 337 | new `public/assets/minigames/*` runtime assets | Medium. Should be committed with path rewrites and validation. |
| Disagrea assets | 257+ | `assets/event-disagrea/*`, `assets/events/*`, `public/companions/{etna,flonne,laharl,pleinair}` | Medium/high. Valuable, but too large to mix with migration. |
| Disagrea runtime | 1 | `src/data/eventDisagreaPack.ts` | Medium. Needs build/type validation. |
| companion portrait runtime | 6 | new portrait component/hooks/helpers | Medium. UI/runtime change; validate visually. |
| docs | 4 | README/backlog/TNR docs | Low/medium. Split by topic. |
| scripts | 23 | import/generation/path scripts | Medium. Should pair with migration or Disagrea import commit. |
| source runtime | 18 | app/minigame components, data maps, vite config | High. Needs build/lint/visual checks. |
| generated noise | 1 | `build-revision.json` | Low. Prefer separate chore or revert/ignore if generated. |
| release artifacts | 7 | launcher zip/exe/install files | Medium. Do not mix with gameplay/assets. |
| legacy asset sources | 5 | old `assets/source-*` deletions | Low/medium. Commit as cleanup only if final PNG outputs are confirmed. |
| old asset backups | 335+ | `old_assets/*` | Medium. Keep out of runtime commits unless needed for archival. |

## Recommended Commit Plan

### Commit 1 - AI coordination layer

Files:

- `AGENTS.md`
- `.cursor/rules/00-wonderland-core.mdc`
- `.ai/*`

Purpose: make Cursor/Codex handoff persistent.

Validation: none required beyond file review.

### Commit 2 - Minigame asset path migration

Files:

- Deletes under `public/minigames/*`
- Adds under `public/assets/minigames/*`
- Path helpers/config/data needed for legacy rewrites, likely `vite.config.ts`, `src/data/minigameAssets.ts`, `src/data/palmonArtHints.ts`, `src/data/wildFamiliars.ts`, relevant import scripts.

Purpose: make the new runtime asset layout canonical.

Validation:

- `npm run build`
- `npm run lint`
- quick visual check of hunt/refuge/minigame backgrounds and Myrion sprites.

Decision: commit this before Disagrea. Do not keep both paths long-term unless build/visual checks show compatibility risk.

### Commit 3 - Companion portrait runtime

Files:

- `src/components/CompanionPortrait.tsx`
- `src/components/CompanionPortrait.css`
- `src/hooks/useCompanionPortraitAssets.ts`
- `src/hooks/usePublicAssetSrc.ts`
- `src/data/publicAssetUrl.ts`
- `src/data/companionPortraitHints.ts`
- related edits in `ConversationGame.tsx`, `CompanionMiniature.tsx`, `ImageLightbox.*`, `Minigames.css` if required.

Purpose: introduce layered/affinity portrait support separately from Disagrea content.

Validation:

- `npm run build`
- `npm run lint`
- visual check of companion conversation screen and lightbox.

### Commit 4 - Disagrea assets staging/import

Files:

- `assets/event-disagrea/*`
- `assets/events/disagrea/*`
- `public/companions/{etna,flonne,laharl,pleinair}/*`
- Disagrea-specific import/organize scripts.

Purpose: add event source/generated assets without gameplay logic surprises.

Validation:

- file inventory review
- spot-check images manually/visually

### Commit 5 - Disagrea runtime wiring

Files:

- `src/data/eventDisagreaPack.ts`
- `src/data/companionAssets.ts`
- Disagrea additions in `src/data/myrionRefuge.ts`, `src/data/minigameAssets.ts`, `src/components/minigames/*` only if strictly required.
- `docs/TNR_EVENT_DISAGREA.md`

Purpose: make Disagrea visible/playable.

Validation:

- `npm run build`
- `npm run lint`
- `npm run validate:link-corpus`
- visual check: companion portraits, hunt biome/event background, refuge/dressage sprites.

### Commit 6 - Release packaging / generated outputs

Files:

- `release/*`
- `scripts/Jouer-IDLE-Isekai-Chill.bat`
- `scripts/play-idle-isekai-chill.ps1`
- `build-revision.json` only if intentionally versioned.

Purpose: package after runtime validation, not before.

Validation:

- `npm run build`
- launcher smoke check if needed.

## Publishing Recommendation

Publish Disagrea only if commits 2, 3, and 5 pass build/lint and a basic visual smoke test.

If time runs short, publish a stable build without Disagrea runtime wiring, but keep Disagrea assets staged for the next pass.

## Current Next Safe Action

Commit the coordination layer first, then start Commit 2 as a bounded migration task.
