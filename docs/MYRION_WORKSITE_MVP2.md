# Chantier Myrion — MVP 2

Extension du chantier Myrion (MVP 1) avec trois biomes, production passive globale et bonus de supervision sur le biome affiché.

## Biomes

| ID | Label | Spots |
|----|-------|-------|
| `prairie-chantier` | Prairie du chantier | bosquet (wood), pierrier (stone), champs (food) |
| `foret-douce` | Forêt douce | sous-bois (wood), clairiere-herbes (food*), source-claire (food*) |
| `mine-tranquille` | Mine tranquille | pierrier-profond (stone), veine-brute (stone*), charbonniere (stone*) |

\* Ressources provisoires — `ResourceKey` ne contient que wood/stone/food. Herbes, eau, minerai et charbon seront branchés quand les clés existent.

## Modèle de sauvegarde

```ts
MyrionWorksiteSave {
  activeBiomeId: WorksiteBiomeId
  unlockedBiomeIds: WorksiteBiomeId[]   // 3 débloqués par défaut MVP 2
  selectedSpotByBiome: Record<WorksiteBiomeId, WorksiteSpotId>
  assignedMyrionIdsBySpot: Record<string, string[]>  // clé "biome:spot"
  totalProducedBySpot: Partial<Record<string, number>>
  lastAutoTickAt: number
}
```

### Migration MVP 1

`mergeMyrionWorksite` convertit sans perte :

- `biomeId` → `activeBiomeId`
- `selectedSpotId` → `selectedSpotByBiome['prairie-chantier']`
- clés plates (`bosquet`, …) → `prairie-chantier:bosquet`

## Production

- **Un seul timer** (`1000 ms`) et **un** `lastAutoTickAt` partagé.
- Chaque tick parcourt tous les spots des biomes débloqués avec assignations.
- **Supervision** : `WORKSITE_SUPERVISION_MULT = 1.15` appliqué uniquement aux spots du biome actif (`activeBiomeId`).
- **Clic** : spot sélectionné du biome actif uniquement.

## Fichiers

- `src/data/myrionWorksite.ts` — données, migration, math
- `src/components/minigames/MyrionWorksiteGame.tsx` — UI
- `src/components/minigames/Worksite.css` — panoramas et drawer biomes

## Panoramas

Classes CSS placeholder par biome :

- `.mg-worksite-scene--prairie` — ciel / prairie
- `.mg-worksite-scene--foret` — vert forêt
- `.mg-worksite-scene--mine` — gris mine
