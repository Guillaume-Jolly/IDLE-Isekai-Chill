# Repo disk baseline

Snapshot **2026-06-25** (post-finalisation `old_assets/`) — mesures locales (`Get-ChildItem -Recurse` / script Node).  
À rejouer périodiquement pour détecter une dérive (surtout `deploy/`, `.git/`, PNG).

**Total disque : ~10,7 Go**

## Seuils d’alerte (re-mesurer si dépassés)

| Signal | Baseline | Alerte |
|--------|----------|--------|
| Total repo | ~10,7 Go | > 12 Go |
| `deploy/` | ~5,3 Go | > 6 Go |
| `assets/` + `old_assets/` | ~1,55 Go | > 2 Go |
| `old_assets/` seul | ~778 Mo | > 900 Mo |
| Fichiers `old_assets/` | 712 | > 800 |

Historique des mesures : section [Historique](#historique) ci-dessous.

## Top-level (utilité + taille)

| Chemin | ~Taille | Utilité | Git | Nettoyage assets ? |
|--------|--------:|---------|-----|-------------------|
| `deploy/` | 5,3 Go | Serveur **stable** local (HTTPS, auth, saves) | ignoré (`stable/dist`, `archive/`) | Non — infra release |
| `.git/` | 1,8 Go | Historique Git (commits passés avec gros PNG) | — | Non — `git gc` à part |
| `old_assets/` | 778 Mo | Cold storage visuels legacy (non runtime) | oui | **Finalisé** — export D: reste |
| `assets/` | 768 Mo | **Prod visuelle** runtime | oui | Fait (source-of-truth) |
| `dist/` | 767 Mo | Build Vite (`npm run build`) | ignoré | Régénérable |
| `staging/` | 562 Mo | Brouillons pipeline (companion-visual-pack…) | partiel | Non — workspace IA |
| `node_modules/` | 261 Mo | Dépendances npm | ignoré | `npm install` |
| `.tmp/` | 204 Mo | Imports temporaires pipeline | ignoré | Supprimable |
| `Input chatgpt/` | 156 Mo | Sources IA brutes (packs event) | ignoré | Local / optionnel |
| `scripts/` | 100 Mo | Scripts migration, import, build | oui | Outillage |
| `.tools/` | 93 Mo | Node portable outils | ignoré | Local |
| `src/` | 46 Mo | **Code React + données jeu** | oui | Non — app (`linkCorpusV2.json` ~39 Mo) |
| `public/` | 2 Mo | Shell PWA + village runtime | oui | Migré vers `assets/` |
| `release/` | ~0 | Stub release (`pack-files/` vide) | — | Rien |
| `docs/`, `.ai/`, `To check manually/` | < 2 Mo | Doc, backlog, conflits manuels | oui | Doc |

## Détail postes lourds

### `deploy/stable/` (~5,4 Go)

| Sous-dossier | ~Taille | Rôle |
|--------------|--------:|------|
| `archive/dist-2026-06-24T*/` | 4,3 Go | 4 snapshots rollback build stable |
| `dist/` | 1,1 Go | Build stable **actuel** servi en jeu |
| reste | < 5 Mo | `server.mjs`, certs, saves, launcher |

Doc : [`deploy/stable/README.md`](../../../deploy/stable/README.md)

### `assets/` (~768 Mo)

| Sous-dossier | ~Mo |
|--------------|----:|
| `Compagnons/` | 419 |
| `Myrions/` | 185 |
| `Background/` | 114 |
| `gacha/` | 47 |
| `Live2D/` | 4 |

### `old_assets/` (~778 Mo, 712 fichiers) — snapshot post-finalisation

| Sous-dossier | Fichiers | ~Mo | Utilité |
|--------------|--------:|----:|---------|
| `Compagnons/` | 392 | 424 | cutouts-legacy, layered-legacy, imports/prompts pipeline, `_archive/` |
| `Myrions/` | 160 | 267 | imports biomes, pack event |
| `Background/` | 146 | 66 | village-mirror, prompts minigames |
| `Gacha/` | 12 | 22 | snapshots event |
| `Live2D/` | 1 | 0 | stub README |

Profondeur max dossiers : **8** (imports IA profonds ; actif compagnon ≤ **4** : `{id}/cutouts-legacy/`).  
Plus de dossiers `Autres/` — structure alignée sur les 5 buckets top-level.

Scripts fin de tri : `finalize-old-assets.mjs`, dedup interne 106 PNG (`scan-old-assets-duplicates.mjs --execute`).

### `src/data/` (~45 Mo)

| Fichier | ~Mo |
|---------|----:|
| `linkCorpusV2.json` | 39 |
| `companionScenarios.generated.ts` | 5 |

## Gains possibles (hors tri assets)

| Action | Gain ~ | Risque |
|--------|-------:|--------|
| Purger `deploy/stable/archive/` (garder 0–1 snapshot) | 4,3 Go | Perte rollback stable |
| Supprimer `dist/` | 770 Mo | Aucun (rebuild) |
| Supprimer `.tmp/` | 200 Mo | Imports temp perdus |
| Export `old_assets/` → `D:\Isekai-slow-life\Archiive\Old_assets` | 780 Mo | Cold storage hors repo |
| `git gc` / historique | variable | Opération délicate |

## Re-mesure rapide (PowerShell)

```powershell
Get-ChildItem . -Force | ForEach-Object {
  $s = if ($_.PSIsContainer) {
    (Get-ChildItem $_.FullName -Recurse -File -Force -EA SilentlyContinue | Measure-Object Length -Sum).Sum
  } else { $_.Length }
  [PSCustomObject]@{ Name = $_.Name; GB = [math]::Round($s/1GB, 2) }
} | Sort-Object GB -Descending
```

Mettre à jour ce fichier + date quand la taille totale dépasse ~12 Go ou que `deploy/` > 6 Go.

## Historique

| Date | Total | assets/ | old_assets/ | deploy/ | Notes |
|------|------:|--------:|------------:|--------:|-------|
| 2026-06-25 (init) | ~10,7 Go | 768 Mo | 778 Mo | 5,3 Go | Baseline initiale |
| 2026-06-25 (post-final) | ~10,7 Go | 768 Mo | 778 Mo (712 fichiers) | 5,3 Go | Tri `old_assets/` terminé ; dedup interne 106 ; 193 dirs vides supprimés |
