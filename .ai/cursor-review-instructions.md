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
