import { formatSpeech } from './conversationContext'
import { orderDialogueChoices } from './dialogueChoiceOrder'
import curatedAff1 from '../../../scripts/references/link-corpus/curated/lyra-aff1-curated-12.json'
import curatedAff2 from '../../../scripts/references/link-corpus/curated/lyra-aff2-curated-12.json'
import curatedAff4 from '../../../scripts/references/link-corpus/curated/lyra-aff4-curated-12.json'
import curatedAff4FemaleMc from '../../../scripts/references/link-corpus/curated/lyra-aff4-curated-12-female-mc.json'
import curatedAff5 from '../../../scripts/references/link-corpus/curated/lyra-aff5-curated-12.json'
import curatedAff5FemaleMc from '../../../scripts/references/link-corpus/curated/lyra-aff5-curated-12-female-mc.json'
import type { ProtagonistGender } from '../gameSettings'
import type { CompanionEmotionId } from '../companionAssets'
import { COMPANION_DIALOGUE_PROFILES } from './profiles'
import { getParlerPersonalityHint } from './parlerProfiles'
import type { CompanionConversation, DialogueChoice, DialogueRound, DialogueTone } from './types'
import type { ParlerRoundOutcomeMeta } from './parlerSessionSummary'
import type { ParlerPowerDynamic } from './types'

type CuratedChoice = {
  tone: DialogueTone
  text: string
  score: 0 | 1 | 2 | 3
  reaction: string
  emotion?: CompanionEmotionId
}

type CuratedExchange = {
  id: string
  title: string
  bridge: string
  companionAction?: string
  companionLine: string
  intimateFinale?: string
  intimateFinaleLow?: string
  sessionOutcome?: ParlerRoundOutcomeMeta
  answerRule?: string
  powerDynamic?: ParlerPowerDynamic
  choices: CuratedChoice[]
}

type CuratedSessionPack = {
  id: string
  label: string
  exchangeIds: string[]
  packIntimateFinale?: string
  packIntimateFinaleLow?: string
  packIntimateFinaleTemplate?: {
    setting: string
    closing: string
  }
}

type CuratedCorpusFile = {
  meta: {
    affinity: number
    protagonistGender?: ProtagonistGender
    defaultPowerDynamic?: ParlerPowerDynamic
    sessionPacks?: CuratedSessionPack[]
  }
  exchanges: CuratedExchange[]
}

function resolvePersonalityHint(companionId: string, affinity: number): string {
  return (
    getParlerPersonalityHint(companionId, affinity) ??
    COMPANION_DIALOGUE_PROFILES[companionId]?.personalityHint ??
    ''
  )
}

/** Échanges curés par pack (Lyra aff. 1–5) — 3 par défaut, pack bonus jusqu'à 6. */
export const CURATED_ROUNDS_PER_SESSION = 3
export const CURATED_MAX_ROUNDS_PER_SESSION = 9

export const CURATED_PARLER_AFFINITIES = [1, 2, 4, 5] as const
export type CuratedParlerAffinity = (typeof CURATED_PARLER_AFFINITIES)[number]

export const INTIMATE_PARLER_AFFINITIES = [4, 5] as const

export type ParlerCorpusOptions = {
  protagonistGender?: ProtagonistGender
  nsfwContent?: boolean
}

const CORPUS_MALE_BY_AFFINITY: Record<CuratedParlerAffinity, CuratedCorpusFile> = {
  1: curatedAff1 as CuratedCorpusFile,
  2: curatedAff2 as CuratedCorpusFile,
  4: curatedAff4 as CuratedCorpusFile,
  5: curatedAff5 as CuratedCorpusFile,
}

const CORPUS_FEMALE_MC_BY_AFFINITY: Partial<Record<CuratedParlerAffinity, CuratedCorpusFile>> = {
  4: curatedAff4FemaleMc as CuratedCorpusFile,
  5: curatedAff5FemaleMc as CuratedCorpusFile,
}

