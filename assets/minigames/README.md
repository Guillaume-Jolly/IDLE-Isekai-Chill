# Assets mini-jeux

Arborescence cohérente pour les images servies en jeu et les sources de travail.

## En jeu (`public/assets/minigames/`)

| Chemin | Mini-jeu | Contenu |
|--------|----------|---------|
| `dressage/enclosures/` | Refuge (`farm-dressage`) | Fonds d'enclos par biome |
| `dressage/myrions/chibi/` | Refuge | Chibis Myrions |
| `capture/biomes/` | Chasse (`farm-capture`) | Fonds de biome |
| `capture/myrions/cutout/` | Chasse | Myrions rencontre (détourés) |
| `capture/myrions/silhouette/` | Chasse | Silhouettes apparition |
| `capture/companions/talia/` | Chasse | Guides Talia (`point.png`, `point-{biome}.png`) |
| `hub/presentations/` | Hub mini-jeux | Vignettes activités |
| `hub/stages/` | Hub mini-jeux | Décors de scène |

URLs servies : `/assets/minigames/...` — voir `src/data/minigameAssets.ts` et `src/data/publicAssetUrl.ts` (BASE_URL + repli legacy).

## Compagnons village

Pipeline en couches — voir [`public/assets/companions/README.md`](../../public/assets/companions/README.md) :

```text
public/assets/companions/<id>/cutout-{1-5}.png
public/assets/companions/<id>/background-{1-5}.png
public/assets/companions/backgrounds/<scene-id>.png   # fonds partagés
public/assets/companions/<id>/affinity-{1-5}.png      # legacy composé
public/assets/companions/<id>/chibi.png
```

Code : `src/data/companionAssets.ts`, `src/data/companionPortraitHints.ts`

## Sources brutes (détourage manuel)

| Chemin | Usage |
|--------|--------|
| `assets/minigames/dressage/myrions/chibi/sources/` | PNG chibis avant détourage |
| `assets/minigames/capture/companions/talia/sources/companion-pack/` | Poses Talia par biome (brut) |
| `assets/minigames/capture/companions/talia/sources/chibis-9-pack/` | Variante damier |
| `assets/minigames/capture/myrions/cutout/sources/` | Cutouts plein corps (import myrions) |
| `assets/myrions-import/` | Zip d'import bulk (gitignored) |
| `assets/talia-import/` | Ancien dossier d'import (gitignored, miroir possible) |

Copie pré-détourage pour retouche manuelle : `old_assets/minigames-sources-avant-detourage/`.

Scripts d'import : `scripts/import-*.mjs` — chemins centralisés dans `scripts/minigame-asset-paths.mjs`.

## Anciens fichiers

`old_assets/` — ancienne arborescence `public/minigames/`, biomes legacy (moon-meadow, SVG), previews, etc.
