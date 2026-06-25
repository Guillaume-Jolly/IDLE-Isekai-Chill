# Gacha Event Disagrea — frames cinéma (index snapshot)

Source : `Input chatgpt/etna_gacha_8_images_pack`

**PNG runtime** : `assets/gacha/cinema/disagrea/` (servi via `/gacha/cinema/disagrea/…`).  
Les 8 frames byte-identiques ont été archivées le 2026-06-25 →  
`old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/`.  
Ce dossier ne garde que cet index README.

| Fichier | Rôle |
|---------|------|
| `start.png` | Image de départ (invocation) |
| `intermediate.png` | Image intermédiaire (base) |
| `reveal-n.png` | Flash fin N |
| `reveal-sr.png` | Flash fin SR (et R) |
| `reveal-ssr.png` | Flash fin SSR |
| `reveal-ur.png` | Flash fin UR |
| `reveal-lr.png` | Flash fin LR |
| `reveal-multi.png` | Flash fin multi-invocation |

Import : `npm run import:disagrea-gacha-cinema`  
Vidéo (optionnel) : `npm run build:disagrea-gacha-video`

Runtime : diaporama JS dans `GachaOpening` (`variant="disagrea"`).
