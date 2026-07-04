import type { CharacterSheet, DetectedCombo, FinalVerdict, RunState, StatRoast } from '../../data/destinyWheel/types'

export type HavreGameModeId = 'hardcore' | 'auto_roll' | 'artist'

export type HavreArchiveBucket = HavreGameModeId

export type HavreGameModeDef = {
  label: string
  subtitle: string
  auto_advance: boolean
  jokers_allowed: boolean
  rerolls_allowed: boolean
  locks_allowed: boolean
  max_jokers_per_run?: number
  max_rerolls_per_wheel?: number
  reward_multiplier: number
  rare_reward_multiplier?: number
  card_badge: string
  archive_bucket: HavreArchiveBucket
  archive_prestige?: number
}

export type HavreJokerDef = {
  label: string
  effect: string
}

export type HavreArchiveRules = {
  auto_save: boolean
  max_cards_per_mode: number
  never_auto_delete: string[]
  overflow_policy: string
  rename_allowed: boolean
  notes_allowed: boolean
  favorite_allowed: boolean
  locked_allowed: boolean
}

export type SavedHavreIsekaiCard = {
  id: string
  createdAt: number
  updatedAt: number
  autoName: string
  customName?: string
  displayName: string
  runSeed: number
  miniGameId: 'destiny-wheel'
  version: string
  mode: HavreGameModeId
  rarity: string
  verdict: string
  title: string
  generatedCharacter: CharacterSheet
  stats: Record<string, number | string>
  scores: Record<string, number>
  combos: DetectedCombo[]
  statRoasts: StatRoast[]
  commentatorHighlights: string[]
  reward: Record<string, unknown>
  playerMeta: {
    favorite: boolean
    locked: boolean
    note?: string
    badge: string
    rerollCount: number
    jokersUsed: string[]
  }
  runMeta: {
    completedWheels: string[]
    selectedItems: Record<string, string>
    selectedItemLabels: Record<string, string>
    spinHistoryCount: number
  }
}

export type HavreWheelSave = {
  preferredMode: HavreGameModeId
  archives: Record<HavreArchiveBucket, SavedHavreIsekaiCard[]>
}

export type HavreRunSession = {
  mode: HavreGameModeId
  jokersUsed: string[]
  rerollsPerWheel: Record<string, number>
  lockedWheelIds: string[]
  rngSeed: number
}

export type BuildHavreCardInput = {
  runState: RunState
  sheet: CharacterSheet
  session: HavreRunSession
  seedVersion: string
  spinHistoryCount: number
  reward: Record<string, unknown>
  verdict: FinalVerdict
}
