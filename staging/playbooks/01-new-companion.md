# 01 — Nouveau compagnon

Checklist complète : village ou guest event. **Chibis village inclus** (regen base du pipeline, pas étape séparée).

Voir aussi : [`03-emotion-cutouts-and-nsfw.md`](./03-emotion-cutouts-and-nsfw.md), [`11-new-myrion-biome.md`](./11-new-myrion-biome.md) si lien Myrion.

---

## Prérequis

- [ ] ID slug unique — grep `companionFragments`, `App.tsx` COMPANIONS, corpus V2
- [ ] Rôle / archétype (1 paragraphe)
- [ ] Palette + tenue L1
- [ ] Ancre affinity-1 validée user

---

## DA

| Asset | Format | Destination `assets/` |
|-------|--------|-------------------------|
| affinity 1–5 | portrait intégré | `Compagnons/{id}/affinite/` |
| 8× emotion cutout | full body `#CFCFCF` | `Compagnons/{id}/cutouts/` |
| chibi | dressage/refuge | `Compagnons/{id}/chibis/` |
| NSFW aff4 | gate user | `Compagnons/{id}/NSFW/` |
| guides chasse | si applicable | `Compagnons/{id}/Autres/guide/` |

Style cutouts : ancre **affinity-1 du compagnon** — `companion-visual-pack-data.mjs`, **pas** Etna global.

---

## Pipeline assets

1. Staging : `staging/companion-visual-pack/village/{id}/`
2. Prompts : `node scripts/regenerate-emotion-cutouts.mjs prompt {id} {emotion}`
3. Chibis : inclus batch visual pack ou `npm run regenerate:village-chibis`
4. Promote : `node scripts/regenerate-emotion-cutouts.mjs promote {id}` ou `npm run promote:companion-visual-pack`
5. Archive : `old_assets/Compagnons/{id}/...`

---

## Fichiers code — checklist complète

| Fichier | Action |
|---------|--------|
| `assets/Compagnons/{id}/**` | Tous PNG runtime |
| `src/App.tsx` | Tableau `COMPANIONS` (id, name, building, …) |
| `src/data/companionFragments.ts` | `COMPANION_FRAGMENT_IDS`, noms |
| `src/data/companionAssets.ts` | Flags chibi, paths spéciaux |
| `src/data/companionStats.ts` | Stats base si nouveau |
| `src/data/companionDialogues.ts` | Si dialogues legacy |
| `src/data/companionPortraitHints.ts` | Hints génération / layered |
| `src/data/conversations/` | Entrées corpus V2 ou scenarios |
| `src/data/linkCorpusV2.json` | Import corpus si batch |
| `src/data/gacha.ts` | Pool fragments si gacha village |
| `src/data/wildFamiliars.ts` | Si bonus chasse biome |
| `src/data/captureHunt.ts` | `companionCaptureBonus` |
| `src/data/buildingActivities.ts` | Si activité Liens dédiée |
| `src/data/eventDisagreaPack.ts` | Si guest event |
| `src/data/integratedPortraitPrompts.ts` | Si prompts intégrés |
| `scripts/staging/companion-visual-pack-data.mjs` | DNA, identityLock |
| `vite.repo-assets.ts` | Rare — paths auto si convention OK |

**Backlog :** discovery récursive compagnons depuis dossier — éviter listes manuelles.

---

## Guest event

1. `assets/event-disagrea/integrated/` ou `Compagnons/{id}/Autres/disagrea-integrated/`
2. `npm run promote:disagrea-integrated-affinity`
3. [`02-gacha-event.md`](./02-gacha-event.md) si bannière

---

## Validation

```bash
npm run tnr:baseline
```

Smoke : [`10-visual-qa-tnr.md`](./10-visual-qa-tnr.md) § Compagnon P1–P6.

---

## Anti-patterns

- ❌ `public/companions/` legacy
- ❌ Cutouts sans ancre affinity-1 du compagnon
- ❌ Oublier `emotion-neutral.png`
- ❌ Chibi oublié (fait partie du pipeline standard)
