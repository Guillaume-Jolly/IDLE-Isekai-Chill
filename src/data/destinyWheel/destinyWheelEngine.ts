import { detectCombos } from './comboResolver.ts'
import { resolveCommentatorLine, resolveFinalComment } from './commentatorResolver.ts'
import { generateCharacterName, generateCharacterTitle } from './nameGenerator.ts'
import { resetDestinyWheelWarnings } from './logger.ts'
import { evaluateRequirements } from './requirementResolver.ts'
import { computeRunScore, resolveReward } from './rewardResolver.ts'
import { getSortedWheels, getWheelById, loadDestinyWheelSeed } from './seedLoader.ts'
import { resolveStatRoasts } from './statRoastResolver.ts'
import { estimateWinChance, resolveVerdict } from './verdictResolver.ts'
import { pickWeightedItem } from './weightResolver.ts'
import { computeWheelSegments, findSegmentIndexForItem, type WheelSegment } from './wheelSegments.ts'
import type {
  CharacterSheet,
  DestinyWheelSeed,
  RunState,
  SpinResult,
  WheelDef,
  WheelItem,
} from './types.ts'

const SECONDARY_WEAPON_TAGS = ['dual_wield', 'weapon_master', 'boss_like', 'overlord', 'post_game']

export const DESTINY_WHEEL_DEBUG = Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV)

export function createRng(seed = Date.now()): () => number {
  let t = seed + 0x6d2b79f5
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), t | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

export function createInitialRunState(seed: DestinyWheelSeed = loadDestinyWheelSeed(), rngSeed?: number): RunState {
  resetDestinyWheelWarnings()
  return {
    seedId: seed.game_id,
    rng: createRng(rngSeed),
    selectedItems: {},
    selectedItemLabels: {},
    tags: {},
    stats: { level: 1 },
    probabilityProfile: {},
    unlockedWheels: [],
    blockedWheels: [],
    completedWheels: [],
    rarityHistory: [],
    reactions: [],
    comments: [],
    combos: [],
    statRoasts: [],
    runScores: {},
    isComplete: false,
  }
}

function labelForWheel(state: RunState, wheelId: string, fallback = '—'): string {
  return state.selectedItemLabels[wheelId] ?? fallback
}

function isSecondaryWeaponWheel(wheelId: string): boolean {
  return wheelId === 'secondary_weapon' || wheelId === 'secondary_weapon_mastery'
}

export function isWheelAvailable(state: RunState, wheel: WheelDef): boolean {
  if (state.debugBypassWheelIds?.includes(wheel.id)) return true
  if (state.blockedWheels.includes(wheel.id)) return false
  if (state.completedWheels.includes(wheel.id)) return false
  if (!evaluateRequirements(state, wheel.requirements).ok) return false

  if (wheel.type === 'mandatory' || wheel.type === 'batch') return true

  if (state.unlockedWheels.includes(wheel.id)) return true
  if (isSecondaryWeaponWheel(wheel.id)) {
    return SECONDARY_WEAPON_TAGS.some((tag) => (state.tags[tag] ?? 0) > 0)
  }

  return false
}

export function getAvailableWheels(state: RunState, seed: DestinyWheelSeed = loadDestinyWheelSeed()): WheelDef[] {
  return getSortedWheels(seed).filter((wheel) => isWheelAvailable(state, wheel))
}

export function getNextWheel(state: RunState, seed: DestinyWheelSeed = loadDestinyWheelSeed()): WheelDef | null {
  return getAvailableWheels(state, seed)[0] ?? null
}

