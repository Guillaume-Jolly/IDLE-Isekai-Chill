# Color Toon — masques de zone (audit)

## Verdict (2026-07)

**OpenCV flood-fill / HSV sur illustrations affinity-1 : non viable en prod.**

- Éclairage, ombres, aplats proches (écharpe / pantalon / bannières rouges)
- Réglage seed par zone × personnage × pose = fragile, non reproductible
- Un bug `uint8` (mask×255) a produit des masques invisibles — preuve que la validation doit être **visuelle**, pas un compteur de pixels

## Ce qui peut marcher

| Approche | Fiabilité | Commentaire |
|----------|-----------|-------------|
| **Masque peint à la main** (Krita, Aseprite) | ★★★★★ | Référence pour sprites fixes |
| **SAM / SAM2** + 1 clic + retouche 2 min | ★★★★☆ | Meilleur semi-auto pour ce repo |
| **Crops dédiés** (PNG = la zone seule) | ★★★★★ | Pas de masque : l’asset *est* la zone |
| **Pastille + portrait fixe** (pas de teintage live) | ★★★★★ | Scope minimal, déjà OK |
| OpenCV HSV / flood-fill | ★★☆☆☆ | POC seulement, pas prod |
| **Prompt IA « calque blanc écharpe »** (DALL-E, Flux, etc.) | ★☆☆☆☆ | **Non** — regénère une image, pas un masque aligné pixel à pixel |

### Pourquoi le prompt IA « donne-moi un calque » ne marche pas

Les générateurs d’images **recréent** une scène. Ils ne renvoient pas :

- les mêmes dimensions que `affinity-1.png`
- les mêmes bords au pixel près
- une couche exploitable en `mask-image` CSS

Tu obtiens une approximation visuelle, pas un masque game-ready. Pour du **vrai** détourage texte → masque : **Grounding DINO + SAM** (local), ou peinture manuelle — pas un LLM image pur.

## Pipeline cible (quand on reprend)

```
affinity-1.png  →  SAM2 (clic zone) ou peinture  →  zone.png (blanc=#fff, reste=#000)
                 →  validation humaine (_debug-*.png)
                 →  manifest.json { zone: { approved: true, url } }
                 →  in-game mask-image (déjà câblé, gated par approved)
```

## Commandes

```bash
npm run color-toon:masks -- laharl   # génère + _debug-* (ne pas approuver sans relecture)
```

Fichiers : `staging/mini jeu/color 2/masks/{id}/`

**Aucun masque n’est actif in-game tant qu’il n’est pas listé dans `color2Masks.ts` → `APPROVED_MASKS`.**

**Debug ChatGPT (dev)** : `npm run color-toon:import-chatgpt` puis lancer le jeu avec `?colorToonDebug=1` — menu pour forcer chaque calque Laharl.
