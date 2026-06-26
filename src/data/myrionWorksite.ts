import type { Cost, ResourceKey } from './buildingActivities'
import type { PetState } from './minigameSave'
import type { PalmonRarity } from './wildFamiliars'
import {
  WORKSITE_AUTO_MAX_CATCHUP_SEC,
  WORKSITE_AUTO_MIN_GRANT,
  WORKSITE_CLICK_ASSIGNED_BONUS_FACTOR,
  WORKSITE_CLICK_MIN_YIELD,
  worksiteBalanceRarityMultiplier,
  worksiteSpotYieldDefaults,
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
  defaultUnlockedSpotKeys,
  evaluateWorksiteUnlocks,
  migrateWorksiteUnlockState,
} from './myrionWorksiteProgression'
import { mergePrestigeSaveFields } from './myrionWorksitePrestige'

export {
  WORKSITE_BIOME_IDS,
  WORKSITE_BIOMES,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeDef,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from './myrionWorksiteDefs'

/** @deprecated MVP 1 alias — préférer activeBiomeId */
export const WORKSITE_BIOME_ID = 'prairie-chantier' as const satisfies WorksiteBiomeId

/** @deprecated MVP 1 alias */
export const WORKSITE_BIOME_LABEL = WORKSITE_BIOMES['prairie-chantier'].label

/** @deprecated MVP 1 alias — spots prairie uniquement */
export const WORKSITE_SPOT_IDS = WORKSITE_BIOMES['prairie-chantier'].spotIds

export type WorksiteSpotDef = {
  id: WorksiteSpotId
  biomeId: WorksiteBiomeId
  name: string
  emoji: string
  resourceId: ResourceKey
  baseClickYield: number
  baseAutoYieldPerMyrion: number
  unlocked: boolean
  hint: string
}

function spotDef(
  biomeId: WorksiteBiomeId,
  id: WorksiteSpotId,
  name: string,
  emoji: string,
  resourceId: ResourceKey,
  hint: string,
): WorksiteSpotDef {
  const yields = worksiteSpotYieldDefaults(worksiteSpotKey(biomeId, id))
  return {
    id,
    biomeId,
    name,
    emoji,
    resourceId,
    baseClickYield: yields.baseClickYield,
    baseAutoYieldPerMyrion: yields.baseAutoYieldPerMyrion,
    unlocked: true,
    hint,
  }
}

const SPOT_CATALOG: WorksiteSpotDef[] = [
  spotDef('prairie-chantier', 'bosquet', 'Verger', '🍎', 'food', 'Fruits — calmement.'),
  spotDef('prairie-chantier', 'pierrier', 'Potager', '🥕', 'food', 'Légumes — sans pression.'),
  spotDef('prairie-chantier', 'champs', 'Champs', '🌾', 'food', 'Céréales — petites récoltes.'),
  spotDef('foret-douce', 'sous-bois', 'Sous-bois', '🍃', 'wood', 'Bois feuillu.'),
  spotDef('foret-douce', 'clairiere-herbes', 'Clairière', '🪵', 'wood', 'Bois clair — futur type spécialisé.'),
  spotDef('foret-douce', 'source-claire', 'Souches', '🌲', 'wood', 'Bois résineux — futur type spécialisé.'),
  spotDef('mine-tranquille', 'pierrier-profond', 'Pierrier', '🪨', 'stone', 'Pierre brute.'),
  spotDef('mine-tranquille', 'veine-brute', 'Veine de fer', '⛏️', 'stone', 'Fer — futur minerai spécialisé.'),
  spotDef('mine-tranquille', 'charbonniere', 'Fil charbon', '🪨', 'stone', 'Charbon — futur minerai spécialisé.'),
]

export const WORKSITE_SPOT_DEFS: Record<string, WorksiteSpotDef> = Object.fromEntries(
  SPOT_CATALOG.map((spot) => [worksiteSpotKey(spot.biomeId, spot.id), spot]),
)

/** @deprecated MVP 1 alias — spots prairie par id seul */
export const WORKSITE_SPOTS: Record<
  (typeof WORKSITE_SPOT_IDS)[number],
  WorksiteSpotDef
> = Object.fromEntries(
  WORKSITE_BIOMES['prairie-chantier'].spotIds.map((id) => [
    id,
    getWorksiteSpot('prairie-chantier', id),
  ]),
) as Record<(typeof WORKSITE_SPOT_IDS)[number], WorksiteSpotDef>

export function getWorksiteSpot(biomeId: WorksiteBiomeId, spotId: WorksiteSpotId): WorksiteSpotDef {
  const spot = WORKSITE_SPOT_DEFS[worksiteSpotKey(biomeId, spotId)]
  if (!spot) throw new Error(`Unknown worksite spot: ${biomeId}:${spotId}`)
  return spot
}

export function getSpotsForBiome(biomeId: WorksiteBiomeId): WorksiteSpotDef[] {
  return WORKSITE_BIOMES[biomeId].spotIds.map((spotId) => getWorksiteSpot(biomeId, spotId))
}

export function isWorksiteSpotIdForBiome(
  biomeId: WorksiteBiomeId,
  spotId: string,
): spotId is WorksiteSpotId {
  return (WORKSITE_BIOMES[biomeId].spotIds as readonly string[]).includes(spotId)
}

/** Bonus supervision — réexport depuis balance. */
export { WORKSITE_SUPERVISION_MULT } from './myrionWorksiteBalance'

/** Coefficients rareté — réexport depuis balance. */
export { WORKSITE_RARITY_MULT } from './myrionWorksiteBalance'

/** Champs MVP 1 conservés pour migration mergeMyrionWorksite. */
type LegacyMyrionWorksiteSave = Partial<
  MyrionWorksiteSave & {
    biomeId?: WorksiteBiomeId
    selectedSpotId?: WorksiteSpotId
    assignedMyrionIdsBySpot?: Partial<Record<WorksiteSpotId, string[]>>
    totalProducedBySpot?: Partial<Record<WorksiteSpotId, number>>
  }
>

function defaultSelectedSpotByBiome(): Record<WorksiteBiomeId, WorksiteSpotId> {
  return {
    'prairie-chantier': 'champs',
    'foret-douce': 'sous-bois',
    'mine-tranquille': 'pierrier-profond',
  }
}

function emptyAssignments(): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const biomeId of WORKSITE_BIOME_IDS) {
    for (const spotId of WORKSITE_BIOMES[biomeId].spotIds) {
      out[worksiteSpotKey(biomeId, spotId)] = []
    }
  }
  return out
}

