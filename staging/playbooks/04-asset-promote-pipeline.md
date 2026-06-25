# 04 — Pipeline promote assets

Staging / sources → runtime jouable, avec archive.

---

## Principes

1. **Générer / itérer** dans `staging/` ou `assets/` sources
2. **Valider** visuellement (user ou galerie dev)
3. **Promote** vers runtime (aujourd'hui `public/`)
4. **Archiver** l'ancien vers `old_assets/` — jamais delete
5. **TNR** build + smoke

---

## Scripts promote par type

| Type | Script npm / node |
|------|-------------------|
| Cutouts émotion v3 | `node scripts/regenerate-emotion-cutouts.mjs promote {id}` |
| Pack visuel complet | `npm run promote:companion-visual-pack` |
| Disagrea affinity intégrée | `npm run promote:disagrea-integrated-affinity` |
| Myrions import | `npm run import:myrions` |
| Chibis Myrions | `npm run import:chibis` |
| Talia pack | `npm run import:talia` |
| Disagrea event assets | `npm run import:disagrea` |
| Gacha cinéma | `node scripts/import-disagrea-gacha-cinema.mjs` |
| Village map | `npm run import:village` |
| Corpus V2 | `npm run import:link-corpus-v2` |

---

## Chroma key (cutouts)

`scripts/chroma-key-png.mjs` — fond `#CFCFCF` → alpha  
Utilisé par `regenerate-emotion-cutouts.mjs promote`

Test unitaire manuel :
```bash
node scripts/chroma-key-png.mjs staging/.../cutout-v3.png .tmp/test-out.png
```

---

## Inventaire avant/après

```bash
node scripts/inventory-assets-manifest.mjs
# → staging/planning/asset-manifest.json
```

Comparer `totals.byClass` et `duplicateSamples` entre promotes.

---

## Archive pattern

```
old_assets/
  companions/{id}/cutouts/emotion-{emotion}.png
  companion-chibis-replaced/{id}/...
  {batch-name}/...          # futur : mirror Autres/
```

Toujours **rename/move**, jamais `Remove-Item` / `git rm` sans instruction user explicite.

---

## Galerie dev (vérification visuelle)

Route dev : Companion Visual Dev Gallery  
Chemins : `src/data/devVisualRepoPaths.ts`  
Staging servi via vite middleware `/dev-assets/staging-companion-visual-pack/`

---

## Erreurs fréquentes promote

| Erreur | Fix |
|--------|-----|
| promote skip — missing staging | `list` pour voir manquants |
| halo magenta sur cutout | ajuster chroma-key ou regénérer fond |
| double public + legacy | vérifier `public/companions/` vs `public/assets/companions/` |
| mauvais companion identity | re-gen avec bonne `reference_image_paths` |

---

## Post-promote validation

```bash
npm run build
npm run lint
```

Smoke : voir `06-tnr-checklist.md` section assets.

---

## Cible Assets 2.0

Après migration single-root, promote ciblera `assets/Compagnons/...` et Vite servira `/assets/` directement — scripts à adapter en phase 3.

Voir `05-assets-2.0-migration.md`.
