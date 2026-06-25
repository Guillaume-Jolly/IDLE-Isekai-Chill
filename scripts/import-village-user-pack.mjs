/**
 * Importe le panorama + spritesheet utilisateur.
 * Usage:
 *   npm run import:village -- [panorama.png] [spritesheet.png] [scale]
 *   npm run import:village -- [panorama.png] --pano-only
 *
 * Met à jour src/data/villageMap.ts (dimensions + positions des pancartes).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { pipelineReferencesRoot } from './minigame-asset-paths.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const villageLayoutDir = join(pipelineReferencesRoot, 'village-layout')
  'C:/Users/guill/.cursor/projects/c-Dev-Project-IDLE-Isekai-Chill/assets'
const defaultPano = join(
  assetsDir,
  'c__Users_guill_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Campement-e254bad4-2595-45a4-a4ad-7e64688c2864.png',
)
const defaultSheet = join(
  assetsDir,
  'c__Users_guill_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_sprite_b_timents-592145b2-3162-4938-a824-bf656b0841c4.png',
)

const args = process.argv.slice(2)
const panoOnly = args.includes('--pano-only')
const scaleFlagIndex = args.indexOf('--scale')
const scaleFromFlag = scaleFlagIndex >= 0 ? Number(args[scaleFlagIndex + 1]) : null
const positional = args.filter(
  (a, i) => !a.startsWith('--') && i !== scaleFlagIndex + 1,
)
const panoInput = positional[0] ?? defaultPano
const sheetInput = positional[1] ?? defaultSheet
const scaleArg = scaleFromFlag ?? positional[2] ?? null

/** Référence calibrée sur le Campement 1024×341 */
const REF_WIDTH = 1024
const REF_HEIGHT = 341
const REF_SLOTS = [
  { id: 'inn', centerX: 98, unlockStage: 0, labelYPercent: 8 },
  { id: 'arcane-library', centerX: 215, unlockStage: 2, labelYPercent: 26 },
  { id: 'mist-garden', centerX: 348, unlockStage: 0, labelYPercent: 14 },
  { id: 'traveler-theater', centerX: 508, unlockStage: 3, labelYPercent: 30 },
  { id: 'ribbon-workshop', centerX: 618, unlockStage: 1, labelYPercent: 10 },
  { id: 'clear-spring', centerX: 742, unlockStage: 1, labelYPercent: 8 },
  { id: 'star-market', centerX: 828, unlockStage: 4, labelYPercent: 34 },
  { id: 'moon-farm', centerX: 938, unlockStage: 2, labelYPercent: 10 },
]

/** Grille 4×2 — ordre gauche→droite, haut→bas */
const SPRITE_ORDER = [
  'inn',
  'mist-garden',
  'ribbon-workshop',
  'clear-spring',
  'moon-farm',
  'arcane-library',
  'traveler-theater',
  'star-market',
]

const BUILDING_UNLOCK_STAGE = {
  inn: 0,
  'mist-garden': 0,
  'ribbon-workshop': 1,
  'clear-spring': 1,
  'moon-farm': 2,
  'arcane-library': 2,
  'traveler-theater': 3,
  'star-market': 4,
}

const BUILDING_MAP_HINTS = {
  inn: 'Service express auberge',
  'mist-garden': 'Recolte brumeuse',
  'ribbon-workshop': 'Fil d or et soie',
  'clear-spring': 'Bulles de source',
  'moon-farm': 'Graines lunaires',
  'arcane-library': 'Grimoire cache et mana',
  'traveler-theater': 'Concert au theatre',
  'star-market': 'Bazar des etoiles',
}

const outPano = join(root, 'public', 'village', 'panorama-base.webp')
const outDir = join(root, 'public', 'village', 'buildings-map')
mkdirSync(outDir, { recursive: true })
mkdirSync(villageLayoutDir, { recursive: true })

const panoMeta = await sharp(panoInput).metadata()
const panoW = panoMeta.width
const panoH = panoMeta.height

const explicitScale = scaleArg ? Number(scaleArg) : null
const slotScale = explicitScale ?? panoW / REF_WIDTH
const outputW = explicitScale ? Math.round(panoW * explicitScale) : panoW
const outputH = explicitScale ? Math.round(panoH * explicitScale) : panoH

const panoPipeline = sharp(panoInput)
if (explicitScale && explicitScale !== 1) {
  await panoPipeline
    .resize(outputW, outputH, { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 85, effort: 6 })
    .toFile(outPano)
} else {
  await panoPipeline.webp({ quality: 85, effort: 6 }).toFile(outPano)
}

