import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import type { Cost, ResourceKey } from '../../data/buildingActivities'
import {
  WORKSITE_BIOME_IDS,
  WORKSITE_BIOMES,
  WORKSITE_SUPERVISION_MULT,
  clearBiomeAssignments,
  computeWorksiteAutoGrant,
  computeWorksiteAutoPerSecond,
  computeWorksiteClickYield,
  getSpotsForBiome,
  getWorksiteSpot,
  iterUnlockedWorksiteSpots,
  evaluateWorksiteUnlocks,
  mergeMyrionWorksite,
  removeMyrionFromBiome,
  worksiteAssignedPets,
  worksiteAssignedPetsInBiome,
  worksiteRarityMultiplier,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from '../../data/myrionWorksite'
import {
  getBiomeUnlockHint,
  getSpotUnlockHint,
  isWorksiteBiomeUnlocked,
  isWorksiteSpotUnlocked,
  markUnlockNotificationsSeen,
  worksiteResourceTotals,
} from '../../data/myrionWorksiteProgression'
import { getRuntimeSpotMeta } from '../../data/myrionWorksiteBiomeRuntime'
import {
  assignedSpeciesSummary,
  assignMyrionsToBiome,
  availableLrPetsForPrestige,
  availablePetsForBiome,
  groupPetsBySpecies,
  paginateList,
  pickPetsForBatchAssign,
  sortPetsForWorksiteAssign,
  WORKSITE_ASSIGN_PAGE_SIZE,
  worksiteBiomeReferenceSpot,
  worksitePetEfficiency,
  type WorksiteAssignSort,
  type WorksiteBatchCount,
  type WorksiteBatchCriteria,
  type WorksiteSpeciesGroup,
} from '../../data/myrionWorksiteAssignment'
import {
  WORKSITE_PRESTIGE_CONFIG,
  WORKSITE_PRESTIGE_SCENE_BIOME_ID,
  WORKSITE_PRESTIGE_SPOT_VISUAL,
  assignLrToPrestige,
  canAssignPetToPrestige,
  clearPrestigeAssignment,
  computePrestigePerSecond,
  computePrestigeGrant,
  formatPrestigeAmount,
  getPrestigeAssignedPet,
  hasAnyLrPet,
  isPrestigeSceneVisible,
  markPrestigeSeen,
  worksitePetIsBusy,
} from '../../data/myrionWorksitePrestige'
import {
  readWorksiteDevUnlockAll,
  readWorksitePlacementDebug,
  setWorksiteDevUnlockAll,
  setWorksitePlacementDebug,
  isWorksiteDevEnvironment,
} from '../../data/myrionWorksiteDev'
import {
  getWorksiteBiomeBackgroundFrame,
  resolveWorksiteSpotPlacement,
  worksiteSpotPlacementStyle,
} from '../../data/myrionWorksitePlacement'
import {
  loadWorksiteMonitoringMode,
  saveWorksiteMonitoringMode,
} from '../../data/myrionWorksiteUi'
import {
  buildWorksiteBiomeLifePlan,
  decorativeStateLabel,
  getLifeTimeBucket,
  WORKSITE_LIFE_MAX_SPECIES,
} from '../../data/myrionWorksiteLife'
import { RARITY_COLORS } from '../../data/wildFamiliars'
import {
  getWorksiteBiomeVisual,
  getWorksiteResourceIconVisual,
  getWorksiteSpotVisual,
  worksiteSceneClassNames,
  worksiteSpotMarkerClassNames,
  worksiteSpotObjectClassNames,
  WORKSITE_UI_VISUALS,
} from '../../data/myrionWorksiteVisuals'
import {
  playWorksiteDrawerOpen,
  playWorksiteMine,
  playWorksitePrestigeAssign,
  playWorksitePrestigeSeen,
  playWorksiteUnlock,
  startWorksiteBiomeAmbience,
  stopWorksiteBiomeAmbience,
} from '../../audio/worksiteAudio'
import { HuntSideRail } from './HuntSideRail'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import { WorksiteMineBursts, WORKSITE_MINE_BURST_MS, WORKSITE_MAX_MINE_BURSTS, createMineBurstRing, markerBurstOrigin, type WorksiteMineBurst } from './WorksiteMineBursts'
import { WorksiteCompanionSupport } from './WorksiteCompanionSupport'
import { WorksiteMyrionLifeLayer } from './WorksiteMyrionLifeLayer'
import { PalmonSprite } from './PalmonSprite'
import {
  WorksiteBiomeBackground,
  WorksiteResourceIcon,
  WorksiteSpotObject,
} from './WorksiteVisuals'
import { WorksitePlacementDebug } from './WorksitePlacementDebug'
import './Worksite.css'

const AUTO_TICK_MS = 1000
const AUTO_SAVE_MS = 5000
const MOBILE_DRAWER_BREAKPOINT = '(max-width: 767px)'

const RESOURCE_LABELS: Partial<Record<ResourceKey, string>> = {
  wood: 'Bois',
  stone: 'Pierre',
  food: 'Vivres',
}

function formatYield(value: number) {
  if (value >= 10) return value.toFixed(1)
  if (value >= 1) return value.toFixed(2)
  return value.toFixed(3)
}

function formatMineYieldLabel(resourceId: ResourceKey, amount: number) {
  const label = RESOURCE_LABELS[resourceId] ?? resourceId
  const qty =
    amount >= 1
      ? Number.isInteger(amount)
        ? String(amount)
        : amount.toFixed(1)
      : amount.toFixed(2)
  return `+${qty} ${label}`
}

function mergeCosts(target: Cost, delta: Cost): Cost {
  const next = { ...target }
  for (const [key, value] of Object.entries(delta)) {
    if (!value) continue
    const resource = key as ResourceKey
    next[resource] = (next[resource] ?? 0) + value
  }
  return next
}

function useMobileDrawerDefault() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_DRAWER_BREAKPOINT).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(MOBILE_DRAWER_BREAKPOINT)
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return isMobile
}

function useWorksiteDevFlags() {
  const [devUnlockAll, setDevUnlockAll] = useState(readWorksiteDevUnlockAll)
  const [placementDebug, setPlacementDebug] = useState(readWorksitePlacementDebug)

  const toggleDevUnlock = useCallback(() => {
    const next = !readWorksiteDevUnlockAll()
    setWorksiteDevUnlockAll(next)
    setDevUnlockAll(next)
  }, [])

  const togglePlacementDebug = useCallback(() => {
    const next = !readWorksitePlacementDebug()
    setWorksitePlacementDebug(next)
    setPlacementDebug(next)
  }, [])

  return {
    devUnlockAll,
    placementDebug,
    toggleDevUnlock,
    togglePlacementDebug,
    devEnabled: isWorksiteDevEnvironment(),
  }
}