/** Reset unique des assignations (MVP 4.1 — limite 15 espèces visibles). */
export const WORKSITE_SAVE_MIGRATION_VERSION = 1

export function createStarterMyrionWorksite(now = Date.now()): MyrionWorksiteSave {
  return {
    activeBiomeId: 'prairie-chantier',
    unlockedBiomeIds: ['prairie-chantier'],
    unlockedSpotKeys: defaultUnlockedSpotKeys(),
    selectedSpotByBiome: defaultSelectedSpotByBiome(),
    assignedMyrionIdsBySpot: emptyAssignments(),
    totalProducedBySpot: {},
    seenUnlockNotificationIds: [],
    lastAutoTickAt: now,
    totalAstralShards: 0,
    prestigeAssignedMyrionId: null,
    prestigeSeen: false,
    saveMigrationVersion: WORKSITE_SAVE_MIGRATION_VERSION,
  }
}

function migrateLegacyAssignments(
  partial: LegacyMyrionWorksiteSave,
  assigned: Record<string, string[]>,
): void {
  const legacy = partial.assignedMyrionIdsBySpot
  if (!legacy) return

  for (const [key, list] of Object.entries(legacy)) {
    if (!Array.isArray(list)) continue
    if (key.includes(':')) {
      if (assigned[key] !== undefined) assigned[key] = [...list]
      continue
    }
    const prairieKey = worksiteSpotKey('prairie-chantier', key as WorksiteSpotId)
    if (assigned[prairieKey] !== undefined) assigned[prairieKey] = [...list]
  }
}

function migrateLegacyTotals(
  partial: LegacyMyrionWorksiteSave,
  totals: Partial<Record<string, number>>,
): Partial<Record<string, number>> {
  const legacy = partial.totalProducedBySpot
  if (!legacy) return totals
  const next = { ...totals }
  for (const [key, value] of Object.entries(legacy)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) continue
    if (key.includes(':')) {
      next[key] = value
      continue
    }
    next[worksiteSpotKey('prairie-chantier', key as WorksiteSpotId)] = value
  }
  return next
}

