# Current State

Last updated: 2026-06-24 by Codex.

## Decision

The desired direction is to get Disagrea online, but only after the working tree is split into safe, reviewable steps.

Current safest sequence:

1. Coordination layer.
2. Minigame asset path migration.
3. Companion portrait runtime.
4. Disagrea asset staging/import.
5. Disagrea runtime wiring.
6. Release packaging.

## Repository State Warning

The working tree is intentionally but heavily dirty. Cursor reported it was interrupted during a large migration/import task and is now paused.

Observed categories:

- AI coordination files are untracked and safe to isolate first.
- The migration from `public/minigames/*` to `public/assets/minigames/*` is partially represented as tracked deletions plus untracked replacements.
- Disagrea assets exist in staging/runtime folders but should not be mixed with the generic minigame asset migration.
- Runtime code has WIP changes for minigames, portraits, image lightbox, and asset URL helpers.
- Release artifacts are present and should stay out of gameplay commits until validation passes.

See `.ai/cleanup-inventory.md` for the categorized plan.

## Writer Coordination

Cursor is paused. Codex may take the next bounded step from `.ai/next-task.md`. Cursor should stay in review/read mode until Codex writes `.ai/codex-report.md` and `.ai/cursor-review-instructions.md`.
