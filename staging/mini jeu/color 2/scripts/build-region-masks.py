#!/usr/bin/env python3
"""
POC Color Toon — masques de zone (HSV + flood-fill local) pour affinity-1.
Usage: python "staging/mini jeu/color 2/scripts/build-region-masks.py" laharl
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parents[4]
STAGING_COLOR2 = REPO / "staging" / "mini jeu" / "color 2"

# h, s, v en échelle OpenCV (H: 0–180). lower/upper = np.array([h,s,v])
LAHARL_ZONES: dict[str, dict] = {
    "hair": {
        "mode": "hsv",
        "lower": (95, 50, 45),
        "upper": (128, 255, 255),
        "seeds": [(0.55, 0.10), (0.50, 0.14), (0.58, 0.12)],
    },
    "scarf": {
        "mode": "hsv",
        "lower": (0, 80, 80),
        "upper": (15, 255, 255),
        "seeds": [(0.52, 0.34), (0.45, 0.32)],
        "y_max": 0.55,
    },
    "pants": {
        "mode": "hsv_red",
        "seeds": [(0.50, 0.78), (0.45, 0.68)],
        "y_min": 0.52,
    },
    "eyes": {
        "mode": "flood",
        "seeds": [(0.50, 0.22), (0.46, 0.21), (0.54, 0.21)],
        "lo": (14, 14, 14),
        "up": (14, 14, 14),
    },
    "buckle": {
        "mode": "hsv",
        "lower": (8, 70, 140),
        "upper": (28, 255, 255),
        "seeds": [(0.54, 0.47)],
    },
}

COMPANION_CONFIG: dict[str, dict[str, dict]] = {
    "laharl": LAHARL_ZONES,
}


def character_silhouette(bgr: np.ndarray) -> np.ndarray:
    h, w = bgr.shape[:2]
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    _, bright = cv2.threshold(gray, 28, 255, cv2.THRESH_BINARY)
    # Garde la plus grande composante (personnage + décor proche)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(bright, connectivity=8)
    if n <= 1:
        return bright
    areas = stats[1:, cv2.CC_STAT_AREA]
    keep_id = 1 + int(np.argmax(areas))
    char = np.where(labels == keep_id, 255, 0).astype(np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    return cv2.morphologyEx(char, cv2.MORPH_CLOSE, kernel, iterations=2)


def seed_components(mask: np.ndarray, seeds_ratio: list[tuple[float, float]], shape: tuple[int, int]) -> np.ndarray:
    h, w = shape
    binary = (mask > 0).astype(np.uint8)
    if binary.max() == 0:
        return np.zeros_like(mask)
    _, labels, _, _ = cv2.connectedComponentsWithStats(binary, connectivity=8)
    keep = np.zeros_like(mask)
    for rx, ry in seeds_ratio:
        sx = max(0, min(w - 1, int(w * rx)))
        sy = max(0, min(h - 1, int(h * ry)))
        lid = labels[sy, sx]
        if lid > 0:
            keep[labels == lid] = 255
    return keep


def flood_zone(
    bgr: np.ndarray,
    seeds_ratio: list[tuple[float, float]],
    lo: tuple[int, int, int],
    up: tuple[int, int, int],
) -> np.ndarray:
    h, w = bgr.shape[:2]
    out = np.zeros((h, w), np.uint8)
    for rx, ry in seeds_ratio:
        x = max(0, min(w - 1, int(w * rx)))
        y = max(0, min(h - 1, int(h * ry)))
        work = bgr.copy()
        mask = np.zeros((h + 2, w + 2), np.uint8)
        cv2.floodFill(
            work,
            mask,
            (x, y),
            (255, 255, 255),
            lo,
            up,
            flags=4 | cv2.FLOODFILL_MASK_ONLY | (255 << 8),
        )
        filled = (mask[1:-1, 1:-1] > 0).astype(np.uint8) * 255
        out = np.maximum(out, filled)
    return out


def build_zone_mask(bgr: np.ndarray, cfg: dict) -> np.ndarray:
    h, w = bgr.shape[:2]
    mode = cfg.get("mode", "flood")
    if mode == "hsv":
        hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
        lower = np.array(cfg["lower"], dtype=np.uint8)
        upper = np.array(cfg["upper"], dtype=np.uint8)
        raw = cv2.inRange(hsv, lower, upper)
    elif mode == "hsv_red":
        hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
        m1 = cv2.inRange(hsv, np.array((0, 60, 40), np.uint8), np.array((15, 255, 220), np.uint8))
        m2 = cv2.inRange(hsv, np.array((160, 60, 40), np.uint8), np.array((180, 255, 220), np.uint8))
        raw = cv2.bitwise_or(m1, m2)
    else:
        raw = flood_zone(bgr, cfg["seeds"], tuple(cfg["lo"]), tuple(cfg["up"]))

    if "y_min" in cfg:
        raw[: int(h * cfg["y_min"]), :] = 0
    if "y_max" in cfg:
        raw[int(h * cfg["y_max"]) :, :] = 0

    raw = seed_components(raw, cfg["seeds"], (h, w))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    raw = cv2.morphologyEx(raw, cv2.MORPH_OPEN, kernel, iterations=1)
    raw = cv2.morphologyEx(raw, cv2.MORPH_CLOSE, kernel, iterations=1)
    return raw


def build_masks(companion_id: str) -> Path:
    zones = COMPANION_CONFIG.get(companion_id)
    if not zones:
        raise SystemExit(f"Pas de config masques pour {companion_id}")

    src = REPO / "assets" / "Compagnons" / companion_id / "affinite" / "affinity-1.png"
    bgr = cv2.imread(str(src))
    if bgr is None:
        raise SystemExit(f"Lecture impossible: {src}")

    out_dir = STAGING_COLOR2 / "masks" / companion_id
    out_dir.mkdir(parents=True, exist_ok=True)

    silhouette = character_silhouette(bgr)
    manifest: dict[str, str] = {}

    for zone_id, cfg in zones.items():
        masked = build_zone_mask(bgr, cfg)
        masked = cv2.bitwise_and(masked, silhouette)

        out_path = out_dir / f"{zone_id}.png"
        cv2.imwrite(str(out_path), masked)
        manifest[zone_id] = f"/assets/companions/{companion_id}/mask-{zone_id}.png"

        preview = bgr.copy()
        tint = np.zeros_like(bgr)
        tint[:, :] = (0, 220, 80)
        m3 = cv2.merge([masked, masked, masked]).astype(np.float32) / 255.0
        preview = (preview.astype(np.float32) * (1 - m3 * 0.7) + tint.astype(np.float32) * m3 * 0.7).astype(
            np.uint8
        )
        cv2.imwrite(str(out_dir / f"_preview-{zone_id}.png"), preview)

        # Masque blanc sur fond gris — lisible à l'oeil nu
        vis = np.full((bgr.shape[0], bgr.shape[1]), 32, np.uint8)
        vis[masked > 127] = 255
        cv2.imwrite(str(out_dir / f"_debug-{zone_id}.png"), vis)

    manifest_path = out_dir / "manifest.json"
    entries: dict[str, dict] = {}
    total = bgr.shape[0] * bgr.shape[1]
    for z, url in manifest.items():
        m = cv2.imread(str(out_dir / f"{z}.png"), 0)
        white = int((m > 127).sum()) if m is not None else 0
        pct = round(100 * white / total, 3)
        entries[z] = {
            "url": url,
            "whitePx": white,
            "coveragePct": pct,
            "approved": False,
            "note": "Valider visuellement _debug-{zone}.png puis APPROVED_MASKS dans color2Masks.ts",
        }
    manifest_path.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    print(f"[color-toon] {companion_id}: {len(entries)} masques -> {out_dir}")
    for z, meta in entries.items():
        print(f"  {z}: {meta['whitePx']} px ({meta['coveragePct']}%)  NOT APPROVED")
    return out_dir


def main() -> None:
    companion = sys.argv[1] if len(sys.argv) > 1 else "laharl"
    build_masks(companion)


if __name__ == "__main__":
    main()