function applyItemEffects(state: RunState, wheelId: string, item: WheelItem, seed: DestinyWheelSeed) {
  state.selectedItems[wheelId] = item.id
  state.selectedItemLabels[wheelId] = item.label

  for (const tag of item.tags_add ?? []) {
    state.tags[tag] = (state.tags[tag] ?? 0) + 1
  }

  for (const [key, value] of Object.entries(item.stats_add ?? {})) {
    if (typeof value === 'number') {
      const current = state.stats[key]
      state.stats[key] = (typeof current === 'number' ? current : 0) + value
    } else {
      state.stats[key] = value
    }
  }

  for (const [key, value] of Object.entries(item.probability_profile_add ?? {})) {
    state.probabilityProfile[key] = (state.probabilityProfile[key] ?? 1) * value
  }

  for (const [key, value] of Object.entries(item.score_add ?? {})) {
    if (typeof value === 'number') {
      state.runScores = state.runScores ?? {}
      state.runScores[key] = (state.runScores[key] ?? 0) + value
    }
  }

  for (const wheel of item.unlock_wheels ?? []) {
    if (!state.unlockedWheels.includes(wheel)) state.unlockedWheels.push(wheel)
  }
  for (const wheel of item.block_wheels ?? []) {
    if (!state.blockedWheels.includes(wheel)) state.blockedWheels.push(wheel)
  }

  state.rarityHistory.push(item.rarity)
  state.reactions.push({
    wheelId,
    itemId: item.id,
    label: item.label,
    rarity: item.rarity,
    reaction: item.reaction ?? 'neutral',
    shortText: item.short_text,
  })
  state.comments.push(resolveCommentatorLine(state, seed, item, wheelId))
}

function spinSingleWheel(
  state: RunState,
  wheel: WheelDef,
  seed: DestinyWheelSeed,
  debug = DESTINY_WHEEL_DEBUG,
): SpinResult {
  const eligible = wheel.items.filter((item) => evaluateRequirements(state, item.requirements).ok)
  const pool = eligible.length > 0 ? eligible : wheel.items
  const { item, debugEntries } = pickWeightedItem(state, pool, seed, debug)
  applyItemEffects(state, wheel.id, item, seed)
  state.completedWheels.push(wheel.id)
  return { wheelId: wheel.id, items: [item], debug: debugEntries }
}

function spinBatchWheel(
  state: RunState,
  wheel: WheelDef,
  seed: DestinyWheelSeed,
  debug = DESTINY_WHEEL_DEBUG,
): SpinResult {
  const grouped = new Map<string, WheelItem[]>()
  for (const item of wheel.items) {
    const statKey = Object.keys(item.stats_add ?? {})[0] ?? item.id
    const bucket = grouped.get(statKey) ?? []
    bucket.push(item)
    grouped.set(statKey, bucket)
  }

  const picked: WheelItem[] = []
  const debugEntries: import('./types').WeightDebugEntry[] = []
  for (const [, items] of grouped) {
    const { item, debugEntries: entries } = pickWeightedItem(state, items, seed, debug)
    applyItemEffects(state, `${wheel.id}:${item.id}`, item, seed)
    picked.push(item)
    debugEntries.push(...entries)
  }
  state.completedWheels.push(wheel.id)
  return { wheelId: wheel.id, items: picked, debug: debugEntries }
}

export function cloneRunState(state: RunState): RunState {
  return {
    ...state,
    selectedItems: { ...state.selectedItems },
    selectedItemLabels: { ...state.selectedItemLabels },
    tags: { ...state.tags },
    stats: { ...state.stats },
    probabilityProfile: { ...state.probabilityProfile },
    unlockedWheels: [...state.unlockedWheels],
    blockedWheels: [...state.blockedWheels],
    completedWheels: [...state.completedWheels],
    rarityHistory: [...state.rarityHistory],
    reactions: [...state.reactions],
    comments: [...state.comments],
    combos: [...state.combos],
    statRoasts: [...state.statRoasts],
    runScores: state.runScores ? { ...state.runScores } : undefined,
    rerollCount: state.rerollCount,
    lockedWheelIds: state.lockedWheelIds ? [...state.lockedWheelIds] : undefined,
    debugBypassWheelIds: state.debugBypassWheelIds ? [...state.debugBypassWheelIds] : undefined,
    rng: state.rng,
  }
}

