import { useEffect, useMemo, useState } from 'react'
import {
  companionBackgroundWidePathCandidates,
  companionPortraitLayerSources,
  type CompanionPortraitLayerSources,
} from '../data/companionAssets'
import { resolveFirstAvailableRelative } from '../lib/assetProbeCache'
import { useIsMobileLayout } from './useMediaQuery'

export type CompanionPortraitMode = 'loading' | 'layered' | 'cutout-only' | 'composed' | 'missing'

export type CompanionPortraitAssets = {
  mode: CompanionPortraitMode
  backgroundSrc: string | null
  cutoutSrc: string | null
  composedSrc: string | null
}

const portraitResolveCache = new Map<string, Promise<CompanionPortraitAssets>>()

function portraitCacheKey(
  sources: CompanionPortraitLayerSources,
  cutoutOnly: boolean,
  preferSceneBackground: boolean,
  useWideBackground: boolean,
) {
  return JSON.stringify({ sources, cutoutOnly, preferSceneBackground, useWideBackground })
}

async function resolvePortraitAssets(
  sources: CompanionPortraitLayerSources,
  cutoutOnly: boolean,
  preferSceneBackground: boolean,
  useWideBackground: boolean,
): Promise<CompanionPortraitAssets> {
  const [cutoutSrc, composedSrc] = await Promise.all([
    resolveFirstAvailableRelative(sources.cutout),
    cutoutOnly ? Promise.resolve(null) : resolveFirstAvailableRelative(sources.composed),
  ])

  if (cutoutOnly) {
    if (cutoutSrc) return { mode: 'cutout-only', backgroundSrc: null, cutoutSrc, composedSrc: null }
    if (composedSrc) return { mode: 'composed', backgroundSrc: null, cutoutSrc: null, composedSrc }
    return { mode: 'missing', backgroundSrc: null, cutoutSrc: null, composedSrc: null }
  }

  const backgroundCandidates =
    preferSceneBackground && sources.sceneBackground?.length
      ? sources.sceneBackground
      : useWideBackground
        ? sources.backgroundWide ?? sources.background
        : sources.background

  const backgroundSrc = await resolveFirstAvailableRelative(backgroundCandidates)

  if (cutoutSrc && backgroundSrc) {
    return { mode: 'layered', backgroundSrc, cutoutSrc, composedSrc: null }
  }

  if (composedSrc) {
    return { mode: 'composed', backgroundSrc: null, cutoutSrc: null, composedSrc }
  }

  if (cutoutSrc) {
    return { mode: 'cutout-only', backgroundSrc: null, cutoutSrc, composedSrc: null }
  }

  return { mode: 'missing', backgroundSrc: null, cutoutSrc: null, composedSrc: null }
}

function getCachedPortraitAssets(
  sources: CompanionPortraitLayerSources,
  cutoutOnly: boolean,
  preferSceneBackground: boolean,
  useWideBackground: boolean,
) {
  const key = portraitCacheKey(sources, cutoutOnly, preferSceneBackground, useWideBackground)
  let pending = portraitResolveCache.get(key)
  if (!pending) {
    pending = resolvePortraitAssets(sources, cutoutOnly, preferSceneBackground, useWideBackground)
    portraitResolveCache.set(key, pending)
  }
  return pending
}

export function useCompanionPortraitAssets(
  companionId: string,
  level: number,
  options?: {
    cutoutOnly?: boolean
    sceneId?: string
  },
): CompanionPortraitAssets {
  const cutoutOnly = options?.cutoutOnly ?? false
  const sceneId = options?.sceneId
  const isMobileLayout = useIsMobileLayout()

  const sources = useMemo(
    () => ({
      ...companionPortraitLayerSources(companionId, level, sceneId),
      backgroundWide: companionBackgroundWidePathCandidates(companionId, level),
    }),
    [companionId, level, sceneId],
  )

  const [assets, setAssets] = useState<CompanionPortraitAssets>({
    mode: 'loading',
    backgroundSrc: null,
    cutoutSrc: null,
    composedSrc: null,
  })

  useEffect(() => {
    let cancelled = false
    getCachedPortraitAssets(sources, cutoutOnly, Boolean(sceneId), !isMobileLayout).then((next) => {
      if (!cancelled) setAssets(next)
    })
    return () => {
      cancelled = true
    }
  }, [cutoutOnly, isMobileLayout, sceneId, sources])

  return assets
}

export function resetCompanionPortraitResolveCacheForTests() {
  portraitResolveCache.clear()
}
