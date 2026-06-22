export type {
  CompanionConversation,
  DialogueChoice,
  DialogueRound,
  DialogueTone,
} from './conversations/types'

export {
  buildConversation,
  CONVERSATIONS_PER_COMPANION,
  COMPANION_SCENARIO_PACKS,
  getCompanionScenario,
  getPreferredTone,
  hasConversationSupport,
  pickConversation,
  previewPreferredTones,
  scoreFromChoices,
  SCENARIOS_PER_COMPANION,
} from './conversations/engine'

export { COMPANION_DIALOGUE_PROFILES, ALL_COMPANION_IDS } from './conversations/profiles'
export { DIALOGUE_TONES, TONE_LABELS } from './conversations/types'