export function isCuratedAffinity(level: number): level is CuratedParlerAffinity {
  return CURATED_PARLER_AFFINITIES.includes(level as CuratedParlerAffinity)
}

function isIntimateAffinity(level: number): level is 4 | 5 {
  return level === 4 || level === 5
}

function affinityAllowedAtRuntime(level: number, nsfwContent = false): level is CuratedParlerAffinity {
  if (!isCuratedAffinity(level)) return false
  if (isIntimateAffinity(level) && !nsfwContent) return false
  return true
}

function resolveCorpusFile(
  affinity: CuratedParlerAffinity,
  protagonistGender: ProtagonistGender = 'male',
): CuratedCorpusFile {
  if (isIntimateAffinity(affinity) && protagonistGender === 'female') {
    return CORPUS_FEMALE_MC_BY_AFFINITY[affinity] ?? CORPUS_MALE_BY_AFFINITY[affinity]
  }
  return CORPUS_MALE_BY_AFFINITY[affinity]
}

function getCuratedCorpus(
  affinity: number,
  options: ParlerCorpusOptions = {},
): CuratedCorpusFile | null {
  const nsfwContent = options.nsfwContent ?? false
  if (!affinityAllowedAtRuntime(affinity, nsfwContent)) return null
  return resolveCorpusFile(affinity, options.protagonistGender ?? 'male')
}

const toDialogueChoice = (choice: CuratedChoice): DialogueChoice => ({
  text: choice.text,
  tone: choice.tone,
  score: choice.score,
  reaction: choice.reaction,
  emotion: choice.emotion ?? (choice.score >= 2 ? 'happy' : 'annoyed'),
})

const exchangeToRound = (exchange: CuratedExchange): DialogueRound | null => {
  const choices = orderDialogueChoices(
    exchange.choices.map(toDialogueChoice) as [
      DialogueChoice,
      DialogueChoice,
      DialogueChoice,
      DialogueChoice,
    ],
  )
  if (choices.length !== 4) return null

  return {
    context: [exchange.bridge],
    companionAction: exchange.companionAction?.trim()
      ? exchange.companionAction.trim()
      : undefined,
    prompt: formatSpeech(exchange.companionLine),
    intimateFinale: exchange.intimateFinale?.trim() ? exchange.intimateFinale.trim() : undefined,
    intimateFinaleLow: exchange.intimateFinaleLow?.trim()
      ? exchange.intimateFinaleLow.trim()
      : undefined,
    ...(exchange.sessionOutcome ? { sessionOutcome: exchange.sessionOutcome } : {}),
    choices,
  }
}

const buildExchangeMap = (corpus: CuratedCorpusFile) =>
  new Map(corpus.exchanges.map((exchange) => [exchange.id, exchange]))

const buildCuratedSession = (
  affinity: CuratedParlerAffinity,
  pack: CuratedSessionPack,
  exchanges: CuratedExchange[],
  protagonistGender: ProtagonistGender = 'male',
): CompanionConversation | null => {
  const profile = COMPANION_DIALOGUE_PROFILES.lyra
  const expectedRounds = pack.exchangeIds.length
  if (
    !profile ||
    expectedRounds < CURATED_ROUNDS_PER_SESSION ||
    expectedRounds > CURATED_MAX_ROUNDS_PER_SESSION
  ) {
    return null
  }

  const rounds = exchanges
    .map(exchangeToRound)
    .filter((round): round is DialogueRound => round !== null)

  if (rounds.length !== expectedRounds) return null

  const personalityHint = resolvePersonalityHint('lyra', affinity)
  const genderInId =
    protagonistGender === 'female' && isIntimateAffinity(affinity) ? 'female-mc-' : ''

  return {
    id: `lyra-aff${affinity}-curated-${genderInId}${pack.id}`,
    companionId: 'lyra',
    title: pack.label,
    personalityHint,
    minAffinity: affinity,
    maxAffinity: affinity,
    rounds,
    ...(pack.packIntimateFinale?.trim()
      ? { packIntimateFinale: pack.packIntimateFinale.trim() }
      : {}),
    ...(pack.packIntimateFinaleLow?.trim()
      ? { packIntimateFinaleLow: pack.packIntimateFinaleLow.trim() }
      : {}),
    ...(pack.packIntimateFinaleTemplate
      ? { packIntimateFinaleTemplate: pack.packIntimateFinaleTemplate }
      : {}),
  }
}

