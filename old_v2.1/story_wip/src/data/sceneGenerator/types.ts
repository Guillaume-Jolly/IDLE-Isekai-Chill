import type { CompanionEmotionId } from '../companionAssets'
import type { DialogueTone } from '../conversations/types'

export const SCENE_CHAPTER_KINDS = ['story', 'disagrea', 'liens', 'liens-readonly'] as const
export type SceneChapterKind = (typeof SCENE_CHAPTER_KINDS)[number]

export const SCENE_BEAT_FX = ['none', 'success', 'fail', 'emphasis', 'soft-enter'] as const
export type SceneBeatFx = (typeof SCENE_BEAT_FX)[number]

export type SceneMood = CompanionEmotionId | 'sincere' | 'direct'

export type SceneBackground =
  | { kind: 'building'; buildingId: string }
  | { kind: 'place'; place: string }
  | {
      kind: 'biome'
      biomeId: string
      variant?: 'capture-portrait' | 'dressage-portrait' | 'capture-wide'
    }
  | { kind: 'asset'; path: string }

export type SceneBeat = {
  id: string
  speaker: 'companion' | 'player' | 'narrator'
  characterId?: string
  mood?: SceneMood
  text: string
  background?: SceneBackground
  fx?: SceneBeatFx
  dwellMs?: number
}

export type SceneChoice = {
  id: string
  text: string
  tone: DialogueTone
  score: 0 | 1
  reaction: SceneBeat
}

export type SceneExchange =
  | {
      kind: 'dialogue'
      id: string
      context: SceneBeat[]
      prompt: SceneBeat
      choices: [SceneChoice, SceneChoice, SceneChoice, SceneChoice]
      toneHint?: DialogueTone
    }
  | {
      kind: 'sequence'
      id: string
      beats: SceneBeat[]
    }

export type SceneChapter = {
  schemaVersion: 1
  id: string
  kind: SceneChapterKind
  title: string
  subtitle?: string
  companionId: string
  minAffinity?: number
  maxAffinity?: number
  background: SceneBackground
  exchanges: SceneExchange[]
  tags?: string[]
  locale?: 'fr'
}

export type SceneRuntimeBeat = {
  beat: SceneBeat
  emotion: CompanionEmotionId
  backgroundUrl?: string
  fxClass: string
}
