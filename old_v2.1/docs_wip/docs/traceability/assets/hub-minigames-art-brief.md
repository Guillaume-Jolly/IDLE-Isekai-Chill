# Hub mini-jeux — brief art IA

Dossiers réservés : `public/assets/minigames/hub/presentations/`, `.../stages/` (`.gitkeep` seulement).

## Objectif

Écran hub avant de lancer un mini-jeu : **carte présentation** du bâtiment + **stage** thématique (pas de cinématique longue).

## Assets à produire (suggestion)

| Fichier | Ratio | Contenu |
|---------|-------|---------|
| `presentations/{buildingId}.png` | 16:9 | Vue stylisée du lieu (bibliothèque, source, théâtre…) sans personnage |
| `stages/{buildingId}.png` | 9:16 mobile / 16:9 PC | Fond de scène neutre pour overlay UI |

`buildingId` = ids dans `buildingActivities.ts` (`arcane-library`, `clear-spring`, …).

## Prompt type (ChatGPT / pipeline habituel)

> Cozy fantasy idle game UI background, {lieu}, warm lighting, no characters, empty space lower third for dialogue dock, painterly anime style, soft gradients, 16:9

## Prod cible (quand validé)

`assets/Background/hub/presentations/` et `assets/Background/hub/stages/` — **pas** promote auto depuis staging.

## Références visuelles existantes

Réutiliser la palette des biomes : `assets/Background/{biome}/capture-portrait.png` comme moodboard.

Je ne génère pas les PNG ici (pipeline IA = ton `Input chatgpt/` / outil habituel). Ce brief suffit pour une session dédiée.
