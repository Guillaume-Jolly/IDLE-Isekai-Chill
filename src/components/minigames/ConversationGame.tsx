import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  pickConversationAsync,
  scoreFromChoices,
  hasParlerDialoguesAtAffinity,
  defaultParlerDialogueAffinity,
  listCuratedDevExchangeOptions,
  listCuratedDevPackOptions,
  parseDevCuratedSelection,
  serializeDevCuratedSelection,
  devCuratedSelectionToPickOptions,
  devPackSelectionFromQueryParam,
  defaultDevCuratedPackSelection,
  type CompanionConversation,
  type CuratedDevExchangeOption,
  type CuratedDevPackOption,
  type DialogueChoice,
} from '../../data/companionDialogues'
import { loadGameSettings } from '../../data/gameSettings'
import { useGameSettings } from '../../hooks/useGameSettings'
import {
  formatCompanionPromptLine,
  formatCompanionActionLine,
  parseCompanionReactionSegments,
  reactionPortraitEmotion,
  splitContextForDisplay,
  splitIntimateFinaleForDisplay,
  resolveIntimateFinaleForScore,
  resolvePackIntimateFinaleForScore,
} from '../../data/conversations/conversationContext'
import {
  deriveParlerSessionSummary,
  formatParlerSessionSummaryLines,
  type ParlerSessionSummary,
} from '../../data/conversations/parlerSessionSummary'
import { scaleReward, type Cost, BUILDING_ACTIVITIES } from '../../data/buildingActivities'
import type { CompanionEmotionId } from '../../data/companionAssets'
import { companionBackgroundPath, lyraIntimateSessionPortraitEmotion } from '../../data/companionAssets'
import {
  CURATED_PARLER_ONLY,
  canUseParlerDialogues,
  COMPANION_DIALOGUE_PROFILES,
} from '../../data/companionDialogues'
import { BUILDING_UNLOCK_STAGE } from '../../data/population'
import { MAX_DIALOGUE_CHOICE_SCORE, type DialogueChoiceScore } from '../../data/conversations/types'
import { CompanionPortrait } from '../CompanionPortrait'
import { ConversationPicker } from './ConversationPicker'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

type Phase = 'intro' | 'round' | 'reaction' | 'finale' | 'packFinale' | 'result'
type FeedbackKind = 'success' | 'fail'
type FeedbackTier = 1 | 2 | 3

type FeedbackFx = {
  kind: FeedbackKind
  tier: FeedbackTier
  pulse: number
}

type RoundRecap = {
  index: number
  contextText: string
  prompt: string
  choiceText: string
  reaction: string
  success: boolean
  intimateFinale?: string
}

function intimateFinaleForRound(
  affinity: number,
  nsfwContent: boolean,
  score: number | undefined,
  round?: { intimateFinale?: string; intimateFinaleLow?: string },
): string | undefined {
  return resolveIntimateFinaleForScore(affinity, nsfwContent, score, round)
}

function intimateFinaleEarned(
  affinity: number,
  nsfwContent: boolean,
  score: number | undefined,
  round?: { intimateFinale?: string; intimateFinaleLow?: string },
): boolean {
  return Boolean(intimateFinaleForRound(affinity, nsfwContent, score, round))
}

function packIntimateFinaleForSession(
  affinity: number,
  nsfwContent: boolean,
  totalScore: number,
  conversation: CompanionConversation,
  sessionSummary: ParlerSessionSummary,
  protagonistGender: 'male' | 'female',
): string | undefined {
  return resolvePackIntimateFinaleForScore(
    affinity,
    nsfwContent,
    totalScore,
    conversation.rounds.length,
    conversation,
    sessionSummary,
    protagonistGender,
  )
}

function packIntimateFinaleEarned(
  affinity: number,
  nsfwContent: boolean,
  totalScore: number,
  conversation: CompanionConversation,
  sessionSummary: ParlerSessionSummary,
  protagonistGender: 'male' | 'female',
): boolean {
  return Boolean(
    packIntimateFinaleForSession(
      affinity,
      nsfwContent,
      totalScore,
      conversation,
      sessionSummary,
      protagonistGender,
    ),
  )
}

function IntimateFinaleBlock({ finale, kicker = 'Épilogue' }: { finale: string; kicker?: string }) {
  return (
    <div className="mg-conversation-intimate-finale">
      <p className="mg-conversation-intimate-finale-kicker">{kicker}</p>
      <div className="mg-conversation-intimate-finale-body">
        {splitIntimateFinaleForDisplay(finale).map((segment, index) => (
          <p
            className="mg-dialogue-bubble mg-dialogue-bubble-narrator mg-dialogue-bubble-intimate-finale"
            key={`finale-${index}`}
          >
            {segment}
          </p>
        ))}
      </div>
    </div>
  )
}

const REWARD_LABELS: Record<string, string> = {
  coins: 'Pièces',
  wood: 'Bois',
  stone: 'Pierre',
  food: 'Vivres',
  silk: 'Soie',
  mana: 'Mana',
  renown: 'Renom',
  ingredients: 'Ingrédients',
  crystals: 'Cristaux',
  gifts: 'Cadeaux',
  tickets: 'Tickets',
  stardust: 'Poussière stellaire',
}

const formatReward = (reward: Cost) =>
  Object.entries(reward)
    .filter(([, value]) => (value ?? 0) > 0)
    .map(([key, value]) => `${value} ${REWARD_LABELS[key] ?? key}`)
    .join(' · ')

const scaleRewardByMultiplier = (reward: Cost, multiplier: number): Cost =>
  Object.fromEntries(
    Object.entries(reward).map(([key, value]) => [key, Math.ceil((value ?? 0) * multiplier)]),
  ) as Cost