const buildSingleExchangeSession = (
  exchange: CuratedExchange,
  affinity: CuratedParlerAffinity,
): CompanionConversation | null => {
  const profile = COMPANION_DIALOGUE_PROFILES.lyra
  const round = exchangeToRound(exchange)
  if (!profile || !round) return null

  const personalityHint = resolvePersonalityHint('lyra', affinity)

  return {
    id: `${exchange.id}-dev-single`,
    companionId: 'lyra',
    title: exchange.title,
    personalityHint,
    minAffinity: affinity,
    maxAffinity: affinity,
    rounds: [round],
  }
}

const resolvePack = (
  affinity: CuratedParlerAffinity,
  pack: CuratedSessionPack,
  exchangeById: Map<string, CuratedExchange>,
  protagonistGender: ProtagonistGender = 'male',
): CompanionConversation | null => {
  const exchanges = pack.exchangeIds
    .map((id) => exchangeById.get(id))
    .filter((exchange): exchange is CuratedExchange => exchange !== undefined)

  return buildCuratedSession(affinity, pack, exchanges, protagonistGender)
}

function findExchangeInAllCorpora(exchangeId: string): {
  exchange: CuratedExchange
  affinity: CuratedParlerAffinity
} | null {
  for (const affinity of CURATED_PARLER_AFFINITIES) {
    for (const corpus of [CORPUS_MALE_BY_AFFINITY[affinity], CORPUS_FEMALE_MC_BY_AFFINITY[affinity]]) {
      if (!corpus) continue
      const exchange = corpus.exchanges.find((entry) => entry.id === exchangeId)
      if (exchange) return { exchange, affinity }
    }
  }
  return null
}

/** Phase validation : Parler = Lyra + échanges curés aff. 1–2 (pas linkCorpusV2). */
export const CURATED_PARLER_ONLY = true

export const CURATED_PARLER_COMPANION_ID = 'lyra'

/** @deprecated Préférer CURATED_PARLER_AFFINITIES */
export const CURATED_PARLER_AFFINITY = 1

export function canUseParlerDialogues(companionId: string) {
  if (CURATED_PARLER_ONLY) {
    return companionId === CURATED_PARLER_COMPANION_ID
  }
  return Boolean(COMPANION_DIALOGUE_PROFILES[companionId])
}

/** Affinité effective pour tirer un script Parler (clamp 1–5, sans forcer le palier joueur). */
export function dialogueAffinityForParler(_companionId: string, selectedAffinity: number) {
  return Math.min(5, Math.max(1, Math.round(selectedAffinity)))
}

export function usesCuratedCorpus(
  companionId: string,
  affinity: number,
  options: ParlerCorpusOptions = {},
) {
  const level = dialogueAffinityForParler(companionId, affinity)
  const corpus = getCuratedCorpus(level, options)
  if (!corpus || companionId !== CURATED_PARLER_COMPANION_ID) return false

  const sessionPacks = corpus.meta.sessionPacks ?? []
  return sessionPacks.length > 0 && corpus.exchanges.length >= CURATED_ROUNDS_PER_SESSION
}

