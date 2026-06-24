# Next Task

## Active Task

Prepare the repository for a safe Disagrea release by isolating the companion portrait runtime before Disagrea runtime wiring.

## Decision

Codex is allowed to continue the sequencing decision. The minigame asset migration is committed and reviewed; browser smoke was blocked in Codex, but fallback asset checks passed. Disagrea runtime wiring still waits until the companion portrait runtime is isolated and validated.

## Next Bounded Writer Step

Work only on Commit 3 from `.ai/cleanup-inventory.md`: companion portrait runtime.

Goals:

1. Isolate the layered/affinity portrait runtime from unrelated Disagrea content.
2. Keep the commit reviewable and separate from event assets/runtime wiring.
3. Preserve existing user/Cursor WIP outside this scope.

## Scope

Allowed for the next code/runtime pass:

- `src/components/CompanionPortrait.tsx`
- `src/components/CompanionPortrait.css`
- `src/hooks/useCompanionPortraitAssets.ts`
- `src/hooks/usePublicAssetSrc.ts`
- `src/data/publicAssetUrl.ts`
- `src/data/companionPortraitHints.ts`
- related minimal edits in `src/components/CompanionMiniature.tsx`, `src/components/ImageLightbox.tsx`, `src/components/ImageLightbox.css`, `src/components/minigames/ConversationGame.tsx`, and `src/components/minigames/Minigames.css`
- `.ai/codex-report.md`
- `.ai/cursor-review-instructions.md`

## Out Of Scope

- `src/data/eventDisagreaPack.ts`
- `assets/event-disagrea/*`
- `assets/events/disagrea/*`
- `public/companions/{etna,flonne,laharl,pleinair}/*`
- `public/assets/minigames/capture/biomes/disagrea-event*`
- `public/assets/minigames/dressage/enclosures/disagrea-event*`
- Disagrea/event Myrion cutouts or chibis
- new gameplay/economy logic
- save format changes
- broad UI redesign
- release packaging

## Validation

For the companion portrait runtime pass:

```bash
npm run build
npm run lint
```

If build/lint pass, perform or request a visual smoke check of the companion conversation screen and image lightbox. If browser access is blocked, document the limitation and request Cursor review/smoke.

## References

- `.ai/cleanup-inventory.md`
- `.ai/cursor-outbox.md`
- `AGENTS.md`
