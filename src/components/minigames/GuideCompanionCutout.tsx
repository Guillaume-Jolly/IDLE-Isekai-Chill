import { useEffect, useMemo, useState } from 'react'
import {
  companionGuideCutoutPngPathCandidates,
  type GuidePose,
} from '../../data/minigameAssets'
import { usePublicAssetSrc } from '../../hooks/usePublicAssetSrc'

type GuideCompanionCutoutProps = {
  companionId: string
  name: string
  pose?: GuidePose
  side?: 'left' | 'right'
  biomeId?: string
  /** Animation de joie sans changer l image. */
  celebrate?: boolean
  /** Réaction douce en cas d échec. */
  commiserate?: boolean
  speech?: {
    line: string
    detail?: string
    tone: 'success' | 'failed'
  }
}

type LoadTier = 'biome-pose' | 'biome-point' | 'default-png' | 'svg' | 'hidden'

function tierCandidates(
  companionId: string,
  pose: GuidePose,
  biomeId: string | undefined,
  tier: LoadTier,
): string[] {
  if (tier === 'svg') {
    return [`assets/minigames/capture/companions/${companionId}/${pose}.svg`]
  }
  if (tier === 'biome-pose' && biomeId) {
    return companionGuideCutoutPngPathCandidates(companionId, pose, biomeId)
  }
  if (tier === 'biome-point' && biomeId) {
    return companionGuideCutoutPngPathCandidates(companionId, 'point', biomeId)
  }
  return companionGuideCutoutPngPathCandidates(companionId, pose)
}

export function GuideCompanionCutout({
  companionId,
  name,
  pose = 'point',
  side = 'left',
  biomeId,
  celebrate = false,
  commiserate = false,
  speech,
}: GuideCompanionCutoutProps) {
  const [tier, setTier] = useState<LoadTier>(biomeId ? 'biome-pose' : 'default-png')
  const candidates = useMemo(
    () => tierCandidates(companionId, pose, biomeId, tier),
    [companionId, pose, biomeId, tier],
  )
  const [src, onError, exhausted] = usePublicAssetSrc(candidates[0], candidates.slice(1))
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)

  useEffect(() => {
    setTier(biomeId ? 'biome-pose' : 'default-png')
  }, [biomeId, companionId, pose])

  useEffect(() => {
    if (!exhausted) return
    setTier((current) => {
      if (current === 'biome-pose') return 'biome-point'
      if (current === 'biome-point') return 'default-png'
      if (current === 'default-png') return 'svg'
      return 'hidden'
    })
  }, [exhausted])

  useEffect(() => {
    if (!src) return
    const img = new Image()
    img.src = src
    if (img.complete) {
      setLoadedSrc(src)
    }
  }, [src])

  if (tier === 'hidden') {
    return null
  }

  const isLoaded = loadedSrc === src

  return (
    <div
      className={`mg-guide-cutout ${side}${celebrate ? ' celebrate' : ''}${
        commiserate ? ' commiserate' : ''
      }${speech ? ' has-speech' : ''}`}
    >
      {speech ? (
        <div
          className={`mg-guide-speech-bubble tone-${speech.tone}`}
          key={`${speech.tone}-${speech.line}-${speech.detail ?? ''}`}
        >
          <p className="mg-guide-speech-line">{speech.line}</p>
          {speech.detail ? <p className="mg-guide-speech-detail">{speech.detail}</p> : null}
        </div>
      ) : null}
      <div className="mg-guide-cutout-figure">
        <img
          alt={`${name} guide la capture`}
          className={`mg-guide-cutout-img${
            isLoaded && !celebrate && !commiserate ? ' mg-guide-idle' : ''
          }`}
          draggable={false}
          onLoad={() => {
            setLoadedSrc(src)
          }}
          onError={onError}
          src={src}
        />
      </div>
    </div>
  )
}
