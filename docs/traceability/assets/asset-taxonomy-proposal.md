# Asset Taxonomy Proposal (draft)

Updated: 2026-06-25 00:28 +02:00  
Goal: align future cleanup with user target structure without moving files tonight.

---

## Target top-level

```
assets/           # runtime-used source-of-truth (post-cleanup)
old_assets/       # retired but kept
staging/          # drafts, WIP, reviews (never delete)
Input chatgpt/    # untouched
public/           # Vite-served runtime (build/sync from assets)
```

---

## Proposed `assets/` tree

```
assets/
  Compagnons/
    {companionId}/
      affinite/       # affinity-1..5 layered portraits
      cutouts/        # emotion-*.png sources before chroma/promote
      chibis/
      NSFW/           # gated content if any
      Autres/
        {batch-name}/ # e.g. intime-bed-batch, disagrea-tests
  Background/
    {biomeId}/        # capture, dressage, refuge, disagrea-event…
  Myrions/
    {biomeId}/        # cutouts + chibis per species
  UI/                 # NEW — icons, frames, gacha UI if not in public/assets/ui
  Gacha/              # NEW — banners, rate-up art if separated
  References/         # NEW — style anchors, affinity refs for generation
  Prompts/            # NEW — optional JSON/MD prompt libraries for AI gen
```

---

## Current path → future mapping (read-only inventory)

| Current | Future | Notes |
|---------|--------|-------|
| `public/assets/companions/{id}/emotion-*.png` | promote from `assets/Compagnons/{id}/cutouts/` | chroma pipeline stays |
| `staging/companion-visual-pack/{village|disagrea}/{id}/cutouts/` | generation staging → promote | keep until v3 done |
| `assets/event-disagrea/` | `assets/Compagnons/` + `assets/Background/disagrea-event/` | split guests vs biome |
| `public/assets/minigames/` | `assets/Background/` + `assets/Myrions/` | migration started |
| `assets/link-corpus-import/` | `assets/Autres/link-corpus-v2/` or stay | corpus source zip/jsonl |
| scattered `.md` in asset folders | `staging/planning/` or `docs/` | docs-only cleanup |

---

## `old_assets/` candidates (after cutout v3 complete)

- v2 emotion cutouts archived by `regenerate-emotion-cutouts.mjs promote`
- legacy `public/minigames/*` deleted paths if copies exist in new tree
- obsolete staging v2 cutouts (`*-cutout-v2.png`) if any remain

**Do not move until:** cutouts 152/152 + Codex cleanup plan approved + backup branch confirmed.

---

## Extra categories justification

| Category | Why |
|----------|-----|
| UI | Talia icons, launcher, gacha frames scattered today |
| Gacha | Event banners may grow with Disagrea |
| References | affinity-1 anchors per companion for AI gen |
| Prompts | companion-visual-pack-data.mjs prompts could live as assets |

---

## Hard exclusions (unchanged)

- `staging/` — never delete in cleanup  
- `Input chatgpt/` — never touch  
- Active cutout zones during v3 promo  

---

## Validation before any physical move

```bash
npm run build
npm run lint
npm run validate:link-corpus
```

Plus visual smoke: companions, minigames, Disagrea event, gacha.

---

## Recommended cleanup commit order (future Codex)

1. Inventory manifest JSON (read-only)  
2. Move `assets/event-disagrea/integrated/` → structured tree  
3. Sync `public/` path rewrites in code if needed  
4. Move loose generated → `old_assets/`  
5. Delete empty dirs / docs-only folder consolidation  

---

## Status

**Proposal only** — no files moved tonight.
