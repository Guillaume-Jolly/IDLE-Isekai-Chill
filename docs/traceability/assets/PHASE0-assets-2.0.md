# Assets 2.0 — Roadmap

Updated: 2026-06-25  
Owner: Guillaume (user) + Cursor  
Codex: **hors équipe** — coordination via user uniquement.

---

## Décisions validées

| Sujet | Choix |
|-------|--------|
| Architecture cible | **Single `assets/`** — refactor Vite, plus de miroir `public/` long terme |
| Backup remote | Push/écrase **`origin/Backup`** autorisé |
| Cutouts v3 | **Stop** — priorité cleanup assets |
| WebP | Phase ultérieure (après structure stable) |
| Suppression | **Interdite** — déplacer vers `old_assets/` |

---

## Phase 0 — COMPLETE

- [x] Script `scripts/inventory-assets-manifest.mjs`
- [x] `docs/traceability/assets/asset-manifest.json`
- [x] Push snapshot → `origin/Backup` (commit `06961a1`)
- [x] Ce fichier + mise à jour état projet

---

## Phase 1 — COMPLETE

Playbooks agents dans `staging/playbooks/` :

- [x] `README.md` + index
- [x] `00-project-onboarding.md`
- [x] `01-new-companion.md`
- [x] `02-gacha-event.md`
- [x] `03-emotion-cutouts-and-nsfw.md`
- [x] `04-asset-promote-pipeline.md`
- [x] `05-assets-2.0-migration.md`
- [x] `06-tnr-checklist.md`

---

## Structure cible (rappel)

```
assets/
  Compagnons/{id}/affinite|cutouts|chibis|NSFW|Autres/{batch}
  Background/{biomeId}/
  Myrions/{biomeId}/
  Gacha/
  UI/
  References/
  Prompts/
old_assets/
staging/          # ne pas supprimer
Input chatgpt/    # ne pas toucher
```

---

## Phase 2 — COMPLETE (2026-06-25)

Moves physiques par lots + TNR entre chaque lot.

Ordre exécuté : Gacha → Background → Myrions → Compagnons → legacy cleanup.

TNR final : `docs/traceability/tnr/tnr-2026-06-25-phase2-complete.md`

---

## Phase 3 — COMPLETE (2026-06-25)

Cold storage `old_assets/` finalisé : 5 dossiers top-level, dedup, cutouts legacy, scripts finalize.

TNR : `npm run tnr:baseline` · livraison main documentée dans [`README.md`](../../README.md) § Assets 2.0

---

## Exclusions gitignore (non dans Backup git)

Voir manifest `notes` — ex. `staging/companion-visual-pack/**/*.png`, secrets deploy, node_modules.

Pour backup **disque local** complet : copie miroir séparée si besoin au-delà de git.
