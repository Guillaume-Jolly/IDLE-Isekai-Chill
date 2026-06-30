# État du projet — IDLE Isekai Chill

> ⚠️ **Document historique** — audit 2026-06-22, **partiellement obsolète**.  
> **Ne pas utiliser** les tableaux « Risques » / « Fonctionnalités partielles » ci-dessous pour décider si le build passe.  
> **Source de vérité courante :** [`docs/traceability/project-state.md`](./traceability/project-state.md) · [`docs/DOC_AGENT_INDEX.md`](./DOC_AGENT_INDEX.md) · release **2.1.0.0** livrée sur `main`.

> Dernière mise à jour originale : 2026-06-22  
> Phase originale : audit pré-développement (documentation uniquement)

## Résumé exécutif

**IDLE Isekai Chill** (« Havre des Brumes ») est un prototype de jeu idle / collection cozy fantasy, jouable navigateur (mobile + desktop). Le dépôt contient un **MVP jouable** avec village, compagnons, gacha, mini-jeux, Myrions (créatures), quêtes et inventaire — mais une **dette technique notable** (monolithe `App.tsx`, flags dev actifs, build TypeScript en échec, absence de tests automatisés).

Le projet est **séparé** du repo parent MTG (`REPO_SEPARATION.md`).

## Stack

| Couche | Technologie |
|--------|-------------|
| UI | React 19, TypeScript ~6.0 |
| Build | Vite 8 |
| Graphismes optionnels | Pixi.js 6.5, pixi-live2d-display (démo Live2D) |
| Persistance | `localStorage` (clé `idle-isekai-chill-game-v1`) |
| Assets | PNG/SVG/MP4 dans `public/` ; pipelines Node + Sharp dans `scripts/` |
| Tests | **Aucun** framework ; validation manuelle + script dialogues |

## Structure du dépôt

```
src/           — Application React (~121 fichiers)
  App.tsx      — Boucle de jeu principale (~1670 lignes)
  components/  — UI village, gacha, inventaire, 14 types de mini-jeux
  data/        — Données métier (44 modules TS)
  hooks/       — Sprites en enclos, tooltips
public/        — Assets servis (~614 fichiers)
scripts/       — Import / génération assets (~29 scripts)
assets/        — Staging imports (non servi, ignoré par Vite watch)
docs/          — Documentation projet (ce dossier)
```

## Fonctionnalités présentes

### Core idle
- 12 ressources avec production passive (tick 5 s)
- 8 bâtiments améliorables avec coûts/prod progressifs
- Progression hors-ligne (plafond 168 h)
- Sauvegarde auto à chaque changement d'état

### Village
- Panorama scrollable (`VillagePanorama.tsx`, `villageMap.ts`)
- Pancartes bâtiments + infobulles
- Système population / besoins / stades (`population.ts`, `PopulationPanel.tsx`)
- Archétypes de cité (`cityArchetypes.ts`)

### Compagnons (15)
- Niveau, affinité (5 paliers), stats, fragments, jetons gacha
- Portraits IA (`public/companions/<id>/affinity-{1-5}.png`)
- Conversations par compagnon (`ConversationGame`, scénarios générés)
- Galerie dev « tous les visuels »

### Gacha
- Tirages x1/x10/x50/x100, pity, fragments, jetons de stat
- Animation d'ouverture (`GachaOpening.tsx`, vidéo `public/gacha/cinema/`)

### Mini-jeux (~29 activités, 14 types)
- Hub par bâtiment (`MinigameHub`, `buildingActivities.ts`)
- Chasse / capture Myrions, refuge, dressage, ferme idle, conversations, etc.

### Myrions (85 espèces, 8 biomes)
- Catalogue généré (`myrionsCatalog.generated.ts`)
- Capture, limite 10 exemplaires / espèce (`MAX_SPECIES_COPIES`)
- Refuge par biome, enclos, soins, craft, reproduction / œufs (`EchoNursery`)
- Liaison Myrion ↔ compagnon, buffs de support, faveurs de chasse
- Relâchement, remplacement, comparaison captures

### Autres
- Quêtes infinies (`QuestBoard`, `infiniteQuests.ts`)
- Inventaire unifié (`InventoryPanel`, `inventoryView.ts`)
- Démo Live2D (lazy load)

## Fonctionnalités partielles

| Zone | État |
|------|------|
| Paliers affinité 4–5 | Placeholders « fade-to-black » sauf toggle `maturePlaceholders` |
| Vidéo gacha | Slideshow keyframes, pas animation fluide continue |
| Panorama village | Image upscalée 12800×4263 depuis source 1024×341 ; calibration pancartes à affiner |
| Chibi compagnons | Seule Talia a un `chibi.png` dédié |
| Extraction données | `BUILDINGS`, `COMPANIONS` encore inline dans `App.tsx` |
| Script `generate:gacha-video` | Fichier `scripts/build-gacha-video.mjs` existe, **absent de `package.json`** |
| TypeScript build | **Échec** — 8 erreurs (Myrions / capture, voir `TECHNICAL_STATE.md`) |

## Fonctionnalités absentes / roadmap README

- PWA installable (manifest + service worker)
- Données jeu entièrement externalisées (JSON/TS modulaire)
- Quêtes quotidiennes sans FOMO
- Mode production (flags dev désactivés)
- Suite de tests automatisés

## Flags développement actifs (à désactiver avant release)

| Flag | Fichier | Effet |
|------|---------|-------|
| `DEV_UNLIMITED_GACHA = true` | `src/data/gacha.ts` | Gacha sans coût tickets |
| `DEV_UNLOCK_ALL_MINIGAMES = true` | `src/data/gacha.ts` | Tous mini-jeux débloqués |
| `MYRION_REFUGE_DEBUG = true` | `src/data/myrionDebug.ts` | Panneau debug refuge visible |

## Risques identifiés

| Risque | Sévérité | Détail |
|--------|----------|--------|
| Build CI impossible | **P0** | `npm run build` échoue (TS errors) |
| Monolithe App.tsx | P1 | Maintenance / onboarding difficile |
| Flags dev en prod | P1 | Gameplay non représentatif |
| Save migration v4 | P1 | Reset pets possible si `saveVersion < 4` |
| Panorama 12800 upscalé | P2 | Qualité visuelle limitée vs source native |
| Pas de tests auto | P2 | Régressions non détectées |
| Dépôt non commité massif | P2 | Centaines de fichiers untracked (Myrions PNG, village, scripts) |

## Rôles outils (rappel chantier)

| Outil | Rôle |
|-------|------|
| **ChatGPT** | Images, prompts, cohérence visuelle, détourage, design doc |
| **Cursor** | Audit, code, doc, nettoyage, tests, TNR, commits |

## Documents associés

- [`TECHNICAL_STATE.md`](./TECHNICAL_STATE.md) — détail technique
- [`GAME_DESIGN_CURRENT.md`](./GAME_DESIGN_CURRENT.md) — design implémenté
- [`TODO_PRIORITIZED.md`](./TODO_PRIORITIZED.md) — backlog priorisé
