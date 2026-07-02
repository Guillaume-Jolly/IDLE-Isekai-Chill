/**
 * Chargement lazy du corpus Lien v2 — lots de 50 via /public/data/link-corpus/.
 */
import type { CompanionScenarioSeed } from './types'
import { LINK_CORPUS_BATCH_SIZE, LINK_CORPUS_MANIFEST } from './linkCorpusManifest'

export type LinkCorpusV2Scenario = CompanionScenarioSeed & { companionId: string }

export const LINK_CORPUS_V2_VERSION = LINK_CORPUS_MANIFEST.version
export const LINK_CORPUS_V2_SCENARIO_COUNT = LINK_CORPUS_MANIFEST.scenarioCount
export const LINK_CORPUS_V2_REJECTED_COUNT = LINK_CORPUS_MANIFEST.rejectedCount
export const hasLinkCorpusV2 = LINK_CORPUS_MANIFEST.scenarioCount > 0

type SessionState = { batchIndex: number }

const scenarioCache = new Map<string, LinkCorpusV2Scenario>()
const loadedBatchKeys = new Set<string>()
const sessionByCompanion = new Map<string, SessionState>()
const batchPromises = new Map<string, Promise<void>>()

function cacheKey(companionId: string, globalIndex: number) {
  return `${companionId}:${globalIndex}`
}

function batchKey(companionId: string, batchIndex: number) {
  return `${companionId}:${batchIndex}`
}

function batchPath(companionId: string, batchIndex: number) {
  return `/data/link-corpus/${companionId}/batch-${String(batchIndex).padStart(2, '0')}.json`
}

function companionMeta(companionId: string) {
  const companions = LINK_CORPUS_MANIFEST.companions as Record<
    string,
    { count: number; batches: number }
  >
  return companions[companionId]
}

export function getLinkCorpusV2PackSize(companionId: string): number {
  return companionMeta(companionId)?.count ?? 0
}

export function getLinkCorpusV2BatchCount(companionId: string): number {
  return companionMeta(companionId)?.batches ?? 0
}

export const linkCorpusV2CompanionIds = () => Object.keys(LINK_CORPUS_MANIFEST.companions)

export function getLinkCorpusV2Scenario(
  companionId: string,
  globalIndex: number,
): LinkCorpusV2Scenario | null {
  return scenarioCache.get(cacheKey(companionId, globalIndex)) ?? null
}

/** @deprecated Utiliser le cache session — compat tests */
export const getLinkCorpusV2Pack = (companionId: string): LinkCorpusV2Scenario[] => {
  const count = getLinkCorpusV2PackSize(companionId)
  const out: LinkCorpusV2Scenario[] = []
  for (let index = 0; index < count; index += 1) {
    const scenario = getLinkCorpusV2Scenario(companionId, index)
    if (scenario) out.push(scenario)
  }
  return out
}

async function fetchBatch(companionId: string, batchIndex: number): Promise<void> {
  const key = batchKey(companionId, batchIndex)
  if (loadedBatchKeys.has(key)) return

  const pending = batchPromises.get(key)
  if (pending) {
    await pending
    return
  }

  const promise = (async () => {
    const response = await fetch(batchPath(companionId, batchIndex))
    if (!response.ok) {
      throw new Error(`Corpus batch ${companionId} #${batchIndex} — HTTP ${response.status}`)
    }
    const payload = (await response.json()) as {
      scenarios: LinkCorpusV2Scenario[]
    }
    const baseIndex = batchIndex * LINK_CORPUS_BATCH_SIZE
    payload.scenarios.forEach((scenario, offset) => {
      scenarioCache.set(cacheKey(companionId, baseIndex + offset), scenario)
    })
    loadedBatchKeys.add(key)
  })()

  batchPromises.set(key, promise)
  try {
    await promise
  } finally {
    batchPromises.delete(key)
  }
}

function pickRandomBatch(companionId: string): number {
  const batches = getLinkCorpusV2BatchCount(companionId)
  if (batches <= 0) return 0
  return Math.floor(Math.random() * batches)
}

/** Prépare un lot de 50 scénarios pour la session mini-jeu Parler. */
export async function prepareLinkCorpusSession(
  companionId: string,
  options?: { advanceBatch?: boolean },
): Promise<number> {
  const batches = getLinkCorpusV2BatchCount(companionId)
  if (batches === 0) return 0

  let state = sessionByCompanion.get(companionId)
  if (!state || options?.advanceBatch) {
    const nextBatch =
      options?.advanceBatch && state
        ? (state.batchIndex + 1) % batches
        : pickRandomBatch(companionId)
    state = { batchIndex: nextBatch }
    sessionByCompanion.set(companionId, state)
  }

  await fetchBatch(companionId, state.batchIndex)
  return state.batchIndex
}

export function getLinkCorpusSessionBatchIndex(companionId: string): number {
  return sessionByCompanion.get(companionId)?.batchIndex ?? 0
}

export function getLinkCorpusSessionLocalScenario(
  companionId: string,
  localIndex: number,
): LinkCorpusV2Scenario | null {
  const batchIndex = getLinkCorpusSessionBatchIndex(companionId)
  const globalIndex = batchIndex * LINK_CORPUS_BATCH_SIZE + localIndex
  return getLinkCorpusV2Scenario(companionId, globalIndex)
}

export function getLinkCorpusSessionPackSize(companionId: string): number {
  const total = getLinkCorpusV2PackSize(companionId)
  const batchIndex = getLinkCorpusSessionBatchIndex(companionId)
  const batchStart = batchIndex * LINK_CORPUS_BATCH_SIZE
  return Math.min(LINK_CORPUS_BATCH_SIZE, Math.max(0, total - batchStart))
}

export function resetLinkCorpusSession(companionId?: string) {
  if (companionId) sessionByCompanion.delete(companionId)
  else sessionByCompanion.clear()
}

export async function ensureLinkCorpusManifestAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/data/link-corpus/manifest.json', { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
