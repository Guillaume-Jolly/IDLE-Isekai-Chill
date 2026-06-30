import { useEffect } from 'react'

/**
 * Warmup délégué à `GameSessionGate` (écran de chargement).
 * Hook conservé pour compat — no-op.
 */
export function useDevAssetWarmup() {
  useEffect(() => {
    // no-op
  }, [])
}
