# Chantier Myrion / Ferme lunaire — MVP 5

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Statut :** intégration visuelle/sonore présentable (sans nouvelle mécanique)

---

## Objectif MVP 5

Rendre la Ferme lunaire **présentable** visuellement et auditivement : fonds mieux cadrés, spots/icônes corrigés, décor discret, sons légers intégrés via le moteur audio existant.

**MVP 4 clôturé** — pas de sous-versions 4.x.

---

## Assets validés (audit MVP 5)

### Backgrounds actifs (3)

| Asset | Classe | Dimensions | Statut |
|-------|--------|------------|--------|
| `prairie.png` | OK provisoire | 1536×1024 | Actif + CSS panoramic |
| `forest.png` | OK provisoire | 1536×1024 | Actif + CSS panoramic |
| `mine.png` | OK provisoire | 1536×1024 | Actif + CSS panoramic |

Wide 2560×960 : **prompts prêts** → `MYRION_WORKSITE_MVP5_ASSET_PROMPTS.md`

### Spots actifs (9)

| Spot | Fichier | Statut MVP 5 |
|------|---------|--------------|
| bosquet | `bosquet.png` | OK |
| pierrier (Potager) | `pierrier.png` | **Corrigé** (chemin `potager.png` inexistant → activé) |
| champs | `champs.png` | OK |
| sous-bois | `sous-bois.png` | OK |
| clairiere-herbes | `clairiere-herbes.png` | OK |
| source-claire | `source-claire.png` | OK |
| pierrier-profond | `pierrier-profond.png` | OK |
| veine-brute | `veine-brute.png` | OK |
| charbonniere | `charbonniere.png` | OK |

Note : PNG 1536×1024 avec ~30–45 % pixels opaques — `object-fit: contain` + drop-shadow.

### Icônes gameplay (3 actives)

| Icône | Statut |
|-------|--------|
| wood, stone, food | OK |
| herbs, water, ore, coal | Visuel seul, actives |
| crystal | **Désactivée** (15 % opaque, halo) |
| spores | Non branchée |

### Décorations

| Asset | Statut |
|-------|--------|
| rest-zone.png | OK — opacité réduite MVP 5 |
| food-zone.png | OK — opacité réduite |
| small-tent.png | Désactivé (futur) |

### Futurs (désactivés)

Backgrounds : swamp, crystal, astral — spots MVP 3 — UI overlays PNG présents, rendu CSS prioritaire.

---

## Sons

| Élément | Statut |
|---------|--------|
| Clic minage (vivres/bois/pierre) | **Intégré** — `worksiteAudio.ts` |
| Déblocage | **Intégré** |
| Drawer | **Intégré** |
| Ambiance biome | **Intégré** (procédural, bus musique) |
| Fichiers audio | **Reportés** — spec dans `MYRION_WORKSITE_SOUND_DESIGN.md` |

---

## Ajustements code MVP 5

- `Worksite.css` — cadrage panoramic fonds, drop-shadow spots, décor plus discret
- `WorksiteVisuals.tsx` — classe biome sur fond
- `myrionWorksiteVisuals.ts` — pierrier activé
- `worksiteAudio.ts` — sons procéduraux
- `MyrionWorksiteGame.tsx` — hooks audio + biomeId fond

---

## Hors scope

- Nouveaux biomes jouables (MVP 3)
- Fenêtre passive PC, LR-only
- Nouvelles ressources globales
- Remplacement SVG/CSS-art
- Push / PR
- Migration save v1

---

## Checklist test

| # | Test | Attendu |
|---|------|---------|
| 1 | Ouvrir chantier | Fonds visibles, chip ressource, pas d’image cassée |
| 2 | Prairie / forêt / mine | Cadrage bas cohérent, filons cliquables |
| 3 | Clic minage | Éclat + son court, pas de toast spam |
| 4 | Déblocage (si dispo) | Chime doux |
| 5 | Drawer | Son léger à l’ouverture |
| 6 | Chibis + repos/repas | Visibles, décor discret |
| 7 | Mobile étroit | Pas de scroll horizontal |
| 8 | Console | Aucune erreur |
| 9 | `npm run build` | OK |

---

## Fichiers touchés

- `src/audio/worksiteAudio.ts` (nouveau)
- `src/components/minigames/MyrionWorksiteGame.tsx`
- `src/components/minigames/WorksiteVisuals.tsx`
- `src/components/minigames/Worksite.css`
- `src/data/myrionWorksiteVisuals.ts`
- `docs/MYRION_WORKSITE_ASSET_GENERATION_LOG.md`
- `docs/MYRION_WORKSITE_MVP5.md`
- `docs/MYRION_WORKSITE_MVP5_ASSET_PROMPTS.md`
- `docs/MYRION_WORKSITE_SOUND_DESIGN.md`
