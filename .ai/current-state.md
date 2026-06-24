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

## Update - 2026-06-24

Completed steps:

- `6f62dd4 docs: add ai coordination layer`
- `27b3fb7 chore(assets): migrate minigame assets`

Build and lint passed after staging the migration commit. Cursor should review `27b3fb7` before the next writer step. The next likely step is visual smoke testing of migrated minigame assets, unless review finds a small fix.

## Update - 2026-06-24 04:40 UTC

Cursor reviewed the migration smoke attempt and accepted Codex's fallback checks as enough to hand off the next bounded writer step.

Next active writer step is now Commit 3 from `.ai/cleanup-inventory.md`: companion portrait runtime only.

Disagrea runtime wiring remains out of scope until this step is isolated and build/lint plus review/smoke are documented.

## Update - 2026-06-24 companion portrait committed

Completed:

- `2415b82 feat(companions): add layered portrait runtime`

The commit was validated in an isolated clean worktree with only the staged portrait patch applied. Build and lint passed; lint still reports 12 existing warnings.

Remaining WIP now includes conversation UX/reward/recap changes and Disagrea-specific companion chibi additions. Disagrea runtime wiring is still out of scope.