export function syncRunState(target: RunState, source: RunState) {
  target.selectedItems = { ...source.selectedItems }
  target.selectedItemLabels = { ...source.selectedItemLabels }
  target.tags = { ...source.tags }
  target.stats = { ...source.stats }
  target.probabilityProfile = { ...source.probabilityProfile }
  target.unlockedWheels = [...source.unlockedWheels]
  target.blockedWheels = [...source.blockedWheels]
  target.completedWheels = [...source.completedWheels]
  target.rarityHistory = [...source.rarityHistory]
  target.reactions = [...source.reactions]
  target.comments = [...source.comments]
  target.combos = [...source.combos]
  target.statRoasts = [...source.statRoasts]
  target.runScores = source.runScores ? { ...source.runScores } : undefined
  target.rerollCount = source.rerollCount
  target.lockedWheelIds = source.lockedWheelIds ? [...source.lockedWheelIds] : undefined
  target.generatedName = source.generatedName
  target.generatedTitle = source.generatedTitle
  target.finalVerdict = source.finalVerdict
  target.reward = source.reward
  target.winChance = source.winChance
  target.isComplete = source.isComplete
  target.debugBypassWheelIds = source.debugBypassWheelIds ? [...source.debugBypassWheelIds] : undefined
}

export type PlannedWheelSpin = {
  wheelId: string
  segments: WheelSegment[]
  winIndex: number
  result: SpinResult
  draft: RunState
}

export type PlanWheelSpinOptions = {
  forcedItemId?: string
}

function forcedDebugEntry(item: WheelItem): import('./types').WeightDebugEntry {
  return {
    itemId: item.id,
    label: item.label,
    baseWeight: item.base_weight,
    finalWeight: item.base_weight,
    multipliers: ['debug:forced'],
    eligible: true,
    forced: true,
  }
}

function spinSingleWheelWithItem(
  state: RunState,
  wheel: WheelDef,
  item: WheelItem,
  seed: DestinyWheelSeed,
): SpinResult {
  applyItemEffects(state, wheel.id, item, seed)
  state.completedWheels.push(wheel.id)
  return { wheelId: wheel.id, items: [item], debug: [forcedDebugEntry(item)] }
}

function spinBatchWheelWithForcedItem(
  state: RunState,
  wheel: WheelDef,
  forcedItem: WheelItem,
  seed: DestinyWheelSeed,
  debug = DESTINY_WHEEL_DEBUG,
): SpinResult {
  const grouped = new Map<string, WheelItem[]>()
  for (const item of wheel.items) {
    const statKey = Object.keys(item.stats_add ?? {})[0] ?? item.id
    const bucket = grouped.get(statKey) ?? []
    bucket.push(item)
    grouped.set(statKey, bucket)
  }

  const forcedStatKey = Object.keys(forcedItem.stats_add ?? {})[0] ?? forcedItem.id
  const picked: WheelItem[] = []
  const debugEntries: import('./types').WeightDebugEntry[] = []

  for (const [statKey, items] of grouped) {
    if (statKey === forcedStatKey && items.some((item) => item.id === forcedItem.id)) {
      applyItemEffects(state, `${wheel.id}:${forcedItem.id}`, forcedItem, seed)
      picked.push(forcedItem)
      debugEntries.push(forcedDebugEntry(forcedItem))
      continue
    }
    const { item, debugEntries: entries } = pickWeightedItem(state, items, seed, debug)
    applyItemEffects(state, `${wheel.id}:${item.id}`, item, seed)
    picked.push(item)
    debugEntries.push(...entries)
  }

  state.completedWheels.push(wheel.id)
  return { wheelId: wheel.id, items: picked, debug: debugEntries }
}

function spinWheelWithForcedItem(
  state: RunState,
  wheel: WheelDef,
  forcedItem: WheelItem,
  seed: DestinyWheelSeed,
): SpinResult {
  if (wheel.type === 'batch') {
    return spinBatchWheelWithForcedItem(state, wheel, forcedItem, seed)
  }
  return spinSingleWheelWithItem(state, wheel, forcedItem, seed)
}

/**
 * DEV — reset + saute directement à `targetWheelId` comme prochaine roue.
 * Pas de simulation des tirages intermédiaires (stats incohérentes acceptées).
 */
