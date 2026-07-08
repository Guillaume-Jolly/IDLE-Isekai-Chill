import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { scaleReward } from '../../../data/buildingActivities'
import { buildAbstractColorRounds } from '../../../data/dialedColor/abstractRounds'
import {
  buildChatGptDebugPrompt,
  getChatGptDebugLayer,
  getColorToonDebugLayers,
  getInitialColorToonDebugLayerId,
  isColorToonMaskDebug,
} from '../../../data/dialedColor/color2ChatGptMasks'
import { getColor2FocusClipPath } from '../../../data/dialedColor/color2FocusRegions'
import { getColor2MaskSrc } from '../../../data/dialedColor/color2Masks'
import type { Color2Round } from '../../../data/dialedColor/color2Prompts'
import { buildColor2Rounds } from '../../../data/dialedColor/color2Prompts'
import {
  DIALED_COLOR_MAX_SCORE,
  DIALED_COLOR_ROUNDS,
  type HsbColor,
  hsbToCss,
  scoreColorMatch,
} from '../../../data/dialedColor/scoring'
import { COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID } from '../../../data/dialedColor/color2LayerAlignCatalog'
import {
  getLockedAlignPlacement,
  hasLockedDefaultHairLayer,
  type LockedAlignPlacement,
} from '../../../data/dialedColor/color2LayerAlignStorage'
import { MinigameFrame, type MinigameProps } from '../MinigameFrame'
import { DialedHsbSliders } from './DialedHsbSliders'
import { Color2LayerAlignEditor } from './Color2LayerAlignEditor'
import { ToonAlignedOverlayPortrait } from './ToonAlignedOverlayPortrait'
import { MaskTintCanvas } from './MaskTintCanvas'
import { ToonPortraitViewport } from './ToonPortraitViewport'
import '../DialedColor.css'

type Phase = 'reveal' | 'recall' | 'feedback' | 'done'

type LabPanel = 'align' | 'play'

type RoundDef =
  | { mode: 'abstract'; target: HsbColor }
  | { mode: 'toon'; prompt: Color2Round; target: HsbColor }

const REVEAL_MS = 3800
const REVEAL_MS_TOON = 5200
const DEFAULT_GUESS: HsbColor = { h: 200, s: 50, b: 50 }

function initialDebugLayerId(): string {
  return getInitialColorToonDebugLayerId()
}

function buildDebugRound(layerId: string): RoundDef | null {
  const layer = getChatGptDebugLayer(layerId)
  if (!layer) return null
  const prompt = buildChatGptDebugPrompt(layer)
  return { mode: 'toon', prompt, target: prompt.target }
}

function buildRounds(variant: 'abstract' | 'toon', debugLayerId?: string): RoundDef[] {
  if (variant === 'toon' && isColorToonMaskDebug() && debugLayerId) {
    const debugRound = buildDebugRound(debugLayerId)
    if (debugRound) return [debugRound]
  }
  if (variant === 'toon') {
    return buildColor2Rounds().map((prompt) => ({
      mode: 'toon' as const,
      prompt,
      target: prompt.target,
    }))
  }
  return buildAbstractColorRounds().map((target) => ({ mode: 'abstract' as const, target })  )
}

type ToonPortraitProps = {
  src: string
  maskSrc?: string
  maskMode?: 'luminance' | 'alpha'
  focusClipPath: string
  tintColor?: HsbColor
  showFocusHint?: boolean
  frameClassName?: string
}

