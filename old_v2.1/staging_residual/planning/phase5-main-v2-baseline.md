# Phase 5 — main = V2 baseline

Date: 2026-06-25  
Branch pushed: `feature/link-corpus-v2` → `origin/main` and `origin/Backup`  
Baseline commit: `60eb5d57d6cafebb2b90b9dcc2a1d9713d37984d` — **Assets 2.0 + link corpus V2 — clean baseline**

## Warning

**Remote `main` history was rewritten** (`git push origin HEAD:main --force`). Previous tip was `56de371` (build metadata utilities). Anyone with old `main` must reset or re-clone.

## What landed

- Single `assets/` source tree (Compagnons, Background, Myrions, Gacha) with French on-disk layout
- Unified runtime serving: `vite.repo-assets.ts` + slim `vite.config.ts`; legacy URL rewrites preserved
- Link corpus V2: `src/data/linkCorpusV2.json` (7500 conversations, 15 companions)
- Disagrea event runtime + `assets/Background/disagrea-event/`
- Staging playbooks and Phase 2–4 TNR; WebP Phase 4 deferred
- Manifest: 1736 images (`staging/planning/asset-manifest.json`)

## Backup ref

| Ref | Before push | After push |
|-----|-------------|------------|
| `origin/Backup` | `06961a1` | `60eb5d5` |
| `origin/main` | `56de371` | `60eb5d5` |

## Pre-push TNR (2026-06-25)

| Check | Result |
|-------|--------|
| `npm run build` | OK |
| `npm run lint` | FAIL — 8 errors, 13 warnings (pre-existing) |
| `npm run validate:link-corpus` | OK |
| `inventory-assets-manifest.mjs` | OK |

## Recommended first tasks

1. Manual smoke: capture, dressage, companions, gacha, Disagrea
2. B4: emotion cutouts in ConversationGame
3. Corpus B1–B3 (see `conversation-v2-fix-backlog.md`)
4. Optional: trim `public/assets/` mirrors via `old_assets/`
5. Fix lint errors opportunistically; consider code-splitting link corpus later

