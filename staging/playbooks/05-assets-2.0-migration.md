# 05 — Migration Assets 2.0

Plan d'exécution phases 2–3 (après playbooks phase 1).

---

## Objectif

Un seul arbre **`assets/`** source-of-truth ; `public/` minimal ; `old_assets/` archive ; `staging/` + `Input chatgpt/` intouchables.

---

## Phases

| Phase | Action | TNR |
|-------|--------|-----|
| **2a** | Manifest mapping JSON : `{from, to, class, runtimeRef}` | diff review user |
| **2b** | Moves `assets/` sources → nouvelle arborescence `assets/Compagnons/` etc. | build |
| **2c** | Moves `public/assets/` → `assets/` + symlinks ou vite alias temporaire | smoke full |
| **2d** | Consolidate `public/companions/` legacy → archive ou merge | grep 404 |
| **2e** | Docs `.md` orphelins → `docs/traceability/assets/` ou `docs/` | — |
| **3** | Refactor `vite.config.ts`, `publicAssetUrl`, `companionAssets.ts`, `minigameAssets.ts` | build + smoke |
| **4** | WebP gros fonds opaques (optionnel) | visuel |
| **5** | Commit prep `main` 2.0 | CI + user sign-off |

---

## Mapping initial (extrait)

| From | To (cible) |
|------|------------|
| `public/assets/companions/{id}/affinity-*.png` | `assets/Compagnons/{id}/affinite/` |
| `public/assets/companions/{id}/emotion-*.png` | `assets/Compagnons/{id}/cutouts/` |
| `public/assets/companions/{id}/chibi.png` | `assets/Compagnons/{id}/chibis/` |
| `public/assets/companions/{id}/affinity-4-nsfw.png` | `assets/Compagnons/{id}/NSFW/` |
| `public/assets/minigames/capture/biomes/` | `assets/Background/{biomeId}/` |
| `public/assets/minigames/capture/myrions/cutout/` | `assets/Myrions/{biomeId}/cutout/` |
| `public/assets/minigames/dressage/myrions/chibi/` | `assets/Myrions/{biomeId}/chibi/` |
| `public/gacha/` | `assets/Gacha/` |
| `assets/event-disagrea/` | split Compagnons + Background |

Détail complet : `docs/traceability/assets/asset-taxonomy-proposal.md`

---

## Lots recommandés (ordre)

1. **Gacha** (petit, isolé)
2. **Background biomes** capture/dressage
3. **Myrions** cutout + chibi
4. **Compagnons village** (15 IDs)
5. **Disagrea guests** (4 IDs)
6. **Legacy cleanup** `public/companions/` → old_assets

Entre chaque lot : `06-tnr-checklist.md`.

---

## Outils

```bash
node scripts/inventory-assets-manifest.mjs
# futur :
# node scripts/plan-asset-moves.mjs --dry-run
# node scripts/apply-asset-moves.mjs --lot gacha
```

Préférer `git mv` pour historique.

---

## Backup

Avant chaque lot :
```bash
git push origin HEAD:Backup --force   # si user OK
```

Snapshot local : commit intermédiaire sur branche feature.

---

## Interdit

- Supprimer fichiers
- Toucher `Input chatgpt/`
- Supprimer contenu `staging/` (OK déplacer des .md vers planning)
- Push `main` sans validation

---

## Doublons à résoudre

Voir `asset-manifest.json` → `duplicateSamples` (80 groupes max listés).

Priorité : Disagrea gacha triplet, legacy `public/companions/` mirror.

---

## Statut

- [x] Phase 0 backup + manifest
- [x] Phase 1 playbooks
- [x] Phase 2 moves (all lots)
- [x] Phase 3 vite single-root refactor

Nettoyage miroirs : [`08-directory-cleanup.md`](./08-directory-cleanup.md).