const SUCCESS_TOAST: Record<FeedbackTier, string> = {
  1: 'Bien !',
  2: 'Enchaînement !',
  3: 'Excellent !',
}

const FAIL_TOAST: Record<FeedbackTier, string> = {
  1: 'Raté…',
  2: 'Oups…',
  3: 'Aïe…',
}

function CompanionReactionContent({
  companionName,
  reaction,
}: {
  companionName: string
  reaction: string
}) {
  const segments = parseCompanionReactionSegments(reaction)
  return (
    <>
      <span className="mg-companion-reaction-speaker">{companionName} : </span>
      {segments.map((segment, index) =>
        segment.kind === 'speech' ? (
          <span key={`speech-${index}`}>{segment.text}</span>
        ) : (
          <em key={`didasc-${index}`} className="mg-companion-reaction-didascalie">
            {segment.text}
          </em>
        ),
      )}
    </>
  )
}

function trailingHighScoreStreak(values: number[], minScore: number): number {
  let streak = 0
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index] >= minScore) streak += 1
    else break
  }
  return streak
}

function choiceIsStrong(score: DialogueChoiceScore) {
  return score >= 2
}

function choiceBubbleClass(score: DialogueChoiceScore) {
  return choiceIsStrong(score) ? 'success' : 'fail'
}

function feedbackTier(scores: number[], choice: DialogueChoice): FeedbackFx {
  const strong = choiceIsStrong(choice.score)
  const prior = trailingHighScoreStreak(scores, 2)
  const scoreTier = Math.min(3, Math.max(1, choice.score)) as FeedbackTier
  return {
    kind: strong ? 'success' : 'fail',
    tier: strong ? (Math.min(3, prior + 1) as FeedbackTier) : scoreTier,
    pulse: Date.now(),
  }
}

const PARLER_AFFINITY_LEVELS = [1, 2, 3, 4, 5] as const
const PARLER_DEV_MODE = import.meta.env.DEV
const PARLER_DEV_CURATED_STORAGE_KEY = 'parler-dev-curated-selection'
/** @deprecated Migré vers PARLER_DEV_CURATED_STORAGE_KEY */
const PARLER_DEV_EXCHANGE_STORAGE_KEY = 'parler-dev-exchange-id'

function readDevCuratedSelectionFromStorage(): string {
  if (typeof window === 'undefined') return ''
  const current = window.sessionStorage.getItem(PARLER_DEV_CURATED_STORAGE_KEY)
  if (current) return current
  const legacy = window.sessionStorage.getItem(PARLER_DEV_EXCHANGE_STORAGE_KEY)
  if (!legacy) return ''
  const migrated = legacy.includes('-curated-') ? `e:${legacy}` : legacy
  window.sessionStorage.setItem(PARLER_DEV_CURATED_STORAGE_KEY, migrated)
  window.sessionStorage.removeItem(PARLER_DEV_EXCHANGE_STORAGE_KEY)
  return migrated
}

