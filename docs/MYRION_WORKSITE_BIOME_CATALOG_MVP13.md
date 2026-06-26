# Catalogue biomes Ferme lunaire — MVP 13

## Objectif

Créer le catalogue structuré des **15 biomes** et de leurs **composants / filons** exploitables, sans activer les 12 nouveaux biomes en gameplay et sans générer d’assets.

Module source : `src/data/myrionWorksiteBiomeCatalog.ts` (feuille, sans import gameplay).

## Liste des 15 biomes

| Tier | ID technique | Nom affiché | Statut gameplay |
|------|----------------|-------------|-----------------|
| 1 | `prairie-chantier` | Prairie lunaire | **actif** |
| 2 | `foret-douce` | Forêt mousseuse | **actif** |
| 3 | `mine-tranquille` | Mine douce | **actif** |
| 4 | `marais-lucioles` | Marais des lucioles | catalogue |
| 5 | `rivage-brumeux` | Rivage brumeux | catalogue |
| 6 | `vergers-suspendus` | Vergers suspendus | catalogue |
| 7 | `ruines-florales` | Ruines florales | catalogue |
| 8 | `grotte-cristalline` | Grotte cristalline | catalogue |
| 9 | `desert-cendres-roses` | Désert de cendres roses | catalogue |
| 10 | `montagne-vents` | Montagne des vents | catalogue |
| 11 | `lac-etoile` | Lac étoilé | catalogue |
| 12 | `bois-automne-eternel` | Bois d’automne éternel | catalogue |
| 13 | `jardin-fongique` | Jardin fongique | catalogue |
| 14 | `sanctuaire-astral` | Sanctuaire astral | catalogue |
| 15 | `ile-celeste` | Île céleste | future |

**Total composants catalogue : 90** (6 par biome).

## Composants par biome (résumé)

### Biomes actifs (3 spots gameplay chacun)

- **Prairie lunaire** — champs tendres, bosquet clair, pierrier doux (+ fleurs, herbes, source catalogue)
- **Forêt mousseuse** — sous-bois dense, clairière d’herbes, source claire (+ tronc, baies, mousse catalogue)
- **Mine douce** — pierrier profond, veine brute, charbonnière calme (+ cristaux, champignons, ruissellement catalogue)

Chaque composant actif expose `legacyGameplaySpotId` vers `myrionWorksiteDefs` / `myrionWorksite.ts`.

### Biomes catalogue (12 × 6 composants)

Voir le fichier source pour le détail complet (noms, types, `assetKey`, slots).

## Ressources prévues

Types de composants : `food`, `wood`, `stone`, `herb`, `water`, `ore`, `coal`, `crystal`, `flower`, `mushroom`, `sand`, `shell`, `wind`, `astral`, `seed`, `relic`.

Ressources produites catalogue : mêmes IDs + `ingredients` (référence future).

Les ressources spécialisées (herb, ore, coal, etc.) ne sont **pas** encore dans l’économie globale — migration MVP 14.

## IDs techniques

- **Conservés** : `prairie-chantier`, `foret-douce`, `mine-tranquille`
- **Spots gameplay inchangés** : `bosquet`, `pierrier`, `champs`, `sous-bois`, `clairiere-herbes`, `source-claire`, `pierrier-profond`, `veine-brute`, `charbonniere`
- **Nouveaux biomes** : kebab-case français (`marais-lucioles`, `rivage-brumeux`, …)
- **Alias visuels documentés** : `marais-doux`, `cristal-lumineux`, `faille-astrale` (MVP 9 visuals)

## Stratégie de compatibilité (3 biomes existants)

1. Aucun changement de `WORKSITE_BIOME_IDS` ni de `WorksiteSpotId`.
2. Labels UI enrichis dans `myrionWorksiteDefs.ts` (Prairie lunaire, Forêt mousseuse, Mine douce).
3. Le catalogue vit **à part** — le gameplay continue d’utiliser 3 spots / biome via `SPOT_CATALOG`.
4. Les 3 composants actifs par biome ont `available: true` + `legacyGameplaySpotId`.
5. Les 3 composants supplémentaires par biome ont `available: false` — pas branchés en UI.

## Placement théorique

6 slots par biome : `topLeft`, `topCenter`, `topRight`, `midLeft`, `midRight`, `bottomCenter`.

Coordonnées % par défaut + variantes mobile optionnelles — **à valider MVP 16** sur fonds wide réels.

## Hors scope MVP 13

- Génération d’assets PNG
- Activation gameplay des 12 nouveaux biomes
- Rééquilibrage complet
- Refonte UI Ferme lunaire
- Branchement des 6 composants / biome en production
- Placement pixel-perfect

## Risques pour MVP 14

| Risque | Mitigation |
|--------|------------|
| Divergence ressource spot vs catalogue (ex. bosquet = food en jeu, wood en catalogue) | Migration progressive ressources + overrides balance |
| Collision alias visuels (`faille-astrale` prestige vs sanctuaire) | Séparer spot prestige et biome sanctuaire en intégration |
| Extension `WorksiteSpotId` / save | Union types + migration save |
| 6 composants vs 3 spots UI | Drawer spots paginé ou scroll — design MVP 14 |
| Nouvelles ressources inventaire | Étendre `ResourceKey` ou ressources chantier internes |

## Migration MVP 14 (aperçu)

1. Étendre `WORKSITE_BIOME_IDS` depuis le catalogue (biome par biome).
2. Mapper composants catalogue → spots gameplay (`legacyGameplaySpotId` → nouveaux IDs).
3. Activer `available: true` au fur et à mesure des assets.
4. Brancher déblocages tier sur `WORKSITE_UNLOCK_THRESHOLDS` étendu.
5. Harmoniser `myrionWorksiteVisuals.ts` avec `backgroundAssetKey` catalogue.

## Checklist

- [x] Catalogue 15 biomes typé
- [x] 90 composants documentés
- [x] 3 biomes legacy mappés sans casser les IDs
- [x] Module feuille sans cycle d’import
- [x] Labels displayName enrichis
- [ ] Build `npm run build`
- [ ] Smoke Ferme lunaire — 3 biomes OK
- [ ] Console sans erreur

## Helpers exportés

- `getCatalogBiome`, `listCatalogBiomes`
- `isLegacyPlayableBiome`
- `getCatalogComponent`, `listActiveGameplayComponents`
- `getPlacementSlot`
- `WORKSITE_CATALOG_COMPONENT_COUNT`