/** Corpus Parler disponible pour ce compagnon à ce palier d'affinité. */
export function hasParlerDialoguesAtAffinity(
  companionId: string,
  affinity: number,
  options: ParlerCorpusOptions = {},
) {
  if (!canUseParlerDialogues(companionId)) return false
  const level = dialogueAffinityForParler(companionId, affinity)
  if (isIntimateAffinity(level) && !(options.nsfwContent ?? false)) return false
  return usesCuratedCorpus(companionId, level, options)
}

export function defaultParlerDialogueAffinity(
  companionId: string,
  playerAffinity: number,
  options: ParlerCorpusOptions = {},
) {
  const playerLevel = dialogueAffinityForParler(companionId, playerAffinity)
  if (hasParlerDialoguesAtAffinity(companionId, playerLevel, options)) return playerLevel
  for (const level of CURATED_PARLER_AFFINITIES) {
    if (hasParlerDialoguesAtAffinity(companionId, level, options)) return level
  }
  return playerLevel
}

export type CuratedSessionPackOption = {
  id: string
  label: string
  conversationId: string
  affinity: CuratedParlerAffinity
}

export type CuratedDevExchangeOption = {
  exchangeId: string
  label: string
  affinity: CuratedParlerAffinity
  protagonistGender: ProtagonistGender
  sortKey: string
}

export type CuratedDevPackOption = {
  packId: string
  label: string
  affinity: CuratedParlerAffinity
  protagonistGender: ProtagonistGender
  sortKey: string
}

export type CuratedDevCuratedSelection =
  | { mode: 'random' }
  | { mode: 'exchange'; exchangeId: string }
  | { mode: 'pack'; packId: string; affinity: CuratedParlerAffinity; protagonistGender: ProtagonistGender }

const DEV_SELECTION_EXCHANGE_PREFIX = 'e:'
const DEV_SELECTION_PACK_PREFIX = 'p:'

/** Dev : packs session (3 échanges), aff. 4–5 en double H/F. */
export function listCuratedDevPackOptions(affinityFilter?: number): CuratedDevPackOption[] {
  const affinities =
    affinityFilter !== undefined && isCuratedAffinity(affinityFilter)
      ? [affinityFilter]
      : [...CURATED_PARLER_AFFINITIES]

  const options: CuratedDevPackOption[] = []

  for (const level of affinities) {
    const malePacks = CORPUS_MALE_BY_AFFINITY[level].meta.sessionPacks ?? []
    malePacks.forEach((pack, index) => {
      if (
        pack.exchangeIds.length < CURATED_ROUNDS_PER_SESSION ||
        pack.exchangeIds.length > CURATED_MAX_ROUNDS_PER_SESSION
      ) {
        return
      }
      const genderTag = isIntimateAffinity(level) ? ' H' : ''
      options.push({
        packId: pack.id,
        label: `Pack ${index + 1} — ${pack.label} — aff. ${level}${genderTag}`,
        affinity: level,
        protagonistGender: 'male',
        sortKey: `${level}-pack-${String(index + 1).padStart(2, '0')}-H`,
      })
    })

    if (isIntimateAffinity(level)) {
      const femaleCorpus = CORPUS_FEMALE_MC_BY_AFFINITY[level]
      const femalePacks = femaleCorpus?.meta.sessionPacks ?? []
      femalePacks.forEach((pack, index) => {
        if (
          pack.exchangeIds.length < CURATED_ROUNDS_PER_SESSION ||
          pack.exchangeIds.length > CURATED_MAX_ROUNDS_PER_SESSION
        ) {
          return
        }
        options.push({
          packId: pack.id,
          label: `Pack ${index + 1} — ${pack.label} — aff. ${level} F`,
          affinity: level,
          protagonistGender: 'female',
          sortKey: `${level}-pack-${String(index + 1).padStart(2, '0')}-F`,
        })
      })
    }
  }

  return options.sort((left, right) => left.sortKey.localeCompare(right.sortKey))
}

