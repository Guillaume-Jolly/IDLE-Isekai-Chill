import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { scaleReward } from '../../data/buildingActivities'

import {

  computeCaptureChance,

  gradeCaptureTiming,

  RARITY_CAPTURE_ATTEMPTS,

  rollCaptureSuccess,

  type CaptureGamePhase,

  type HuntPhase,

  type TimingGrade,

  resolveHuntGuideCompanion,

} from '../../data/captureHunt'

import {
  buildPlayerCollection,
  isBiomeUnlocked,
  rollEncounterInBiome,
} from '../../data/biomeProgression'

import {
  updateCaptureStats,
  revertCaptureStats,
  type MinigameSave,
  type PendingHuntCapture,
  type PetState,
  type RefugeProgressState,
} from '../../data/minigameSave'

import {
  compareCapturedMyrion,
  computeHuntFavorModifiers,
  createCapturedMyrion,
  pickActiveHuntFavors,
  tickHuntFavorsAfterEncounter,
  resolveAutoCaptureDecision,
  type CaptureCompareResult,
  type HuntAutoDecisionSettings,
  type HuntFavor,
  type HuntSearchObjective,
} from '../../data/myrionMvp2'
import { linkedMyrionCaptureBonus, removeCompanionLinksForPet } from '../../data/myrionCompanionLinks'
import { applyReleaseRewards } from '../../data/myrionRelease'
import {
  buildPendingCaptureSnapshots,
  pendingIdsMatchingCondition,
  pendingIdsMatchingKeepCondition,
  previewKeepPending,
  type PendingBulkKeepCondition,
  type PendingBulkReleaseCondition,
} from '../../data/pendingCaptures'

import {
  PALMON_RARITIES,
  RARITY_CAPTURE,
  RARITY_COLORS,
  type WildEncounter,
  getBiome,
} from '../../data/wildFamiliars'

import { BiomeMapPanel } from './BiomeMapPanel'

import { CaptureRingGame } from './CaptureRingGame'

import {
  buildRecentCapturesFromPets,
  type RecentCaptureEntry,
} from '../../data/recentCaptures'

import { RecentCapturesPanel } from './RecentCapturesPanel'

import { HuntObjectivePicker } from './HuntObjectivePicker'

import { HuntCapturePolicyPanel } from './HuntCapturePolicyPanel'

import { PendingCapturesPanel } from './PendingCapturesPanel'

import { HuntActiveFavorsPanel } from './HuntActiveFavorsPanel'

import { HuntSideRail, type HuntDrawerId } from './HuntSideRail'

import { CaptureComparePanel } from './CaptureComparePanel'

import { MyrionDebugPanel } from './MyrionDebugPanel'

import { HuntScene } from './HuntScene'

import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import { MinigameSwitchPanel } from './MinigameSwitchPanel'
import './CaptureMobile.css'
import { useIsMobileCapture } from '../../hooks/useMediaQuery'
import { MYRION_REFUGE_DEBUG } from '../../data/myrionDebug'



const REVEAL_MS = 2200
const AUTO_CAPTURE_MS = 3000
const AUTO_REPLAY_MS = 3000



