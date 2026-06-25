# Current State

Last updated: 2026-06-25 by Cursor (Phase 5 COMPLETE — main = V2 baseline).

## Active initiative

**Build on V2 baseline** — `origin/main` and `origin/Backup` at `60eb5d5`.

- User is sole interlocutor (Codex out of loop).
- Single `assets/` tree + unified `vite.repo-assets.ts`; `staging/` + `Input chatgpt/` preserved.
- Phase 4 WebP: **deferred** (`staging/planning/phase4-webp-assessment.md`).

## Phase status

| Phase | Status | Artefacts |
|-------|--------|-----------|
| 0–3 | Done | Playbooks, TNR phase2/3, `vite.repo-assets.ts` |
| 4 | Deferred | WebP assessment + size scans |
| 5 | Done | `staging/planning/phase5-main-v2-baseline.md`; main force-pushed to V2 |

## Decisions locked

- No file deletions — archive to `old_assets/` only.
- French folder names on disk; runtime URLs unchanged.
- Cutouts v3 mass promote: stopped unless user reopens.

## Validation baseline

```bash
npm run build
npm run lint          # 8 pre-existing errors
npm run validate:link-corpus
node scripts/inventory-assets-manifest.mjs
```

Last TNR at baseline push: build OK, lint fail (pre-existing), corpus OK, manifest OK.

## Next step

Manual smoke + P0 conversation UI (emotion cutouts). See `.ai/next-task.md`.
