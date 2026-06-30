/**
 * Cache mémoire des probes Image + résolution du premier URL valide.
 * Évite les re-fetch séquentiels (404 legacy) à chaque montage d’onglet.
 */
import { publicAssetCandidates, publicAssetUrl } from '../data/publicAssetUrl'

const probeCache = new Map<string, boolean>()
const probeInflight = new Map<string, Promise<boolean>>()

export function probeImageUrl(url: string): Promise<boolean> {
  const cached = probeCache.get(url)
  if (cached !== undefined) return Promise.resolve(cached)

  const inflight = probeInflight.get(url)
  if (inflight) return inflight

  const promise = new Promise<boolean>((resolve) => {
    const img = new Image()
    img.onload = () => {
      probeCache.set(url, true)
      probeInflight.delete(url)
      resolve(true)
    }
    img.onerror = () => {
      probeCache.set(url, false)
      probeInflight.delete(url)
      resolve(false)
    }
    img.src = url
  })

  probeInflight.set(url, promise)
  return promise
}

/** Probes parallèles — conserve l’ordre de priorité des chemins relatifs. */
export async function resolveFirstAvailableRelative(candidates: string[]): Promise<string | null> {
  if (candidates.length === 0) return null

  const orderedUrls: string[] = []
  const seen = new Set<string>()

  for (const relative of candidates) {
    for (const url of publicAssetCandidates(relative)) {
      if (seen.has(url)) continue
      seen.add(url)
      orderedUrls.push(url)
    }
  }

  if (orderedUrls.length === 0) return publicAssetUrl(candidates[0])

  const results = await Promise.all(
    orderedUrls.map(async (url) => ({ url, ok: await probeImageUrl(url) })),
  )

  return results.find((entry) => entry.ok)?.url ?? null
}

export function preloadImageUrl(url: string): Promise<boolean> {
  return probeImageUrl(url)
}

export function assetProbeCacheStats() {
  let hits = 0
  let misses = 0
  for (const value of probeCache.values()) {
    if (value) hits += 1
    else misses += 1
  }
  return { entries: probeCache.size, hits, misses }
}

export function resetAssetProbeCacheForTests() {
  probeCache.clear()
  probeInflight.clear()
}
