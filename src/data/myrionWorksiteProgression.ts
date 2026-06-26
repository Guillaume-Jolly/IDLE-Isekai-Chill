import {
  WORKSITE_BIOME_IDS,
  WORKSITE_BIOMES,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from './myrionWorksiteDefs'

const BIOME_IDS = WORKSITE_BIOME_IDS
const BIOMES = WORKSITE_BIOMES
const spotKey = worksiteSpotKey

/** Seuils provisoires MVP 3 — faciles à ajuster. */
export const WORKSITE_UNLOCK_THRESHOLDS = {
  biomes: {
    'foret-douce': { totalChantier: 15 },
    'mine-tranquille': { totalChantier: 30, stone: 12 },
  },
  spots: {
    'foret-douce:clairiere-herbes': { wood: 18 },
    'foret-douce:source-claire': { wood: 30 },
    'mine-tranquille:veine-brute': { stone: 24 },
    'mine-tranquille:charbonniere': { stone: 45 },
  },
} as const

export const WORKSITE_BIOME_ENTRY_SPOTS: Record<WorksiteBiomeId, WorksiteSpotId> = {
  'prairie-chantier': 'bosquet',
  'foret-douce': 'sous-bois',
  'mine-tranquille': 'pierrier-profond',
}

export const WORKSITE_STARTER_SPOT_KEYS = [
  spotKey('prairie-chantier', 'bosquet'),
  spotKey('prairie-chantier', 'pierrier'),
  spotKey('prairie-chantier', 'champs'),
] as const

export type WorksiteResourceTotals = {
  wood: number
  stone: number
  food: number
  totalChantier: number
}

export type WorksiteUnlockEvent = {
  id: string
  label: string
  kind: 'biome' | 'spot'
}

export function worksiteResourceTotals(worksite: MyrionWorksiteSave): WorksiteResourceTotals {
  let wood = 0
  let stone = 0
  let food = 0
  for (const biomeId of BIOME_IDS) {
    for (const spotId of BIOMES[biomeId].spotIds) {
      const key = spotKey(biomeId, spotId)
      const amount = worksite.totalProducedBySpot[key] ?? 0
      if (biomeId === 'prairie-chantier') food += amount
      else if (biomeId === 'foret-douce') wood += amount
      else if (biomeId === 'mine-tranquille') stone += amount
    }
  }
  return { wood, stone, food, totalChantier: wood + stone + food }
}

export function isWorksiteBiomeUnlocked(worksite: MyrionWorksiteSave, biomeId: WorksiteBiomeId): boolean {
  return worksite.unlockedBiomeIds.includes(biomeId)
}

export function isWorksiteSpotUnlocked(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
): boolean {
  if (!isWorksiteBiomeUnlocked(worksite, biomeId)) return false
  return worksite.unlockedSpotKeys.includes(spotKey(biomeId, spotId))
}

export function getBiomeUnlockHint(biomeId: WorksiteBiomeId): string | null {
  if (biomeId === 'prairie-chantier') return null
  const rule = WORKSITE_UNLOCK_THRESHOLDS.biomes[biomeId as keyof typeof WORKSITE_UNLOCK_THRESHOLDS.biomes]
  if (!rule) return null
  const parts: string[] = []
  if (rule.totalChantier) parts.push(`${rule.totalChantier} production totale chantier`)
  if ('stone' in rule && rule.stone) parts.push(`${rule.stone} pierre produite`)
  return parts.join(' · ')
}

export function getSpotUnlockHint(biomeId: WorksiteBiomeId, spotId: WorksiteSpotId): string | null {
  const key = spotKey(biomeId, spotId)
  const rule = WORKSITE_UNLOCK_THRESHOLDS.spots[key as keyof typeof WORKSITE_UNLOCK_THRESHOLDS.spots]
  if (!rule) return null
  if ('wood' in rule) return `${rule.wood} bois produits`
  if ('food' in rule) return `${rule.food} vivres produites`
  if ('stone' in rule) return `${rule.stone} pierre produite`
  return null
}

function biomeUnlockMet(worksite: MyrionWorksiteSave, biomeId: WorksiteBiomeId): boolean {
  if (biomeId === 'prairie-chantier') return true
  const totals = worksiteResourceTotals(worksite)
  const rule = WORKSITE_UNLOCK_THRESHOLDS.biomes[biomeId as keyof typeof WORKSITE_UNLOCK_THRESHOLDS.biomes]
  if (!rule) return false
  if (rule.totalChantier && totals.totalChantier < rule.totalChantier) return false
  if ('stone' in rule && rule.stone && totals.stone < rule.stone) return false
  return true
}

function spotUnlockMet(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
): boolean {
  const key = spotKey(biomeId, spotId)
  if ((WORKSITE_STARTER_SPOT_KEYS as readonly string[]).includes(key)) return true
  if (WORKSITE_BIOME_ENTRY_SPOTS[biomeId] === spotId && isWorksiteBiomeUnlocked(worksite, biomeId)) {
    return true
  }
  const rule = WORKSITE_UNLOCK_THRESHOLDS.spots[key as keyof typeof WORKSITE_UNLOCK_THRESHOLDS.spots]
  if (!rule) return isWorksiteBiomeUnlocked(worksite, biomeId)
  const totals = worksiteResourceTotals(worksite)
  const spotRule = rule as { wood?: number; food?: number; stone?: number }
  if (spotRule.wood !== undefined && totals.wood < spotRule.wood) return false
  if (spotRule.food !== undefined && totals.food < spotRule.food) return false
  if (spotRule.stone !== undefined && totals.stone < spotRule.stone) return false
  return true
}

export function evaluateWorksiteUnlocks(worksite: MyrionWorksiteSave): {
  worksite: MyrionWorksiteSave
  events: WorksiteUnlockEvent[]
} {
  const events: WorksiteUnlockEvent[] = []
  let unlockedBiomeIds = [...worksite.unlockedBiomeIds]
  let unlockedSpotKeys = [...worksite.unlockedSpotKeys]
  const seen = new Set(worksite.seenUnlockNotificationIds)

  for (const biomeId of BIOME_IDS) {
    if (!unlockedBiomeIds.includes(biomeId) && biomeUnlockMet(worksite, biomeId)) {
      unlockedBiomeIds.push(biomeId)
      const entrySpot = WORKSITE_BIOME_ENTRY_SPOTS[biomeId]
      const entryKey = spotKey(biomeId, entrySpot)
      if (!unlockedSpotKeys.includes(entryKey)) unlockedSpotKeys.push(entryKey)
      const eventId = `biome:${biomeId}`
      if (!seen.has(eventId)) {
        events.push({ id: eventId, kind: 'biome', label: `${BIOMES[biomeId].label} débloquée` })
      }
    }
  }

  for (const biomeId of BIOME_IDS) {
    for (const spotId of BIOMES[biomeId].spotIds) {
      const key = spotKey(biomeId, spotId)
      if (unlockedSpotKeys.includes(key)) continue
      const probe: MyrionWorksiteSave = { ...worksite, unlockedBiomeIds, unlockedSpotKeys }
      if (spotUnlockMet(probe, biomeId, spotId)) {
        unlockedSpotKeys.push(key)
        const eventId = `spot:${key}`
        if (!seen.has(eventId)) {
          events.push({ id: eventId, kind: 'spot', label: `Spot débloqué — ${BIOMES[biomeId].emoji} ${spotId}` })
        }
      }
    }
  }

  return {
    worksite: {
      ...worksite,
      unlockedBiomeIds: [...new Set(unlockedBiomeIds)] as WorksiteBiomeId[],
      unlockedSpotKeys: [...new Set(unlockedSpotKeys)],
    },
    events,
  }
}

export function markUnlockNotificationsSeen(
  worksite: MyrionWorksiteSave,
  eventIds: string[],
): MyrionWorksiteSave {
  return {
    ...worksite,
    seenUnlockNotificationIds: [...new Set([...worksite.seenUnlockNotificationIds, ...eventIds])],
  }
}

export function defaultUnlockedSpotKeys(): string[] {
  return [...WORKSITE_STARTER_SPOT_KEYS]
}

export function migrateWorksiteUnlockState(partial: Partial<MyrionWorksiteSave>): {
  unlockedBiomeIds: WorksiteBiomeId[]
  unlockedSpotKeys: string[]
  seenUnlockNotificationIds: string[]
} {
  const starterBiomes: WorksiteBiomeId[] = ['prairie-chantier']
  const seenUnlockNotificationIds = Array.isArray(partial.seenUnlockNotificationIds)
    ? [...partial.seenUnlockNotificationIds]
    : []

  if (Array.isArray(partial.unlockedSpotKeys) && partial.unlockedSpotKeys.length > 0) {
    const unlockedBiomeIds =
      partial.unlockedBiomeIds?.filter((id) => BIOME_IDS.includes(id)) ?? starterBiomes
    return {
      unlockedBiomeIds: unlockedBiomeIds.length > 0 ? unlockedBiomeIds : starterBiomes,
      unlockedSpotKeys: [...partial.unlockedSpotKeys],
      seenUnlockNotificationIds,
    }
  }

  const merged: MyrionWorksiteSave = {
    activeBiomeId: partial.activeBiomeId ?? 'prairie-chantier',
    unlockedBiomeIds: partial.unlockedBiomeIds ?? starterBiomes,
    selectedSpotByBiome: partial.selectedSpotByBiome ?? {
      'prairie-chantier': 'bosquet',
      'foret-douce': 'sous-bois',
      'mine-tranquille': 'pierrier-profond',
    },
    assignedMyrionIdsBySpot: partial.assignedMyrionIdsBySpot ?? {},
    totalProducedBySpot: partial.totalProducedBySpot ?? {},
    unlockedSpotKeys: defaultUnlockedSpotKeys(),
    seenUnlockNotificationIds,
    lastAutoTickAt: partial.lastAutoTickAt ?? Date.now(),
  }
  const evaluated = evaluateWorksiteUnlocks(merged)
  return {
    unlockedBiomeIds: evaluated.worksite.unlockedBiomeIds,
    unlockedSpotKeys: evaluated.worksite.unlockedSpotKeys,
    seenUnlockNotificationIds,
  }
}
