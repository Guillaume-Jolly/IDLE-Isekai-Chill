import linkCorpusData from '../linkCorpusV2.json'
import type { CompanionScenarioSeed } from './types'

export type LinkCorpusV2Scenario = CompanionScenarioSeed & { companionId: string }

type LinkCorpusV2File = {
  version: number
  scenarios: LinkCorpusV2Scenario[]
  rejected?: { id: string; reason: string }[]
}

const corpus = linkCorpusData as unknown as LinkCorpusV2File

const packsByCompanion: Record<string, LinkCorpusV2Scenario[]> = {}

for (const scenario of corpus.scenarios) {
  if (!packsByCompanion[scenario.companionId]) {
    packsByCompanion[scenario.companionId] = []
  }
  packsByCompanion[scenario.companionId].push(scenario)
}

export const LINK_CORPUS_V2_VERSION = corpus.version
export const LINK_CORPUS_V2_SCENARIO_COUNT = corpus.scenarios.length
export const LINK_CORPUS_V2_REJECTED_COUNT = corpus.rejected?.length ?? 0
export const hasLinkCorpusV2 = corpus.scenarios.length > 0

export const getLinkCorpusV2Pack = (companionId: string): LinkCorpusV2Scenario[] =>
  packsByCompanion[companionId] ?? []

export const getLinkCorpusV2Scenario = (
  companionId: string,
  index: number,
): LinkCorpusV2Scenario | null => getLinkCorpusV2Pack(companionId)[index] ?? null

export const linkCorpusV2CompanionIds = () => Object.keys(packsByCompanion)
