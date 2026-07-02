import { useEffect, useMemo, useState } from 'react'
import {
  companionBackgroundWidePathCandidates,
  companionEmotionCutoutPathCandidates,
  companionPortraitLayerSources,
  type CompanionEmotionId,
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
  emotion: CompanionEmotionId | undefined,
) {
  return JSON.stringify({ sources, cutoutOnly, preferSceneBackground, useWideBackground, emotion })
}

async function resolvePortraitAssets(
  sources: CompanionPortraitLayerSources,
  cutoutOnly: boolean,
  preferSceneBackground: boolean,
  useWideBackground: boolean,
  companionId: string,
  emotion: CompanionEmotionId | undefined,
): Promise<CompanionPortraitAssets> {
  if (emotion) {
    const emotionSrc = await resolveFirstAvailableRelative(
      companionEmotionCutoutPathCandidates(companionId, emotion),
    )
    if (emotionSrc) {
      return { mode: 'cutout-only', backgroundSrc: null, cutoutSrc: emotionSrc, composedSrc: null }
    }
  }

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
  companionId: string,
  emotion: CompanionEmotionId | undefined,
) {
  const key = portraitCacheKey(sources, cutoutOnly, preferSceneBackground, useWideBackground, emotion)
  let pending = portraitResolveCache.get(key)
  if (!pending) {
    pending = resolvePortraitAssets(
      sources,
      cutoutOnly,
      preferSceneBackground,
      useWideBackground,
      companionId,
      emotion,
    )
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
    emotion?: CompanionEmotionId
  },
): CompanionPortraitAssets {
  const cutoutOnly = options?.cutoutOnly ?? false
  const sceneId = options?.sceneId
  const emotion = options?.emotion
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
    setAssets({
      mode: 'loading',
      backgroundSrc: null,
      cutoutSrc: null,
      composedSrc: null,
    })
    getCachedPortraitAssets(
      sources,
      cutoutOnly,
      Boolean(sceneId),
      !isMobileLayout,
      companionId,
      emotion,
    ).then((next) => {
      if (!cancelled) setAssets(next)
    })
    return () => {
      cancelled = true
    }
  }, [companionId, cutoutOnly, emotion, isMobileLayout, sceneId, sources])

  return assets
}

export function resetCompanionPortraitResolveCacheForTests() {
  portraitResolveCache.clear()
}
