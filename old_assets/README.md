# old_assets/ — cold storage (non-runtime)

Même taxonomie top-level que [`assets/`](../assets/README.md) : **5 dossiers**, profondeur cible **≤ 4** (miroir `assets/Compagnons/{id}/{category}/file`).

| Dossier | Rôle |
|---------|------|
| `Compagnons/` | Legacy par compagnon + imports/prompts/packs |
| `Background/` | Village mirror, prompts minigames, public-references |
| `Myrions/` | Imports biomes, pack invocation |
| `Gacha/` | Snapshots event gacha, promo |
| `Live2D/` | Legacy Live2D (vide — runtime `assets/Live2D/`) |

## Schéma Compagnons (aligné assets)

```
Compagnons/{id}/affinite/          — (prod dans assets/ seulement)
Compagnons/{id}/cutouts-legacy/    — émotions legacy (ex. Maeve/Etna mix)
Compagnons/{id}/layered-legacy/    — snapshots event Disagrea
Compagnons/{id}/chibis-replaced/   — chibis regen rejetés
Compagnons/{id}/NSFW-legacy/       — backups NSFW
Compagnons/{id}/Autres/guide/      — ex. point Talia
Compagnons/prompts/disagrea/       — sources IA pipeline
Compagnons/imports/                — talia-import, link-corpus
Compagnons/pack-event-invocation/  — snapshot event invocation
Compagnons/_archive/{batch}/       — dedup byte-identiques restants
```

## Autres buckets

| Chemin | Contenu |
|--------|---------|
| `Background/village-mirror/` | Orphelins `public/village/` |
| `Background/prompts/minigames/` | `sourceMinigamePaths` |
| `Background/public-references/` | `.txt` legacy |
| `Myrions/imports/myrions-import/` | Imports biomes |
| `Myrions/pack-event-invocation/` | Myrions pack event |
| `Gacha/event-disagrea-source-2026-06-25/` | Index gacha snapshot |
| `Gacha/pack-event-invocation/promo/` | Bannières promo |

## Principes

- **Ne jamais supprimer** — export `D:\Isekai-slow-life\Archiive\Old_assets` en fin de tri
- Prod = **`assets/`** uniquement (jamais servi en jeu depuis ici)
- Baseline taille repo : [`docs/traceability/assets/repo-disk-baseline.md`](../docs/traceability/assets/repo-disk-baseline.md)
- Rapports : [`docs/traceability/assets/old-assets-reports/`](../docs/traceability/assets/old-assets-reports/)
- Log : [`docs/traceability/assets/old-assets-cleanup-log.md`](../docs/traceability/assets/old-assets-cleanup-log.md)

## Scripts

| Script | Usage |
|--------|--------|
| `scripts/sort-old-assets-five-folders.mjs` | Top-level → 5 dossiers |
| `scripts/flatten-old-assets-architecture.mjs` | Aplatir `Autres/` + `_archive/` |
| `scripts/promote-cutouts-legacy-flat.mjs` | Cutouts émotion → `{id}/cutouts-legacy/` |
| `scripts/finalize-old-assets.mjs` | Promote archives Autres + prune dirs vides |
| `scripts/scan-old-assets-duplicates.mjs` | Dedup vs `assets/` + interne |
| `scripts/minigame-asset-paths.mjs` | Chemins pipeline (`sourceMinigamePaths`, etc.) |

## Statut 2026-06-25

- [x] 5 dossiers top-level
- [x] Dedup byte-identiques → `_archive/`
- [x] 152 cutouts émotion → `{id}/cutouts-legacy/`
- [x] Snapshots event → `{id}/layered-legacy/`
- [x] Dedup interne (106 PNG chibi-sources dupliqués)
- [x] Suppression coquilles `Autres/` + 193 dossiers vides
- [ ] Export disque D: (go user)
