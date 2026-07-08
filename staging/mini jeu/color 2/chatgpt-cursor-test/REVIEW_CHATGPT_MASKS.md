# Relecture — `cursor_masks_test_character` (ChatGPT)

**Staging :** `staging/mini jeu/color 2/chatgpt-cursor-test/`  
**Source zip :** `Input chatgpt/cursor_masks_test_character.zip`  
**Date :** 2026-07-06

## Verdict global

**Qualité sémantique : très bonne** — nettement au-dessus du POC OpenCV.  
**Intégration jeu : pas plug-and-play** — dimensions + alignement à valider avant `APPROVED_MASKS`.

Tu avais raison : un workflow IA **guidé** (référence + masques binaires par zone) peut produire des calques exploitables. Ma réserve portait surtout sur « une image regénérée sans alignement » ; ce lot est structuré comme de vrais masques noir/blanc.

## Contenu du lot

| Fichier | Rôle |
|---------|------|
| `source/original_reference.png` | Référence visuelle (Laharl affinity-1, quasi identique) |
| `masks_black_white/mask_*.png` | Masques binaires — **blanc = zone** |
| `layers_transparent/layer_*.png` | Même chose en RGBA (preview) |
| `optional_previous_mask/` | Cheveux (hors lot principal) |
| `manifest_masks.json` | Index parties ↔ fichiers |

**10 zones :** yeux, écharpe, pantalon, ceinture, bottes L/R, brassards L/R, peau visible, oreilles.  
**Manque pour Color Toon actuel :** cheveux (fichier optionnel séparé), pas de zone « yeux » séparée des prompts Laharl boucle etc. — mapping à faire.

## Mesures techniques

| Check | Résultat |
|-------|----------|
| Référence vs `laharl/affinity-1.png` | Même taille **1536×1024** ; ~**0,005 %** pixels différents (recompression / léger retraitement) |
| Masques binaires | **0 et 255** uniquement — OK pour `mask-image` |
| **Taille des masques** | **1448×1086** (W×H) — **≠** référence **1536×1024** |
| Écharpe (après resize nearest) | ~17 % de l’image — cohérent visuellement |
| Yeux | ~0,04 % — petites formes nettes |

## Réserves (à traiter avant prod)

1. **Alignement / dimensions** — les masques ne sont pas à la taille de l’asset jeu. Il faut soit regénérer en **1536×1024 exact**, soit pipeline de resize + **contrôle visuel** (risque de décalage aux bords).
2. **Validation humaine obligatoire** — le README du lot le dit lui-même. Script suggéré : overlay teinte + `_debug-*.png` par zone.
3. **Cheveux hors pack principal** — pour « couleur des cheveux de Laharl », intégrer `mask_00_cheveux_optionnel.png` ou refaire en masque #11.
4. **Reproductibilité** — qualité forte sur **ce** perso / **cette** pose ; pas encore prouvé en batch (Etna, Flonne, Pleinair × 5 prompts).
5. **Droits / workflow** — conserver la source exacte (`affinity-1.png` du repo) comme vérité ; masques dérivés de la même référence que le runtime.
6. **Couverture vs prompts jeu** — mapping actuel Color Toon : `laharl-scarf` → `mask_02_echarpe`, `laharl-hair` → cheveux optionnel, etc.

## Ce qui est prometteur

- Découpe **écharpe / pantalon / yeux** lisible et propre (vs flood-fill).
- Livrable **manifest + calques transparents** = bonne base pipeline Cursor.
- Compatible avec le câblage existant (`mask-image` + `APPROVED_MASKS`).

## Prochaine étape suggérée

1. Script `align-chatgpt-masks.mjs` : resize nearest → 1536×1024, export `_debug-overlay-{zone}.png` sur `affinity-1.png`.
2. Si overlay OK sur écharpe + cheveux → ajouter 2 entrées dans `APPROVED_MASKS` pour test in-game Laharl.
3. Documenter le **prompt / workflow ChatGPT** qui a produit ce lot (pour le répliquer sur les 3 autres persos).
