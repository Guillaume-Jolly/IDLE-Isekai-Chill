/**
 * Prompts pour portraits intégrés (personnage + décor peints ensemble).
 * Style : IDLE Isekai Chill gacha, Talia comme ancre de rendu uniquement.
 * Pas de collage, pas de copie d'assets existants en référence visuelle.
 */

import type { DisagreaCompanionId } from './eventDisagreaPack'
import { APP_RENDER_STYLE, DISAGREA_COMPANIONS } from './eventDisagreaPack'
import { COMPANION_VISUAL_IDENTITY, type CompanionPortraitLevel } from './companionPortraitHints'

const STYLE_ANCHOR = 'public/assets/companions/talia/affinity-1.png'

const MATURE =
  'adult suggestive only, tasteful romantic NOT explicit, NO nudity, NO minors sexualized'

const LEVEL_SCENE: Record<
  CompanionPortraitLevel,
  { scene: string; character: string }
> = {
  1: {
    scene: 'welcoming workplace or first-meeting location, bright daylight, cozy isekai village fantasy',
    character: 'curious warm expression, confident standing full body, first meeting energy',
  },
  2: {
    scene: 'romantic date location, golden hour warm lights, more personal framing than level 1',
    character: 'playful shy smile, flirt gestures, stepping slightly closer to viewer',
  },
  3: {
    scene: 'private calm interior moonlit or dim elegant room, quieter intimate atmosphere',
    character: 'vulnerable calm expression, softer eye contact, leaning closer',
  },
  4: {
    scene: 'private bedroom at night candlelight warm shadows, rumpled sheets personal details',
    character: 'trusting gaze soft blush, sitting on bed edge or window seat, intimate but modest',
  },
  5: {
    scene: 'same bedroom peak bond atmosphere, rose petals moon through curtains enveloping mood',
    character:
      'peak emotional bond closest to viewer, half-lidded tender gaze, same outfit as level 1 NO new clothing layers',
  },
}

const DISAGREA_LEVEL_SCENE: Record<CompanionPortraitLevel, { scene: string; character: string }> = {
  1: {
    scene: 'character-themed cozy location first meeting (see companion notes), open composition',
    character: 'iconic base outfit level 1, confident welcoming pose full body',
  },
  2: {
    scene: 'same location family warmer evening light, closer framing',
    character: 'SAME outfit level 1 NO extra layers, flirt shy closer body language',
  },
  3: {
    scene: 'private corner moonlit quiet, more personal than level 2',
    character: 'SAME outfit level 1, vulnerable complicit gaze',
  },
  4: {
    scene: 'intimate themed bedroom with visible bed, candlelight (character-specific mood)',
    character: 'SAME outfit level 1 NO robe added, soft romantic sitting on bed tasteful',
  },
  5: {
    scene: 'same intimate bedroom peak bond lighting',
    character:
      'SAME outfit level 1 maximum trust pose, full body optional, NO new garments, masterpiece detail',
  },
}

const DISAGREA_SCENE_THEME: Record<DisagreaCompanionId, string> = {
  etna: 'gothic moonlit demon lounge or vampiric bedroom purple crimson candles',
  flonne: 'bright celestial palace terrace or angelic romantic bedroom white gold blue',
  laharl: 'gothic demon castle hall or royal gothic bedroom moon and banners',
  pleinair: 'pastel bunny cozy bedroom — L2+ backlog: parental warmth NOT adult intimacy (child character)',
}

function integratedPreamble(displayName: string): string {
  return [
    `Completely ORIGINAL unified IDLE Isekai Chill gacha mobile portrait illustration for ${displayName}.`,
    'ONE artwork painted from scratch — character and environment together, NOT collage, NOT cutout pasted.',
    `Rendering style ONLY like Talia reference: ${APP_RENDER_STYLE}`,
    'Vertical mobile portrait 3:4. No text, no watermark, no flat gray backdrop.',
    MATURE,
  ].join(' ')
}