export function mergeMyrionWorksite(partial?: LegacyMyrionWorksiteSave): MyrionWorksiteSave {
  const starter = createStarterMyrionWorksite()
  if (!partial) return starter

  const assigned = emptyAssignments()
  const migrationVersion = partial.saveMigrationVersion ?? 0
  if (migrationVersion < WORKSITE_SAVE_MIGRATION_VERSION) {
    // One-shot : vider toutes les assignations pour repartir sous la limite d'espèces visibles.
  } else {
    migrateLegacyAssignments(partial, assigned)
    if (partial.activeBiomeId) {
      for (const [key, list] of Object.entries(partial.assignedMyrionIdsBySpot ?? {})) {
        if (key.includes(':') && Array.isArray(list)) assigned[key] = [...list]
      }
    }
  }

  const selectedSpotByBiome = { ...starter.selectedSpotByBiome }
  if (partial.selectedSpotByBiome) {
    for (const biomeId of WORKSITE_BIOME_IDS) {
      const spotId = partial.selectedSpotByBiome[biomeId]
      if (spotId && isWorksiteSpotIdForBiome(biomeId, spotId)) {
        selectedSpotByBiome[biomeId] = spotId
      }
    }
  }
  if (partial.selectedSpotId && isWorksiteSpotIdForBiome('prairie-chantier', partial.selectedSpotId)) {
    selectedSpotByBiome['prairie-chantier'] = partial.selectedSpotId
  }

  const activeBiomeId =
    partial.activeBiomeId && WORKSITE_BIOME_IDS.includes(partial.activeBiomeId)
      ? partial.activeBiomeId
      : partial.biomeId && WORKSITE_BIOME_IDS.includes(partial.biomeId)
        ? partial.biomeId
        : starter.activeBiomeId

  const unlocked = partial.unlockedBiomeIds?.filter((id) => WORKSITE_BIOME_IDS.includes(id))
  const unlockMigration = migrateWorksiteUnlockState({
    ...partial,
    unlockedBiomeIds:
      unlocked && unlocked.length > 0 ? ([...new Set(unlocked)] as WorksiteBiomeId[]) : undefined,
  })

  const merged: MyrionWorksiteSave = {
    activeBiomeId,
    unlockedBiomeIds: unlockMigration.unlockedBiomeIds,
    unlockedSpotKeys: unlockMigration.unlockedSpotKeys,
    selectedSpotByBiome,
    assignedMyrionIdsBySpot: assigned,
    totalProducedBySpot: migrateLegacyTotals(partial, { ...partial.totalProducedBySpot }),
    seenUnlockNotificationIds: unlockMigration.seenUnlockNotificationIds,
    lastAutoTickAt:
      typeof partial.lastAutoTickAt === 'number' && Number.isFinite(partial.lastAutoTickAt)
        ? partial.lastAutoTickAt
        : starter.lastAutoTickAt,
    ...mergePrestigeSaveFields(partial, starter),
    saveMigrationVersion: Math.max(migrationVersion, WORKSITE_SAVE_MIGRATION_VERSION),
  }

  return evaluateWorksiteUnlocks(merged).worksite
}

export function worksiteRarityMultiplier(rarity: PalmonRarity): number {
  return worksiteBalanceRarityMultiplier(rarity)
}

export function worksiteAssignedPets(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
  pets: PetState[],
): PetState[] {
  const key = worksiteSpotKey(biomeId, spotId)
  const ids = new Set(worksite.assignedMyrionIdsBySpot[key] ?? [])
  return pets.filter((pet) => ids.has(pet.id))
}

export function worksiteMyrionAssignedElsewhere(
  worksite: MyrionWorksiteSave,
  petId: string,
  exceptBiomeId?: WorksiteBiomeId,
  exceptSpotId?: WorksiteSpotId,
): { biomeId: WorksiteBiomeId; spotId: WorksiteSpotId } | null {
  if (worksite.prestigeAssignedMyrionId === petId) {
    return { biomeId: 'mine-tranquille', spotId: 'pierrier-profond' }
  }
  for (const biomeId of WORKSITE_BIOME_IDS) {
    for (const spotId of WORKSITE_BIOMES[biomeId].spotIds) {
      if (exceptBiomeId === biomeId && exceptSpotId === spotId) continue
      const key = worksiteSpotKey(biomeId, spotId)
      if (worksite.assignedMyrionIdsBySpot[key]?.includes(petId)) {
        return { biomeId, spotId }
      }
    }
  }
  return null
}

export function computeWorksiteClickYield(
  spot: WorksiteSpotDef,
  assignedPets: PetState[],
): number {
  const bonus = assignedPets.reduce(
    (sum, pet) => sum + WORKSITE_CLICK_ASSIGNED_BONUS_FACTOR * worksiteRarityMultiplier(pet.rarity),
    0,
  )
  return Math.max(
    WORKSITE_CLICK_MIN_YIELD,
    Math.round((spot.baseClickYield + bonus) * 100) / 100,
  )
}

export function computeWorksiteAutoPerSecond(
  spot: WorksiteSpotDef,
  assignedPets: PetState[],
  supervisionMultiplier = 1,
): number {
  if (assignedPets.length === 0) return 0
  const rate = assignedPets.reduce(
    (sum, pet) =>
      sum + spot.baseAutoYieldPerMyrion * worksiteRarityMultiplier(pet.rarity),
    0,
  )
  return Math.round(rate * supervisionMultiplier * 1000) / 1000
}

