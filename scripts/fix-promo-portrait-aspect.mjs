#!/usr/bin/env node
/**
 * Recadre une bannière promo portrait (bandes noires) → 9:16 plein écran.
 * Usage: node scripts/fix-promo-portrait-aspect.mjs <input.png> <output.png> [width] [height]
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const [, , input, output, w = '1080', h = '1920'] = process.argv
if (!input || !output) {
  console.error('Usage: node scripts/fix-promo-portrait-aspect.mjs <input.png> <output.png> [width] [height]')
  process.exit(1)
}

const py = `
from PIL import Image
import sys

src, dst, tw, th = sys.argv[1:5]
tw, th = int(tw), int(th)
im = Image.open(src).convert("RGB")
px = im.load()
w, h = im.size

def row_is_dark(y, threshold=18):
    dark = 0
    for x in range(w):
        r, g, b = px[x, y]
        if r <= threshold and g <= threshold and b <= threshold:
            dark += 1
    return dark / w > 0.92

top = 0
while top < h and row_is_dark(top):
    top += 1
bottom = h - 1
while bottom > top and row_is_dark(bottom):
    bottom -= 1

def col_is_dark(x, threshold=18):
    dark = 0
    for y in range(top, bottom + 1):
        r, g, b = px[x, y]
        if r <= threshold and g <= threshold and b <= threshold:
            dark += 1
    return dark / (bottom - top + 1) > 0.92

left = 0
while left < w and col_is_dark(left):
    left += 1
right = w - 1
while right > left and col_is_dark(right):
    right -= 1

cropped = im.crop((left, top, right + 1, bottom + 1))
cw, ch = cropped.size
scale = tw / cw
nh = int(ch * scale)
resized = cropped.resize((tw, nh), Image.LANCZOS)

# Sample edge color for padding
edge = cropped.getpixel((cw // 2, ch - 1))
canvas = Image.new("RGB", (tw, th), edge)

if nh >= th:
    y0 = (nh - th) // 2
    canvas.paste(resized.crop((0, y0, tw, y0 + th)), (0, 0))
else:
    y0 = (th - nh) // 2
    canvas.paste(resized, (0, y0))

canvas.save(dst, optimize=True)
print(f"trim ({left},{top})-({right},{bottom}) -> {tw}x{th} from {w}x{h}")
`

const r = spawnSync('python', ['-c', py, input, output, w, h], { encoding: 'utf8' })
if (r.stdout) process.stdout.write(r.stdout)
if (r.stderr) process.stderr.write(r.stderr)
process.exit(r.status ?? 1)
