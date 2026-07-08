#!/usr/bin/env python3
"""Aligne les masques ChatGPT (staging) vers staging/mini jeu/color 2/masks/laharl/."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parents[4]
STAGING_COLOR2 = REPO / "staging" / "mini jeu" / "color 2"
STAGING = STAGING_COLOR2 / "chatgpt-cursor-test/extracted/cursor_masks_test_character"
GAME_REF = REPO / "assets/Compagnons/laharl/affinite/affinity-1.png"
OUT_DIR = STAGING_COLOR2 / "masks/laharl"

IMPORTS: list[tuple[str, str]] = [
    ("optional_previous_mask/mask_00_cheveux_optionnel.png", "chatgpt-cheveux"),
    ("masks_black_white/mask_01_yeux.png", "chatgpt-yeux"),
    ("masks_black_white/mask_02_echarpe.png", "chatgpt-echarpe"),
    ("masks_black_white/mask_03_pantalon.png", "chatgpt-pantalon"),
    ("masks_black_white/mask_04_ceinture.png", "chatgpt-ceinture"),
    ("masks_black_white/mask_05_botte_gauche.png", "chatgpt-botte-gauche"),
    ("masks_black_white/mask_06_botte_droite.png", "chatgpt-botte-droite"),
    ("masks_black_white/mask_07_accessoires_bras_gauche.png", "chatgpt-bras-gauche"),
    ("masks_black_white/mask_08_accessoires_bras_droit.png", "chatgpt-bras-droit"),
    ("masks_black_white/mask_09_peau_visible.png", "chatgpt-peau"),
    ("masks_black_white/mask_10_oreilles.png", "chatgpt-oreilles"),
]


def align_mask(src_path: Path, target_w: int, target_h: int) -> np.ndarray:
    raw = cv2.imread(str(src_path), cv2.IMREAD_GRAYSCALE)
    if raw is None:
        raise SystemExit(f"Lecture impossible: {src_path}")
    resized = cv2.resize(raw, (target_w, target_h), interpolation=cv2.INTER_NEAREST)
    return np.where(resized > 127, 255, 0).astype(np.uint8)


def main() -> None:
    if not STAGING.is_dir():
        raise SystemExit(f"Staging introuvable: {STAGING}")
    ref = cv2.imread(str(GAME_REF))
    if ref is None:
        raise SystemExit(f"Référence jeu introuvable: {GAME_REF}")
    h, w = ref.shape[:2]
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}
    for rel, zone_id in IMPORTS:
        src = STAGING / rel
        if not src.is_file():
            print(f"SKIP missing {rel}")
            continue
        aligned = align_mask(src, w, h)
        out_name = f"{zone_id}.png"
        out_path = OUT_DIR / out_name
        cv2.imwrite(str(out_path), aligned)
        white = int((aligned > 127).sum())
        url = f"/assets/companions/laharl/mask-{zone_id}.png"
        overlay = ref.copy().astype(np.float32)
        tint = np.zeros_like(ref, dtype=np.float32)
        tint[:, :] = (80, 220, 0)
        m = aligned[:, :, None] / 255.0
        preview = (overlay * (1 - m * 0.65) + tint * m * 0.65).astype(np.uint8)
        cv2.imwrite(str(OUT_DIR / f"_debug-{zone_id}.png"), preview)
        manifest[zone_id] = {
            "url": url,
            "source": rel,
            "whitePx": white,
            "coveragePct": round(100 * white / (w * h), 3),
        }
        print(f"OK {zone_id}: {white} px ({manifest[zone_id]['coveragePct']}%)")
    (OUT_DIR / "chatgpt-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"-> {OUT_DIR} ({len(manifest)} masques)")


if __name__ == "__main__":
    main()
