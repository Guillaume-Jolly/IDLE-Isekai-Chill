# Onboarding & hints contextuels — MVP 12

## Objectif

Améliorer la compréhension du joueur sans tutoriel intrusif :

- quoi faire maintenant ;
- à quoi sert chaque système ;
- quels compagnons sont liés à chaque activité ;
- comment naviguer dans le Havre des Brumes.

Aucune récompense, aucun tracking lourd, aucun bonus chiffré compagnon.

## Systèmes couverts

| Système | Écran / zone | Fichier hint |
|---------|----------------|--------------|
| Ferme lunaire | Chantier Myrion (`myrion-worksite`) | `systemHints.ts` + overlay via `WorksiteCompanionSupport` |
| Refuge | Refuge des Myrions (`dressage`), Familiers (`pet-sanctuary`) | `SystemContextHint` |
| Chasse | Chasse aux familiers | `SystemContextHint` |
| Village | Carte village (vue principale) | `SystemContextHint` |
| Inventaire | Panneau inventaire | `SystemContextHint` |
| Gacha | Vue événement / festival | `SystemContextHint` |
| Hub mini-jeux | Liste des activités | descriptions + compagnons liés + badge « Recommandé » |

## Logique « Que faire maintenant ? »

Module : `src/data/nextStepGuidance.ts`  
UI : `src/components/NextStepGuidance.tsx`

Priorité (data-driven, sans quête) :

1. **Ferme lunaire non engagée** (aucune production ni assignation) → « Découvrir la Ferme lunaire »
2. **Myrions présents mais aucun assigné au chantier** → « Assigner un Myrion à une activité »
3. **Aucun Myrion au refuge** → « Voir les Myrions au Refuge »
4. **Peu de ressources visibles** (&lt; 4 types) → « Consulter les ressources »
5. **Tickets gacha disponibles** → « Tenter une invocation »
6. **Sinon** → « Continuer à améliorer le Havre »

Affichage :

- carte village (écran principal) ;
- hub mini-jeux.

Bouton « Y aller » : navigation vers la vue ou l’activité cible.

## Intégration `companionSupport`

- Phrases système : `src/data/systemHints.ts` (`SYSTEM_CONTEXT_HINTS`)
- Compagnons liés (1 à 3) : `listProfilesForSystem()` depuis `companionSupport.ts`
- Badge affiché : **Conseil compagnon**
- Voix compagnon optionnelle (overlay ferme lunaire) : `pickCompanionSupportForSystem()`
- Hub : `supportSystemForActivity()` mappe `minigameType` → système

## Fichiers ajoutés / modifiés

**Nouveaux**

- `src/data/systemHints.ts`
- `src/data/nextStepGuidance.ts`
- `src/components/SystemContextHint.tsx`
- `src/components/NextStepGuidance.tsx`
- `src/components/onboardingHints.css`

**Modifiés**

- `src/App.tsx` — guidance village, gacha hint, props hub
- `src/components/minigames/MinigameHub.tsx` — next step, recommandé, compagnons liés
- `src/components/minigames/WorksiteCompanionSupport.tsx` — harmonisé sur `SystemContextHint`
- `src/components/InventoryPanel.tsx`
- `src/components/minigames/PetSanctuaryGame.tsx`
- `src/components/minigames/DressageGame.tsx`
- `src/components/minigames/FamiliarCaptureGame.tsx`

## Hors scope (MVP 12)

- Nouveau mini-jeu
- Bonus chiffrés compagnon
- Modification économie / balance
- Système de quêtes complexe
- Tutoriel modal ou pop-up au démarrage
- Tracking analytics / visit flags persistants dédiés
- Refonte assets

## Checklist test

- [ ] Build : `npm run build` sans erreur
- [ ] Hub mini-jeux : bloc « À faire maintenant », carte recommandée, compagnons liés
- [ ] Ferme lunaire : hint repliable, overlay mobile OK
- [ ] Refuge (dressage + familiers) : hint discret
- [ ] Chasse : hint dans la barre d’outils
- [ ] Inventaire : hint en tête de panneau
- [ ] Gacha (événement) : hint présent
- [ ] Village : guidance + hint village, pas de scroll horizontal
- [ ] Mobile ~390 px : hints repliables, blocs compacts
- [ ] Console navigateur sans erreur sur parcours rapide
