# Brief IA — détourage cheveux Laharl (fallback manuel)

Utiliser **seulement** si le script `npm run color-toon:build-hair-cutout` ne convient pas.
Le script repo est préféré : il copie les pixels du portrait sans altération.

## Fichiers de référence

| Fichier | Rôle |
|---------|------|
| `assets/Compagnons/laharl/affinite/affinity-1.png` | Portrait jeu (1536×1024) — **ne pas recadrer** |
| `staging/mini jeu/color 2/masks/laharl/chatgpt-cheveux-v2.png` | Masque cheveux niveaux de gris aligné |

## Prompt à donner à l’outil de détourage (Photoshop, remove.bg pro, SAM, etc.)

> À partir de `affinity-1.png` et du masque `chatgpt-cheveux-v2.png` :
>
> 1. Canvas **exactement 1536×1024 px** (même taille que le portrait, pas de crop).
> 2. **Copier** les pixels des cheveux depuis le portrait original — **ne pas recoloriser, ne pas regénérer** la mèche.
> 3. Fond **100 % transparent** (alpha = 0) partout ailleurs.
> 4. Aux bords des cheveux, utiliser l’alpha du masque v2 (dégradés de gris = semi-transparence).
> 5. Exporter PNG RGBA : `chatgpt-cheveux-v2-cutout.png`
> 6. Placer dans `staging/mini jeu/color 2/masks/laharl/`
> 7. Vérifier avec `_debug-*` : damier visible hors cheveux, cheveux identiques au portrait.

## Ce qu’il ne faut **pas** faire

- Regénérer Laharl entier avec DALL·E / Flux (« même pose ») — perte d’alignement pixel.
- Livrer un PNG recadré sur les cheveux seuls — le jeu superpose sur le portrait plein format.
- Modifier les couleurs ou le shading des cheveux dans le détourage.

## Après import manuel

```bash
npm run color-toon:build-hair-cutout   # écrase si masque + portrait présents
npm run build
```

URL jeu : `/assets/companions/laharl/mask-chatgpt-cheveux-v2-cutout.png`