export function villageIntegratedPortraitPrompt(
  companionId: string,
  level: CompanionPortraitLevel,
  options?: { soft?: boolean },
): string {
  const identity = COMPANION_VISUAL_IDENTITY[companionId]
  if (!identity) throw new Error(`Unknown village companion: ${companionId}`)

  const lv = LEVEL_SCENE[level]
  const soft = options?.soft ? 'SOFT modest romantic ' : ''

  return [
    integratedPreamble(identity.name),
    soft,
    `SCENE affinity ${level}: ${identity.place}, ${lv.scene}, ambiance ${identity.mood}, accent color hint ${identity.accent}.`,
    `CHARACTER: ${identity.name}, ${identity.role}, ${lv.character}.`,
    'ORIGINAL character design for this cozy isekai game — full body head to toe when possible.',
    'Natural shadow unified lighting, integrated composition.',
  ].join(' ')
}

export function disagreaIntegratedPortraitPrompt(
  companionId: DisagreaCompanionId,
  level: CompanionPortraitLevel,
  options?: { soft?: boolean; pleinairParental?: boolean },
): string {
  const c = DISAGREA_COMPANIONS[companionId]
  const lv = DISAGREA_LEVEL_SCENE[level]
  const soft = options?.soft ? 'SOFT tasteful ' : ''

  let characterNote = `Affinity ${level}: ${c.levels[level]}. ${lv.character}`
  if (companionId === 'pleinair' && level >= 2 && options?.pleinairParental) {
    characterNote =
      'Child character — warm parental bond only: shared reading, hand-holding, cozy blanket, NO romantic bedroom intimacy'
  }

  return [
    integratedPreamble(c.displayName),
    soft,
    `THEME: ${DISAGREA_SCENE_THEME[companionId]}.`,
    `SCENE: ${lv.scene}.`,
    `DNA: ${c.dna}. Palette: ${c.palette}.`,
    `OUTFIT & POSE: ${characterNote}.`,
    'Never add clothing layers across levels — same base outfit, progression via pose and proximity only.',
    'Full body when possible, natural floor or bed contact.',
  ].join(' ')
}

export const INTEGRATED_STYLE_ANCHOR = STYLE_ANCHOR

/** Compagnons village éligibles (hors event). */
export const VILLAGE_COMPANION_IDS = Object.keys(COMPANION_VISUAL_IDENTITY)

export const DISAGREA_COMPANION_IDS: DisagreaCompanionId[] = ['etna', 'flonne', 'laharl', 'pleinair']

/** Volume total si L1–5 pour tous. */
export const INTEGRATED_PORTRAIT_SCOPE = {
  disagrea: { companions: 4, levels: 5, total: 20, status: 'done-scene-originale-v1' as const },
  village: { companions: VILLAGE_COMPANION_IDS.length, levels: 5, total: VILLAGE_COMPANION_IDS.length * 5 },
  note: 'Etna L5 a une variante finale custom (tests/). Pleinair L2–5 à repenser (backlog).',
}

export function integratedOutputPath(
  pack: 'village' | 'disagrea',
  companionId: string,
  level: CompanionPortraitLevel,
  slug?: string,
): string {
  const lv = String(level).padStart(2, '0')
  const name = slug ? `affinity-${lv}-${slug}` : `affinity-${lv}-scene-originale-v1`
  if (pack === 'disagrea') {
    return `assets/Compagnons/${companionId}/affinite/affinity-${level}.png`
  }
  return `staging/companion-visual-pack/village/${companionId}/companion-${companionId}-${name}.png`
}

/** Scène intégrée peak-plus (ex-L6) — nommée affinity-04-nsfw, option NSFW requise. */
export function integratedNsfwOutputPath(companionId: DisagreaCompanionId): string {
  return `assets/Compagnons/${companionId}/NSFW/affinity-4-nsfw.png`
}
