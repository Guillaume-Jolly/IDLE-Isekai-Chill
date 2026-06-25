#!/usr/bin/env node
/**
 * Génère des MP4 diaporama par rareté (start → intermediate → reveal).
 * Optionnel — le jeu utilise le diaporama JS par défaut.
 *
 * Usage: node scripts/build-disagrea-gacha-video.mjs
 */
import { mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const assetsDir = path.join(root, 'assets', 'gacha', 'event', 'disagrea')
const framesDir = path.join(root, 'public', 'gacha', 'cinema', 'disagrea', 'frames')
const outDir = path.join(root, 'public', 'gacha', 'cinema', 'disagrea')

const VARIANTS = [
  { id: 'n', reveal: 'reveal-n.png' },
  { id: 'sr', reveal: 'reveal-sr.png' },
  { id: 'ssr', reveal: 'reveal-ssr.png' },
  { id: 'ur', reveal: 'reveal-ur.png' },
  { id: 'lr', reveal: 'reveal-lr.png' },
  { id: 'multi', reveal: 'reveal-multi.png' },
]

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
  console.warn(`Failed ${label}`)
  return false
}

async function buildVariant({ id, reveal }) {
  const seq = ['start.png', 'intermediate.png', reveal]
  await mkdir(framesDir, { recursive: true })
  const existing = await readdir(framesDir)
  for (const f of existing) {
    if (f.startsWith(`tmp-${id}-`)) {
      await import('node:fs/promises').then(({ unlink }) =>
        unlink(path.join(framesDir, f)).catch(() => {}),
      )
    }
  }

  let index = 0
  for (const name of seq) {
    const src = path.join(assetsDir, name)
    if (!existsSync(src)) throw new Error(`Missing ${src}`)
    const dest = path.join(framesDir, `tmp-${id}-${String(index).padStart(2, '0')}.png`)
    await import('node:fs/promises').then(({ copyFile }) => copyFile(src, dest))
    index += 1
  }

  const inputPattern = path.join(framesDir, `tmp-${id}-%02d.png`)
  const outMp4 = path.join(outDir, `opening-${id}.mp4`)

  await runFfmpeg(
    [
      '-y',
      '-framerate',
      '1.2',
      '-i',
      inputPattern,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      outMp4,
    ],
    `public/gacha/cinema/disagrea/opening-${id}.mp4`,
  )
}

if (!existsSync(path.join(assetsDir, 'start.png'))) {
  console.error('Run: node scripts/import-disagrea-gacha-cinema.mjs first')
  process.exit(1)
}

await mkdir(outDir, { recursive: true })
for (const variant of VARIANTS) {
  await buildVariant(variant)
}

console.log('Done — optional MP4 per rarity in public/gacha/cinema/disagrea/')
