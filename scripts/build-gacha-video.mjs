import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

const root = process.cwd()
const gachaDir = path.join(root, 'assets', 'Gacha', 'cinema')
const framesDir = path.join(gachaDir, 'frames')
const outDir = gachaDir
const assetsDir = path.join(root, 'assets', 'Gacha', 'sources', 'frames')

const frameSources = [
  path.join(outDir, 'hostess-intro.png'),
  path.join(assetsDir, 'frame-01.png'),
  path.join(assetsDir, 'frame-03.png'),
  path.join(outDir, 'hostess-opening.png'),
  path.join(assetsDir, 'frame-05.png'),
  path.join(outDir, 'reveal-burst.png'),
]

async function normalizeFrames() {
  await mkdir(framesDir, { recursive: true })
  let index = 0
  for (const source of frameSources) {
    if (!existsSync(source)) {
      throw new Error(`Missing gacha frame: ${source}`)
    }
    const target = path.join(framesDir, `frame-${String(index).padStart(2, '0')}.png`)
    await sharp(source)
      .resize(720, 960, { fit: 'cover' })
      .png({ compressionLevel: 8 })
      .toFile(target)
    index += 1
  }
}

async function runFfmpeg(args, label) {
  let ffmpegPath = 'ffmpeg'
  try {
    const mod = await import('ffmpeg-static')
    ffmpegPath = mod.default ?? mod
  } catch {
    console.warn(`ffmpeg-static unavailable, skipping ${label}`)
    return false
  }

  const result = spawnSync(ffmpegPath, args, { stdio: 'inherit' })
  if (result.status === 0) {
    console.log(`Created ${label}`)
    return true
  }
  console.warn(`Failed to create ${label}`)
  return false
}

await mkdir(assetsDir, { recursive: true })
await normalizeFrames()

const inputPattern = path.join(framesDir, 'frame-%02d.png')

await runFfmpeg(
  [
    '-y',
    '-framerate',
    '1.6',
    '-i',
    inputPattern,
    '-c:v',
    'libvpx-vp9',
    '-pix_fmt',
    'yuv420p',
    '-auto-alt-ref',
    '0',
    path.join(outDir, 'opening.webm'),
  ],
  'assets/Gacha/cinema/opening.webm',
)

await runFfmpeg(
  [
    '-y',
    '-framerate',
    '1.6',
    '-i',
    inputPattern,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    path.join(outDir, 'opening.mp4'),
  ],
  'assets/Gacha/cinema/opening.mp4',
)

await runFfmpeg(
  [
    '-y',
    '-framerate',
    '1.6',
    '-i',
    inputPattern,
    '-c:v',
    'libwebp',
    '-loop',
    '0',
    '-quality',
    '86',
    path.join(outDir, 'opening.webp'),
  ],
  'assets/Gacha/cinema/opening.webp',
)
