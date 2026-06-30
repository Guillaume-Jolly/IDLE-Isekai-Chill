import { conversationSceneBackgroundUrl } from '../companionConversationVisuals'
import { emotionFromConversationBeat } from '../companionConversationVisuals'
import type { CompanionEmotionId } from '../companionAssets'
import { publicAssetUrl } from '../publicAssetUrl'
import type { DialogueTone } from '../conversations/types'
import type {
  SceneBackground,
  SceneBeat,
  SceneBeatFx,
  SceneChapter,
  SceneExchange,
  SceneMood,
  SceneRuntimeBeat,
} from './types'

const BIOME_BG_VARIANTS = {
  'capture-portrait': 'capture-portrait.png',
  'dressage-portrait': 'dressage-portrait.png',
  'capture-wide': 'capture-wide.png',
} as const

export function resolveSceneBackground(background: SceneBackground): string | undefined {
  switch (background.kind) {
    case 'building':
      return conversationSceneBackgroundUrl(background.buildingId)
    case 'place':
      return conversationSceneBackgroundUrl(undefined, background.place)
    case 'biome': {
      const file = BIOME_BG_VARIANTS[background.variant ?? 'capture-portrait']
      return publicAssetUrl(`assets/Background/${background.biomeId}/${file}`)
    }
    case 'asset':
      return publicAssetUrl(background.path.startsWith('assets/') ? background.path : `assets/${background.path}`)
    default:
      return undefined
  }
}

export function resolveBeatEmotion(params: {
  beat: SceneBeat
  affinity?: number
  tone?: DialogueTone
  success?: boolean
  roundIndex?: number
}): CompanionEmotionId {
  const { beat, affinity = 2, tone, success = true, roundIndex = 0 } = params

  if (beat.mood) return mapSceneMood(beat.mood, { affinity, success })

  if (tone !== undefined) {
    return emotionFromConversationBeat({
      tone,
      affinity,
      success,
      roundIndex,
    })
  }

  return 'neutral'
}

function mapSceneMood(
  mood: SceneMood,
  params: { affinity: number; success: boolean },
): CompanionEmotionId {
  if (mood === 'sincere') return params.success ? 'happy' : 'neutral'
  if (mood === 'direct') return params.success ? 'neutral' : 'annoyed'
  return mood
}

export function resolveBeatFx(fx: SceneBeatFx | undefined): string {
  switch (fx) {
    case 'success':
      return 'mg-conversation-viewport--success mg-conversation-viewport--t1'
    case 'fail':
      return 'mg-conversation-viewport--fail mg-conversation-viewport--t1'
    case 'emphasis':
      return 'mg-conversation-portrait--success mg-conversation-portrait--t1'
    case 'soft-enter':
      return 'mg-conversation-viewport--soft-enter'
    case 'none':
    default:
      return ''
  }
}

export function resolveExchangeBeats(
  exchange: SceneExchange,
  chapter: SceneChapter,
): SceneRuntimeBeat[] {
  const defaultBg = resolveSceneBackground(chapter.background)

  if (exchange.kind === 'sequence') {
    return exchange.beats.map((beat) => toRuntimeBeat(beat, chapter, defaultBg))
  }

  const beats: SceneRuntimeBeat[] = []
  for (const ctx of exchange.context) {
    beats.push(toRuntimeBeat(ctx, chapter, defaultBg))
  }
  beats.push(
    toRuntimeBeat(exchange.prompt, chapter, defaultBg, {
      tone: exchange.toneHint,
    }),
  )
  return beats
}

function toRuntimeBeat(
  beat: SceneBeat,
  _chapter: SceneChapter,
  defaultBg: string | undefined,
  options?: { tone?: DialogueTone; success?: boolean; roundIndex?: number; affinity?: number },
): SceneRuntimeBeat {
  const bg = beat.background
    ? resolveSceneBackground(beat.background)
    : defaultBg

  return {
    beat,
    emotion: resolveBeatEmotion({
      beat,
      affinity: options?.affinity,
      tone: options?.tone,
      success: options?.success,
      roundIndex: options?.roundIndex,
    }),
    backgroundUrl: bg,
    fxClass: resolveBeatFx(beat.fx),
  }
}

export function resolveSceneBeat(
  beat: SceneBeat,
  chapter: SceneChapter,
  options?: { tone?: DialogueTone; success?: boolean; roundIndex?: number; affinity?: number },
): SceneRuntimeBeat {
  const defaultBg = resolveSceneBackground(chapter.background)
  return toRuntimeBeat(beat, chapter, defaultBg, options)
}

export function validateSceneChapter(chapter: SceneChapter): string[] {
  const errors: string[] = []

  if (chapter.schemaVersion !== 1) {
    errors.push(`schemaVersion must be 1 (got ${chapter.schemaVersion})`)
  }

  if (chapter.exchanges.length < 1 || chapter.exchanges.length > 10) {
    errors.push(`exchanges must be 1–10 (got ${chapter.exchanges.length})`)
  }

  for (const exchange of chapter.exchanges) {
    if (exchange.kind === 'dialogue' && exchange.choices.length !== 4) {
      errors.push(`${exchange.id}: dialogue requires exactly 4 choices`)
    }
    if (exchange.kind === 'sequence' && exchange.beats.length === 0) {
      errors.push(`${exchange.id}: sequence requires at least one beat`)
    }
  }

  return errors
}
