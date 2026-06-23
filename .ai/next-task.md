# Next Task

## Active Task

Prepare the repository for a safe Disagrea release by isolating the asset migration before Disagrea runtime wiring.

## Decision

Codex is allowed to make the sequencing decision: aim to get Disagrea online, but do not publish or merge it if the migrated asset base cannot pass build/lint and a basic visual smoke test.

## Next Bounded Writer Step

1. Commit or otherwise isolate the AI coordination layer first.
2. Then work only on the minigame asset path migration:
   - old tracked runtime paths under `public/minigames/*`;
   - new runtime paths under `public/assets/minigames/*`;
   - path rewrite/config/data/script changes required to make those assets resolve.
3. Do not include Disagrea gameplay/runtime wiring in the migration commit.

## Scope

Allowed for the next code/assets pass:

- `public/minigames/*`
- `public/assets/minigames/*`
- `vite.config.ts`
- `src/data/minigameAssets.ts`
- `src/data/palmonArtHints.ts`
- `src/data/wildFamiliars.ts`
- asset path helper/import scripts directly tied to minigame asset migration
- `.ai/codex-report.md`
- `.ai/cursor-review-instructions.md`

## Out Of Scope

- `src/data/eventDisagreaPack.ts`
- `public/companions/{etna,flonne,laharl,pleinair}/*`
- `assets/event-disagrea/*`
- `assets/events/disagrea/*`
- new gameplay/economy logic
- save format changes
- broad UI redesign
- release packaging

## Validation

For the migration pass:

```bash
npm run build
npm run lint
```

If build/lint pass, perform a visual smoke check of minigame asset rendering before moving to Disagrea runtime wiring.

## References

- `.ai/cleanup-inventory.md`
- `.ai/cursor-outbox.md`
- `AGENTS.md`