if (!panoOnly) {
  const sheetMeta = await sharp(sheetInput).metadata()
  const cols = 4
  const rows = 2
  const cellW = Math.floor(sheetMeta.width / cols)
  const cellH = Math.floor(sheetMeta.height / rows)
  const spriteScale = explicitScale ?? sheetMeta.width / REF_WIDTH

  for (let i = 0; i < SPRITE_ORDER.length; i += 1) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const id = SPRITE_ORDER[i]
    const left = col * cellW
    const top = row * cellH
    const raw = await sharp(sheetInput)
      .extract({ left, top, width: cellW, height: cellH })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const { data, info } = raw
    let minX = info.width
    let minY = info.height
    let maxX = 0
    let maxY = 0
    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        const a = data[(y * info.width + x) * 4 + 3]
        if (a > 12) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }

    const pad = 4
    const trimLeft = Math.max(0, minX - pad)
    const trimTop = Math.max(0, minY - pad)
    const trimW = Math.min(info.width - trimLeft, maxX - minX + 1 + pad * 2)
    const trimH = Math.min(info.height - trimTop, maxY - minY + 1 + pad * 2)

    let sprite = sharp(sheetInput).extract({
      left: left + trimLeft,
      top: top + trimTop,
      width: trimW,
      height: trimH,
    })

    if (spriteScale > 1.01) {
      const targetW = Math.round(trimW * spriteScale)
      const targetH = Math.round(trimH * spriteScale)
      sprite = sprite.resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
    }

    await sprite.png().toFile(join(outDir, `${id}.png`))
  }
}

const scaledSlots = REF_SLOTS.map((slot) => ({
  ...slot,
  centerX: Math.round(slot.centerX * slotScale),
}))

const unlockLiteral = SPRITE_ORDER.map(
  (id) => `  '${id}': ${BUILDING_UNLOCK_STAGE[id]},`,
).join('\n')
const slotsLiteral = scaledSlots
  .map(
    (s) =>
      `  { id: '${s.id}', centerX: ${s.centerX}, unlockStage: ${s.unlockStage}, labelYPercent: ${s.labelYPercent} },`,
  )
  .join('\n')
const hintsLiteral = SPRITE_ORDER.map(
  (id) => `  '${id}': '${BUILDING_MAP_HINTS[id]}',`,
).join('\n')

const villageMapTs = `/** Panorama utilisateur — Campement (${outputW}×${outputH}, image native) */
export const PANORAMA_WIDTH = ${outputW}
export const PANORAMA_HEIGHT = ${outputH}

export const PANORAMA_BASE_ASSET = '/village/panorama-base.webp'

export const BUILDING_SLOT_ORDER = [
${SPRITE_ORDER.map((id) => `  '${id}',`).join('\n')}
] as const

export const BUILDING_UNLOCK_STAGE: Record<string, number> = {
${unlockLiteral}
}

/** Positions des pancartes sur le panorama Campement. */
export const BUILDING_SLOTS = [
${slotsLiteral}
] as const

export type BuildingMapSlot = (typeof BUILDING_SLOTS)[number]

export const buildingLevelTier = (level: number) => {
  if (level >= 7) return 3
  if (level >= 4) return 2
  return 1
}

export const getPanoramaFocusPercent = (stage: number) => {
  let lastSlot: BuildingMapSlot = BUILDING_SLOTS[0]
  for (const slot of BUILDING_SLOTS) {
    if (stage >= slot.unlockStage) lastSlot = slot
  }
  return (lastSlot.centerX / PANORAMA_WIDTH) * 100
}

export const panoramaStageAsset = (_stage: number) => PANORAMA_BASE_ASSET

export const panoramaLegacyAsset = '/village/panorama-v1.png'

export const BUILDING_MAP_HINTS: Record<string, string> = {
${hintsLiteral}
}

export const MAP_LABEL_SPOTS = BUILDING_SLOTS.map((slot) => ({
  id: \`map-\${slot.id}\`,
  buildingId: slot.id,
  x: (slot.centerX / PANORAMA_WIDTH) * 100,
  y: slot.labelYPercent,
  hint: BUILDING_MAP_HINTS[slot.id] ?? '',
  targetView: 'miniGames' as const,
}))
`

writeFileSync(join(root, 'src', 'data', 'villageMap.ts'), villageMapTs)

writeFileSync(
  join(villageLayoutDir, 'user-pack-meta.json'),
  JSON.stringify(
    {
      sourcePano: { width: panoW, height: panoH, path: panoInput },
      outputPano: { width: outputW, height: outputH, scale: slotScale },
      spriteOrder: SPRITE_ORDER,
      panoOnly,
    },
    null,
    2,
  ),
)

console.log(`Panorama: ${outPano} (${outputW}×${outputH}, scale ×${slotScale.toFixed(2)})`)
console.log(`Synced: src/data/villageMap.ts`)
if (!panoOnly) {
  console.log(`Sprites: ${outDir}`)
}
