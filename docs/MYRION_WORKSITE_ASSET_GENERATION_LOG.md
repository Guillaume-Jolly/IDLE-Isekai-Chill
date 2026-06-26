# Chantier Myrion — Journal génération assets IA (lot 4B)

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Outil :** génération IA Cursor + détourage fond blanc (`scripts/worksite-remove-white-bg.py`)

## Direction visuelle retenue

- Soft anime fantasy, cozy idle game
- Matte soft rendering, formes lisibles mobile
- Pas de photoréalisme, pas de texte/logo/watermark
- Références : placeholders CSS existants + pipeline `MYRION_WORKSITE_ASSET_PIPELINE.md`

## Assets générés et intégrés (`available: true`)

### Backgrounds (3)

| Fichier | Biome | Statut |
|---------|-------|--------|
| `backgrounds/prairie.png` | Prairie du chantier | Intégré |
| `backgrounds/forest.png` | Forêt douce | Intégré |
| `backgrounds/mine.png` | Mine tranquille | Intégré |

### Spots gameplay (9)

| Fichier | Spot | Statut |
|---------|------|--------|
| `spots/bosquet.png` | Bosquet | Intégré |
| `spots/pierrier.png` | Pierrier | Intégré |
| `spots/champs.png` | Champs | Intégré |
| `spots/sous-bois.png` | Sous-bois | Intégré |
| `spots/clairiere-herbes.png` | Clairière aux herbes | Intégré |
| `spots/source-claire.png` | Source claire | Intégré |
| `spots/pierrier-profond.png` | Pierrier profond | Intégré (fichier dédié) |
| `spots/veine-brute.png` | Veine brute | Intégré |
| `spots/charbonniere.png` | Charbonnière | Intégré |

### Décorations MVP 4 (2)

| Fichier | Usage | Statut |
|---------|-------|--------|
| `decorations/rest-zone.png` | Coin repos | Intégré (`WorksiteMyrionLifeLayer`) |
| `decorations/food-zone.png` | Coin nourriture | Intégré |

### Icônes ressources (7)

| Fichier | Ressource | Statut |
|---------|-----------|--------|
| `icons/wood.png` | Bois | Intégré |
| `icons/stone.png` | Pierre | Intégré |
| `icons/food.png` | Vivres | Intégré |
| `icons/herbs.png` | Herbes | Intégré (visuel seul) |
| `icons/water.png` | Eau | Intégré (visuel seul) |
| `icons/ore.png` | Minerai | Intégré (visuel seul) |
| `icons/coal.png` | Charbon | Intégré (visuel seul) |

## Assets générés, rangés, non intégrés (`available: false`)

### Backgrounds futurs (3)

- `backgrounds/swamp.png` — Marais fertile
- `backgrounds/crystal.png` — Caverne cristalline
- `backgrounds/astral.png` — Faille astrale

### Spots futurs (5)

- `spots/cristalliere.png`
- `spots/marais-fertile.png`
- `spots/champignonniere.png`
- `spots/ruines-anciennes.png`
- `spots/faille-astrale.png`

### Icônes futures (2)

- `icons/crystal.png`
- `icons/spores.png`

### Décorations avance (1)

- `decorations/small-tent.png`

### UI overlays (4) — générés, pas branchés en `<img>`

Les overlays UI restent sur classes CSS (`worksiteSpotMarkerClassNames`). Fichiers prêts :

- `ui/spot-active.png`
- `ui/spot-locked.png`
- `ui/biome-locked.png`
- `ui/spot-supervised.png`

**À faire :** brancher `WorksiteOptionalImage` sur les markers / boutons biome si souhaité.

## Assets non générés (documentés seulement)

- `spots/nid-echo.png`, `spots/noyau-primordial.png`
- `icons/fertile-mud.png`, `icons/ancient-fragment.png`, `icons/echo-fragment.png`, `icons/astral-ore.png`, `icons/origin-shard.png`
- `decorations/soft-campfire.png`, `food-basket.png`, `rest-cushion.png`, `work-crate.png`, `soft-lantern.png`
- Variantes `backgrounds/variants/*-v2.png`

## Problèmes connus / à refaire

| Problème | Détail | Action |
|----------|--------|--------|
| Transparence | Fond blanc retiré par script (seuil 245) — halos possibles | Regénérer ou détourage manuel si halo visible |
| Résolution | Panoramas ~1024×1024 générés, pas 1920×720 natif | Upscale ou regénération wide si besoin |
| Style | Cohérent soft anime mais pas encore calé sur compagnons finaux | Comparer en jeu, garder 1 variante par biome |
| UI overlays | PNG présents mais rendu CSS prioritaire | Intégration visuelle phase polish |
| `icons/crystal.png` | 85 % pixels transparents après détourage | Valider visuellement avant `available: true` |

## Post-traitement

```bash
python scripts/worksite-remove-white-bg.py
```

Appliqué sur `spots/`, `icons/`, `ui/`, `decorations/` (pas les backgrounds).

## Fichiers code modifiés (intégration)

- `src/data/myrionWorksiteVisuals.ts` — `available: true` + `WORKSITE_DECORATION_VISUALS`
- `src/components/minigames/WorksiteMyrionLifeLayer.tsx` — images repos/repas
- `src/components/minigames/Worksite.css` — masquage emoji si image chargée

## Tests

- [x] `npm run build` OK
- [ ] Smoke visuel manuel : Prairie / Forêt / Mine + spots + zones vie + icônes drawer
- [ ] Mobile : lisibilité spots et fonds

## Recommandations sélection finale

1. Comparer les 3 fonds en jeu — choisir si gradient legacy reste visible en bordure
2. Valider taille spots sur mobile (ajuster CSS `object-fit` si trop grands)
3. Ne pas activer biomes futurs tant que gameplay absent
4. Regénérer UI overlays avec style plus minimal si trop chargés
5. Lot suivant : variantes `-v2` plus matte + assets manquants pack avance
