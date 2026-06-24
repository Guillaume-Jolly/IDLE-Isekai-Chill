# Cursor Review Instructions

## Current Decision

Codex chose to aim for a Disagrea release, but only after isolating the generic minigame asset migration.

## Review Now

Read:

- `.ai/cleanup-inventory.md`
- `.ai/next-task.md`
- `.ai/current-state.md`
- `.ai/codex-report.md`

## Expected Next Writer Scope

The next writer pass should focus on the minigame asset migration only:

- `public/minigames/*`
- `public/assets/minigames/*`
- asset path rewrites in config/data/scripts needed for those paths

Disagrea runtime wiring should wait for the next pass.

## Validation For Next Pass

- `npm run build`
- `npm run lint`
- visual smoke check of hunt/refuge/minigame assets

## Watch Outs

- Do not accidentally stage Disagrea runtime files with the generic asset migration.
- Do not include release artifacts with gameplay/runtime changes.
- Do not treat all `D public/minigames/*` entries as safe until replacement paths are verified.

## Update - 2026-06-24 migration review

Review now:

- commit `27b3fb7 chore(assets): migrate minigame assets`
- `.ai/codex-report.md`
- current `git status`

Questions:

1. Did the commit miss any runtime path that still points to `public/minigames/*` without a rewrite/fallback?
2. Did any Disagrea/event-specific asset or runtime file slip into the generic migration commit?
3. Is visual smoke testing enough as the next step, or should a small fix commit happen first?

Validation already run: `npm run build` passed; `npm run lint` passed with 0 errors and 12 existing warnings.

Keep Cursor in review-only mode unless Codex explicitly delegates a bounded fix.

## Update - 2026-06-24 Disagrea runtime assets review

Review now:

- commit `01cb8e6 chore(assets): stage disagrea runtime assets`
- `.ai/codex-report.md`
- `.ai/next-task.md`

Questions:

1. Are the staged public PNG paths and names correct for Disagrea runtime use?
2. Does `companionAssets.ts` limit itself to Disagrea chibi availability?
3. Did source/staging archives, release artifacts, `eventDisagreaPack.ts`, or unrelated dirty files stay out?

Validation already run: PNG header/dimension check passed for all 38 staged images; `npm run build` passed; `npm run lint` passed with 0 errors and 11 existing warnings.

Keep Cursor in review-only mode unless Codex explicitly delegates a bounded fix.

## Update - 2026-06-24 conversation result flow review

Review now:

- commit `252ac98 feat(minigames): add conversation result flow`
- `.ai/codex-report.md`
- `.ai/next-task.md`

Questions:

1. Does the result phase preserve the expected completion semantics and only call `onComplete` after the player clicks `Terminer`?
2. Is the reward preview aligned with the companion charm multiplier that `App.tsx` applies during completion?
3. Does restart still reroll/reset conversation state cleanly?
4. Did any Disagrea/event-specific runtime or assets slip into this commit?

Validation already run in an isolated clean worktree: `npm run build` passed; `npm run lint` passed with 0 errors and 11 existing warnings.

Keep Cursor in review-only mode unless Codex explicitly delegates a bounded fix.
