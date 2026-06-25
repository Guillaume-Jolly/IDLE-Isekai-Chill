# 02 — Nouvel event Gacha

Basé sur implémentation Disagrea existante.

---

## Prérequis

- [ ] Event ID slug (`disagrea-event`, `festival-2026`, …)
- [ ] Dates / durée ou flag permanent
- [ ] Pool : compagnons guests, Myrions, ressources
- [ ] Bannière + cinéma (frames PNG ou vidéo)
- [ ] Rates documentées (SSR/SR/R)

---

## Structure assets actuelle

| Rôle | Chemin actuel | Cible 2.0 |
|------|---------------|-----------|
| Frames cinéma source | `assets/gacha/event/{eventId}/` | `assets/Gacha/{eventId}/cinema/` |
| Frames runtime | `public/gacha/cinema/{eventId}/` | servi depuis assets |
| Bannière UI | `public/gacha/events/` | `assets/Gacha/{eventId}/banner/` |
| Icons | `public/gacha/icons/*.svg` | `assets/Gacha/UI/` |

Référence Disagrea :
- `src/data/disagreaGacha.ts`
- `src/data/disagreaGachaCinema.ts`
- `src/data/gachaRates.ts`
- `src/components/GachaOpening.tsx`
- `scripts/import-disagrea-gacha-cinema.mjs`
- `scripts/build-disagrea-gacha-video.mjs`

---

## Pipeline création

### 1. Drop user (optionnel)

`Input chatgpt/{event}_pack/` — **ne pas modifier** le dossier ; copier vers staging/assets.

### 2. Staging manifest

```
staging/gacha/{eventId}/
  MANIFEST.json
  cinema/frame-01.png ...
  banner.png
  rates-draft.json
```

### 3. Import scripts

Adapter depuis :
```bash
node scripts/import-disagrea-gacha-cinema.mjs
node scripts/build-disagrea-gacha-video.mjs   # si séquence animée
```

### 4. Code data

| Fichier | Contenu |
|---------|---------|
| `{event}Gacha.ts` | Pool, pity, featured |
| `{event}GachaCinema.ts` | Frame paths, timing |
| `gacha.ts` | Register event toggle |
| `FestivalEventBanner.tsx` / pattern Disagrea | UI accès |

### 5. TNR gacha

- [ ] Bannière visible accueil
- [ ] Cinéma s'ouvre sans 404
- [ ] 10 pulls simulés — rates cohérentes
- [ ] Pas de régression gacha standard village

---

## Duplication connue (à résoudre phase 2)

Même art Disagrea peut exister dans :
- `Input chatgpt/`
- `assets/gacha/event/disagrea/`
- `public/gacha/cinema/disagrea/`

Utiliser `asset-manifest.json` duplicateSamples pour déduire.

---

## Checklist livraison

- [ ] Manifest JSON versionné (staging ou assets)
- [ ] build + lint OK
- [ ] Smoke pull + cinéma mobile 9:16
- [ ] Doc rates dans staging si pas encore balance final
