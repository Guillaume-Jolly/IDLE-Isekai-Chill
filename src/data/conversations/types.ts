import type { CompanionEmotionId } from '../companionAssets'

import type { ParlerRoundOutcomeMeta } from './parlerSessionSummary'

export type DialogueTone = 'sincere' | 'playful' | 'direct' | 'romantic'

export const DIALOGUE_TONES: DialogueTone[] = ['sincere', 'playful', 'direct', 'romantic']

export const TONE_LABELS: Record<DialogueTone, string> = {
  sincere: 'Sincère',
  playful: 'Joueur',
  direct: 'Direct',
  romantic: 'Romantique',
}

/** Points par choix en session Parler curée : sincere +3 … romantic +0. */
export const DIALOGUE_SCORE_BY_TONE: Record<DialogueTone, 0 | 1 | 2 | 3> = {
  sincere: 3,
  direct: 2,
  playful: 1,
  romantic: 0,
}

export const MAX_DIALOGUE_CHOICE_SCORE = 3

export type DialogueChoiceScore = 0 | 1 | 2 | 3

export type DialogueChoice = {
  text: string
  tone: DialogueTone
  score: DialogueChoiceScore
  reaction: string
  /** Cutout émotion affiché après ce choix (réaction de Lyra). */
  emotion?: CompanionEmotionId
}

export type DialogueRound = {
  /** Bulles de mise en contexte avant la question du compagnon */
  context: string[]
  /** Aff. 4+ action : ce que Lyra fait (3e personne), affiché avant la réplique. */
  companionAction?: string
  /** Aff. 5 NSFW : épilogue narrateur (2e pers. tu) après échange réussi (score ≥ 2). */
  intimateFinale?: string
  /** Aff. 5 NSFW : épilogue alternatif si score ≤ 1 (playful/direct). */
  intimateFinaleLow?: string
  /** Aff. 5 curé : bilan attendu si l'échange réussit (score ≥ 2). */
  sessionOutcome?: ParlerRoundOutcomeMeta
  prompt: string
  choices: [DialogueChoice, DialogueChoice, DialogueChoice, DialogueChoice]
}

export type CompanionConversation = {
  id: string
  companionId: string
  title: string
  personalityHint: string
  minAffinity: number
  maxAffinity: number
  rounds: DialogueRound[]
  /** Aff. 5 NSFW : épilogue de clôture après le dernier échange du pack (session complète). */
  packIntimateFinale?: string
  /** Aff. 5 NSFW : variante basse si score session insuffisant. */
  packIntimateFinaleLow?: string
  /** Aff. 5 NSFW : décor + clôture statiques ; segment central composé depuis le déroulé. */
  packIntimateFinaleTemplate?: {
    setting: string
    closing: string
  }
}

export type { ParlerRoundOutcomeMeta, ParlerSessionAct } from './parlerSessionSummary'

export type ParlerPowerDynamic =
  | 'companion_dominant'
  | 'companion_invites'
  | 'mutual'
  | 'protagonist_invited'

export type CompanionDialogueProfile = {
  id: string
  name: string
  place: string
  /** Hint aff. 1–2 par défaut — aff. 4+ : voir `parlerProfiles.ts`. */
  personalityHint: string
  toneWeights: Record<DialogueTone, number>
}

export type ScriptedChoice = {
  text: string
  tone: DialogueTone
  reaction: string
}

export type ScriptedRound = {
  context: string[]
  prompt: string
  choices: [ScriptedChoice, ScriptedChoice, ScriptedChoice, ScriptedChoice]
}

export type ScenarioScript = {
  id: string
  title: string
  minAffinity: number
  maxAffinity: number
  /** Indice de ton pour chaque échange — le compagnon préfère une réponse adaptée */
  roundToneHints: [DialogueTone, DialogueTone, DialogueTone]
  rounds: [ScriptedRound, ScriptedRound, ScriptedRound]
}

/** Scénario brut généré par compagnon (sans companionId). */
export type CompanionScenarioSeed = ScenarioScript

export type CompanionScenarioPack = Record<string, CompanionScenarioSeed[]>
