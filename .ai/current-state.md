# Current State

Last updated: 2026-06-25 by Cursor (user-only coordination).

## Active initiative

**Assets 2.0 cleanup** — Phase 0 in progress.

- User is sole interlocutor (Codex out of loop).
- Target: single `assets/` tree, `old_assets/` archive, preserve `staging/` + `Input chatgpt/`.
- Backup branch: `origin/Backup` (snapshot before moves).

## Phase 0 status

- Manifest: `staging/planning/asset-manifest.json` (~1990 images indexed).
- Plan: `staging/planning/PHASE0-assets-2.0.md`.
- Cutouts v3 promotion: **stopped** per user — cleanup priority.

## Validation baseline (before asset moves)

Run before/after each major phase:

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

## Next step

Phase 0: push snapshot to `origin/Backup`, then Phase 1 playbooks in `staging/`.