export function debugJumpToWheelDirect(
  state: RunState,
  targetWheelId: string,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
): boolean {
  const target = getWheelById(targetWheelId, seed)
  if (!target) return false

  const fresh = createInitialRunState(seed, Date.now())
  syncRunState(state, fresh)

  for (const wheel of getSortedWheels(seed)) {
    if (wheel.order < target.order && !state.completedWheels.includes(wheel.id)) {
      state.completedWheels.push(wheel.id)
    }
  }

  if (!state.unlockedWheels.includes(target.id)) {
    state.unlockedWheels.push(target.id)
  }
  state.blockedWheels = state.blockedWheels.filter((id) => id !== target.id)
  state.debugBypassWheelIds = [targetWheelId]

  return getNextWheel(state, seed)?.id === targetWheelId
}

/** @deprecated Utiliser `debugJumpToWheelDirect`. */
export function debugFastForwardToWheel(
  state: RunState,
  targetWheelId: string,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
): boolean {
  return debugJumpToWheelDirect(state, targetWheelId, seed)
}

export function planWheelSpin(
  state: RunState,
  wheelId: string,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
  options?: PlanWheelSpinOptions,
): PlannedWheelSpin | null {
  const wheel = getWheelById(wheelId, seed)
  if (!wheel || !isWheelAvailable(state, wheel)) return null

  const segments = computeWheelSegments(state, wheel, seed)
  const draft = cloneRunState(state)
  let result: SpinResult

  if (options?.forcedItemId) {
    const forcedId = options.forcedItemId
    const forcedItem =
      wheel.items.find((item) => item.id === forcedId) ??
      wheel.items.find((item) => item.id === forcedId.split(':').pop())
    if (forcedItem) {
      result = spinWheelWithForcedItem(draft, wheel, forcedItem, seed)
    } else {
      result = spinWheel(draft, wheelId, seed)
    }
  } else {
    result = spinWheel(draft, wheelId, seed)
  }

  const primaryItem = result.items[0]
  let winIndex = 0
  if (wheel.type === 'batch') {
    const forcedId = options?.forcedItemId
    const focusItem =
      forcedId != null && forcedId !== ''
        ? (wheel.items.find((item) => item.id === forcedId) ?? primaryItem)
        : primaryItem
    if (focusItem) {
      const statKey = Object.keys(focusItem.stats_add ?? {})[0]
      winIndex = segments.findIndex((segment) => segment.item.id === `batch_${statKey}`)
    }
  } else if (primaryItem) {
    winIndex = findSegmentIndexForItem(segments, primaryItem.id)
  }

  return { wheelId, segments, winIndex: Math.max(0, winIndex), result, draft }
}

export { computeWheelSegments }

export function spinWheel(
  state: RunState,
  wheelId: string,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
): SpinResult {
  const wheel = getWheelById(wheelId, seed)
  if (!wheel) throw new Error(`Unknown wheel: ${wheelId}`)
  if (!isWheelAvailable(state, wheel)) throw new Error(`Wheel not available: ${wheelId}`)

  if (wheel.type === 'batch') return spinBatchWheel(state, wheel, seed)
  return spinSingleWheel(state, wheel, seed)
}

export function spinNextWheel(state: RunState, seed: DestinyWheelSeed = loadDestinyWheelSeed()): SpinResult | null {
  const next = getNextWheel(state, seed)
  if (!next) return null
  return spinWheel(state, next.id, seed)
}

/**
 * DEV — enchaîne tous les tirages restants sans animation, puis finalise la run.
 * Mutates `state` in place.
 */
export function debugSimulateFullRun(
  state: RunState,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
): { state: RunState; spins: SpinResult[] } {
  const spins: SpinResult[] = []
  while (getNextWheel(state, seed)) {
    const result = spinNextWheel(state, seed)
    if (!result) break
    spins.push(result)
  }
  finalizeRun(state, seed)
  return { state, spins }
}

