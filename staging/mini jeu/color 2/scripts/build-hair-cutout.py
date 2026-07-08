#!/usr/bin/env python3
"""Extrait les cheveux du portrait en PNG RGBA (fond transparent, même taille que affinity-1).

Utilise le masque niveaux de gris v2 + les pixels du portrait — pas de regénération IA.
Équivalent déterministe du brief « détourer les cheveux sans les modifier ».

Usage:
  python "staging/mini jeu/color 2/scripts/build-hair-cutout.py"
  npm run color-toon:build-hair-cutout
"""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parents[4]
STAGING_COLOR2 = REPO / "staging" / "mini jeu" / "color 2"
PORTRAIT = REPO / "assets/Compagnons/laharl/affinite/affinity-1.png"
MASK = STAGING_COLOR2 / "masks/laharl/chatgpt-cheveux-v2.png"
OUT_DIR = STAGING_COLOR2 / "masks/laharl"
OUT_NAME = "chatgpt-cheveux-v2-cutout.png"
ALPHA_THRESHOLD = 8


def main() -> None:
    if not PORTRAIT.is_file():
        raise SystemExit(f"Portrait introuvable: {PORTRAIT}")
    if not MASK.is_file():
        raise SystemExit(f"Masque introuvable: {MASK} — lancez npm run color-toon:import-hair-v2")

    portrait_bgr = cv2.imread(str(PORTRAIT))
    mask_gray = cv2.imread(str(MASK), cv2.IMREAD_GRAYSCALE)
    if portrait_bgr is None or mask_gray is None:
        raise SystemExit("Lecture PNG impossible")

    h, w = portrait_bgr.shape[:2]
    if mask_gray.shape[:2] != (h, w):
        mask_gray = cv2.resize(mask_gray, (w, h), interpolation=cv2.INTER_LANCZOS4)

    b, g, r = cv2.split(portrait_bgr)
    alpha = mask_gray.copy()
    alpha[alpha < ALPHA_THRESHOLD] = 0

    rgba = cv2.merge([b, g, r, alpha])
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / OUT_NAME
    cv2.imwrite(str(out_path), rgba)

    visible = int((alpha > 0).sum())
    checker = np.zeros((h, w, 3), dtype=np.uint8)
    checker[::16, ::16] = (40, 40, 40)
    checker[::16, 1::16] = (55, 55, 55)
    checker[1::16, ::16] = (55, 55, 55)
    checker[1::16, 1::16] = (40, 40, 40)
    preview = checker.astype(np.float32)
    hair = rgba[:, :, :3].astype(np.float32)
    a = alpha[:, :, None].astype(np.float32) / 255.0
    debug = (preview * (1 - a) + hair * a).astype(np.uint8)
    cv2.imwrite(str(OUT_DIR / "_debug-chatgpt-cheveux-v2-cutout.png"), debug)

    manifest = {
        "chatgpt-cheveux-v2-cutout": {
            "url": "/assets/companions/laharl/mask-chatgpt-cheveux-v2-cutout.png",
            "sourcePortrait": str(PORTRAIT.relative_to(REPO)),
            "sourceMask": str(MASK.relative_to(REPO)),
            "size": [w, h],
            "nonZeroPx": visible,
            "coveragePct": round(100 * visible / (w * h), 3),
        }
    }
    manifest_path = OUT_DIR / "chatgpt-cheveux-v2-cutout.json"
    existing: dict = {}
    if manifest_path.is_file():
        existing = json.loads(manifest_path.read_text(encoding="utf-8"))
    existing.update(manifest)
    manifest_path.write_text(json.dumps(existing, indent=2), encoding="utf-8")

    print(f"OK {OUT_NAME}: {w}x{h}, {visible} px cheveux ({manifest['chatgpt-cheveux-v2-cutout']['coveragePct']}%)")
    print(f"-> {out_path}")


if __name__ == "__main__":
    main()
