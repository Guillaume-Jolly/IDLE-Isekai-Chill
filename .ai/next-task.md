# Next Task

## Active Task

**Post–V2 baseline — gameplay and corpus quality**

`origin/main` = Assets 2.0 + link corpus V2 (`60eb5d5`). Report: `staging/planning/phase5-main-v2-baseline.md`.

## P0 (do first)

| ID | Task | Validation |
|----|------|------------|
| P0-smoke | Manual smoke: chasse (Talia guide, cutouts), dressage chibi, companion affinity/emotion, gacha, Disagrea | TNR checklist in `tnr-2026-06-25-phase3.md` |
| B4 | Wire `emotion-{emotion}.png` in ConversationGame | Liens tab visual smoke |
| B1 | Companion-specific `context[2]` per round (R2/R3) | Sample 5/companion + playtest |

## P1 (next)

| ID | Task | Notes |
|----|------|-------|
| B2 | Companion-voice transition pool (min 8 per companion) | Generator change |
| B3 | De-duplicate player choice text (~870 repeats) | Import pipeline |
| pub-mirror | Residual `public/assets/` PNG mirrors — move duplicates to `old_assets/` only | No deletes |
| lint-8 | Fix 8 eslint errors when touching those files | See phase5 baseline |

## P2 (deferred / polish)

- **WebP**: reopen only with perf evidence (`phase4-webp-assessment.md`)
- **I6**: code-split `linkCorpusV2.json` (~39 MB bundle)
- Corpus polish I1–I5, P1–P4 in `staging/planning/conversation-v2-fix-backlog.md`

## Hard exclusions

- Do not delete assets — move to `old_assets/`.
- Do not touch secrets (`.env`).
- Do not resume cutouts v3 mass promote without explicit user request.

## Validation for any commit

```bash
npm run build
npm run lint
npm run validate:link-corpus
```
