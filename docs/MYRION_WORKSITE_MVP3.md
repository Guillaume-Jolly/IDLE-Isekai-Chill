# Chantier Myrion — MVP 3

> **Branche :** `feature/myrion-worksite-mvp2` (MVP 2 + 3 incrémental)  
> **Statut :** progression / déblocages provisoires

## Objectif

Ajouter une **progression claire** au Chantier Myrion : déblocage progressif de biomes et spots, feedback lisible, save étendue — sans équilibrage final ni assets finaux.

## Périmètre MVP 3

### Déblocage biomes

| Biome | État initial | Condition (provisoire) |
|-------|--------------|------------------------|
| Prairie du chantier | Débloquée | — |
| Forêt douce | Verrouillée | 15 production totale chantier |
| Mine tranquille | Verrouillée | 30 total **et** 12 pierre |

Config : `WORKSITE_UNLOCK_THRESHOLDS` dans `src/data/myrionWorksiteProgression.ts`.

### Déblocage spots

| Biome | Spot | État initial | Condition |
|-------|------|--------------|-----------|
| Prairie | Bosquet, Pierrier, Champs | Débloqués | — |
| Forêt | Sous-bois | À l'ouverture Forêt | — |
| Forêt | Clairière aux herbes | Verrouillé | 18 bois |
| Forêt | Source claire | Verrouillé | 30 vivres |
| Mine | Pierrier profond | À l'ouverture Mine | — |
| Mine | Veine brute | Verrouillé | 24 pierre |
| Mine | Charbonnière | Verrouillé | 45 pierre |

### Ressources spécialisées

| Spot | Ressource cible | État |
|------|-----------------|------|
| Clairière aux herbes | `herbs` | **Future** — `food` provisoire |
| Source claire | `water` | **Future** — `food` provisoire |
| Veine brute | `ore` | **Future** — `stone` provisoire |
| Charbonnière | `coal` | **Future** — `stone` provisoire |

Pas de nouvelle `ResourceKey` globale tant que l'économie ne les supporte pas.

### Save (`myrionWorksite`)

Champs ajoutés MVP 3 :

- `unlockedSpotKeys: string[]` — clés `biome:spot`
- `seenUnlockNotificationIds: string[]` — notifications locales déjà vues

Conservés : `unlockedBiomeIds`, totaux, assignations, sélections, `lastAutoTickAt`.

**Migration MVP 1/2 :** si `unlockedSpotKeys` absent → prairie par défaut + réévaluation depuis `totalProducedBySpot`.

### Feedback

- Drawer **Progression** (totaux + prochains seuils)
- Biomes/spots verrouillés visibles (🔒, condition)
- Bannière locale « Débloqué » (non intrusive, pas de toast global)
- Pipeline visuel : classes `mg-worksite-spot--locked`, placeholders

### Toasts groupés (global)

Réimplémentés pour les gains **actifs** (clic chantier, mini-jeux non-silent) :

- Une fenêtre, une ligne par ressource
- Fusion même ressource + bump vert `+N`
- Timer 4 s après dernier gain
- Production auto chantier : **`silent: true`** → pas de toast

Fichiers : `RewardToastProvider.tsx`, `rewardToastEntries.ts`, `useRewardToasts.ts`, `rewardToastContext.ts`.

## Hors scope MVP 3

- MVP 4, fenêtre passive PC, LR-only
- Assets finaux, sons, animations repos
- Équilibrage final des seuils
- Nouvelles ressources économie globale obligatoires

## Checklist test

- [x] Nouvelle partie : Prairie seule, Forêt/Mine verrouillées
- [x] Drawer Progression : seuils visibles (onglet Progression)
- [x] Clic spot actif → toast groupé (pas auto)
- [x] Fusion même ressource → une fenêtre Bois (bump non re-testé visuellement en détail)
- [x] Auto passive → pas de toast (Myrion assigné, +0.19 total sans toast)
- [x] Atteindre seuil Forêt → Forêt débloquée (seuil initial 10, trop rapide ~6 s spam)
- [x] Spots Forêt secondaires : Sous-bois OK, Clairière OK si bois ≥ seuil, Source verrouillée
- [x] Reload : biomes/spots/assignations/totaux conservés
- [ ] Mine débloquée en session (non poussé jusqu'au seuil — rythme ajusté)
- [x] Build OK
- [x] Dev server OK après fix import circulaire

## Smoke test — 26/06/2026

**Environnement :** `feature/myrion-worksite-mvp2` @ `cb3ffd0` + correctifs locaux  
**URLs :** http://localhost:5173/ · http://192.168.1.18:5173/

### Bug bloquant corrigé

Import circulaire `myrionWorksite.ts` ↔ `myrionWorksiteProgression.ts` → écran blanc en `npm run dev` (`Cannot access 'WORKSITE_BIOME_IDS' before initialization`). Extraction vers `myrionWorksiteDefs.ts`.

### Seuils testés et ajustés

| Seuil | Avant | Après | Ressenti |
|-------|-------|-------|----------|
| Forêt (total) | 10 | **15** | Trop rapide en spam clic (~6 s) |
| Mine (total + pierre) | 25 + 10 | **30 + 12** | Légèrement plus tardif |
| Clairière herbes | 15 bois | **18** | OK |
| Source claire | 25 vivres | **30** | OK |
| Veine brute | 20 pierre | **24** | OK |
| Charbonnière | 40 pierre | **45** | OK |

### Bugs restants

- Ressources spécialisées toujours en fallback `food`/`stone` (connu MVP 3)
- Mine non validée end-to-end en une session (seuils relevés, logique identique Forêt)

## Pipeline visuel

Inchangé — voir `docs/MYRION_WORKSITE_ASSET_PIPELINE.md`. Activer `available: true` quand les PNG sont prêts.
