import { useEffect, useState } from 'react'

export const MOBILE_LAYOUT_QUERY = '(max-width: 767px)'

/** Chasse / capture — inclut téléphone en mode « site bureau » (viewport ~980px). */
export const MOBILE_CAPTURE_QUERY =
  '(max-width: 899px), ((hover: none) and (pointer: coarse) and (max-width: 1024px))'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])

  return matches
}

export function useIsMobileLayout() {
  return useMediaQuery(MOBILE_LAYOUT_QUERY)
}

export function useIsMobileCapture() {
  return useMediaQuery(MOBILE_CAPTURE_QUERY)
}

/** Refuge / dressage — même détection que la capture (mode « site bureau » inclus). */
export function useIsMobileRefuge() {
  return useMediaQuery(MOBILE_CAPTURE_QUERY)
}
