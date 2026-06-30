# TNR Gameplay — Phase 3 (final)

> Vérification des boucles gameplay après stabilisation — branche `stabilization/myrions-cleanup-phase2`.

| | |
|---|---|
| **Branche** | `stabilization/myrions-cleanup-phase2` |
| **Environnement dev TNR** | `npm run dev` — `http://localhost:5173/` |
| **Environnement prod vérifié** | `npm run build` — bundle sans panneau debug |
| **Save key** | `idle-isekai-chill-game-v1` |
| **Méthode Myrions** | `DEV_UNLOCK_ALL_MINIGAMES` (dev-only) + panneau debug refuge/chasse (dev-only) |
| **Date TNR final** | 2026-06-22 |

## Tableau des tests

| ID | Zone | Test | Statut | Résultat | Bug lié | Correction | Risque restant |
|----|------|------|--------|----------|---------|------------|----------------|
| A1 | Shell | Lancement / navigation / reload | OK | Pas de crash | — | — | — |
| B1 | Village | Panorama WebP + labels | OK | HTTP 200, scroll OK | — | — | — |
| C1 | Hub | Cartes + verrouillage prod | OK | En prod : stade requis ; en dev : `DEV_UNLOCK_ALL_MINIGAMES` | — | `MinigameHub.tsx` | — |
| D1 | Inventaire | Sections + reload | OK | Familiers / chasse stats visibles | — | — | — |
| E1 | Compagnons | 15 compagnons Liens + galerie dev | OK | Stats, portraits, modales | — | — | — |
| F1 | Save | Persistance reload | OK | Stage, ressources, pets conservés | — | — | — |
| G1 | Progression | Verrouillage stade (prod) | OK | Campement : moon-farm verrouillé sans dev | — | — | — |
| G2 | Progression | Déblocage dev TNR | OK | Tous mini-jeux « Jouer » en `import.meta.env.DEV` | BUG-2 | Câblage hub | — |
| H1 | Refuge | 8 biomes + enclos + ressources | OK | Tabs Prairie→Ruines, spawn debug, stats | — | — | — |
| H2 | Refuge | Craft / Nid d'Écho | OK | Atelier + Nid ouverts ; œuf disabled si 1 parent | — | — | — |
| H3 | Refuge | Debug panel dev-only | OK | Visible en dev ; absent du bundle prod | BUG-1 | `MYRION_REFUGE_DEBUG = import.meta.env.DEV` | — |
| H4 | Refuge | Liaison compagnon | OK | « Lier à Sora », buffs affichés | — | — | — |
| H5 | Refuge | Save après visite | OK | 1 pet Cerfaurore persisté localStorage | — | — | — |
| I1 | Chasse | Carte 8 biomes | OK | Explorer par biome | — | — | — |
| I2 | Chasse | Rencontre + UI | OK | Cerfaurore rencontré en Prairie | — | — | — |
| I3 | Chasse | Debug drawer dev | OK | Onglet Debug présent en dev uniquement | — | — | — |
| J1 | Reproduction | Nid d'Écho UI | OK | Parents A/B ; message si 1 seul Myrion | — | — | P3 reproduction complète non tentée (cooldown/ressources) |
| K1 | Assets | Sprites / biomes / enclos / chibi | OK | HEAD 200 sur PNG/WebP clés | — | — | — |
| L1 | Console | Erreurs bloquantes | OK | Aucune erreur rouge observée | — | — | — |
| L2 | Prod flags | Bundle production | OK | Pas de « Outils debug Myrions » dans `dist/` | — | — | — |

## Bugs corrigés (Phase 3 final)

| ID | Description | Correction | Commit |
|----|-------------|------------|--------|
| BUG-1 | `MYRION_REFUGE_DEBUG = true` en prod | `import.meta.env.DEV` | voir commits finalisation |
| BUG-2 | `DEV_UNLOCK_ALL_MINIGAMES` inutilisé | Câblé dans `MinigameHub.isActivityUnlocked` | idem |
| BUG-3 | `biomeBgFailed` useState après usage (lint + ordre hooks) | Déplacé en tête de composant | idem |

## Lint (Phase 3 final)

| Avant | Après |
|-------|-------|
| 36 problèmes (27 errors) | 0 errors, 9 warnings |

Corrections : exports extraits (`recentCaptures.ts`), purity (`EchoNursery`, `IdleFarmGame`, `TileMergeGame`), `eslint.config.js` override ciblé `set-state-in-effect` pour minigames/hooks (sync save documentée).

## Prochaine phase recommandée

Merge PR → gameplay polish reproduction/capture manuelle longue durée → Git LFS si nouveaux gros assets.
