#!/usr/bin/env python3
"""Importe le masque cheveux v2 (niveaux de gris) aligné sur affinity-1.png."""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parents[4]
STAGING_COLOR2 = REPO / "staging" / "mini jeu" / "color 2"
SRC = REPO / "Input chatgpt/cursor_masks_test_character/hair_v2.png"
GAME_REF = REPO / "assets/Compagnons/laharl/affinite/affinity-1.png"
OUT_DIR = STAGING_COLOR2 / "masks/laharl"
OUT_NAME = "chatgpt-cheveux-v2.png"


def to_grayscale(img: np.ndarray) -> np.ndarray:
    if img.ndim == 2:
        return img
    if img.shape[2] == 4:
        bgr = img[:, :, :3]
        alpha = img[:, :, 3]
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        return np.where(alpha > 0, gray, 0).astype(np.uint8)
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Masque source introuvable: {SRC}")
    ref = cv2.imread(str(GAME_REF))
    if ref is None:
        raise SystemExit(f"Référence jeu introuvable: {GAME_REF}")
    target_h, target_w = ref.shape[:2]

    raw = cv2.imread(str(SRC), cv2.IMREAD_UNCHANGED)
    if raw is None:
        raise SystemExit(f"Lecture impossible: {SRC}")
    gray = to_grayscale(raw)
    if gray.shape[:2] != (target_h, target_w):
        gray = cv2.resize(gray, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / OUT_NAME
    cv2.imwrite(str(out_path), gray)

    white = int((gray > 0).sum())
    unique = int(len(np.unique(gray[gray > 0]))) if white else 0
    preview = ref.copy().astype(np.float32)
    tint = np.zeros_like(ref, dtype=np.float32)
    tint[:, :] = (80, 220, 0)
    m = gray[:, :, None] / 255.0
    debug = (preview * (1 - m * 0.55) + tint * m * 0.55).astype(np.uint8)
    cv2.imwrite(str(OUT_DIR / "_debug-chatgpt-cheveux-v2.png"), debug)

    manifest = {
        "chatgpt-cheveux-v2": {
            "url": "/assets/companions/laharl/mask-chatgpt-cheveux-v2.png",
            "source": str(SRC.relative_to(REPO)),
            "size": [target_w, target_h],
            "nonZeroPx": white,
            "grayLevels": unique,
            "coveragePct": round(100 * white / (target_w * target_h), 3),
        }
    }
    (OUT_DIR / "chatgpt-cheveux-v2.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"OK {OUT_NAME}: {target_w}x{target_h}, {unique} niveaux de gris, {manifest['chatgpt-cheveux-v2']['coveragePct']}% couverture")
    print(f"-> {out_path}")
    print("Puis : npm run color-toon:build-hair-cutout")


if __name__ == "__main__":
    main()