/** Auto tick — max 5 s de rattrapage pour éviter les spikes au retour focus. */
export function computeWorksiteAutoGrant(
  spot: WorksiteSpotDef,
  assignedPets: PetState[],
  lastTickAt: number,
  now = Date.now(),
  supervisionMultiplier = 1,
): { reward: Cost; nextTickAt: number; amount: number } {
  const deltaSec = Math.min(
    WORKSITE_AUTO_MAX_CATCHUP_SEC,
    Math.max(0, (now - lastTickAt) / 1000),
  )
  const perSec = computeWorksiteAutoPerSecond(spot, assignedPets, supervisionMultiplier)
  const raw = perSec * deltaSec
  const amount = raw >= WORKSITE_AUTO_MIN_GRANT ? Math.floor(raw * 100) / 100 : 0
  return {
    amount,
    reward: amount > 0 ? { [spot.resourceId]: amount } : {},
    nextTickAt: now,
  }
}

export function assignMyrionToSpot(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
  petId: string,
): MyrionWorksiteSave {
  const nextAssigned = { ...worksite.assignedMyrionIdsBySpot }
  for (const key of Object.keys(nextAssigned)) {
    nextAssigned[key] = (nextAssigned[key] ?? []).filter((entry) => entry !== petId)
  }
  const key = worksiteSpotKey(biomeId, spotId)
  nextAssigned[key] = [...(nextAssigned[key] ?? []), petId]
  return {
    ...worksite,
    assignedMyrionIdsBySpot: nextAssigned,
    prestigeAssignedMyrionId:
      worksite.prestigeAssignedMyrionId === petId ? null : worksite.prestigeAssignedMyrionId,
  }
}

export function worksiteAssignedPetsInBiome(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  pets: PetState[],
): PetState[] {
  const ids = new Set<string>()
  for (const spotId of WORKSITE_BIOMES[biomeId].spotIds) {
    const key = worksiteSpotKey(biomeId, spotId)
    for (const petId of worksite.assignedMyrionIdsBySpot[key] ?? []) {
      ids.add(petId)
    }
  }
  return pets.filter((pet) => ids.has(pet.id))
}

export function removeMyrionFromSpot(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
  petId: string,
): MyrionWorksiteSave {
  const key = worksiteSpotKey(biomeId, spotId)
  return {
    ...worksite,
    assignedMyrionIdsBySpot: {
      ...worksite.assignedMyrionIdsBySpot,
      [key]: (worksite.assignedMyrionIdsBySpot[key] ?? []).filter((entry) => entry !== petId),
    },
  }
}

export function clearAllWorksiteAssignments(worksite: MyrionWorksiteSave): MyrionWorksiteSave {
  return { ...worksite, assignedMyrionIdsBySpot: emptyAssignments() }
}

export function clearWorksiteSpotAssignments(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
): MyrionWorksiteSave {
  const key = worksiteSpotKey(biomeId, spotId)
  return {
    ...worksite,
    assignedMyrionIdsBySpot: {
      ...worksite.assignedMyrionIdsBySpot,
      [key]: [],
    },
  }
}

export function clearBiomeAssignments(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
): MyrionWorksiteSave {
  let next = worksite
  for (const spotId of WORKSITE_BIOMES[biomeId].spotIds) {
    next = clearWorksiteSpotAssignments(next, biomeId, spotId)
  }
  return next
}

export function removeMyrionFromBiome(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  petId: string,
): MyrionWorksiteSave {
  for (const spotId of WORKSITE_BIOMES[biomeId].spotIds) {
    const key = worksiteSpotKey(biomeId, spotId)
    if ((worksite.assignedMyrionIdsBySpot[key] ?? []).includes(petId)) {
      return removeMyrionFromSpot(worksite, biomeId, spotId, petId)
    }
  }
  return worksite
}

/** Itère les spots débloqués dans les biomes débloqués (production passive). */
export function iterUnlockedWorksiteSpots(
  worksite: MyrionWorksiteSave,
): Array<{ biomeId: WorksiteBiomeId; spotId: WorksiteSpotId; spot: WorksiteSpotDef }> {
  const rows: Array<{ biomeId: WorksiteBiomeId; spotId: WorksiteSpotId; spot: WorksiteSpotDef }> =
    []
  for (const biomeId of worksite.unlockedBiomeIds) {
    if (!WORKSITE_BIOME_IDS.includes(biomeId)) continue
    for (const spotId of WORKSITE_BIOMES[biomeId].spotIds) {
      const key = worksiteSpotKey(biomeId, spotId)
      if (!worksite.unlockedSpotKeys.includes(key)) continue
      rows.push({ biomeId, spotId, spot: getWorksiteSpot(biomeId, spotId) })
    }
  }
  return rows
}

export { evaluateWorksiteUnlocks } from './myrionWorksiteProgression'