export function serializeDevCuratedSelection(selection: CuratedDevCuratedSelection): string {
  if (selection.mode === 'random') return ''
  if (selection.mode === 'exchange') return `${DEV_SELECTION_EXCHANGE_PREFIX}${selection.exchangeId}`
  return `${DEV_SELECTION_PACK_PREFIX}${selection.affinity}:${selection.protagonistGender}:${selection.packId}`
}

/** Dev QA : `?pack=pack-5` force un pack aff. 5 au chargement Parler. */
export function devPackSelectionFromQueryParam(
  protagonistGender: ProtagonistGender = 'male',
): CuratedDevCuratedSelection | null {
  if (typeof window === 'undefined') return null
  const packId = new URLSearchParams(window.location.search).get('pack')?.trim()
  if (!packId) return null
  return { mode: 'pack', packId, affinity: 5, protagonistGender }
}

export function parseDevCuratedSelection(raw: string): CuratedDevCuratedSelection {
  const trimmed = raw.trim()
  if (!trimmed) return { mode: 'random' }
  if (trimmed.startsWith(DEV_SELECTION_EXCHANGE_PREFIX)) {
    return { mode: 'exchange', exchangeId: trimmed.slice(DEV_SELECTION_EXCHANGE_PREFIX.length) }
  }
  const packMatch = trimmed.match(/^p:(\d+):(male|female):(.+)$/)
  if (packMatch) {
    const affinity = Number(packMatch[1])
    const protagonistGender = packMatch[2] as ProtagonistGender
    const packId = packMatch[3]
    if (packId && isCuratedAffinity(affinity)) {
      return { mode: 'pack', packId, affinity, protagonistGender }
    }
  }
  // Legacy : valeur = exchangeId seul (sessionStorage ancien format)
  if (trimmed.includes('-curated-')) {
    return { mode: 'exchange', exchangeId: trimmed }
  }
  return { mode: 'random' }
}

export function devCuratedSelectionToPickOptions(
  selection: CuratedDevCuratedSelection,
  fallbackGender: ProtagonistGender = 'male',
): ParlerCorpusOptions & { packId?: string; exchangeId?: string; curatedAffinity?: CuratedParlerAffinity } {
  if (selection.mode === 'exchange') {
    const female = selection.exchangeId.includes('female-mc')
    return {
      nsfwContent: true,
      protagonistGender: female ? 'female' : 'male',
      exchangeId: selection.exchangeId,
    }
  }
  if (selection.mode === 'pack') {
    return {
      nsfwContent: true,
      protagonistGender: selection.protagonistGender,
      packId: selection.packId,
      curatedAffinity: selection.affinity,
    }
  }
  return {
    nsfwContent: true,
    protagonistGender: fallbackGender,
  }
}

/** Dev : tous les échanges curés (aff. 4–5 en double H/F). */
export function listCuratedDevExchangeOptions(
  affinityFilter?: number,
): CuratedDevExchangeOption[] {
  const affinities =
    affinityFilter !== undefined && isCuratedAffinity(affinityFilter)
      ? [affinityFilter]
      : [...CURATED_PARLER_AFFINITIES]

  const options: CuratedDevExchangeOption[] = []

  for (const level of affinities) {
    const maleCorpus = CORPUS_MALE_BY_AFFINITY[level]
    maleCorpus.exchanges.forEach((exchange, index) => {
      const num = String(index + 1).padStart(2, '0')
      const genderTag = isIntimateAffinity(level) ? ' H' : ''
      options.push({
        exchangeId: exchange.id,
        label: `${num} ${exchange.title} — aff. ${level}${genderTag}`,
        affinity: level,
        protagonistGender: 'male',
        sortKey: `${level}-${num}-H`,
      })
    })

    if (isIntimateAffinity(level)) {
      const femaleCorpus = CORPUS_FEMALE_MC_BY_AFFINITY[level]
      femaleCorpus?.exchanges.forEach((exchange, index) => {
        const num = String(index + 1).padStart(2, '0')
        options.push({
          exchangeId: exchange.id,
          label: `${num} ${exchange.title} — aff. ${level} F`,
          affinity: level,
          protagonistGender: 'female',
          sortKey: `${level}-${num}-F`,
        })
      })
    }
  }

  return options.sort((left, right) => left.sortKey.localeCompare(right.sortKey))
}

