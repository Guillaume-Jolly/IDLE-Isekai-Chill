# Ferme lunaire — MVP 14 intégration 15 biomes

## Objectif

Brancher les **15 biomes** du catalogue MVP 13 dans la progression jouable, avec **3 filons actifs par biome**, sans attendre les assets définitifs des 12 nouveaux biomes.

## Stratégie

| Couche | Rôle |
|--------|------|
| `myrionWorksiteBiomeCatalog.ts` | Catalogue descriptif complet (90 composants) — inchangé |
| `myrionWorksiteBiomeRuntime.ts` | **Gameplay MVP 14** : 3 composants actifs / biome, mapping ressources, métadonnées spots |
| `myrionWorksiteDefs.ts` | IDs biomes/spots étendus, save |
| `myrionWorksiteBalance.ts` | Seuils déblocage biomes 4–15 |
| `myrionWorksiteProgression.ts` | Totaux ressources + évaluation déblocages |
| `myrionWorksiteVisuals.ts` | Fallbacks fonds / spots |

## Pourquoi seulement 3 filons actifs / biome

- Évite une UI à 6 marqueurs (fragile mobile).
- Les 3 autres composants restent catalogue-only pour MVP 15–16.
- 45 filons actifs au total restent gérables (production passive + assignation).

## Biomes intégrés (ordre)

1. `prairie-chantier` — Prairie lunaire  
2. `foret-douce` — Forêt mousseuse  
3. `mine-tranquille` — Mine douce  
4. `marais-lucioles`  
5. `rivage-brumeux`  
6. `vergers-suspendus`  
7. `ruines-florales`  
8. `grotte-cristalline`  
9. `desert-cendres-roses`  
10. `montagne-vents`  
11. `lac-etoile`  
12. `bois-automne-eternel`  
13. `jardin-fongique`  
14. `sanctuaire-astral`  
15. `ile-celeste`  

IDs techniques des 3 premiers **inchangés**.

## Mapping ressources temporaires

Catalogue → inventaire global (`CATALOG_RESOURCE_TO_GAMEPLAY`) :

| Catalogue | Gameplay |
|-----------|----------|
| food, mushroom, seed | `food` |
| wood | `wood` |
| stone, ore, coal, sand, shell | `stone` |
| herb, water, flower | `ingredients` |
| crystal | `crystals` |
| wind | `mana` |
| astral | `stardust` |
| relic | `renown` |

Pas de nouvelle `ResourceKey` globale.

## Seuils de déblocage (provisoire)

- **Biomes 1–3** : inchangés MVP 10 (Forêt 28 total, Mine 52 total + 18 bois).
- **Biomes 4–15** : `totalChantier` croissant + une ressource des biomes **précédents** (bois, pierre, vivres, ingrédients) — jamais une ressource exclusive au biome N ou ultérieur.
- **Spots 2–3** par nouveau biome : petits paliers `totalChantier` (+4 à +8 après le biome parent).

Voir `WORKSITE_UNLOCK_THRESHOLDS` dans `myrionWorksiteBalance.ts`.

## Fallback visuel

- Fonds : gradients CSS par biome (`mg-worksite-bg--*`), `available: false` sur PNG manquants.
- Spots : placeholder par type de ressource (`mg-worksite-spot-object--resource-*`) si PNG absent.
- Alias : marais → `swamp.png`, grotte → `crystal.png`, sanctuaire → `astral.png` (CSS seulement si PNG non validé).

## Compatibilité save

- `WORKSITE_SAVE_MIGRATION_VERSION = 2`
- Saves MVP 1–13 : biomes déjà débloqués conservés ; nouveaux biomes verrouillés jusqu’aux seuils.
- Migration v1 (reset assignations) **non rejouée** sur v2.
- `selectedSpotByBiome` / assignations étendues automatiquement pour les 15 biomes.

## UI

- Drawer Biomes : liste scrollable (max ~24rem), 15 entrées.
- Mode surveillance : emojis biomes en wrap compact.
- Pas de refonte globale de la Ferme lunaire.

## Risques MVP 15 / 16

| Risque | Suite |
|--------|--------|
| Assets backgrounds manquants | MVP 15 génération / validation PNG |
| Placement 6 composants | MVP 16 sur fonds wide |
| Mapping ressources temporaire | Affiner quand inventaire étendu |
| Équilibrage seuils | Itération MVP 15 balance |

## Checklist test

- [x] Build `npm run build`
- [ ] Ferme lunaire : 15 biomes visibles dans le drawer
- [ ] 3 biomes legacy jouables (clic filons)
- [ ] Au moins un biome 4+ verrouillé avec hint
- [ ] Pas d’image cassée (404)
- [ ] Console sans erreur
- [ ] Mobile ~390 px : liste biomes scrollable
