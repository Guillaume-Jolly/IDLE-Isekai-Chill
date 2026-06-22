export type DialogueTone = 'sincere' | 'playful' | 'direct' | 'romantic'

export const DIALOGUE_TONES: DialogueTone[] = ['sincere', 'playful', 'direct', 'romantic']

export const TONE_LABELS: Record<DialogueTone, string> = {
  sincere: 'Sincère',
  playful: 'Joueur',
  direct: 'Direct',
  romantic: 'Romantique',
}

export type DialogueChoice = {
  text: string
  tone: DialogueTone
  score: 0 | 1
  reaction: string
}

export type DialogueRound = {
  /** Bulles de mise en contexte avant la question du compagnon */
  context: string[]
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
  rounds: [DialogueRound, DialogueRound, DialogueRound]
}

export type CompanionDialogueProfile = {
  id: string
  name: string
  place: string
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