export function MyrionWorksiteGame({
  activity,
  companionName,
  companionAffinity,
  buildingName,
  resourceLabel,
  minigameSave,
  onSaveMinigame,
  onComplete,
  onClose,
}: MinigameProps) {
  const isMobile = useMobileDrawerDefault()
  const { devUnlockAll, placementDebug, toggleDevUnlock, togglePlacementDebug, devEnabled } =
    useWorksiteDevFlags()
  const pets = useMemo(() => minigameSave?.pets ?? [], [minigameSave?.pets])
  const [worksite, setWorksite] = useState<MyrionWorksiteSave>(() =>
    mergeMyrionWorksite(minigameSave?.myrionWorksite),
  )
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [monitoringMode, setMonitoringMode] = useState(() => loadWorksiteMonitoringMode())
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [sessionClicks, setSessionClicks] = useState(0)
  const [unlockNotices, setUnlockNotices] = useState<Array<{ id: string; label: string }>>([])
  const [assignSort, setAssignSort] = useState<WorksiteAssignSort>('efficiency-desc')
  const [appliedAssignSort, setAppliedAssignSort] = useState<WorksiteAssignSort>('efficiency-desc')
  const [assignPage, setAssignPage] = useState(0)
  const [batchCount, setBatchCount] = useState<WorksiteBatchCount>(10)
  const [appliedBatchCount, setAppliedBatchCount] = useState<WorksiteBatchCount>(10)
  const [batchCriteria, setBatchCriteria] = useState<WorksiteBatchCriteria>('sorted-list')
  const [appliedBatchCriteria, setAppliedBatchCriteria] = useState<WorksiteBatchCriteria>('sorted-list')
  const [assignedSectionOpen, setAssignedSectionOpen] = useState(true)
  const [availableSectionOpen, setAvailableSectionOpen] = useState(true)
  const [mineBursts, setMineBursts] = useState<WorksiteMineBurst[]>([])
  const [spotWear, setSpotWear] = useState<Partial<Record<WorksiteSpotId, number>>>({})
  const [recentMinedSpotId, setRecentMinedSpotId] = useState<WorksiteSpotId | null>(null)
  const mineBurstSeqRef = useRef(0)
  const mineBurstTimersRef = useRef<number[]>([])
  const recentMineTimerRef = useRef<number | null>(null)
  const sceneStageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<Partial<Record<WorksiteSpotId, HTMLButtonElement>>>({})

  const worksiteRef = useRef(worksite)
  const petsRef = useRef(pets)
  const lastAutoSaveAtRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  const onSaveMinigameRef = useRef(onSaveMinigame)
  const minigameSaveRef = useRef(minigameSave)

  useEffect(() => {
    worksiteRef.current = worksite
    petsRef.current = pets
    onCompleteRef.current = onComplete
    onSaveMinigameRef.current = onSaveMinigame
    minigameSaveRef.current = minigameSave
  }, [worksite, pets, onComplete, onSaveMinigame, minigameSave])

  useEffect(() => {
    const incoming = minigameSave?.myrionWorksite
    if (!incoming) return
    const merged = mergeMyrionWorksite(incoming)
    const mergedKey = JSON.stringify(merged)
    const currentKey = JSON.stringify(worksiteRef.current)
    if (mergedKey === currentKey) return
    setWorksite(merged)
    worksiteRef.current = merged
  }, [minigameSave?.myrionWorksite])

  useEffect(() => {
    if (isMobile) {
      setOpenDrawer(null)
    }
  }, [isMobile])

  const handleDrawerOpenChange = useCallback((next: string | null) => {
    if (next && next !== openDrawer) {
      playWorksiteDrawerOpen()
      if (next === 'prestige') {
        const current = worksiteRef.current
        if (!current.prestigeSeen) {
          const marked = markPrestigeSeen(current)
          setWorksite(marked)
          worksiteRef.current = marked
          playWorksitePrestigeSeen()
          const save = minigameSaveRef.current
          if (save && onSaveMinigameRef.current) {
            onSaveMinigameRef.current({ ...save, myrionWorksite: marked })
          }
        }
      }
    }
    setOpenDrawer(next)
  }, [openDrawer])

  const applyProgression = useCallback((base: MyrionWorksiteSave): MyrionWorksiteSave => {
    const { worksite: evaluated, events } = evaluateWorksiteUnlocks(base)
    const fresh = events.filter((event) => !evaluated.seenUnlockNotificationIds.includes(event.id))
    if (fresh.length > 0) {
      setUnlockNotices(fresh.map((event) => ({ id: event.id, label: event.label })))
      playWorksiteUnlock()
      window.setTimeout(() => setUnlockNotices([]), 4500)
      return markUnlockNotificationsSeen(
        evaluated,
        fresh.map((event) => event.id),
      )
    }
    return evaluated
  }, [])

  const persist = useCallback(
    (next: MyrionWorksiteSave) => {
      const progressed = applyProgression(next)
      setWorksite(progressed)
      worksiteRef.current = progressed
      lastAutoSaveAtRef.current = Date.now()
      if (minigameSave && onSaveMinigame) {
        onSaveMinigame({ ...minigameSave, myrionWorksite: progressed })
      }
    },
    [applyProgression, minigameSave, onSaveMinigame],
  )

  const flushWorksiteSave = useCallback(
    (next: MyrionWorksiteSave, force = false) => {
      const progressed = applyProgression(next)
      worksiteRef.current = progressed
      const now = Date.now()
      if (!force && now - lastAutoSaveAtRef.current < AUTO_SAVE_MS) return
      setWorksite(progressed)
      lastAutoSaveAtRef.current = now
      const save = minigameSaveRef.current
      if (save && onSaveMinigameRef.current) {
        onSaveMinigameRef.current({ ...save, myrionWorksite: progressed })
      }
    },
    [applyProgression],
  )

  const activeBiomeId = worksite.activeBiomeId
  const activeBiome = WORKSITE_BIOMES[activeBiomeId]
  const biomeReferenceSpot = useMemo(
    () => worksiteBiomeReferenceSpot(worksite, activeBiomeId),
    [worksite, activeBiomeId],
  )
  const activeSpots = getSpotsForBiome(activeBiomeId)
  const progressTotals = worksiteResourceTotals(worksite)

  useEffect(() => {
    startWorksiteBiomeAmbience(activeBiomeId, { discrete: monitoringMode })
    return () => stopWorksiteBiomeAmbience()
  }, [activeBiomeId, monitoringMode])

  useEffect(() => {
    if (monitoringMode) {
      setOpenDrawer(null)
    }
  }, [monitoringMode])

  const setMonitoringModeEnabled = useCallback((enabled: boolean) => {
    setMonitoringMode(enabled)
    saveWorksiteMonitoringMode(enabled)
    if (enabled) {
      setOpenDrawer(null)
    }
  }, [])

  useEffect(() => {
    setAssignPage(0)
  }, [activeBiomeId])

  const selectBiome = (biomeId: WorksiteBiomeId) => {
    if (!devUnlockAll && !worksite.unlockedBiomeIds.includes(biomeId)) return
    persist({ ...worksite, activeBiomeId: biomeId })
  }

  const biomeUnlockedForUi = useCallback(
    (biomeId: WorksiteBiomeId) => devUnlockAll || isWorksiteBiomeUnlocked(worksite, biomeId),
    [devUnlockAll, worksite],
  )

  const spotUnlockedForUi = useCallback(
    (biomeId: WorksiteBiomeId, spotId: WorksiteSpotId) =>
      devUnlockAll || isWorksiteSpotUnlocked(worksite, biomeId, spotId),
    [devUnlockAll, worksite],
  )

  const spawnMineBursts = useCallback(
    (
      spotId: WorksiteSpotId,
      resourceEmoji: string,
      resourceAsset: ReturnType<typeof getWorksiteResourceIconVisual>['asset'],
      yieldLabel: string,
    ) => {
      const marker = markerRefs.current[spotId]
      const scene = sceneRef.current
      if (!marker || !scene) return

      const baseId = ++mineBurstSeqRef.current
      const origin = markerBurstOrigin(marker, scene)
      const burst = createMineBurstRing(baseId, origin, resourceEmoji, resourceAsset, yieldLabel)
      setMineBursts((current) => {
        const next = [...current, burst]
        if (next.length <= WORKSITE_MAX_MINE_BURSTS) return next
        return next.slice(next.length - WORKSITE_MAX_MINE_BURSTS)
      })
      const timer = window.setTimeout(() => {
        setMineBursts((current) => current.filter((entry) => entry.id !== burst.id))
        mineBurstTimersRef.current = mineBurstTimersRef.current.filter((id) => id !== timer)
      }, WORKSITE_MINE_BURST_MS + 80)
      mineBurstTimersRef.current.push(timer)
    },
    [],
  )

  useEffect(() => {
    setSpotWear({})
    setRecentMinedSpotId(null)
  }, [activeBiomeId])

  useEffect(() => {
    return () => {
      for (const timer of mineBurstTimersRef.current) {
        window.clearTimeout(timer)
      }
      if (recentMineTimerRef.current != null) {
        window.clearTimeout(recentMineTimerRef.current)
      }
    }
  }, [])

  const handleSpotMine = useCallback(
    (spotId: WorksiteSpotId) => {
      const current = worksiteRef.current
      if (!spotUnlockedForUi(activeBiomeId, spotId)) return

      const spot = getWorksiteSpot(activeBiomeId, spotId)
      const assigned = worksiteAssignedPets(current, activeBiomeId, spotId, petsRef.current)
      const yieldAmount = computeWorksiteClickYield(spot, assigned)
      const spotKey = worksiteSpotKey(activeBiomeId, spotId)
      const resourceVisual = getWorksiteResourceIconVisual(spot.resourceId)
      const burstEmoji =
        spot.resourceId === 'food' ? spot.emoji : resourceVisual.fallbackEmoji

      persist({
        ...current,
        totalProducedBySpot: {
          ...current.totalProducedBySpot,
          [spotKey]: (current.totalProducedBySpot[spotKey] ?? 0) + yieldAmount,
        },
      })
      onComplete(1, 1, { [spot.resourceId]: yieldAmount }, { keepOpen: true, silent: true })
      setSessionClicks((value) => value + 1)
      setSpotWear((wear) => ({ ...wear, [spotId]: (wear[spotId] ?? 0) + 1 }))
      setRecentMinedSpotId(spotId)
      if (recentMineTimerRef.current != null) {
        window.clearTimeout(recentMineTimerRef.current)
      }
      recentMineTimerRef.current = window.setTimeout(() => {
        setRecentMinedSpotId((current) => (current === spotId ? null : current))
        recentMineTimerRef.current = null
      }, 1600)
      spawnMineBursts(
        spotId,
        burstEmoji,
        resourceVisual.asset,
        formatMineYieldLabel(spot.resourceId, yieldAmount),
      )
      playWorksiteMine(spot.resourceId)
    },
    [activeBiomeId, onComplete, persist, spawnMineBursts, spotUnlockedForUi],
  )

  const handleSpotPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>, spotId: WorksiteSpotId) => {
      event.preventDefault()
      handleSpotMine(spotId)
    },
    [handleSpotMine],
  )

  const applyAssignFilters = () => {
    setAppliedAssignSort(assignSort)
    setAppliedBatchCount(batchCount)
    setAppliedBatchCriteria(batchCriteria)
    setAssignPage(0)
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now()
      const current = worksiteRef.current
      const currentPets = petsRef.current
      let combined: Cost = {}
      let granted = false
      const produced = { ...current.totalProducedBySpot }
      const sharedLastTick = current.lastAutoTickAt

      for (const { biomeId, spotId, spot } of iterUnlockedWorksiteSpots(current)) {
        const assigned = worksiteAssignedPets(current, biomeId, spotId, currentPets)
        const supervised = biomeId === current.activeBiomeId ? WORKSITE_SUPERVISION_MULT : 1
        const grant = computeWorksiteAutoGrant(
          spot,
          assigned,
          sharedLastTick,
          now,
          supervised,
        )
        if (grant.amount > 0) {
          combined = mergeCosts(combined, grant.reward)
          const key = worksiteSpotKey(biomeId, spotId)
          produced[key] = (produced[key] ?? 0) + grant.amount
          granted = true
        }
      }

      const prestigeGrant = computePrestigeGrant(current, currentPets, sharedLastTick, now)
      const prestigeTotal = prestigeGrant.amount

      const next: MyrionWorksiteSave = {
        ...current,
        lastAutoTickAt: now,
        totalProducedBySpot: produced,
        totalAstralShards:
          prestigeTotal > 0
            ? prestigeGrant.nextTotal
            : (current.totalAstralShards ?? 0),
      }

      worksiteRef.current = next

      if (granted) {
        setWorksite(next)
        onCompleteRef.current(0, 1, combined, { keepOpen: true, silent: true })
      } else if (prestigeTotal > 0) {
        setWorksite(next)
      }

      flushWorksiteSave(next, granted || prestigeTotal > 0)
    }, AUTO_TICK_MS)

    return () => {
      window.clearInterval(timer)
      flushWorksiteSave(worksiteRef.current, true)
    }
  }, [flushWorksiteSave])

  const biomeAssigned = useMemo(
    () => worksiteAssignedPetsInBiome(worksite, activeBiomeId, pets),
    [worksite, activeBiomeId, pets],
  )

  const assignPet = (petId: string) => {
    persist(assignMyrionsToBiome(worksite, activeBiomeId, [petId]))
  }

  const prestigeAssigned = useMemo(
    () => getPrestigeAssignedPet(worksite, pets),
    [worksite, pets],
  )
  const prestigePerSec = useMemo(
    () => computePrestigePerSecond(worksite, pets),
    [worksite, pets],
  )
  const prestigeLrAvailable = useMemo(() => hasAnyLrPet(pets), [pets])
  const prestigeAssignableLr = useMemo(
    () => availableLrPetsForPrestige(worksite, pets),
    [worksite, pets],
  )
  const prestigeSceneVisible = isPrestigeSceneVisible(worksite)
  const totalAstralShards = worksite.totalAstralShards ?? 0

  const assignPrestigePet = (petId: string) => {
    const pet = pets.find((entry) => entry.id === petId)
    if (!pet || !canAssignPetToPrestige(worksite, pet)) return
    playWorksitePrestigeAssign()
    persist(assignLrToPrestige(worksite, petId))
  }

  const clearPrestigePet = () => {
    if (!worksite.prestigeAssignedMyrionId) return
    persist(clearPrestigeAssignment(worksite))
  }

  const totalProduced = (() => {
    let wood = 0
    let stone = 0
    let food = 0
    for (const { biomeId, spotId, spot } of iterUnlockedWorksiteSpots(worksite)) {
      const key = worksiteSpotKey(biomeId, spotId)
      const amount = worksite.totalProducedBySpot[key] ?? 0
      if (spot.resourceId === 'wood') wood += amount
      if (spot.resourceId === 'stone') stone += amount
      if (spot.resourceId === 'food') food += amount
    }
    return { wood, stone, food }
  })()

  const assignSpeciesGroup = (group: WorksiteSpeciesGroup) => {
    const sorted = sortPetsForWorksiteAssign(
      pets.filter((pet) => group.petIds.includes(pet.id)),
      biomeReferenceSpot,
      'efficiency-desc',
    )
    const target = sorted.find(
      (pet) =>
        !biomeAssigned.some((entry) => entry.id === pet.id) &&
        !worksitePetIsBusy(worksite, pet.id),
    )
    if (target) assignPet(target.id)
  }

  const assignSpeciesGroupAll = (group: WorksiteSpeciesGroup) => {
    const ids = sortPetsForWorksiteAssign(
      pets.filter(
        (pet) =>
          group.petIds.includes(pet.id) &&
          !biomeAssigned.some((entry) => entry.id === pet.id) &&
          !worksitePetIsBusy(worksite, pet.id),
      ),
      biomeReferenceSpot,
      'efficiency-desc',
    ).map((pet) => pet.id)
    if (ids.length > 0) persist(assignMyrionsToBiome(worksite, activeBiomeId, ids))
  }

  const removeSpeciesGroup = (group: WorksiteSpeciesGroup) => {
    const ids = biomeAssigned
      .filter((pet) => group.petIds.includes(pet.id))
      .map((pet) => pet.id)
    let next = worksite
    for (const id of ids) {
      next = removeMyrionFromBiome(next, activeBiomeId, id)
    }
    persist(next)
  }

  const runBatchAssign = () => {
    const available = availablePetsForBiome(worksite, pets, activeBiomeId)
    const picked = pickPetsForBatchAssign(
      available,
      biomeReferenceSpot,
      appliedAssignSort,
      appliedBatchCriteria,
      appliedBatchCount,
      assignPage,
      WORKSITE_ASSIGN_PAGE_SIZE,
    )
    if (picked.length === 0) return
    persist(assignMyrionsToBiome(worksite, activeBiomeId, picked.map((pet) => pet.id)))
  }

  const unassignAllFromBiome = () => {
    if (biomeAssigned.length === 0) return
    persist(clearBiomeAssignments(worksite, activeBiomeId))
    setAssignPage(0)
  }

  const availablePets = useMemo(
    () => availablePetsForBiome(worksite, pets, activeBiomeId),
    [worksite, pets, activeBiomeId],
  )

  const sortedAvailable = useMemo(
    () => sortPetsForWorksiteAssign(availablePets, biomeReferenceSpot, appliedAssignSort),
    [availablePets, biomeReferenceSpot, appliedAssignSort],
  )

  const pagedAvailable = useMemo(
    () => paginateList(sortedAvailable, assignPage, WORKSITE_ASSIGN_PAGE_SIZE),
    [sortedAvailable, assignPage],
  )

  const availableSpeciesGroups = useMemo(
    () => groupPetsBySpecies(pagedAvailable),
    [pagedAvailable],
  )

  const assignedSpeciesGroups = useMemo(
    () => assignedSpeciesSummary(biomeAssigned).speciesGroups,
    [biomeAssigned],
  )

  const assignedRarityGroups = useMemo(
    () => assignedSpeciesSummary(biomeAssigned).rarityGroups,
    [biomeAssigned],
  )

  const availablePageCount = Math.max(
    1,
    Math.ceil(sortedAvailable.length / WORKSITE_ASSIGN_PAGE_SIZE),
  )

  const renderSpeciesGroupRow = (group: WorksiteSpeciesGroup, assignedHere: boolean) => {
    const pet = group.representative
    const efficiency = worksitePetEfficiency(pet, biomeReferenceSpot)
    const blocked =
      !assignedHere &&
      group.petIds.every((id) => worksitePetIsBusy(worksite, id))
  return (
      <div className="mg-worksite-pet-row mg-worksite-pet-row--species" key={group.speciesId}>
        <span className="mg-worksite-pet-chibi">
          <PalmonSprite
            emoji={pet.emoji}
            name={pet.name}
            size="chibi"
            speciesId={pet.speciesId}
            variant="chibi"
          />
          <span className="mg-worksite-pet-emoji-fallback" aria-hidden>
            {pet.emoji}
          </span>
        </span>
        <span className="mg-worksite-pet-name">
          {pet.name}
          {group.count > 1 ? <span className="mg-worksite-pet-dup"> ×{group.count}</span> : null}
        </span>
        <span className="mg-worksite-pet-meta">
          <span className="mg-worksite-pet-rarity" style={{ color: RARITY_COLORS[pet.rarity] }}>
            {pet.rarity}
          </span>
          <span className="mg-worksite-pet-eff">{formatYield(efficiency)}/s</span>
        </span>
        {assignedHere ? (
          <div className="mg-worksite-pet-actions">
            <button
              className="mg-worksite-pet-btn secondary"
              type="button"
              onClick={() => removeSpeciesGroup(group)}
            >
              Retirer{group.count > 1 ? ` ×${group.count}` : ''}
            </button>
          </div>
        ) : blocked ? (
          <span className="mg-worksite-pet-busy">Ailleurs</span>
        ) : (
          <div className="mg-worksite-pet-actions">
            <button className="mg-worksite-pet-btn" type="button" onClick={() => assignSpeciesGroup(group)}>
              Assigner
            </button>
            {group.count > 1 ? (
              <button
                className="mg-worksite-pet-btn subtle"
                type="button"
                onClick={() => assignSpeciesGroupAll(group)}
              >
                Tout ×{group.count}
              </button>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  const biomeAutoPerSec = useMemo(
    () =>
      activeSpots.reduce((sum, spot) => {
        const assigned = worksiteAssignedPets(worksite, activeBiomeId, spot.id, pets)
        return sum + computeWorksiteAutoPerSecond(spot, assigned, WORKSITE_SUPERVISION_MULT)
      }, 0),
    [activeSpots, worksite, activeBiomeId, pets],
  )

  const chantierMonitorStats = useMemo(() => {
    let globalAuto = 0
    const assignedIds = new Set<string>()
    for (const { biomeId, spotId, spot } of iterUnlockedWorksiteSpots(worksite)) {
      const assigned = worksiteAssignedPets(worksite, biomeId, spotId, pets)
      const mult = biomeId === activeBiomeId ? WORKSITE_SUPERVISION_MULT : 1
      globalAuto += computeWorksiteAutoPerSecond(spot, assigned, mult)
      for (const pet of assigned) assignedIds.add(pet.id)
    }
    if (worksite.prestigeAssignedMyrionId) {
      assignedIds.add(worksite.prestigeAssignedMyrionId)
    }
    globalAuto += prestigePerSec
    return {
      globalAuto,
      assignedCount: assignedIds.size,
      biomeAssignedCount: biomeAssigned.length,
    }
  }, [worksite, pets, activeBiomeId, prestigePerSec, biomeAssigned.length])

  const spotWearLevel = (spotId: WorksiteSpotId) => Math.min(5, (spotWear[spotId] ?? 0) % 6)
  const biomeSpeciesCount = assignedSpeciesGroups.length
  const biomeSpeciesSlotsLeft = Math.max(0, WORKSITE_LIFE_MAX_SPECIES - biomeSpeciesCount)
  const biomeResourceVisual = getWorksiteResourceIconVisual(biomeReferenceSpot.resourceId)
  const biomeResourceLabel = RESOURCE_LABELS[biomeReferenceSpot.resourceId] ?? biomeReferenceSpot.resourceId
  const supervisionPct = Math.round((WORKSITE_SUPERVISION_MULT - 1) * 100)
  const lifePlan = useMemo(
    () => buildWorksiteBiomeLifePlan(worksite, activeBiomeId, pets, getLifeTimeBucket()),
    [worksite, activeBiomeId, pets],
  )

  const drawers = [
    {
      id: 'biomes',
      label: 'Biomes',
      icon: '🗺️',
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">Choisir le biome affiché — {WORKSITE_BIOME_IDS.length} biomes</p>
          {devEnabled ? (
            <div className="mg-worksite-dev-tools" role="group" aria-label="Outils dev Ferme lunaire">
              <button
                className={`mg-worksite-dev-btn${devUnlockAll ? ' active' : ''}`}
                type="button"
                onClick={toggleDevUnlock}
              >
                {devUnlockAll ? 'Dev unlock ON' : 'Dev unlock OFF'}
              </button>
              <button
                className={`mg-worksite-dev-btn${placementDebug ? ' active' : ''}`}
                type="button"
                onClick={togglePlacementDebug}
              >
                Placement debug
              </button>
            </div>
          ) : null}
          <ul className="mg-worksite-biome-list">
            {WORKSITE_BIOME_IDS.map((biomeId) => {
              const biome = WORKSITE_BIOMES[biomeId]
              const unlocked = biomeUnlockedForUi(biomeId)
              const hint = getBiomeUnlockHint(biomeId)
              return (
                <li key={biomeId}>
                  <button
                    className={`mg-worksite-biome-btn ${activeBiomeId === biomeId ? 'active' : ''} ${unlocked ? '' : WORKSITE_UI_VISUALS['biome-locked'].asset.placeholderClass}`}
                    disabled={!unlocked}
                    type="button"
                    onClick={() => selectBiome(biomeId)}
                  >
                    <span>
                      {biome.emoji} {biome.label}
                      {!unlocked ? ' 🔒' : null}
                    </span>
                    {activeBiomeId === biomeId ? (
                      <span className="mg-worksite-biome-meta">Affiché · supervision</span>
                    ) : unlocked ? (
                      <span className="mg-worksite-biome-meta">Production passive</span>
                    ) : (
                      <span className="mg-worksite-biome-meta">
                        {hint ? `Débloquer : ${hint}` : 'Verrouillé'}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ),
    },
    {
      id: 'prestige',
      label: 'Prestige',
      icon: '✨',
      badge: prestigeAssigned ? 1 : undefined,
      content: (
        <div className="mg-worksite-drawer-section mg-worksite-prestige-panel">
          <p className="mg-worksite-drawer-lead">{WORKSITE_PRESTIGE_CONFIG.name}</p>
          <p className="mg-worksite-prestige-help">{WORKSITE_PRESTIGE_CONFIG.helpText}</p>
          {!prestigeSceneVisible ? (
            <p className="mg-worksite-empty">
              Débloque la Mine douce pour voir la Faille astrale.
            </p>
          ) : (
            <>
              <ul className="mg-worksite-prestige-stats">
                <li>
                  État :{' '}
                  {prestigeLrAvailable
                    ? prestigeAssigned
                      ? 'LR assigné'
                      : 'Disponible'
                    : 'Verrouillé'}
                </li>
                <li>
                  Production : {formatPrestigeAmount(prestigePerSec)} {WORKSITE_PRESTIGE_CONFIG.resourceLabel}/s
                </li>
                <li>
                  Total : {formatPrestigeAmount(totalAstralShards)}{' '}
                  {WORKSITE_PRESTIGE_CONFIG.resourceLabel}
                </li>
              </ul>
              {!prestigeLrAvailable ? (
                <p className="mg-worksite-prestige-locked">
                  {WORKSITE_PRESTIGE_CONFIG.lrRequirementLabel}
                </p>
              ) : null}
              {prestigeAssigned ? (
                <div className="mg-worksite-prestige-assigned">
                  <span className="mg-worksite-pet-chibi">
                    <PalmonSprite
                      emoji={prestigeAssigned.emoji}
                      name={prestigeAssigned.name}
                      speciesId={prestigeAssigned.speciesId}
                    />
                  </span>
                  <span>
                    {prestigeAssigned.name}{' '}
                    <span
                      className="mg-worksite-pet-rarity"
                      style={{ color: RARITY_COLORS[prestigeAssigned.rarity] }}
                    >
                      {prestigeAssigned.rarity}
                    </span>
                  </span>
                  <button className="mg-worksite-pet-btn secondary" type="button" onClick={clearPrestigePet}>
                    Retirer
                  </button>
                </div>
              ) : prestigeLrAvailable ? (
                <ul className="mg-worksite-prestige-lr-list">
                  {prestigeAssignableLr.map((pet) => (
                    <li key={pet.id}>
                      <button
                        className="mg-worksite-pet-btn"
                        type="button"
                        onClick={() => assignPrestigePet(pet.id)}
                      >
                        Assigner {pet.name} ({pet.rarity})
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mg-worksite-note">{WORKSITE_PRESTIGE_CONFIG.drawerLead}</p>
            </>
          )}
        </div>
      ),
    },
    {
      id: 'progress',
      label: 'Progression',
      icon: '📈',
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">Production cumulée (Ferme lunaire)</p>
          <ul className="mg-worksite-progress-totals">
            <li>Total : {formatYield(progressTotals.totalChantier)}</li>
            <li>Bois : {formatYield(progressTotals.wood)}</li>
            <li>Pierre : {formatYield(progressTotals.stone)}</li>
            <li>Vivres : {formatYield(progressTotals.food)}</li>
            <li>
              {WORKSITE_PRESTIGE_CONFIG.resourceLabel} : {formatPrestigeAmount(totalAstralShards)}
            </li>
          </ul>
          <p className="mg-worksite-drawer-lead">Prochains déblocages</p>
          <ul className="mg-worksite-progress-next">
            {WORKSITE_BIOME_IDS.filter((id) => !isWorksiteBiomeUnlocked(worksite, id)).map((biomeId) => (
              <li key={biomeId}>
                {WORKSITE_BIOMES[biomeId].emoji} {WORKSITE_BIOMES[biomeId].label} — {getBiomeUnlockHint(biomeId)}
              </li>
            ))}
            {WORKSITE_BIOME_IDS.flatMap((biomeId) =>
              WORKSITE_BIOMES[biomeId].spotIds
                .filter((spotId) => !isWorksiteSpotUnlocked(worksite, biomeId, spotId))
                .map((spotId) => {
                  const spotLabel =
                    getRuntimeSpotMeta(biomeId, spotId)?.displayName ?? WORKSITE_BIOMES[biomeId].label
                  return (
                  <li key={worksiteSpotKey(biomeId, spotId)}>
                    {WORKSITE_BIOMES[biomeId].emoji} {spotLabel} — {getSpotUnlockHint(biomeId, spotId) ?? 'Biome requis'}
                  </li>
                  )
                }),
            )}
          </ul>
          <p className="mg-worksite-note">
            Les biomes et filons se débloquent en produisant sur la Ferme lunaire.
          </p>
        </div>
      ),
    },
    {
      id: 'resources',
      label: 'Ressources',
      icon: '📦',
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">Total produit à la Ferme lunaire (session)</p>
          <ul className="mg-worksite-resource-list">
            {(
              [
                ['wood', totalProduced.wood, 'Bois'],
                ['stone', totalProduced.stone, 'Pierre'],
                ['food', totalProduced.food, 'Vivres'],
              ] as const
            ).map(([resourceId, amount, label]) => {
              const icon = getWorksiteResourceIconVisual(resourceId)
              return (
                <li key={resourceId}>
                  <WorksiteResourceIcon
                    asset={icon.asset}
                    emoji={icon.fallbackEmoji}
                    label={label}
                  />{' '}
                  {label} — {formatYield(amount)}
                </li>
              )
            })}
          </ul>
          <p className="mg-worksite-note">Gains additifs très faibles — équilibrage provisoire.</p>
        </div>
      ),
    },
    {
      id: 'assign',
      label: 'Myrions',
      icon: '🐾',
      badge: biomeAssigned.length || undefined,
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">
            {activeBiome.emoji} {activeBiome.label} — assignation
          </p>
          <p className="mg-worksite-species-quota">
            Espèces différentes (biome) :{' '}
            <strong>
              {biomeSpeciesCount} / {WORKSITE_LIFE_MAX_SPECIES}
            </strong>
            {biomeSpeciesSlotsLeft > 0 ? (
              <span className="mg-worksite-species-quota-ok">
                {' '}
                — encore {biomeSpeciesSlotsLeft} place{biomeSpeciesSlotsLeft > 1 ? 's' : ''} pour une
                nouvelle espèce
              </span>
            ) : (
              <span className="mg-worksite-species-quota-full">
                {' '}
                — limite atteinte (tu peux encore ajouter des doublons)
              </span>
            )}
          </p>
          <p className="mg-worksite-species-quota-spot">
            Sur ce biome : {biomeAssigned.length} Myrion{biomeAssigned.length > 1 ? 's' : ''} ·{' '}
            {biomeSpeciesCount} espèce{biomeSpeciesCount > 1 ? 's' : ''}
          </p>
          {pets.length === 0 ? (
            <p className="mg-worksite-empty">Aucun Myrion capturé. Va chasser pour en obtenir.</p>
          ) : (
            <>
              <div className="mg-worksite-assign-list">
              <div className="mg-worksite-assign-toolbar">
                <label className="mg-worksite-assign-field">
                  Tri
                  <select
                    value={assignSort}
                    onChange={(event) => setAssignSort(event.target.value as WorksiteAssignSort)}
                  >
                    <option value="efficiency-desc">Efficacité ↓</option>
                    <option value="efficiency-asc">Efficacité ↑</option>
                    <option value="rarity-desc">Rareté ↓</option>
                    <option value="name-asc">Nom A→Z</option>
                  </select>
                </label>
                <label className="mg-worksite-assign-field">
                  Lot
                  <select
                    value={String(batchCount)}
                    onChange={(event) => {
                      const raw = event.target.value
                      setBatchCount(
                        raw === 'page' || raw === 'all' ? raw : (Number(raw) as WorksiteBatchCount),
                      )
                    }}
                  >
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="page">Page ({WORKSITE_ASSIGN_PAGE_SIZE})</option>
                    <option value="all">Tous dispo</option>
                  </select>
                </label>
                <label className="mg-worksite-assign-field">
                  Critère
                  <select
                    value={batchCriteria}
                    onChange={(event) =>
                      setBatchCriteria(event.target.value as WorksiteBatchCriteria)
                    }
                  >
                    <option value="sorted-list">Liste triée</option>
                    <option value="top-efficiency">Top efficacité</option>
                  </select>
                </label>
                <button className="mg-worksite-pet-btn secondary" type="button" onClick={applyAssignFilters}>
                  Appliquer les filtres
                </button>
                <button className="mg-worksite-pet-btn" type="button" onClick={runBatchAssign}>
                  Assigner le lot
                </button>
                <button
                  className="mg-worksite-pet-btn secondary"
                  disabled={biomeAssigned.length === 0}
                  title="Retirer tous les Myrions de ce biome"
                  type="button"
                  onClick={unassignAllFromBiome}
                >
                  Désassigner tout
                </button>
              </div>
              <div className="mg-worksite-pet-group">
                <button
                  aria-expanded={assignedSectionOpen}
                  className="mg-worksite-pet-group-toggle"
                  type="button"
                  onClick={() => setAssignedSectionOpen((open) => !open)}
                >
                  <h4>Sur ce biome ({biomeAssigned.length})</h4>
                  <span aria-hidden>{assignedSectionOpen ? '▼' : '▶'}</span>
                </button>
                {assignedSectionOpen ? (
                  <>
                {assignedRarityGroups.length > 0 ? (
                  <p className="mg-worksite-rarity-summary">
                    {assignedRarityGroups.map((group) => (
                      <span key={group.rarity} style={{ color: RARITY_COLORS[group.rarity] }}>
                        {group.rarity} ×{group.count}{' '}
                      </span>
                    ))}
                  </p>
                ) : null}
                {assignedSpeciesGroups.length === 0 ? (
                  <p className="mg-worksite-empty">Aucun Myrion assigné.</p>
                ) : (
                  assignedSpeciesGroups.map((group) => renderSpeciesGroupRow(group, true))
                )}
                  </>
                ) : null}
              </div>
              <div className="mg-worksite-pet-group">
                <button
                  aria-expanded={availableSectionOpen}
                  className="mg-worksite-pet-group-toggle"
                  type="button"
                  onClick={() => setAvailableSectionOpen((open) => !open)}
                >
                  <h4>
                    Disponibles ({sortedAvailable.length}) — page {assignPage + 1}/{availablePageCount}
                  </h4>
                  <span aria-hidden>{availableSectionOpen ? '▼' : '▶'}</span>
                </button>
                {availableSectionOpen ? (
                  <>
                {availableSpeciesGroups.length === 0 ? (
                  <p className="mg-worksite-empty">Aucun Myrion disponible pour ce biome.</p>
                ) : (
                  availableSpeciesGroups.map((group) => renderSpeciesGroupRow(group, false))
                )}
                {availablePageCount > 1 ? (
                  <div className="mg-worksite-assign-pagination">
                    <button
                      className="mg-worksite-pet-btn secondary"
                      disabled={assignPage <= 0}
                      type="button"
                      onClick={() => setAssignPage((page) => Math.max(0, page - 1))}
                    >
                      Précédent
                    </button>
                    <button
                      className="mg-worksite-pet-btn secondary"
                      disabled={assignPage >= availablePageCount - 1}
                      type="button"
                      onClick={() =>
                        setAssignPage((page) => Math.min(availablePageCount - 1, page + 1))
                      }
                    >
                      Suivant
                    </button>
                  </div>
                ) : null}
                  </>
                ) : null}
              </div>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      id: 'production',
      label: 'Production',
      icon: '⚙️',
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">Détail — {activeBiome.label}</p>
          <dl className="mg-worksite-stats">
            <div>
              <dt>Ressource</dt>
              <dd>
                {biomeResourceLabel} · {activeSpots.length} filon{activeSpots.length > 1 ? 's' : ''}
              </dd>
            </div>
            <div>
              <dt>Myrions assignés</dt>
              <dd>{biomeAssigned.length}</dd>
            </div>
            <div>
              <dt>Gain par clic</dt>
              <dd>Selon le filon miné</dd>
            </div>
            <div>
              <dt>Auto / seconde</dt>
              <dd>
                {formatYield(biomeAutoPerSec)}
                <span className="mg-worksite-supervision-inline">
                  {' '}
                  (+{Math.round((WORKSITE_SUPERVISION_MULT - 1) * 100)}% supervision)
                </span>
              </dd>
            </div>
            <div>
              <dt>Bonus rareté</dt>
              <dd>
                {assignedRarityGroups.length === 0 ? (
                  '—'
                ) : (
                  <span className="mg-worksite-rarity-summary">
                    {assignedRarityGroups.map((group) => (
                      <span key={group.rarity} style={{ color: RARITY_COLORS[group.rarity] }}>
                        {group.rarity} ×{group.count} (×{worksiteRarityMultiplier(group.rarity)}){' '}
                      </span>
                    ))}
                  </span>
                )}
              </dd>
            </div>
          </dl>
          {worksite.unlockedBiomeIds.length > 1 ? (
            <>
              <p className="mg-worksite-drawer-lead">Autres biomes (passif)</p>
              <ul className="mg-worksite-other-biomes">
                {worksite.unlockedBiomeIds
                  .filter((biomeId) => biomeId !== activeBiomeId)
                  .map((biomeId) => {
                    const biome = WORKSITE_BIOMES[biomeId]
                    const spots = getSpotsForBiome(biomeId)
                    const assignedCount = spots.reduce(
                      (sum, spot) =>
                        sum +
                        worksiteAssignedPets(worksite, biomeId, spot.id, pets).length,
                      0,
                    )
                    return (
                      <li key={biomeId}>
                        {biome.emoji} {biome.label} — {assignedCount} Myrion(s) assigné(s)
                      </li>
                    )
                  })}
              </ul>
            </>
          ) : null}
          <p className="mg-worksite-note">Équilibrage provisoire MVP 2.</p>
        </div>
      ),
    },
    {
      id: 'life',
      label: 'Vie',
      icon: '🌿',
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">Vie de la ferme</p>
          <p className="mg-worksite-note">
            Les Myrions ont de petites routines décoratives. Repos, repas et sommeil n&apos;affectent pas
            la production dans ce MVP.
          </p>
          <dl className="mg-worksite-stats">
            <div>
              <dt>Myrions assignés (biome)</dt>
              <dd>{lifePlan.totalAssigned}</dd>
            </div>
            <div>
              <dt>Espèces visibles</dt>
              <dd>
                {lifePlan.representatives.length}
                {lifePlan.speciesOverflow > 0 ? ` (+${lifePlan.speciesOverflow} esp.)` : ''}
              </dd>
            </div>
            {lifePlan.dominantState ? (
              <div>
                <dt>État dominant</dt>
                <dd>{decorativeStateLabel(lifePlan.dominantState)}</dd>
              </div>
            ) : null}
          </dl>
          {lifePlan.representatives.length > 0 ? (
            <ul className="mg-worksite-compact-species-list mg-worksite-life-drawer-list">
              {lifePlan.representatives.map((entry) => (
                <li className="mg-worksite-compact-species-item" key={entry.speciesId}>
                  <span className="mg-worksite-compact-chibi">
                    <PalmonSprite
                      emoji={entry.representative.emoji}
                      name={entry.representative.name}
                      size="chibi"
                      speciesId={entry.speciesId}
                      variant="chibi"
                    />
                  </span>
                  <span className="mg-worksite-compact-name">
                    {entry.representative.name}
                    {entry.duplicateCount > 1 ? ` ×${entry.duplicateCount}` : ''} —{' '}
                    {decorativeStateLabel(entry.state)}
                  </span>
                </li>
              ))}
              {lifePlan.hiddenAssigned > 0 ? (
                <li className="mg-worksite-myrion-overflow-inline">
                  +{lifePlan.hiddenAssigned} autres (hors scène)
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="mg-worksite-empty">Aucun Myrion assigné dans ce biome.</p>
          )}
        </div>
      ),
    },
    {
      id: 'help',
      label: 'Aide',
      icon: '💡',
      content: (
        <div className="mg-worksite-drawer-section mg-worksite-help">
          <ul>
            <li>Tous les biomes assignés produisent passivement.</li>
            <li>Seul le biome affiché reçoit la supervision.</li>
            <li>Le clic mine le filon touché.</li>
            <li>Les gains restent volontairement faibles.</li>
          </ul>
          <p className="mg-worksite-note">
            Les Myrions restent disponibles ailleurs dans le jeu pour ce MVP.
          </p>
        </div>
      ),
    },
  ]

  const drawerOpen = openDrawer !== null && !monitoringMode

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionInScene={!monitoringMode}
      companionMood="Supervise doucement la Ferme lunaire."
      companionName={companionName}
      endless
      hideGlobalChrome
      maxScore={100}
      onClose={onClose}
      onRestart={() => {}}
      resourceLabel={resourceLabel}
      score={Math.round(totalProduced.wood + totalProduced.stone + totalProduced.food)}
      scoreLabel="Production ferme"
      status="playing"
    >
      <div className={`mg-worksite mg-worksite-immersive${monitoringMode ? ' mg-worksite--monitoring' : ''}`}>
        <div className="mg-worksite-layout">
          {monitoringMode ? (
            <header className="mg-worksite-monitor-bar" aria-label="Surveillance passive">
              <div className="mg-worksite-monitor-bar-top">
                <span className="mg-worksite-monitor-title">Surveillance</span>
                <button
                  className="mg-worksite-monitor-btn"
                  type="button"
                  onClick={() => setMonitoringModeEnabled(false)}
                >
                  Vue normale
                </button>
                <button className="mg-worksite-monitor-btn subtle" type="button" onClick={onClose}>
                  Fermer
                </button>
              </div>
              <div className="mg-worksite-monitor-biomes" role="group" aria-label="Biome affiché">
                {WORKSITE_BIOME_IDS.map((biomeId) => {
                  const biome = WORKSITE_BIOMES[biomeId]
                  const unlocked = biomeUnlockedForUi(biomeId)
                  return (
                    <button
                      className={`mg-worksite-monitor-biome-btn${activeBiomeId === biomeId ? ' active' : ''}`}
                      disabled={!unlocked}
                      key={biomeId}
                      type="button"
                      onClick={() => selectBiome(biomeId)}
                    >
                      {biome.emoji}
                    </button>
                  )
                })}
              </div>
              <dl className="mg-worksite-monitor-stats">
                <div>
                  <dt>Biome</dt>
                  <dd>
                    {activeBiome.emoji} {biomeResourceLabel}
                  </dd>
                </div>
                <div>
                  <dt>Auto biome</dt>
                  <dd>{formatYield(biomeAutoPerSec)}/s</dd>
                </div>
                <div>
                  <dt>Production auto</dt>
                  <dd>{formatYield(chantierMonitorStats.globalAuto)}/s</dd>
                </div>
                <div>
                  <dt>Myrions</dt>
                  <dd>{chantierMonitorStats.assignedCount}</dd>
                </div>
                <div>
                  <dt>Vivres</dt>
                  <dd>{formatYield(totalProduced.food)}</dd>
                </div>
                <div>
                  <dt>Bois</dt>
                  <dd>{formatYield(totalProduced.wood)}</dd>
                </div>
                <div>
                  <dt>Pierre</dt>
                  <dd>{formatYield(totalProduced.stone)}</dd>
                </div>
                {prestigeSceneVisible ? (
                  <div>
                    <dt>{WORKSITE_PRESTIGE_CONFIG.resourceLabel}</dt>
                    <dd>{formatPrestigeAmount(totalAstralShards)}</dd>
                  </div>
                ) : null}
              </dl>
            </header>
          ) : (
            <HuntSideRail
              drawers={drawers}
              fabAriaLabel="Menu Ferme lunaire"
              menuAriaLabel="Gestion de la ferme"
              menuTitle="Ferme"
              openId={openDrawer}
              onCloseMinigame={onClose}
              onOpenChange={handleDrawerOpenChange}
            />
          )}
          <div
            className={`mg-worksite-scene-wrap${drawerOpen ? '' : ' mg-worksite-scene-wrap--fullscreen'}`}
          >
            {drawerOpen ? (
              <header className="mg-worksite-scene-head">
                <div className="mg-worksite-scene-head-row">
                  <h2>
                    {activeBiome.emoji} {activeBiome.label}
                  </h2>
                  <span className="mg-worksite-supervision-badge" title="Bonus auto sur ce biome">
                    Supervision +{supervisionPct}%
                  </span>
                </div>
                <p className="mg-worksite-scene-head-tagline">
                  Trois filons sur le même écran — prairie : vivres · forêt : bois · mine : minerais.
                </p>
              </header>
            ) : null}

            {drawerOpen && unlockNotices.length > 0 ? (
              <div className="mg-worksite-unlock-banner" role="status">
                {unlockNotices.map((notice) => (
                  <p key={notice.id}>
                    <span className="mg-worksite-badge-new">Débloqué</span> {notice.label}
                  </p>
                ))}
              </div>
            ) : null}

            <div className="mg-worksite-scene-stage" ref={sceneStageRef}>
              <div
                aria-label={activeBiome.label}
                className={`${worksiteSceneClassNames(activeBiomeId, true, activeBiome.panoramaClass)}${monitoringMode ? ' mg-worksite-scene--monitoring' : ''}`}
                ref={sceneRef}
                role="img"
              >
                <WorksiteBiomeBackground
                  asset={getWorksiteBiomeVisual(activeBiomeId).background}
                  biomeId={activeBiomeId}
                  label={activeBiome.label}
                  objectPosition={getWorksiteBiomeBackgroundFrame(activeBiomeId).objectPosition}
                />
                <div className="mg-worksite-sky" />
                <div className="mg-worksite-hills" />
                {!monitoringMode ? (
                <div
                  className={`mg-worksite-biome-resource-chip mg-worksite-biome-resource-chip--${biomeReferenceSpot.resourceId}`}
                  title={`Ressource du biome : ${biomeResourceLabel}`}
                >
                  <WorksiteResourceIcon
                    asset={biomeResourceVisual.asset}
                    className="mg-worksite-biome-resource-chip-icon"
                    emoji={biomeResourceVisual.fallbackEmoji}
                    label={biomeResourceLabel}
                  />
                  <span>{biomeResourceLabel}</span>
                </div>
                ) : (
                  <span className="mg-worksite-monitor-scene-chip">
                    {activeBiome.emoji} {biomeResourceLabel} · {formatYield(biomeAutoPerSec)}/s
                  </span>
                )}
                {!monitoringMode ? (
                  <WorksiteCompanionSupport
                    activity={activity}
                    companionAffinity={companionAffinity}
                  />
                ) : null}
                <div className="mg-worksite-spot-markers">
                  {activeSpots.map((spot) => {
                    const spotVisual = getWorksiteSpotVisual(spot.id)
                    const locked = !spotUnlockedForUi(activeBiomeId, spot.id)
                    const placement = resolveWorksiteSpotPlacement(activeBiomeId, spot.id, isMobile)
                    const placementStyle = placement ? worksiteSpotPlacementStyle(placement) : undefined
                    const wear = spotWearLevel(spot.id)
                    const recent = recentMinedSpotId === spot.id
                    const spotResourceVisual = getWorksiteResourceIconVisual(spot.resourceId)
                    return (
                      <button
                        aria-label={`Miner ${spot.name}`}
                        className={`${worksiteSpotMarkerClassNames(spot.id, recent, locked)} mg-worksite-marker--placed mg-worksite-marker--wear-${wear}${recent ? ' mg-worksite-marker--recent' : ''}${locked ? ' mg-worksite-marker--locked' : ''}`}
                        disabled={locked}
                        key={spot.id}
                        ref={(node) => {
                          if (node) markerRefs.current[spot.id] = node
                          else delete markerRefs.current[spot.id]
                        }}
                        style={placementStyle}
                        type="button"
                        onPointerDown={(event) => handleSpotPointerDown(event, spot.id)}
                      >
                        <WorksiteSpotObject
                          asset={spotVisual.asset}
                          className={worksiteSpotObjectClassNames(spot.id)}
                          emoji={spot.emoji}
                          name={spot.name}
                        />
                        <span className="mg-worksite-marker-resource" aria-hidden>
                          <WorksiteResourceIcon
                            asset={spotResourceVisual.asset}
                            className="mg-worksite-marker-resource-icon"
                            emoji={spotResourceVisual.fallbackEmoji}
                            label={RESOURCE_LABELS[spot.resourceId] ?? spot.resourceId}
                          />
                        </span>
                        {locked ? (
                          <span aria-hidden className="mg-worksite-marker-lock">
                            🔒
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
                {placementDebug ? (
                  <WorksitePlacementDebug
                    biomeId={activeBiomeId}
                    mobile={isMobile}
                    spotIds={activeSpots.map((spot) => spot.id)}
                  />
                ) : null}
                {activeBiomeId === WORKSITE_PRESTIGE_SCENE_BIOME_ID && prestigeSceneVisible ? (
                  <div
                    className={`mg-worksite-prestige-anchor${prestigeLrAvailable ? '' : ' mg-worksite-prestige-anchor--locked'}`}
                    title={WORKSITE_PRESTIGE_CONFIG.name}
                  >
                    <div
                      aria-label={WORKSITE_PRESTIGE_CONFIG.name}
                      className="mg-worksite-prestige-marker"
                      role="img"
                    >
                      <WorksiteSpotObject
                        asset={WORKSITE_PRESTIGE_SPOT_VISUAL}
                        className={`mg-worksite-spot-object mg-worksite-prestige-object ${WORKSITE_PRESTIGE_SPOT_VISUAL.placeholderClass}`}
                        emoji={WORKSITE_PRESTIGE_CONFIG.emoji}
                        name={WORKSITE_PRESTIGE_CONFIG.name}
                      />
                      {!prestigeLrAvailable ? (
                        <span aria-hidden className="mg-worksite-prestige-lock">
                          🔒
                        </span>
                      ) : null}
                      {prestigeAssigned ? (
                        <span className="mg-worksite-prestige-chibi" aria-hidden>
                          <PalmonSprite
                            emoji={prestigeAssigned.emoji}
                            name={prestigeAssigned.name}
                            speciesId={prestigeAssigned.speciesId}
                          />
                        </span>
                      ) : null}
                    </div>
                    <span className="mg-worksite-prestige-caption">
                      {!prestigeLrAvailable
                        ? WORKSITE_PRESTIGE_CONFIG.lrRequirementLabel
                        : prestigeAssigned
                          ? `${formatPrestigeAmount(prestigePerSec)}/s`
                          : 'Assigner un LR'}
                    </span>
                  </div>
                ) : null}
                <WorksiteMyrionLifeLayer
                  activeBiomeId={activeBiomeId}
                  pets={pets}
                  worksite={worksite}
                />
                <WorksiteMineBursts bursts={mineBursts} />
                {!monitoringMode ? (
                  <button
                    aria-pressed={false}
                    className="mg-worksite-monitor-toggle"
                    type="button"
                    onClick={() => setMonitoringModeEnabled(true)}
                  >
                    Mode surveillance passive
                  </button>
                ) : null}
              </div>
              {!drawerOpen && unlockNotices.length > 0 ? (
                <div className="mg-worksite-unlock-banner mg-worksite-unlock-banner--overlay" role="status">
                  {unlockNotices.map((notice) => (
                    <p key={notice.id}>
                      <span className="mg-worksite-badge-new">Débloqué</span> {notice.label}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            {drawerOpen ? (
              <p className="mg-worksite-mine-hint">
                Clique sur un filon pour miner — spam autorisé
              </p>
            ) : null}

            {drawerOpen ? (
            <div className="mg-worksite-compact">
              <div className="mg-worksite-compact-stats">
                <span>Auto {formatYield(biomeAutoPerSec)}/s</span>
                <span className="mg-worksite-compact-species">
                  Espèces {biomeSpeciesCount}/{WORKSITE_LIFE_MAX_SPECIES}
                </span>
                <span>Taps {sessionClicks}</span>
              </div>
              {assignedSpeciesGroups.length > 0 ? (
                <ul className="mg-worksite-compact-species-list" aria-label="Myrions sur le biome">
                  {assignedSpeciesGroups.slice(0, WORKSITE_LIFE_MAX_SPECIES).map((group) => (
                    <li className="mg-worksite-compact-species-item" key={group.speciesId}>
                      <span className="mg-worksite-compact-chibi">
                        <PalmonSprite
                          emoji={group.representative.emoji}
                          name={group.representative.name}
                          size="chibi"
                          speciesId={group.speciesId}
                          variant="chibi"
                        />
                      </span>
                      <span className="mg-worksite-compact-name">{group.representative.name}</span>
                      {group.count > 1 ? (
                        <span className="mg-worksite-compact-count">×{group.count}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mg-worksite-compact-empty">Aucun Myrion assigné sur ce biome.</p>
              )}
            </div>
            ) : null}

            {drawerOpen ? (
            <div className="mg-worksite-details">
              <button
                aria-expanded={detailsOpen}
                className="mg-worksite-details-toggle"
                type="button"
                onClick={() => setDetailsOpen((open) => !open)}
              >
                {detailsOpen ? 'Masquer' : 'Détail production biomes'}
              </button>
              {detailsOpen ? (
                <div className="mg-worksite-details-panel">
                  {worksite.unlockedBiomeIds.map((biomeId) => {
                    const biome = WORKSITE_BIOMES[biomeId]
                    const spots = getSpotsForBiome(biomeId)
                    const supervised = biomeId === activeBiomeId
                    return (
                      <div className="mg-worksite-details-biome" key={biomeId}>
                        <h3>
                          {biome.emoji} {biome.label}
                          {supervised ? (
                            <span className="mg-worksite-supervision-inline"> · supervision</span>
                          ) : null}
                        </h3>
                        <ul>
                          {spots.map((spot) => {
                            const assigned = worksiteAssignedPets(worksite, biomeId, spot.id, pets)
                            const mult = supervised ? WORKSITE_SUPERVISION_MULT : 1
                            const auto = computeWorksiteAutoPerSecond(spot, assigned, mult)
                            const click = computeWorksiteClickYield(spot, assigned)
                            return (
                              <li key={spot.id}>
                                <strong>
                                  {spot.emoji} {spot.name}
                                </strong>
                                <span>
                                  {assigned.length} Myrion(s) · clic {formatYield(click)} · auto{' '}
                                  {formatYield(auto)}/s
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                  <p className="mg-worksite-note">Équilibrage provisoire — MVP 2.</p>
                </div>
              ) : null}
            </div>
            ) : null}
          </div>
        </div>
      </div>
    </MinigameFrame>
  )
}
