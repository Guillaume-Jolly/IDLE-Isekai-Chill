import { useEffect, useMemo, useState } from 'react'
import {
  companionBackgroundWidePathCandidates,
  companionPortraitLayerSources,
  type CompanionPortraitLayerSources,
} from '../data/companionAssets'
import { publicAssetCandidates } from '../data/publicAssetUrl'
import { useIsMobileLayout } from './useMediaQuery'

export type CompanionPortraitMode = 'loading' | 'layered' | 'cutout-only' | 'composed' | 'missing'

export type CompanionPortraitAssets = {
  mode: CompanionPortraitMode
  backgroundSrc: string | null
  cutoutSrc: string | null
  composedSrc: string | null
}

function probeUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

async function firstAvailable(candidates: string[]): Promise<string | null> {
  for (const relative of candidates) {
    const urls = publicAssetCandidates(relative)
    for (const url of urls) {
      if (await probeUrl(url)) return url
    }
  }
  return null
}

async function resolvePortraitAssets(
  sources: CompanionPortraitLayerSources,
  cutoutOnly: boolean,
  preferSceneBackground: boolean,
  useWideBackground: boolean,
): Promise<CompanionPortraitAssets> {
  const [cutoutSrc, composedSrc] = await Promise.all([
    firstAvailable(sources.cutout),
    cutoutOnly ? Promise.resolve(null) : firstAvailable(sources.composed),
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

  const backgroundSrc = await firstAvailable(backgroundCandidates)

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
    resolvePortraitAssets(sources, cutoutOnly, Boolean(sceneId), !isMobileLayout).then((next) => {
      if (!cancelled) setAssets(next)
    })
    return () => {
      cancelled = true
    }
  }, [cutoutOnly, isMobileLayout, sceneId, sources])

  return assets
}