export function ConversationGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
  onLaunchMinigame,
  companionAffinity = 2,
  conversationRewardMultiplier = 1,
  villageStage = 0,
}: MinigameProps) {
  const { settings } = useGameSettings()
  const parlerOptions = useMemo(
    () => ({
      protagonistGender: settings.protagonistGender,
      nsfwContent: settings.nsfwContent,
    }),
    [settings.nsfwContent, settings.protagonistGender],
  )
  /** En dev, aff. 4–5 restent testables même si NSFW désactivé à la connexion. */
  const effectiveParlerOptions = useMemo(
    () =>
      PARLER_DEV_MODE
        ? { ...parlerOptions, nsfwContent: true as const }
        : parlerOptions,
    [parlerOptions],
  )

  const playerAffinityLevel = Math.min(5, Math.max(1, companionAffinity))
  const [selectedDialogueAffinity, setSelectedDialogueAffinity] = useState(() =>
    defaultParlerDialogueAffinity(activity.companionId, playerAffinityLevel, {
      nsfwContent: loadGameSettings().nsfwContent,
      protagonistGender: loadGameSettings().protagonistGender,
    }),
  )

  const [conversationSession, setConversationSession] = useState(0)
  const [lastConversationId, setLastConversationId] = useState<string | undefined>()
  const curatedDevFilter = useMemo(
    () => ({
      affinity: selectedDialogueAffinity,
      companionId: activity.companionId,
    }),
    [activity.companionId, selectedDialogueAffinity],
  )
  const curatedDevPackOptions = useMemo<CuratedDevPackOption[]>(
    () => (PARLER_DEV_MODE ? listCuratedDevPackOptions(curatedDevFilter) : []),
    [curatedDevFilter],
  )
  const curatedDevExchangeOptions = useMemo<CuratedDevExchangeOption[]>(
    () => (PARLER_DEV_MODE ? listCuratedDevExchangeOptions(curatedDevFilter) : []),
    [curatedDevFilter],
  )
  const [devCuratedSelectionRaw, setDevCuratedSelectionRaw] = useState(() =>
    PARLER_DEV_MODE ? readDevCuratedSelectionFromStorage() : '',
  )
  const devCuratedSelection = useMemo(
    () => parseDevCuratedSelection(devCuratedSelectionRaw),
    [devCuratedSelectionRaw],
  )

  useEffect(() => {
    if (!PARLER_DEV_MODE) return
    if (devCuratedSelectionRaw.trim()) return
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pack')) return
    if (selectedDialogueAffinity !== 5) return
    const companionId = activity.companionId
    if (companionId !== 'lyra') return
    const defaultSel = defaultDevCuratedPackSelection(
      companionId,
      5,
      effectiveParlerOptions.protagonistGender ?? 'male',
    )
    if (defaultSel.mode !== 'pack') return
    const raw = serializeDevCuratedSelection(defaultSel)
    setDevCuratedSelectionRaw(raw)
    window.sessionStorage.setItem(PARLER_DEV_CURATED_STORAGE_KEY, raw)
  }, [
    activity.companionId,
    devCuratedSelectionRaw,
    effectiveParlerOptions.protagonistGender,
    selectedDialogueAffinity,
  ])

  useEffect(() => {
    if (!PARLER_DEV_MODE) return
    const urlPack = devPackSelectionFromQueryParam(
      effectiveParlerOptions.protagonistGender ?? 'male',
    )
    if (!urlPack) return
    const raw = serializeDevCuratedSelection(urlPack)
    setDevCuratedSelectionRaw(raw)
    window.sessionStorage.setItem(PARLER_DEV_CURATED_STORAGE_KEY, raw)
    if (urlPack.mode === 'pack') {
      setSelectedDialogueAffinity(urlPack.affinity)
    }
  }, [effectiveParlerOptions.protagonistGender])

  useEffect(() => {
    if (!PARLER_DEV_MODE || devCuratedSelection.mode === 'random') return
    if (devCuratedSelection.mode === 'pack') {
      const mismatchAffinity = devCuratedSelection.affinity !== selectedDialogueAffinity
      const mismatchCompanion = devCuratedSelection.companionId !== activity.companionId
      if (mismatchAffinity || mismatchCompanion) {
        setDevCuratedSelectionRaw('')
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(PARLER_DEV_CURATED_STORAGE_KEY)
        }
      }
      return
    }
    const exchangeCompanion = devCuratedSelection.exchangeId.split('-aff')[0]
    if (
      exchangeCompanion !== activity.companionId ||
      !devCuratedSelection.exchangeId.includes(`-aff${selectedDialogueAffinity}-`)
    ) {
      setDevCuratedSelectionRaw('')
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(PARLER_DEV_CURATED_STORAGE_KEY)
      }
    }
  }, [activity.companionId, curatedDevPackOptions, devCuratedSelection, selectedDialogueAffinity])
  const curatedPickOptions = useMemo(
    () =>
      PARLER_DEV_MODE
        ? devCuratedSelectionToPickOptions(
            devCuratedSelection,
            effectiveParlerOptions.protagonistGender ?? 'male',
          )
        : effectiveParlerOptions,
    [devCuratedSelection, effectiveParlerOptions],
  )
  const devCorpusCompanionId =
    PARLER_DEV_MODE && 'curatedCompanionId' in curatedPickOptions && curatedPickOptions.curatedCompanionId
      ? curatedPickOptions.curatedCompanionId
      : activity.companionId
  const effectiveCompanionName =
    COMPANION_DIALOGUE_PROFILES[devCorpusCompanionId]?.name ?? companionName
  const [conversation, setConversation] = useState<CompanionConversation | null>(null)
  const [conversationLoading, setConversationLoading] = useState(true)
  const [conversationError, setConversationError] = useState<string | null>(null)

  const sessionMcGender = useMemo<'H' | 'F'>(() => {
    if (conversation?.id.includes('female-mc')) return 'F'
    return effectiveParlerOptions.protagonistGender === 'female' ? 'F' : 'H'
  }, [conversation?.id, effectiveParlerOptions.protagonistGender])

  useEffect(() => {
    let cancelled = false
    setConversationLoading(true)
    setConversationError(null)

    void pickConversationAsync(activity.companionId, selectedDialogueAffinity, lastConversationId, curatedPickOptions)
      .then((next) => {
        if (cancelled) return
        if (
          !next &&
          PARLER_DEV_MODE &&
          (('packId' in curatedPickOptions && curatedPickOptions.packId) ||
            ('exchangeId' in curatedPickOptions && curatedPickOptions.exchangeId))
        ) {
          setDevCuratedSelectionRaw('')
          if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(PARLER_DEV_CURATED_STORAGE_KEY)
          }
          return
        }
        setConversation(next)
        if (!next) {
          setConversationError('Impossible de charger une conversation pour ce compagnon.')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setConversationError('Chargement du corpus en cours — réessayez dans un instant.')
        }
      })
      .finally(() => {
        if (!cancelled) setConversationLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    activity.companionId,
    selectedDialogueAffinity,
    lastConversationId,
    conversationSession,
    devCuratedSelectionRaw,
    curatedPickOptions,
  ])

  useEffect(() => {
    if (
      hasParlerDialoguesAtAffinity(
        activity.companionId,
        selectedDialogueAffinity,
        effectiveParlerOptions,
      )
    ) {
      return
    }
    const fallback = defaultParlerDialogueAffinity(
      activity.companionId,
      playerAffinityLevel,
      effectiveParlerOptions,
    )
    if (fallback !== selectedDialogueAffinity) {
      setSelectedDialogueAffinity(fallback)
      setLastConversationId(undefined)
      setConversationSession((value) => value + 1)
    }
  }, [
    activity.companionId,
    effectiveParlerOptions,
    playerAffinityLevel,
    selectedDialogueAffinity,
  ])

  const [phase, setPhase] = useState<Phase>('intro')
  const [roundIndex, setRoundIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [roundRecaps, setRoundRecaps] = useState<RoundRecap[]>([])
  const [lastReaction, setLastReaction] = useState('')
  const [pickedChoice, setPickedChoice] = useState<DialogueChoice | null>(null)
  const [feedbackFx, setFeedbackFx] = useState<FeedbackFx | null>(null)
  const [pendingReward, setPendingReward] = useState<Cost | null>(null)
  const dialogueEndRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLParagraphElement>(null)
  const rewardsClaimedRef = useRef(false)
  const [companionPickerOpen, setCompanionPickerOpen] = useState(false)

  const conversationActivities = useMemo(() => {
    const items = BUILDING_ACTIVITIES.filter((entry) => entry.minigameType === 'conversation')
    if (!CURATED_PARLER_ONLY) return items
    return items.filter((entry) => canUseParlerDialogues(entry.companionId))
  }, [])

  const pickerCompanions = useMemo(
    () =>
      [...new Set(conversationActivities.map((entry) => entry.companionId))].map((companionId) => ({
        id: companionId,
        name: COMPANION_DIALOGUE_PROFILES[companionId]?.name ?? companionId,
      })),
    [conversationActivities],
  )
  const affinityArtwork = devCorpusCompanionId
    ? companionBackgroundPath(devCorpusCompanionId, selectedDialogueAffinity)
    : undefined

  const displayReward = useMemo(() => {
    if (!pendingReward) return null
    return scaleRewardByMultiplier(pendingReward, conversationRewardMultiplier)
  }, [conversationRewardMultiplier, pendingReward])

  useEffect(() => {
    if (phase !== 'reaction' && phase !== 'finale') return
    dialogueEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [phase, roundIndex, lastReaction])

  useEffect(() => {
    if (phase !== 'round') return
    requestAnimationFrame(() => {
      promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, [phase, roundIndex])

  const resetSession = () => {
    setPhase('intro')
    setRoundIndex(0)
    setScores([])
    setRoundRecaps([])
    setPickedChoice(null)
    setLastReaction('')
    setFeedbackFx(null)
    setPendingReward(null)
    rewardsClaimedRef.current = false
  }

  const pickDialogueAffinity = (level: number) => {
    if (!hasParlerDialoguesAtAffinity(activity.companionId, level, effectiveParlerOptions)) return
    if (level === selectedDialogueAffinity) return
    setSelectedDialogueAffinity(level)
    setDevCuratedSelectionRaw('')
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(PARLER_DEV_CURATED_STORAGE_KEY)
      window.sessionStorage.removeItem(PARLER_DEV_EXCHANGE_STORAGE_KEY)
    }
    setLastConversationId(undefined)
    setConversationSession((value) => value + 1)
    resetSession()
  }

  const pickDevCuratedSelection = (raw: string) => {
    if (!PARLER_DEV_MODE || raw === devCuratedSelectionRaw) return
    const parsed = parseDevCuratedSelection(raw)
    if (parsed.mode === 'pack' && parsed.affinity !== selectedDialogueAffinity) {
      setSelectedDialogueAffinity(parsed.affinity)
    }
    setDevCuratedSelectionRaw(raw)
    if (typeof window !== 'undefined') {
      if (raw) {
        window.sessionStorage.setItem(PARLER_DEV_CURATED_STORAGE_KEY, raw)
      } else {
        window.sessionStorage.removeItem(PARLER_DEV_CURATED_STORAGE_KEY)
      }
      window.sessionStorage.removeItem(PARLER_DEV_EXCHANGE_STORAGE_KEY)
    }
    setLastConversationId(undefined)
    setConversationSession((value) => value + 1)
    resetSession()
  }

  if (conversationLoading) {
    return (
      <MinigameFrame
        activity={activity}
        buildingName={buildingName}
        companionName={companionName}
        maxScore={3}
        onClose={onClose}
        onRestart={onClose}
        resourceLabel={resourceLabel}
        score={0}
        status="playing"
      >
        <p className="mg-conversation-loading">Chargement des dialogues…</p>
      </MinigameFrame>
    )
  }

  if (!conversation) {
    return (
      <MinigameFrame
        activity={activity}
        buildingName={buildingName}
        companionName={companionName}
        maxScore={3}
        onClose={onClose}
        onRestart={() => setConversationSession((value) => value + 1)}
        resourceLabel={resourceLabel}
        score={0}
        status="lost"
      >
        <p>{conversationError ?? 'Pas encore de dialogue pour ce compagnon.'}</p>
      </MinigameFrame>
    )
  }

  const currentRound = conversation.rounds[roundIndex]
  const maxSessionScore = conversation.rounds.length * MAX_DIALOGUE_CHOICE_SCORE
  const isSingleExchange = conversation.rounds.length === 1
  const contextBubbles = splitContextForDisplay(currentRound?.context ?? [])
  const totalScore = scoreFromChoices(scores)
  const protagonistGenderForSession: 'male' | 'female' =
    sessionMcGender === 'F' ? 'female' : 'male'
  const sessionSummaryForScores = (nextScores: number[]) =>
    deriveParlerSessionSummary(conversation.rounds, nextScores, protagonistGenderForSession)
  const sessionSummary = sessionSummaryForScores(scores)
  const sessionSummaryLines = formatParlerSessionSummaryLines(
    sessionSummary,
    protagonistGenderForSession,
  )
  const earnedIntimateFinales = conversation.rounds
    .map((round, index) => ({
      roundIndex: index,
      finale: intimateFinaleForRound(
        selectedDialogueAffinity,
        effectiveParlerOptions.nsfwContent,
        scores[index],
        round,
      ),
      score: scores[index],
    }))
    .filter((entry) => Boolean(entry.finale))
  const earnedPackIntimateFinale = packIntimateFinaleForSession(
    selectedDialogueAffinity,
    effectiveParlerOptions.nsfwContent,
    totalScore,
    conversation,
    sessionSummary,
    protagonistGenderForSession,
  )
  const currentFinaleRound = phase === 'finale' ? conversation.rounds[roundIndex] : undefined
  const currentFinale = currentFinaleRound
    ? intimateFinaleForRound(
        selectedDialogueAffinity,
        effectiveParlerOptions.nsfwContent,
        scores[roundIndex],
        currentFinaleRound,
      )
    : undefined
  const currentPackFinale =
    phase === 'packFinale' ? earnedPackIntimateFinale : undefined
  const inPlay =
    phase === 'round' || phase === 'reaction' || phase === 'finale' || phase === 'packFinale'
  const linkPointsGained = totalScore

  const intimatePackPortrait = lyraIntimateSessionPortraitEmotion(
    activity.companionId,
    conversation.id,
    selectedDialogueAffinity,
  )

  const portraitEmotion: CompanionEmotionId | undefined =
    phase === 'reaction' && pickedChoice
      ? reactionPortraitEmotion(pickedChoice)
      : phase === 'finale' && currentFinale
        ? 'lustful'
        : phase === 'packFinale' && currentPackFinale
          ? 'lustful'
          : intimatePackPortrait !== undefined
          ? intimatePackPortrait
          : phase === 'intro' || phase === 'round'
            ? 'neutral'
            : undefined
  const pendingFinaleAfterReaction =
    phase === 'reaction' &&
    pickedChoice !== null &&
    intimateFinaleEarned(
      selectedDialogueAffinity,
      effectiveParlerOptions.nsfwContent,
      pickedChoice.score,
      currentRound,
    )
  const reactionContinueLabel = pendingFinaleAfterReaction
    ? 'Épilogue'
    : roundIndex >= conversation.rounds.length - 1
      ? packIntimateFinaleEarned(
          selectedDialogueAffinity,
          effectiveParlerOptions.nsfwContent,
          scoreFromChoices([...scores, pickedChoice?.score ?? 0]),
          conversation,
          sessionSummaryForScores([...scores, pickedChoice?.score ?? 0]),
          protagonistGenderForSession,
        )
        ? 'Fin de l\'acte'
        : 'Voir le résultat'
      : 'Suite'
  const finaleContinueLabel =
    roundIndex >= conversation.rounds.length - 1 &&
    packIntimateFinaleEarned(
      selectedDialogueAffinity,
      effectiveParlerOptions.nsfwContent,
      scoreFromChoices(scores),
      conversation,
      sessionSummary,
      protagonistGenderForSession,
    )
      ? 'Fin de l\'acte'
      : roundIndex >= conversation.rounds.length - 1
        ? 'Voir le résultat'
        : 'Suite'

  const computeReward = (finalScores: number[]) => {
    const final = scoreFromChoices(finalScores)
    return final === 0 ? { renown: 3 } : scaleReward(activity.baseReward, final, maxSessionScore)
  }

  const claimRewardsOnce = (keepOpen: boolean) => {
    if (!pendingReward || rewardsClaimedRef.current) return
    rewardsClaimedRef.current = true
    onComplete(totalScore, maxSessionScore, pendingReward, { keepOpen })
  }

  const quitMinigame = () => {
    claimRewardsOnce(false)
  }

  const relaunchDiscussion = () => {
    claimRewardsOnce(true)
    if (conversation) setLastConversationId(conversation.id)
    setConversationSession((value) => value + 1)
    resetSession()
  }

  const openCompanionPicker = () => {
    claimRewardsOnce(true)
    setCompanionPickerOpen(true)
  }

  const handleCompanionPick = (activityId: string) => {
    setCompanionPickerOpen(false)
    if (activityId === activity.id) {
      if (conversation) setLastConversationId(conversation.id)
      setConversationSession((value) => value + 1)
      resetSession()
      return
    }
    onLaunchMinigame?.(activityId)
  }

  const pickAnswer = (choice: DialogueChoice) => {
    setFeedbackFx(feedbackTier(scores, choice))
    setPickedChoice(choice)
    setLastReaction(choice.reaction)
    setPhase('reaction')
  }

  const advanceAfterRound = (nextScores: number[]) => {
    const sessionTotal = scoreFromChoices(nextScores)
    if (roundIndex >= conversation.rounds.length - 1) {
      if (
        packIntimateFinaleEarned(
          selectedDialogueAffinity,
          effectiveParlerOptions.nsfwContent,
          sessionTotal,
          conversation,
          sessionSummaryForScores(nextScores),
          protagonistGenderForSession,
        )
      ) {
        setPhase('packFinale')
        return
      }
      setPendingReward(computeReward(nextScores))
      setPhase('result')
      return
    }

    setRoundIndex((value) => value + 1)
    setPhase('round')
  }

  const nextAfterReaction = () => {
    const roundScore = pickedChoice?.score ?? 0

    if (pickedChoice && currentRound) {
      const earnedFinale = intimateFinaleForRound(
        selectedDialogueAffinity,
        effectiveParlerOptions.nsfwContent,
        roundScore,
        currentRound,
      )

      setRoundRecaps((previous) => [
        ...previous,
        {
          index: roundIndex,
          contextText: currentRound.context.join(' '),
          prompt: currentRound.prompt,
          choiceText: pickedChoice.text,
          reaction: lastReaction,
          success: pickedChoice.score >= 2,
          intimateFinale: earnedFinale,
        },
      ])
    }

    setFeedbackFx(null)
    const nextScores = [...scores, roundScore]
    setScores(nextScores)
    setPickedChoice(null)

    if (
      intimateFinaleEarned(
        selectedDialogueAffinity,
        effectiveParlerOptions.nsfwContent,
        roundScore,
        currentRound,
      )
    ) {
      setPhase('finale')
      return
    }

    advanceAfterRound(nextScores)
  }

  const continueAfterFinale = () => {
    const sessionTotal = scoreFromChoices(scores)
    if (
      roundIndex >= conversation.rounds.length - 1 &&
      packIntimateFinaleEarned(
        selectedDialogueAffinity,
        effectiveParlerOptions.nsfwContent,
        sessionTotal,
        conversation,
        sessionSummary,
        protagonistGenderForSession,
      )
    ) {
      setPhase('packFinale')
      return
    }
    advanceAfterRound(scores)
  }

  const continueAfterPackFinale = () => {
    setPendingReward(computeReward(scores))
    setPhase('result')
  }

  const showFeedback = phase === 'reaction' && feedbackFx !== null
  const viewportFxClass = showFeedback
    ? `mg-conversation-viewport--${feedbackFx.kind} mg-conversation-viewport--t${feedbackFx.tier}`
    : ''
  const portraitFxClass = showFeedback
    ? `mg-conversation-portrait--${feedbackFx.kind} mg-conversation-portrait--t${feedbackFx.tier}`
    : ''

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionInScene
      companionMood={conversation.personalityHint}
      companionName={companionName}
      layoutVariant="conversation"
      stageBackgroundSrc={affinityArtwork}
      stageBackgroundVariant="companion-art"
      endless
      maxScore={maxSessionScore}
      onClose={onClose}
      onRestart={() => {
        if (conversation) setLastConversationId(conversation.id)
        setConversationSession((value) => value + 1)
        resetSession()
      }}
      resourceLabel={resourceLabel}
      score={totalScore}
      scoreLabel="Points"
      status="playing"
    >
      <div className="mg-conversation">
        <div className={`mg-conversation-viewport ${viewportFxClass}`.trim()}>
          {showFeedback ? (
            <>
              <div
                aria-hidden
                className={`mg-conversation-fx-ring mg-conversation-fx-ring--${feedbackFx.kind} mg-conversation-fx-ring--t${feedbackFx.tier}`}
                key={`ring-${feedbackFx.pulse}`}
              />
              <div
                aria-hidden
                className={`mg-conversation-fx-burst mg-conversation-fx-burst--${feedbackFx.kind} mg-conversation-fx-burst--t${feedbackFx.tier}`}
                key={`burst-${feedbackFx.pulse}`}
              >
                {Array.from({ length: feedbackFx.tier * 3 }, (_, index) => (
                  <span key={index} style={{ '--fx-i': index } as CSSProperties} />
                ))}
              </div>
              <p
                className={`mg-conversation-feedback-toast mg-conversation-feedback-toast--${feedbackFx.kind} mg-conversation-feedback-toast--t${feedbackFx.tier}`}
                key={`toast-${feedbackFx.pulse}`}
              >
                {feedbackFx.kind === 'success'
                  ? SUCCESS_TOAST[feedbackFx.tier]
                  : FAIL_TOAST[feedbackFx.tier]}
              </p>
            </>
          ) : null}
          <div
            aria-hidden
            className={`mg-conversation-portrait-stack mg-conversation-portrait ${portraitFxClass}`.trim()}
          >
            <CompanionPortrait
              alt=""
              companionId={devCorpusCompanionId}
              cutoutOnly
              emotion={portraitEmotion}
              fitContain
              key={`parler-${devCorpusCompanionId}-${portraitEmotion ?? 'tier'}-${roundIndex}`}
              level={selectedDialogueAffinity}
            />
          </div>
          {phase === 'reaction' && pickedChoice && lastReaction ? (
            <div
              className={`mg-conversation-reaction-speech mg-conversation-reaction-speech--${choiceBubbleClass(pickedChoice.score)}`}
              role="status"
            >
              <p className="mg-conversation-reaction-speech-text">
                <CompanionReactionContent companionName={effectiveCompanionName} reaction={lastReaction} />
              </p>
            </div>
          ) : null}
        </div>

        <div className="mg-conversation-dock">
          <header className={`mg-conversation-head ${inPlay ? 'compact' : ''}`}>
            <div className="mg-conversation-head-main">
              <p className="eyebrow">{conversation.title}</p>
              <h3>{effectiveCompanionName}</h3>
            </div>
            <div className="mg-conversation-head-meta">
              <small className="mg-conversation-session-tag">
                {conversation.title} · MC {sessionMcGender}
              </small>
              <small className="mg-conversation-affinity-tag">
                Discussion · aff. {selectedDialogueAffinity}/5
              </small>
              {inPlay && (
                <small className="mg-conversation-progress">
                  Échange {roundIndex + 1}/{conversation.rounds.length} · {totalScore}/{maxSessionScore}
                </small>
              )}
              {phase === 'result' && (
                <small className="mg-conversation-progress">Résultat · {totalScore}/{maxSessionScore}</small>
              )}
            </div>
            {!inPlay && phase !== 'result' && (
              <p className="mg-conversation-hint">{conversation.personalityHint}</p>
            )}
          </header>

          {phase === 'intro' && (
            <div className="mg-conversation-panel">
              <p>
                <strong>Mini-jeu Parler</strong> — distinct des conversations de lien gratuites
                (onglet Liens).
                {isSingleExchange ? (
                  <>
                    {' '}
                    Un échange à choix : adapte ton ton à {companionName} ; une bonne réponse vaut
                    le maximum.
                  </>
                ) : (
                  <>
                    {' '}
                    Trois échanges enchaînés (un fil narratif tiré au hasard) : adapte ton ton à{' '}
                    {companionName} ; 3 bonnes réponses = maximum.
                  </>
                )}
              </p>
              <fieldset className="mg-conversation-affinity-picker">
                <legend>Niveau d&apos;affinité de la discussion</legend>
                <div className="mg-conversation-affinity-options" role="group" aria-label="Palier d'affinité">
                  {PARLER_AFFINITY_LEVELS.map((level) => {
                    const available = hasParlerDialoguesAtAffinity(
                      activity.companionId,
                      level,
                      effectiveParlerOptions,
                    )
                    const active = selectedDialogueAffinity === level
                    return (
                      <button
                        key={level}
                        type="button"
                        className={`secondary mg-conversation-affinity-option${active ? ' active' : ''}`}
                        disabled={!available || conversationLoading}
                        aria-pressed={active}
                        onClick={() => pickDialogueAffinity(level)}
                      >
                        <span className="mg-conversation-affinity-option-level">{level}</span>
                        {!available ? (
                          <span className="mg-conversation-affinity-option-hint">Bientôt</span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
                {playerAffinityLevel !== selectedDialogueAffinity ? (
                  <p className="mg-conversation-affinity-note">
                    Ton affinité en jeu : {playerAffinityLevel}/5 — tu testes un autre palier de dialogue.
                  </p>
                ) : null}
              </fieldset>
              {PARLER_DEV_MODE &&
              (curatedDevExchangeOptions.length > 0 || curatedDevPackOptions.length > 0) ? (
                <fieldset className="mg-conversation-affinity-picker mg-conversation-dev-pack-picker">
                  <legend>Corpus curé (dev)</legend>
                  <label className="mg-conversation-dev-pack-label">
                    <select
                      aria-label="Choisir un pack ou un échange curé à tester"
                      className="mg-conversation-dev-pack-select"
                      value={devCuratedSelectionRaw}
                      onChange={(event) => pickDevCuratedSelection(event.target.value)}
                    >
                      <option value="">Pack aléatoire (prod)</option>
                      {curatedDevPackOptions.length > 0 ? (
                        <optgroup label="Session — pack curé (3–9 ex.)">
                          {curatedDevPackOptions.map((pack) => (
                            <option
                              key={`${pack.companionId}-${pack.affinity}-${pack.protagonistGender}-${pack.packId}`}
                              value={serializeDevCuratedSelection({
                                mode: 'pack',
                                companionId: pack.companionId,
                                packId: pack.packId,
                                affinity: pack.affinity,
                                protagonistGender: pack.protagonistGender,
                              })}
                            >
                              {pack.label}
                            </option>
                          ))}
                        </optgroup>
                      ) : null}
                      {curatedDevExchangeOptions.length > 0 ? (
                        <optgroup label="Échange unique — 1 round">
                          {curatedDevExchangeOptions.map((exchange) => (
                            <option
                              key={exchange.exchangeId}
                              value={serializeDevCuratedSelection({
                                mode: 'exchange',
                                exchangeId: exchange.exchangeId,
                              })}
                            >
                              {exchange.label}
                            </option>
                          ))}
                        </optgroup>
                      ) : null}
                    </select>
                  </label>
                  <p className="mg-conversation-dev-pack-note">
                    Aff. 4–5 : variantes H et F. Pack curé = 3–9 ex. comme en prod ; échange unique =
                    1 round debug. Sans sélection, tirage pack aléatoire.
                  </p>
                </fieldset>
              ) : null}
              <button
                className="primary mg-big-btn"
                type="button"
                disabled={conversationLoading || !conversation}
                onClick={() => setPhase('round')}
              >
                Commencer la conversation
              </button>
            </div>
          )}

          {(phase === 'round' || phase === 'reaction') && currentRound && (
            <div className="mg-conversation-panel">
              <div
                className={`mg-conversation-dialogue-block${phase === 'reaction' ? ' mg-conversation-dialogue-block--scroll' : ''}`}
              >
                <div className="mg-dialogue-thread">
                  {contextBubbles.map((bubble, lineIndex) => (
                    <p
                      className={`mg-dialogue-bubble ${
                        bubble.variant === 'companion'
                          ? 'mg-dialogue-bubble-companion'
                          : 'mg-dialogue-bubble-narrator'
                      }`}
                      key={`ctx-${roundIndex}-${lineIndex}`}
                    >
                      {bubble.text}
                    </p>
                  ))}
                  {currentRound.companionAction ? (
                    <p className="mg-dialogue-bubble mg-dialogue-bubble-narrator mg-dialogue-bubble-companion-action">
                      {formatCompanionActionLine(currentRound.companionAction)}
                    </p>
                  ) : null}
                  <p
                    className="mg-dialogue-bubble mg-dialogue-bubble-companion mg-dialogue-bubble-companion-prompt"
                    ref={promptRef}
                  >
                    {formatCompanionPromptLine(companionName, currentRound.prompt)}
                  </p>
                  {phase === 'reaction' && pickedChoice && (
                    <>
                      <p
                        className={`mg-dialogue-bubble mg-dialogue-bubble-player mg-dialogue-bubble-player--${choiceBubbleClass(pickedChoice.score)}`}
                      >
                        {pickedChoice.text}
                      </p>
                      <p
                        className={`mg-dialogue-bubble mg-dialogue-bubble-companion mg-dialogue-bubble-reaction mg-dialogue-bubble-reaction--${choiceBubbleClass(pickedChoice.score)} mg-dialogue-bubble-reaction--emphasis`}
                      >
                        <CompanionReactionContent companionName={effectiveCompanionName} reaction={lastReaction} />
                      </p>
                      <div aria-hidden ref={dialogueEndRef} />
                    </>
                  )}
                </div>
              </div>

              <div className="mg-conversation-actions-block">
                {phase === 'round' ? (
                  <div className="mg-conversation-choices mg-conversation-choices-stack">
                    {currentRound.choices.map((choice) => (
                      <button
                        key={`${choice.tone}-${choice.text}`}
                        className="secondary mg-conversation-choice"
                        type="button"
                        onClick={() => pickAnswer(choice)}
                      >
                        {PARLER_DEV_MODE ? (
                          <span className="mg-conversation-choice-score">+{choice.score}</span>
                        ) : null}
                        <span className="mg-conversation-choice-text">{choice.text}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mg-conversation-reaction">
                    <p className="mg-conversation-reaction-hint">
                      Lis la réponse de {companionName} (bulle sur le portrait), puis continue.
                    </p>
                    <button className="primary" type="button" onClick={nextAfterReaction}>
                      {reactionContinueLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {phase === 'finale' && currentFinale ? (
            <div className="mg-conversation-panel">
              <IntimateFinaleBlock
                finale={currentFinale}
                kicker={
                  conversation.rounds.length > 1
                    ? `Épilogue — échange ${roundIndex + 1}`
                    : 'Épilogue'
                }
              />
              <div className="mg-conversation-actions-block">
                <div className="mg-conversation-reaction">
                  <p className="mg-conversation-reaction-hint">
                    Scène finale de l&apos;échange — lis l&apos;épilogue, puis continue.
                  </p>
                  <button className="primary" type="button" onClick={continueAfterFinale}>
                    {finaleContinueLabel}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {phase === 'packFinale' && currentPackFinale ? (
            <div className="mg-conversation-panel">
              <IntimateFinaleBlock
                finale={currentPackFinale}
                kicker={`Épilogue — ${conversation.title}`}
              />
              <div className="mg-conversation-actions-block">
                <div className="mg-conversation-reaction">
                  <p className="mg-conversation-reaction-hint">
                    Clôture de l&apos;acte — lis l&apos;épilogue, puis continue.
                  </p>
                  <button className="primary" type="button" onClick={continueAfterPackFinale}>
                    Voir le résultat
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {phase === 'result' && (
            <div className="mg-conversation-panel mg-conversation-result">
              <div className="mg-conversation-result-summary">
                <p className="mg-conversation-result-score">
                  <strong>{totalScore}/{maxSessionScore}</strong> points
                </p>
                <p className="mg-conversation-result-affinity">
                  {linkPointsGained > 0 ? (
                    <>
                      <span className="mg-conversation-result-affinity-value">+{linkPointsGained}</span>
                      {' '}
                      point{linkPointsGained > 1 ? 's' : ''} de lien
                      {playerAffinityLevel >= 5 ? ' — affinité déjà au maximum' : ''}
                    </>
                  ) : (
                    <>Aucun point de lien gagné cette fois.</>
                  )}
                </p>
                {displayReward ? (
                  <p className="mg-conversation-result-reward">
                    Récompenses : {formatReward(displayReward)}
                  </p>
                ) : null}
                {PARLER_DEV_MODE && sessionSummaryLines.length > 0 ? (
                  <div className="mg-conversation-result-session-bilan">
                    <p className="mg-conversation-recap-title">Bilan de la session</p>
                    <ul className="mg-conversation-result-session-list">
                      {sessionSummaryLines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {earnedIntimateFinales.length > 0 ? (
                <div className="mg-conversation-intimate-finale-list">
                  {earnedIntimateFinales.map((entry) => (
                    <IntimateFinaleBlock
                      finale={entry.finale!}
                      key={`result-finale-${entry.roundIndex}`}
                      kicker={
                        conversation.rounds.length > 1
                          ? `Épilogue — échange ${entry.roundIndex + 1}`
                          : 'Épilogue'
                      }
                    />
                  ))}
                </div>
              ) : null}

              {earnedPackIntimateFinale ? (
                <IntimateFinaleBlock
                  finale={earnedPackIntimateFinale}
                  kicker={`Épilogue — ${conversation.title}`}
                />
              ) : null}

              <div className="mg-conversation-recap-list">
                <p className="mg-conversation-recap-title">Relire les échanges</p>
                {roundRecaps.map((round) => (
                  <details className="mg-conversation-recap" key={round.index}>
                    <summary>
                      <span>Échange {round.index + 1}</span>
                      <span
                        className={`mg-conversation-recap-badge${
                          round.success ? ' success' : ' fail'
                        }`}
                      >
                        {round.success ? 'Réussi' : 'Raté'}
                      </span>
                    </summary>
                    <div className="mg-conversation-recap-body">
                      {round.contextText ? (
                        <p className="mg-dialogue-bubble mg-dialogue-bubble-narrator">
                          {round.contextText}
                        </p>
                      ) : null}
                      <p className="mg-dialogue-bubble mg-dialogue-bubble-companion">{round.prompt}</p>
                      <p
                        className={`mg-dialogue-bubble mg-dialogue-bubble-player${
                          round.success ? ' mg-dialogue-bubble-player--success' : ' mg-dialogue-bubble-player--fail'
                        }`}
                      >
                        {round.choiceText}
                      </p>
                      <p
                        className={`mg-dialogue-bubble mg-dialogue-bubble-companion mg-dialogue-bubble-reaction${
                          round.success
                            ? ' mg-dialogue-bubble-reaction--success'
                            : ' mg-dialogue-bubble-reaction--fail'
                        }`}
                      >
                        <CompanionReactionContent companionName={companionName} reaction={round.reaction} />
                      </p>
                      {round.intimateFinale ? (
                        <IntimateFinaleBlock
                          finale={round.intimateFinale}
                          kicker="Épilogue"
                        />
                      ) : null}
                    </div>
                  </details>
                ))}
              </div>

              <div className="mg-conversation-result-actions">
                <button className="primary mg-big-btn" type="button" onClick={relaunchDiscussion}>
                  Relancer une discussion
                </button>
                <button className="secondary mg-big-btn" type="button" onClick={openCompanionPicker}>
                  Choisir un autre compagnon
                </button>
                <button className="secondary mg-big-btn" type="button" onClick={quitMinigame}>
                  Quitter le mini-jeu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {companionPickerOpen ? (
        <ConversationPicker
          activities={conversationActivities}
          companions={pickerCompanions}
          unlockAtByBuilding={BUILDING_UNLOCK_STAGE}
          villageStage={villageStage}
          onClose={() => setCompanionPickerOpen(false)}
          onPick={handleCompanionPick}
        />
      ) : null}
    </MinigameFrame>
  )
}
