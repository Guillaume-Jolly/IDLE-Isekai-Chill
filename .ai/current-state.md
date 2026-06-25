# Current State

Last updated: 2026-06-25 by Cursor (Phase 4 assessment COMPLETE — DEFER).

## Active initiative

**Assets 2.0 cleanup** — Phase 4 assessed and deferred; Phase 5 next.

- User is sole interlocutor (Codex out of loop).
- Target: single `assets/` tree, `old_assets/` archive, preserve `staging/` + `Input chatgpt/`.
- Backup branch: `origin/Backup` (snapshot commit `06961a1`).

## Phase status

| Phase | Status | Artefacts |
|-------|--------|-----------|
| 0 | ✅ Done | `asset-manifest.json`, inventory script, Backup push |
| 1 | ✅ Done | `staging/playbooks/` (00–06) |
| 2 | ✅ Done | All lots: Gacha, Background, Myrions, Compagnons, legacy — TNR `tnr-2026-06-25-phase2-complete.md` |
| 3 | ✅ Done | Unified `vite.repo-assets.ts`, Talia guides migrated — TNR `tnr-2026-06-25-phase3.md` |
| 4 | ⏸️ **Deferred** | WebP not required — `staging/planning/phase4-webp-assessment.md`, size scans in `staging/planning/phase4-size-scan*.json` |
| 5 | — | Prep commit `main` 2.0 |

## Decisions locked

- No file deletions — archive to `old_assets/` only.
- Cutouts v3 mass promote: **stopped** — cleanup priority.
- French folder names on disk (`Compagnons/affinite/...`, `Gacha/`, `Background/`, `Myrions/`).
- Runtime URLs unchanged; served from `assets/` via unified `repoAssetsPlugin` (`vite.repo-assets.ts`).
- Guide cutouts: `assets/Compagnons/{id}/Autres/guide/` → `/assets/minigames/capture/companions/{id}/`.
- **Phase 4 WebP: deferred** — large PNGs exist (biome bgs 3–4 MB) but on-demand loading + existing partial WebP (village, gacha opening) = no clear need before 2.0 commit.

## Validation baseline

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

Last TNR: `staging/planning/tnr-2026-06-25-phase3.md` — build OK, lint pre-existing failures, validate OK.

## Next step

**Relecture globale collaborative** — `staging/planning/global-2.0-readiness-audit.md`. Pas de push main sans go explicite user.
