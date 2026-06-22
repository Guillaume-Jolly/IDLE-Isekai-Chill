import { useState } from 'react'
import {
  COMPANIONS_WITH_CHIBI,
  companionAssetPath,
  companionChibiPath,
} from '../data/companionAssets'
import './CompanionMiniature.css'

type CompanionMiniatureProps = {
  companionId: string
  name: string
  className?: string
  level?: number
}

/** Portrait miniature — chibi si disponible, sinon affinity. Jamais de placeholder CSS. */
export function CompanionMiniature({
  companionId,
  name,
  className = '',
  level = 1,
}: CompanionMiniatureProps) {
  const useChibi = COMPANIONS_WITH_CHIBI.has(companionId)
  const [src, setSrc] = useState(() =>
    useChibi ? companionChibiPath(companionId) : companionAssetPath(companionId, level),
  )

  const frameClass = useChibi
    ? 'companion-framed-portrait companion-framed-portrait--chibi'
    : 'companion-framed-portrait'

  return (
    <img
      alt={name}
      className={className ? `${frameClass} ${className}` : frameClass}
      draggable={false}
      src={src}
      onError={() => {
        setSrc((current) => {
          const affinityBase = companionAssetPath(companionId, level)
          if (current !== affinityBase) return affinityBase
          const affinityOne = companionAssetPath(companionId, 1)
          if (current !== affinityOne) return affinityOne
          return current
        })
      }}
    />
  )
}
