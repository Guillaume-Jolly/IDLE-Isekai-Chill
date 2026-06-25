# Next Task

## Active Task

Coordinate the overnight asset cleanup without colliding with Cursor's current asset work.

## User Goal

The repository has generated/runtime/source assets spread across too many folders. The desired long-term structure is:

- `assets/`
  - `Compagnons/<id>/affinite/`
  - `Compagnons/<id>/cutouts/`
  - `Compagnons/<id>/chibis/`
  - `Compagnons/<id>/NSFW/`
  - `Compagnons/<id>/Autres/<source-or-batch-name>/`
  - `Background/<id_biome>/`
  - `Myrions/<id_biome>/`
- `old_assets/` for generated/loose/unused assets that should be kept but no longer used by runtime.
- `staging/` untouched.
- `Input chatgpt/` untouched.

Additional cleanup target: empty folders and folders that contain only scattered `.md` files should be inventoried and proposed for grouping, compilation, or deletion.

## Writer Coordination

**Cutout agent (Cursor, separate session)** is the active writer for:
- `staging/companion-visual-pack/village/*/cutouts/`
- `staging/companion-visual-pack/disagrea/*/cutouts/`
- `public/assets/companions/*/emotion-*.png` (promotion)
- `scripts/regenerate-emotion-cutouts.mjs promote`

**Cursor (this session)** is standby/coordination only — 30s heartbeat in `.ai/cursor-heartbeat.md`.

**Codex** may do read-only inventory immediately and edit `.ai/*` coordination files. Do not move/delete/rename active cutout paths until heartbeat reports cutout work complete.

See `.ai/cursor-outbox.md` section « Cursor Coordination — 2026-06-24 » for full answers.

## Immediate Step

Monitor `.ai/cursor-heartbeat.md` for cutout progress. When cutouts v3 promotion is complete, proceed with read-only full inventory per user goal below.

Wait for Cursor heartbeat signal **STANDBY COMPLETE** before any physical asset moves.

## First Safe Codex Work After Cursor Standby

1. Inventory the full asset/document sprawl.
2. Categorize paths into:
   - runtime-used assets;
   - generated but unused assets;
   - source/reference assets;
   - active work directories to preserve untouched;
   - docs-only folders;
   - release/build artifacts;
   - empty folders.
3. Produce a proposed move/delete/archive plan before moving files.
4. Confirm the backup strategy. User created a GitHub `Backup` branch for safety; do not push or overwrite remote branches unless explicitly authorized.

## Validation For Any Cleanup Commit

After physical moves or code path rewrites:

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

If runtime public asset paths change, perform or request visual smoke checks for companions, Myrions, gacha, minigames, and Disagrea event assets.

## Hard Exclusions

- Do not touch `staging/`.
- Do not touch `Input chatgpt/`.
- Do not push to `main`.
- Do not force-push or overwrite `Backup` without explicit user authorization.
- Do not delete assets permanently; move uncertain unused assets to `old_assets/`.