export function listCuratedSessionPacks(
  affinity?: number,
  options: ParlerCorpusOptions = {},
): CuratedSessionPackOption[] {
  const affinities =
    affinity !== undefined && isCuratedAffinity(affinity)
      ? [affinity]
      : [...CURATED_PARLER_AFFINITIES]

  return affinities.flatMap((level) => {
    const corpus = getCuratedCorpus(level, options)
    if (!corpus) return []

    return (corpus.meta.sessionPacks ?? [])
      .filter(
        (pack) =>
          pack.exchangeIds.length >= CURATED_ROUNDS_PER_SESSION &&
          pack.exchangeIds.length <= CURATED_MAX_ROUNDS_PER_SESSION,
      )
      .map((pack) => ({
        id: pack.id,
        label: `${pack.label} (aff. ${level})`,
        conversationId: `lyra-aff${level}-curated-${pack.id}`,
        affinity: level,
      }))
  })
}

export function pickCuratedConversation(
  companionId: string,
  affinity: number,
  avoidId?: string,
  options: ParlerCorpusOptions & {
    packId?: string
    exchangeId?: string
    curatedAffinity?: CuratedParlerAffinity
  } = {},
): CompanionConversation | null {
  if (options.exchangeId) {
    const located = findExchangeInAllCorpora(options.exchangeId)
    if (!located) return null
    return buildSingleExchangeSession(located.exchange, located.affinity)
  }

  const level =
    options.curatedAffinity !== undefined && isCuratedAffinity(options.curatedAffinity)
      ? options.curatedAffinity
      : dialogueAffinityForParler(companionId, affinity)
  if (!isCuratedAffinity(level) || !usesCuratedCorpus(companionId, level, options)) return null

  const corpus = getCuratedCorpus(level, options)!
  const exchangeById = buildExchangeMap(corpus)
  const sessionPacks = corpus.meta.sessionPacks ?? []
  const protagonistGender =
    options.protagonistGender ??
    corpus.meta.protagonistGender ??
    'male'

  if (options.packId) {
    const pack = sessionPacks.find((entry) => entry.id === options.packId)
    if (pack) return resolvePack(level, pack, exchangeById, protagonistGender)
  }

  const candidates = sessionPacks
    .map((pack) => resolvePack(level, pack, exchangeById, protagonistGender))
    .filter((session): session is CompanionConversation => session !== null)

  if (candidates.length === 0) return null

  const pool = avoidId ? candidates.filter((session) => session.id !== avoidId) : candidates
  const pickFrom = pool.length > 0 ? pool : candidates

  return pickFrom[Math.floor(Math.random() * pickFrom.length)] ?? null
}

export const CURATED_LYRA_AFF1_COUNT = curatedAff1.exchanges.length
export const CURATED_LYRA_AFF1_PACK_COUNT = (curatedAff1.meta.sessionPacks ?? []).length
export const CURATED_LYRA_AFF2_COUNT = curatedAff2.exchanges.length
export const CURATED_LYRA_AFF2_PACK_COUNT = (curatedAff2.meta.sessionPacks ?? []).length
export const CURATED_LYRA_AFF4_COUNT = curatedAff4.exchanges.length
export const CURATED_LYRA_AFF4_PACK_COUNT = (curatedAff4.meta.sessionPacks ?? []).length
export const CURATED_LYRA_AFF5_COUNT = curatedAff5.exchanges.length
export const CURATED_LYRA_AFF5_PACK_COUNT = (curatedAff5.meta.sessionPacks ?? []).length
