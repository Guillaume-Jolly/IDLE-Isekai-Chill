# 09 — Biome visuel only (sans event complet)

Mise à jour **fonds chasse/dressage** et/ou **Myrions** d'un biome existant ou nouveau — **sans** event gacha complet.

Pour event + gacha + guests → [`02-gacha-event.md`](./02-gacha-event.md).  
Pour biome + espèces complètes → [`11-new-myrion-biome.md`](./11-new-myrion-biome.md).

---

## Formulaire entrées user (à remplir avant de commencer)

Copier et compléter — **ne pas lancer sans ces champs** :

```markdown
### Intake biome visuel — {date}

- **biomeId slug :** (ex. `prairie-solaire`) — nouveau ou remplacement ?
- **Nom affiché FR :**
- **Emoji carte :**
- **Scope :**
  - [ ] Fond chasse wide (`capture-wide.png`)
  - [ ] Fond chasse portrait (`capture-portrait.png`)
  - [ ] Fond dressage wide (`dressage-wide.png`)
  - [ ] Fond dressage portrait (`dressage-portrait.png`)
  - [ ] Myrions cutout/chibi/silhouette (si oui → playbook 11)
- **Sources images :** (chemins Input chatgpt/ ou zip — ne pas déplacer Input chatgpt)
- **Ratio / résolution attendue :** (ex. 16:9 wide, 9:16 portrait)
- **Références style :** (biome existant à imiter ?)
- **Fallback gradient CSS :** (si image manquante temporaire)
- **Validation user :** qui valide le rendu final ?
- **Notes spéciales :** (event temporaire, recolor only, etc.)
```

---

## Pipeline assets

### 1. Staging / import

Chemins cibles :

```
assets/Background/{biomeId}/capture-wide.png
assets/Background/{biomeId}/capture-portrait.png
assets/Background/{biomeId}/dressage-wide.png
assets/Background/{biomeId}/dressage-portrait.png
```

Scripts possibles :

```bash
node scripts/import-biome-backgrounds.mjs
node scripts/import-enclosure-portraits.mjs
npm run generate:biome-portraits        # génération IA
npm run generate:enclosure-portraits
npm run import:enclosure-portraits
```

Archiver anciens PNG → `old_assets/Background/{biomeId}/`.

### 2. Runtime

Servi par `vite.repo-assets.ts` — URLs inchangées :

- `/assets/minigames/capture/biomes/{biomeId}.png`
- `/assets/minigames/dressage/enclosures/{biomeId}.png`

---

## Fichiers code (checklist)

| Fichier | Si nouveau biome | Si remplacement visuel only |
|---------|-------------------|----------------------------|
| `assets/Background/{biomeId}/` | ✅ créer | ✅ remplacer PNG |
| `src/data/wildFamiliars.ts` `BIOMES` | ✅ entrée biome | ☐ |
| `src/data/biomeProgression.ts` | ✅ unlock rules | ☐ |
| `src/data/myrionRefuge.ts` | ✅ si ressource biome | ☐ |
| `src/data/huntDropRates.ts` | ✅ tables loot | ☐ |
| `src/data/minigameAssets.ts` | auto paths | ☐ |
| `scripts/minigame-asset-paths.mjs` | si paths custom | rare |
| `scripts/import-myrions-assets.mjs` `BIOME_META` | ✅ | ☐ |

---

## TNR

- [ ] Chasse — entrer biome, fond wide + portrait OK
- [ ] Dressage — enclos même biome
- [ ] Carte biome — vignette / gradient fallback
- [ ] Network 404 — aucun PNG biome
- [ ] Mobile 9:16 portrait backgrounds

Playbook [`10-visual-qa-tnr.md`](./10-visual-qa-tnr.md) § Biomes.

---

## MANIFEST (recommandé)

`staging/biomes/{biomeId}/MANIFEST.json` :

```json
{
  "biomeId": "prairie-solaire",
  "updatedAt": "2026-06-25",
  "files": ["capture-wide.png", "capture-portrait.png", "dressage-wide.png", "dressage-portrait.png"],
  "sources": "Input chatgpt/...",
  "validatedBy": "user"
}
```
