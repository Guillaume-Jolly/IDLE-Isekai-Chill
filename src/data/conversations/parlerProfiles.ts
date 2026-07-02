import type { DialogueTone } from './types'

/** Qui mène la scène intime — par échange (corpus) ou défaut compagnon (palier). */
export type ParlerPowerDynamic =
  | 'companion_dominant'
  | 'companion_invites'
  | 'mutual'
  | 'protagonist_invited'

export const PARLER_POWER_DYNAMIC_LABELS: Record<ParlerPowerDynamic, string> = {
  companion_dominant: 'Compagnon·ne mène — le MC cède / suit',
  companion_invites: 'Compagnon·ne invite — le MC agit sur consigne',
  mutual: 'Rythme partagé',
  protagonist_invited: 'Compagnon·ne laisse le MC prendre l’initiative',
}

export type ParlerAffinityTier = {
  /** Indice affiché en session Parler (remplace le hint aff. 1 générique). */
  personalityHint: string
  defaultPowerDynamic: ParlerPowerDynamic
  toneWeights?: Partial<Record<DialogueTone, number>>
}

/** Palier d’affinité → personnalité Parler (Lyra et futurs compagnons). */
export const PARLER_COMPANION_TIERS: Record<
  string,
  Partial<Record<number, ParlerAffinityTier>>
> = {
  lyra: {
    1: {
      personalityHint:
        'Lyra est réservée et intellectuelle — écoute, patience, pas de flirts lourds.',
      defaultPowerDynamic: 'mutual',
    },
    2: {
      personalityHint:
        'Lyra s’ouvre un peu — complicité discrète, toujours sans lourdeur.',
      defaultPowerDynamic: 'mutual',
    },
    4: {
      personalityHint:
        'Lyra froide et en contrôle — bibliothèque, proximité suggestive, elle fixe le tempo.',
      defaultPowerDynamic: 'companion_dominant',
    },
    5: {
      personalityHint:
        'Lyra dominante — ordres secs, verrou à la bibliothèque puis lit ; le MC suit ou obéit.',
      defaultPowerDynamic: 'companion_dominant',
    },
  },
  maeve: {
    1: {
      personalityHint: 'Maeve négocie — directe, maline, audace mesurée.',
      defaultPowerDynamic: 'companion_invites',
    },
    4: {
      personalityHint: 'Maeve mène la danse au marché — provocation calculée.',
      defaultPowerDynamic: 'companion_invites',
    },
    5: {
      personalityHint: 'Maeve alterne — taquine, puis reprend la main quand le MC va trop vite.',
      defaultPowerDynamic: 'mutual',
    },
  },
  iris: {
    1: {
      personalityHint: 'Iris rêveuse — métaphores, nature, tendresse discrète.',
      defaultPowerDynamic: 'protagonist_invited',
    },
    4: {
      personalityHint: 'Iris attend patiemment — douceur, le MC peut avancer à son rythme.',
      defaultPowerDynamic: 'protagonist_invited',
    },
    5: {
      personalityHint: 'Iris se laisse guider — murmures, pas d’ordres brusques.',
      defaultPowerDynamic: 'protagonist_invited',
    },
  },
  seren: {
    1: {
      personalityHint: 'Seren digne et froide — respect, fierté, jamais de moquerie.',
      defaultPowerDynamic: 'companion_dominant',
    },
    4: {
      personalityHint: 'Seren garde la distance — le MC doit mériter chaque pas.',
      defaultPowerDynamic: 'companion_dominant',
    },
    5: {
      personalityHint: 'Seren cède rarement — contrôle jusqu’au bout.',
      defaultPowerDynamic: 'companion_dominant',
    },
  },
}

function nearestTier(
  tiers: Partial<Record<number, ParlerAffinityTier>>,
  affinity: number,
): ParlerAffinityTier | null {
  const keys = Object.keys(tiers)
    .map(Number)
    .filter((level) => level <= affinity)
    .sort((left, right) => right - left)
  const key = keys[0]
  return key !== undefined ? (tiers[key] ?? null) : null
}

export function getParlerAffinityTier(
  companionId: string,
  affinity: number,
): ParlerAffinityTier | null {
  const tiers = PARLER_COMPANION_TIERS[companionId]
  if (!tiers) return null
  return nearestTier(tiers, affinity) ?? tiers[1] ?? null
}

export function getParlerPersonalityHint(companionId: string, affinity: number): string | null {
  return getParlerAffinityTier(companionId, affinity)?.personalityHint ?? null
}

export function getDefaultParlerPowerDynamic(
  companionId: string,
  affinity: number,
): ParlerPowerDynamic {
  return getParlerAffinityTier(companionId, affinity)?.defaultPowerDynamic ?? 'mutual'
}
