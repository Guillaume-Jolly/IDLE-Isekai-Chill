# Chantier Myrion — MVP 4

> **Branche :** `feature/myrion-worksite-mvp2` (incrémental)  
> **Statut :** vie esthétique des Myrions dans la scène

## Objectif

Rendre la **Ferme lunaire / Chantier Myrion** plus vivante visuellement : Myrions assignés visibles dans le panorama, petites routines décoratives, sans impact sur la production ni l’économie.

## Périmètre MVP 4

### Affichage scène

- Myrions assignés au **biome actif** visibles près de leur spot (état `working`) ou zones repos/repas
- Changement de biome → seuls les Myrions de ce biome
- Limite d’affichage : **8** visibles + badge `+N`
- Placeholders : emoji + nom court (pas d’assets finaux)

### États décoratifs (purs visuels)

| État | Affichage |
|------|-----------|
| `working` | Près du spot assigné |
| `resting` | Coin repos 🛏️ |
| `eating` | Coin nourriture 🍞 |
| `sleeping` | Coin repos + `Zzz` |

Recalcul via `getDecorativeMyrionState(myrionId, bucket, spotKey)` — bucket **60 s**, pas de save dédiée.

### Zones décoratives

- **Coin repos** (gauche, discret)
- **Coin nourriture** (droite, discret)

### Drawer « Vie »

- Texte : routines décoratives, pas d’impact production
- Nombre de Myrions visibles, état dominant, mini-liste

### Fichiers

- `src/data/myrionWorksiteLife.ts` — logique pure
- `src/components/minigames/WorksiteMyrionLifeLayer.tsx` — rendu scène
- `src/components/minigames/MyrionWorksiteGame.tsx` — intégration + drawer
- `src/components/minigames/Worksite.css` — styles `mg-worksite-life-*`

## Absence d’impact gameplay

- Formules de production **inchangées**
- Assignations, affinité, fatigue, faim : **inchangés**
- Save `myrionWorksite` : **inchangée** (pas de champ état décoratif)
- Toasts / économie globale : **inchangés**

## Hors scope MVP 4

- Fenêtre passive PC, PiP, offline long
- LR-only, spots prestige, ressources `herbs`/`water`/`ore`/`coal`
- Sound design, assets finaux obligatoires
- Nouveaux biomes, refactor save
- Fatigue / faim / buffs / malus gameplay
- Interactions cliquables complexes avec les Myrions
- **Polish fin de dev** : feedback visuel production passive (voir `MYRION_WORKSITE_MVP3.md`)

## Checklist test

- [ ] Ouvrir Ferme lunaire / Chantier Myrion
- [ ] Assigner un Myrion en Prairie → visible dans la scène
- [ ] Assigner plusieurs Myrions → affichage compact, `+N` si > 8
- [ ] Changer de biome → seuls Myrions du biome actif
- [ ] Attendre ~60 s → changement d’état décoratif possible
- [ ] Voir repos / repas / sommeil (zones + états)
- [ ] Production auto continue (même débit, silent toast)
- [ ] Reload → pas de crash, assignations conservées
- [ ] Mobile : scène lisible, noms courts masqués si besoin
- [ ] Pas d’image cassée, pas de boucle React
- [ ] Drawer **Vie** : texte + liste cohérente
- [ ] `npm run build` OK

## Limitations connues

- États déterministes par bucket 60 s (pas d’animation entre buckets)
- Pas de sprites / animations finales
- Noms masqués sur très petit mobile (emoji seuls)