export function FamiliarCaptureGame({

  activity,

  companionName,

  buildingName,

  resourceLabel,

  minigameSave,

  onSaveMinigame,

  onComplete,

  onClose,

  onLaunchMinigame,

}: MinigameProps) {

  const [pets, setPets] = useState<PetState[]>(() => minigameSave?.pets ?? [])

  useEffect(() => {
    setPets(minigameSave?.pets ?? [])
  }, [minigameSave?.saveVersion, minigameSave?.pets.length])

  const [captureStats, setCaptureStats] = useState(minigameSave?.captureStats)

  const [huntFavors, setHuntFavors] = useState<HuntFavor[]>(() => minigameSave?.huntFavors ?? [])

  const [searchObjectives, setSearchObjectives] = useState<HuntSearchObjective[]>(
    () => minigameSave?.searchObjectives ?? [],
  )

  const [huntAutoDecision, setHuntAutoDecision] = useState<HuntAutoDecisionSettings>(
    () => minigameSave?.huntAutoDecision ?? {},
  )

  const [pendingHuntCaptures, setPendingHuntCaptures] = useState<PendingHuntCapture[]>(
    () => minigameSave?.pendingHuntCaptures ?? [],
  )

  const [refugeProgress, setRefugeProgress] = useState<RefugeProgressState>(
    () => minigameSave?.refugeProgress ?? { shinyDiscovered: false, biomeFavors: {} },
  )

  const [companionLinks, setCompanionLinks] = useState<Partial<Record<string, string>>>(
    () => minigameSave?.companionMyrionLinks ?? {},
  )

  const [openDrawer, setOpenDrawer] = useState<HuntDrawerId | null>(null)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  const isGamePaused = sideMenuOpen || openDrawer !== null

  const [compareResult, setCompareResult] = useState<CaptureCompareResult | null>(null)

  const [lastCapturedPet, setLastCapturedPet] = useState<PetState | null>(null)

  const pendingDecision = Boolean(compareResult && lastCapturedPet)

  useEffect(() => {
    if (pendingDecision && compareResult?.overflowRequired) {
      setOpenDrawer('decision')
    }
  }, [pendingDecision, compareResult?.overflowRequired])

  const [sessionCaught, setSessionCaught] = useState(0)

  const [recentCaptures, setRecentCaptures] = useState<RecentCaptureEntry[]>(() =>
    buildRecentCapturesFromPets(minigameSave?.pets ?? []),
  )

  const [encounter, setEncounter] = useState<WildEncounter | null>(null)

  const [phase, setPhase] = useState<CaptureGamePhase>('explore')

  const [huntPhase, setHuntPhase] = useState<HuntPhase>('entering')

  const [captureProgress, setCaptureProgress] = useState(0)

  const [captureStartedAt, setCaptureStartedAt] = useState(0)

  const [captureAttempt, setCaptureAttempt] = useState(1)

  const [lastGrade, setLastGrade] = useState<TimingGrade | null>(null)

  const [stability, setStability] = useState(100)

  const [flash, setFlash] = useState("Explore les biomes — des Myrions sauvages t'attendent.")
  const [hudDetailsOpen, setHudDetailsOpen] = useState(false)

  const [lastResult, setLastResult] = useState<'success' | 'fail' | null>(null)

  const [finalChance, setFinalChance] = useState<number | null>(null)

  const [biomeBgFailed, setBiomeBgFailed] = useState(false)
  const isMobileCapture = useIsMobileCapture()

  const [autoReplaySec, setAutoReplaySec] = useState(Math.ceil(AUTO_REPLAY_MS / 1000))
  const [autoCaptureSec, setAutoCaptureSec] = useState(Math.ceil(AUTO_CAPTURE_MS / 1000))

  const revealTimerRef = useRef<number | null>(null)
  const revealDeadlineRef = useRef<number | null>(null)
  const revealRemainingRef = useRef<number | null>(null)
  const autoCaptureDeadlineRef = useRef<number | null>(null)
  const autoCaptureRemainingRef = useRef<number | null>(null)
  const autoReplayDeadlineRef = useRef<number | null>(null)
  const autoReplayRemainingRef = useRef<number | null>(null)
  const autoReplayIntervalRef = useRef<number | null>(null)
  const autoCaptureTimerRef = useRef<number | null>(null)
  const autoCaptureIntervalRef = useRef<number | null>(null)
  const autoReplayTimerRef = useRef<number | null>(null)
  const capturePauseStartRef = useRef<number | null>(null)
  const gamePausedRef = useRef(false)

  const timingGradesRef = useRef<TimingGrade[]>([])
  const huntPhaseRef = useRef(huntPhase)

  useEffect(() => {
    huntPhaseRef.current = huntPhase
  }, [huntPhase])

  useEffect(() => {
    gamePausedRef.current = isGamePaused
  }, [isGamePaused])

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current) {
      window.clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
    revealDeadlineRef.current = null
  }, [])

  const scheduleReveal = useCallback(
    (delayMs: number, encounterHint?: WildEncounter) => {
      clearRevealTimer()
      if (delayMs <= 0) {
        revealRemainingRef.current = null
        setHuntPhase('appeared')
        const hintBonus = pickActiveHuntFavors(huntFavors)
          .filter((favor) => favor.category === 'hint')
          .reduce((sum, favor) => sum + favor.value, 0)
        const target = encounterHint ?? encounter
        if (target) {
          setFlash(
            hintBonus > 0
              ? `${target.palmon.name} [${target.palmon.rarity}] — indice actif (niv. ${Math.round(hintBonus)})`
              : `${target.palmon.name} [${target.palmon.rarity}] — capture auto dans 3s…`,
          )
        }
        return
      }

      revealDeadlineRef.current = Date.now() + delayMs
      revealTimerRef.current = window.setTimeout(() => {
        revealTimerRef.current = null
        revealDeadlineRef.current = null
        revealRemainingRef.current = null
        setHuntPhase('appeared')
        const hintBonus = pickActiveHuntFavors(huntFavors)
          .filter((favor) => favor.category === 'hint')
          .reduce((sum, favor) => sum + favor.value, 0)
        const target = encounterHint ?? encounter
        if (target) {
          setFlash(
            hintBonus > 0
              ? `${target.palmon.name} [${target.palmon.rarity}] — indice actif (niv. ${Math.round(hintBonus)})`
              : `${target.palmon.name} [${target.palmon.rarity}] — capture auto dans 3s…`,
          )
        }
      }, delayMs)
    },
    [clearRevealTimer, encounter, huntFavors],
  )

  const clearAutoCaptureTimer = useCallback(() => {
    if (autoCaptureTimerRef.current) {
      window.clearTimeout(autoCaptureTimerRef.current)
      autoCaptureTimerRef.current = null
    }
    if (autoCaptureIntervalRef.current) {
      window.clearInterval(autoCaptureIntervalRef.current)
      autoCaptureIntervalRef.current = null
    }
    autoCaptureDeadlineRef.current = null
  }, [])

  const clearAutoReplayTimer = useCallback(() => {
    if (autoReplayTimerRef.current) {
      window.clearTimeout(autoReplayTimerRef.current)
      autoReplayTimerRef.current = null
    }
    if (autoReplayIntervalRef.current) {
      window.clearInterval(autoReplayIntervalRef.current)
      autoReplayIntervalRef.current = null
    }
    autoReplayDeadlineRef.current = null
  }, [])



  const persist = useCallback(
    (patch: {
      pets?: PetState[]
      captureStats?: typeof captureStats
      huntFavors?: HuntFavor[]
      searchObjectives?: HuntSearchObjective[]
      refugeProgress?: RefugeProgressState
      companionMyrionLinks?: Partial<Record<string, string>>
      refugeResources?: MinigameSave['refugeResources']
      huntAutoDecision?: HuntAutoDecisionSettings
      pendingHuntCaptures?: PendingHuntCapture[]
    }) => {
      if (!minigameSave || !onSaveMinigame) return
      onSaveMinigame({
        ...minigameSave,
        pets: patch.pets ?? pets,
        captureStats: patch.captureStats ?? captureStats,
        huntFavors: patch.huntFavors ?? huntFavors,
        searchObjectives: patch.searchObjectives ?? searchObjectives,
        refugeProgress: patch.refugeProgress ?? refugeProgress,
        companionMyrionLinks: patch.companionMyrionLinks ?? companionLinks,
        refugeResources: patch.refugeResources ?? minigameSave.refugeResources,
        huntAutoDecision: patch.huntAutoDecision ?? huntAutoDecision,
        pendingHuntCaptures: patch.pendingHuntCaptures ?? pendingHuntCaptures,
        echoEggs: minigameSave.echoEggs ?? [],
      })
    },
    [
      captureStats,
      companionLinks,
      huntAutoDecision,
      huntFavors,
      minigameSave,
      onSaveMinigame,
      pendingHuntCaptures,
      pets,
      refugeProgress,
      searchObjectives,
    ],
  )

  const activeFavors = useMemo(() => pickActiveHuntFavors(huntFavors), [huntFavors])
  const linkedCaptureBonus = useMemo(
    () => linkedMyrionCaptureBonus(pets, companionLinks, activity.companionId),
    [activity.companionId, companionLinks, pets],
  )
  const queuedFavorCount = useMemo(() => {
    const activeIds = new Set(activeFavors.map((favor) => favor.id))
    return huntFavors.filter(
      (favor) => favor.remainingEncounters > 0 && !activeIds.has(favor.id),
    ).length
  }, [activeFavors, huntFavors])

  const closeCompare = useCallback(() => {
    setCompareResult(null)
    setLastCapturedPet(null)
    setOpenDrawer((current) => (current === 'decision' ? null : current))
  }, [])

  const handleReleaseNewCapture = useCallback(() => {
    if (!lastCapturedPet || !minigameSave) return
    const nextPets = pets.filter((pet) => pet.id !== lastCapturedPet.id)
    const rewards = applyReleaseRewards(
      lastCapturedPet,
      refugeProgress,
      minigameSave.refugeResources ?? {},
    )
    setPets(nextPets)
    setRefugeProgress(rewards.refugeProgress)
    persist({
      pets: nextPets,
      refugeProgress: rewards.refugeProgress,
      refugeResources: rewards.refugeResources,
    })
    setFlash(`${lastCapturedPet.name} relâché — ${rewards.summary}.`)
    closeCompare()
  }, [closeCompare, lastCapturedPet, minigameSave, persist, pets, refugeProgress])

  const handleReplaceWeakestCapture = useCallback(() => {
    if (!lastCapturedPet || !compareResult?.weakestDuplicate) return
    const toRemove = compareResult.weakestDuplicate.id
    const nextPets = pets.filter((pet) => pet.id !== toRemove)
    const nextLinks = removeCompanionLinksForPet(companionLinks, toRemove)
    setCompanionLinks(nextLinks)
    setPets(nextPets)
    persist({ pets: nextPets, companionMyrionLinks: nextLinks })
    setFlash(`${compareResult.weakestDuplicate.name} remplacé par ${lastCapturedPet.name}.`)
    closeCompare()
  }, [closeCompare, compareResult, companionLinks, lastCapturedPet, persist, pets])

  const deferPendingCapture = useCallback(() => {
    if (!lastCapturedPet) return
    const nextPets = pets.filter((pet) => pet.id !== lastCapturedPet.id)
    const nextStats = revertCaptureStats(captureStats, lastCapturedPet.rarity)
    const pendingEntry: PendingHuntCapture = {
      id: lastCapturedPet.id,
      pet: lastCapturedPet,
      capturedAt: Date.now(),
      biomeId: lastCapturedPet.biomeId,
    }
    const nextPending = [...pendingHuntCaptures, pendingEntry]
    setPets(nextPets)
    setCaptureStats(nextStats)
    setSessionCaught((value) => Math.max(0, value - 1))
    setPendingHuntCaptures(nextPending)
    persist({ pets: nextPets, captureStats: nextStats, pendingHuntCaptures: nextPending })
    setFlash(`${lastCapturedPet.name} mis en attente (${nextPending.length} à trier).`)
    closeCompare()
  }, [captureStats, closeCompare, lastCapturedPet, pendingHuntCaptures, persist, pets])

  const releasePendingCapture = useCallback(
    (pendingId: string) => {
      const entry = pendingHuntCaptures.find((item) => item.id === pendingId)
      if (!entry || !minigameSave) return

      const nextPending = pendingHuntCaptures.filter((item) => item.id !== pendingId)
      const rewards = applyReleaseRewards(
        entry.pet,
        refugeProgress,
        minigameSave.refugeResources ?? {},
      )
      setPendingHuntCaptures(nextPending)
      setRefugeProgress(rewards.refugeProgress)
      persist({
        pendingHuntCaptures: nextPending,
        refugeProgress: rewards.refugeProgress,
        refugeResources: rewards.refugeResources,
      })
      setFlash(`${entry.pet.name} relâché — ${rewards.summary}.`)
    },
    [minigameSave, pendingHuntCaptures, persist, refugeProgress],
  )

  const releasePendingCapturesBulk = useCallback(
    (ids: string[]) => {
      if (ids.length === 0 || !minigameSave) return

      let nextProgress = refugeProgress
      let nextResources = minigameSave.refugeResources ?? {}
      const releasedNames: string[] = []

      for (const pendingId of ids) {
        const entry = pendingHuntCaptures.find((item) => item.id === pendingId)
        if (!entry) continue
        const rewards = applyReleaseRewards(entry.pet, nextProgress, nextResources)
        nextProgress = rewards.refugeProgress
        nextResources = rewards.refugeResources
        releasedNames.push(entry.pet.name)
      }

      const idSet = new Set(ids)
      const nextPending = pendingHuntCaptures.filter((item) => !idSet.has(item.id))

      setPendingHuntCaptures(nextPending)
      setRefugeProgress(nextProgress)
      persist({
        pendingHuntCaptures: nextPending,
        refugeProgress: nextProgress,
        refugeResources: nextResources,
      })
      setFlash(
        releasedNames.length === 1
          ? `${releasedNames[0]} relâché.`
          : `${releasedNames.length} Myrions relâchés.`,
      )
    },
    [minigameSave, pendingHuntCaptures, persist, refugeProgress],
  )

  const releaseAllPendingCaptures = useCallback(() => {
    releasePendingCapturesBulk(pendingHuntCaptures.map((entry) => entry.id))
  }, [pendingHuntCaptures, releasePendingCapturesBulk])

  const releasePendingByCondition = useCallback(
    (condition: PendingBulkReleaseCondition) => {
      const snapshots = buildPendingCaptureSnapshots(
        pendingHuntCaptures,
        pets,
        searchObjectives,
      )
      const ids = pendingIdsMatchingCondition(snapshots, condition)
      releasePendingCapturesBulk(ids)
    },
    [pendingHuntCaptures, pets, releasePendingCapturesBulk, searchObjectives],
  )

  const keepPendingCapture = useCallback(
    (pendingId: string) => {
      const entry = pendingHuntCaptures.find((item) => item.id === pendingId)
      if (!entry) return

      const preview = previewKeepPending(entry, pets, pendingHuntCaptures, searchObjectives)
      if (preview.overflowRequired && !preview.weakestDuplicate) {
        setFlash(
          `${entry.pet.name} — refuge saturé pour cette espèce. Relâche un exemplaire ou utilise Relâcher.`,
        )
        return
      }

      let nextPets = [...pets]
      let nextLinks = companionLinks
      if (preview.overflowRequired && preview.weakestDuplicate) {
        const removed = preview.weakestDuplicate
        nextPets = nextPets.filter((pet) => pet.id !== removed.id)
        nextLinks = removeCompanionLinksForPet(nextLinks, removed.id)
      }

      nextPets = [...nextPets, entry.pet]
      const nextPending = pendingHuntCaptures.filter((item) => item.id !== pendingId)
      const nextStats = updateCaptureStats(captureStats, entry.pet.rarity)
      const nextRefugeProgress: RefugeProgressState = {
        ...refugeProgress,
        shinyDiscovered:
          refugeProgress.shinyDiscovered || entry.pet.isShiny || Boolean(entry.pet.visualVariant),
      }

      setPets(nextPets)
      setCompanionLinks(nextLinks)
      setPendingHuntCaptures(nextPending)
      setCaptureStats(nextStats)
      setRefugeProgress(nextRefugeProgress)
      setSessionCaught((value) => value + 1)

      const reward = scaleReward(
        activity.baseReward,
        PALMON_RARITIES.indexOf(entry.pet.rarity) + 1,
        6,
      )
      onComplete(PALMON_RARITIES.indexOf(entry.pet.rarity) + 1, 6, reward, { keepOpen: true })

      persist({
        pets: nextPets,
        companionMyrionLinks: nextLinks,
        captureStats: nextStats,
        pendingHuntCaptures: nextPending,
        refugeProgress: nextRefugeProgress,
      })

      if (preview.overflowRequired && preview.weakestDuplicate) {
        setFlash(
          `${entry.pet.name} ajouté au refuge (remplace ${preview.weakestDuplicate.name}).`,
        )
        return
      }

      setFlash(`${entry.pet.name} ajouté au refuge.`)
    },
    [
      activity.baseReward,
      captureStats,
      companionLinks,
      onComplete,
      pendingHuntCaptures,
      persist,
      pets,
      refugeProgress,
      searchObjectives,
    ],
  )

  const keepPendingCapturesBulk = useCallback(
    (ids: string[], options?: { replaceOnOverflow?: boolean }) => {
      if (ids.length === 0) return

      const replaceOnOverflow = options?.replaceOnOverflow ?? true
      let nextPets = [...pets]
      let nextLinks = companionLinks
      let nextPending = [...pendingHuntCaptures]
      let nextStats = captureStats
      let nextRefugeProgress = refugeProgress
      const keptNames: string[] = []
      const replacedNames: string[] = []
      let skipped = 0

      for (const pendingId of ids) {
        const entry = nextPending.find((item) => item.id === pendingId)
        if (!entry) continue

        const preview = previewKeepPending(entry, nextPets, nextPending, searchObjectives)

        if (preview.overflowRequired) {
          if (!replaceOnOverflow) {
            skipped += 1
            continue
          }
          if (!preview.weakestDuplicate) {
            skipped += 1
            continue
          }
          nextPets = nextPets.filter((pet) => pet.id !== preview.weakestDuplicate!.id)
          nextLinks = removeCompanionLinksForPet(nextLinks, preview.weakestDuplicate!.id)
          replacedNames.push(preview.weakestDuplicate.name)
        }

        nextPets = [...nextPets, entry.pet]
        nextPending = nextPending.filter((item) => item.id !== pendingId)
        nextStats = updateCaptureStats(nextStats, entry.pet.rarity)
        nextRefugeProgress = {
          ...nextRefugeProgress,
          shinyDiscovered:
            nextRefugeProgress.shinyDiscovered ||
            entry.pet.isShiny ||
            Boolean(entry.pet.visualVariant),
        }
        keptNames.push(entry.pet.name)

        const reward = scaleReward(
          activity.baseReward,
          PALMON_RARITIES.indexOf(entry.pet.rarity) + 1,
          6,
        )
        onComplete(PALMON_RARITIES.indexOf(entry.pet.rarity) + 1, 6, reward, { keepOpen: true })
      }

      if (keptNames.length === 0) {
        setFlash(
          skipped > 0
            ? 'Aucun Myrion gardé — refuge saturé ou critère non rempli.'
            : 'Aucun Myrion à garder.',
        )
        return
      }

      setPets(nextPets)
      setCompanionLinks(nextLinks)
      setPendingHuntCaptures(nextPending)
      setCaptureStats(nextStats)
      setRefugeProgress(nextRefugeProgress)
      setSessionCaught((value) => value + keptNames.length)

      persist({
        pets: nextPets,
        companionMyrionLinks: nextLinks,
        captureStats: nextStats,
        pendingHuntCaptures: nextPending,
        refugeProgress: nextRefugeProgress,
      })

      const replaceNote =
        replacedNames.length > 0
          ? ` · ${replacedNames.length} remplacement${replacedNames.length > 1 ? 's' : ''}`
          : ''
      const skipNote =
        skipped > 0 ? ` · ${skipped} ignoré${skipped > 1 ? 's' : ''} (pas de place)` : ''

      setFlash(
        keptNames.length === 1
          ? `${keptNames[0]} ajouté au refuge${replaceNote}${skipNote}.`
          : `${keptNames.length} Myrions ajoutés au refuge${replaceNote}${skipNote}.`,
      )
    },
    [
      activity.baseReward,
      captureStats,
      companionLinks,
      onComplete,
      pendingHuntCaptures,
      persist,
      pets,
      refugeProgress,
      searchObjectives,
    ],
  )

  const keepAllPendingCaptures = useCallback(() => {
    keepPendingCapturesBulk(pendingHuntCaptures.map((entry) => entry.id), {
      replaceOnOverflow: true,
    })
  }, [keepPendingCapturesBulk, pendingHuntCaptures])

  const keepPendingByCondition = useCallback(
    (condition: PendingBulkKeepCondition) => {
      const snapshots = buildPendingCaptureSnapshots(
        pendingHuntCaptures,
        pets,
        searchObjectives,
      )
      const ids = pendingIdsMatchingKeepCondition(
        snapshots,
        condition,
        pets,
        pendingHuntCaptures,
      )
      keepPendingCapturesBulk(ids, {
        replaceOnOverflow: condition === 'all',
      })
    },
    [keepPendingCapturesBulk, pendingHuntCaptures, pets, searchObjectives],
  )

  const handleCapturePolicyChange = useCallback(
    (nextSettings: HuntAutoDecisionSettings) => {
      setHuntAutoDecision(nextSettings)
      persist({ huntAutoDecision: nextSettings })

      if (!lastCapturedPet || !compareResult) return

      const autoAction = resolveAutoCaptureDecision(compareResult, searchObjectives, nextSettings)
      if (autoAction === 'keep' && !compareResult.overflowRequired) {
        closeCompare()
        return
      }
      if (autoAction === 'release' && !compareResult.protectFromAutoRelease) {
        handleReleaseNewCapture()
        return
      }
      if (autoAction === 'replace' && compareResult.weakestDuplicate) {
        handleReplaceWeakestCapture()
        return
      }
      if (autoAction === 'defer') {
        deferPendingCapture()
      }
    },
    [
      closeCompare,
      compareResult,
      deferPendingCapture,
      handleReleaseNewCapture,
      handleReplaceWeakestCapture,
      lastCapturedPet,
      persist,
      searchObjectives,
    ],
  )



  const playerCollection = useMemo(
    () => buildPlayerCollection(pets, captureStats),
    [pets, captureStats],
  )



  const finishCapture = useCallback(
    (grades: TimingGrade[]) => {
      if (!encounter) return

      const favorModifiers = computeHuntFavorModifiers(huntFavors, {
        biomeId: encounter.biome.id,
        speciesId: encounter.palmon.id,
      })

      const chance = computeCaptureChance(
        encounter.palmon.rarity,
        grades,
        activity.companionId,
        encounter.biome.id,
        favorModifiers,
        linkedCaptureBonus,
      )

      setFinalChance(chance)

      const success = rollCaptureSuccess(chance)
      const nextFavors = tickHuntFavorsAfterEncounter(huntFavors)
      setHuntFavors(nextFavors)

      setPhase('result')
      setHuntPhase(success ? 'success' : 'failed')
      setLastResult(success ? 'success' : 'fail')

      const { palmon } = encounter

      setRecentCaptures((prev) =>
        [
          {
            key: `${palmon.id}-${Date.now()}`,
            speciesId: palmon.id,
            name: palmon.name,
            emoji: palmon.emoji,
            rarity: palmon.rarity,
            biomeId: encounter.biome.id,
            success,
            timestamp: Date.now(),
          },
          ...prev,
        ].slice(0, 10),
      )

      if (success) {
        const instanceId = `${palmon.id}-${Date.now()}`
        const nextPet = createCapturedMyrion(palmon, instanceId, Date.now(), {
          shinyBonus: favorModifiers.shinyBonus,
        })
        const comparison = compareCapturedMyrion(nextPet, pets, searchObjectives)
        const autoAction = resolveAutoCaptureDecision(comparison, searchObjectives, huntAutoDecision)

        if (autoAction === 'defer') {
          const pendingEntry: PendingHuntCapture = {
            id: instanceId,
            pet: nextPet,
            capturedAt: Date.now(),
            biomeId: encounter.biome.id,
          }
          const nextPending = [...pendingHuntCaptures, pendingEntry]
          setPendingHuntCaptures(nextPending)
          persist({ huntFavors: nextFavors, pendingHuntCaptures: nextPending })
          setFlash(
            `${nextPet.name} en attente de tri (${nextPending.length}) — aucun point tant qu'il n'est pas traité.`,
          )
          return
        }

        const nextStats = updateCaptureStats(captureStats, palmon.rarity)
        const nextRefugeProgress: RefugeProgressState = {
          ...refugeProgress,
          shinyDiscovered:
            refugeProgress.shinyDiscovered || nextPet.isShiny || Boolean(nextPet.visualVariant),
        }

        setCaptureStats(nextStats)
        setRefugeProgress(nextRefugeProgress)
        setSessionCaught((value) => value + 1)

        const reward = scaleReward(activity.baseReward, PALMON_RARITIES.indexOf(palmon.rarity) + 1, 6)
        onComplete(PALMON_RARITIES.indexOf(palmon.rarity) + 1, 6, reward, { keepOpen: true })

        if (autoAction === 'release') {
          const rewards = applyReleaseRewards(
            nextPet,
            nextRefugeProgress,
            minigameSave?.refugeResources ?? {},
          )
          setRefugeProgress(rewards.refugeProgress)
          persist({
            pets,
            captureStats: nextStats,
            huntFavors: nextFavors,
            refugeProgress: rewards.refugeProgress,
            refugeResources: rewards.refugeResources,
          })
          setFlash(`${nextPet.name} relâché automatiquement — ${rewards.summary}.`)
        } else if (autoAction === 'replace' && comparison.weakestDuplicate) {
          const toRemove = comparison.weakestDuplicate.id
          const nextPets = pets.filter((pet) => pet.id !== toRemove)
          const nextLinks = removeCompanionLinksForPet(companionLinks, toRemove)
          const nextPetsWithNew = [...nextPets, nextPet]
          setCompanionLinks(nextLinks)
          setPets(nextPetsWithNew)
          persist({
            pets: nextPetsWithNew,
            captureStats: nextStats,
            huntFavors: nextFavors,
            refugeProgress: nextRefugeProgress,
            companionMyrionLinks: nextLinks,
          })
          setFlash(`${comparison.weakestDuplicate.name} remplacé par ${nextPet.name}.`)
        } else if (autoAction === 'keep') {
          const nextPets = [...pets, nextPet]
          setPets(nextPets)
          persist({
            pets: nextPets,
            captureStats: nextStats,
            huntFavors: nextFavors,
            refugeProgress: nextRefugeProgress,
          })
          setFlash(`${nextPet.name} gardé automatiquement.`)
        } else {
          const nextPets = [...pets, nextPet]
          setPets(nextPets)
          setLastCapturedPet(nextPet)
          setCompareResult(comparison)
          persist({
            pets: nextPets,
            captureStats: nextStats,
            huntFavors: nextFavors,
            refugeProgress: nextRefugeProgress,
          })
          setFlash(
            comparison.headline +
              (activeFavors.length > 0 ? ` · Faveurs actives: ${activeFavors.length}` : ''),
          )
        }
      } else {
        persist({ huntFavors: nextFavors })
        setFlash(`Le Myrion s est echappe… (${Math.round(chance)}% de chance)`)
      }
    },
    [
      activity.baseReward,
      activity.companionId,
      linkedCaptureBonus,
      activeFavors.length,
      captureStats,
      encounter,
      huntFavors,
      huntAutoDecision,
      minigameSave?.refugeResources,
      onComplete,
      pendingHuntCaptures,
      persist,
      pets,
      refugeProgress,
      searchObjectives,
      companionLinks,
    ],
  )



  const startEncounter = useCallback(
    (biomeId: string) => {
      if (compareResult && lastCapturedPet) {
        setFlash('Décision en attente — garde ou relâche le Myrion capturé.')
        setOpenDrawer('decision')
        return
      }

      clearAutoReplayTimer()
      clearAutoCaptureTimer()

      if (!isBiomeUnlocked(biomeId, playerCollection)) {
        setFlash('Ce biome est encore verrouille.')
        return
      }

      const biome = getBiome(biomeId)
      if (!biome) return

      const next = rollEncounterInBiome(biome, playerCollection, huntFavors)
      setBiomeBgFailed(false)
      setEncounter(next)
      setPhase('hunt')
      setHuntPhase('entering')
      setLastResult(null)
      setFinalChance(null)
      timingGradesRef.current = []
      setLastGrade(null)
      setCaptureAttempt(1)
      setStability(100)
      setFlash(`${next.biome.emoji} ${next.biome.name} — une presence se dessine…`)
      setOpenDrawer(null)

      revealRemainingRef.current = null
      scheduleReveal(REVEAL_MS, next)
    },
    [clearAutoCaptureTimer, clearAutoReplayTimer, compareResult, lastCapturedPet, playerCollection, scheduleReveal],
  )

  const returnToMap = useCallback(() => {
    clearAutoReplayTimer()
    clearAutoCaptureTimer()
    clearRevealTimer()
    revealRemainingRef.current = null
    autoCaptureRemainingRef.current = null
    autoReplayRemainingRef.current = null
    capturePauseStartRef.current = null
    setPhase('explore')
    setEncounter(null)
    setFlash('Choisis un biome debloque pour continuer ta chasse.')
  }, [clearAutoCaptureTimer, clearAutoReplayTimer, clearRevealTimer])

  const replayBiome = useCallback(() => {
    if (!encounter || pendingDecision) {
      setFlash('Décision en attente — garde ou relâche le Myrion capturé.')
      setOpenDrawer('decision')
      return
    }
    clearAutoReplayTimer()
    startEncounter(encounter.biome.id)
  }, [clearAutoReplayTimer, encounter, pendingDecision, startEncounter])



  const beginCapture = useCallback(() => {
    clearAutoCaptureTimer()

    if (!encounter || huntPhaseRef.current !== 'appeared') {
      return
    }

    setHuntPhase('capturing')
    setCaptureStartedAt(performance.now())
    setCaptureProgress(0)
    timingGradesRef.current = []
    setLastGrade(null)
    setCaptureAttempt(1)
    setStability(100)
    setFlash('Synchronise l anneau magique au bon moment.')
  }, [clearAutoCaptureTimer, encounter])

  const scheduleAutoCapture = useCallback(
    (remainingMs: number) => {
      clearAutoCaptureTimer()
      autoCaptureRemainingRef.current = null
      autoCaptureDeadlineRef.current = Date.now() + remainingMs
      setAutoCaptureSec(Math.max(0, Math.ceil(remainingMs / 1000)))

      autoCaptureIntervalRef.current = window.setInterval(() => {
        if (!autoCaptureDeadlineRef.current) return
        setAutoCaptureSec(
          Math.max(0, Math.ceil((autoCaptureDeadlineRef.current - Date.now()) / 1000)),
        )
      }, 250)

      autoCaptureTimerRef.current = window.setTimeout(() => {
        autoCaptureTimerRef.current = null
        autoCaptureDeadlineRef.current = null
        beginCapture()
      }, remainingMs)
    },
    [beginCapture, clearAutoCaptureTimer],
  )

  const scheduleAutoReplay = useCallback(
    (remainingMs: number, biomeId: string) => {
      clearAutoReplayTimer()
      autoReplayRemainingRef.current = null
      autoReplayDeadlineRef.current = Date.now() + remainingMs
      setAutoReplaySec(Math.max(0, Math.ceil(remainingMs / 1000)))

      autoReplayIntervalRef.current = window.setInterval(() => {
        if (!autoReplayDeadlineRef.current) return
        setAutoReplaySec(
          Math.max(0, Math.ceil((autoReplayDeadlineRef.current - Date.now()) / 1000)),
        )
      }, 250)

      autoReplayTimerRef.current = window.setTimeout(() => {
        autoReplayTimerRef.current = null
        autoReplayDeadlineRef.current = null
        startEncounter(biomeId)
      }, remainingMs)
    },
    [clearAutoReplayTimer, startEncounter],
  )

  useEffect(() => {
    if (isGamePaused) {
      if (revealTimerRef.current && revealDeadlineRef.current) {
        revealRemainingRef.current = Math.max(0, revealDeadlineRef.current - Date.now())
        clearRevealTimer()
      }

      if (autoCaptureTimerRef.current && autoCaptureDeadlineRef.current) {
        autoCaptureRemainingRef.current = Math.max(0, autoCaptureDeadlineRef.current - Date.now())
        clearAutoCaptureTimer()
      }

      if (autoReplayTimerRef.current && autoReplayDeadlineRef.current) {
        autoReplayRemainingRef.current = Math.max(0, autoReplayDeadlineRef.current - Date.now())
        clearAutoReplayTimer()
      }

      if (huntPhase === 'capturing' && capturePauseStartRef.current === null) {
        capturePauseStartRef.current = performance.now()
      }
      return
    }

    if (capturePauseStartRef.current !== null) {
      const pauseMs = performance.now() - capturePauseStartRef.current
      capturePauseStartRef.current = null
      setCaptureStartedAt((startedAt) => startedAt + pauseMs)
    }

    if (phase === 'hunt' && huntPhase === 'entering' && revealRemainingRef.current !== null) {
      const remaining = revealRemainingRef.current
      revealRemainingRef.current = null
      scheduleReveal(remaining)
    }
  }, [
    clearAutoCaptureTimer,
    clearAutoReplayTimer,
    clearRevealTimer,
    huntPhase,
    isGamePaused,
    phase,
    scheduleReveal,
  ])



  useEffect(() => {

    if (huntPhase !== 'capturing' || !encounter) {

      return

    }



    const { durationMs } = RARITY_CAPTURE[encounter.palmon.rarity]

    let frame = 0



    const tick = (now: number) => {

      if (gamePausedRef.current) {
        frame = window.requestAnimationFrame(tick)
        return
      }

      const progress = Math.min(1, (now - captureStartedAt) / durationMs)

      setCaptureProgress(progress)



      if (encounter.palmon.rarity === 'UR' || encounter.palmon.rarity === 'LR') {

        setStability((value) => Math.max(0, value - 0.08))

      }



      if (progress >= 1) {

        const grade: TimingGrade = 'miss'

        const nextGrades = [...timingGradesRef.current, grade]

        timingGradesRef.current = nextGrades

        setLastGrade(grade)



        const maxAttempts = RARITY_CAPTURE_ATTEMPTS[encounter.palmon.rarity]

        if (nextGrades.length >= maxAttempts) {

          finishCapture(nextGrades)

        } else {

          setCaptureAttempt(nextGrades.length + 1)

          setCaptureStartedAt(performance.now())

          setCaptureProgress(0)

          setFlash(`Tentative ${nextGrades.length + 1}/${maxAttempts} — recentre l anneau.`)

          frame = window.requestAnimationFrame(tick)

        }

        return

      }



      frame = window.requestAnimationFrame(tick)

    }



    frame = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frame)

  }, [captureStartedAt, encounter, finishCapture, huntPhase])



  const attemptCapture = () => {

    if (!encounter || huntPhase !== 'capturing') {

      return

    }



    const grade = gradeCaptureTiming(captureProgress, encounter.palmon.rarity)

    const nextGrades = [...timingGradesRef.current, grade]

    timingGradesRef.current = nextGrades

    setLastGrade(grade)



    const maxAttempts = RARITY_CAPTURE_ATTEMPTS[encounter.palmon.rarity]

    if (nextGrades.length >= maxAttempts) {

      finishCapture(nextGrades)

      return

    }



    setCaptureAttempt(nextGrades.length + 1)

    setCaptureStartedAt(performance.now())

    setCaptureProgress(0)

    setFlash(`Tentative ${nextGrades.length + 1}/${maxAttempts} — continue !`)

  }



  useEffect(
    () => () => {
      clearRevealTimer()
      clearAutoReplayTimer()
      clearAutoCaptureTimer()
    },
    [clearAutoCaptureTimer, clearAutoReplayTimer, clearRevealTimer],
  )

  useEffect(() => {
    if (phase !== 'hunt' || huntPhase !== 'appeared' || !encounter) {
      clearAutoCaptureTimer()
      autoCaptureRemainingRef.current = null
      return
    }
    if (isGamePaused) return
    if (autoCaptureTimerRef.current) return

    const remaining = autoCaptureRemainingRef.current ?? AUTO_CAPTURE_MS
    autoCaptureRemainingRef.current = null
    scheduleAutoCapture(remaining)

    return clearAutoCaptureTimer
  }, [
    clearAutoCaptureTimer,
    encounter,
    huntPhase,
    isGamePaused,
    phase,
    scheduleAutoCapture,
  ])

  useEffect(() => {
    if (phase !== 'result' || !encounter || pendingDecision) {
      clearAutoReplayTimer()
      autoReplayRemainingRef.current = null
      return
    }
    if (isGamePaused) return
    if (autoReplayTimerRef.current) return

    const remaining = autoReplayRemainingRef.current ?? AUTO_REPLAY_MS
    autoReplayRemainingRef.current = null
    scheduleAutoReplay(remaining, encounter.biome.id)

    return clearAutoReplayTimer
  }, [
    clearAutoReplayTimer,
    encounter,
    isGamePaused,
    pendingDecision,
    phase,
    scheduleAutoReplay,
  ])

  const biome = encounter?.biome



  const guideCompanion = useMemo(
    () =>
      resolveHuntGuideCompanion(encounter?.biome.id ?? '', {
        companionId: activity.companionId,
        name: companionName,
      }),
    [activity.companionId, companionName, encounter?.biome.id],
  )



  const maxAttempts = encounter ? RARITY_CAPTURE_ATTEMPTS[encounter.palmon.rarity] : 1

  const canCloseDrawer = useCallback(
    (id: HuntDrawerId) => {
      if (id === 'decision' && compareResult?.overflowRequired) return false
      return true
    },
    [compareResult?.overflowRequired],
  )

  const launchDressageMinigame = useCallback(() => {
    persist({})
    onLaunchMinigame?.('farm-dressage')
  }, [onLaunchMinigame, persist])

  const sideDrawers = useMemo(() => {
    const drawers = []

    drawers.push({
      id: 'biome' as const,
      label: 'Biomes',
      icon: '🗺️',
      content: (
        <BiomeMapPanel
          collection={playerCollection}
          variant="compact"
          onExplore={startEncounter}
        />
      ),
    })

    if (pendingDecision && lastCapturedPet && compareResult) {
      drawers.push({
        id: 'decision' as const,
        label: 'Décision',
        icon: '📋',
        badge: '!',
        pinned: compareResult.overflowRequired,
        content: (
          <>
            <HuntCapturePolicyPanel
              pendingCount={pendingHuntCaptures.length}
              settings={huntAutoDecision}
              title="Politique pour la suite"
              onChange={handleCapturePolicyChange}
            />
            <CaptureComparePanel
              embedded
              pet={lastCapturedPet}
              result={compareResult}
              onClose={closeCompare}
              onDefer={deferPendingCapture}
              onReleaseNew={handleReleaseNewCapture}
              onReplaceWeakest={handleReplaceWeakestCapture}
            />
          </>
        ),
      })
    }

    drawers.push({
      id: 'objectives' as const,
      label: 'Objectifs',
      icon: '🎯',
      badge: searchObjectives.length,
      content: (
        <>
          <HuntCapturePolicyPanel
            settings={huntAutoDecision}
            onChange={(nextSettings) => {
              setHuntAutoDecision(nextSettings)
              persist({ huntAutoDecision: nextSettings })
            }}
          />
          <HuntObjectivePicker
            selected={searchObjectives}
            shinyDiscovered={refugeProgress.shinyDiscovered ?? false}
            onChange={(nextObjectives) => {
              setSearchObjectives(nextObjectives)
              persist({ searchObjectives: nextObjectives })
            }}
          />
        </>
      ),
    })

    drawers.push({
      id: 'pending' as const,
      label: 'En attente',
      icon: '⏳',
      badge: pendingHuntCaptures.length,
      content: (
        <PendingCapturesPanel
          entries={pendingHuntCaptures}
          objectives={searchObjectives}
          refugePets={pets}
          onKeep={keepPendingCapture}
          onKeepAll={keepAllPendingCaptures}
          onKeepMatching={keepPendingByCondition}
          onRelease={releasePendingCapture}
          onReleaseAll={releaseAllPendingCaptures}
          onReleaseMatching={releasePendingByCondition}
        />
      ),
    })

    drawers.push({
      id: 'recent' as const,
      label: 'Captures',
      icon: '📜',
      badge: recentCaptures.length,
      content: (
        <RecentCapturesPanel compact entries={recentCaptures} variant={phase === 'explore' ? 'map' : 'hunt'} />
      ),
    })

    drawers.push({
      id: 'favors' as const,
      label: 'Faveurs',
      icon: '✨',
      badge: activeFavors.length,
      content: <HuntActiveFavorsPanel active={activeFavors} queuedCount={queuedFavorCount} />,
    })

    if (onLaunchMinigame) {
      drawers.push({
        id: 'refuge' as const,
        label: 'Refuge',
        icon: '🏡',
        content: (
          <MinigameSwitchPanel
            description="Visite tes Myrions dans les enclos, nourris-les et collecte les ressources de biome."
            icon="🏡"
            launchLabel="Ouvrir le refuge"
            title="Refuge des Myrions"
            onLaunch={launchDressageMinigame}
          />
        ),
      })
    }

    if (MYRION_REFUGE_DEBUG) {
      drawers.push({
        id: 'debug' as const,
        label: 'Debug',
        icon: '🛠',
        content: (
          <MyrionDebugPanel
            pets={pets}
            speciesScope="all"
            onFlash={setFlash}
            onHuntFavorsChange={(nextFavors) => {
              setHuntFavors(nextFavors)
              persist({ huntFavors: nextFavors })
            }}
            onPetsChange={(nextPets) => {
              setPets(nextPets)
              persist({ pets: nextPets })
            }}
            onRefugeProgressChange={(patch) => {
              const nextRefugeProgress = { ...refugeProgress, ...patch }
              setRefugeProgress(nextRefugeProgress)
              persist({ refugeProgress: nextRefugeProgress })
            }}
          />
        ),
      })
    }

    return drawers
  }, [
    activeFavors.length,
    closeCompare,
    compareResult,
    deferPendingCapture,
    handleCapturePolicyChange,
    handleReleaseNewCapture,
    handleReplaceWeakestCapture,
    keepPendingCapture,
    keepAllPendingCaptures,
    keepPendingByCondition,
    lastCapturedPet,
    pendingDecision,
    pendingHuntCaptures,
    persist,
    pets,
    phase,
    playerCollection,
    queuedFavorCount,
    recentCaptures,
    releaseAllPendingCaptures,
    releasePendingByCondition,
    releasePendingCapture,
    huntAutoDecision,
    refugeProgress,
    searchObjectives,
    startEncounter,
    launchDressageMinigame,
    onLaunchMinigame,
    activeFavors,
    huntFavors,
  ])

  const captureResultSpeech =
    phase === 'result' && encounter
      ? {
          line: lastResult === 'success' ? 'Bravo !' : 'Dommage…',
          detail:
            lastResult === 'success'
              ? finalChance !== null
                ? `${encounter.palmon.name} · ${Math.round(finalChance)}%`
                : encounter.palmon.name
              : `${encounter.palmon.name} s'est echappe`,
          tone: (lastResult === 'success' ? 'success' : 'failed') as 'success' | 'failed',
        }
      : undefined

  const captureResultHint =
    phase === 'result' && encounter ? (
      pendingDecision ? (
        <p className="mg-capture-result-hint warn">Decision requise — panneau Decisions</p>
      ) : autoReplaySec > 0 ? (
        <p className="mg-capture-result-hint">Relance auto dans {autoReplaySec}s…</p>
      ) : null
    ) : null

  return (

    <MinigameFrame

      activity={activity}

      buildingName={buildingName}

      companionInScene

      companionMood={

        huntPhase === 'success'

          ? 'Incroyable !'

          : huntPhase === 'failed'

            ? 'Ce n est que partie remise…'

            : 'Je les ai reperees — a toi de jouer !'

      }

      companionName={companionName}

      endless

      layoutVariant="fullscreen"
      hideGlobalChrome

      maxScore={999}

      onClose={onClose}

      onRestart={returnToMap}

      resourceLabel={resourceLabel}

      score={sessionCaught}

      scoreLabel="Captures session"

      status="playing"

    >

      <div
        className={`mg-capture mg-capture-immersive mg-capture-immersive--${phase}${
          isMobileCapture ? ' mg-capture-immersive--phone' : ''
        }`}
      >

        <div className="mg-capture-toolbar">
          {flash ? <p className="mg-capture-flash mg-capture-flash--toast">{flash}</p> : null}

          <div className="mg-capture-hud">
            <button
              aria-expanded={hudDetailsOpen}
              className="mg-capture-hud-chip"
              type="button"
              onClick={() => setHudDetailsOpen((open) => !open)}
            >
              <span aria-hidden="true">📊</span>
              <span>{sessionCaught} · {activeFavors.length}/3</span>
            </button>
            {hudDetailsOpen ? (
              <div className="mg-capture-hud-popover">
                <div className="mg-capture-stats mg-capture-stats--primary">
                  <span>Session {sessionCaught}</span>
                  <span>Total {captureStats?.totalCaught ?? 0}</span>
                  <span>Best {captureStats?.bestRarity ?? '—'}</span>
                  <span>Actives {activeFavors.length}/3</span>
                </div>
                <div className="mg-capture-stats mg-capture-stats--secondary open">
                  <span>Faveurs {huntFavors.length}</span>
                  <span>En attente {queuedFavorCount}</span>
                  {linkedCaptureBonus > 0 ? (
                    <span>Myrion lié +{linkedCaptureBonus.toFixed(1)} capture</span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>



        {phase === 'explore' && (
          <div className="mg-hunt-layout">
            <HuntSideRail
              canClose={(id) => canCloseDrawer(id as HuntDrawerId)}
              drawers={sideDrawers}
              openId={openDrawer}
              onCloseMinigame={onClose}
              onMenuOpenChange={setSideMenuOpen}
              onOpenChange={(id) => setOpenDrawer(id as HuntDrawerId | null)}
            />
            <div className="mg-hunt-main mg-capture-map-view">
              <BiomeMapPanel collection={playerCollection} onExplore={startEncounter} />
            </div>
          </div>
        )}



        {(phase === 'hunt' || phase === 'result') && biome && encounter && (

          <div className="mg-hunt-layout">
            <HuntSideRail
              canClose={(id) => canCloseDrawer(id as HuntDrawerId)}
              drawers={sideDrawers}
              openId={openDrawer}
              onCloseMinigame={onClose}
              onMenuOpenChange={setSideMenuOpen}
              onOpenChange={(id) => setOpenDrawer(id as HuntDrawerId | null)}
            />
            <div className="mg-hunt-main mg-capture-explore">
            <div className="mg-capture-stage-column">

            <div
              className={`mg-capture-scene-slot${
                isMobileCapture ? ' mg-capture-scene-slot--portrait' : ''
              }`}
            >

              <HuntScene

                biome={biome}

                biomeBgFailed={biomeBgFailed}

                captureUi={
                  (huntPhase === 'appeared' || huntPhase === 'capturing') &&
                  phase === 'hunt' ? (
                    <CaptureRingGame
                      attempt={captureAttempt}
                      lastGrade={lastGrade}
                      maxAttempts={maxAttempts}
                      progress={captureProgress}
                      rarity={encounter.palmon.rarity}
                      stability={stability}
                      onCapture={attemptCapture}
                    />
                  ) : undefined
                }

                guideCompanion={{
                  ...guideCompanion,
                  speech: captureResultSpeech,
                }}

                huntPhase={huntPhase}

                palmon={encounter.palmon}

                onBiomeBgError={() => setBiomeBgFailed(true)}

                paused={isGamePaused}

              />

            </div>

            {huntPhase !== 'entering' ? (
              <div className="mg-capture-myrion-banner">
                <p className="mg-capture-myrion-banner-name">{encounter.palmon.name}</p>
                <span
                  className="mg-rarity-badge"
                  style={{ color: RARITY_COLORS[encounter.palmon.rarity] }}
                >
                  {encounter.palmon.rarity}
                </span>
              </div>
            ) : null}

            <div className={`mg-capture-actions ${lastResult === 'success' ? 'success' : ''}`}>
              <div className="mg-capture-actions-slot">
                <button
                  aria-hidden={huntPhase !== 'appeared'}
                  className={`primary mg-big-btn mg-capture-start-btn${
                    huntPhase === 'appeared' ? ' active' : ''
                  }`}
                  type="button"
                  onClick={beginCapture}
                >
                  🎯 Capturer{huntPhase === 'appeared' && autoCaptureSec > 0 ? ` (${autoCaptureSec}s)` : ''}
                </button>

                <p
                  aria-hidden={huntPhase !== 'capturing'}
                  className={`mg-td-hint mg-capture-ring-hint${
                    huntPhase === 'capturing' ? ' active' : ''
                  }`}
                >
                  Appuie quand l anneau rejoint la zone doree.
                </p>

                <div
                  aria-hidden={phase !== 'result'}
                  className={`mg-capture-result-actions${phase === 'result' ? ' active' : ''}`}
                >
                  {captureResultHint}
                  <button
                    className="primary mg-big-btn"
                    disabled={pendingDecision}
                    type="button"
                    onClick={replayBiome}
                  >
                    🔄 Relancer
                  </button>
                  <button className="secondary mg-big-btn" type="button" onClick={returnToMap}>
                    🗺️ Carte des biomes
                  </button>
                </div>
              </div>
            </div>

            </div>

            </div>
          </div>

        )}

      </div>

    </MinigameFrame>

  )

}


