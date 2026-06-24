# Next Task

## Active Task

Review the Disagrea runtime asset commit, then wire Disagrea into the game in one bounded runtime pass.

## Completed Sequence

Safe commits already created:

1. `6f62dd4 docs: add ai coordination layer`
2. `27b3fb7 chore(assets): migrate minigame assets`
3. `2415b82 feat(companions): add layered portrait runtime`
4. `252ac98 feat(minigames): add conversation result flow`
5. `01cb8e6 chore(assets): stage disagrea runtime assets`

## Immediate Review Step

Cursor should stay review-only and inspect `01cb8e6`.

Focus:

- The commit should contain public runtime assets and the companion chibi availability only.
- It should not include `eventDisagreaPack.ts`, source/staging folders, generated release files, or runtime gameplay wiring.
- The 38 staged PNG files should be valid and intentionally named.

## Next Bounded Writer Step After Review

If review is clean, Codex may wire Disagrea runtime in a separate commit.

Allowed:

- `src/data/eventDisagreaPack.ts`
- minimal imports/exports needed to register Disagrea companions, Myrions, event backgrounds, or event metadata.
- minimal docs update in `docs/TNR_EVENT_DISAGREA.md` if it reflects current validation.
- `.ai/codex-report.md`
- `.ai/cursor-review-instructions.md`

Out of scope:

- release packaging.
- broad refactors or save-format changes.
- source/staging archives under `assets/event-disagrea/*` or `assets/events/*`.
- untracked catalog/composite scripts unless runtime wiring explicitly needs them.
- unrelated dirty docs or deleted old source PNGs.

## Validation

For the runtime wiring pass:

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

If browser access works, smoke-check: Disagrea companion portraits/chibis, capture event background, dressage event background, and one Disagrea Myrion cutout/chibi. If browser access is blocked, document fallback checks and ask Cursor for visual smoke.

## References

- `.ai/cleanup-inventory.md`
- `.ai/current-state.md`
- `.ai/codex-report.md`
- `.ai/cursor-outbox.md`
- `AGENTS.md`
