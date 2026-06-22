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

} from '../../data/captureHunt'

import {
  buildPlayerCollection,
  isBiomeUnlocked,
  rollEncounterInBiome,
} from '../../data/biomeProgression'

import {
  updateCaptureStats,
  type MinigameSave,
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
  PALMON_RARITIES,
  RARITY_CAPTURE,
  type WildEncounter,
  getBiome,
} from '../../data/wildFamiliars'

import { BiomeMapPanel } from './BiomeMapPanel'

import { CaptureRingGame } from './CaptureRingGame'

import {
  buildRecentCapturesFromPets,
  RecentCapturesPanel,
  type RecentCaptureEntry,
} from './RecentCapturesPanel'

import { HuntObjectivePicker } from './HuntObjectivePicker'

import { HuntAutoDecisionSettingsPanel } from './HuntAutoDecisionSettings'

import { HuntActiveFavorsPanel } from './HuntActiveFavorsPanel'

import { HuntSideRail, type HuntDrawerId } from './HuntSideRail'

import { CaptureComparePanel } from './CaptureComparePanel'

import { MyrionDebugPanel } from './MyrionDebugPanel'

import { HuntScene } from './HuntScene'

import { MinigameFrame, type MinigameProps } from './MinigameFrame'
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

  const [refugeProgress, setRefugeProgress] = useState<RefugeProgressState>(
    () => minigameSave?.refugeProgress ?? { shinyDiscovered: false, biomeFavors: {} },
  )

  const [companionLinks, setCompanionLinks] = useState<Partial<Record<string, string>>>(
    () => minigameSave?.companionMyrionLinks ?? {},
  )

  const [openDrawer, setOpenDrawer] = useState<HuntDrawerId | null>(null)

  const [compareResult, setCompareResult] = useState<CaptureCompareResult | null>(null)

  const [lastCapturedPet, setLastCapturedPet] = useState<PetState | null>(null)

  const pendingDecision = Boolean(compareResult && lastCapturedPet)

  useEffect(() => {
    if (pendingDecision) {
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

  const [flash, setFlash] = useState('Explore les biomes — des Myrions sauvages t attendent.')

  const [lastResult, setLastResult] = useState<'success' | 'fail' | null>(null)

  const [finalChance, setFinalChance] = useState<number | null>(null)

  const [autoReplaySec, setAutoReplaySec] = useState(Math.ceil(AUTO_REPLAY_MS / 1000))
  const [autoCaptureSec, setAutoCaptureSec] = useState(Math.ceil(AUTO_CAPTURE_MS / 1000))

  const revealTimerRef = useRef<number | null>(null)
  const autoReplayTimerRef = useRef<number | null>(null)
  const autoReplayIntervalRef = useRef<number | null>(null)
  const autoCaptureTimerRef = useRef<number | null>(null)
  const autoCaptureIntervalRef = useRef<number | null>(null)

  const timingGradesRef = useRef<TimingGrade[]>([])
  const huntPhaseRef = useRef(huntPhase)

  useEffect(() => {
    huntPhaseRef.current = huntPhase
  }, [huntPhase])

  const clearAutoCaptureTimer = useCallback(() => {
    if (autoCaptureTimerRef.current) {
      window.clearTimeout(autoCaptureTimerRef.current)
      autoCaptureTimerRef.current = null
    }
    if (autoCaptureIntervalRef.current) {
      window.clearInterval(autoCaptureIntervalRef.current)
      autoCaptureIntervalRef.current = null
    }
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
        const nextPets = [...pets, nextPet]
        const nextStats = updateCaptureStats(captureStats, palmon.rarity)
        const comparison = compareCapturedMyrion(nextPet, nextPets, searchObjectives)
        const nextRefugeProgress: RefugeProgressState = {
          ...refugeProgress,
          shinyDiscovered:
            refugeProgress.shinyDiscovered || nextPet.isShiny || Boolean(nextPet.visualVariant),
        }
        const autoAction = resolveAutoCaptureDecision(comparison, searchObjectives, huntAutoDecision)

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
        } else if (autoAction === 'keep') {
          setPets(nextPets)
          persist({
            pets: nextPets,
            captureStats: nextStats,
            huntFavors: nextFavors,
            refugeProgress: nextRefugeProgress,
          })
          setFlash(`${nextPet.name} gardé automatiquement.`)
        } else {
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
      persist,
      pets,
      refugeProgress,
      searchObjectives,
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
      const hintBonus = pickActiveHuntFavors(huntFavors)
        .filter((favor) => favor.category === 'hint')
        .reduce((sum, favor) => sum + favor.value, 0)
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

      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current)
      }
      revealTimerRef.current = window.setTimeout(() => {
        setHuntPhase('appeared')
        setFlash(
          hintBonus > 0
            ? `${next.palmon.name} [${next.palmon.rarity}] — indice actif (niv. ${Math.round(hintBonus)})`
            : `${next.palmon.name} [${next.palmon.rarity}] — capture auto dans 3s…`,
        )
      }, REVEAL_MS)
    },
    [clearAutoCaptureTimer, clearAutoReplayTimer, compareResult, huntFavors, lastCapturedPet, playerCollection],
  )

  const returnToMap = useCallback(() => {
    clearAutoReplayTimer()
    clearAutoCaptureTimer()
    setPhase('explore')
    setEncounter(null)
    setFlash('Choisis un biome debloque pour continuer ta chasse.')
  }, [clearAutoCaptureTimer, clearAutoReplayTimer])

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



  useEffect(() => {

    if (huntPhase !== 'capturing' || !encounter) {

      return

    }



    const { durationMs } = RARITY_CAPTURE[encounter.palmon.rarity]

    let frame = 0



    const tick = (now: number) => {

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
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current)
      }
      clearAutoReplayTimer()
      clearAutoCaptureTimer()
    },
    [clearAutoCaptureTimer, clearAutoReplayTimer],
  )

  useEffect(() => {
    if (phase !== 'hunt' || huntPhase !== 'appeared' || !encounter) {
      clearAutoCaptureTimer()
      return
    }

    setAutoCaptureSec(Math.ceil(AUTO_CAPTURE_MS / 1000))

    autoCaptureIntervalRef.current = window.setInterval(() => {
      setAutoCaptureSec((value) => Math.max(0, value - 1))
    }, 1000)

    autoCaptureTimerRef.current = window.setTimeout(() => {
      autoCaptureTimerRef.current = null
      beginCapture()
    }, AUTO_CAPTURE_MS)

    return clearAutoCaptureTimer
  }, [beginCapture, clearAutoCaptureTimer, encounter, huntPhase, phase])

  useEffect(() => {
    if (phase !== 'result' || !encounter || pendingDecision) {
      clearAutoReplayTimer()
      return
    }

    const biomeId = encounter.biome.id
    setAutoReplaySec(Math.ceil(AUTO_REPLAY_MS / 1000))

    autoReplayIntervalRef.current = window.setInterval(() => {
      setAutoReplaySec((value) => Math.max(0, value - 1))
    }, 1000)

    autoReplayTimerRef.current = window.setTimeout(() => {
      autoReplayTimerRef.current = null
      startEncounter(biomeId)
    }, AUTO_REPLAY_MS)

    return clearAutoReplayTimer
  }, [clearAutoReplayTimer, encounter, pendingDecision, phase, startEncounter])



  const [biomeBgFailed, setBiomeBgFailed] = useState(false)
  const biome = encounter?.biome



  const guideCompanion = {
    id: activity.companionId,
    name: companionName,
    side: 'left' as const,
  }



  const maxAttempts = encounter ? RARITY_CAPTURE_ATTEMPTS[encounter.palmon.rarity] : 1

  const canCloseDrawer = useCallback(
    (id: HuntDrawerId) => {
      if (id === 'decision' && compareResult?.overflowRequired) return false
      return true
    },
    [compareResult?.overflowRequired],
  )

  const sideDrawers = useMemo(() => {
    const drawers = []

    if (pendingDecision && lastCapturedPet && compareResult) {
      drawers.push({
        id: 'decision' as const,
        label: 'Décision',
        icon: '📋',
        badge: '!',
        pinned: compareResult.overflowRequired,
        content: (
          <CaptureComparePanel
            embedded
            pet={lastCapturedPet}
            result={compareResult}
            onClose={closeCompare}
            onReleaseNew={handleReleaseNewCapture}
            onReplaceWeakest={handleReplaceWeakestCapture}
          />
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
          <HuntAutoDecisionSettingsPanel
            objectives={searchObjectives}
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
    handleReleaseNewCapture,
    handleReplaceWeakestCapture,
    lastCapturedPet,
    pendingDecision,
    persist,
    pets,
    phase,
    queuedFavorCount,
    recentCaptures,
    huntAutoDecision,
    refugeProgress,
    searchObjectives,
    activeFavors,
    huntFavors,
  ])



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

      maxScore={999}

      onClose={onClose}

      onRestart={returnToMap}

      resourceLabel={resourceLabel}

      score={sessionCaught}

      scoreLabel="Captures session"

      status="playing"

    >

      <div className="mg-capture mg-capture-immersive">

        <div className="mg-capture-toolbar">

          <p className="mg-capture-flash">{flash}</p>

          <div className="mg-capture-stats">

            <span>Session {sessionCaught}</span>

            <span>Total {captureStats?.totalCaught ?? 0}</span>

            <span>Best {captureStats?.bestRarity ?? '—'}</span>

            <span>Faveurs {huntFavors.length}</span>

            <span>Actives {activeFavors.length}/3</span>
            {linkedCaptureBonus > 0 ? (
              <span>Myrion lié +{linkedCaptureBonus.toFixed(1)} capture</span>
            ) : null}

          </div>

        </div>



        {phase === 'explore' && (
          <div className="mg-hunt-layout">
            <div className="mg-hunt-main mg-capture-map-view">
              <BiomeMapPanel collection={playerCollection} onExplore={startEncounter} />
            </div>
            <HuntSideRail
              canClose={canCloseDrawer}
              drawers={sideDrawers}
              openId={openDrawer}
              onOpenChange={setOpenDrawer}
            />
          </div>
        )}



        {(phase === 'hunt' || phase === 'result') && biome && encounter && (

          <div className="mg-hunt-layout">
            <div className="mg-hunt-main mg-capture-explore">
            <div className="mg-capture-stage-column">

            <div className="mg-capture-scene-slot">

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

                guideCompanion={guideCompanion}

                huntPhase={huntPhase}

                palmon={encounter.palmon}

                resultOverlay={

                  phase === 'result' ? (

                    <div

                      className={`mg-capture-result-overlay ${

                        lastResult === 'success' ? 'success' : 'failed'

                      }`}

                    >

                      <p className="mg-capture-result-title">

                        {lastResult === 'success' ? 'Capture reussie !' : 'Myrion echappe'}

                      </p>

                      {finalChance !== null && (

                        <p className="mg-capture-result-chance">{Math.round(finalChance)}% de chance</p>

                      )}

                      <p className="mg-capture-result-name">

                        {encounter.palmon.name} [{encounter.palmon.rarity}]

                      </p>

                      {pendingDecision ? (
                        <p className="mg-capture-result-auto warn">
                          Décision requise — panneau 📋 Décision
                        </p>
                      ) : autoReplaySec > 0 ? (
                        <p className="mg-capture-result-auto">
                          Relance auto dans {autoReplaySec}s…
                        </p>
                      ) : null}

                    </div>

                  ) : undefined

                }

                onBiomeBgError={() => setBiomeBgFailed(true)}

              />

            </div>

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
            <HuntSideRail
              canClose={canCloseDrawer}
              drawers={sideDrawers}
              openId={openDrawer}
              onOpenChange={setOpenDrawer}
            />
          </div>

        )}

      </div>

    </MinigameFrame>

  )

}


