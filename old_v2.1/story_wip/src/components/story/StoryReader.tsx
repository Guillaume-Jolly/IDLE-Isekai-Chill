import { useMemo, useState } from 'react'
import {
  resolveSceneBeat,
  type SceneChapter,
  type SceneChoice,
  type SceneRuntimeBeat,
} from '../../data/sceneGenerator'
import { useCompanionEmotionCutout } from '../../hooks/useCompanionEmotionCutout'
import '../minigames/Minigames.css'
import './StoryReader.css'

type StoryPhase = 'intro' | 'playing' | 'complete'
type DialogueStep = 'context' | 'prompt' | 'reaction'

type StoryReaderProps = {
  chapter: SceneChapter
  affinity?: number
  onComplete?: () => void
  onRestart?: () => void
}

function speakerLabel(beat: SceneRuntimeBeat['beat'], companionId: string): string {
  if (beat.speaker === 'narrator') return 'Narrateur'
  if (beat.speaker === 'player') return 'Toi'
  return beat.characterId ?? companionId
}

export function StoryReader({
  chapter,
  affinity = 3,
  onComplete,
  onRestart,
}: StoryReaderProps) {
  const [phase, setPhase] = useState<StoryPhase>('intro')
  const [exchangeIndex, setExchangeIndex] = useState(0)
  const [beatIndex, setBeatIndex] = useState(0)
  const [dialogueStep, setDialogueStep] = useState<DialogueStep>('context')
  const [pickedChoice, setPickedChoice] = useState<SceneChoice | null>(null)

  const exchange = chapter.exchanges[exchangeIndex]

  const runtimeBeat = useMemo((): SceneRuntimeBeat | null => {
    if (!exchange || phase !== 'playing') return null

    if (exchange.kind === 'sequence') {
      const beat = exchange.beats[beatIndex]
      if (!beat) return null
      return resolveSceneBeat(beat, chapter, { affinity })
    }

    if (dialogueStep === 'context') {
      const beat = exchange.context[beatIndex]
      if (!beat) return null
      return resolveSceneBeat(beat, chapter, { affinity })
    }

    if (dialogueStep === 'prompt') {
      return resolveSceneBeat(exchange.prompt, chapter, {
        tone: exchange.toneHint,
        roundIndex: exchangeIndex,
        affinity,
      })
    }

    if (dialogueStep === 'reaction' && pickedChoice) {
      return resolveSceneBeat(pickedChoice.reaction, chapter, {
        tone: pickedChoice.tone,
        success: pickedChoice.score === 1,
        roundIndex: exchangeIndex,
        affinity,
      })
    }

    return null
  }, [beatIndex, chapter, dialogueStep, exchange, exchangeIndex, phase, pickedChoice])

  const cutoutCompanionId =
    runtimeBeat?.beat.characterId ??
    (runtimeBeat?.beat.speaker === 'companion' ? chapter.companionId : null)

  const emotionCutoutSrc = useCompanionEmotionCutout(
    cutoutCompanionId ?? chapter.companionId,
    runtimeBeat?.emotion ?? 'neutral',
  )

  const showCutout =
    runtimeBeat?.beat.speaker === 'companion' ||
    (runtimeBeat?.beat.speaker !== 'narrator' && Boolean(cutoutCompanionId))

  const advance = () => {
    if (!exchange) return

    if (exchange.kind === 'sequence') {
      if (beatIndex < exchange.beats.length - 1) {
        setBeatIndex((value) => value + 1)
        return
      }
      goNextExchange()
      return
    }

    if (dialogueStep === 'context') {
      if (beatIndex < exchange.context.length - 1) {
        setBeatIndex((value) => value + 1)
        return
      }
      setDialogueStep('prompt')
      return
    }

    if (dialogueStep === 'reaction') {
      goNextExchange()
    }
  }

  const goNextExchange = () => {
    if (exchangeIndex >= chapter.exchanges.length - 1) {
      setPhase('complete')
      onComplete?.()
      return
    }

    const nextIndex = exchangeIndex + 1
    setExchangeIndex(nextIndex)
    setBeatIndex(0)
    setDialogueStep('context')
    setPickedChoice(null)
  }

  const pickChoice = (choice: SceneChoice) => {
    setPickedChoice(choice)
    setDialogueStep('reaction')
  }

  const restart = () => {
    setPhase('intro')
    setExchangeIndex(0)
    setBeatIndex(0)
    setDialogueStep('context')
    setPickedChoice(null)
    onRestart?.()
  }

  const progressLabel = `${exchangeIndex + 1} / ${chapter.exchanges.length}`

  return (
    <section aria-labelledby={`story-${chapter.id}-title`} className="story-reader">
      <header className="story-reader-head">
        <div>
          <p className="eyebrow">{chapter.kind === 'disagrea' ? 'Scène event' : 'Histoire'}</p>
          <h3 id={`story-${chapter.id}-title`}>{chapter.title}</h3>
          {chapter.subtitle ? <p className="story-reader-subtitle">{chapter.subtitle}</p> : null}
        </div>
        {phase === 'playing' ? (
          <span className="story-reader-progress">{progressLabel}</span>
        ) : null}
      </header>

      <div className="mg-conversation story-reader-stage">
        <div
          className={`mg-conversation-viewport ${runtimeBeat?.fxClass ?? ''}`.trim()}
          style={
            runtimeBeat?.backgroundUrl
              ? {
                  backgroundImage: `url(${runtimeBeat.backgroundUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {showCutout ? (
            <div
              aria-hidden
              className="mg-conversation-portrait-stack mg-conversation-portrait mg-conversation-portrait--live"
              key={`${cutoutCompanionId}-${runtimeBeat?.emotion}-${runtimeBeat?.beat.id}`}
            >
              {emotionCutoutSrc ? (
                <img
                  alt=""
                  className="companion-portrait companion-portrait--cutout mg-conversation-emotion-cutout"
                  draggable={false}
                  src={emotionCutoutSrc}
                />
              ) : (
                <div className="companion-portrait companion-portrait--loading" />
              )}
            </div>
          ) : null}
        </div>

        <div className="mg-conversation-dock story-reader-dock">
          {phase === 'intro' && (
            <div className="mg-conversation-panel">
              <p>
                Scène courte en <strong>{chapter.exchanges.length} passages</strong>. Les portraits et
                fonds s&apos;adaptent au ton — pas de cinématique interminable.
              </p>
              <button
                className="primary mg-big-btn"
                type="button"
                onClick={() => setPhase('playing')}
              >
                Commencer
              </button>
            </div>
          )}

          {phase === 'playing' && runtimeBeat && (
            <>
              <div className="story-reader-beat">
                <p className="story-reader-speaker">
                  {speakerLabel(runtimeBeat.beat, chapter.companionId)}
                </p>
                <p className="story-reader-text">{runtimeBeat.beat.text}</p>
              </div>

              {exchange?.kind === 'dialogue' && dialogueStep === 'prompt' ? (
                <div className="mg-conversation-choices">
                  {exchange.choices.map((choice) => (
                    <button
                      className="mg-conversation-choice"
                      key={choice.id}
                      type="button"
                      onClick={() => pickChoice(choice)}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              ) : (
                <button className="primary mg-big-btn" type="button" onClick={advance}>
                  {dialogueStep === 'reaction' ? 'Suite' : 'Continuer'}
                </button>
              )}
            </>
          )}

          {phase === 'complete' && (
            <div className="mg-conversation-panel">
              <p>Fin du chapitre. Tu peux relire quand tu veux — sans pression.</p>
              <button className="primary mg-big-btn" type="button" onClick={restart}>
                Rejouer
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
