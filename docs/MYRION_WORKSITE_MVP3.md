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
| Forêt douce | Verrouillée | 10 production totale chantier |
| Mine tranquille | Verrouillée | 25 total **et** 10 pierre |

Config : `WORKSITE_UNLOCK_THRESHOLDS` dans `src/data/myrionWorksiteProgression.ts`.

### Déblocage spots

| Biome | Spot | État initial | Condition |
|-------|------|--------------|-----------|
| Prairie | Bosquet, Pierrier, Champs | Débloqués | — |
| Forêt | Sous-bois | À l'ouverture Forêt | — |
| Forêt | Clairière aux herbes | Verrouillé | 15 bois |
| Forêt | Source claire | Verrouillé | 25 vivres |
| Mine | Pierrier profond | À l'ouverture Mine | — |
| Mine | Veine brute | Verrouillé | 20 pierre |
| Mine | Charbonnière | Verrouillé | 40 pierre |

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

- [ ] Nouvelle partie : Prairie seule, Forêt/Mine verrouillées
- [ ] Drawer Progression : seuils visibles
- [ ] Clic spot actif → toast groupé (pas auto)
- [ ] Fusion même ressource → bump vert
- [ ] Auto passive → pas de toast
- [ ] Atteindre 10 total → Forêt débloquée + bannière locale
- [ ] Spots Forêt/Mine secondaires verrouillés puis débloqués aux seuils
- [ ] Reload : biomes/spots/assignations conservés
- [ ] Save MVP 2 migrée sans crash
- [ ] Build OK

## Pipeline visuel

Inchangé — voir `docs/MYRION_WORKSITE_ASSET_PIPELINE.md`. Activer `available: true` quand les PNG sont prêts.
