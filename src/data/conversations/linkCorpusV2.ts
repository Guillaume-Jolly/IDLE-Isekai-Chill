/**
 * Corpus Lien v2 — métadonnées + chargement lazy (voir linkCorpusV2Loader.ts).
 * Source validation : src/data/linkCorpusV2.json
 */
export type { LinkCorpusV2Scenario } from './linkCorpusV2Loader'
export {
  ensureLinkCorpusManifestAvailable,
  getLinkCorpusSessionLocalScenario,
  getLinkCorpusSessionPackSize,
  getLinkCorpusV2BatchCount,
  getLinkCorpusV2Pack,
  getLinkCorpusV2PackSize,
  getLinkCorpusV2Scenario,
  hasLinkCorpusV2,
  LINK_CORPUS_V2_REJECTED_COUNT,
  LINK_CORPUS_V2_SCENARIO_COUNT,
  LINK_CORPUS_V2_VERSION,
  linkCorpusV2CompanionIds,
  prepareLinkCorpusSession,
  resetLinkCorpusSession,
} from './linkCorpusV2Loader'
