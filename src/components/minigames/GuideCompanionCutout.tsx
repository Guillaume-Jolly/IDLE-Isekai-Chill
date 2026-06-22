import { useEffect, useState } from 'react'
import {
  companionGuideCutoutPngPath,
  companionGuideCutoutPath,
  type GuidePose,
} from '../../data/minigameAssets'

type GuideCompanionCutoutProps = {
  companionId: string
  name: string
  pose?: GuidePose
  side?: 'left' | 'right'
}

type LoadTier = 'png' | 'svg' | 'hidden'

export function GuideCompanionCutout({
  companionId,
  name,
  pose = 'point',
  side = 'left',
}: GuideCompanionCutoutProps) {
  const [tier, setTier] = useState<LoadTier>('png')

  useEffect(() => {
    setTier('png')
  }, [companionId, pose])

  if (tier === 'hidden') {
    return null
  }

  const src =
    tier === 'png'
      ? companionGuideCutoutPngPath(companionId, pose)
      : companionGuideCutoutPath(companionId, pose)

  return (
    <div className={`mg-guide-cutout ${side}`}>
      <img
        alt={`${name} guide la capture`}
        className="mg-guide-cutout-img mg-encounter-pop"
        draggable={false}
        onError={() => {
          if (tier === 'png') {
            setTier('svg')
          } else {
            setTier('hidden')
          }
        }}
        src={src}
      />
    </div>
  )
}
