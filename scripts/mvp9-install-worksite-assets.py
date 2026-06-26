"""MVP 9 — install wide backgrounds + prestige/icon assets from generated PNGs."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'public/assets/minigames/myrion-worksite'
GEN = Path(r'C:/Users/guill/.cursor/projects/c-Dev-Project-Wonderland/assets')
VARIANTS = BASE / 'backgrounds/variants'
WIDE_W, WIDE_H = 2560, 960
WHITE_THRESH = 245


def to_wide_panoramic(src: Path, dest: Path) -> tuple[int, int]:
    im = Image.open(src).convert('RGB')
    scale = max(WIDE_W / im.width, WIDE_H / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - WIDE_W) // 2
    top = (nh - WIDE_H) // 2
    out = im.crop((left, top, left + WIDE_W, top + WIDE_H))
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, optimize=True)
    return out.size


def is_generated_bg(r: int, g: int, b: int) -> bool:
    """Strip white, black, and baked-in checkerboard from IA exports."""
    if r >= WHITE_THRESH and g >= WHITE_THRESH and b >= WHITE_THRESH:
        return True
    if r <= 28 and g <= 28 and b <= 28:
        return True
    lum = (r + g + b) / 3
    chroma = max(r, g, b) - min(r, g, b)
    if chroma <= 18:
        if 108 <= lum <= 138 or 178 <= lum <= 208:
            return True
    return False


def remove_generated_bg(im: Image.Image) -> Image.Image:
    im = im.convert('RGBA')
    pixels = list(im.getdata())
    new_pixels: list[tuple[int, int, int, int]] = []
    for r, g, b, a in pixels:
        if is_generated_bg(r, g, b):
            new_pixels.append((r, g, b, 0))
        else:
            new_pixels.append((r, g, b, a))
    im.putdata(new_pixels)
    return im


def to_icon(src: Path, dest: Path, canvas: int) -> tuple[int, int, float]:
    im = remove_generated_bg(Image.open(src))
    bbox = im.getbbox()
    if not bbox:
        raise RuntimeError(f'empty icon after bg removal: {src}')
    im = im.crop(bbox)
    max_side = int(canvas * 0.82)
    im.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    out = Image.new('RGBA', (canvas, canvas), (0, 0, 0, 0))
    x = (canvas - im.width) // 2
    y = (canvas - im.height) // 2
    out.paste(im, (x, y), im)
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, optimize=True)
    alpha = out.split()[-1]
    opaque = sum(1 for v in alpha.getdata() if v > 200)
    ratio = opaque / (canvas * canvas)
    return out.size, ratio


def backup_background(name: str) -> None:
    src = BASE / 'backgrounds' / name
    if not src.exists():
        return
    VARIANTS.mkdir(parents=True, exist_ok=True)
    stem = name.replace('.png', '')
    dest = VARIANTS / f'{stem}-old.png'
    if not dest.exists():
        shutil.copy2(src, dest)


def main() -> None:
    backs = [
        ('prairie-wide.png', 'prairie.png'),
        ('forest-wide.png', 'forest.png'),
        ('mine-wide.png', 'mine.png'),
    ]
    for gen_name, out_name in backs:
        backup_background(out_name)
        size = to_wide_panoramic(GEN / gen_name, BASE / 'backgrounds' / out_name)
        print(f'background {out_name}: {size[0]}x{size[1]}')

    faille_size, faille_opaque = to_icon(
        GEN / 'faille-astrale.png',
        BASE / 'spots/faille-astrale.png',
        1024,
    )
    print(f'faille-astrale: {faille_size[0]}x{faille_size[1]} opaque={faille_opaque:.1%}')

    crystal_size, crystal_opaque = to_icon(
        GEN / 'crystal-icon.png',
        BASE / 'icons/crystal.png',
        512,
    )
    print(f'crystal: {crystal_size[0]}x{crystal_size[1]} opaque={crystal_opaque:.1%}')


if __name__ == '__main__':
    main()
