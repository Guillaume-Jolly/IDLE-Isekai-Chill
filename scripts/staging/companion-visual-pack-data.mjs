/** DNA cutouts émotion v3 — prompts + chemins staging. */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { companionAssetPaths, repoRoot } from '../minigame-asset-paths.mjs'

const STAGING = join(repoRoot, 'staging/companion-visual-pack')
const EMOTIONS = JSON.parse(readFileSync(join(STAGING, 'data/emotions.json'), 'utf8')).emotions

export const ALL_CUTOUT_COMPANION_IDS = [
  'lyra',
  'maeve',
  'seren',
  'nami',
  'iris',
  'kael',
  'runa',
  'solene',
  'talia',
  'mira',
  'asha',
  'elwen',
  'noa',
  'sora',
  'zelie',
  'etna',
  'flonne',
  'laharl',
  'pleinair',
]

const DISAGREA_IDS = new Set(['etna', 'flonne', 'laharl', 'pleinair'])

const IDENTITY_LOCK = {
  default:
    'CRITICAL: FULL BODY cutout only — head to feet visible, both boots in frame, not bust or waist-up. Flat solid #CFCFCF gray background only. Painterly gacha visual novel cutout. No text, no watermark.',
  lyra:
    'Lyra: long wavy purple hair with star clips, navy hooded cloak with gold constellation embroidery, white blouse, dark corset vest, short purple star-pattern skirt, dark blue boots with gold stars, leather grimoire at hip, tall staff with glowing purple crystal. FULL BODY standing, feet visible.',
}

export function cutoutStyleAnchor(companionId) {
  const aff1 = companionAssetPaths.affinite(companionId, 1)
  const neutral = companionAssetPaths.emotion(companionId, 'neutral')
  if (existsSync(neutral)) return neutral
  if (existsSync(aff1)) return aff1
  return companionAssetPaths.chibi(companionId)
}

export function cutoutOutputPath(companionId, emotionId, version = 'v3') {
  const folder = DISAGREA_IDS.has(companionId)
    ? `disagrea/${companionId}/cutouts`
    : `village/${companionId}/cutouts`
  return join('staging/companion-visual-pack', folder, `companion-${companionId}-emotion-${emotionId}-cutout-${version}.png`)
}

export function cutoutPrompt(companionId, emotionPrompt) {
  const lock = companionId === 'lyra' ? IDENTITY_LOCK.lyra : IDENTITY_LOCK.default
  return `${lock} Expression and pose mood: ${emotionPrompt}. Keep outfit unchanged from reference.`
}

export function listEmotions() {
  return EMOTIONS
}

export { EMOTIONS }
