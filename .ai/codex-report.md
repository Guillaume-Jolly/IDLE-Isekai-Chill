# Codex Report

## Task

Read Cursor recovery notes, inspect the dirty working tree, decide the safest path toward a Disagrea release, and document a cleanup plan.

## Files changed

- `.ai/cleanup-inventory.md`
- `.ai/next-task.md`
- `.ai/current-state.md`
- `.ai/codex-report.md`
- `.ai/cursor-review-instructions.md`

## What changed

Documented a categorized working-tree inventory and chose a safe sequence: coordination layer, minigame asset migration, companion portrait runtime, Disagrea asset staging/import, Disagrea runtime wiring, then release packaging.

The active next task now focuses on isolating the minigame asset migration before Disagrea runtime work.

## Validation

No build/lint was run for this documentation-only pass.

Previous observed validation in this session:

- `npm run validate:link-corpus` passed with 7500 conversations.
- Earlier `npm run build` and `npm run lint` returned non-zero in the captured run, but output was not detailed enough to diagnose here. They must be rerun during the next code/assets pass.

## Remaining risks

- The working tree is very large and mixed; accidental staging would be easy.
- The asset migration contains hundreds of deletes/adds and must be validated visually.
- Disagrea assets may be valuable but should not be published until runtime wiring passes build/lint and smoke checks.
- `build-revision.json` and release artifacts may be generated noise.

## Cursor review instructions

Review `.ai/cleanup-inventory.md` and `.ai/next-task.md`. If Codex starts the migration pass, keep Cursor in review mode until a fresh report is written.
