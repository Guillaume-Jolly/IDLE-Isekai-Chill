# Event Disagrea — guide de génération visuelle

## Problème à éviter

Les refs Disgaea (`sources/references/`) ne doivent **pas** être utilisées comme modèle de **style de rendu**.
Elles servent uniquement à l'**ADN du personnage** :

- Couleur / forme des cheveux
- Archétype (démon vassal, ange, overlord, kuudere)
- 2–3 motifs (ailes chauve-souris, nœud rouge, lapin…)

## Style à reproduire (le jeu)

| Rôle | Fichier anchor |
|------|----------------|
| Compagnon humain | `public/assets/companions/talia/affinity-1.png` |
| Myrion full | `public/assets/minigames/capture/myrions/cutout/moussprout.png` |
| Myrion chibi | `public/assets/minigames/dressage/myrions/chibi/moussprout.png` |
| Ambiance couleurs (pas le trait) | `backgrounds/affinity/*/…_mobile.png` |

Caractéristiques IDLE Isekai Chill :

- Gacha mobile moderne, shading **doux painterly** (pas cel-shading Disgaea dur)
- Fantasy isekai **cozy** : cuir, rubans, capes, détails aventurier
- Myrions **originaux** type Palworld : corps ronds, mignons, familiers du jeu
- Tenues **redesignées** pour le village — pas cosplay 1:1 Disgaea

## Cutouts émotions (staging)

Style **verrouillé** sur `integrated/companions/etna/companion-etna-affinity-01-scene-originale-v1.png` :

- Gacha painterly doux, proportions standard (**pas chibi**, **pas cel-shading Disgaea**)
- Seule l'expression/pose change entre émotions — même tenue L1, même technique
- Voir `staging/companion-visual-pack/CUTOUT_STYLE.md` et `scripts/staging/companion-visual-pack-data.mjs`

Les cutouts v1 générés sans ce verrouillage doivent être regénérés en **v2**.

## Fond détourage (obligatoire)

```
Couleur unique plate #CFCFCF
Pas de dégradé, pas de vignette, pas de sol, pas d'ombre portée au sol
```

Brief complet : `CUTOUT_BACKGROUND` dans `src/data/eventDisagreaPack.ts`

## Prompts

```typescript
import { disagreaCutoutPrompt, disagreaChibiPrompt, disagreaMyrionCutoutPrompt } from './src/data/eventDisagreaPack'
```

## Références à passer au générateur

### Compagnons (validé v1 Etna)
1. **Style prioritaire** → `generated/companions/etna/cutout-1.png` (rendu approuvé)
2. **Style secondaire** → Talia
3. **Identité** → texte uniquement (cheveux, yeux, tenue iconique) — **ne pas** passer la ref Disgaea webp (copier-coller)

### Myrions (validé)
1. **Style** → `prinnettenoire.png` ou Moussprout
2. Pas de ref Disgaea

### Mob légendaire LR — Chimerelle
Fusion des 4 thèmes : `generated/myrions/cutout/chimerelle.png`

## Checklist validation

- [ ] Shading doux comme Talia, pas traits Disgaea
- [ ] Tenue isekai originale, pas copie exacte
- [ ] Fond #CFCFCF uniforme
- [ ] Full body pieds visibles
- [ ] Myrion = familier Palworld original, pas Prinny
