# Gacha opening video

Replace these files with your own smooth loop (~3–4 s):

- `opening.mp4` — primary (Safari, mobile)
- `opening.webm` — optional (Chrome, Firefox)

The game tints the light overlay by rarity (single pull) or gold (multi pull).

Current build uses 6 AI keyframes via ffmpeg — it looks like a slideshow, not fluid animation.
Generate a proper clip (Runway, Kling, ComfyUI, etc.) and overwrite `opening.mp4`.

Regenerate placeholder from frames: `npm run generate:gacha-video`
