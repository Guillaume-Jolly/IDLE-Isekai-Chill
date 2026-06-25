# assets/ — source-of-truth visuels (runtime)

Servi via `vite.repo-assets.ts`. URLs `/assets/...`, `/gacha/...` et `/live2d/...` inchangées.

## Arborescence (top-level)

| Dossier | Rôle |
|---------|------|
| `Compagnons/` | Portraits, cutouts, chibis, NSFW, guides |
| `Background/` | Biomes capture + dressage |
| `Myrions/` | cutout / chibi / silhouette par biome |
| `Gacha/` | Icônes, cinéma, events (servi `/gacha/`) |
| `Live2D/` | Demo Cubism Haru + `live2dcubismcore.min.js` (servi `/live2d/`) |

Données pipeline (corpus, jobs JSON, layouts) → `scripts/references/`  
Imports IA / sources PNG archivés → `old_assets/Compagnons/imports/`, `old_assets/Compagnons/prompts/`, `old_assets/Background/prompts/`, `old_assets/Myrions/imports/`

Index redirects : `docs/traceability/REFERENCES.md`

## Anciens chemins (ne pas recréer)

| Ancien | Nouveau |
|--------|---------|
| `assets/Prompts/` | `scripts/references/` (texte) + `old_assets/Compagnons/prompts/`, `old_assets/Background/prompts/` (PNG) |
| `assets/UI/`, `assets/References/` | supprimés (placeholders vides) |
| `assets/event-disagrea/` | `Compagnons/.../Autres/disagrea-integrated/`, `Background/disagrea-event/`, `old_assets/Compagnons/prompts/disagrea/` |
| `assets/minigames/` | `old_assets/Background/prompts/minigames/` |
| `assets/myrions-import/` | `old_assets/Myrions/imports/myrions-import/` |
| `assets/link-corpus-import/` | `scripts/references/link-corpus/` |
| `assets/integrated-portraits/` | `scripts/references/integrated-portraits/` |
| `assets/village-layout/` | `scripts/references/village-layout/` |

Scripts : `scripts/minigame-asset-paths.mjs` → `pipelineReferencesRoot`, `sourceMinigamePaths`
