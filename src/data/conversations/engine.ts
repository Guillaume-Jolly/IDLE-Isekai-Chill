import { ALL_COMPANION_IDS, COMPANION_DIALOGUE_PROFILES } from './profiles'
import {
  COMPANION_SCENARIO_PACKS,
  SCENARIOS_PER_COMPANION,
} from './companionScenarios.generated'
import type {
  CompanionConversation,
  CompanionScenarioSeed,
  DialogueChoice,
  DialogueRound,
  DialogueTone,
  ScriptedChoice,
} from './types'
import { DIALOGUE_TONES } from './types'

const hashString = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

const fillText = (text: string | null | undefined, name: string, place: string) =>
  String(text ?? '').replaceAll('{name}', name).replaceAll('{place}', place)

const shuffle = <T,>(items: T[]) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const getCompanionScenario = (
  companionId: string,
  scenarioIndex: number,
): CompanionScenarioSeed | null => {
  const pack = COMPANION_SCENARIO_PACKS[companionId]
  if (!pack) return null
  return pack[scenarioIndex] ?? null
}

/** Ton préféré pour ce compagnon sur cet échange — unique par personnage. */
export const getPreferredTone = (
  companionId: string,
  scenarioIndex: number,
  roundIndex: number,
  roundToneHint: DialogueTone,
): DialogueTone => {
  const profile = COMPANION_DIALOGUE_PROFILES[companionId]
  if (!profile) return roundToneHint

  let bestTone: DialogueTone = 'sincere'
  let bestScore = -Infinity

  for (const tone of DIALOGUE_TONES) {
    const score =
      profile.toneWeights[tone] +
      (roundToneHint === tone ? 5 : 0) +
      (hashString(`${companionId}:${scenarioIndex}:${roundIndex}:${tone}`) % 4)

    if (score > bestScore) {
      bestScore = score
      bestTone = tone
    }
  }

  return bestTone
}

const mapChoice = (
  choice: ScriptedChoice,
  preferredTone: DialogueTone,
  name: string,
  place: string,
): DialogueChoice => ({
  text: fillText(choice.text, name, place),
  tone: choice.tone,
  score: choice.tone === preferredTone ? 1 : 0,
  reaction: fillText(choice.reaction, name, place),
})

const buildRound = (
  companionId: string,
  script: CompanionScenarioSeed,
  scenarioIndex: number,
  roundIndex: number,
): DialogueRound => {
  const profile = COMPANION_DIALOGUE_PROFILES[companionId]
  const name = profile?.name ?? 'Compagnon'
  const place = profile?.place ?? 'le village'
  const roundScript = script.rounds[roundIndex]
  if (!roundScript) {
    throw new Error(`Missing round ${roundIndex} for ${companionId} scenario ${scenarioIndex}`)
  }
  const preferredTone = getPreferredTone(
    companionId,
    scenarioIndex,
    roundIndex,
    script.roundToneHints[roundIndex],
  )

  const choices = roundScript.choices.map((choice) =>
    mapChoice(choice, preferredTone, name, place),
  ) as [DialogueChoice, DialogueChoice, DialogueChoice, DialogueChoice]

  return {
    context: roundScript.context.map((line) => fillText(line, name, place)),
    prompt: fillText(roundScript.prompt, name, place),
    choices,
  }
}

export const buildConversation = (
  companionId: string,
  scenarioIndex: number,
): CompanionConversation | null => {
  const profile = COMPANION_DIALOGUE_PROFILES[companionId]
  const script = getCompanionScenario(companionId, scenarioIndex)
  if (!profile || !script) return null

  const rounds = [0, 1, 2].map((roundIndex) =>
    buildRound(companionId, script, scenarioIndex, roundIndex),
  ) as [DialogueRound, DialogueRound, DialogueRound]

  return {
    id: script.id,
    companionId,
    title: script.title,
    personalityHint: profile.personalityHint,
    minAffinity: script.minAffinity,
    maxAffinity: script.maxAffinity,
    rounds,
  }
}

const scenarioIndicesForAffinity = (companionId: string, affinity: number) => {
  const indices: number[] = []
  for (let index = 0; index < SCENARIOS_PER_COMPANION; index += 1) {
    const script = getCompanionScenario(companionId, index)
    if (!script) continue
    if (affinity >= script.minAffinity && affinity <= script.maxAffinity) {
      indices.push(index)
    }
  }
  return indices
}

export function pickConversation(companionId: string, affinity: number, avoidId?: string) {
  if (!COMPANION_DIALOGUE_PROFILES[companionId]) {
    return null
  }

  const eligible = scenarioIndicesForAffinity(companionId, affinity)
  const fullPool = Array.from({ length: SCENARIOS_PER_COMPANION }, (_, index) => index)
  const basePool = eligible.length > 0 ? eligible : fullPool

  let candidates = basePool.filter((index) => {
    const script = getCompanionScenario(companionId, index)
    return script && script.id !== avoidId
  })

  if (candidates.length === 0) {
    candidates = fullPool.filter((index) => {
      const script = getCompanionScenario(companionId, index)
      return script && script.id !== avoidId
    })
  }

  if (candidates.length === 0 && avoidId) {
    candidates = fullPool.filter((index) => {
      const script = getCompanionScenario(companionId, index)
      return Boolean(script)
    })
  }

  const picked = shuffle(candidates)[0]
  if (picked === undefined) return null

  return buildConversation(companionId, picked)
}

export function scoreFromChoices(scores: number[]) {
  return scores.reduce((sum, value) => sum + value, 0)
}

export const CONVERSATIONS_PER_COMPANION = SCENARIOS_PER_COMPANION

export const hasConversationSupport = (companionId: string) =>
  ALL_COMPANION_IDS.includes(companionId)

export const previewPreferredTones = (companionId: string, scenarioIndex: number) => {
  const script = getCompanionScenario(companionId, scenarioIndex)
  if (!script) return []
  return script.roundToneHints.map((hint, roundIndex) =>
    getPreferredTone(companionId, scenarioIndex, roundIndex, hint),
  )
}

export { COMPANION_SCENARIO_PACKS, SCENARIOS_PER_COMPANION }
