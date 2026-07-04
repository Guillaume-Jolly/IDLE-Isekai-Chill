import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { scaleReward } from '../../data/buildingActivities'
import {
  addCardToDestinyArchive,
  listDestinyArchiveForPack,
  normalizeDestinyWheelSave,
  updateDestinyArchiveCard,
  type SavedDestinyWheelCard,
} from '../../data/destinyWheel/destinyWheelArchiveStore'
import { computeSheetDisplayRating } from '../../data/destinyWheel/runRating'

import {

  buildCharacterSheet,

  computeRunScore,

  computeWheelSegments,

  createInitialRunState,

  debugJumpToWheelDirect,

  debugSimulateFullRun,

  finalizeRun,

  getNextWheel,

  getRunProgress,

  planWheelSpin,

  syncRunState,

  cloneRunState,

} from '../../data/destinyWheel/destinyWheelEngine'

import {
  getSortedWheels,
  getWheelById,
  getWheelPackDefinition,
  loadWheelPackSeed,
  readStoredWheelPackId,
  storeWheelPackId,
  type WheelPackId,
} from '../../data/destinyWheel/seedLoader'

import type { CharacterSheet, RunState, SpinResult } from '../../data/destinyWheel/types'

import type { WheelSegment } from '../../data/destinyWheel/wheelSegments'

import type { MinigameSave } from '../../data/minigameSave'

import {
  addCardToHavreArchive,
  applyJoker,
  buildSavedHavreCard,
  createHavreRunSession,
  HavreArchivePanel,
  HavreJokerPanel,
  HavreModeSelector,
  mergeHavreWheelIntoMinigameSave,
  normalizeHavreWheelSave,
  readStoredHavreMode,
  storeHavreMode,
  updateHavreCard,
  type HavreGameModeId,
  type HavreRunSession,
  type HavreWheelSave,
  type SavedHavreIsekaiCard,
} from '../../features/havreIsekaiWheel'

import {

  disposeDestinyWheelAudio,

  playDestinyWheelReactionSound,

  playDestinyWheelSegmentTick,

  preloadDestinyWheelAudio,

  startDestinyWheelSpinSound,

  stopDestinyWheelSpinSound,

} from '../../audio/destinyWheelAudio'

import { HuntSideRail, type SideDrawerConfig } from './HuntSideRail'

import { DestinyWheelCommentators } from './DestinyWheelCommentators'
import {
  DestinyWheelArchiveSheetOverlay,
  DestinyWheelCompanionsPanel,
  HavreArchiveSheetOverlay,
} from './DestinyWheelCompanionsPanel'
import { DestinyWheelFinalScreen } from './DestinyWheelFinalScreen'
import { DestinyWheelRarityReveal } from './DestinyWheelRarityReveal'
import { DestinyWheelSpinner } from './DestinyWheelSpinner'
import { DestinyWheelSceneCalibrator, useDestinyWheelSceneCalibrationState } from './DestinyWheelSceneCalibrator'
import {
  DestinyWheelLabelZoneCalibrator,
  useWheelLabelZoneCalibrationState,
} from './DestinyWheelLabelZoneCalibrator'
import type { SceneCalLayer } from '../../data/destinyWheel/destinyWheelSceneLayoutCalibration.ts'
import { sceneLayerTransform, scenePanelStyle } from '../../data/destinyWheel/destinyWheelSceneLayoutCalibration.ts'
import { WheelPackSelector } from './WheelPackSelector'

import { MinigameFrame, type MinigameProps } from './MinigameFrame'

import './DestinyWheelGame.css'

type SpinPace = 'slow' | 'normal' | 'fast'

const SPIN_PACE_CONFIG: Record<
  SpinPace,
  { label: string; ms: number; easing: string; extraRotations: [number, number] }
> = {
  slow: {
    label: 'Lent',
    ms: 7600,
    easing: 'cubic-bezier(0.03, 0.72, 0.02, 1)',
    extraRotations: [7, 9],
  },
  normal: {
    label: 'Normal',
    ms: 5200,
    easing: 'cubic-bezier(0.04, 0.78, 0.06, 1)',
    extraRotations: [5, 7],
  },
  fast: {
    label: 'Rapide',
    ms: 2800,
    easing: 'cubic-bezier(0.14, 0.9, 0.2, 1)',
    extraRotations: [3, 5],
  },
}



type ActiveSpin = {

  segments: WheelSegment[]

  winIndex: number

  result: SpinResult

  draft: RunState

}



type SpinHistoryEntry = {

  id: string

  wheelLabel: string

  itemLabel: string

  rarity: string

}



type Props = MinigameProps & {

  minigameSave?: MinigameSave

  onSaveMinigame?: (save: MinigameSave) => void

}



