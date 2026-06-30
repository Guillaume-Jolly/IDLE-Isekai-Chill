# Chantier Myrion — Journal génération assets IA (lot 4B + revue MVP 5 + MVP 9)

> **Date :** 2026-06-26 (MVP 9 wide backgrounds + faille astrale)  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Outil :** génération IA Cursor + `scripts/mvp9-install-worksite-assets.py` + détourage legacy `worksite-remove-white-bg.py`

## MVP 9 — lot wide backgrounds + prestige

| Fichier | Taille | Classe MVP 9 |
|---------|--------|--------------|
| `backgrounds/prairie.png` | 2560×960 | **OK** — remplace 1536×1024 (`variants/prairie-old.png`) |
| `backgrounds/forest.png` | 2560×960 | **OK** |
| `backgrounds/mine.png` | 2560×960 | **OK** |
| `spots/faille-astrale.png` | 1024×1024 RGBA | **OK** — `available: true` prestige |
| `icons/crystal.png` | 512×512 RGBA | **provisoire** — remplacé, `available: false` |

Détail complet : `docs/MYRION_WORKSITE_MVP9.md`

## Revue MVP 5 — classification assets

Légende : **OK** · **provisoire** · **à refaire** · **désactivé**

### Backgrounds

| Fichier | Biome | Taille | Classe MVP 5 |
|---------|-------|--------|--------------|
| `prairie.png` | Prairie | 2560×960 (MVP 9) | **OK** |
| `forest.png` | Forêt | 2560×960 (MVP 9) | **OK** |
| `mine.png` | Mine | 2560×960 (MVP 9) | **OK** |
| `swamp.png` | Marais (futur) | 1536×1024 | **désactivé** |
| `crystal.png` | Cristal (futur) | 1536×1024 | **désactivé** |
| `astral.png` | Astral (futur) | 1536×1024 | **désactivé** |

### Spots gameplay (9)

| Fichier | Spot | Classe MVP 5 |
|---------|------|--------------|
| `bosquet.png` | Verger | **OK** |
| `pierrier.png` | Potager | **OK** (chemin corrigé MVP 5) |
| `champs.png` | Champs | **OK** |
| `sous-bois.png` | Sous-bois | **OK** |
| `clairiere-herbes.png` | Clairière | **OK** |
| `source-claire.png` | Souches | **OK** |
| `pierrier-profond.png` | Pierrier | **OK** |
| `veine-brute.png` | Veine de fer | **provisoire** (halo léger possible) |
| `charbonniere.png` | Fil charbon | **provisoire** |

### Icônes

| Fichier | Classe MVP 5 |
|---------|--------------|
| `wood.png`, `stone.png`, `food.png` | **OK** |
| `herbs.png`, `water.png`, `ore.png`, `coal.png` | **provisoire** (visuel seul) |
| `crystal.png` | **provisoire** — remplacé MVP 9, `available: false` |
| `spores.png` | **désactivé** |

### Décorations

| Fichier | Classe MVP 5 |
|---------|--------------|
| `rest-zone.png`, `food-zone.png` | **OK** (opacité UI réduite MVP 5) |
| `small-tent.png` | **désactivé** |

### UI overlays

| Fichier | Classe MVP 5 |
|---------|--------------|
| `spot-active/locked/supervised.png`, `biome-locked.png` | **désactivé** en `<img>` — CSS prioritaire |

### Spots futurs (fichiers présents, non jouables)

`cristalliere`, `marais-fertile`, `champignonniere`, `ruines-anciennes` → **désactivé**  
`faille-astrale` → **OK** prestige MVP 9 (`available: true`)

---

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
| `spots/pierrier.png` | Pierrier (prairie Potager) | Intégré MVP 5 — chemin corrigé |
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
| Résolution | Panoramas 2560×960 (crop depuis IA 1536×1024) | Regénérer natif 2560×960 si possible |
| `icons/crystal.png` | Fichier remplacé, non activé en UI | Activer quand ressource exposée |

## Post-traitement

```bash
python scripts/mvp9-install-worksite-assets.py
python scripts/worksite-remove-white-bg.py
```

MVP 9 : wide backgrounds + faille/crystal via script dédié. Legacy : spots/icons/ui/decorations.

## Fichiers code modifiés (intégration)

- `src/data/myrionWorksiteVisuals.ts` — `available: true` + `WORKSITE_DECORATION_VISUALS`
- `src/components/minigames/WorksiteMyrionLifeLayer.tsx` — images repos/repas
- `src/components/minigames/Worksite.css` — masquage emoji si image chargée

## Tests

- [x] `npm run build` OK (MVP 5)
- [x] Smoke visuel MVP 5 : fonds + filons + sons procéduraux
- [x] Regénération wide backgrounds (MVP 9)
- [ ] Mobile exhaustif multi-tailles

## MVP 15 — extension 15 biomes (2026-06-26)

| Lot | Quantité | Statut |
|-----|----------|--------|
| Backgrounds régénérés / nouveaux | 12 | **OK** — 2560×960 |
| Backgrounds legacy conservés | 3 | **OK** — prairie/forest/mine |
| Filons actifs extension | 36 | **OK** — 1024×1024 RGBA |
| Filons legacy biomes 1–3 | 9 | **OK** — inchangés |
| Registry `myrionWorksiteAssetRegistry.ts` | 61 activés | **OK** |

Script : `python scripts/mvp15-install-worksite-assets.py`  
Détail : `docs/MYRION_WORKSITE_MVP15_ASSETS.md`

## MVP 16 — placement visuel (2026-06-26)

- Placement absolu 45 filons via `myrionWorksitePlacement.ts`
- Dev unlock : `?worksiteDevUnlock=1` (DEV only)
- Overlay : `?worksitePlacementDebug=1`
- Détail : `docs/MYRION_WORKSITE_MVP16_PLACEMENT.md`

## Recommandations sélection finale

1. Comparer les 3 fonds en jeu — choisir si gradient legacy reste visible en bordure
2. Valider taille spots sur mobile (ajuster CSS `object-fit` si trop grands)
3. Ne pas activer biomes futurs tant que gameplay absent
4. Regénérer UI overlays avec style plus minimal si trop chargés
5. Lot suivant : variantes `-v2` plus matte + assets manquants pack avance
