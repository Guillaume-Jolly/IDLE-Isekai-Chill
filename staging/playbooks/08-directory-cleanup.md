# 08 — Nettoyage répertoires & archive

Archiver sans supprimer — miroir arborescence `assets/` sous `old_assets/`.

Référence session 2026-06-25 : miroirs `public/assets/` retirés, runtime via `vite.repo-assets.ts`.

---

## Règles

1. **Jamais `Remove-Item` / `git rm` asset** sans go user explicite
2. **Move only** → `old_assets/{même structure que assets/}`
3. Garder **README redirect** dans `public/` si URL legacy encore documentée
4. TNR après tout lot : `npm run tnr:baseline`
5. Entrée [`docs/traceability/changelog`](../traceability/changelog/) avec intérêt

---

## Quand utiliser

- Doublons post-migration Assets 2.0
- Fichiers mal placés (`public/references/`, guides orphelins)
- Scripts one-shot obsolètes → `@deprecated` en tête (pas delete)
- Docs stale → `old_assets/docs-archive/` ou `docs/traceability/assets/archive/`

---

## Arborescence cible archive

```
old_assets/
  Compagnons/{id}/affinite|cutouts|chibis|NSFW|Autres/
  Background/{biomeId}/
  Myrions/{biomeId}/cutout|chibi|silhouette/
  Gacha/
  public-references/          # txt/png refs IA mal placés
  docs-archive/               # PROJECT_STATE, BUILD_ERRORS stale
  scripts-archive/            # optionnel — scripts morts
```

---

## Pipeline

### 1. Inventaire avant

```bash
node scripts/inventory-assets-manifest.mjs
# Comparer totals.byClass vs attente
```

### 2. Identifier les doublons

- `docs/traceability/assets/asset-manifest.json` → `duplicateSamples`
- Grep runtime : le plugin sert depuis `assets/` ?

```bash
rg "public/assets" src --glob "*.{ts,tsx}"   # doit rester commentaires/dev seulement
```

### 3. Déplacer (git mv si tracké)

Script réutilisable :

```bash
node scripts/archive-public-mirrors-to-old-assets.mjs   # si applicable
# ou moves manuels git mv
```

Mapping exemple :

| From | To |
|------|-----|
| `public/assets/companions/{id}/affinity-*.png` | `old_assets/Compagnons/{id}/affinite/` |
| `public/assets/minigames/capture/biomes/*.png` | `old_assets/Background/{biomeId}/` |
| `public/gacha/**` (non README) | `old_assets/Gacha/` |

### 4. Laisser en place

- `public/**/README.md` redirects
- `public/index.html`, favicon, build-info shell
- `staging/`, `Input chatgpt/`, contenu `assets/` source-of-truth

### 5. Marquer scripts morts

Ajouter en tête du fichier :

```js
/** @deprecated Raison + date. Voir old_assets/ ou playbook 08. */
```

---

## Zones interdites

| Zone | Action |
|------|--------|
| `Input chatgpt/` | Ne pas toucher contenu — gitignore |
| `staging/` | Ne pas vider — OK déplacer .md vers planning/archive |
| `assets/` source-of-truth | Ne archiver que si doublon confirmé |

---

## Fichiers à mettre à jour après cleanup

| Fichier | Action |
|---------|--------|
| `docs/traceability/assets/asset-manifest.json` | Regénérer |
| `docs/traceability/audits/orphan-dead-files-audit.md` | Cocher lot done |
| `docs/traceability/changelog/entries/` | Entrée version UI |
| `.ai/current-state.md` | Si impact baseline |

---

## Validation

```bash
npm run tnr:baseline
npm run build
```

Smoke : playbook [`10-visual-qa-tnr.md`](./10-visual-qa-tnr.md) section Assets.

---

## Rollback

Copier depuis `old_assets/` vers emplacement d'origine — ou `git checkout` si commit intermédiaire.
