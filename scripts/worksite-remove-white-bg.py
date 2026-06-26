"""One-off: remove near-white backgrounds from worksite AI PNGs."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parents[1] / 'public/assets/minigames/myrion-worksite'
DIRS = ('spots', 'icons', 'ui', 'decorations')
THRESH = 245


def remove_white(src: Path) -> tuple[bool, str]:
    img = Image.open(src).convert('RGBA')
    pixels = list(img.getdata())
    transparent = 0
    new_pixels: list[tuple[int, int, int, int]] = []
    for r, g, b, a in pixels:
        if r >= THRESH and g >= THRESH and b >= THRESH:
            new_pixels.append((r, g, b, 0))
            transparent += 1
        else:
            new_pixels.append((r, g, b, a))
    ratio = transparent / max(len(new_pixels), 1)
    if ratio > 0.92:
        return False, f'too_much_removed({ratio:.2f})'
    img.putdata(new_pixels)
    img.save(src)
    return True, f'ok({ratio:.2f})'


def main() -> None:
    for subdir in DIRS:
        folder = BASE / subdir
        for path in sorted(folder.glob('*.png')):
            ok, msg = remove_white(path)
            status = 'OK' if ok else 'SKIP'
            print(f'{status} {subdir}/{path.name}: {msg}')


if __name__ == '__main__':
    main()
