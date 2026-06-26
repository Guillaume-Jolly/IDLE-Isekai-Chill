# Chantier Myrion — Équilibrage (MVP 10)

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Source unique :** `src/data/myrionWorksiteBalance.ts`

## Objectifs d'équilibrage

| Pilier | Cible provisoire |
|--------|------------------|
| Clic | Feedback immédiat, accélère la progression, **ne remplace pas** les Myrions |
| Passive | Source principale une fois des Myrions assignés |
| Déblocages | Forêt ~2–4 min jeu léger ; Mine ~5–8 min cumulé |
| Supervision | Bonus lisible ~+15 %, optionnel |
| Prestige LR | Très lent, cosmétique / fin de partie, **non bloquant** |

## Valeurs avant MVP 10

| Constante | Avant |
|-----------|-------|
| Clic base filon | 0.35 (Champs 0.40) |
| Passive base / Myrion | 0.012 (Champs 0.014) |
| Bonus clic / Myrion assigné | +0.05 × mult rareté |
| Plancher clic | 0.10 |
| Supervision | ×1.15 |
| Forêt déblocage | 15 production totale |
| Mine déblocage | 30 total **+ 12 pierre** ⚠️ |
| Spots forêt | 18 / 30 bois |
| Spots mine | 24 / 45 pierre |
| Prestige LR | 0.002 /s |
| Max espèces scène | 15 |
| Max bursts clic | 12 |

### Bug corrigé MVP 10

La Mine exigeait **12 pierre** avant déblocage, alors que la pierre n'est produite **qu'en Mine** → progression bloquée sur save neuve. Remplacé par **18 bois** (Forêt).

## Valeurs après MVP 10

| Constante | Après | Justification |
|-----------|-------|---------------|
| `WORKSITE_DEFAULT_BASE_CLICK_YIELD` | **0.28** | −20 % — clic moins dominant |
| Champs override clic | **0.32** | Filon « meilleur » prairie, sans écraser la passive |
| `WORKSITE_DEFAULT_BASE_AUTO_PER_MYIRION` | **0.014** | +17 % — passive un peu plus centrale |
| Champs override passive | **0.016** | Aligné filon premium prairie |
| `WORKSITE_CLICK_ASSIGNED_BONUS_FACTOR` | **0.04** | Bonus clic assignés réduit |
| `WORKSITE_CLICK_MIN_YIELD` | **0.08** | Plancher abaissé |
| Supervision | **×1.15** | Inchangé |
| Forêt | **28** total chantier | ~3 min à ~0.5 clic/s × 0.28 |
| Mine | **52** total + **18** bois | ~6 min cumulé après Forêt |
| Clairière / Souches | **22 / 36** bois | Progression spots forêt étalée |
| Veine / Charbon | **20 / 38** pierre | Après accès Mine |
| Prestige LR | **0.002 /s** | Inchangé — ~1 éclat / 8 min LR supervisé |
| Visual / audio cooldowns | centralisés | Pas de changement gameplay économique |

## Rythme cible estimé (save neuve, clic seul)

Hypothèse : **1 clic toutes les 2 s** sur un filon prairie (0.28 / clic).

| Étape | Seuil | Clics estimés | Temps estimé |
|-------|-------|---------------|--------------|
| Forêt | 28 total | ~100 | ~3 min 20 |
| Mine | +24 total + 18 bois | ~86 clics bois + mix | ~+3–5 min après Forêt |

Avec **1 Myrion N** assigné (0.014/s) : +~0.84/min → délais légèrement réduits.

## Limites connues

- Estimations sans assignation multi-filons ni supervision optimisée.
- Saves existantes avec biomes déjà débloqués : pas de rétro-déblocage.
- Équilibrage **provisoire** — pas de telemetry intégrée.
- Cooldowns audio documentés mais non liés à l'économie.

## Points à tester plus tard

- [ ] Session 15 min réelle avec assignations typiques (3–5 espèces)
- [ ] Impact rareté SR+ sur sensation « clic trop fort »
- [ ] Prestige LR avec supervision Mine active
- [ ] Mobile : spam clic + bursts visuels
- [ ] Alignement ressources chantier → village (hors scope MVP 10)

## Fichiers liés

| Fichier | Rôle |
|---------|------|
| `myrionWorksiteBalance.ts` | **Source** constantes |
| `myrionWorksite.ts` | Formules clic / passive — import balance |
| `myrionWorksiteProgression.ts` | Logique déblocages — import seuils |
| `myrionWorksitePrestige.ts` | Prestige — import `WORKSITE_PRESTIGE_BALANCE` |
| `myrionWorksiteLife.ts` | Limites visuelles chibis |
| `worksiteAudio.ts` | Cooldowns SFX — référence balance |
| `WorksiteMineBursts.tsx` | Limites FX clic |

## Graphe imports (anti-cycles)

```
myrionWorksiteDefs (IDs)
        ↑
myrionWorksiteBalance (feuille — aucun import worksite)
        ↑
myrionWorksiteProgression / Prestige / Life / Audio / UI
        ↑
myrionWorksite.ts (merge + formules, importe prestige pour save)
```

`myrionWorksitePrestige` **n'importe pas** `myrionWorksite.ts` — cycle MVP 8 évité.

## MVP 14 — extension 15 biomes

Seuils biomes 4–15 dans `WORKSITE_UNLOCK_THRESHOLDS` (provisoire).

- Biomes 1–3 : seuils MVP 10 inchangés.
- Biomes 4+ : `totalChantier` + ressource d’un biome antérieur (anti-blocage).
- Totaux : `food`, `wood`, `stone`, `ingredients`, `totalChantier`.

Détail : `docs/MYRION_WORKSITE_MVP14.md`.
