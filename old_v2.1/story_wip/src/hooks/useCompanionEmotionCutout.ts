import { useEffect, useState } from 'react'
import {
  companionEmotionCutoutPathCandidates,
  type CompanionEmotionId,
} from '../data/companionAssets'
import { publicAssetCandidates } from '../data/publicAssetUrl'

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
    for (const url of publicAssetCandidates(relative)) {
      if (await probeUrl(url)) return url
    }
  }
  return null
}

export function useCompanionEmotionCutout(companionId: string, emotion: CompanionEmotionId) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    firstAvailable(companionEmotionCutoutPathCandidates(companionId, emotion)).then((url) => {
      if (!cancelled) setSrc(url)
    })
    return () => {
      cancelled = true
    }
  }, [companionId, emotion])

  return src
}
