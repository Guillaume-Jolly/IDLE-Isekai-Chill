# Wonderland 0.10 — Boucle gameplay cible

> **Nom projet interne :** Wonderland / Havre des Brumes (`idle-isekai-chill-game`)  
> **Date :** 2026-06-22  
> **Base :** `main` @ `bc4c118` (post-merge stabilisation)

## Boucle cible 0.10

```
Village → action joueur → ressource → chasse/interaction → compagnon/Myrion
  → buff → objectif → amélioration village → déblocage biome → retour village
```

## Boucle actuelle (implémentée)

| Étape | Statut | Implémentation |
|-------|--------|----------------|
| Village + bâtiments | ✅ | `App.tsx`, `VillagePanorama`, 8 bâtiments |
| Production ressources | ✅ | Tick 5 s, 12 ressources |
| Amélioration bâtiments | ✅ | Coûts, niveaux, déblocage mini-jeux |
| Mini-jeux hub | ✅ | `MinigameHub`, 13+ activités |
| Chasse Myrions | ✅ | `FamiliarCaptureGame`, 8 biomes |
| Refuge Myrions | ✅ | `DressageGame`, enclos, craft, Nid d'Écho |
| Compagnons (15) | ✅ | Liens, stats, affinité, conversations |
| Liaison Myrion ↔ compagnon | ✅ | `myrionCompanionLinks`, buffs |
| Relâchement / récompenses | ✅ | `myrionRelease` |
| Population / stades village | ✅ | `population.ts`, 5 stades |
| Déblocage biomes chasse | ✅ | `biomeProgression.ts` |
| Save localStorage | ✅ | `idle-isekai-chill-game-v1`, migrations douces |
| Gacha / événement | ✅ | Tickets, fragments |
| Quêtes | ⚠️ partiel | `infiniteQuests.ts` — board présent, TNR limité |

## Écarts vs vertical slice 0.10 minimale

| Critère 0.10 | État | Gap |
|--------------|------|-----|
| 1 village fonctionnel | ✅ | — |
| 2–3 bâtiments utiles | ✅ | 8 bâtiments (dont verrouillés par stade) |
| 2 biomes jouables | ✅ | 8 biomes (progression requise) |
| 10–15 compagnons | ✅ | 15 compagnons |
| Capture + refuge | ✅ | TNR dev OK ; prod gated par stade |
| Buffs actifs | ✅ | Affichés + appliqués (capture bonus, etc.) |
| Objectifs visibles | ⚠️ | Quêtes existantes ; pas de fil objectifs 0.10 dédié |
| Amélioration bâtiment | ✅ | UI Bâtiments + panorama |
| Déblocage biome | ✅ | `BIOME_UNLOCK_REQUIREMENTS` |
| Sauvegarde | ✅ | — |
| **Mini-jeu Lien compagnon (corpus v2)** | ❌ | Corpus externe non intégré — voir arbitrage |

## Version 0.10 minimale retenue

**Déjà atteinte en grande partie** sur `main` post-merge. Le travail restant pour une 0.10 *polish* :

1. TNR progression normale (sans flags dev) jusqu'au Refuge.
2. Objectifs guidés courts (5 quêtes tutoriel ou équivalent).
3. Intégration du corpus **mini-jeu Lien** (`wonderland_companion_link_corpus_v2_clean_compact.zip`).
4. Feedback UI relâchement / buffs en prod.

## Critères de complétion 0.10

- [ ] Joueur sans dev peut atteindre Refuge + Chasse via progression village.
- [ ] Au moins 5 objectifs courts complétables une fois.
- [ ] Boucle capture → refuge → relâchement → gain ressource testée sans debug.
- [ ] Mini-jeu Lien v2 jouable depuis hub (décision design requise).
- [ ] `docs/TNR_GAMEPLAY.md` mis à jour avec parcours prod.

## Arbitrages laissés pour demain

| Sujet | Options | Recommandation |
|-------|---------|----------------|
| Nom produit Wonderland vs IDLE Isekai Chill | Rebrand UI vs garder Havre des Brumes | Garder Havre des Brumes en code, Wonderland en doc design |
| Corpus Lien v2 | Importer zip vs réécrire scénarios | Auditer zip puis brancher `ConversationGame` |
| Objectifs 0.10 | Réutiliser quêtes infinies vs module dédié | Étendre `infiniteQuests` avec 5 entrées tutoriel |
| Économie chasse | Coût Éclats vs tickets | Aligner sur ressources existantes (coins/tickets) |

## Limites assumées (0.10)

- Pas de combat complexe, multijoueur, monétisation.
- Pas de refonte state global (Zustand) — state React + localStorage.
- Polish UI limité aux labels/feedback, pas nouvelle charte.
