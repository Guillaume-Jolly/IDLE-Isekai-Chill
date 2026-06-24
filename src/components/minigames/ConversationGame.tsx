import { useMemo, useState, type CSSProperties } from 'react'
import {
  pickConversation,
  scoreFromChoices,
  type DialogueChoice,
} from '../../data/companionDialogues'
import { scaleReward, type Cost } from '../../data/buildingActivities'
import { companionBackgroundPath } from '../../data/companionAssets'
import { CompanionPortrait } from '../CompanionPortrait'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

type Phase = 'intro' | 'round' | 'reaction' | 'result'
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

function trailingStreak(values: number[], target: 0 | 1): number {
  let streak = 0
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index] === target) streak += 1
    else break
  }
  return streak
}

function feedbackTier(scores: number[], choice: DialogueChoice): FeedbackFx {
  const isSuccess = choice.score === 1
  const prior = trailingStreak(scores, isSuccess ? 1 : 0)
  return {
    kind: isSuccess ? 'success' : 'fail',
    tier: Math.min(3, prior + 1) as FeedbackTier,
    pulse: Date.now(),
  }
}

export function ConversationGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
  companionAffinity = 2,
  conversationRewardMultiplier = 1,
}: MinigameProps) {
  const [conversationSession, setConversationSession] = useState(0)
  const [lastConversationId, setLastConversationId] = useState<string | undefined>()

  const conversation = useMemo(() => {
    void conversationSession
    return pickConversation(activity.companionId, companionAffinity, lastConversationId)
  }, [activity.companionId, companionAffinity, lastConversationId, conversationSession])

  const [phase, setPhase] = useState<Phase>('intro')
  const [roundIndex, setRoundIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [roundRecaps, setRoundRecaps] = useState<RoundRecap[]>([])
  const [lastReaction, setLastReaction] = useState('')
  const [pickedChoice, setPickedChoice] = useState<DialogueChoice | null>(null)
  const [feedbackFx, setFeedbackFx] = useState<FeedbackFx | null>(null)
  const [pendingReward, setPendingReward] = useState<Cost | null>(null)
  const affinityLevel = Math.min(5, Math.max(1, companionAffinity))
  const affinityArtwork = activity.companionId
    ? companionBackgroundPath(activity.companionId, affinityLevel)
    : undefined

  const displayReward = useMemo(() => {
    if (!pendingReward) return null
    return scaleRewardByMultiplier(pendingReward, conversationRewardMultiplier)
  }, [conversationRewardMultiplier, pendingReward])

  const resetSession = () => {
    setPhase('intro')
    setRoundIndex(0)
    setScores([])
    setRoundRecaps([])
    setPickedChoice(null)
    setLastReaction('')
    setFeedbackFx(null)
    setPendingReward(null)
  }

  if (!conversation) {
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
        status="lost"
      >
        <p>Pas encore de dialogue pour ce compagnon.</p>
      </MinigameFrame>
    )
  }

  const currentRound = conversation.rounds[roundIndex]
  const totalScore = scoreFromChoices(scores)
  const inPlay = phase === 'round' || phase === 'reaction'
  const linkPointsGained = totalScore

  const computeReward = (finalScores: number[]) => {
    const final = scoreFromChoices(finalScores)
    return final === 0 ? { renown: 3 } : scaleReward(activity.baseReward, final, 3)
  }

  const confirmResult = () => {
    if (!pendingReward) return
    onComplete(totalScore, 3, pendingReward, { keepOpen: false })
  }

  const pickAnswer = (choice: DialogueChoice) => {
    setFeedbackFx(feedbackTier(scores, choice))
    setPickedChoice(choice)
    setLastReaction(choice.reaction)
    setPhase('reaction')
  }

  const nextAfterReaction = () => {
    if (pickedChoice && currentRound) {
      setRoundRecaps((previous) => [
        ...previous,
        {
          index: roundIndex,
          contextText: currentRound.context.join(' '),
          prompt: currentRound.prompt,
          choiceText: pickedChoice.text,
          reaction: lastReaction,
          success: pickedChoice.score === 1,
        },
      ])
    }

    setFeedbackFx(null)
    const nextScores = [...scores, pickedChoice?.score ?? 0]
    setScores(nextScores)
    setPickedChoice(null)

    if (roundIndex >= conversation.rounds.length - 1) {
      setPendingReward(computeReward(nextScores))
      setPhase('result')
      return
    }

    setRoundIndex((value) => value + 1)
    setPhase('round')
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
      maxScore={3}
      onClose={onClose}
      onRestart={() => {
        if (conversation) setLastConversationId(conversation.id)
        setConversationSession((value) => value + 1)
        resetSession()
      }}
      resourceLabel={resourceLabel}
      score={totalScore}
      scoreLabel="Réponses justes"
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
              companionId={activity.companionId}
              level={affinityLevel}
            />
          </div>
        </div>

        <div className="mg-conversation-dock">
          <header className={`mg-conversation-head ${inPlay ? 'compact' : ''}`}>
            <div className="mg-conversation-head-main">
              <p className="eyebrow">{conversation.title}</p>
              <h3>{companionName}</h3>
            </div>
            <div className="mg-conversation-head-meta">
              <small className="mg-conversation-affinity-tag">Affinité {affinityLevel}/5</small>
              {inPlay && (
                <small className="mg-conversation-progress">
                  Échange {roundIndex + 1}/{conversation.rounds.length} · {totalScore}/3
                </small>
              )}
              {phase === 'result' && (
                <small className="mg-conversation-progress">Résultat · {totalScore}/3</small>
              )}
            </div>
            {!inPlay && phase !== 'result' && (
              <p className="mg-conversation-hint">{conversation.personalityHint}</p>
            )}
          </header>

          {phase === 'intro' && (
            <div className="mg-conversation-panel">
              <p>
                Une scène en <strong>trois échanges</strong>. Lis le contexte, réponds avec l'une
                des quatre réponses — chacune réagit vraiment à ce qu'a dit {companionName}. Adapte
                ton ton à sa personnalité : 3 bonnes réponses = max.
              </p>
              <button className="primary mg-big-btn" type="button" onClick={() => setPhase('round')}>
                Commencer la conversation
              </button>
            </div>
          )}

          {(phase === 'round' || phase === 'reaction') && currentRound && (
            <div className="mg-conversation-panel">
              <div className="mg-conversation-dialogue-block">
                <div className="mg-dialogue-thread">
                  {currentRound.context.length > 0 && (
                    <p className="mg-dialogue-bubble mg-dialogue-bubble-narrator">
                      {currentRound.context.join(' ')}
                    </p>
                  )}
                  <p className="mg-dialogue-bubble mg-dialogue-bubble-companion">{currentRound.prompt}</p>
                  {phase === 'reaction' && pickedChoice && (
                    <>
                      <p
                        className={`mg-dialogue-bubble mg-dialogue-bubble-player${
                          pickedChoice.score === 1
                            ? ' mg-dialogue-bubble-player--success'
                            : ' mg-dialogue-bubble-player--fail'
                        }`}
                      >
                        {pickedChoice.text}
                      </p>
                      <p
                        className={`mg-dialogue-bubble mg-dialogue-bubble-companion mg-dialogue-bubble-reaction${
                          pickedChoice.score === 1
                            ? ' mg-dialogue-bubble-reaction--success'
                            : ' mg-dialogue-bubble-reaction--fail'
                        }`}
                      >
                        {lastReaction}
                      </p>
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
                        {choice.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mg-conversation-reaction">
                    <button className="primary" type="button" onClick={nextAfterReaction}>
                      {roundIndex >= conversation.rounds.length - 1 ? 'Voir le résultat' : 'Suite'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {phase === 'result' && (
            <div className="mg-conversation-panel mg-conversation-result">
              <div className="mg-conversation-result-summary">
                <p className="mg-conversation-result-score">
                  <strong>{totalScore}/3</strong> bonnes réponses
                </p>
                <p className="mg-conversation-result-affinity">
                  {linkPointsGained > 0 ? (
                    <>
                      <span className="mg-conversation-result-affinity-value">+{linkPointsGained}</span>
                      {' '}
                      point{linkPointsGained > 1 ? 's' : ''} de lien
                      {affinityLevel >= 5 ? ' — affinité déjà au maximum' : ''}
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
              </div>

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
                        {round.reaction}
                      </p>
                    </div>
                  </details>
                ))}
              </div>

              <button className="primary mg-big-btn" type="button" onClick={confirmResult}>
                Terminer
              </button>
            </div>
          )}
        </div>
      </div>
    </MinigameFrame>
  )
}
