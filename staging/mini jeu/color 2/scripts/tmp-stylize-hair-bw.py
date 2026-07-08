"""One-off: hair B&W, rest black, preserve white corner squares."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(
    r"C:\Users\guill\.cursor\projects\c-Dev-Project-IDLE-Isekai-Chill\assets"
    r"\c__Users_guill_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images"
    r"_base_padded_50_with_four_white_corner_squares-2e54cf8c-8667-4711-a282-aa9870bee93e.png"
)
OUT = Path(
    r"C:\Dev\Project\IDLE Isekai Chill\staging\image-exports\laharl-hair-bw-rest-black.png"
)


def corner_white_mask(arr: np.ndarray) -> np.ndarray:
    h, w = arr.shape[:2]
    white = (arr[:, :, 0] > 240) & (arr[:, :, 1] > 240) & (arr[:, :, 2] > 240)
    midy, midx = h // 2, w // 2
    out = np.zeros_like(white)
    quads = [
        (slice(0, midy), slice(0, midx)),
        (slice(0, midy), slice(midx, w)),
        (slice(midy, h), slice(0, midx)),
        (slice(midy, h), slice(midx, w)),
    ]
    for ys, xs in quads:
        region = white[ys, xs]
        out[ys, xs] = region
    return out


def head_region(h: int, w: int) -> np.ndarray:
    """Spatial prior: Laharl head + ahoge in upper center."""
    yy, xx = np.ogrid[:h, :w]
    cy, cx = h * 0.30, w * 0.50
    ry, rx = h * 0.16, w * 0.22
    ellipse = ((yy - cy) / ry) ** 2 + ((xx - cx) / rx) ** 2 <= 1.0
    # ahoge antenna strands above head
    ahoge = (yy < h * 0.20) & (yy > h * 0.05) & (np.abs(xx - cx) < w * 0.12)
    return ellipse | ahoge


def hair_mask(arr: np.ndarray, white_mask: np.ndarray) -> np.ndarray:
    h, w = arr.shape[:2]
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    region = head_region(h, w)
    # Laharl cyan hair only — tighter than background blues
    hair = (
        region
        & (b > 85)
        & (b > r + 28)
        & (g > 45)
        & (g < 230)
        & (r < 175)
    )
    hair &= (r + g + b) > 40
    hair &= ~white_mask
    return hair


def refine_hair_mask(hair: np.ndarray) -> np.ndarray:
    try:
        from scipy import ndimage
    except ImportError:
        return hair

    struct = np.ones((3, 3), dtype=bool)
    hair = ndimage.binary_closing(hair, structure=struct, iterations=3)
    hair = ndimage.binary_dilation(hair, structure=struct, iterations=1)
    h, w = hair.shape
    labeled, n = ndimage.label(hair)
    if n <= 1:
        return hair
    best = 0
    best_score = -1.0
    for lab in range(1, n + 1):
        ys, xs = np.where(labeled == lab)
        if len(ys) < 200:
            continue
        cy, cx = ys.mean(), xs.mean()
        score = len(ys) - 0.003 * abs(cy - h * 0.28) ** 2 - 0.001 * abs(cx - w * 0.5) ** 2
        if score > best_score:
            best_score = score
            best = lab
    return labeled == best if best else hair


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    arr = np.array(im, dtype=np.uint8)
    white_mask = corner_white_mask(arr)
    hair = refine_hair_mask(hair_mask(arr, white_mask))

    out = np.zeros_like(arr)
    # preserve white squares exactly
    out[white_mask] = arr[white_mask]

    # hair -> grayscale from original luminance + local contrast
    if hair.any():
        src = arr[hair].astype(np.float32)
        lum = 0.299 * src[:, 0] + 0.587 * src[:, 1] + 0.114 * src[:, 2]
        # stretch contrast for clearer B&W hair
        lo, hi = np.percentile(lum, [5, 98])
        if hi > lo:
            lum = (lum - lo) / (hi - lo) * 255.0
        lum = np.clip(lum, 0, 255).astype(np.uint8)
        out[hair, 0] = lum
        out[hair, 1] = lum
        out[hair, 2] = lum

    Image.fromarray(out, mode="RGB").save(OUT, optimize=True)
    print(f"Saved: {OUT}")
    print(f"white pixels kept: {white_mask.sum()}")
    print(f"hair pixels B&W: {hair.sum()}")
    print(f"black pixels: {(~white_mask & ~hair).sum()}")


if __name__ == "__main__":
    main()
