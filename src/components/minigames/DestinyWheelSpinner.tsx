import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  buildSuspenseLandingPlan,
  countSegmentBoundaryCrossings,
  decayFlapDeflection,
  describeWheelSlice,
  describeWheelAnnularSlice,
  describeWheelArc,
  describeWheelRadialLine,
  flapImpulseDeg,
  polarToCartesian,
  segmentAtPointerRotation,
  segmentBoundaryAngles,
  unwrapRotationContinuity,
  type WheelSegment,
} from '../../data/destinyWheel/wheelSegments'
import { planWheelLabels, labelZoneArcRadius, computeSegmentLabelZone } from '../../data/destinyWheel/wheelLabelPlanner'
import type { WheelLabelZoneCalibration } from '../../data/destinyWheel/wheelLabelZoneCalibration.ts'
import {
  DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION,
  labelGlyphClipPad,
  radialTextPathOuterR,
} from '../../data/destinyWheel/wheelLabelZoneCalibration.ts'
import { DISGAEA_WHEEL_UI } from '../../data/destinyWheel/disgaeaWheelTheme.ts'
import { HAVRE_WHEEL_UI } from '../../data/destinyWheel/havreWheelTheme.ts'
import {
  DISGAEA_WHEEL_ASSETS,
  DISGAEA_WHEEL_LAYOUT,
  HAVRE_WHEEL_ASSETS,
  HAVRE_WHEEL_LAYOUT,
  pickWheelTickAsset,
} from '../../data/destinyWheel/wheelVisualAssets.ts'
import {
  calibrationLayerTransform,
  createDefaultDisgaeaWheelCalibration,
  type DisgaeaWheelCalLayer,
  type DisgaeaWheelLayoutCalibration,
} from '../../data/destinyWheel/disgaeaWheelLayoutCalibration.ts'
import { createDefaultHavreWheelCalibration } from '../../data/destinyWheel/havreWheelLayoutCalibration.ts'
import type { SceneCalLayer } from '../../data/destinyWheel/destinyWheelSceneLayoutCalibration.ts'
import {
  animateRotationWithPegSnag,
} from './destinyWheelSpinnerPhysics'

export type WheelVisualTheme = 'default' | 'disgaea' | 'havre'

type Props = {
  segments: WheelSegment[]
  winIndex: number | null
  spinning: boolean
  landed: boolean
  resetToken: number
  visualTheme?: WheelVisualTheme
  interactive?: boolean
  spinDurationMs?: number
  spinEasing?: string
  spinExtraRotations?: [number, number]
  onSpinEnd?: () => void
  onSpinFault?: (message: string) => void
  onPointerSegment?: (segment: WheelSegment | null) => void
  onSegmentCross?: (speedDegPerFrame: number, tickIndex: number) => void
  onFlickSpin?: () => void
  allowFlickSpin?: boolean
  disgaeaCalibration?: DisgaeaWheelLayoutCalibration
  /** Calibration calques frame/disc (Disgaea ou Havre). Alias historique : disgaeaCalibration. */
  wheelAssetsCalibration?: DisgaeaWheelLayoutCalibration
  hintLayer?: SceneCalLayer
  devHintPreview?: boolean
  labelZoneCalibration?: WheelLabelZoneCalibration
  showLabelZoneOverlay?: boolean
}

const CX = 200
const CY = 200
const R = 182
const PEG_OUTER_R = R + 11
const PEG_INNER_R = R - 1
/** Alignement repère ↔ taquets (viewBox 400, taquet haut ≈ 1.75 %). */
const POINTER_TIP_OFFSET_PX = 36
const POINTER_TIP_VIEWBOX_Y = ((CY - PEG_OUTER_R + 1.2) / 400) * 100
const DEFAULT_SPIN_MS = 5200
const DEFAULT_SPIN_EASING = 'cubic-bezier(0.04, 0.78, 0.06, 1)'
const FLICK_MIN_VELOCITY = 3.2
const FLICK_WEAK_MIN_VELOCITY = 1.05
const FLICK_MIN_DRAG_SWEEP = 10
const FRICTION = 0.978
const MIN_VELOCITY = 0.05
const FLICK_VELOCITY_GAIN = 1.65
/** Degrés par pixel de scroll (trackpad / molette). */
const SCROLL_WHEEL_DEG_PER_PX = 0.2
/** Au-delà : saut / reset — pas de ticks taquets (évite centaines de crossings). */
const MAX_CONTINUOUS_SPIN_DELTA = 100

