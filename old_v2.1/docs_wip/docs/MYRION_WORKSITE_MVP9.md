# Chantier Myrion — MVP 9 : assets visuels globaux

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Produit :** Havre des Brumes — Ferme lunaire  
> **Périmètre :** backgrounds wide, faille astrale prestige, revue crystal, halos spots

## Objectif

Améliorer les assets visuels principaux de la Ferme lunaire pour un rendu plus présentable et cohérent, sans modifier gameplay, save, économie ni audio.

## Assets générés / remplacés

### Backgrounds wide (remplacés, `available: true`)

| Fichier | Taille finale | Ancien backup | Statut |
|---------|---------------|---------------|--------|
| `public/assets/minigames/myrion-worksite/backgrounds/prairie.png` | 2560×960 | `backgrounds/variants/prairie-old.png` | **OK** — intégré |
| `public/assets/minigames/myrion-worksite/backgrounds/forest.png` | 2560×960 | `backgrounds/variants/forest-old.png` | **OK** — intégré |
| `public/assets/minigames/myrion-worksite/backgrounds/mine.png` | 2560×960 | `backgrounds/variants/mine-old.png` | **OK** — intégré |

Post-traitement : crop cover depuis PNG IA 1536×1024 via `scripts/mvp9-install-worksite-assets.py`.

### Faille astrale prestige (nouveau, `available: true`)

| Fichier | Taille | Statut |
|---------|--------|--------|
| `public/assets/minigames/myrion-worksite/spots/faille-astrale.png` | 1024×1024 RGBA | **OK** — intégré (`WORKSITE_PRESTIGE_SPOT_VISUAL`) |

Détourage : suppression fond blanc/noir + damier IA (`is_generated_bg` dans script MVP 9).

### Icône crystal (remplacée, `available: false`)

| Fichier | Taille | Statut |
|---------|--------|--------|
| `public/assets/minigames/myrion-worksite/icons/crystal.png` | 512×512 RGBA | **provisoire** — fichier amélioré mais non activé (ressource non exposée en UI chantier) |

## Assets désactivés

Aucun spot gameplay désactivé. Biomes/spots futurs inchangés (`available: false`).

## Assets à refaire

| Asset | Raison |
|-------|--------|
| `icons/crystal.png` | Activer seulement si une UI ressource cristal/mana l’utilise explicitement |
| Backgrounds natifs 2560×960 | Optionnel — génération IA actuelle en 1536×1024 + crop cover |

## Prompts utilisés

### Prairie

```
wide panoramic background, peaceful fantasy moon farm worksite prairie, soft green grass, gentle mist, small dirt paths, cozy village-adjacent atmosphere, three readable resource areas, subtle magical moonlight mixed with soft daylight, clean open layout for UI and clickable deposits, soft anime fantasy game background, matte soft rendering, polished 2D game art, mobile game friendly, no characters, no text, no logo, no watermark, no photorealism, no harsh contrast, no clutter
```

### Forêt

```
wide panoramic background, gentle fantasy forest moon farm worksite, soft trees, mossy ground, small clearings, readable open areas for three resource deposits, subtle sun rays through leaves, cozy magical atmosphere, soft anime fantasy game background, matte soft rendering, polished 2D game art, mobile game friendly, no characters, no text, no logo, no watermark, no photorealism, no harsh contrast, no clutter
```

### Mine

```
wide panoramic background, calm fantasy mine moon farm worksite, shallow cave entrance, soft stone walls, wooden supports, lantern glow, readable open areas for three mineral deposits, safe cozy mining atmosphere, soft anime fantasy game background, matte soft rendering, polished 2D game art, mobile game friendly, no characters, no text, no logo, no watermark, no photorealism, no harsh contrast, no clutter
```

### Faille astrale

```
small astral fissure prestige resource spot, floating stones around a soft violet magical crack, subtle star particles, gentle lunar glow, endgame fantasy prop, clean silhouette, polished 2D anime game asset, transparent background, no characters, no text, no logo, no watermark, no photorealism
```

### Crystal

```
single clean fantasy resource icon, centered, blue violet crystal shard, polished 2D anime mobile game icon, transparent background, readable silhouette, no text, no logo, no watermark
```

## Halos / détourage — spots actifs

Inspection bords PNG (9 spots gameplay) : **0 % pixels blancs sur les bords** — pas de halo blanc bloquant.

| Spot | Fichier | Note |
|------|---------|------|
| bosquet | `spots/bosquet.png` | OK |
| pierrier | `spots/pierrier.png` | OK |
| champs | `spots/champs.png` | OK |
| sous-bois | `spots/sous-bois.png` | OK |
| clairiere-herbes | `spots/clairiere-herbes.png` | OK |
| source-claire | `spots/source-claire.png` | OK |
| pierrier-profond | `spots/pierrier-profond.png` | OK |
| veine-brute | `spots/veine-brute.png` | provisoire — halo interne léger possible |
| charbonniere | `spots/charbonniere.png` | provisoire — halo interne léger possible |

## Intégration code

| Fichier | Changement |
|---------|------------|
| `src/data/myrionWorksitePrestige.ts` | `WORKSITE_PRESTIGE_SPOT_VISUAL.available: true` |
| `src/data/myrionWorksiteVisuals.ts` | `faille-astrale` spot `available: true` |
| `src/components/minigames/Worksite.css` | `object-position` backgrounds ajusté (70 % / 66 % / 62 %) pour ratio 2560×960 |
| `scripts/mvp9-install-worksite-assets.py` | Pipeline install wide + détourage IA |

## Checklist visuelle

- [x] Prairie : fond wide 2560×960, 3 zones lisibles
- [x] Forêt : fond wide, clairières pour filons
- [x] Mine : fond wide, zones minérales lisibles
- [x] Faille astrale : silhouette violette distincte, fond transparent
- [x] Spots actifs : pas de régression halo bord
- [ ] Crystal : fichier remplacé, activation différée
- [x] `npm run build` OK
- [x] Smoke visuel court (3 biomes + faille, console images)

## Tests

- [x] `npm run build` OK (2026-06-26)
- [x] Assets HTTP 200 : `prairie.png`, `forest.png`, `mine.png` (~2.9–3.4 Mo)
- [x] `faille-astrale.png` 1024×1024 charge OK
- [x] Prairie en jeu : fond + 3 spots chargés (`naturalWidth` > 0)
- [~] Forêt / Mine : biomes verrouillés sur save test — fonds vérifiés via fetch uniquement
- [~] Faille astrale en scène : visible après déblocage Mine (prestige drawer OK)
- [ ] Mobile étroit multi-tailles

## Prochaine étape recommandée

1. MVP 10 polish : regénération native 2560×960 si outil IA le permet
2. Activer `icons/crystal.png` quand une ressource cristal/mana apparaît en HUD chantier
3. Variantes `-v2` spots `veine-brute` / `charbonniere` si halo visible en jeu
4. Ne pas relancer TNR transversal tant que pas demandé