export function finalizeRun(state: RunState, seed: DestinyWheelSeed = loadDestinyWheelSeed()) {
  state.combos = detectCombos(state, seed)
  state.statRoasts = resolveStatRoasts(state, seed)
  state.generatedName = generateCharacterName(state, seed)
  state.generatedTitle = generateCharacterTitle(state, seed)
  state.finalVerdict = resolveFinalVerdict(state, seed)
  state.winChance = estimateWinChance(state)
  const { reward, scaledCost } = resolveReward(state.finalVerdict, state.combos)
  state.reward = { ...reward, scaledCost }
  state.comments.push(resolveFinalComment(state, seed))
  state.isComplete = true
}

function sheetWheelId(seed: DestinyWheelSeed, key: string, fallback: string): string {
  return seed.pack?.sheetWheels?.[key] ?? fallback
}

function resolveFinalVerdict(state: RunState, seed: DestinyWheelSeed) {
  const verdictWheelId = seed.pack?.verdictWheelId
  if (verdictWheelId) {
    const itemId = state.selectedItems[verdictWheelId]
    if (itemId) {
      const wheel = getWheelById(verdictWheelId, seed)
      const item = wheel?.items.find((entry) => entry.id === itemId)
      if (item) {
        return {
          id: item.id,
          label: item.label,
          description: item.short_text,
          priority: 50,
          selected: true as const,
          reward_hint: 'minor_resource_or_codex',
        }
      }
    }
  }
  return resolveVerdict(state, seed)
}

export function buildCharacterSheet(state: RunState, seed: DestinyWheelSeed = loadDestinyWheelSeed()): CharacterSheet {
  const coreStats = seed.stat_model.core_stats
  const secondaryStats = seed.stat_model.secondary_stats
  const statWheelPrefix = seed.pack?.statWheelPrefix
  const core: Record<string, string> = {}
  for (const stat of coreStats) {
    if (statWheelPrefix) {
      core[stat.toUpperCase()] = labelForWheel(state, `${statWheelPrefix}${stat}`, '—')
    } else {
      core[stat.toUpperCase()] = labelForWheel(state, `stat_${stat}_quality`, '—')
    }
  }
  const secondary: Record<string, string | number> = {}
  for (const stat of secondaryStats) {
    const value = state.stats[stat]
    secondary[stat] = typeof value === 'number' || typeof value === 'string' ? value : '—'
  }

  const reincarnated = (state.tags.reincarnated ?? 0) > 0
  const inheritedEvility =
    state.selectedItemLabels.inherited_bonus?.includes('Evility') ||
    state.tags.inheritance
      ? labelForWheel(state, 'inherited_bonus', undefined)
      : undefined

  return {
    identity: {
      name: state.generatedName ?? 'Sans-Nom',
      title: state.generatedTitle ?? 'Vassal',
      origin: labelForWheel(state, sheetWheelId(seed, 'origin', 'origin_world')),
      raceType: labelForWheel(state, sheetWheelId(seed, 'raceType', 'status_type')),
      mainClass: labelForWheel(state, sheetWheelId(seed, 'mainClass', 'main_class')),
      rank: labelForWheel(state, sheetWheelId(seed, 'rank', 'rank')),
      affiliation: seed.pack?.id === 'havre'
        ? labelForWheel(state, sheetWheelId(seed, 'affiliation', 'refuge_job'))
        : state.tags.dark_assembly
          ? 'Dark Assembly'
          : state.tags.celestia
            ? 'Celestia'
            : 'Netherworld',
      crimeDebt: seed.pack?.id === 'havre'
        ? labelForWheel(state, sheetWheelId(seed, 'crimeDebt', 'relational_flaw'))
        : state.tags.debt
          ? 'Dette infernale'
          : 'Crimes divers',
    },
    stats: {
      level: typeof state.stats.level === 'number' ? state.stats.level : 1,
      core,
      secondary,
    },
    weapons: {
      main: labelForWheel(state, sheetWheelId(seed, 'mainWeapon', 'main_weapon')),
      mainMastery: labelForWheel(state, sheetWheelId(seed, 'mainMastery', 'weapon_mastery')),
      secondary: state.completedWheels.includes(sheetWheelId(seed, 'secondaryWeapon', 'secondary_weapon'))
        ? labelForWheel(state, sheetWheelId(seed, 'secondaryWeapon', 'secondary_weapon'), undefined)
        : undefined,
      secondaryMastery: state.completedWheels.includes(
        sheetWheelId(seed, 'secondaryMastery', 'secondary_weapon_mastery'),
      )
        ? labelForWheel(state, sheetWheelId(seed, 'secondaryMastery', 'secondary_weapon_mastery'), undefined)
        : undefined,
    },
    item: {
      itemWorld: labelForWheel(state, sheetWheelId(seed, 'itemWorld', 'item_world_origin')),
      mainItem: labelForWheel(state, sheetWheelId(seed, 'mainWeapon', 'main_weapon')),
      itemTrait: labelForWheel(state, sheetWheelId(seed, 'itemTrait', 'item_trait')),
    },
    evilities: {
      unique: labelForWheel(state, sheetWheelId(seed, 'uniqueEvility', 'unique_evility')),
      secondary1: labelForWheel(state, sheetWheelId(seed, 'secondaryEvility1', 'secondary_evility_1')),
      secondary2: labelForWheel(state, sheetWheelId(seed, 'secondaryEvility2', 'secondary_evility_2')),
      cursed: labelForWheel(state, sheetWheelId(seed, 'curseEvility', 'curse_evility')),
      inherited: inheritedEvility,
    },
    reincarnation: {
      status: labelForWheel(state, sheetWheelId(seed, 'reincarnation', 'reincarnation')),
      previousLife: reincarnated ? labelForWheel(state, sheetWheelId(seed, 'previousLife', 'previous_life'), undefined) : undefined,
      inheritedBonus: reincarnated ? labelForWheel(state, sheetWheelId(seed, 'inheritedBonus', 'inherited_bonus'), undefined) : undefined,
      inheritedFlaw: reincarnated ? labelForWheel(state, sheetWheelId(seed, 'inheritedFlaw', 'inherited_flaw'), undefined) : undefined,
    },
    ultimateForm: {
      label: 'Forme ultime',
      name: labelForWheel(state, sheetWheelId(seed, 'ultimateForm', 'ultimate_form')),
    },
    finale: {
      rival: labelForWheel(state, sheetWheelId(seed, 'finalRival', 'final_rival')),
      boss: labelForWheel(state, sheetWheelId(seed, 'finalBoss', 'final_boss')),
      combos: state.combos,
      winChance: state.winChance ?? estimateWinChance(state),
      verdict: state.finalVerdict ?? resolveVerdict(state, seed),
      reward: state.reward ?? {},
      comicLine: state.comments[state.comments.length - 1]?.text ?? '',
      statRoasts: state.statRoasts,
    },
  }
}

