# Chantier Myrion — MVP 16 placement visuel

> **Date :** 2026-06-26  
> **Branche (historique, mergée) :** `feature/myrion-worksite-mvp2` → `main` @ `v2.1.0.0`  
> **Prérequis :** MVP 15 (assets + registry)

## Objectif

Valider et corriger le placement des **3 filons actifs × 15 biomes** (45 filons) sur fond wide 2560×960, desktop et mobile ~390 px, sans modifier économie / progression / save structure.

## Méthode de test

### Dev unlock (session uniquement, `import.meta.env.DEV`)

| Méthode | Effet |
|---------|--------|
| URL `?worksiteDevUnlock=1` | Affiche / parcourt les 15 biomes + filons sans débloquer la save |
| `localStorage['worksite-dev-unlock-all'] = '1'` | Idem persistant en session dev |
| Drawer Biomes → boutons **Dev unlock** / **Placement debug** | Bascule en jeu (dev only) |

La progression réelle (`unlockedBiomeIds`, `unlockedSpotKeys`) n’est **pas** modifiée par le dev unlock. Seul `activeBiomeId` peut changer pour prévisualiser un biome verrouillé.

### Overlay placement

| Méthode | Effet |
|---------|--------|
| URL `?worksitePlacementDebug=1` | Slots catalogue + % filons |
| Drawer → **Placement debug** | Idem |

## Architecture

| Module | Rôle |
|--------|------|
| `myrionWorksitePlacement.ts` | Résout slot catalogue → `left/top/scale/zIndex` + deltas biome/spot |
| `myrionWorksiteDev.ts` | Flags dev unlock / debug |
| `WorksitePlacementDebug.tsx` | Overlay dev-only |
| `MyrionWorksiteGame.tsx` | `position: absolute` sur marqueurs via `worksiteSpotPlacementStyle` |
| `Worksite.css` | `object-position` par biome, styles debug |

Flux : composant actif → `recommendedPlacementSlot` → `placementSlots` du biome → deltas MVP 16.

## Biomes vérifiés (15/15)

Tous les biomes utilisent le placement data-driven. Ajustements `BIOME_SLOT_DELTAS` par biome dans `myrionWorksitePlacement.ts`.

| Biome | Fond `object-position` | Notes filons |
|-------|------------------------|--------------|
| Prairie lunaire | center 70% | Legacy slots conservés |
| Forêt mousseuse | center 66% | — |
| Mine douce | center 62% | Prestige faille séparé (anchor CSS) |
| Marais des lucioles | center 68% | — |
| Rivage brumeux | center 74% | Coquillages bas |
| Vergers suspendus | center 64% | Slots remontés (îlots flottants) |
| Ruines florales | center 68% | Lierre +14 % scale |
| Grotte cristalline | center 58% | — |
| Désert cendres roses | center 72% | — |
| Montagne des vents | center 56% | Courants légèrement haut |
| Lac étoilé | center 70% | — |
| Bois automne éternel | center 66% | — |
| Jardin fongique | center 62% | — |
| Sanctuaire astral | center 60% | Fragment astral remonté |
| Île céleste | center 55% | Slots remontés (ciel) |

## Corrections principales

1. **Fin du flex bas** — les filons ne sont plus en `space-around` en bas d’écran.
2. **Placement catalogue** — chaque filon actif utilise son `recommendedPlacementSlot`.
3. **Mobile** — coordonnées `mobileXPercent` / `mobileYPercent` du catalogue.
4. **Cadrage fonds** — `object-position` par biome (CSS + `WORKSITE_BIOME_BACKGROUND_FRAMES`).
5. **Z-index** — basé sur `topPercent` (filons bas devant).

## Assets désactivés

**Aucun** — `ruines-lierre-ancien.png` reste actif avec scale +14 % et emoji fallback si chargement échoue.

## Résultats

| Plateforme | Statut |
|------------|--------|
| Desktop | **OK** — build + placement absolu |
| Mobile 390 px | **OK** — coords mobile + marqueurs 3.15 rem |
| Console / 404 | **OK** — pas de nouveau chemin asset |

Smoke interactif navigateur : à valider manuellement avec `?worksiteDevUnlock=1&worksitePlacementDebug=1`.

## Dettes MVP 17+

- Affiner biome par biome après retour art (micro-deltas)
- Regénérer `ruines-lierre-ancien.png` si silhouette trop faible en jeu
- Placement des 45 composants catalog-only (non MVP)

## Checklist

- [x] `npm run build`
- [x] 15 biomes placement data-driven
- [x] Dev unlock + overlay debug
- [ ] Smoke manuel 15 biomes + minage multi-biomes
