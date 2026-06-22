# TNR Gameplay — Phase 3

> **Objectif :** Vérifier les boucles gameplay réelles après stabilisation (branche `stabilization/myrions-cleanup-phase2`).

| | |
|---|---|
| **Branche** | `stabilization/myrions-cleanup-phase2` |
| **HEAD (début Phase 3)** | `4c5f94a` |
| **HEAD (fin Phase 3)** | _(voir commit doc résultats)_ |
| **Environnement** | `npm run dev` — `http://localhost:5173/` |
| **Save key** | `idle-isekai-chill-game-v1` (localStorage, payload `GameState` racine) |
| **Méthode** | TNR manuel navigateur + vérif HEAD assets + console |
| **Date TNR** | 2026-06-21 |
| **État save testée** | Stade **Hameau** (stage 1), ~76 hab., ~36,6k pièces, 0 pets actifs |

## Périmètre

Lancement, village, hub mini-jeux, inventaire, compagnons, save/load, progression, refuge Myrions, chasse/capture, œufs, assets, console.

## Tableau des tests

| ID | Zone | Test | Statut | Résultat | Bug lié | Correction | Risque restant |
|----|------|------|--------|----------|---------|------------|----------------|
| A1 | Shell | Lancement jeu | OK | App charge, titre OK, pas de crash | — | — | — |
| A2 | Shell | Navigation onglets | OK | Village, Bâtiments, Quêtes, Mini-jeux, Event, Inventaire, Liens, Dev visuels | — | — | — |
| A3 | Shell | Reload | OK | Reload F5 : retour Village, ressources conservées, stade Hameau intact | — | — | — |
| B1 | Village | Panorama WebP | OK | `panorama-base.webp` HTTP 200, labels bâtiments (Auberge, Ferme, Atelier…) | — | — | — |
| B2 | Village | Interactions panorama | OK | Pancartes cliquables, panneau bâtiment + actions (Gestion, Mini-jeu, Gacha…) | — | — | — |
| C1 | Hub | Affichage cartes | OK | 13 cartes bâtiments + Conversations ; tri cohérent ; Refuge Myrions visible | — | — | — |
| C2 | Hub | Verrouillage stade | OK | Chasse / Refuge Myrions / Graines → bouton « Stade Village » disabled (stage 2 requis) | — | — | — |
| C3 | Hub | Mini-jeu débloqué | OK | Fil d'Or (Mira) ouvre overlay « Coudre ! », fermeture OK | — | — | — |
| C4 | Hub | Conversations | OK | Picker : 8 compagnons débloqués, 7 verrouillés par stade ; modale fermeture OK | — | — | — |
| D1 | Inventaire | Sections ressources | OK | Village, artisanat, arcane, festival, fragments, outils, familiers, chasse stats | — | — | — |
| D2 | Inventaire | Reload après ouverture | OK | Pas de crash après reload depuis inventaire | — | — | — |
| E1 | Compagnons | 15 compagnons | OK | Onglet Liens : Lyra…Zelie (15) ; stats, portraits, actions Entraîner/Affinité/Parler | — | — | — |
| E2 | Compagnons | Dev visuels | OK | Galerie 15 compagnons × 5 affinités, pas de crash | — | — | — |
| F1 | Save | Persistance reload | OK | `stage:1`, pop ~75→76 (idle), coins ~36,6k conservés (pas de reset) | — | — | — |
| F2 | Save | Compatibilité | OK | Save existante migrée (companions merge, minigameSave merge) sans wipe | — | — | — |
| G1 | Progression | Stade actuel | OK | Hameau 76/140 hab. ; prochain stade Village requiert pop 110+ | — | — | — |
| G2 | Progression | Déblocage mini-jeux | OK | Stage 1 : Jouer sur inn/garden/ribbon/clear-spring ; moon-farm bloqué | — | — | — |
| H1 | Refuge | Accès / UI | non testé | `moon-farm` / `farm-dressage` requiert stade Village (2) ; pop 76 < 110 | — | — | P1 — boucle Myrion refuge non validée en TNR |
| I1 | Chasse | Accès / capture | non testé | `farm-capture` même verrouillage stade Village | — | — | P1 — boucle capture non validée en TNR |
| J1 | Œufs | Reproduction | non testé | Nid d'Écho dans refuge inaccessible (cf. H1) | — | — | P2 |
| K1 | Assets | Myrions / biomes | OK | HEAD 200 : biomes/forest.webp, enclosure/default.webp, palmon chibi, companions/talia/chibi.png | — | — | — |
| K2 | Assets | Panorama village | OK | WebP 1,57 Mo servi correctement ; pas de PNG 86 Mo en runtime | — | — | P3 — blob PNG reste dans historique git |
| L1 | Console | Erreurs bloquantes | OK | Aucune erreur rouge console observée durant TNR | — | — | — |
| L2 | Console | Flags dev prod | OK | `DEV_UNLIMITED_GACHA` / `DEV_UNLOCK_ALL_MINIGAMES` = `import.meta.env.DEV` | BUG-2 | — | P2 — voir bugs |
| L3 | Console | Debug Myrions | KO non corrigé | `MYRION_REFUGE_DEBUG = true` hardcodé (panel spawn visible en prod si refuge ouvert) | BUG-1 | Hors périmètre Phase 3 | P2 prod |

