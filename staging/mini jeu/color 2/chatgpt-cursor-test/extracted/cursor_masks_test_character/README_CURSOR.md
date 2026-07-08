# Lot de calques / masques pour Cursor

Format du lot :
- `source/original_reference.png` : image source de référence.
- `masks_black_white/` : masques binaires PNG. Blanc = partie sélectionnée. Noir = tout le reste.
- `layers_transparent/` : mêmes masques convertis en calques transparents. Blanc visible = partie sélectionnée. Alpha 0 = reste.
- `optional_previous_mask/` : masque cheveux généré juste avant, laissé à part.
- `manifest_masks.json` : correspondance nom de fichier / partie masquée.

Calques principaux :
1. `mask_01_yeux.png`
2. `mask_02_echarpe.png`
3. `mask_03_pantalon.png`
4. `mask_04_ceinture.png`
5. `mask_05_botte_gauche.png`
6. `mask_06_botte_droite.png`
7. `mask_07_accessoires_bras_gauche.png`
8. `mask_08_accessoires_bras_droit.png`
9. `mask_09_peau_visible.png`
10. `mask_10_oreilles.png`

Note technique : ces masques sont des sorties générées, binarisées ensuite en pur noir/blanc. Ils sont adaptés à un test de pipeline Cursor, pas à une intégration finale pixel-perfect sans validation d'alignement.
