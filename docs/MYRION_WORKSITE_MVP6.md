# Chantier Myrion — MVP 6 Prestige (Faille astrale)

## Objectif

Première couche **endgame / prestige LR-only** pour la Ferme lunaire, sans bloquer la progression normale ni toucher l’économie globale (wood / stone / food).

## Périmètre livré

- **Faille astrale** visible dans la scène **Mine tranquille** (pas de biome Astral jouable).
- Drawer **Prestige** : état, production, total, assignation LR.
- Ressource interne chantier : **Éclats astraux** (`totalAstralShards` dans `myrionWorksite`).
- Production passive très lente (~`0.002`/s par LR, +15 % si Mine en supervision).
- Sons procéduraux légers : ouverture prestige, assignation LR (`worksiteAudio.ts`).

## Règle LR-only

| Règle | Implémentation |
|--------|----------------|
| Visible sans LR | Oui (verrouillée visuellement) |
| Assignable uniquement LR | `canAssignPetToPrestige` + UI filtrée |
| Non-LR interdit | Pas d’entrée assignation prestige |
| Un LR sur Faille = occupé ailleurs | `worksitePetIsBusy` + `prestigeAssignedMyrionId` |
| Un Myrion = un poste chantier max | Assignation prestige retire les filons ; filon retire prestige |

## Données

- Config : `src/data/myrionWorksitePrestige.ts`
- Save (`MyrionWorksiteSave`) :
  - `totalAstralShards?: number`
  - `prestigeAssignedMyrionId?: string | null`
  - `prestigeSeen?: boolean`
- Migration : `mergePrestigeSaveFields` dans `mergeMyrionWorksite` — défauts `0` / `null` / `false`.

## Assets

- `public/assets/minigames/myrion-worksite/spots/faille-astrale.png` : **absent** → placeholder CSS `mg-worksite-spot-object--faille-astrale` + emoji ✨.
- Ne pas activer `available: true` tant que le PNG n’est pas validé.

## Hors scope (MVP 6)

- Biome Astral complet jouable
- Ressource globale inventaire / ResourceKey
- Boutique ou upgrades prestige
- Fenêtre passive PC, offline long
- Refactor save global
- Équilibrage final, assets finaux wide
- Nouveaux systèmes LR

## Checklist test

- [ ] Ouvrir Ferme lunaire → drawer **Prestige** visible
- [ ] Mine débloquée → Faille astrale en scène (coin haut-droit)
- [ ] Sans LR en collection → état verrouillé, message clair
- [ ] Avec LR : assigner → production > 0, total monte
- [ ] Reload → assignation + total conservés
- [ ] Non-LR non proposé dans Prestige
- [ ] LR sur Faille → indisponible pour filons normaux
- [ ] Prairie / Forêt / Mine inchangés
- [ ] Console sans erreur
- [ ] `npm run build` OK

## Test assignation LR

Si la save de test ne contient aucun Myrion LR : valider uniquement l’état verrouillé et documenter le test assignation comme **non fait**.