export function DestinyWheelGame({

  activity,

  companionName,

  buildingName,

  resourceLabel,

  onComplete,

  onClose,

  minigameSave,

  onSaveMinigame,

}: Props) {

  const [wheelPackId, setWheelPackId] = useState<WheelPackId>(() => readStoredWheelPackId())
  const seed = useMemo(() => loadWheelPackSeed(wheelPackId), [wheelPackId])
  const packKicker = seed.pack?.kicker ?? 'Roue du Destin'
  const activePack = getWheelPackDefinition(wheelPackId)
  const commentatorNames = seed.pack?.commentators
  const isHavrePack = wheelPackId === 'havre'
  const havreGameModes = seed.pack?.gameModes
  const havreJokers = seed.pack?.jokers
  const havreArchiveRules = seed.pack?.archiveRules

  const [havreSession, setHavreSession] = useState<HavreRunSession>(() =>
    createHavreRunSession(readStoredHavreMode()),
  )
  const [savedHavreCard, setSavedHavreCard] = useState<SavedHavreIsekaiCard | null>(null)
  const [havreWheelSave, setHavreWheelSave] = useState<HavreWheelSave>(() =>
    normalizeHavreWheelSave(minigameSave?.havreWheel),
  )
  const havreModeDef = havreGameModes?.[havreSession.mode]

  const [runState, setRunState] = useState<RunState>(() => createInitialRunState(loadWheelPackSeed(readStoredWheelPackId())))

  const [activeSpin, setActiveSpin] = useState<ActiveSpin | null>(null)

  const [revealedResult, setRevealedResult] = useState<SpinResult | null>(null)

  const [sheet, setSheet] = useState<CharacterSheet | null>(null)

  const [finalDisplayName, setFinalDisplayName] = useState('')

  const [pendingFavorite, setPendingFavorite] = useState(false)

  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  const [spinHistory, setSpinHistory] = useState<SpinHistoryEntry[]>([])
  const [spinPace, setSpinPace] = useState<SpinPace>('slow')
  const [debugFreeSpin, setDebugFreeSpin] = useState(true)
  const [debugStartWheelId, setDebugStartWheelId] = useState('')
  const [debugForcedItemId, setDebugForcedItemId] = useState('')
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [archivePreviewCard, setArchivePreviewCard] = useState<SavedDestinyWheelCard | null>(null)
  const [havreArchivePreview, setHavreArchivePreview] = useState<SavedHavreIsekaiCard | null>(null)
  const [sceneCalibration, setSceneCalibration] = useDestinyWheelSceneCalibrationState()
  const [labelZoneCalibration, setLabelZoneCalibration] = useWheelLabelZoneCalibrationState()
  const [showLabelZoneOverlay, setShowLabelZoneOverlay] = useState(true)

  const [spinning, setSpinning] = useState(false)

  const [wheelResetToken, setWheelResetToken] = useState(0)

  const [bannerSegment, setBannerSegment] = useState<WheelSegment | null>(null)

  const pendingDraftRef = useRef<RunState | null>(null)
  const activeSpinRef = useRef<ActiveSpin | null>(null)
  const [spinFault, setSpinFault] = useState<string | null>(null)

  activeSpinRef.current = activeSpin



  useEffect(() => {

    preloadDestinyWheelAudio()

    return () => disposeDestinyWheelAudio()

  }, [])



  useEffect(() => {
    setRunState(createInitialRunState(seed))
    setActiveSpin(null)
    setRevealedResult(null)
    setSheet(null)
    setSavedHavreCard(null)
    setStatus('playing')
    setSpinning(false)
    setBannerSegment(null)
    setSpinHistory([])
    setDebugStartWheelId('')
    setDebugForcedItemId('')
    setWheelResetToken((token) => token + 1)
    pendingDraftRef.current = null
    if (isHavrePack) {
      setHavreSession(createHavreRunSession(readStoredHavreMode()))
    }
  }, [seed, isHavrePack])

  useEffect(() => {
    if (minigameSave?.havreWheel) {
      setHavreWheelSave(normalizeHavreWheelSave(minigameSave.havreWheel))
    }
  }, [minigameSave?.havreWheel])

  useEffect(() => {
    if (!sheet) {
      setFinalDisplayName('')
      setPendingFavorite(false)
      return
    }
    setFinalDisplayName(savedHavreCard?.displayName ?? sheet.identity.name)
    setPendingFavorite(savedHavreCard?.playerMeta.favorite ?? false)
  }, [sheet, savedHavreCard?.displayName, savedHavreCard?.id, savedHavreCard?.playerMeta.favorite])



  const nextWheel = useMemo(() => getNextWheel(runState, seed), [runState, seed])

  const progress = useMemo(() => getRunProgress(runState, seed), [runState, seed])

  const previewSegments = useMemo(

    () => (nextWheel ? computeWheelSegments(runState, nextWheel, seed) : []),

    [nextWheel, runState, seed],

  )

  const displaySegments = activeSpin?.segments ?? previewSegments
  const spinPaceConfig = SPIN_PACE_CONFIG[spinPace]
  const allWheels = useMemo(() => getSortedWheels(seed), [seed])
  const debugResultWheel = nextWheel ?? (debugStartWheelId ? getWheelById(debugStartWheelId, seed) : null)
  const debugResultItems = debugResultWheel?.items ?? []

  const allowFlickSpin = !import.meta.env.DEV || !debugFreeSpin

  const awaitingContinue = revealedResult != null && !spinning

  const revealedItem = revealedResult?.items[0]

  const revealedComment = awaitingContinue
    ? (activeSpin?.draft.comments ?? []).at(-1)
    : undefined



  const handleWheelPackChange = useCallback((packId: WheelPackId) => {
    if (packId === wheelPackId || spinning) return
    stopDestinyWheelSpinSound(false)
    storeWheelPackId(packId)
    setWheelPackId(packId)
  }, [spinning, wheelPackId])

  const handleHavreModeChange = useCallback((mode: HavreGameModeId) => {
    if (spinning || sheet) return
    storeHavreMode(mode)
    setHavreSession(createHavreRunSession(mode))
    setRunState(createInitialRunState(seed))
    setActiveSpin(null)
    setRevealedResult(null)
    setSavedHavreCard(null)
    setSpinHistory([])
    setWheelResetToken((token) => token + 1)
    pendingDraftRef.current = null
  }, [seed, sheet, spinning])

  const persistHavreWheelSave = useCallback(
    (next: HavreWheelSave) => {
      setHavreWheelSave(next)
      onSaveMinigame?.(mergeHavreWheelIntoMinigameSave(minigameSave, next))
    },
    [minigameSave, onSaveMinigame],
  )

  const handleHavreArchiveUpdate = useCallback(
    (cardId: string, updates: { favorite?: boolean; locked?: boolean; note?: string }) => {
      if (!havreArchiveRules) return
      const next = updateHavreCard(havreWheelSave, cardId, updates)
      persistHavreWheelSave(next)
    },
    [havreArchiveRules, havreWheelSave, persistHavreWheelSave],
  )

  const handleFinalDisplayNameChange = useCallback(
    (name: string) => {
      setFinalDisplayName(name)
      if (!savedHavreCard) return
      const nextCard = { ...savedHavreCard, displayName: name }
      setSavedHavreCard(nextCard)
      if (havreArchiveRules?.auto_save) {
        persistHavreWheelSave(updateHavreCard(havreWheelSave, nextCard.id, { displayName: name }))
      }
    },
    [havreArchiveRules?.auto_save, havreWheelSave, persistHavreWheelSave, savedHavreCard],
  )

  const handleToggleFavorite = useCallback(() => {
    const nextFavorite = !pendingFavorite
    setPendingFavorite(nextFavorite)
    if (!savedHavreCard) return
    const nextCard = {
      ...savedHavreCard,
      playerMeta: { ...savedHavreCard.playerMeta, favorite: nextFavorite },
    }
    setSavedHavreCard(nextCard)
    if (havreArchiveRules?.auto_save) {
      persistHavreWheelSave(updateHavreCard(havreWheelSave, nextCard.id, { favorite: nextFavorite }))
    }
  }, [havreArchiveRules?.auto_save, havreWheelSave, pendingFavorite, persistHavreWheelSave, savedHavreCard])

  const handleHistoryFavoriteToggle = useCallback(
    (entryId: string, favorite: boolean) => {
      const current = normalizeDestinyWheelSave(minigameSave?.destinyWheel)
      onSaveMinigame?.({
        ...(minigameSave ?? { farmPlots: [], pets: [] }),
        destinyWheel: {
          ...current,
          archives: updateDestinyArchiveCard(current.archives, entryId, { favorite }),
        },
      })
    },
    [minigameSave, onSaveMinigame],
  )



  const applyDraft = useCallback((draft: RunState) => {

    syncRunState(runState, draft)

    setRunState({

      ...runState,

      tags: { ...runState.tags },

      stats: { ...runState.stats },

      probabilityProfile: { ...runState.probabilityProfile },

      selectedItems: { ...runState.selectedItems },

      selectedItemLabels: { ...runState.selectedItemLabels },

      unlockedWheels: [...runState.unlockedWheels],

      blockedWheels: [...runState.blockedWheels],

      completedWheels: [...runState.completedWheels],

      rarityHistory: [...runState.rarityHistory],

      reactions: [...runState.reactions],

      comments: [...runState.comments],

      combos: [...runState.combos],

      statRoasts: [...runState.statRoasts],

    })



    const upcoming = getNextWheel(runState, seed)

    if (!upcoming) {

      finalizeRun(runState, seed)

      const builtSheet = buildCharacterSheet(runState, seed)
      setSheet(builtSheet)

      if (isHavrePack && havreModeDef && havreArchiveRules && runState.finalVerdict) {
        const card = buildSavedHavreCard(
          {
            runState,
            sheet: builtSheet,
            session: havreSession,
            seedVersion: seed.version,
            spinHistoryCount: spinHistory.length + 1,
            reward: runState.reward ?? {},
            verdict: runState.finalVerdict,
          },
          havreModeDef,
        )
        setSavedHavreCard(card)
        if (havreArchiveRules.auto_save) {
          const nextArchive = addCardToHavreArchive(havreWheelSave, card, havreArchiveRules)
          persistHavreWheelSave(nextArchive)
        }
      }

      setStatus('won')

    }

  }, [runState, seed, isHavrePack, havreModeDef, havreArchiveRules, havreSession, havreWheelSave, spinHistory.length, persistHavreWheelSave])



  const handleUseJoker = useCallback(
    (jokerId: string) => {
      if (!nextWheel || !awaitingContinue || !havreModeDef || spinning) return
      const result = applyJoker(
        jokerId,
        runState,
        havreSession,
        havreModeDef,
        seed,
        nextWheel.id,
        revealedItem,
      )
      if (!result.ok) return
      if (result.kind === 'lock') {
        setHavreSession(result.session)
        return
      }
      setHavreSession(result.session)
      setRunState(result.runState)
      stopDestinyWheelSpinSound(false)
      const winner = result.plan.segments[result.plan.winIndex] ?? null
      setActiveSpin({
        segments: result.plan.segments,
        winIndex: result.plan.winIndex,
        result: result.plan.result,
        draft: result.plan.draft,
      })
      setRevealedResult(result.plan.result)
      pendingDraftRef.current = result.plan.draft
      setSpinning(false)
      setBannerSegment(winner)
      const landed = result.plan.result.items[0]
      if (landed) playDestinyWheelReactionSound(landed.reaction, landed.rarity)
    },
    [awaitingContinue, havreModeDef, havreSession, nextWheel, revealedItem, runState, seed, spinning],
  )

  const handleSegmentCross = useCallback((speedDegPerFrame: number, tickIndex = 0) => {
    playDestinyWheelSegmentTick(speedDegPerFrame, tickIndex)
  }, [])



  const handleSpinEnd = useCallback(() => {
    setSpinning(false)
    stopDestinyWheelSpinSound(true)

    const spin = activeSpinRef.current
    if (!spin) {
      setSpinFault('Fin de tirage introuvable — relancez un tour ou changez de roue.')
      return
    }

    setSpinFault(null)
    setRevealedResult(spin.result)
    pendingDraftRef.current = spin.draft

    const landed = spin.result.items[0]
    if (landed) {
      playDestinyWheelReactionSound(landed.reaction, landed.rarity)
    }
  }, [])

  const handleSpinFault = useCallback((message: string) => {
    setSpinFault(message)
  }, [])

  useEffect(() => {
    if (!spinning) return
    const timeoutMs = spinPaceConfig.ms + 1800
    const timer = window.setTimeout(() => {
      const spin = activeSpinRef.current
      if (!spin) return
      setSpinFault('La roue n’a pas confirmé la fin du tirage — cliquez Continuer pour valider.')
      setSpinning(false)
      stopDestinyWheelSpinSound(false)
      setRevealedResult((prev) => prev ?? spin.result)
      pendingDraftRef.current = spin.draft
    }, timeoutMs)
    return () => window.clearTimeout(timer)
  }, [spinning, spinPaceConfig.ms])



  const handleSpin = () => {

    if (!nextWheel || status !== 'playing' || spinning || awaitingContinue) return

    const plan = planWheelSpin(runState, nextWheel.id, seed)

    if (!plan) return



    setRevealedResult(null)

    setBannerSegment(null)

    setActiveSpin({

      segments: plan.segments,

      winIndex: plan.winIndex,

      result: plan.result,

      draft: plan.draft,

    })

    setSpinFault(null)
    startDestinyWheelSpinSound()
    setSpinning(true)
  }



  const handleContinue = () => {

    const draft = pendingDraftRef.current ?? activeSpin?.draft

    if (!draft) {
      setSpinFault('Impossible de continuer — brouillon de tirage manquant.')
      return
    }

    stopDestinyWheelSpinSound(false)
    setSpinning(false)
    setSpinFault(null)

    const result = revealedResult ?? activeSpin?.result

    const landed = result?.items[0]

    if (result && landed) {

      const wheel = getWheelById(result.wheelId, seed)

      setSpinHistory((prev) => [

        {

          id: `${Date.now()}-${result.wheelId}`,

          wheelLabel: wheel?.label ?? result.wheelId,

          itemLabel: landed.label,

          rarity: landed.rarity,

        },

        ...prev,

      ])

    }

    pendingDraftRef.current = null

    setActiveSpin(null)

    setRevealedResult(null)

    setBannerSegment(null)

    applyDraft(draft)

    setWheelResetToken((token) => token + 1)

  }

  useEffect(() => {
    if (!isHavrePack || !havreModeDef?.auto_advance || sheet || spinning) return
    const delay = awaitingContinue ? 850 : 1100
    const timer = window.setTimeout(() => {
      if (awaitingContinue) handleContinue()
      else if (nextWheel && status === 'playing') handleSpin()
    }, delay)
    return () => window.clearTimeout(timer)
  }, [
    awaitingContinue,
    handleContinue,
    handleSpin,
    havreModeDef?.auto_advance,
    isHavrePack,
    nextWheel,
    sheet,
    spinning,
    status,
  ])



  const handleClaim = () => {

    if (!sheet) return

    const totalWheels = progress.estimatedTotal

    const score = computeRunScore(runState, totalWheels)
    const displayRating = computeSheetDisplayRating(sheet, runState)

    const trimmedName = finalDisplayName.trim() || sheet.identity.name

    let nextHavreWheelSave = havreWheelSave
    if (isHavrePack && savedHavreCard && havreArchiveRules?.auto_save) {
      nextHavreWheelSave = updateHavreCard(havreWheelSave, savedHavreCard.id, {
        displayName: trimmedName,
        favorite: pendingFavorite,
      })
      setHavreWheelSave(nextHavreWheelSave)
    }

    let reward = scaleReward(activity.baseReward, score, totalWheels)
    if (isHavrePack && havreModeDef) {
      reward = Object.fromEntries(
        Object.entries(reward).map(([key, value]) => [key, Math.ceil((value ?? 0) * havreModeDef.reward_multiplier)]),
      ) as typeof reward
    }

    const currentWheelSave = normalizeDestinyWheelSave(minigameSave?.destinyWheel)
    const nextArchives = addCardToDestinyArchive(currentWheelSave.archives, {
      id: `${Date.now()}`,
      packId: wheelPackId,
      completedAt: Date.now(),
      name: trimmedName,
      title: sheet.identity.title,
      verdictId: runState.finalVerdict?.id ?? 'unknown',
      score,
      displayScore: displayRating.score,
      favorite: pendingFavorite,
      sheet: structuredClone(sheet),
    })

    onSaveMinigame?.({

      ...(minigameSave ?? { farmPlots: [], pets: [] }),

      havreWheel: isHavrePack ? nextHavreWheelSave : minigameSave?.havreWheel,

      destinyWheel: {

        totalRuns: currentWheelSave.totalRuns + 1,

        lastRunAt: Date.now(),

        lastVerdictId: runState.finalVerdict?.id,

        lastName: trimmedName,

        archives: nextArchives,

      },

    })

    onComplete(score, totalWheels, reward)

  }



  const handleRestart = () => {

    stopDestinyWheelSpinSound(false)

    setRunState(createInitialRunState(seed))

    setActiveSpin(null)

    setRevealedResult(null)

    setSheet(null)

    setSavedHavreCard(null)

    setFinalDisplayName('')

    setPendingFavorite(false)

    setStatus('playing')

    setSpinning(false)

    setBannerSegment(null)

    setSpinHistory([])

    setDebugStartWheelId('')

    setDebugForcedItemId('')

    setWheelResetToken((token) => token + 1)

    pendingDraftRef.current = null

    if (isHavrePack) {
      setHavreSession(createHavreRunSession(havreSession.mode))
    }

  }



  const handleDebugJumpToWheel = useCallback(() => {
    if (!debugStartWheelId || spinning || sheet) return

    stopDestinyWheelSpinSound(false)
    const jumped = cloneRunState(createInitialRunState(seed))
    const ok = debugJumpToWheelDirect(jumped, debugStartWheelId, seed)
    if (!ok) return

    setRunState(jumped)
    setActiveSpin(null)
    setRevealedResult(null)
    setSpinning(false)
    setBannerSegment(null)
    pendingDraftRef.current = null
    setWheelResetToken((token) => token + 1)
  }, [debugStartWheelId, seed, sheet, spinning])

  const handleDebugApplyForcedResult = useCallback(() => {
    if (!nextWheel || !debugForcedItemId || spinning || sheet) return

    const plan = planWheelSpin(runState, nextWheel.id, seed, { forcedItemId: debugForcedItemId })
    if (!plan) return

    stopDestinyWheelSpinSound(false)
    const winner = plan.segments[plan.winIndex] ?? null

    setActiveSpin({
      segments: plan.segments,
      winIndex: plan.winIndex,
      result: plan.result,
      draft: plan.draft,
    })
    setRevealedResult(plan.result)
    pendingDraftRef.current = plan.draft
    setSpinning(false)
    setBannerSegment(winner)

    const landed = plan.result.items[0]
    if (landed) {
      playDestinyWheelReactionSound(landed.reaction, landed.rarity)
    }
  }, [debugForcedItemId, nextWheel, runState, seed, sheet, spinning])

  const handleDebugSimulateFullRun = useCallback(() => {
    if (spinning || sheet) return

    stopDestinyWheelSpinSound(false)
    const working = createInitialRunState(seed)
    const { spins } = debugSimulateFullRun(working, seed)
    const builtSheet = buildCharacterSheet(working, seed)

    setRunState(working)
    setActiveSpin(null)
    setRevealedResult(null)
    setSpinning(false)
    setBannerSegment(null)
    setSpinFault(null)
    pendingDraftRef.current = null
    setSpinHistory(
      [...spins].reverse().map((result, index) => {
        const wheel = getWheelById(result.wheelId, seed)
        const landed = result.items[0]
        return {
          id: `debug-full-${index}-${result.wheelId}`,
          wheelLabel: wheel?.label ?? result.wheelId,
          itemLabel: landed?.label ?? '—',
          rarity: landed?.rarity ?? 'common',
        }
      }),
    )
    setSheet(builtSheet)
    setStatus('won')
    setSavedHavreCard(null)

    if (isHavrePack && havreModeDef && havreArchiveRules && working.finalVerdict) {
      const card = buildSavedHavreCard(
        {
          runState: working,
          sheet: builtSheet,
          session: havreSession,
          seedVersion: seed.version,
          spinHistoryCount: spins.length,
          reward: working.reward ?? {},
          verdict: working.finalVerdict,
        },
        havreModeDef,
      )
      setSavedHavreCard(card)
      if (havreArchiveRules.auto_save) {
        const nextArchive = addCardToHavreArchive(havreWheelSave, card, havreArchiveRules)
        persistHavreWheelSave(nextArchive)
      }
    }

    setWheelResetToken((token) => token + 1)
  }, [
    havreArchiveRules,
    havreModeDef,
    havreSession,
    havreWheelSave,
    isHavrePack,
    persistHavreWheelSave,
    seed,
    sheet,
    spinning,
  ])

  const bannerLabel = revealedItem?.label ?? bannerSegment?.label

  const bannerRarity = revealedItem?.rarity ?? bannerSegment?.item.rarity

  const currentWheelLabel = useMemo(() => {
    const wheelId =
      (awaitingContinue && revealedResult?.wheelId)
      || (spinning && activeSpin?.result?.wheelId)
      || nextWheel?.id
    if (!wheelId) return ''
    return getWheelById(wheelId, seed)?.label ?? wheelId
  }, [activeSpin?.result?.wheelId, awaitingContinue, nextWheel?.id, revealedResult?.wheelId, seed])

  const showContinueAction = awaitingContinue || !!spinFault

  const companionsCount = useMemo(() => {
    if (isHavrePack && havreArchiveRules) {
      return (
        havreWheelSave.archives.hardcore.length
        + havreWheelSave.archives.auto_roll.length
        + havreWheelSave.archives.artist.length
      )
    }
    return listDestinyArchiveForPack(
      normalizeDestinyWheelSave(minigameSave?.destinyWheel).archives,
      wheelPackId,
    ).length
  }, [havreArchiveRules, havreWheelSave, isHavrePack, minigameSave?.destinyWheel, wheelPackId])

  const menuDrawers = useMemo((): SideDrawerConfig[] => {
    const items: SideDrawerConfig[] = [
      {
        id: 'options',
        label: 'Options',
        icon: '⚙',
        content: (
          <div className="dw-menu-panel dw-menu-panel--options">
            <p className="dw-options-kicker">Univers & réglages</p>
            <WheelPackSelector
              wheelPackId={wheelPackId}
              disabled={spinning || awaitingContinue || !!sheet}
              onChange={handleWheelPackChange}
            />
            <p className="dw-options-hint">{activePack.subtitle}</p>
            {isHavrePack && havreGameModes ? (
              <HavreModeSelector
                mode={havreSession.mode}
                gameModes={havreGameModes}
                disabled={spinning || awaitingContinue || !!sheet || status !== 'playing'}
                onChange={handleHavreModeChange}
              />
            ) : null}
            <div className="dw-spin-pace" role="group" aria-label="Vitesse de rotation">
              <span className="dw-spin-pace-label">Vitesse</span>
              {(Object.keys(SPIN_PACE_CONFIG) as SpinPace[]).map((pace) => (
                <button
                  key={pace}
                  type="button"
                  className={`dw-spin-pace-btn${spinPace === pace ? ' dw-spin-pace-btn--active' : ''}`}
                  onClick={() => setSpinPace(pace)}
                  disabled={spinning}
                >
                  {SPIN_PACE_CONFIG[pace].label}
                </button>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'wheel',
        label: 'Roue',
        icon: '🎡',
        pinned: awaitingContinue,
        badge: awaitingContinue ? '!' : undefined,
        content: (
          <WheelMenuPanel
            packKicker={packKicker}
            nextWheelLabel={nextWheel?.label ?? 'Fiche prête'}
            hasNextWheel={!!nextWheel}
            progressCompleted={progress.completed}
            progressTotal={progress.estimatedTotal}
            spinHistory={spinHistory}
            spinning={spinning}
            awaitingContinue={awaitingContinue}
            showContinueAction={showContinueAction}
            spinFault={spinFault}
            status={status}
            isHavrePack={isHavrePack}
            havreModeDef={havreModeDef}
            havreJokers={havreJokers}
            havreSession={havreSession}
            currentWheelId={nextWheel?.id}
            onUseJoker={handleUseJoker}
            onContinue={handleContinue}
            onSpin={handleSpin}
          />
        ),
      },
    ]

    if (displaySegments.length > 0 && nextWheel) {
      items.push({
        id: 'odds',
        label: 'Probabilités',
        icon: '🔍',
        content: <WheelSegmentsTable segments={displaySegments} />,
      })
    }

    items.push({
      id: 'companions',
      label: 'Compagnons',
      icon: '👥',
      badge: companionsCount > 0 ? String(companionsCount) : undefined,
      content:
        isHavrePack && havreArchiveRules ? (
          <HavreArchivePanel
            save={havreWheelSave}
            seed={seed}
            onUpdateCard={handleHavreArchiveUpdate}
            onViewCard={(card) => {
              setHavreArchivePreview(card)
              setOpenDrawer(null)
            }}
          />
        ) : (
          <DestinyWheelCompanionsPanel
            activePackId={wheelPackId}
            archives={listDestinyArchiveForPack(
              normalizeDestinyWheelSave(minigameSave?.destinyWheel).archives,
              wheelPackId,
            )}
            onToggleFavorite={handleHistoryFavoriteToggle}
            onViewCard={(card) => {
              setArchivePreviewCard(card)
              setOpenDrawer(null)
            }}
          />
        ),
    })

    if (import.meta.env.DEV) {
      items.push({
        id: 'labels-dev',
        label: 'Labels',
        icon: '🔤',
        content: (
          <div className="dw-menu-panel dw-menu-panel--debug">
            <DestinyWheelLabelZoneCalibrator
              calibration={labelZoneCalibration}
              onChange={setLabelZoneCalibration}
              showZoneOverlay={showLabelZoneOverlay}
              onShowZoneOverlayChange={setShowLabelZoneOverlay}
            />
          </div>
        ),
      })

      items.push({
        id: 'debug',
        label: 'Debug',
        icon: '🛠',
        content: (
          <div className="dw-menu-panel dw-menu-panel--debug">
            <label className="dw-debug-toggle">
              <input
                type="checkbox"
                checked={debugFreeSpin}
                onChange={(event) => setDebugFreeSpin(event.target.checked)}
              />
              <span>Free spin — glisser sans lancer le tirage</span>
            </label>

            <div className="dw-debug-block">
              <p className="dw-debug-block-title">Départ forcé</p>
              <label className="dw-debug-field">
                <span>Roue de départ</span>
                <select
                  value={debugStartWheelId}
                  onChange={(event) => setDebugStartWheelId(event.target.value)}
                >
                  <option value="">— Choisir une roue —</option>
                  {allWheels.map((wheel) => (
                    <option key={wheel.id} value={wheel.id}>
                      {wheel.order}. {wheel.label} ({wheel.id})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="dw-debug-btn"
                disabled={!debugStartWheelId || spinning || !!sheet}
                onClick={handleDebugJumpToWheel}
              >
                Appliquer le départ
              </button>
              <p className="dw-debug-hint">
                Reset la run et place directement la roue choisie (sans simuler les tirages
                précédents).
              </p>
            </div>

            <div className="dw-debug-block">
              <p className="dw-debug-block-title">Résultat forcé</p>
              <label className="dw-debug-field">
                <span>
                  Segment cible
                  {debugResultWheel ? ` — ${debugResultWheel.label}` : ''}
                </span>
                <select
                  value={debugForcedItemId}
                  onChange={(event) => setDebugForcedItemId(event.target.value)}
                  disabled={!debugResultWheel}
                >
                  <option value="">— Choisir un segment —</option>
                  {debugResultItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} · {item.rarity} ({item.id})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="dw-debug-btn"
                disabled={!debugForcedItemId || !nextWheel || spinning || !!sheet}
                onClick={handleDebugApplyForcedResult}
              >
                Appliquer le résultat
              </button>
              <p className="dw-debug-hint">
                Affiche immédiatement le segment choisi, comme après un tirage (puis « Continuer »
                pour valider).
              </p>
            </div>

            <div className="dw-debug-block">
              <p className="dw-debug-block-title">Run complète</p>
              <button
                type="button"
                className="dw-debug-btn"
                disabled={spinning || !!sheet}
                onClick={handleDebugSimulateFullRun}
              >
                Tirer toutes les roues → écran final
              </button>
              <p className="dw-debug-hint">
                Simule une run entière depuis le début (sans animation) et affiche la fiche /
                verdict final.
              </p>
            </div>

            <pre className="dw-debug dw-debug--panel">
              {JSON.stringify(
                {
                  nextWheel: nextWheel?.id,
                  forcedItem: debugForcedItemId || null,
                  tags: runState.tags,
                  stats: runState.stats,
                  profile: runState.probabilityProfile,
                  activeSpin: activeSpin?.result?.debug,
                },
                null,
                2,
              )}
            </pre>

            <DestinyWheelLabelZoneCalibrator
              calibration={labelZoneCalibration}
              onChange={setLabelZoneCalibration}
              showZoneOverlay={showLabelZoneOverlay}
              onShowZoneOverlayChange={setShowLabelZoneOverlay}
            />

            <DestinyWheelSceneCalibrator
              calibration={sceneCalibration}
              onChange={setSceneCalibration}
              wheelPackId={wheelPackId}
            />
          </div>
        ),
      })
    }

    return items
  }, [
    activePack.subtitle,
    activeSpin?.result?.debug,
    allWheels,
    awaitingContinue,
    debugForcedItemId,
    debugFreeSpin,
    debugResultItems,
    debugResultWheel,
    debugStartWheelId,
    displaySegments,
    companionsCount,
    handleContinue,
    handleDebugApplyForcedResult,
    handleDebugJumpToWheel,
    handleDebugSimulateFullRun,
    handleHavreArchiveUpdate,
    handleHistoryFavoriteToggle,
    handleHavreModeChange,
    handleSpin,
    handleUseJoker,
    handleWheelPackChange,
    havreArchiveRules,
    havreGameModes,
    havreJokers,
    havreModeDef,
    havreSession,
    havreWheelSave,
    isHavrePack,
    nextWheel,
    packKicker,
    progress.completed,
    progress.estimatedTotal,
    runState.probabilityProfile,
    runState.stats,
    runState.tags,
    seed,
    sheet,
    spinHistory,
    spinPace,
    spinning,
    spinFault,
    showContinueAction,
    status,
    wheelPackId,
    minigameSave,
    labelZoneCalibration,
    sceneCalibration,
    setSceneCalibration,
    setLabelZoneCalibration,
    showLabelZoneOverlay,
  ])

  const drawerOpen = openDrawer !== null
  const devLayoutPreview = import.meta.env.DEV && openDrawer === 'debug'
  const sceneLayout = sceneCalibration

  return (
    <>
    <MinigameFrame

      activity={activity}

      companionName={companionName}

      buildingName={buildingName}

      resourceLabel={resourceLabel}

      score={progress.completed}

      maxScore={progress.estimatedTotal}

      status={status}

      onClose={onClose}

      onRestart={handleRestart}

      scoreLabel="Roues"

      layoutVariant="fullscreen"
      companionInScene
      hideGlobalChrome
    >
      <div className="dw-root" style={{ ['--dw-accent' as string]: activity.accent }}>
        <div className="dw-layout">
          <HuntSideRail
            drawers={menuDrawers}
            fabAriaLabel="Menu Roue du Destin"
            menuAriaLabel="Menu Roue du Destin"
            menuTitle={packKicker}
            openId={openDrawer}
            onCloseMinigame={onClose}
            onOpenChange={setOpenDrawer}
          />

          <div className="dw-scene-wrap">
            <div
              className={[
                'dw-scene',
                drawerOpen ? 'dw-scene--menu-open' : 'dw-scene--menu-closed',
                sheet ? 'dw-scene--final' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="dw-scene-safe" data-menu-open={drawerOpen || undefined}>
                {!sheet ? (
                  <>
                    <div
                      className="dw-pack-switcher-scene"
                      style={
                        sceneLayout?.packSwitcher.visible === false
                          ? { display: 'none' }
                          : sceneLayout?.packSwitcher
                            ? { transform: sceneLayerTransform(sceneLayout.packSwitcher) }
                            : undefined
                      }
                    >
                      <WheelPackSelector
                        wheelPackId={wheelPackId}
                        compact
                        disabled={spinning || awaitingContinue}
                        onChange={handleWheelPackChange}
                      />
                      <span className="dw-pack-active-label">{activePack.label}</span>
                    </div>
                    <WheelCurrentCase
                      wheelCategoryLabel={currentWheelLabel}
                      bannerLabel={bannerLabel}
                      bannerRarity={bannerRarity}
                      revealedItem={revealedItem}
                      revealedResult={revealedResult}
                      spinning={spinning}
                      awaitingContinue={awaitingContinue}
                      sceneLayer={sceneLayout?.currentCase}
                      devPreview={devLayoutPreview}
                    />
                    <DestinyWheelCommentators
                      comment={revealedComment}
                      resultRarity={revealedItem?.rarity}
                      devLayoutPreview={devLayoutPreview}
                      sceneLayout={sceneLayout}
                      speakerNames={
                        commentatorNames
                          ? {
                              laharl: commentatorNames.laharl.name,
                              etna: commentatorNames.etna.name,
                              flonne: commentatorNames.flonne.name,
                            }
                          : undefined
                      }
                    />

                    <div className="dw-wheel-stack">
                      {spinFault ? (
                        <p className="dw-flow-error dw-flow-error--scene" role="alert">
                          {spinFault}
                        </p>
                      ) : null}
                      <DestinyWheelSpinner
                        key={`${wheelResetToken}-${nextWheel?.id ?? 'preview'}`}
                        segments={displaySegments}
                        winIndex={activeSpin?.winIndex ?? null}
                        spinning={spinning}
                        landed={awaitingContinue}
                        resetToken={wheelResetToken}
                        visualTheme={
                          wheelPackId === 'disgaea' ? 'disgaea' : wheelPackId === 'havre' ? 'havre' : 'default'
                        }
                        wheelAssetsCalibration={
                          wheelPackId === 'disgaea'
                            ? sceneLayout.wheel
                            : wheelPackId === 'havre'
                              ? sceneLayout.havreWheel
                              : undefined
                        }
                        interactive={status === 'playing' && !spinning && !awaitingContinue}
                        spinDurationMs={spinPaceConfig.ms}
                        spinEasing={spinPaceConfig.easing}
                        spinExtraRotations={spinPaceConfig.extraRotations}
                        onSpinEnd={handleSpinEnd}
                        onSpinFault={handleSpinFault}
                        onPointerSegment={setBannerSegment}
                        onSegmentCross={handleSegmentCross}
                        onFlickSpin={handleSpin}
                        allowFlickSpin={allowFlickSpin}
                        hintLayer={sceneLayout?.spinnerHint}
                        devHintPreview={devLayoutPreview}
                        labelZoneCalibration={labelZoneCalibration}
                        showLabelZoneOverlay={devLayoutPreview && showLabelZoneOverlay}
                      />
                    </div>
                  </>
                ) : (
                  <DestinyWheelFinalScreen
                    sheet={sheet}
                    runState={runState}
                    displayName={finalDisplayName}
                    onDisplayNameChange={handleFinalDisplayNameChange}
                    favorite={pendingFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    isHavrePack={isHavrePack}
                    savedHavreCard={savedHavreCard}
                    havreModeDef={havreModeDef}
                    autoArchived={havreArchiveRules?.auto_save}
                    onValidate={handleClaim}
                    onReplay={handleRestart}
                    onQuit={onClose}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </MinigameFrame>

    {archivePreviewCard ? (
      <DestinyWheelArchiveSheetOverlay
        card={archivePreviewCard}
        onClose={() => setArchivePreviewCard(null)}
      />
    ) : null}
    {havreArchivePreview ? (
      <HavreArchiveSheetOverlay
        sheet={havreArchivePreview.generatedCharacter}
        displayName={havreArchivePreview.displayName}
        badge={havreArchivePreview.playerMeta.badge}
        onClose={() => setHavreArchivePreview(null)}
      />
    ) : null}

    </>
  )

}



function WheelCurrentCase({
  wheelCategoryLabel,
  bannerLabel,
  bannerRarity,
  revealedItem,
  revealedResult,
  spinning,
  awaitingContinue,
  sceneLayer,
  devPreview = false,
}: {
  wheelCategoryLabel: string
  bannerLabel?: string
  bannerRarity?: string
  revealedItem?: SpinResult['items'][0]
  revealedResult: SpinResult | null
  spinning: boolean
  awaitingContinue: boolean
  sceneLayer?: SceneCalLayer
  devPreview?: boolean
}) {
  const show = devPreview || spinning || awaitingContinue || !!bannerLabel
  if (!show) return null
  if (sceneLayer && !sceneLayer.visible && !devPreview) return null

  const previewCategory = 'Rang de création'
  const previewLabel = 'Segment exemple'
  const previewRarity = 'rare'
  const previewDetail = 'Texte d’ambiance exemple — calibrer la hauteur sans saut au reveal.'
  const categoryLabel = devPreview ? previewCategory : wheelCategoryLabel || 'Roue du destin'

  const layerStyle = sceneLayer ? scenePanelStyle(sceneLayer) : undefined

  const panelBody =
    awaitingContinue && revealedItem && !devPreview ? (
      <DestinyWheelRarityReveal
        playKey={`${revealedResult?.wheelId ?? 'wheel'}-${revealedItem.id}`}
        rarity={revealedItem.rarity}
        variant="inline"
      >
        <CaseFloatBody
          bannerLabel={bannerLabel}
          bannerRarity={bannerRarity}
          detailText={revealedItem?.short_text}
          revealedResult={revealedResult}
          awaitingContinue={awaitingContinue}
        />
      </DestinyWheelRarityReveal>
    ) : (
      <CaseFloatBody
        bannerLabel={devPreview ? previewLabel : bannerLabel}
        bannerRarity={devPreview ? previewRarity : bannerRarity}
        detailText={
          devPreview
            ? previewDetail
            : awaitingContinue
              ? revealedItem?.short_text
              : undefined
        }
        revealedResult={revealedResult}
        awaitingContinue={awaitingContinue && !devPreview}
      />
    )

  return (
    <aside
      className={`dw-case-float${spinning ? ' dw-case-float--live' : ''}${awaitingContinue ? ' dw-case-float--revealed' : ''}${devPreview ? ' dw-case-float--dev-preview' : ''}${sceneLayer ? ' dw-case-float--calibrated' : ''}`}
      style={layerStyle}
      aria-live="polite"
    >
      <p className="dw-case-float-kicker">{categoryLabel}</p>
      {panelBody}
    </aside>
  )
}

function CaseFloatBody({
  bannerLabel,
  bannerRarity,
  detailText,
  revealedResult,
  awaitingContinue,
}: {
  bannerLabel?: string
  bannerRarity?: string
  detailText?: string
  revealedResult: SpinResult | null
  awaitingContinue: boolean
}) {
  const showDetail = Boolean(detailText?.trim())
  return (
    <div className="dw-case-float-body">
      <p className="dw-case-float-label">{bannerLabel ?? '—'}</p>
      <div className="dw-case-float-rarity-slot">
        {bannerRarity ? <p className={`dw-rarity dw-rarity--${bannerRarity}`}>{bannerRarity}</p> : null}
      </div>
      <p
        className={[
          'dw-case-float-detail',
          showDetail ? 'dw-case-float-detail--visible' : 'dw-case-float-detail--reserved',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!showDetail}
      >
        {showDetail ? detailText : 'Ambiance'}
      </p>
      {awaitingContinue && revealedResult && revealedResult.items.length > 1 ? (
        <ul className="dw-batch-results dw-case-float-batch">
          {revealedResult.items.slice(1).map((item) => (
            <li key={item.id}>
              {item.label} · {item.rarity}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function WheelMenuPanel({
  packKicker,
  nextWheelLabel,
  hasNextWheel,
  progressCompleted,
  progressTotal,
  spinHistory,
  spinning,
  awaitingContinue,
  showContinueAction,
  spinFault,
  status,
  isHavrePack,
  havreModeDef,
  havreJokers,
  havreSession,
  currentWheelId,
  onUseJoker,
  onContinue,
  onSpin,
}: {
  packKicker: string
  nextWheelLabel: string
  hasNextWheel: boolean
  progressCompleted: number
  progressTotal: number
  spinHistory: SpinHistoryEntry[]
  spinning: boolean
  awaitingContinue: boolean
  showContinueAction: boolean
  spinFault: string | null
  status: 'playing' | 'won' | 'lost'
  isHavrePack: boolean
  havreModeDef?: import('../../features/havreIsekaiWheel/types').HavreGameModeDef
  havreJokers?: Record<string, import('../../features/havreIsekaiWheel/types').HavreJokerDef>
  havreSession: HavreRunSession
  currentWheelId?: string
  onUseJoker: (jokerId: string) => void
  onContinue: () => void
  onSpin: () => void
}) {
  return (
    <div className="dw-menu-panel dw-menu-panel--wheel">
      <div className="dw-wheel-menu-head">
        <p className="dw-kicker">{packKicker}</p>
        <h2 className="dw-title">{nextWheelLabel}</h2>
        <p className="dw-wheel-meta">
          Roues {progressCompleted}/{progressTotal}
        </p>
        {spinFault ? <p className="dw-flow-error" role="alert">{spinFault}</p> : null}
        {isHavrePack && havreModeDef?.auto_advance ? (
          <p className="dw-debug-hint">Auto-Roll actif — le destin avance seul.</p>
        ) : null}
        <button
          type="button"
          className="dw-spin-btn"
          onClick={showContinueAction ? onContinue : onSpin}
          disabled={
            showContinueAction
              ? false
              : spinning || !hasNextWheel || status !== 'playing'
          }
        >
          {showContinueAction ? 'Continuer' : spinning ? 'Rotation…' : 'Tourner'}
        </button>
      </div>

      {isHavrePack && awaitingContinue && havreModeDef && havreJokers && currentWheelId ? (
        <HavreJokerPanel
          session={havreSession}
          modeDef={havreModeDef}
          jokers={havreJokers}
          wheelId={currentWheelId}
          disabled={spinning}
          onUseJoker={onUseJoker}
        />
      ) : null}

      {spinHistory.length > 0 ? (
        <section className="dw-wheel-history-block">
          <p className="dw-case-history-kicker">Historique</p>
          <ol className="dw-spin-history">
            {spinHistory.map((entry) => (
              <li key={entry.id} className="dw-spin-history-item">
                <span className="dw-spin-history-wheel">{entry.wheelLabel}</span>
                <span className="dw-spin-history-label">{entry.itemLabel}</span>
                <span className={`dw-rarity dw-rarity--${entry.rarity}`}>{entry.rarity}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  )
}

function WheelSegmentsTable({ segments }: { segments: WheelSegment[] }) {

  const ordered = [...segments].sort((a, b) => b.percent - a.percent)

  return (

    <div className="dw-segments-table-wrap dw-segments-table-wrap--flat">

      <table className="loot-details-loot-table loot-details-loot-table--compact dw-segments-table">

        <thead>

          <tr>

            <th>Segment</th>

            <th>Rareté</th>

            <th>Poids</th>

          </tr>

        </thead>

        <tbody>

          {ordered.map((segment) => (

            <tr key={segment.item.id}>

              <td>

                <span className="dw-segments-table-swatch" style={{ background: segment.color }} />

                {segment.label}

              </td>

              <td>{segment.item.rarity}</td>

              <td>

                {segment.percent >= 10 ? `${Math.round(segment.percent)}%` : `${segment.percent.toFixed(1)}%`}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}


