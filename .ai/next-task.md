# Next Task

## Active Task

Review the newly isolated conversation result flow, then prepare the first bounded Disagrea asset staging/import pass.

## Completed Sequence

Safe commits already created:

1. `6f62dd4 docs: add ai coordination layer`
2. `27b3fb7 chore(assets): migrate minigame assets`
3. `2415b82 feat(companions): add layered portrait runtime`
4. `252ac98 feat(minigames): add conversation result flow`

## Immediate Review Step

Cursor should stay review-only and inspect `252ac98`.

Focus:

- The conversation result screen should not double-apply rewards.
- The displayed reward preview should match the completion reward after `App.tsx` applies companion charm scaling.
- Restart should still pick a fresh conversation and reset all result/feedback state.
- The commit should not include Disagrea assets or runtime wiring.

## Next Bounded Writer Step After Review

If review is clean, Codex may isolate the Disagrea asset staging/import layer without gameplay runtime wiring.

Allowed:

- Disagrea static asset folders that are already present and intentionally staged.
- minimal asset catalog/docs needed to describe what was imported.
- `src/data/companionAssets.ts` only for Disagrea chibi availability if the corresponding public files are committed in the same asset pass.
- `.ai/codex-report.md`
- `.ai/cursor-review-instructions.md`

Out of scope until the following pass:

- `src/data/eventDisagreaPack.ts`
- gameplay/runtime integration of Disagrea events.
- quest/event availability toggles.
- release packaging.
- broad cleanup of unrelated dirty files.

## Validation

For the Disagrea asset staging/import pass:

```bash
npm run build
npm run lint
```

Also run file-level asset existence/dimension checks for every staged Disagrea public image. If browser smoke is available, ask Cursor to visually confirm the Disagrea companion miniatures and event minigame assets.

## References

- `.ai/cleanup-inventory.md`
- `.ai/current-state.md`
- `.ai/codex-report.md`
- `.ai/cursor-outbox.md`
- `AGENTS.md`