## Bugs trouvés

### BUG-1 — `MYRION_REFUGE_DEBUG` non protégé en production
- **Gravité :** P2
- **Description :** `src/data/myrionDebug.ts` exporte `MYRION_REFUGE_DEBUG = true` sans gate `import.meta.env.DEV`. Le panneau debug (spawn Myrions, presets) s'affiche dans DressageGame/FamiliarCaptureGame quand le flag est true.
- **Cause probable :** Flag laissé actif pendant le développement refuge/chasse.
- **Correction :** Non appliquée (hors bug bloquant TNR ; à traiter post-merge).
- **Validation :** Lecture code + présence `MyrionDebugPanel` conditionné par ce flag.

### BUG-2 — `DEV_UNLOCK_ALL_MINIGAMES` inutilisé
- **Gravité :** P3
- **Description :** Flag défini dans `gacha.ts` mais jamais lu par `MinigameHub.tsx` ; impossible de débloquer les mini-jeux via mécanisme dev pour TNR refuge/chasse.
- **Cause probable :** Commit `91e4d2f` a ajouté le flag sans wiring hub.
- **Correction :** Non appliquée (pas bloquant ; TNR a respecté verrouillage progression légitime).
- **Validation :** grep codebase.

## Corrections appliquées

_Aucune correction code gameplay dans cette phase — aucun bug bloquant détecté._

## Risques restants

| Priorité | Risque |
|----------|--------|
| **P1** | Refuge Myrions + chasse/capture non testés end-to-end (stade Village non atteint en session TNR) |
| **P2** | `MYRION_REFUGE_DEBUG = true` en build production |
| **P2** | `DEV_UNLOCK_ALL_MINIGAMES` non câblé — pas d'outil dev pour TNR rapide des mini-jeux verrouillés |
| **P3** | 36 erreurs lint préexistantes (dont minigames Myrions) |
| **P3** | PNG panorama 86 Mo dans historique git (documenté Phase 2) |
| **P3** | Chunk JS principal > 5 Mo (warning build Vite) |

## Prochaine phase recommandée

1. **Atteindre stade Village** (save test ou session longue) puis TNR ciblé H/I/J (refuge 8 biomes, capture, œufs).
2. **Gate `MYRION_REFUGE_DEBUG`** behind `import.meta.env.DEV` (commit minimal séparé).
3. **Merge PR** `stabilization/myrions-cleanup-phase2` → `main` si revue OK et TNR Myrions complété ou acceptation du risque P1 documenté.
