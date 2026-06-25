# 01 — Nouveau compagnon

Checklist complète : village (15 existants) ou guest event (Disagrea).

---

## Prérequis

- [ ] ID slug unique (`[a-z]+`, ex. `talia`) — vérifier `src/data/companionFragments.ts`, `wildFamiliars.ts`, corpus V2
- [ ] Rôle / archétype écrit (1 paragraphe)
- [ ] Palette + tenue L1 définies
- [ ] Ancre visuelle affinity-1 validée par user

---

## DA (direction artistique)

| Asset | Ratio / format | Fond | Référence |
|-------|----------------|------|-----------|
| affinity-1..5 | 512×704 portrait | décor intégré ou layered | `public/assets/companions/talia/affinity-1.png` |
| cutout L1..5 | personnage seul | transparent ou chroma | layered portrait runtime |
| chibi | dressage / refuge | transparent | style village chibis |
| 8× emotion cutout | full body | `#CFCFCF` | `staging/companion-visual-pack/CUTOUT_STYLE.md` |
| NSFW aff4 | si applicable | selon batch | sous `NSFW/` ou `-nsfw.png` suffix |

**Style cutouts :** ancre **par compagnon** = son `affinity-1.png`, PAS Etna global (sauf Etna).

---

## Pipeline assets (ordre)

### 1. Staging

```
staging/companion-visual-pack/village/{id}/
  cutouts/companion-{id}-emotion-{emotion}-cutout-v3.png
  chibis/...
  affinite/...   (si batch intégré)
```

Prompts : `node scripts/regenerate-emotion-cutouts.mjs prompt {id} {emotion}`  
Data : `scripts/staging/companion-visual-pack-data.mjs`

### 2. Promotion runtime (aujourd'hui)

```bash
node scripts/regenerate-emotion-cutouts.mjs promote {id}
# ou batch :
npm run promote:companion-visual-pack
```

Cible actuelle : `public/assets/companions/{id}/emotion-*.png`  
Archives v2 : `old_assets/companions/{id}/cutouts/`

### 3. Cible Assets 2.0 (après migration)

`assets/Compagnons/{id}/affinite|cutouts|chibis|NSFW|Autres/{batch}/`

---

## Pipeline code

| Fichier | Action |
|---------|--------|
| `src/data/companionFragments.ts` | Entrée compagnon + fragments |
| `src/data/companionAssets.ts` | `hasCompanionChibi`, paths si special |
| `src/data/conversations/` | Corpus V2 entries ou legacy scenarios |
| `src/App.tsx` | Si guest visible dans UI Liens |
| `src/data/wildFamiliars.ts` | Seulement si lié Myrion/biome |

Validation :
```bash
npm run build && npm run lint && npm run validate:link-corpus
```

---

## Guest event (ex. Disagrea)

1. Assets source : `assets/event-disagrea/integrated/companions/{id}/`
2. Promote : `npm run promote:disagrea-integrated-affinity`
3. Data pack : `src/data/eventDisagreaPack.ts`
4. Backgrounds : `assets/event-disagrea/backgrounds/` → minigames capture/dressage

Voir aussi `02-gacha-event.md` si bannière associée.

---

## Checklist finale

- [ ] 5× affinity PNG runtime
- [ ] 8× emotion cutouts v3 promus
- [ ] chibi si dressage/refuge
- [ ] conversations aff 1–5 (100 each V2) ou plan corpus
- [ ] smoke : portrait layered, 1 conversation, galerie dev si activée
- [ ] entrée `staging/planning/` si batch name documenté

---

## Anti-patterns

- ❌ Ajouter fichiers seulement dans `public/companions/` (legacy)
- ❌ Générer cutouts sans `reference_image_paths` = affinity-1 du compagnon
- ❌ Oublier `emotion-neutral.png` (fallback UI)
- ❌ Mélanger ID Disagrea guest avec village Asha homonyme
