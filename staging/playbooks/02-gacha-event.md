# 02 — Nouvel event Gacha

Event complet : bannière, **rates**, pity, cinéma, pool, backgrounds, guests.

Basé sur Disagrea — chemins post Assets 2.0.

---

## Prérequis

- [ ] Event ID slug (`disagrea-event`, …)
- [ ] Durée / permanent
- [ ] Pool : compagnons, fragments, ressources, Myrions
- [ ] **Rates documentées** (poids par rareté + featured)
- [ ] Bannière + cinéma (frames ou vidéo)
- [ ] Formulaire intake rempli (ci-dessous)

---

## Formulaire entrées user

```markdown
### Intake gacha event — {date}

- **eventId :**
- **Dates / permanent :**
- **Featured compagnons / Myrions :**
- **Rates cible :** (SSR %, pity threshold, dup protection ?)
- **Bannière :** source image
- **Cinéma :** N frames / vidéo webm / opening.webm existant ?
- **Biome event :** biomeId capture/dressage
- **Guests intégrés :** liste IDs
- **NSFW pool :** oui/non — gate validation
- **Toggle UI :** bannière accueil — composant ?
```

---

## Structure assets

| Rôle | Chemin |
|------|--------|
| Cinéma frames | `assets/Gacha/{eventId}/cinema/` |
| Bannière | `assets/Gacha/{eventId}/banner/` |
| Icons pool | `assets/Gacha/UI/` |
| Manifest | `assets/Gacha/event/{eventId}/manifest.json` |
| Backgrounds event | `assets/Background/{biomeId}/` |

---

## Pipeline

### 1. Staging manifest

```
staging/gacha/{eventId}/
  MANIFEST.json
  rates.json
  cinema/frame-*.png
  banner.png
```

### 2. Import

```bash
node scripts/import-disagrea-gacha-cinema.mjs
npm run build:disagrea-gacha-video
```

### 3. Fichiers code — checklist complète

| Fichier | Contenu |
|---------|---------|
| `src/data/{event}Gacha.ts` | Pool, featured, pull logic |
| `src/data/{event}GachaCinema.ts` | Frames, timing |
| `src/data/gachaRates.ts` | Poids raretés partagés / override event |
| `src/data/gacha.ts` | Register event, toggle, routing pull |
| `src/data/festivalGacha.ts` | Pattern second event si applicable |
| `src/data/disagreaGacha.ts` | Référence Disagrea |
| `src/data/eventDisagreaPack.ts` | Pack guests + assets |
| `src/data/companionFragments.ts` | Si nouveaux fragments pool |
| `src/components/GachaOpening.tsx` | Cinéma ouverture |
| `src/components/DisagreaEventBanner.tsx` / `FestivalEventBanner.tsx` | Bannière accueil |
| `src/App.tsx` | Affichage bannière, flags event |
| `assets/Background/{eventBiomeId}/` | Fonds chasse/dressage |
| `assets/Compagnons/{guestId}/**` | Portraits guests |
| [`11-new-myrion-biome.md`](./11-new-myrion-biome.md) | Myrions event si nouveau biome |
| `vite.repo-assets.ts` | Rare |

---

## Rates — points de contrôle

- [ ] `RARITY_META.weight` cohérent avec design (`gacha.ts`)
- [ ] Event override documenté dans `{event}Gacha.ts`
- [ ] Pity / garantie documentée (même si non implémentée — noter)
- [ ] 10 pulls simulés — distribution plausible
- [ ] Pas de régression gacha village standard

---

## TNR

[`10-visual-qa-tnr.md`](./10-visual-qa-tnr.md) § Gacha G1–G5 + Disagrea D1–D4.

```bash
npm run tnr:baseline
```

---

## Livraison

- [ ] MANIFEST + rates.json versionnés
- [ ] Smoke mobile 9:16 cinéma
- [ ] Entrée changelog avec intérêt event

---

## Duplication

Vérifier `asset-manifest.json` duplicateSamples avant promote.
