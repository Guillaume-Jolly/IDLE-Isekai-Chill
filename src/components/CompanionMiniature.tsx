import {
  COMPANIONS_WITH_CHIBI,
  companionAssetPathCandidates,
  companionChibiPathCandidates,
} from '../data/companionAssets'
import { usePublicAssetSrc } from '../hooks/usePublicAssetSrc'
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
  const candidates = useChibi
    ? companionChibiPathCandidates(companionId)
    : companionAssetPathCandidates(companionId, level)
  const fallbackCandidates = useChibi
    ? companionAssetPathCandidates(companionId, level)
    : companionAssetPathCandidates(companionId, 1)

  const [src, onError, exhausted] = usePublicAssetSrc(candidates[0], candidates.slice(1))
  const [fallbackSrc, onFallbackError] = usePublicAssetSrc(
    fallbackCandidates[0],
    fallbackCandidates.slice(1),
  )

  const frameClass = useChibi
    ? 'companion-framed-portrait companion-framed-portrait--chibi'
    : 'companion-framed-portrait'

  const displaySrc = exhausted ? fallbackSrc : src

  return (
    <img
      alt={name}
      className={className ? `${frameClass} ${className}` : frameClass}
      draggable={false}
      src={displaySrc}
      onError={exhausted ? onFallbackError : onError}
    />
  )
}
