import { useCallback, useEffect, useMemo, useState, type ReactEventHandler } from 'react'
import { publicAssetCandidates, publicAssetUrl } from '../data/publicAssetUrl'

/**
 * Charge un PNG/SVG public avec repli sur d’anciens chemins si le canonique est absent.
 * Retourne [src, onError, exhausted] — exhausted=true quand tous les candidats ont échoué.
 */
export function usePublicAssetSrc(
  canonicalRelative: string,
  legacyRelatives: string[] = [],
): [string, ReactEventHandler<HTMLImageElement>, boolean] {
  const candidates = useMemo(
    () => publicAssetCandidates(canonicalRelative, ...legacyRelatives),
    [canonicalRelative, legacyRelatives],
  )
  const [index, setIndex] = useState(0)
  const [exhausted, setExhausted] = useState(false)

  useEffect(() => {
    setIndex(0)
    setExhausted(false)
  }, [candidates])

  const src = candidates[index] ?? publicAssetUrl(canonicalRelative)

  const onError = useCallback(() => {
    setIndex((current) => {
      if (current + 1 < candidates.length) {
        return current + 1
      }
      setExhausted(true)
      return current
    })
  }, [candidates.length])

  return [src, onError, exhausted]
}
