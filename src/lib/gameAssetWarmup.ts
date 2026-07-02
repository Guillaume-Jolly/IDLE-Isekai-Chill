/**
 * Préchargement des assets runtime avec progression (splash + jeu).
 */
import { preloadImageUrl, resolveFirstAvailableRelative, assetProbeCacheStats } from './assetProbeCache'
import {
  collectAllGameWarmupTasks,
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

export function warmupGameAssets(onProgress?: WarmupProgressHandler): Promise<void> {
  if (warmupPromise) return warmupPromise

  warmupPromise = (async () => {
    const splashUrls = collectSplashWarmupUrls()
    const pathTasks = collectAllGameWarmupTasks()
    const total = splashUrls.length + pathTasks.length
    let done = 0
    let currentPhase: WarmupPhase | undefined = 'splash'

    emitProgress(onProgress, done, total, WARMUP_PHASE_LABELS.splash, currentPhase)

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
      `[Havre des Brumes] Warmup assets : ${done}/${total} · cache ${stats.entries} entrées`,
    )
    emitProgress(onProgress, total, total, 'Prêt', currentPhase)
    warmupCompleted = true
  })().catch((error) => {
    warmupPromise = null
    warmupCompleted = false
    console.warn('[Havre des Brumes] Warmup assets interrompu', error)
    throw error
  })

  return warmupPromise
}

/** @deprecated Utiliser warmupGameAssets */
export function warmupCompanionDevAssets(onProgress?: WarmupProgressHandler): Promise<void> {
  return warmupGameAssets(onProgress)
}

export function resetGameAssetWarmupForTests() {
  warmupPromise = null
  warmupCompleted = false
}

