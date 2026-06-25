# Backlog — pipelines systématiques

Updated: 2026-06-25

---

## Playbooks disponibles (✅)

| Pipeline | Playbook |
|----------|----------|
| Nouveau compagnon (+ chibi) | 01 |
| Event gacha (+ rates, bannière) | 02 |
| Cutouts / NSFW | 03 |
| Promote assets | 04 |
| Migration assets 2.0 | 05 (done) |
| TNR | 06 + `npm run tnr:baseline` |
| Release prod stable | 07 |
| Nettoyage répertoires | 08 |
| Biome visuel only | 09 + formulaire intake |
| QA visuelle normalisée | 10 |
| Biome Myrion + catalogue regen | 11 |

---

## P1 — systématiser plus tard

| Pipeline | Statut | Notes user |
|----------|--------|------------|
| Skinline epic / NSFW | Backlog | Gate validation — ref `staging/skinline-premium/MANIFEST.json` |
| Discovery récursive compagnons | Backlog code | Scanner `assets/Compagnons/` vs listes manuelles |
| Playbook commit baseline / main | Backlog | Checklist pre-push |

---

## P2 — reporté explicitement

| Pipeline | Raison |
|----------|--------|
| **Nouveau bâtiment / activité idle** | Pas encore de vision gameplay — pipeline plus tard |
| **Nouvelle ressource / loot / équilibrage** | Gains trop élevés OK pour tests ; jeu visé sur **plusieurs années** — resserrer gains plus tard. Backlog : progression = vrai choix, pas upgrade horaire de tout |
| **Objectifs tuto / progression 0–10h** | Première histoire + tuto pas faits — valider pipeline quand exécution existante |
| **Input chatgpt/ → 2e disque** | Infra — gitignore en place |

---

## Deprecated / oublié

| Item | Action |
|------|--------|
| Vectorize chibi / SVG palmons | **Abandonné** — PNG cutout/chibi uniquement ; détourage propre plus tard |
| `generate:minigame-svgs` | Legacy — ne pas systématiser |

---

## Économie / loot (note backlog)

User : « on gagne trop » — OK phase test sans outils debug.  
Future : audit `huntDropRates.ts`, `gacha.ts`, `resources.ts`, idle production — viser progression lente post-baseline.

---

## Références

- Agent onboarding : `docs/agent-guide/`
- Changelog micro : `docs/traceability/changelog/`