function ToonPortrait({
  src,
  maskSrc,
  maskMode = 'alpha',
  focusClipPath,
  tintColor,
  showFocusHint,
  frameClassName,
}: ToonPortraitProps) {
  const maskStyle = maskSrc
    ? {
        WebkitMaskImage: `url(${maskSrc})`,
        maskImage: `url(${maskSrc})`,
        WebkitMaskMode: maskMode,
        maskMode,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }
    : undefined

  const focusHintClass =
    maskMode === 'luminance'
      ? 'dc-toon-focus-hint-mask dc-toon-focus-hint-mask--luminance'
      : 'dc-toon-focus-hint-mask'

  return (
    <div className={`dc-toon-frame${frameClassName ? ` ${frameClassName}` : ''}`}>
      <div className="dc-toon-tint-stack">
        <img alt="" className="dc-toon-img dc-toon-img-base" draggable={false} src={src} />
        {showFocusHint && maskSrc && (
          <img
            alt=""
            aria-hidden
            className={focusHintClass}
            draggable={false}
            src={maskSrc}
          />
        )}
        {showFocusHint && !maskSrc && (
          <div
            aria-hidden
            className="dc-toon-focus-hint"
            style={{ clipPath: focusClipPath, WebkitClipPath: focusClipPath }}
          />
        )}
        {tintColor && maskSrc && maskMode === 'luminance' && (
          <div
            aria-hidden
            className="dc-toon-luminance-tint"
            style={{
              ...maskStyle,
              backgroundColor: hsbToCss(tintColor),
            }}
          />
        )}
        {tintColor && maskSrc && maskMode !== 'luminance' && (
          <div className="dc-toon-masked-tint" style={maskStyle}>
            <img alt="" aria-hidden className="dc-toon-img" draggable={false} src={src} />
            <div
              aria-hidden
              className="dc-toon-tint-overlay"
              style={{ backgroundColor: hsbToCss(tintColor) }}
            />
          </div>
        )}
        {tintColor && !maskSrc && (
          <div
            className="dc-toon-focus-layer"
            style={{ clipPath: focusClipPath, WebkitClipPath: focusClipPath }}
          >
            <img alt="" aria-hidden className="dc-toon-img" draggable={false} src={src} />
            <div
              aria-hidden
              className="dc-toon-tint-overlay"
              style={{ backgroundColor: hsbToCss(tintColor) }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function LabMaskTintViewport({
  portraitSrc,
  cutoutSrc,
  tint,
  showMaskOutline,
  className,
}: {
  portraitSrc: string
  cutoutSrc: string
  tint?: HsbColor
  showMaskOutline?: boolean
  className?: string
}) {
  const [contentSize, setContentSize] = useState({ w: 0, h: 0 })
  const [loadError, setLoadError] = useState<string | null>(null)

  const handleContentSize = useCallback((w: number, h: number) => {
    setContentSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
  }, [])

  const handleLoadError = useCallback((message: string) => {
    setLoadError(message)
  }, [])

  return (
    <ToonPortraitViewport
      className={className}
      contentSize={contentSize.w > 0 ? contentSize : undefined}
      imageSrc={portraitSrc}
    >
      {loadError ? (
        <div className="dc-mask-load-error">
          <p>Impossible de charger le portrait ou le détourage cheveux.</p>
          <p className="dc-mask-load-error-detail">{loadError}</p>
          <p className="dc-mask-load-error-detail">
            Générez le calque : <code>npm run color-toon:build-hair-cutout</code> — attendu{' '}
            <code>{cutoutSrc}</code>
          </p>
        </div>
      ) : (
        <div className="dc-toon-frame dc-toon-frame--lab-zoom">
          <MaskTintCanvas
            cutoutSrc={cutoutSrc}
            mode="overlay"
            onContentSize={handleContentSize}
            onLoadError={handleLoadError}
            portraitSrc={portraitSrc}
            showMaskOutline={showMaskOutline}
            tint={tint}
          />
        </div>
      )}
    </ToonPortraitViewport>
  )
}

function renderToonVisual({
  portraitSrc,
  cutoutSrc,
  maskSrc,
  maskMode,
  focusClipPath,
  tintColor,
  showFocusHint,
  showMaskOutline,
  frameClassName,
  useCanvasMask,
  viewportClassName,
  lockedPlacement,
  opaqueAlignedTint,
}: {
  portraitSrc: string
  cutoutSrc?: string
  maskSrc?: string
  maskMode: 'luminance' | 'alpha'
  focusClipPath: string
  tintColor?: HsbColor
  showFocusHint?: boolean
  showMaskOutline?: boolean
  frameClassName?: string
  useCanvasMask: boolean
  viewportClassName?: string
  lockedPlacement?: LockedAlignPlacement | null
  opaqueAlignedTint?: boolean
}) {
  if (lockedPlacement) {
    return (
      <ToonAlignedOverlayPortrait
        frameClassName={frameClassName}
        opaqueTint={opaqueAlignedTint}
        placement={lockedPlacement}
        portraitSrc={portraitSrc}
        showLayerHint={showFocusHint}
        tintColor={tintColor}
      />
    )
  }
  if (useCanvasMask && cutoutSrc) {
    return (
      <LabMaskTintViewport
        className={viewportClassName}
        cutoutSrc={cutoutSrc}
        portraitSrc={portraitSrc}
        showMaskOutline={showMaskOutline}
        tint={tintColor}
      />
    )
  }
  return (
    <ToonPortrait
      focusClipPath={focusClipPath}
      frameClassName={frameClassName}
      maskMode={maskMode}
      maskSrc={maskSrc}
      showFocusHint={showFocusHint}
      src={portraitSrc}
      tintColor={tintColor}
    />
  )
}

function wrapPortraitViewport(
  portrait: ReactNode,
  imageSrc: string,
  enabled: boolean,
  className?: string,
) {
  if (!enabled) return portrait
  return (
    <ToonPortraitViewport className={className} imageSrc={imageSrc}>
      {portrait}
    </ToonPortraitViewport>
  )
}

type DialedColorGameCoreProps = MinigameProps & {
  variant: 'abstract' | 'toon'
}

export function DialedColorGameCore({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
  variant,
}: DialedColorGameCoreProps) {
  const maskDebugActive = variant === 'toon' && isColorToonMaskDebug()
  const [labPanel, setLabPanel] = useState<LabPanel>(() =>
    maskDebugActive && hasLockedDefaultHairLayer() ? 'play' : 'align',
  )
  const [alignRevision, setAlignRevision] = useState(0)
  const [debugLayerId, setDebugLayerId] = useState(() =>
    hasLockedDefaultHairLayer() ? COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID : initialDebugLayerId(),
  )
  const [rounds, setRounds] = useState(() =>
    buildRounds(
      variant,
      maskDebugActive
        ? hasLockedDefaultHairLayer()
          ? COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID
          : initialDebugLayerId()
        : undefined,
    ),
  )
  const [roundIndex, setRoundIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('reveal')
  const [guess, setGuess] = useState<HsbColor>(DEFAULT_GUESS)
  const [roundScores, setRoundScores] = useState<number[]>([])
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  const debugLayer = maskDebugActive ? getChatGptDebugLayer(debugLayerId) : undefined
  const current = rounds[roundIndex]
  const totalScore = useMemo(
    () => Math.round(roundScores.reduce((n, v) => n + v, 0) * 100) / 100,
    [roundScores],
  )
  const lastRoundScore = roundScores[roundScores.length - 1] ?? 0

  const focusClipPath =
    current?.mode === 'toon' ? getColor2FocusClipPath(current.prompt.id) : undefined
  const maskSrc =
    debugLayer?.maskSrc ??
    (current?.mode === 'toon' ? getColor2MaskSrc(current.prompt.id) : undefined)
  const maskMode = debugLayer?.maskMode ?? 'alpha'

  const lockedPlacement = useMemo(() => {
    if (!maskDebugActive || labPanel !== 'play') return null
    void alignRevision
    return getLockedAlignPlacement(debugLayerId)
  }, [alignRevision, debugLayerId, labPanel, maskDebugActive])

  useEffect(() => {
    if (labPanel === 'play') {
      setAlignRevision((n) => n + 1)
    }
  }, [labPanel])

  const applyDebugLayer = useCallback((layerId: string) => {
    const round = buildDebugRound(layerId)
    if (!round) return
    setDebugLayerId(layerId)
    setRounds([round])
    setRoundIndex(0)
    setPhase('reveal')
    setGuess(DEFAULT_GUESS)
    setRoundScores([])
    setStatus('playing')
  }, [])

  useEffect(() => {
    if (phase !== 'reveal') return
    const delay = variant === 'toon' ? REVEAL_MS_TOON : REVEAL_MS
    const timer = window.setTimeout(() => setPhase('recall'), delay)
    return () => window.clearTimeout(timer)
  }, [phase, roundIndex, variant])

  const restart = useCallback(() => {
    if (maskDebugActive && debugLayerId) {
      applyDebugLayer(debugLayerId)
      return
    }
    setRounds(buildRounds(variant))
    setRoundIndex(0)
    setPhase('reveal')
    setGuess(DEFAULT_GUESS)
    setRoundScores([])
    setStatus('playing')
  }, [applyDebugLayer, debugLayerId, maskDebugActive, variant])

  const submitGuess = () => {
    if (!current || phase !== 'recall') return
    const pts = scoreColorMatch(current.target, guess)
    setRoundScores((prev) => [...prev, pts])
    setPhase('feedback')
  }

  const continueAfterFeedback = () => {
    if (maskDebugActive) {
      applyDebugLayer(debugLayerId)
      return
    }
    if (roundIndex + 1 >= DIALED_COLOR_ROUNDS) {
      setPhase('done')
      setStatus('won')
      onComplete(totalScore, DIALED_COLOR_MAX_SCORE, scaleReward(activity.baseReward, totalScore, DIALED_COLOR_MAX_SCORE))
      return
    }
    setRoundIndex((i) => i + 1)
    setGuess(DEFAULT_GUESS)
    setPhase('reveal')
  }

  if (!current) return null

  const roundLabel = maskDebugActive
    ? `Debug · ${debugLayer?.label ?? debugLayerId}`
    : `${roundIndex + 1} / ${DIALED_COLOR_ROUNDS}`

  const maskTag = lockedPlacement
    ? `Calque verrouillé · ${debugLayer?.label ?? lockedPlacement.layerId}`
    : debugLayer
    ? debugLayer.maskMode === 'luminance'
      ? 'Masque v2 · niveaux de gris'
      : 'Masque ChatGPT · debug'
    : maskSrc
      ? 'Masque validé'
      : undefined

  const tintHint = lockedPlacement
    ? 'Teinte sur le calque verrouillé — position alignement lab appliquée.'
    : maskSrc
    ? debugLayer?.maskMode === 'luminance'
      ? 'Teinte sur le calque cheveux v2 — les nuances du PNG préservent mèches et ombres.'
      : debugLayer
        ? 'Teinte appliquée sur le calque ChatGPT sélectionné.'
        : 'Teinte appliquée sur le masque validé de la zone.'
    : 'Ajuste la pastille — le portrait reste fixe tant qu’aucun masque n’est actif.'

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={DIALED_COLOR_MAX_SCORE}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={totalScore}
      scoreLabel="Précision"
      status={status}
      hideGlobalChrome={maskDebugActive}
    >
      {maskDebugActive && (
        <nav className="dc-lab-tabs" aria-label="Lab Color Toon">
          <button
            className={labPanel === 'align' ? 'is-active' : ''}
            type="button"
            onClick={() => setLabPanel('align')}
          >
            Alignement calques
          </button>
          <button
            className={labPanel === 'play' ? 'is-active' : ''}
            type="button"
            onClick={() => setLabPanel('play')}
          >
            Partie teinte
          </button>
        </nav>
      )}

      {maskDebugActive && labPanel === 'align' ? (
        <Color2LayerAlignEditor className="dc-layer-align--lab-root" />
      ) : (
      <div
        className={`dc-game${variant === 'toon' ? ' dc-game--toon' : ''}${
          variant === 'toon' && phase === 'reveal' ? ' dc-game--reveal-fs' : ''
        }${variant === 'toon' && phase === 'recall' ? ' dc-game--recall-dialed' : ''}${
          maskDebugActive ? ' dc-game--mask-debug' : ''
        }`}
      >
        {maskDebugActive && getColorToonDebugLayers().length > 1 && labPanel === 'play' && (
          <aside className="dc-debug-panel">
            <p className="dc-debug-title">Debug teinte</p>
            <label className="dc-debug-row">
              <span>Calque forcé</span>
              <select
                value={debugLayerId}
                onChange={(e) => applyDebugLayer(e.target.value)}
              >
                {getColorToonDebugLayers().map((layer) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="dc-debug-btn"
              type="button"
              onClick={() => applyDebugLayer(debugLayerId)}
            >
              Rejouer ce calque
            </button>
            {lockedPlacement ? (
              <p className="dc-debug-hint">Alignement verrouillé actif en partie teinte.</p>
            ) : (
              <p className="dc-debug-hint dc-layer-align-status--warn">
                Calque non verrouillé — verrouille-le dans Alignement calques pour tester la position
                sauvegardée.
              </p>
            )}
          </aside>
        )}

        <header className="dc-head">
          <span className="dc-round">{roundLabel}</span>
          <span className="dc-total">{totalScore.toFixed(2)} / {DIALED_COLOR_MAX_SCORE}</span>
        </header>

        {phase === 'reveal' && (
          <section
            className={`dc-phase dc-phase-reveal${
              current.mode === 'toon' ? ' dc-phase-reveal--toon-fs' : ''
            }`}
          >
            {current.mode === 'toon' && focusClipPath ? (
              <>
                <div className={`dc-toon-fs-stage${maskDebugActive ? ' dc-toon-fs-stage--lab' : ''}`}>
                  {wrapPortraitViewport(
                    renderToonVisual({
                      focusClipPath,
                      frameClassName: maskDebugActive ? undefined : 'dc-toon-frame--fs',
                      lockedPlacement,
                      maskMode,
                      maskSrc,
                      portraitSrc: current.prompt.imageSrc,
                      showFocusHint: !lockedPlacement,
                      tintColor: lockedPlacement ? current.target : undefined,
                      useCanvasMask: false,
                    }),
                    current.prompt.imageSrc,
                    maskDebugActive,
                    'dc-portrait-viewport--reveal',
                  )}
                  <div
                    className={`dc-toon-fs-callout${maskDebugActive ? ' dc-toon-fs-callout--lab-float' : ''}`}
                  >
                    <p className="dc-toon-fs-callout-kicker">Observe bien</p>
                    <p className="dc-toon-fs-callout-prompt">{current.prompt.promptFr}</p>
                    <div
                      className="dc-toon-fs-callout-swatch"
                      style={{ background: hsbToCss(current.target) }}
                    />
                    {maskTag && <p className="dc-toon-fs-callout-tag">{maskTag}</p>}
                  </div>
                </div>
                {!maskDebugActive && (
                  <p className="dc-hint">Mémorise cette teinte — elle va disparaître…</p>
                )}
              </>
            ) : (
              <>
                <p className="dc-phase-title">Mémorise…</p>
                <p className="dc-prompt">Cinq teintes — retiens celle-ci.</p>
                <div
                  className="dc-swatch dc-swatch-hero"
                  style={{ background: hsbToCss(current.target) }}
                />
                <p className="dc-hint">La couleur va disparaître…</p>
              </>
            )}
          </section>
        )}

        {phase === 'recall' && (
          <section
            className={`dc-phase dc-phase-recall${
              current.mode === 'toon' ? ' dc-phase-recall--toon' : ''
            }`}
          >
            <p className="dc-phase-title">{maskDebugActive ? 'Ajuste la teinte' : 'Recrée la teinte de mémoire'}</p>
            {current.mode === 'toon' && focusClipPath ? (
              <div className={`dc-recall-dialed${maskDebugActive ? ' dc-recall-dialed--lab' : ''}`}>
                <aside className="dc-recall-dialed-rail">
                  <DialedHsbSliders value={guess} onChange={setGuess} />
                  <div className="dc-preview-col dc-preview-col--rail">
                    <span className="dc-preview-label">Ta teinte</span>
                    <div className="dc-swatch dc-swatch-preview" style={{ background: hsbToCss(guess) }} />
                    <p className="dc-hsb-label">
                      H {Math.round(guess.h)} · S {Math.round(guess.s)}% · B {Math.round(guess.b)}%
                    </p>
                  </div>
                  {maskDebugActive && (
                    <button className="primary dc-submit dc-submit--rail" type="button" onClick={submitGuess}>
                      Valider
                    </button>
                  )}
                </aside>
                <div className="dc-recall-dialed-stage">
                  {!maskDebugActive && (
                    <p className="dc-prompt dc-prompt-recall">{current.prompt.promptFr}</p>
                  )}
                  {wrapPortraitViewport(
                    renderToonVisual({
                      focusClipPath,
                      frameClassName: 'dc-toon-frame--recall-large',
                      lockedPlacement,
                      maskMode,
                      maskSrc,
                      opaqueAlignedTint: Boolean(lockedPlacement),
                      portraitSrc: current.prompt.imageSrc,
                      tintColor: lockedPlacement || maskSrc ? guess : undefined,
                      useCanvasMask: false,
                    }),
                    current.prompt.imageSrc,
                    maskDebugActive,
                  )}
                  {maskDebugActive && (lockedPlacement || maskSrc) && (
                    <p className="dc-hint dc-hint-tint">{tintHint}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="dc-recall-layout">
                <div className="dc-preview-col">
                  <span className="dc-preview-label">Ta teinte</span>
                  <div className="dc-swatch dc-swatch-preview" style={{ background: hsbToCss(guess) }} />
                  <p className="dc-hsb-label">
                    H {Math.round(guess.h)} · S {Math.round(guess.s)}% · B {Math.round(guess.b)}%
                  </p>
                </div>
                <div className="dc-sliders">
                  <DialedHsbSliders layout="horizontal" value={guess} onChange={setGuess} />
                </div>
              </div>
            )}
            {!maskDebugActive && (
              <button className="primary dc-submit" type="button" onClick={submitGuess}>
                Valider
              </button>
            )}
          </section>
        )}

        {phase === 'feedback' && (
          <section className="dc-phase dc-phase-feedback">
            <p className="dc-phase-title">Manche · {lastRoundScore.toFixed(2)} / 10</p>
            <div className="dc-compare">
              <div className="dc-compare-cell">
                <span>Cible</span>
                <div className="dc-swatch" style={{ background: hsbToCss(current.target) }} />
              </div>
              <div className="dc-compare-cell">
                <span>Ta réponse</span>
                <div className="dc-swatch" style={{ background: hsbToCss(guess) }} />
              </div>
            </div>
            <button className="primary dc-submit" type="button" onClick={continueAfterFeedback}>
              {maskDebugActive ? 'Rejouer ce calque' : roundIndex + 1 >= DIALED_COLOR_ROUNDS ? 'Voir le résultat' : 'Manche suivante'}
            </button>
          </section>
        )}

        {phase === 'done' && !maskDebugActive && (
          <section className="dc-phase dc-phase-done">
            <p className="dc-phase-title">Session terminée</p>
            <p className="dc-final-score">{totalScore.toFixed(2)} / {DIALED_COLOR_MAX_SCORE}</p>
            <p className="dc-hint">Récompense selon ta précision moyenne.</p>
          </section>
        )}
      </div>
      )}
    </MinigameFrame>
  )
}
