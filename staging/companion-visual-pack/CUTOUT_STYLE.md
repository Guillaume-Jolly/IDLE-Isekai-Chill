# Style cutout émotions — RÈGLE VERROUILLÉE

## Ancre visuelle unique

**Référence obligatoire pour TOUS les cutouts émotions** (Disagrea + village) :

`assets/event-disagrea/integrated/companions/etna/companion-etna-affinity-01-scene-originale-v1.png`

→ Même **technique de rendu** que cette image (ignorer le décor — fond remplacé par `#CFCFCF`).

Ancre secondaire si besoin : `public/assets/companions/talia/affinity-1.png`

## Ce qu'on veut (comme Etna L1)

| Aspect | Cible |
|--------|--------|
| Proportions | **Gacha standard** — jeune adulte, tête ~1/6–1/7 du corps. **PAS chibi**, **PAS super-déformé** |
| Shading | **Painterly doux** — dégradés lisses, ombres arrondies. **PAS cel-shading Disgaea dur** |
| Lineart | Fins traits **colorés** (pas noir pur partout), nets mais intégrés au coloriage |
| Détail | Cheveux mèche par mèche, plis tissu, reflets cuir/métal, **rim light** magenta/doré léger |
| Yeux | Grands, iris détaillés, **plusieurs highlights**, expression lisible |
| Palette | Saturée, chaude, cohérente avec le personnage |
| Cadrage | **Full body** pieds visibles, centré, debout (sauf pose émotion explicite) |
| Fond | `#CFCFCF` plat uniforme — **aucun** décor, sol, ombre portée |

## Interdits explicites (cause des dérives v1)

- ❌ Chibi / Palworld / tête oversized
- ❌ Style Disgaea cel-shading dur (contours noirs épais, aplats plats)
- ❌ Style épuré minimal / cartoon simplifié
- ❌ Semi-réaliste 3D / rendu « illustration western »
- ❌ Alterner le style entre personnages ou entre émotions d'un même personnage

## Ce qui varie entre émotions

**Uniquement** : expression du visage + légère variation de pose (mains, inclinaison).

**Identique** : tenue L1, proportions, technique de rendu, niveau de détail, éclairage frontal doux + rim light.

## Nommage (validé v2)

`companion-{id}-emotion-{emotion}-cutout-v2.png`

Génération : passer **reference_image_paths** = Etna affinity-01 sur chaque appel.

Les cutouts v1 (style incohérent) sont obsolètes — ne pas promouvoir.

## Prompt bloc (copier dans chaque génération)

```
MATCH EXACT RENDERING of companion-etna-affinity-01-scene-originale-v1 and Talia affinity-1:
...
```

**En pratique** : passer `companion-etna-affinity-01-scene-originale-v1.png` en **reference_image_paths** à chaque génération cutout émotion (v2+).
