# Chantier Myrion — MVP 1

> **Branche cible :** `feature/myrion-worksite-mvp1`  
> **Statut :** MVP 1 — boucle de base supervisée

## Objectif

Mini-jeu idle **contemplatif** : le joueur assigne des Myrions à trois spots de la **Prairie du chantier**, observe une production automatique très faible, et peut tap/cliquer pour un léger bonus. Ce MVP prouve la boucle — pas l’économie finale.

## Périmètre MVP 1

- Écran « Chantier Myrion » (hub mini-jeux, ferme lunaire)
- 1 biome : **Prairie du chantier** (`prairie-chantier`)
- 3 spots : Bosquet (bois), Pierrier (pierre), Champs (vivres)
- Clic/tap actif sur le spot sélectionné
- Production auto faible (écran ouvert)
- Assignation Myrion simple (1 spot max par Myrion dans le Chantier)
- Menu gauche repliable (spots, ressources, assignation, aide)
- Panneau détail production repliable
- Sauvegarde dans `minigameSave.myrionWorksite`

## Hors scope MVP 1

- Multi-biomes, panorama, fenêtre PC indépendante
- LR-only, ressources exclusives LR
- Assets finaux, sound design, animations de vie
- Supervision avancée, offline gains longs
- Manger / dormir / repos Myrions
- Équilibrage final
- Myrions indisponibles ailleurs (MVP : toujours disponibles chasse/refuge)

## Spots

| ID | Nom | Ressource (`ResourceKey`) | Débloqué |
|----|-----|---------------------------|----------|
| `bosquet` | Bosquet | `wood` | oui |
| `pierrier` | Pierrier | `stone` | oui |
| `champs` | Champs | `food` | oui |

## Production (provisoire)

- **Clic :** ~0,4 + 0,05 × nb Myrions assignés (arrondi ≥ 1)
- **Auto :** ~0,012 × coef rareté × nb Myrions / seconde (spot actif uniquement en MVP 1)
- Coefficients rareté : N×1, R×1,25, SR×1,5, SSR×2, UR×2,5, LR×3
- Gains additifs via `onComplete(..., { keepOpen: true })` — très faibles vs autres mini-jeux

## Assignation

- Liste = `minigameSave.pets` (Myrions possédés)
- Un Myrion → un seul spot du Chantier
- Retrait / assignation persistés au reload

## Save

Champ `myrionWorksite` dans `MinigameSave` :

- `selectedSpotId`
- `assignedMyrionIdsBySpot`
- `totalProducedBySpot`
- `lastAutoTickAt`

Migration : defaults si absent (anciennes saves OK).

## UI

- Mobile-first, style `mg-*` existant
- Drawer gauche repliable
- Scène placeholder (dégradé prairie)
- Pas de tableau massif par défaut

## Risques

- Double timer si unmount oublié → `useEffect` cleanup
- Double récompense auto → tick par delta timestamp + cap 5 s
- Spam clic → cooldown 180 ms

## Critères de validation

- [ ] Hub → Chantier Myrion ouvre l’écran
- [ ] 3 spots, clic, assignation, auto, drawer, détail, save/reload
- [ ] Build + lint OK
- [ ] Chasse / refuge / inventaire non régressés (smoke manuel)
