export type DestinyRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'
  | 'cursed'
  | 'illegal'
  | 'cosmic_bug'

export type WheelType = 'mandatory' | 'conditional' | 'batch'

export type WheelSelection = 'single' | 'one_per_secondary_stat'

export type RequirementSpec = Record<string, unknown>

export type WeightModifier = {
  condition?: Record<string, unknown>
  multiplier?: number
  multiplier_from_profile?: boolean
}

export type WheelItem = {
  id: string
  label: string
  rarity: DestinyRarity | string
  base_weight: number
  requirements?: RequirementSpec
  tags_add?: string[]
  stats_add?: Record<string, number | string>
  probability_profile_add?: Record<string, number>
  weight_modifiers?: WeightModifier[]
  unlock_wheels?: string[]
  block_wheels?: string[]
  reaction?: string
  short_text?: string
  stat_key?: string
  quality?: string
  value_multiplier?: number
  profile_keys?: string[]
  score_add?: Record<string, number>
}

export type WheelDef = {
  id: string
  label: string
  order: number
  type: WheelType
  selection?: WheelSelection
  requirements?: RequirementSpec
  items: WheelItem[]
}

export type ComboRule = {
  id: string
  name?: string
  description?: string
  priority: number
  rarity_override?: string
  title_fragment?: string
  required_tags?: string[]
  min_stats?: Record<string, number>
  requirements?: RequirementSpec
  reward?: Record<string, unknown>
}

export type VerdictRule = {
  id: string
  label: string
  description?: string
  priority: number
  requirements?: RequirementSpec
  reward_hint?: string
}

export type StatRoastRule = {
  id: string
  label: string
  text: string
  priority: number
  requirements?: RequirementSpec
}

export type CommentatorBucket = 'positive' | 'neutral' | 'negative' | 'contradiction'

export type CommentatorDef = {
  role: string
  positive: string[]
  neutral: string[]
  negative: string[]
  contradiction: string[]
}

export type NameGeneration = {
  prefixes: string[]
  middles: string[]
  suffixes: string[]
  title_fragments?: string[]
}

export type DestinyWheelPackUi = {
  id: string
  label: string
  kicker?: string
  verdictWheelId?: string
  statWheelPrefix?: string
  commentators?: {
    laharl: { name: string }
    etna: { name: string }
    flonne: { name: string }
  }
  sheetWheels?: Record<string, string>
  gameModes?: Record<string, import('../../features/havreIsekaiWheel/types.ts').HavreGameModeDef>
  jokers?: Record<string, import('../../features/havreIsekaiWheel/types.ts').HavreJokerDef>
  archiveRules?: import('../../features/havreIsekaiWheel/types.ts').HavreArchiveRules
}

export type DestinyWheelSeed = {
  game_id: string
  version: string
  language: string
  rarity_weights: Record<string, number>
  engine_rules: {
    clamps?: {
      profile_multiplier_min?: number
      profile_multiplier_max?: number
      other_multiplier_min?: number
      other_multiplier_max?: number
    }
    pity?: Array<{
      id: string
      condition: Record<string, unknown>
      effect: Record<string, unknown>
    }>
  }
  stat_model: {
    core_stats: string[]
    secondary_stats: string[]
    quality_scale: Record<
      string,
      { label: string; multiplier: number; base_weight: number; rarity: string }
    >
  }
  wheels: WheelDef[]
  combo_rules: ComboRule[]
  verdict_rules: VerdictRule[]
  commentators: Record<string, CommentatorDef>
  ui_reactions: Record<string, string>
  name_generation: NameGeneration
  stat_roast_rules: StatRoastRule[]
  pack?: DestinyWheelPackUi
}

export type ReactionLog = {
  wheelId: string
  itemId: string
  label: string
  rarity: string
  reaction: string
  shortText?: string
}

export type CommentatorLine = {
  speaker: 'laharl' | 'etna' | 'flonne'
  bucket: CommentatorBucket
  text: string
  wheelId?: string
}

export type DetectedCombo = ComboRule & { detected: true }

export type FinalVerdict = VerdictRule & { selected: true }

export type StatRoast = StatRoastRule & { selected: true }

export type WeightDebugEntry = {
  itemId: string
  label: string
  baseWeight: number
  finalWeight: number
  multipliers: string[]
  eligible: boolean
  failedRequirements?: string[]
  forced?: boolean
}

export type SpinResult = {
  wheelId: string
  items: WheelItem[]
  debug?: WeightDebugEntry[]
}

export type RunState = {
  seedId: string
  rng: () => number
  selectedItems: Record<string, string>
  selectedItemLabels: Record<string, string>
  tags: Record<string, number>
  stats: Record<string, number | string>
  probabilityProfile: Record<string, number>
  unlockedWheels: string[]
  blockedWheels: string[]
  completedWheels: string[]
  rarityHistory: string[]
  reactions: ReactionLog[]
  comments: CommentatorLine[]
  combos: DetectedCombo[]
  statRoasts: StatRoast[]
  generatedName?: string
  generatedTitle?: string
  finalVerdict?: FinalVerdict
  reward?: Record<string, unknown>
  finalVerdictDescription?: string
  winChance?: number
  isComplete: boolean
  /** Score cumulatif Havre (power, havre, comedy, …). */
  runScores?: Record<string, number>
  rerollCount?: number
  lockedWheelIds?: string[]
  /** DEV — ignore les prérequis roue pour ces ids (jump debug). */
  debugBypassWheelIds?: string[]
}

export type CharacterSheet = {
  identity: {
    name: string
    title: string
    origin: string
    raceType: string
    mainClass: string
    rank: string
    affiliation: string
    crimeDebt: string
  }
  stats: {
    level: number
    core: Record<string, string>
    secondary: Record<string, string | number>
  }
  weapons: {
    main: string
    mainMastery: string
    secondary?: string
    secondaryMastery?: string
  }
  item: {
    itemWorld: string
    mainItem: string
    itemTrait: string
  }
  evilities: {
    unique: string
    secondary1: string
    secondary2: string
    cursed: string
    inherited?: string
  }
  reincarnation: {
    status: string
    previousLife?: string
    inheritedBonus?: string
    inheritedFlaw?: string
  }
  ultimateForm: {
    label: string
    name: string
    activation?: string
    bonus?: string
    drawback?: string
  }
  finale: {
    rival: string
    boss: string
    combos: DetectedCombo[]
    winChance: number
    verdict: FinalVerdict
    reward: Record<string, unknown>
    comicLine: string
    statRoasts: StatRoast[]
  }
}
