import {
  WORKSITE_MINE_BIOME_UNLOCK,
  WORKSITE_UNLOCK_THRESHOLDS,
  type WorksiteBiomeUnlockRule,
  type WorksiteSpotUnlockRule,
} from './myrionWorksiteBalance'
import {
  WORKSITE_BIOME_IDS,
  WORKSITE_BIOMES,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from './myrionWorksiteDefs'
import {
  buildRuntimeBiomeEntrySpots,
  getRuntimeSpotMeta,
  mapProducedAmountToResourceTrack,
} from './myrionWorksiteBiomeRuntime'

const BIOME_IDS = WORKSITE_BIOME_IDS
const BIOMES = WORKSITE_BIOMES
const spotKey = worksiteSpotKey

export {
  WORKSITE_MINE_BIOME_UNLOCK,
  WORKSITE_UNLOCK_THRESHOLDS,
} from './myrionWorksiteBalance'

export const WORKSITE_BIOME_ENTRY_SPOTS = buildRuntimeBiomeEntrySpots() as Record<
  WorksiteBiomeId,
  WorksiteSpotId
>

export const WORKSITE_STARTER_SPOT_KEYS = [
  spotKey('prairie-chantier', 'bosquet'),
  spotKey('prairie-chantier', 'pierrier'),
  spotKey('prairie-chantier', 'champs'),
] as const

export type WorksiteResourceTotals = {
  wood: number
  stone: number
  food: number
  ingredients: number
  totalChantier: number
}

export type WorksiteUnlockEvent = {
  id: string
  label: string
  kind: 'biome' | 'spot'
}

function formatUnlockParts(parts: string[]): string {
  return parts.join(' · ')
}

function biomeRuleMet(totals: WorksiteResourceTotals, rule: WorksiteBiomeUnlockRule): boolean {
  if (rule.totalChantier !== undefined && totals.totalChantier < rule.totalChantier) return false
  if (rule.wood !== undefined && totals.wood < rule.wood) return false
  if (rule.stone !== undefined && totals.stone < rule.stone) return false
  if (rule.food !== undefined && totals.food < rule.food) return false
  if (rule.ingredients !== undefined && totals.ingredients < rule.ingredients) return false
  return true
}

function spotRuleMet(totals: WorksiteResourceTotals, rule: WorksiteSpotUnlockRule): boolean {
  if (rule.totalChantier !== undefined && totals.totalChantier < rule.totalChantier) return false
  if (rule.wood !== undefined && totals.wood < rule.wood) return false
  if (rule.stone !== undefined && totals.stone < rule.stone) return false
  if (rule.food !== undefined && totals.food < rule.food) return false
  if (rule.ingredients !== undefined && totals.ingredients < rule.ingredients) return false
  return true
}

function formatBiomeUnlockRule(rule: WorksiteBiomeUnlockRule): string {
  const parts: string[] = []
  if (rule.totalChantier) parts.push(`${rule.totalChantier} production totale (ferme)`)
  if (rule.wood) parts.push(`${rule.wood} bois produits`)
  if (rule.stone) parts.push(`${rule.stone} pierre produite`)
  if (rule.food) parts.push(`${rule.food} vivres produites`)
  if (rule.ingredients) parts.push(`${rule.ingredients} ingrédients produits`)
  return formatUnlockParts(parts)
}

function formatSpotUnlockRule(rule: WorksiteSpotUnlockRule): string {
  const parts: string[] = []
  if (rule.totalChantier) parts.push(`${rule.totalChantier} production totale (ferme)`)
  if (rule.wood) parts.push(`${rule.wood} bois produits`)
  if (rule.stone) parts.push(`${rule.stone} pierre produite`)
  if (rule.food) parts.push(`${rule.food} vivres produites`)
  if (rule.ingredients) parts.push(`${rule.ingredients} ingrédients produits`)
  return formatUnlockParts(parts)
}

export function worksiteResourceTotals(worksite: MyrionWorksiteSave): WorksiteResourceTotals {
  const totals: WorksiteResourceTotals = {
    wood: 0,
    stone: 0,
    food: 0,
    ingredients: 0,
    totalChantier: 0,
  }
  for (const biomeId of BIOME_IDS) {
    for (const spotId of BIOMES[biomeId].spotIds) {
      const key = spotKey(biomeId, spotId)
      const amount = worksite.totalProducedBySpot[key] ?? 0
      if (amount <= 0) continue
      totals.totalChantier += amount
      const meta = getRuntimeSpotMeta(biomeId, spotId)
      if (meta) {
        mapProducedAmountToResourceTrack(meta.resourceId, amount, totals)
      }
    }
  }
  return totals
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
  if (biomeId === 'mine-tranquille') {
    return formatUnlockParts([
      `${WORKSITE_MINE_BIOME_UNLOCK.totalChantier} production totale (ferme)`,
      `${WORKSITE_MINE_BIOME_UNLOCK.wood} bois produits`,
    ])
  }
  const rule = WORKSITE_UNLOCK_THRESHOLDS.biomes[biomeId as keyof typeof WORKSITE_UNLOCK_THRESHOLDS.biomes]
  if (!rule) return null
  return formatBiomeUnlockRule(rule)
}

export function getSpotUnlockHint(biomeId: WorksiteBiomeId, spotId: WorksiteSpotId): string | null {
  const key = spotKey(biomeId, spotId)
  const rule = WORKSITE_UNLOCK_THRESHOLDS.spots[key as keyof typeof WORKSITE_UNLOCK_THRESHOLDS.spots]
  if (!rule) return null
  return formatSpotUnlockRule(rule)
}

function biomeUnlockMet(worksite: MyrionWorksiteSave, biomeId: WorksiteBiomeId): boolean {
  if (biomeId === 'prairie-chantier') return true
  const totals = worksiteResourceTotals(worksite)
  if (biomeId === 'mine-tranquille') {
    if (totals.totalChantier < WORKSITE_MINE_BIOME_UNLOCK.totalChantier) return false
    if (totals.wood < WORKSITE_MINE_BIOME_UNLOCK.wood) return false
    return true
  }
  const rule = WORKSITE_UNLOCK_THRESHOLDS.biomes[biomeId as keyof typeof WORKSITE_UNLOCK_THRESHOLDS.biomes]
  if (!rule) return false
  return biomeRuleMet(totals, rule)
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
  return spotRuleMet(worksiteResourceTotals(worksite), rule)
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
          const meta = getRuntimeSpotMeta(biomeId, spotId)
          events.push({
            id: eventId,
            kind: 'spot',
            label: `Spot débloqué — ${BIOMES[biomeId].emoji} ${meta?.displayName ?? spotId}`,
          })
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

  const validBiomeFilter = (ids: WorksiteBiomeId[] | undefined) =>
    ids?.filter((id) => BIOME_IDS.includes(id)) ?? starterBiomes

  if (Array.isArray(partial.unlockedSpotKeys) && partial.unlockedSpotKeys.length > 0) {
    const unlockedBiomeIds = validBiomeFilter(partial.unlockedBiomeIds)
    return {
      unlockedBiomeIds: unlockedBiomeIds.length > 0 ? unlockedBiomeIds : starterBiomes,
      unlockedSpotKeys: [...partial.unlockedSpotKeys],
      seenUnlockNotificationIds,
    }
  }

  const merged: MyrionWorksiteSave = {
    activeBiomeId: partial.activeBiomeId ?? 'prairie-chantier',
    unlockedBiomeIds: validBiomeFilter(partial.unlockedBiomeIds),
    selectedSpotByBiome: partial.selectedSpotByBiome ?? ({} as Record<WorksiteBiomeId, WorksiteSpotId>),
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
