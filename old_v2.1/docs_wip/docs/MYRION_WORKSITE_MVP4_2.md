# Chantier Myrion / Ferme lunaire — MVP 4.2

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Statut :** polish gameplay / visuel léger post-MVP 4.1

---

## Objectif MVP 4.2

Améliorer le **ressenti joueur** du mini-jeu déjà validé en MVP 4.1, sans changer les boucles économiques ni rouvrir la migration save v1.

Focus : feedback de minage, lisibilité des filons, chibis décoratifs discrets, confort mobile.

---

## Ajustements réalisés

### Feedback de minage

- Toasts globaux **désactivés au clic** (`silent: true`) — la récompense est lue sur l’éclat local.
- Libellé flottant **`+N Ressource`** sur chaque éclat (vivres / bois / pierre).
- Éclats **plafonnés** (12 simultanés max) pour éviter la surcharge visuelle.
- Trajectoire **biaisée vers le haut** quand le filon est bas dans la scène ; distance légèrement réduite.
- Durée éclat ~**2,2 s** ; conteneur `overflow: hidden` pour rester dans la zone visible.

### Lisibilité des filons

- **Badge ressource du biome** en haut de la scène (prairie → Vivres, forêt → Bois, mine → Pierre).
- **Pastille ressource** sur chaque filon débloqué.
- **Surbrillance** du dernier filon miné (~1,6 s).
- Filons **verrouillés** : overlay 🔒 + filtre grisé.
- Usure visuelle **adoucie** aux niveaux élevés (filons encore lisibles).

### Chibis / vie décorative

- Zone de balade recentrée (moins de chevauchement avec les filons).
- Obstacles filons légèrement renforcés.
- Chibis légèrement réduits (base 2,4 rem) — scaling rareté conservé.
- Coins repos / repas plus discrets (opacité, labels masqués).

### Mobile

- Cibles filons **plus grandes** (3,5 rem).
- `overflow-x: hidden` sur la scène (plus de scroll horizontal parasite).
- Chip ressource biome adaptée au petit écran.

---

## Hors scope

- Migration save v1 / reset assignations
- Fenêtre passive PC dédiée
- LR-only, nouvelles ressources globales
- Nouveaux assets PNG (seuls CSS / positionnement / opacité / z-index)
- Refactor massif, TNR transversal complet
- Push / PR

---

## Checklist test courte

| # | Test | Attendu |
|---|------|---------|
| 1 | Ouvrir Chantier Myrion | Scène plein écran, chip ressource biome visible |
| 2 | Cliquer filons (spam modéré) | Éclats + libellé `+N`, pas de spam toast global |
| 3 | Filon verrouillé | 🔒 visible, non cliquable |
| 4 | Changer biome | Chip + pastilles ressource cohérentes |
| 5 | Assigner Myrions | Chibis visibles, pas envahissants |
| 6 | Mobile / étroit | Filons cliquables, pas de scroll horizontal |
| 7 | `npm run build` | OK |

---

## Fichiers touchés

- `src/components/minigames/MyrionWorksiteGame.tsx`
- `src/components/minigames/WorksiteMineBursts.tsx`
- `src/components/minigames/Worksite.css`
- `src/data/myrionWorksiteLife.ts`
- `docs/MYRION_WORKSITE_MVP4_2.md`
