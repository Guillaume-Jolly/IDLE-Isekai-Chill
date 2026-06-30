# Objectifs tutoriel 0.10

> **Date :** 2026-06-23  
> **Branche :** `feature/link-corpus-v2`  
> **UI :** onglet **Quêtes** → section « Objectifs du havre »

## Boucle couverte

```
Village (collecte) → Bâtiments → Chasse → Capture → Refuge → Soin
  → Compagnons → Lien → Inventaire → Préparation biome suivant
```

## Les 10 objectifs

| # | ID | Titre | Validation | Récompense |
|---|-----|-------|------------|------------|
| 1 | `collect-resources` | Première récolte | Somme ressources > starter + marge (tick idle) | 40 pièces, 25 vivres |
| 2 | `upgrade-building` | Chantier du havre | Niveau max bâtiment > 1 | 30 bois, 25 pierre, 50 pièces |
| 3 | `open-hunt` | Portes de la chasse | Ouverture mini-jeu Chasse (signal) | 8 renom, 0.25 ticket |
| 4 | `capture-myrion` | Première capture | `pets` / `pendingHuntCaptures` / `captureStats` | 12 cadeaux, 15 ingrédients |
| 5 | `open-refuge` | Refuge des brumes | Ouverture mini-jeu Dressage (signal) | 40 vivres, 15 mana |
| 6 | `refuge-care` | Soin bienveillant | Stats Myrion modifiées (nourrir/câliner/jouer) | 10 soie, 3 poussière |
| 7 | `open-companions` | Liens du havre | Visite onglet Compagnons | 15 cadeaux, 10 renom |
| 8 | `play-link` | Conversation intime | Mini-jeu Lien terminé | 25 mana, 5 poussière |
| 9 | `open-inventory-familiers` | Inventaire familiers | Visite onglet Inventaire | 8 cristaux, 35 pièces |
| 10 | `prepare-next-biome` | Horizon suivant | ≥ 5 Myrions capturés (déblocage Forêt ancienne) | 0.5 ticket, 20 renom, 40 bois |

## Implémentation

| Fichier | Rôle |
|---------|------|
| `src/data/tutorialObjectives.ts` | Définitions, validation rétroactive, anti-double récompense |
| `src/components/TutorialObjectivesPanel.tsx` | UI cartes + bouton récupérer |
| `src/App.tsx` | `GameState.tutorial`, sync sur tick/save/minigames/vues |

### Persistance

- Clé save : `tutorial` dans `idle-isekai-chill-game-v1`
- Champs : `completedIds`, `claimedIds`, `signals`
- Migration : `syncTutorialObjectives()` au chargement (validation rétroactive)

### Anti-double récompense

`claimTutorialObjective()` refuse si déjà dans `claimedIds`.

## Tests manuels recommandés

1. **Nouvelle partie** — objectif 1 se complète après ~5 s (tick production).
2. **Objectifs 1–3** — améliorer bâtiment, ouvrir chasse depuis Mini-jeux.
3. **Reload** — progression conservée, récompenses non dupliquées.
4. **Partie avancée** — charger une save avec captures → objectifs 4 et 10 rétroactifs.
5. **Mobile** — onglet Quêtes, cartes lisibles, boutons accessibles.

## Limites connues

- Pas de pop-up toast à la complétion (statut sur la carte uniquement).
- Étape N verrouillée tant que N−1 n’est pas complétée (pas forcément réclamée).
- Soin refuge : détection heuristique sur stats Myrion (pas de compteur dédié).
