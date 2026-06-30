import { useCallback, useEffect, useMemo, useState, type ReactEventHandler } from 'react'
import { publicAssetUrl } from '../data/publicAssetUrl'
import { resolveFirstAvailableRelative } from '../lib/assetProbeCache'

/**
 * Charge un PNG/SVG public avec repli sur d’anciens chemins si le canonique est absent.
 * Résolution proactive via cache (évite la cascade 404 → legacy en dev).
 */
export function usePublicAssetSrc(
  canonicalRelative: string,
  legacyRelatives: string[] = [],
): [string, ReactEventHandler<HTMLImageElement>, boolean] {
  const legacyKey = legacyRelatives.join('\0')
  const relativeCandidates = useMemo(
    () => [canonicalRelative, ...legacyRelatives],
    [canonicalRelative, legacyKey, legacyRelatives],
  )

  const [src, setSrc] = useState(() => publicAssetUrl(canonicalRelative))
  const [exhausted, setExhausted] = useState(false)

  useEffect(() => {
    let cancelled = false
    setExhausted(false)
    setSrc(publicAssetUrl(canonicalRelative))

    resolveFirstAvailableRelative(relativeCandidates).then((resolved) => {
      if (!cancelled && resolved) setSrc(resolved)
    })

    return () => {
      cancelled = true
    }
  }, [canonicalRelative, relativeCandidates])

  const onError = useCallback(() => {
    setExhausted(true)
  }, [])

  return [src, onError, exhausted]
}
