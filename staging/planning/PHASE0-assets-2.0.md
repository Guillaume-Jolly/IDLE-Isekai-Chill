# Phase 0 — Assets 2.0 Cleanup

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

## Phase 0 livrables

- [x] Script `scripts/inventory-assets-manifest.mjs`
- [x] `staging/planning/asset-manifest.json`
- [ ] Push snapshot → `origin/Backup`
- [x] Ce fichier + mise à jour état projet

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

## Prochaine phase (1)

Playbooks agents dans `staging/` :
- nouveau compagnon (checklist DA + assets + code)
- nouveau gacha event
- cutouts v4 / NSFW
- promote pipeline

Puis phase 2 : moves physiques par lots + TNR.

---

## Exclusions gitignore (non dans Backup git)

Voir manifest `notes` — ex. `staging/companion-visual-pack/**/*.png`, secrets deploy, node_modules.

Pour backup **disque local** complet : copie miroir séparée si besoin au-delà de git.
