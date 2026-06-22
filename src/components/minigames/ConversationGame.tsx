import { useMemo, useState } from 'react'
import {
  pickConversation,
  scoreFromChoices,
  type DialogueChoice,
} from '../../data/companionDialogues'
import { scaleReward } from '../../data/buildingActivities'
import { companionAssetPath } from '../../data/companionAssets'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

type Phase = 'intro' | 'round' | 'reaction' | 'result'

export function ConversationGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
  companionAffinity = 2,
}: MinigameProps) {
  const [conversationSession, setConversationSession] = useState(0)
  const [lastConversationId, setLastConversationId] = useState<string | undefined>()

  const conversation = useMemo(
    () => pickConversation(activity.companionId, companionAffinity, lastConversationId),
    [activity.companionId, companionAffinity, lastConversationId, conversationSession],
  )

  const [phase, setPhase] = useState<Phase>('intro')
  const [roundIndex, setRoundIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [lastReaction, setLastReaction] = useState('')
  const [pickedChoice, setPickedChoice] = useState<DialogueChoice | null>(null)
  const affinityLevel = Math.min(5, Math.max(1, companionAffinity))
  const affinityArtwork = companionAssetPath(activity.companionId, affinityLevel)

  const resetSession = () => {
    setPhase('intro')
    setRoundIndex(0)
    setScores([])
    setPickedChoice(null)
    setLastReaction('')
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

  const finish = (finalScores: number[]) => {
    const final = scoreFromChoices(finalScores)
    const reward =
      final === 0
        ? { renown: 3 }
        : scaleReward(activity.baseReward, final, 3)
    onComplete(final, 3, reward, { keepOpen: false })
  }

  const pickAnswer = (choice: DialogueChoice) => {
    setPickedChoice(choice)
    setLastReaction(choice.reaction)
    setPhase('reaction')
  }

  const nextAfterReaction = () => {
    const nextScores = [...scores, pickedChoice?.score ?? 0]
    setScores(nextScores)
    setPickedChoice(null)

    if (roundIndex >= conversation.rounds.length - 1) {
      setPhase('result')
      finish(nextScores)
      return
    }

    setRoundIndex((value) => value + 1)
    setPhase('round')
  }

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
        <div className="mg-conversation-viewport">
          <img
            alt=""
            aria-hidden
            className="mg-conversation-portrait"
            src={affinityArtwork}
          />
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
            </div>
            {!inPlay && (
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
                  {currentRound.context.map((line, index) => (
                    <p className="mg-dialogue-bubble mg-dialogue-bubble-narrator" key={`ctx-${index}`}>
                      {line}
                    </p>
                  ))}
                  <p className="mg-dialogue-bubble mg-dialogue-bubble-companion">{currentRound.prompt}</p>
                  {phase === 'reaction' && pickedChoice && (
                    <>
                      <p className="mg-dialogue-bubble mg-dialogue-bubble-player">{pickedChoice.text}</p>
                      <p className="mg-dialogue-bubble mg-dialogue-bubble-companion mg-dialogue-bubble-reaction">
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
            <div className="mg-conversation-panel">
              <p>
                Conversation terminée : <strong>{totalScore}/3</strong> bonnes réponses.
              </p>
            </div>
          )}
        </div>
      </div>
    </MinigameFrame>
  )
}
