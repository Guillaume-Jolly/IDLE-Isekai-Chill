# Relecture contenu joueur — MVP 19

> **Date :** 2026-06-30  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Nature :** harmonisation textes visibles — pas de nouvelle feature

## 1. Objectif

Relire et aligner le contenu **visible joueur** sur la terminologie Havre des Brumes : Ferme lunaire, Myrions, Liens, Parler, conversations de lien, éclats astraux internes.

Hors scope : regen corpus Parler V2 (7 500 scénarios), extension bond 285, économie, save, assets.

## 2. Fichiers relus

| Zone | Fichiers |
|------|----------|
| Ferme lunaire | `MyrionWorksiteGame.tsx`, `myrionWorksiteProgression.ts`, `myrionWorksitePrestige.ts`, `myrionWorksiteBiomeCatalog.ts` |
| Hub / activités | `buildingActivities.ts` |
| Inventaire | `inventoryView.ts`, `InventoryPanel.tsx` |
| Guidance | `nextStepGuidance.ts`, `systemHints.ts`, `companionSupport.ts` |
| Liens bond | `scripts/companion-bond-seeds.mjs` → `companionBondCatalog.generated.ts` |
| Parler | `ConversationGame.tsx` (intro seulement) |
| Refuge / chasse | `DressageGame.tsx`, `PetSanctuaryGame.tsx` |
| Tutoriel | `tutorialObjectives.ts` |
| Story | `src/data/story/chapters/*.json` (aucune mention Wonderland / chantier) |

## 3. Corrections Ferme lunaire

- UI : « Chantier Myrion » → libellés **Ferme lunaire** (menu FAB, surveillance, production).
- Drawer progression : filons affichés par **nom catalogue** (`displayName`), plus d’IDs techniques (`bosquet-clair`).
- Note « Seuils provisoires » retirée → phrase joueur : déblocages par production.
- Hints déblocage : « production totale chantier » → « production totale (ferme) ».
- Prestige : aide éclats astraux explicite (ressource interne ferme).
- Catalogue biomes : descriptions prairie / forêt sans « chantier ».

## 4. Corrections Compagnons / Liens (bond)

- 13 occurrences « chantier » dans les graines → **Ferme lunaire** / tags `ferme-lunaire`.
- Catalogue régénéré : 190 conversations, validation OK.

## 5. Corrections Parler

- Intro `ConversationGame` : rappel **mini-jeu Parler** vs conversations de lien gratuites (onglet Liens).
- Corpus V2 (`linkCorpusV2.json`) : **non modifié** — backlog B1–B3 reporté MVP 20+ (voir `conversation-v2-fix-backlog.md`).

## 6. Corrections Story

- 25 chapitres JSON : pas de branding Wonderland ni termes incohérents détectés en grep.
- Aucune modification nécessaire cette passe.

## 7. Corrections UI globale

| Avant | Après |
|-------|-------|
| Chasse aux Familiers | **Chasse aux Myrions** |
| Chantier Myrion (hub) | **Ferme lunaire** |
| Familiers (inventaire) | **Myrions** |
| familiers (compteur inventaire) | **Myrions** |
| Guidance « chantier » | **Ferme lunaire** |
| Refuge des Familiers (pet-sanctuary copy) | Myrions dans le texte d’aide |

## 8. Terminologie validée

| Terme | Usage joueur |
|-------|----------------|
| **Havre des Brumes** | Produit / univers |
| **Ferme lunaire** | Mini-jeu assignation / biomes / filons |
| **Myrions** | Créatures capturées (pas « familiers » en UI) |
| **Liens** | Onglet compagnons / relations |
| **Mini-jeu Parler** | Session 3 rounds, coût, récompenses |
| **Conversations de lien** | Dialogues gratuits par palier d’affinité |
| **Éclats astraux** | Prestige interne ferme (hors inventaire global) |
| **Village, Refuge, Chasse, Inventaire, Gacha** | Systèmes hub |

Code interne : IDs `prairie-chantier`, `totalChantier` conservés (non visibles).

## 9. Reporté au TNR MVP 20

- Corpus Parler V2 : dédup choix, context R2/R3, transitions voix compagnon.
- Extension bond au-delà de 190 conversations.
- Code-split `linkCorpusV2.json`.
- Relecture chapitre par chapitre (ton fin) si besoin après TNR gameplay.
- « Refuge des Familiers » (nom activité legacy pet-sanctuary) — renommage optionnel si confusion persiste.

## 10. Risques restants

- Activité `Refuge des Familiers` (pet-sanctuary) vs `Refuge des Myrions` (dressage) : deux noms proches.
- Corpus Parler volumineux : incohérences ponctuelles possibles non couvertes.
- `Sora` archetype « Dresseuse de familiers » dans `App.tsx` (profil RP) — laissé, hors confusion système.

## 11. Validations

```bash
npm run generate:companion-bonds
npm run validate:companion-bonds   # OK — 19 / 190
node node_modules/typescript/bin/tsc -b
node node_modules/vite/bin/vite.js build   # OK
```

Smoke court : Village, hub (Ferme lunaire / Chasse aux Myrions), Liens, inventaire Myrions, intro Parler, console propre.
