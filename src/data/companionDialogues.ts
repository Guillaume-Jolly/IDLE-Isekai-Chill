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
  pickConversationAsync,
  previewPreferredTones,
  scoreFromChoices,
  SCENARIOS_PER_COMPANION,
} from './conversations/engine'

export { COMPANION_DIALOGUE_PROFILES, ALL_COMPANION_IDS } from './conversations/profiles'
export {
  CURATED_PARLER_ONLY,
  CURATED_PARLER_COMPANION_ID,
  canUseParlerDialogues,
  dialogueAffinityForParler,
  hasParlerDialoguesAtAffinity,
  defaultParlerDialogueAffinity,
  CURATED_LYRA_AFF1_COUNT,
  CURATED_LYRA_AFF1_PACK_COUNT,
  listCuratedSessionPacks,
  listCuratedDevExchangeOptions,
  listCuratedDevPackOptions,
  parseDevCuratedSelection,
  serializeDevCuratedSelection,
  devCuratedSelectionToPickOptions,
  devPackSelectionFromQueryParam,
  type CuratedSessionPackOption,
  type CuratedDevExchangeOption,
  type CuratedDevPackOption,
  type CuratedDevCuratedSelection,
  type ParlerCorpusOptions,
} from './conversations/curatedCorpus'
export { DIALOGUE_TONES, TONE_LABELS } from './conversations/types'
