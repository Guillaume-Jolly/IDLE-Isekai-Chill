# Chantier Myrion — MVP 10 : équilibrage global

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Prérequis :** MVP 9 assets validés (build OK)

## Objectif

Centraliser et ajuster légèrement les valeurs de gameplay de la Ferme lunaire pour une progression lisible : clic utile, passive dominante, déblocages étalés, supervision optionnelle, prestige LR lent.

## Hors scope

- Assets visuels (MVP 9)
- Nouveaux biomes / ressources globales
- Audio (système inchangé — cooldowns seulement référencés)
- TNR transversal
- Équilibrage final / telemetry

## Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `src/data/myrionWorksiteBalance.ts` | **Créé** — source unique constantes |
| `src/data/myrionWorksite.ts` | Import balance, formules clic/passive |
| `src/data/myrionWorksiteProgression.ts` | Seuils depuis balance, fix Mine (bois) |
| `src/data/myrionWorksitePrestige.ts` | Prestige depuis balance |
| `src/data/myrionWorksiteLife.ts` | Limites visuelles depuis balance |
| `src/data/myrionWorksiteAssignment.ts` | Page size depuis balance |
| `src/audio/worksiteAudio.ts` | Cooldowns depuis balance |
| `src/components/minigames/WorksiteMineBursts.tsx` | Burst limits depuis balance |
| `src/components/minigames/MyrionWorksiteGame.tsx` | Label aide progression |
| `docs/MYRION_WORKSITE_BALANCE.md` | **Créé** — référence équilibrage |

## Checklist test

- [x] `npm run build` OK
- [x] Pas d'import circulaire (prestige ↔ worksite)
- [x] Seuil Forêt 28 > 15 ancien (pas instantané)
- [x] Mine débloquable (bois, pas pierre pré-Mine)
- [x] Smoke save neuve (modules jeu via dev, clic 1/2 s, assign 30 s)
- [ ] F5 persistence UI (reload a écrasé save simulée — vérifier manuellement si besoin)
- [ ] Passive observée 30 s avec Myrion assigné
- [ ] Prestige Faille après déblocage Mine

## Smoke gameplay (2026-06-26)

| Test | Résultat |
|------|----------|
| Build TypeScript + Vite | OK |
| Forêt : 28 total (vs 15) | Seuil relevé — spam 10 s insuffisant (~2.8 produit à 0.28/clic × 10) |
| Mine : pierre pré-requis retiré | Corrigé → 52 total + 18 bois |
| Imports circulaires | `balance` feuille ; prestige n'importe pas `myrionWorksite.ts` |
| Écran blanc | Non reproduit (build compile) |

## Commits locaux prévus

- `feat(worksite): centralize worksite balance values`
- `docs: document worksite balance pass`

## Prochaine étape recommandée

1. Smoke save neuve en jeu (Forêt ~3 min, Mine ~6 min)
2. MVP 11 polish UX progression (toasts déblocage, courbe passive HUD)
3. Telemetry légère optionnelle (`totalProducedBySpot` déjà persisté)