export function DestinyWheelSpinner({
  segments,
  winIndex,
  spinning,
  landed,
  resetToken,
  visualTheme = 'default',
  interactive = true,
  spinDurationMs = DEFAULT_SPIN_MS,
  spinEasing = DEFAULT_SPIN_EASING,
  spinExtraRotations = [5, 7],
  onSpinEnd,
  onSpinFault,
  onPointerSegment,
  onSegmentCross,
  onFlickSpin,
  allowFlickSpin = true,
  disgaeaCalibration,
  wheelAssetsCalibration: wheelAssetsCalibrationProp,
  hintLayer,
  devHintPreview = false,
  labelZoneCalibration,
  showLabelZoneOverlay = false,
}: Props) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [flickFeedback, setFlickFeedback] = useState<string | null>(null)
  const wheelRef = useRef<SVGGElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointerSegmentRef = useRef<WheelSegment | null>(null)
  const rotationRef = useRef(0)
  const lastEmittedRotationRef = useRef(0)
  const lastEmittedAtRef = useRef(0)
  const spinUnwrappedRotationRef = useRef(0)
  const dragStartRotationRef = useRef(0)
  const flickFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const velocityRef = useRef(0)
  const dragLastAngleRef = useRef(0)
  const dragPointerIdRef = useRef<number | null>(null)
  const motionSamplesRef = useRef<{ t: number; rotation: number }[]>([])
  const coastRafRef = useRef(0)
  const coastLastTsRef = useRef(0)
  const suspensePlanRef = useRef<ReturnType<typeof buildSuspenseLandingPlan> | null>(null)
  const suspenseRunningRef = useRef(false)
  const spinEndFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const kickPulseRef = useRef(0)
  const kickRafRef = useRef(0)
  const flapDeflectRef = useRef(0)
  const spinDirectionRef = useRef<1 | -1>(-1)
  const emitSegmentRef = useRef<(deg: number, playTicks?: boolean) => void>(() => {})
  const spinSessionRef = useRef(0)
  const activeFinishSessionRef = useRef(-1)
  const onSpinEndRef = useRef(onSpinEnd)
  const onSpinFaultRef = useRef(onSpinFault)
  const [flapDeflect, setFlapDeflect] = useState(0)
  const [isCreepPhase, setIsCreepPhase] = useState(false)
  const isDisgaea = visualTheme === 'disgaea'
  const isHavre = visualTheme === 'havre'
  const useWheelAssets = isDisgaea || isHavre
  const packLayout = isHavre ? HAVRE_WHEEL_LAYOUT : DISGAEA_WHEEL_LAYOUT
  const packAssets = isHavre ? HAVRE_WHEEL_ASSETS : DISGAEA_WHEEL_ASSETS
  const usePointerAssets = useWheelAssets && packLayout.pointer != null
  const useTickAssets = useWheelAssets && packLayout.tick != null
  const wheelAssetsCalibration = wheelAssetsCalibrationProp ?? disgaeaCalibration
  const cal = useMemo(
    () =>
      wheelAssetsCalibration ??
      (isHavre ? createDefaultHavreWheelCalibration() : createDefaultDisgaeaWheelCalibration()),
    [isHavre, wheelAssetsCalibration],
  )
  const wheelVisualOffset = useWheelAssets ? cal.disc.rotate : 0
  const wheelTick = useMemo(
    () =>
      useTickAssets
        ? pickWheelTickAsset(isHavre ? 'havre' : 'disgaea', segments.length)
        : null,
    [isHavre, segments.length, useTickAssets],
  )
  const gradientId = useId().replace(/:/g, '')
  const canInteract = interactive && !spinning && !landed

  const calLayerStyle = useCallback(
    (layer: DisgaeaWheelCalLayer, origin = '50% 50%'): CSSProperties => ({
      transform: calibrationLayerTransform(layer),
      transformOrigin: origin,
    }),
    [],
  )

  const calLayerStyleNoRotate = useCallback(
    (layer: DisgaeaWheelCalLayer, origin = '50% 50%'): CSSProperties => ({
      transform: `translate(${layer.x}%, ${layer.y}%) scale(${layer.scale})`,
      transformOrigin: origin,
    }),
    [],
  )

  const showFlickFeedback = useCallback((message: string) => {
    if (flickFeedbackTimerRef.current) clearTimeout(flickFeedbackTimerRef.current)
    setFlickFeedback(message)
    flickFeedbackTimerRef.current = setTimeout(() => {
      setFlickFeedback(null)
      flickFeedbackTimerRef.current = null
    }, 2400)
  }, [])

  useEffect(
    () => () => {
      if (flickFeedbackTimerRef.current) clearTimeout(flickFeedbackTimerRef.current)
    },
    [],
  )

  const emitSegment = useCallback(
    (deg: number, playTicks = true) => {
      const physicsDeg = deg + wheelVisualOffset
      const prevRot = lastEmittedRotationRef.current
      const prevPhysics = prevRot + wheelVisualOffset
      const now = performance.now()
      const delta = deg - prevRot
      const elapsed = lastEmittedAtRef.current > 0 ? Math.max(1, now - lastEmittedAtRef.current) : 16.667
      const speedDegPerFrame =
        Math.abs(delta) < MAX_CONTINUOUS_SPIN_DELTA ? (delta / elapsed) * 16.667 : 0

      if (Math.abs(delta) > 0.02 && Math.abs(delta) < MAX_CONTINUOUS_SPIN_DELTA) {
        spinDirectionRef.current = delta >= 0 ? 1 : -1
      }

      lastEmittedRotationRef.current = deg
      lastEmittedAtRef.current = now

      let crossings = 0
      if (playTicks && Math.abs(delta) > 0.02 && Math.abs(delta) < MAX_CONTINUOUS_SPIN_DELTA) {
        crossings = countSegmentBoundaryCrossings(segments, prevPhysics, physicsDeg)
        if (crossings > 0) {
          for (let i = 0; i < crossings; i += 1) {
            onSegmentCross?.(speedDegPerFrame, i)
          }
          const impulse = flapImpulseDeg(speedDegPerFrame, spinDirectionRef.current)
          const stacked = impulse * (1 + Math.min(2, (crossings - 1) * 0.35))
          flapDeflectRef.current = stacked
          setFlapDeflect(stacked)
          kickPulseRef.current += crossings
          if (!kickRafRef.current) {
            kickRafRef.current = requestAnimationFrame(() => {
              kickRafRef.current = 0
              kickPulseRef.current = 0
            })
          }
        }
      }

      if (Math.abs(delta) < MAX_CONTINUOUS_SPIN_DELTA && crossings === 0) {
        const decayed = decayFlapDeflection(flapDeflectRef.current, elapsed, isCreepPhase)
        if (decayed !== flapDeflectRef.current) {
          flapDeflectRef.current = decayed
          setFlapDeflect(decayed)
        }
      } else if (Math.abs(delta) >= MAX_CONTINUOUS_SPIN_DELTA && flapDeflectRef.current !== 0) {
        flapDeflectRef.current = 0
        setFlapDeflect(0)
      }

      const active = segmentAtPointerRotation(segments, physicsDeg)
      if (active?.item.id !== pointerSegmentRef.current?.item.id) {
        pointerSegmentRef.current = active
        onPointerSegment?.(active)
      }
    },
    [isCreepPhase, onPointerSegment, onSegmentCross, segments, wheelVisualOffset],
  )

  emitSegmentRef.current = emitSegment
  onSpinEndRef.current = onSpinEnd
  onSpinFaultRef.current = onSpinFault

  const completeSpin = useCallback((faultMessage?: string) => {
    if (faultMessage) onSpinFaultRef.current?.(faultMessage)
    onSpinEndRef.current?.()
  }, [])

  const applyRotation = useCallback(
    (next: number) => {
      rotationRef.current = next
      setRotation(next)
      emitSegment(next)
    },
    [emitSegment],
  )

  const stopCoast = useCallback(() => {
    if (coastRafRef.current) {
      cancelAnimationFrame(coastRafRef.current)
      coastRafRef.current = 0
    }
    velocityRef.current = 0
  }, [])

  useEffect(() => {
    stopCoast()
    spinSessionRef.current += 1
    if (spinEndFallbackRef.current) {
      clearTimeout(spinEndFallbackRef.current)
      spinEndFallbackRef.current = null
    }
    suspensePlanRef.current = null
    suspenseRunningRef.current = false
    setIsCreepPhase(false)
    rotationRef.current = 0
    spinUnwrappedRotationRef.current = 0
    velocityRef.current = 0
    lastEmittedRotationRef.current = 0
    lastEmittedAtRef.current = 0
    pointerSegmentRef.current = null
    flapDeflectRef.current = 0
    setFlapDeflect(0)
    const node = wheelRef.current
    if (node) {
      node.style.transition = 'none'
      node.style.transform = 'rotate(0deg)'
    }
    setRotation(0)
    emitSegmentRef.current(0, false)
  }, [resetToken, stopCoast])

  const runSuspenseFinish = useCallback(async () => {
    if (suspenseRunningRef.current) return
    const finishSession = activeFinishSessionRef.current
    if (finishSession !== spinSessionRef.current) return
    if (spinEndFallbackRef.current) {
      clearTimeout(spinEndFallbackRef.current)
      spinEndFallbackRef.current = null
    }
    const plan = suspensePlanRef.current
    if (!plan) {
      completeSpin('La roue a terminé sans plan de repos — résultat récupéré si possible.')
      return
    }

    suspenseRunningRef.current = true
    setIsCreepPhase(true)
    const node = wheelRef.current
    if (node) node.style.transition = 'none'

    const from = rotationRef.current

    if (!plan.pegBounce) {
      lastEmittedRotationRef.current = plan.restTarget
      suspenseRunningRef.current = false
      setIsCreepPhase(false)
      if (finishSession === spinSessionRef.current) completeSpin()
      return
    }

    const creepDelta = Math.abs(plan.pegBounce.creepTarget - from)
    const creepMs = Math.min(520, Math.max(220, creepDelta * 48))

    await animateRotationWithPegSnag(
      from,
      plan.pegBounce.creepTarget,
      creepMs,
      (prevPhysics, nextPhysics) =>
        countSegmentBoundaryCrossings(segments, prevPhysics, nextPhysics),
      wheelVisualOffset,
      (deg, _speed, _crossings) => {
        if (finishSession !== spinSessionRef.current) return
        rotationRef.current = deg
        spinUnwrappedRotationRef.current = deg
        setRotation(deg)
        emitSegment(deg)
      },
    )

    if (finishSession !== spinSessionRef.current) {
      suspenseRunningRef.current = false
      setIsCreepPhase(false)
      return
    }

    const settleDelta = Math.abs(plan.pegBounce.settleTarget - plan.pegBounce.creepTarget)
    const settleMs = Math.min(420, Math.max(180, settleDelta * 40))

    await animateRotationWithPegSnag(
      plan.pegBounce.creepTarget,
      plan.pegBounce.settleTarget,
      settleMs,
      (prevPhysics, nextPhysics) =>
        countSegmentBoundaryCrossings(segments, prevPhysics, nextPhysics),
      wheelVisualOffset,
      (deg) => {
        if (finishSession !== spinSessionRef.current) return
        rotationRef.current = deg
        spinUnwrappedRotationRef.current = deg
        setRotation(deg)
        emitSegment(deg, false)
      },
    )

    if (finishSession !== spinSessionRef.current) {
      suspenseRunningRef.current = false
      setIsCreepPhase(false)
      return
    }

    lastEmittedRotationRef.current = plan.pegBounce.settleTarget
    suspenseRunningRef.current = false
    setIsCreepPhase(false)
    completeSpin()
  }, [completeSpin, emitSegment])

  useLayoutEffect(() => {
    if (!spinning || winIndex == null || segments.length === 0) return
    stopCoast()
    suspenseRunningRef.current = false
    activeFinishSessionRef.current = spinSessionRef.current
    const segment = segments[winIndex] ?? segments[0]
    const span = Math.max(1, spinExtraRotations[1] - spinExtraRotations[0] + 1)
    const extraSpins = spinExtraRotations[0] + Math.floor(Math.random() * span)
    const plan = buildSuspenseLandingPlan(segment, rotationRef.current, extraSpins, Math.random, wheelVisualOffset)
    suspensePlanRef.current = plan
    spinDirectionRef.current = plan.spinTarget >= rotationRef.current ? 1 : -1
    lastEmittedRotationRef.current = rotationRef.current
    lastEmittedAtRef.current = performance.now()
    spinUnwrappedRotationRef.current = rotationRef.current
    rotationRef.current = plan.spinTarget
    setRotation(plan.spinTarget)
  }, [spinning, winIndex, segments, spinExtraRotations, stopCoast, wheelVisualOffset])

  useEffect(() => {
    const node = wheelRef.current
    if (!node || !spinning) return

    const finishSpin = () => {
      if (activeFinishSessionRef.current !== spinSessionRef.current) return
      if (spinEndFallbackRef.current) {
        clearTimeout(spinEndFallbackRef.current)
        spinEndFallbackRef.current = null
      }
      if (!suspensePlanRef.current) {
        completeSpin('Fin de rotation sans cible — vérifiez le résultat affiché.')
        return
      }
      void runSuspenseFinish()
    }

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'transform') return
      finishSpin()
    }

    node.addEventListener('transitionend', onEnd)
    spinEndFallbackRef.current = setTimeout(finishSpin, spinDurationMs + 450)

    return () => {
      node.removeEventListener('transitionend', onEnd)
      if (spinEndFallbackRef.current) {
        clearTimeout(spinEndFallbackRef.current)
        spinEndFallbackRef.current = null
      }
    }
  }, [spinning, runSuspenseFinish, spinDurationMs, completeSpin])

  useEffect(() => {
    if (!spinning || segments.length === 0) {
      if (!spinning && landed && winIndex != null) {
        const winner = segments[winIndex] ?? null
        if (winner && pointerSegmentRef.current?.item.id !== winner.item.id) {
          pointerSegmentRef.current = winner
          onPointerSegment?.(winner)
        }
      }
      return
    }

    let frame = 0
    const tick = () => {
      const node = wheelRef.current
      if (!node) return
      const computed = window.getComputedStyle(node).transform
      const match = computed.match(/matrix\(([^)]+)\)/)
      let deg = spinUnwrappedRotationRef.current
      if (match) {
        const parts = match[1].split(',').map((value) => Number.parseFloat(value.trim()))
        if (parts.length >= 4) {
          const matrixDeg = (Math.atan2(parts[1], parts[0]) * 180) / Math.PI
          const cssTotal = unwrapRotationContinuity(
            spinUnwrappedRotationRef.current + wheelVisualOffset,
            matrixDeg,
          )
          deg = cssTotal - wheelVisualOffset
          spinUnwrappedRotationRef.current = deg
        }
      }
      emitSegment(deg)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [spinning, landed, segments, winIndex, emitSegment, onPointerSegment])

  const startCoast = useCallback(() => {
    stopCoast()
    if (Math.abs(velocityRef.current) < MIN_VELOCITY) return

    const step = (ts: number) => {
      if (!coastLastTsRef.current) coastLastTsRef.current = ts
      const dt = Math.min(32, ts - coastLastTsRef.current) / 16.667
      coastLastTsRef.current = ts

      velocityRef.current *= Math.pow(FRICTION, dt)
      if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
        velocityRef.current = 0
        coastRafRef.current = 0
        coastLastTsRef.current = 0
        return
      }

      applyRotation(rotationRef.current + velocityRef.current * dt)
      coastRafRef.current = requestAnimationFrame(step)
    }

    coastLastTsRef.current = 0
    coastRafRef.current = requestAnimationFrame(step)
  }, [applyRotation, stopCoast])

  const recordMotionSample = useCallback(() => {
    const now = performance.now()
    const samples = motionSamplesRef.current
    samples.push({ t: now, rotation: rotationRef.current })
    while (samples.length > 0 && now - samples[0].t > 180) samples.shift()
  }, [])

  const estimateReleaseVelocity = useCallback(() => {
    const samples = motionSamplesRef.current
    if (samples.length < 2) return 0
    const first = samples[0]
    const last = samples[samples.length - 1]
    const dt = last.t - first.t
    if (dt <= 0) return 0
    return ((last.rotation - first.rotation) / dt) * 16.667 * FLICK_VELOCITY_GAIN
  }, [])

  const pointerAngleFromClient = useCallback((clientX: number, clientY: number) => {
    const stage = stageRef.current
    if (!stage) return 0
    const rect = stage.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = clientX - cx
    const dy = clientY - cy
    return (Math.atan2(dx, -dy) * 180) / Math.PI
  }, [])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!canInteract || event.button !== 0) return
      stopCoast()
      dragStartRotationRef.current = rotationRef.current
      dragPointerIdRef.current = event.pointerId
      setIsDragging(true)
      motionSamplesRef.current = []
      dragLastAngleRef.current = pointerAngleFromClient(event.clientX, event.clientY)
      recordMotionSample()
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [canInteract, pointerAngleFromClient, recordMotionSample, stopCoast],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!canInteract || dragPointerIdRef.current !== event.pointerId) return
      const angle = pointerAngleFromClient(event.clientX, event.clientY)
      let delta = angle - dragLastAngleRef.current
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360
      dragLastAngleRef.current = angle
      applyRotation(rotationRef.current + delta)
      recordMotionSample()
    },
    [applyRotation, canInteract, pointerAngleFromClient, recordMotionSample],
  )

  const finishPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragPointerIdRef.current !== event.pointerId) return
      dragPointerIdRef.current = null
      setIsDragging(false)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      velocityRef.current = estimateReleaseVelocity()
      motionSamplesRef.current = []
      const releaseSpeed = Math.abs(velocityRef.current)
      const dragSweep = Math.abs(rotationRef.current - dragStartRotationRef.current)
      const attemptedLaunch = dragSweep >= FLICK_MIN_DRAG_SWEEP || releaseSpeed >= FLICK_WEAK_MIN_VELOCITY

      if (releaseSpeed >= FLICK_MIN_VELOCITY && onFlickSpin) {
        velocityRef.current = 0
        if (allowFlickSpin) {
          onFlickSpin()
          return
        }
        showFlickFeedback('Mode free spin — utilise le bouton Tourner')
        startCoast()
        return
      }

      if (
        attemptedLaunch &&
        releaseSpeed >= FLICK_WEAK_MIN_VELOCITY &&
        releaseSpeed < FLICK_MIN_VELOCITY
      ) {
        showFlickFeedback('Lancement détecté — flic plus fort !')
      }

      startCoast()
    },
    [allowFlickSpin, estimateReleaseVelocity, onFlickSpin, showFlickFeedback, startCoast],
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !canInteract) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      stopCoast()

      let delta = event.deltaY
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16
      else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= stage.clientHeight

      applyRotation(rotationRef.current + delta * SCROLL_WHEEL_DEG_PER_PX)
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [applyRotation, canInteract, stopCoast])

  useEffect(() => () => stopCoast(), [stopCoast])

  const highlightIndex = landed && winIndex != null ? winIndex : null
  const labelPlans = useMemo(
    () => planWheelLabels(segments, highlightIndex, labelZoneCalibration),
    [segments, highlightIndex, labelZoneCalibration],
  )

  const pegAngles = useMemo(() => segmentBoundaryAngles(segments), [segments])

  const wheelSpinStyle = useMemo(
    () => ({
      transform: `rotate(${rotation + wheelVisualOffset}deg)`,
      transition: spinning && !isCreepPhase ? undefined : ('none' as const),
      transitionDuration: spinning && !isCreepPhase ? `${spinDurationMs}ms` : undefined,
      transitionTimingFunction: spinning && !isCreepPhase ? spinEasing : undefined,
    }),
    [isCreepPhase, rotation, spinDurationMs, spinEasing, spinning, wheelVisualOffset],
  )

  const renderTickSprites = () => {
    if (!wheelTick) return null
    return pegAngles.map((angle, index) => {
      const base = polarToCartesian(CX, CY, wheelTick.anchorR, angle)
      return (
        <image
          key={`peg-${index}-${angle}`}
          href={wheelTick.src}
          width={wheelTick.width}
          height={wheelTick.height}
          transform={`translate(${base.x} ${base.y}) rotate(${angle}) translate(${-wheelTick.width / 2} ${-wheelTick.height})`}
          className="dw-spinner-tick-sprite"
        />
      )
    })
  }

  if (segments.length === 0) {
    return <div className="dw-spinner dw-spinner--empty">Aucun segment éligible</div>
  }

  return (
    <div
      className={[
        'dw-spinner',
        isDisgaea && 'dw-spinner--disgaea',
        isHavre && 'dw-spinner--havre',
        useWheelAssets && 'dw-spinner--wheel-assets',
        useWheelAssets && isDisgaea && 'dw-spinner--disgaea-assets',
        useWheelAssets && isHavre && 'dw-spinner--havre-assets',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        usePointerAssets
          ? ({
              ['--dw-frame-scale' as string]: `${cal.frame.scale * 100}%`,
              ['--dw-pointer-fixed-w' as string]: `${packLayout.pointer.fixedWidthPct}%`,
              ['--dw-pointer-mobile-w-ratio' as string]: `${cal.pointerMobile.widthRatio}`,
              ['--dw-pointer-mobile-top-on-fixed' as string]: `${cal.pointerMobile.topOnFixedPct}%`,
              ['--dw-pointer-mobile-hinge-y' as string]: `${cal.pointerMobile.hingeY}%`,
            } as CSSProperties)
          : useWheelAssets
            ? ({
                ['--dw-frame-scale' as string]: `${cal.frame.scale * 100}%`,
              } as CSSProperties)
            : undefined
      }
    >
      <div
        ref={stageRef}
        className={[
          'dw-spinner-stage',
          canInteract ? 'dw-spinner-stage--interactive' : '',
          isDragging ? 'dw-spinner-stage--dragging' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
      >
        {usePointerAssets ? null : (
          <div
            className="dw-spinner-pointer"
            style={{
              ['--dw-pointer-tip-y' as string]: `${POINTER_TIP_VIEWBOX_Y}%`,
              ['--dw-pointer-tip-offset' as string]: `${POINTER_TIP_OFFSET_PX}px`,
            }}
            aria-hidden
          >
            <span className="dw-spinner-pointer-mount" />
            <span
              className="dw-spinner-pointer-flap"
              style={{ transform: `translateX(-50%) rotate(${flapDeflect.toFixed(2)}deg)` }}
            />
          </div>
        )}
        <div className="dw-cal-layer dw-cal-layer--disc" style={calLayerStyleNoRotate(cal.disc)}>
          <svg viewBox="0 0 400 400" className="dw-spinner-svg dw-spinner-svg--disc" role="img" aria-label="Roue du destin">
          {!useWheelAssets && isDisgaea ? (
            <defs>
              <linearGradient id={`${gradientId}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={DISGAEA_WHEEL_UI.gold} />
                <stop offset="38%" stopColor={DISGAEA_WHEEL_UI.ruby} />
                <stop offset="72%" stopColor={DISGAEA_WHEEL_UI.bordeaux} />
                <stop offset="100%" stopColor={DISGAEA_WHEEL_UI.bg} />
              </linearGradient>
              <radialGradient id={`${gradientId}-hub`} cx="50%" cy="42%" r="58%">
                <stop offset="0%" stopColor={DISGAEA_WHEEL_UI.magenta} stopOpacity="0.35" />
                <stop offset="28%" stopColor={DISGAEA_WHEEL_UI.prune} />
                <stop offset="100%" stopColor={DISGAEA_WHEEL_UI.bg} />
              </radialGradient>
              <radialGradient id={`${gradientId}-glow`} cx="50%" cy="50%" r="50%">
                <stop offset="58%" stopColor="rgba(122, 43, 226, 0)" />
                <stop offset="82%" stopColor="rgba(217, 30, 138, 0.14)" />
                <stop offset="100%" stopColor="rgba(90, 16, 40, 0.32)" />
              </radialGradient>
            </defs>
          ) : null}
          {!useWheelAssets ? (
            <circle cx={CX} cy={CY} r={R + 12} className="dw-spinner-ring" />
          ) : null}
          {!useWheelAssets && isDisgaea ? (
            <circle
              cx={CX}
              cy={CY}
              r={R + 18}
              className="dw-spinner-outer-aura"
              fill={`url(#${gradientId}-glow)`}
            />
          ) : null}
          <g
            ref={wheelRef}
            className={`dw-spinner-wheel${spinning ? ' dw-spinner-wheel--spinning' : ''}${isCreepPhase ? ' dw-spinner-wheel--creep' : ''}`}
            style={wheelSpinStyle}
          >
            <defs>
              {segments.map((segment, index) => {
                const plan = labelPlans.get(segment.item.id)
                if (!plan) return null
                const zoneConfig = labelZoneCalibration ?? DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION
                const pathD =
                  plan.orientation === 'radial'
                    ? describeWheelRadialLine(
                        CX,
                        CY,
                        plan.zone.innerR,
                        radialTextPathOuterR(plan.zone, zoneConfig),
                        plan.pathAngle,
                      )
                    : describeWheelArc(
                        CX,
                        CY,
                        labelZoneArcRadius(plan.zone),
                        plan.zone.startAngle,
                        plan.zone.endAngle,
                      )
                const glyphPad = labelGlyphClipPad(plan.fontSize, zoneConfig)
                return (
                  <g key={`defs-${segment.item.id}`}>
                    <path id={`${gradientId}-label-path-${index}`} d={pathD} fill="none" />
                    <clipPath id={`${gradientId}-label-clip-${index}`}>
                      <path
                        d={describeWheelAnnularSlice(
                          CX,
                          CY,
                          plan.zone.outerR + glyphPad.outer,
                          Math.max(0.5, plan.zone.innerR - glyphPad.inner),
                          plan.zone.startAngle,
                          plan.zone.endAngle,
                        )}
                      />
                    </clipPath>
                  </g>
                )
              })}
            </defs>
            {segments.map((segment, index) => {
              const plan = labelPlans.get(segment.item.id)
              const highlighted = highlightIndex === index
              return (
                <g key={segment.item.id}>
                  <path
                    d={describeWheelSlice(CX, CY, R, segment.startAngle, segment.endAngle)}
                    fill={segment.color}
                    stroke={
                      highlighted
                        ? isDisgaea
                          ? DISGAEA_WHEEL_UI.gold
                          : isHavre
                            ? HAVRE_WHEEL_UI.brass
                            : '#ffd56a'
                        : isDisgaea || isHavre
                          ? 'none'
                          : 'rgba(8, 4, 16, 0.65)'
                    }
                    strokeWidth={highlighted ? 3 : isDisgaea || isHavre ? 0 : 1.4}
                    className={[
                      'dw-spinner-slice',
                      highlighted ? 'dw-spinner-slice--landed' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                  {plan ? (
                    <text
                      clipPath={`url(#${gradientId}-label-clip-${index})`}
                      className={[
                        'dw-spinner-slice-label',
                        plan.orientation === 'radial'
                          ? 'dw-spinner-slice-label--radial'
                          : 'dw-spinner-slice-label--tangent',
                        highlighted ? 'dw-spinner-slice-label--winner' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ fontSize: plan.fontSize }}
                    >
                      <textPath
                        href={`#${gradientId}-label-path-${index}`}
                        startOffset={
                          plan.orientation === 'radial'
                            ? `${labelZoneCalibration?.textPathStartRadialPct ?? 0}%`
                            : `${labelZoneCalibration?.textPathStartTangentPct ?? 2}%`
                        }
                        spacing="auto"
                        {...(plan.shrinkToFit && plan.pathLengthPx != null
                          ? {
                              textLength: plan.pathLengthPx,
                              lengthAdjust: 'spacingAndGlyphs' as const,
                            }
                          : {})}
                      >
                        {plan.text}
                      </textPath>
                    </text>
                  ) : null}
                </g>
              )
            })}
            {showLabelZoneOverlay
              ? segments.map((segment) => {
                  const zone = computeSegmentLabelZone(segment, labelZoneCalibration)
                  return (
                    <path
                      key={`zone-overlay-${segment.item.id}`}
                      d={describeWheelAnnularSlice(
                        CX,
                        CY,
                        zone.outerR,
                        zone.innerR,
                        zone.startAngle,
                        zone.endAngle,
                      )}
                      className="dw-spinner-label-zone-debug"
                      fill="rgba(255, 213, 106, 0.1)"
                      stroke="rgba(255, 213, 106, 0.45)"
                      strokeWidth={0.8}
                    />
                  )
                })
              : null}
            {!useWheelAssets ? (
              <g className="dw-spinner-pegs" aria-hidden>
                {pegAngles.map((angle, index) => {
                  const outer = polarToCartesian(CX, CY, PEG_OUTER_R, angle)
                  const inner = polarToCartesian(CX, CY, PEG_INNER_R, angle)
                  return (
                    <line
                      key={`peg-${index}-${angle}`}
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      className={[
                        'dw-spinner-peg',
                        isDisgaea ? 'dw-spinner-peg--disgaea' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  )
                })}
              </g>
            ) : null}
            {!useWheelAssets ? (
              <circle
                cx={CX}
                cy={CY}
                r={R + 9}
                className="dw-spinner-rim"
                stroke={isDisgaea ? `url(#${gradientId}-rim)` : undefined}
              />
            ) : null}
            {!useWheelAssets && isDisgaea ? (
              <>
                <circle cx={CX} cy={CY} r={R + 14} className="dw-spinner-ornate-ring" />
                <circle cx={CX} cy={CY} r={34} className="dw-spinner-ornate-ring dw-spinner-ornate-ring--inner" />
              </>
            ) : null}
            {!useWheelAssets ? (
              <circle
                cx={CX}
                cy={CY}
                r={26}
                className="dw-spinner-hub"
                fill={isDisgaea ? `url(#${gradientId}-hub)` : undefined}
              />
            ) : null}
            {!useWheelAssets && isDisgaea ? (
              <>
                <circle cx={CX} cy={CY} r={10} className="dw-spinner-hub-gem" />
                <path
                  d={`M ${CX} ${CY - 34} L ${CX + 5} ${CY - 28} L ${CX} ${CY - 22} L ${CX - 5} ${CY - 28} Z`}
                  className="dw-spinner-spike"
                />
                <path
                  d={`M ${CX + 29} ${CY - 17} L ${CX + 24} ${CY - 11} L ${CX + 18} ${CY - 14} L ${CX + 21} ${CY - 20} Z`}
                  className="dw-spinner-spike"
                />
                <path
                  d={`M ${CX - 29} ${CY - 17} L ${CX - 21} ${CY - 20} L ${CX - 18} ${CY - 14} L ${CX - 24} ${CY - 11} Z`}
                  className="dw-spinner-spike"
                />
              </>
            ) : null}
          </g>
        </svg>
        </div>
        {useWheelAssets ? (
          <div className="dw-cal-layer dw-cal-layer--frame" style={calLayerStyle(cal.frame)}>
            <img
              className="dw-spinner-frame"
              src={packAssets.frame}
              alt=""
              draggable={false}
            />
          </div>
        ) : null}
        {useTickAssets ? (
          <div className="dw-cal-layer dw-cal-layer--ticks" style={calLayerStyle(cal.ticks)}>
            <svg viewBox="0 0 400 400" className="dw-spinner-svg dw-spinner-svg--ticks" aria-hidden>
              <g
                className={`dw-spinner-wheel dw-spinner-wheel--ticks${spinning ? ' dw-spinner-wheel--spinning' : ''}${isCreepPhase ? ' dw-spinner-wheel--creep' : ''}`}
                style={wheelSpinStyle}
              >
                <g className="dw-spinner-pegs">{renderTickSprites()}</g>
              </g>
            </svg>
          </div>
        ) : null}
        {usePointerAssets ? (
          <div className="dw-cal-layer dw-cal-layer--pointer" style={calLayerStyle(cal.pointerStack, '50% 0')}>
            <div
              className="dw-spinner-pointer-assets"
              style={{
                ['--dw-flap-deflect' as string]: `${flapDeflect.toFixed(2)}deg`,
              }}
              aria-hidden
            >
              <div className="dw-spinner-pointer-stack">
                <img
                  className="dw-spinner-pointer-fixed"
                  src={packAssets.pointerFixed}
                  alt=""
                  draggable={false}
                />
                <img
                  className="dw-spinner-pointer-mobile"
                  src={packAssets.pointerMobile}
                  alt=""
                  draggable={false}
                  style={{
                    transform: `translate(calc(-50% + ${cal.pointerMobile.x}%), ${cal.pointerMobile.y}%) scale(${cal.pointerMobile.scale}) rotate(calc(${cal.pointerMobile.rotate}deg + var(--dw-flap-deflect, 0deg)))`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
        {canInteract || devHintPreview ? (
          hintLayer?.visible === false && !devHintPreview ? null : (
          <p
            className={[
              'dw-spinner-hint',
              devHintPreview ? 'dw-spinner-hint--dev-preview' : '',
              flickFeedback ? 'dw-spinner-hint--feedback' : '',
              !allowFlickSpin && !flickFeedback ? 'dw-spinner-hint--muted' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={
              hintLayer
                ? {
                    transform: `translate(calc(-50% + ${hintLayer.x}%), ${hintLayer.y}%) scale(${hintLayer.scale}) rotate(${hintLayer.rotate}deg)`,
                  }
                : undefined
            }
          >
            {devHintPreview && !flickFeedback
              ? 'Free spin actif — bouton Tourner pour lancer'
              : flickFeedback ??
                (allowFlickSpin
                  ? 'Glisse et lance la roue · ou bouton Tourner'
                  : 'Free spin actif — bouton Tourner pour lancer')}
          </p>
          )
        ) : null}
      </div>
    </div>
  )
}
