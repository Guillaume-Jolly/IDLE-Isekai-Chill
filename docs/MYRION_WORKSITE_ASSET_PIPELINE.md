# Chantier Myrion — Pipeline assets visuels

> **Statut :** préparation MVP 3 — placeholders actifs, pas d’assets lourds obligatoires.  
> **Config :** `src/data/myrionWorksiteVisuals.ts`  
> **Composants :** `src/components/minigames/WorksiteVisuals.tsx`

## Objectif

Permettre le remplacement progressif des placeholders CSS/HTML par des PNG finaux **sans modifier** `MyrionWorksiteGame.tsx` (seule la config et les fichiers assets changent).

## Arborescence

```
public/assets/minigames/myrion-worksite/
├── backgrounds/     # Fonds panorama par biome
├── spots/           # Objets spot sur la scène
├── icons/           # Icônes ressources
├── ui/              # Overlays état (actif, verrouillé, supervision)
└── decorations/     # Décor optionnel MVP 3+
```

Servi à l’URL `/assets/minigames/myrion-worksite/...`.

## Tailles recommandées

| Type | Dimensions | Format |
|------|------------|--------|
| Background biome | 1920×720 (min 1280×720) | PNG ou WebP |
| Spot | 128×128 – 256×256 | PNG transparent |
| Icône ressource | 64×64 – 96×96 | PNG transparent |
| UI overlay | 64×128 | PNG transparent |

## Liste assets MVP 3

### Backgrounds

| Fichier | Biome | Placeholder CSS |
|---------|-------|-----------------|
| `prairie.png` | Prairie du chantier | `mg-worksite-bg--prairie` |
| `forest.png` | Forêt douce | `mg-worksite-bg--foret` |
| `mine.png` | Mine tranquille | `mg-worksite-bg--mine` |
| `swamp.png` | Marais (futur) | `mg-worksite-bg--marais` |
| `crystal.png` | Cristal (futur) | `mg-worksite-bg--cristal` |
| `astral.png` | Faille astrale (futur) | `mg-worksite-bg--astral` |

### Spots

| Fichier | Spot | Biome |
|---------|------|-------|
| `bosquet.png` | Bosquet | Prairie |
| `pierrier.png` | Pierrier / Pierrier profond | Prairie / Mine |
| `champs.png` | Champs | Prairie |
| `sous-bois.png` | Sous-bois | Forêt |
| `clairiere-herbes.png` | Clairière aux herbes | Forêt |
| `source-claire.png` | Source claire | Forêt |
| `veine-brute.png` | Veine brute | Mine |
| `charbonniere.png` | Charbonnière | Mine |
| `cristalliere.png` | Cristallière (futur) | Cristal |
| `ruines-anciennes.png` | Ruines (futur) | — |
| `faille-astrale.png` | Faille (futur) | Astral |

### Icons

| Fichier | Ressource | Gameplay |
|---------|-----------|----------|
| `wood.png` | Bois | MVP 2 |
| `stone.png` | Pierre | MVP 2 |
| `food.png` | Vivres | MVP 2 |
| `herbs.png` | Herbes | Documenté — pas encore `ResourceKey` |
| `water.png` | Eau | Documenté |
| `ore.png` | Minerai | Documenté |
| `coal.png` | Charbon | Documenté |
| `crystal.png` | Cristal | Documenté |
| `ancient-fragment.png` | Fragment ancien | Documenté |
| `astral-ore.png` | Minerai astral | Documenté |

### UI

| Fichier | Usage |
|---------|-------|
| `spot-locked.png` | Spot non débloqué |
| `spot-active.png` | Spot sélectionné |
| `spot-supervised.png` | Spot sous supervision (futur overlay) |
| `biome-locked.png` | Biome verrouillé |
| `assignment-slot.png` | Emplacement Myrion vide |

## Règles de fallback

1. **`available: false`** (défaut) — aucune requête `<img>` ; placeholder CSS + emoji.
2. **`available: true`** — `<img src="...">` rendu ; si erreur réseau → retour silencieux au placeholder (`onError`).
3. **Pas d’image cassée** — jamais d’attribut `src` vers un fichier absent tant que `available` est false.
4. **Gameplay inchangé** — les visuels n’affectent pas production, save, ou assignation.

## Remplacer un placeholder par une image finale

1. Déposer le PNG dans le bon sous-dossier (`backgrounds/`, `spots/`, etc.).
2. Ouvrir `src/data/myrionWorksiteVisuals.ts`.
3. Trouver l’entrée (`WORKSITE_BIOME_VISUALS`, `WORKSITE_SPOT_VISUALS`, etc.).
4. Passer `available: true` sur l’asset concerné.
5. Vérifier en jeu — aucun changement de composant requis.
6. Optionnel : retirer l’emoji fallback en CSS si l’image couvre tout (MVP 3 polish).

Exemple :

```typescript
background: {
  path: `${MYRION_WORKSITE_ASSET_ROOT}/backgrounds/prairie.png`,
  available: true, // ← activer après ajout du fichier
  placeholderClass: 'mg-worksite-bg--prairie',
},
```

## Ajouter un nouveau biome

1. **Gameplay** (MVP 3+) : entrée dans `WORKSITE_BIOMES` (`myrionWorksite.ts`).
2. **Visuel** : entrée dans `WORKSITE_BIOME_VISUALS` avec `background`, `placeholderClass`, fichier PNG prévu.
3. **CSS** : classe `mg-worksite-bg--{id}` dans `Worksite.css` si nouvelle palette.
4. **Legacy** : ajouter `panoramaClass` sur le biome gameplay si gradient scène distinct.

## Ajouter un nouveau spot

1. **Gameplay** : `spotDef(...)` dans `myrionWorksite.ts`.
2. **Visuel** : entrée `WORKSITE_SPOT_VISUALS` avec `asset`, `cardClass`, `objectClass`.
3. Déposer `spots/{id}.png` quand prêt ; activer `available`.

## Ajouter une nouvelle icône ressource

1. Si la ressource n’existe pas dans `ResourceKey` : **documenter seulement** dans `WORKSITE_RESOURCE_ICON_VISUALS` (pas d’économie).
2. Quand `ResourceKey` est ajouté au jeu global : lier le spot au bon `resourceId`.
3. Fichier dans `icons/` + `available: true` quand validé.

## Classes CSS utiles

| Classe | Rôle |
|--------|------|
| `mg-worksite-biome-bg` | Conteneur scène avec fond |
| `mg-worksite-bg--*` | Gradient placeholder biome |
| `mg-worksite-spot-card` | Bouton spot sur panorama |
| `mg-worksite-spot-object` | Objet spot (emoji / img) |
| `mg-worksite-spot--active` | Spot sélectionné |
| `mg-worksite-spot--locked` | Spot verrouillé |
| `mg-worksite-biome--supervised` | Biome actif supervisé |
| `mg-worksite-resource-icon--*` | Fallback icône ressource |

## Tests manuels

- [ ] Ouvrir Chantier Myrion — pas d’icône « image cassée »
- [ ] Changer de biome — gradients cohérents
- [ ] Drawer ressources — icônes emoji fallback
- [ ] Mobile — scène lisible, pas de régression MVP 2
- [ ] `npm run build` OK

## Hors scope

- Intégration gameplay biomes/spots futurs (MVP 3)
- Nouvelles ressources économie (`herbs`, `ore`, etc.)
- Animations, sons, fenêtre passive PC