export function runAutoSimulation(count = 100, seed: DestinyWheelSeed = loadDestinyWheelSeed()) {
  const results = []
  for (let i = 0; i < count; i += 1) {
    const state = createInitialRunState(seed, Date.now() + i)
    while (getNextWheel(state, seed)) {
      spinNextWheel(state, seed)
    }
    finalizeRun(state, seed)
    buildCharacterSheet(state, seed)
    results.push({
      verdict: state.finalVerdict?.id,
      combos: state.combos.length,
      wheels: state.completedWheels.length,
    })
  }
  return {
    runs: results.length,
    minWheels: Math.min(...results.map((r) => r.wheels)),
    maxWheels: Math.max(...results.map((r) => r.wheels)),
    sample: results.slice(0, 3),
  }
}

export function getRunProgress(state: RunState, seed: DestinyWheelSeed = loadDestinyWheelSeed()) {
  const mandatoryCount = getSortedWheels(seed).filter((wheel) => wheel.type !== 'conditional').length
  let estimatedTotal = mandatoryCount
  estimatedTotal += Math.min(3, state.unlockedWheels.filter((id) => {
    const wheel = getWheelById(id, seed)
    return wheel?.type === 'conditional'
  }).length || 2)
  return {
    completed: state.completedWheels.length,
    estimatedTotal: Math.max(state.completedWheels.length, estimatedTotal),
  }
}

export { computeRunScore }
