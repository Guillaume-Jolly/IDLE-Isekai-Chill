/**
 * Préchargement des assets runtime avec progression (splash + jeu).
 */
import { preloadImageUrl, resolveFirstAvailableRelative, assetProbeCacheStats } from './assetProbeCache'
import {
  collectAllGameWarmupTasks,
  collectCriticalWarmupTasks,
  collectDeferredWarmupTasks,
  collectSplashWarmupUrls,
  WARMUP_PHASE_LABELS,
  type WarmupPhase,
} from './gameWarmupPaths'

export { collectCompanionWarmupRelatives } from './gameWarmupPaths'

const BATCH_SIZE = 12

export type WarmupProgress = {
  done: number
  total: number
  ratio: number
  label: string
  phase?: WarmupPhase
}

export type WarmupProgressHandler = (progress: WarmupProgress) => void

async function runInBatches<T>(items: T[], batchSize: number, worker: (item: T) => Promise<void>) {
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize)
    await Promise.all(batch.map(worker))
  }
}

let warmupPromise: Promise<void> | null = null
let warmupCompleted = false

export function isGameAssetWarmupComplete(): boolean {
  return warmupCompleted
}

function emitProgress(
  onProgress: WarmupProgressHandler | undefined,
  done: number,
  total: number,
  label: string,
  phase?: WarmupPhase,
) {
  onProgress?.({
    done,
    total,
    ratio: total > 0 ? done / total : 1,
    label,
    phase,
  })
}

export type WarmupScope = 'critical' | 'deferred' | 'full'

function tasksForScope(scope: WarmupScope) {
  if (scope === 'critical') return collectCriticalWarmupTasks()
  if (scope === 'deferred') return collectDeferredWarmupTasks()
  return collectAllGameWarmupTasks()
}

export function warmupGameAssets(
  onProgress?: WarmupProgressHandler,
  options?: { scope?: WarmupScope },
): Promise<void> {
  const scope = options?.scope ?? 'full'
  if (scope === 'full' && warmupPromise) return warmupPromise

  const run = async () => {
    const splashUrls = scope === 'deferred' ? [] : collectSplashWarmupUrls()
    const pathTasks = tasksForScope(scope)
    const total = splashUrls.length + pathTasks.length
    let done = 0
    let currentPhase: WarmupPhase | undefined = scope === 'deferred' ? 'myrions' : 'splash'

    const labelFor = (phase?: WarmupPhase) =>
      phase ? WARMUP_PHASE_LABELS[phase] : scope === 'deferred' ? 'Cache en arrière-plan…' : 'Prêt'

    emitProgress(onProgress, done, total, labelFor(currentPhase), currentPhase)

    await runInBatches(splashUrls, BATCH_SIZE, async (url) => {
      await preloadImageUrl(url)
      done += 1
      emitProgress(onProgress, done, total, WARMUP_PHASE_LABELS.splash, 'splash')
    })

    await runInBatches(pathTasks, BATCH_SIZE, async (task) => {
      currentPhase = task.phase
      await resolveFirstAvailableRelative(task.relatives)
      done += 1
      emitProgress(onProgress, done, total, WARMUP_PHASE_LABELS[task.phase], task.phase)
    })

    const stats = assetProbeCacheStats()
    console.info(
      `[Havre des Brumes] Warmup ${scope} : ${done}/${total} · cache ${stats.entries} entrées`,
    )
    emitProgress(onProgress, total, total, 'Prêt', currentPhase)
    if (scope === 'full') warmupCompleted = true
  }

  if (scope === 'full') {
    warmupPromise = run().catch((error) => {
      warmupPromise = null
      warmupCompleted = false
      console.warn('[Havre des Brumes] Warmup assets interrompu', error)
      throw error
    })
    return warmupPromise
  }

  return run().catch((error) => {
    console.warn(`[Havre des Brumes] Warmup ${scope} interrompu`, error)
    throw error
  })
}

/** Précharge lourde après entrée au village (non bloquant). */
export function warmupGameAssetsDeferred(): Promise<void> {
  return warmupGameAssets(undefined, { scope: 'deferred' })
}

/** @deprecated Utiliser warmupGameAssets */
export function warmupCompanionDevAssets(onProgress?: WarmupProgressHandler): Promise<void> {
  return warmupGameAssets(onProgress)
}

export function resetGameAssetWarmupForTests() {
  warmupPromise = null
  warmupCompleted = false
}

