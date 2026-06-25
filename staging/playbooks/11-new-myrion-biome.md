# 11 — Nouveau biome Myrion (espèces + catalogue)

Biome complet : **backgrounds**, **espèces Myrions** (cutout, chibi, silhouette), **regén catalogue TS**, progression.

Visuel fonds seuls → [`09-biome-visual-only.md`](./09-biome-visual-only.md).  
Event + gacha → [`02-gacha-event.md`](./02-gacha-event.md).

---

## Formulaire entrées user

```markdown
### Intake biome Myrion — {date}

- **biomeId :** (slug kebab, ex. `foret-ancienne`)
- **Nom FR + emoji :**
- **Pack source :** chemin dossier import (structure `myrions_biomes_v2/XX_Nom_biome/`)
- **Nombre espèces attendu :** (défaut 12 slots rareté)
- **Backgrounds inclus dans pack ?** oui/non → sinon playbook 09
- **Biome event temporaire ?** (ex. disagrea-event)
- **Unlock progression :** capturés requis / raretés — ou laisser agent proposer
- **Validation user avant promote :**
```

---

## Pipeline

### 1. Préparer import

Déposer sources dans `assets/myrions-import/` (gitignore) ou chemin passé en arg.

Structure attendue : voir `scripts/import-myrions-assets.mjs` → `BIOME_META`.

### 2. Import + catalogue regen

```bash
npm run import:myrions -- assets/myrions-import/myrions_biomes_v2
# ou chemin custom :
node scripts/import-myrions-assets.mjs [dossier-import]
```

**Génère / met à jour :**

- `assets/Myrions/{biomeId}/cutout|chibi|silhouette/*.png`
- `assets/Background/{biomeId}/` (si backgrounds dans pack)
- **`src/data/myrionsCatalog.generated.ts`** ← catalogue regen automatique
- Noms : `scripts/myrions-name-manifest.mjs`

Chibis additionnels batch :

```bash
npm run import:chibis
npm run import:chibis-9
```

### 3. Archiver remplacés

Anciens PNG espèce → `old_assets/Myrions/{biomeId}/cutout/` etc.

---

## Fichiers code — checklist complète

| Fichier | Action |
|---------|--------|
| `assets/Myrions/{biomeId}/**` | PNG cutout/chibi/silhouette |
| `assets/Background/{biomeId}/**` | Si fonds inclus |
| `src/data/myrionsCatalog.generated.ts` | **Auto regen import** — vérifier espèces |
| `src/data/wildFamiliars.ts` | `BIOMES`, `PALMON_SPECIES`, encounters |
| `src/data/biomeProgression.ts` | `BIOME_UNLOCK_REQUIREMENTS` |
| `src/data/huntDropRates.ts` | Tables drop chasse |
| `src/data/myrionRefuge.ts` | `BIOME_RESOURCES` si nouvelle ressource |
| `src/data/minigameAssets.ts` | Paths (souvent auto) |
| `src/data/myrionMvp2.ts` | Favors / release si comportement spécial |
| `src/data/captureHunt.ts` | Bonus compagnon-biome si applicable |
| `scripts/myrions-name-manifest.mjs` | Noms FR officiels par stem |
| `scripts/import-myrions-assets.mjs` | `BIOME_META` si nouveau biome |
| `scripts/minigame-asset-paths.mjs` | Si paths custom |

---

## Validation

```bash
npm run tnr:baseline
```

Smoke playbook [`10-visual-qa-tnr.md`](./10-visual-qa-tnr.md) : C5, C6, B1–B5, A4.

- [ ] 12 espèces visibles chasse (ou count attendu)
- [ ] Silhouettes avant capture
- [ ] Chibis dressage
- [ ] Catalogue : `MYRIONS_SPECIES` contient nouvelles entrées
- [ ] Carte biome débloquée selon règles

---

## MANIFEST recommandé

`staging/myrions/{biomeId}/MANIFEST.json` :

```json
{
  "biomeId": "foret-ancienne",
  "importScript": "import-myrions-assets.mjs",
  "speciesCount": 12,
  "stems": ["moussprout", "..."],
  "catalogGenerated": "src/data/myrionsCatalog.generated.ts",
  "validatedAt": null
}
```

---

## Anti-patterns

- ❌ Ajouter PNG sans regen catalogue (`myrionsCatalog.generated.ts`)
- ❌ Oublier `wildFamiliars.ts` — espèces invisibles en chasse
- ❌ Slug fichier ≠ slug public (vérifier `myrions-name-manifest.mjs`)
- ❌ Vectorize SVG — **deprecated**, PNG cutout/chibi uniquement
