# prompts-archive — imports IA / pipeline (cold storage)

**Non runtime.** Référencé par `scripts/minigame-asset-paths.mjs` (`disagreaPromptArchiveRoot`, `sourceMinigamePaths`).

## Structure actuelle (~261 fichiers)

| Sous-dossier | ~fichiers | Rôle |
|--------------|----------:|------|
| `imports/` | 258 | Imports myrions, talia, chibis, biomes (PNG + txt) |
| `link-corpus-import/` | 1 | Zip link-corpus |
| `village-layout/` | 2 | Layout village legacy |
| `disagrea/` | — | *(vide — contenu dedup → `archive/2026-06-25-dedup-internal/prompts-archive/`)* |
| `minigames/` | — | *(vide — sources dedup vers archive)* |

## Dedup

- Phase 3 : **106** doublons byte-identiques internes → `archive/2026-06-25-dedup-internal/prompts-archive/`
- Post-cutouts 2026-06-25 : scan `scan-old-assets-duplicates.mjs` → **0 mouvement**

Ne pas promouvoir vers `assets/Prompts/` sans pipeline explicite.
