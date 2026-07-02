#!/usr/bin/env node
/** Prompt full-body strict pour cutouts émotion Lyra v3 + variantes intimes aff. 4–5. */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { repoRoot } from './minigame-asset-paths.mjs'

const EMOTIONS = JSON.parse(
  readFileSync(join(repoRoot, 'staging/companion-visual-pack/data/emotions.json'), 'utf8'),
).emotions

const NEW_EMOTION_IDS = [
  'focused',
  'pleased',
  'dry_amused',
  'concerned',
  'firm',
  'curious',
  'dismissive',
  'tired',
  'warm',
  'embarrassed',
]

/** Pack 1–4 aff. 4/5 — tenues intimes (≠ mage L1–3). */
export const LYRA_INTIMATE_EMOTION_IDS = ['commanding', 'heated', 'dominant', 'lustful']

const FULL_BODY_LOCK = `CRITICAL FRAMING: FULL BODY ONLY. Entire character from top of head to soles of BOTH FEET must be visible. Feet and boots fully in frame at bottom. Standing pose, legs not cropped. NOT bust, NOT waist-up, NOT three-quarter without feet. Character height ~85% of image. Flat solid #CFCFCF gray background, no scenery, no gradient.`

const LYRA_MAGE_LOCK =
  'Lyra: long wavy purple hair with gold star clips, navy hooded cloak with gold constellation embroidery, white blouse, dark corset vest, short purple star skirt, dark blue boots with gold stars, grimoire at hip, tall staff with glowing purple crystal. Same outfit as reference. Painterly gacha visual novel cutout.'

/** Tenue par pack narratif Parler aff. 4–5. */
export const LYRA_INTIMATE_OUTFIT_LOCK = {
  /** Pack 1 — bibliothèque verrou, robe de nuit. */
  commanding:
    'Lyra intimate outfit pack-1 library: long wavy purple hair with gold star clips, loose. Thin dark purple silk nightgown with gold star embroidery (bibliothèque), bare legs, no cloak, no staff, no grimoire. Simple dark slippers or barefoot. Same face and hair as reference Lyra.',
  /** Pack 2 — chambre peignoir entrouvert. */
  heated:
    'Lyra intimate outfit pack-2 chamber: long wavy purple hair with star clips, slightly tousled. Loose ivory silk peignoir open on shoulders over short purple chemise, bare thighs, no cloak, no staff. Soft indoor intimacy look. Same face as reference Lyra.',
  /** Pack 3 — lit rapproché, robe portefeuille. */
  dominant:
    'Lyra intimate outfit pack-3 bed: long wavy purple hair loose on shoulders. Dark purple wrap dress with gold constellation embroidery, modest full coverage loungewear, barefoot or soft slippers, no mage outfit, no staff. Same face as reference Lyra.',
  /** Pack 4 — aube post-intimité, robe matinale. */
  lustful:
    'Lyra intimate outfit pack-4 dawn: long wavy purple hair messy. Soft lavender silk wrap dress with gold star embroidery, elegant morning loungewear, fully clothed, no cloak staff or grimoire. Same face as reference Lyra.',
}

export function lyraOutfitLock(emotionId) {
  return LYRA_INTIMATE_OUTFIT_LOCK[emotionId] ?? LYRA_MAGE_LOCK
}

export function lyraEmotionPrompt(emotionId) {
  const emotion = EMOTIONS.find((entry) => entry.id === emotionId)
  if (!emotion) throw new Error(`Unknown emotion: ${emotionId}`)
  const outfit = lyraOutfitLock(emotionId)
  return `${FULL_BODY_LOCK} ${outfit} Expression: ${emotion.prompt}. Painterly gacha visual novel cutout.`
}

export function lyraStagingFilename(emotionId) {
  return `companion-lyra-emotion-${emotionId}-cutout-v3.png`
}

if (process.argv[2] === 'list') {
  const ids = process.argv[3] === 'intimate' ? LYRA_INTIMATE_EMOTION_IDS : NEW_EMOTION_IDS
  for (const id of ids) {
    console.log(`\n=== ${id} ===`)
    console.log(lyraEmotionPrompt(id))
    console.log(`→ staging/companion-visual-pack/village/lyra/cutouts/${lyraStagingFilename(id)}`)
  }
}
