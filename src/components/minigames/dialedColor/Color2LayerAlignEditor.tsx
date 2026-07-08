import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  COLOR2_LAHARL_ALIGN_LAYERS,
  COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID,
  COLOR2_LAHARL_PORTRAIT,
  type Color2AlignLayerDef,
} from '../../../data/dialedColor/color2LayerAlignCatalog'
import {
  loadColor2AlignDocument,
  persistColor2AlignToRepo,
  pxToPct,
  saveColor2AlignDocument,
  sizeToPct,
  type Color2AlignDocument,
  type Color2LayerAlignState,
} from '../../../data/dialedColor/color2LayerAlignStorage'
import {
  computeTwoPointAlign,
  clientToStackCoords,
  stackCoordsToLayerNatural,
  twoPointPhaseLabel,
  type AlignPoint,
  type TwoPointPhase,
} from '../../../data/dialedColor/color2TwoPointAlign'
import { ToonPortraitViewport } from './ToonPortraitViewport'
import { usePortraitViewportZoom } from './portraitViewportZoomContext'

type Color2LayerAlignEditorProps = {
  className?: string
}

type NaturalSize = { w: number; h: number }

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const RESIZE_HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']

const MIN_LAYER_PX = 24

function layerOpacity(kind: Color2AlignLayerDef['kind'], selected: boolean) {
  if (kind === 'overlay') return 1
  return selected ? 0.72 : 0.45
}

function resolveLayerSize(state: Color2LayerAlignState, natural: NaturalSize) {
  const widthPx = state.widthPx > 0 ? state.widthPx : natural.w
  const heightPx = state.heightPx > 0 ? state.heightPx : natural.h
  return { widthPx, heightPx }
}

function getViewportScaleFromEvent(target: EventTarget | null) {
  const stack = target instanceof Element ? target.closest('.dc-layer-align-stack') : null
  const transform = stack?.closest('.dc-portrait-viewport-transform')
  const style = transform ? getComputedStyle(transform) : null
  const matrix = style?.transform
  if (!matrix || matrix === 'none') return 1
  const match = matrix.match(/matrix\(([^)]+)\)/)
  if (!match) return 1
  const parts = match[1].split(',').map((v) => parseFloat(v.trim()))
  return parts[0] || 1
}

function clampSize(value: number) {
  return Math.max(MIN_LAYER_PX, value)
}

function isCornerHandle(handle: ResizeHandle) {
  return handle.length === 2
}

function resizeLayerGeometry(
  handle: ResizeHandle,
  baseW: number,
  baseH: number,
  baseX: number,
  baseY: number,
  dx: number,
  dy: number,
) {
  let nextW = baseW
  let nextH = baseH
  let nextX = baseX
  let nextY = baseY

  if (isCornerHandle(handle)) {
    if (handle.includes('e')) nextW = baseW + dx
    if (handle.includes('w')) nextW = baseW - dx
    if (handle.includes('s')) nextH = baseH + dy
    if (handle.includes('n')) nextH = baseH - dy

    const scaleW = nextW / baseW
    const scaleH = nextH / baseH
    const scale =
      Math.abs(scaleW - 1) >= Math.abs(scaleH - 1)
        ? scaleW
        : scaleH

    nextW = clampSize(baseW * scale)
    nextH = clampSize(baseH * scale)

    if (handle.includes('w')) nextX = baseX + (baseW - nextW)
    if (handle.includes('n')) nextY = baseY + (baseH - nextH)
  } else {
    if (handle.includes('e')) nextW = clampSize(baseW + dx)
    if (handle.includes('w')) {
      nextW = clampSize(baseW - dx)
      nextX = baseX + (baseW - nextW)
    }
    if (handle.includes('s')) nextH = clampSize(baseH + dy)
    if (handle.includes('n')) {
      nextH = clampSize(baseH - dy)
      nextY = baseY + (baseH - nextH)
    }
  }

  return { nextW, nextH, nextX, nextY }
}

function defaultGeometryState(): Pick<
  Color2LayerAlignState,
  'xPx' | 'yPx' | 'xPct' | 'yPct' | 'widthPx' | 'heightPx' | 'widthPct' | 'heightPct' | 'locked'
> {
  return {
    locked: false,
    xPx: 0,
    yPx: 0,
    xPct: 0,
    yPct: 0,
    widthPx: 0,
    heightPx: 0,
    widthPct: 0,
    heightPct: 0,
  }
}

function AlignPickMarker({
  x,
  y,
  kind,
  coord,
}: {
  x: number
  y: number
  kind: 'layer' | 'portrait'
  coord: string
}) {
  const { viewportScale, zoomRatio } = usePortraitViewportZoom()
  const vpInv = 1 / Math.max(viewportScale, 0.001)

  return (
    <span
      aria-hidden
      className={`dc-align-marker dc-align-marker--${kind}`}
      style={
        {
          left: x,
          top: y,
          '--vp-inv': vpInv,
        } as React.CSSProperties
      }
    >
      <span className="dc-align-marker-dot" />
      {zoomRatio >= 1.25 && <span className="dc-align-marker-coord">{coord}</span>}
    </span>
  )
}

export function Color2LayerAlignEditor({ className }: Color2LayerAlignEditorProps) {
  const [doc, setDoc] = useState<Color2AlignDocument>(() => loadColor2AlignDocument())
  const [selectedId, setSelectedId] = useState(COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID)
  const [portraitSize, setPortraitSize] = useState({ w: 1536, h: 1024 })
  const [naturalSizes, setNaturalSizes] = useState<Record<string, NaturalSize>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'repo' | 'error'>('idle')
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    baseXPx: number
    baseYPx: number
    scale: number
  } | null>(null)
  const resizeRef = useRef<{
    pointerId: number
    handle: ResizeHandle
    startX: number
    startY: number
    baseXPx: number
    baseYPx: number
    baseW: number
    baseH: number
    scale: number
  } | null>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const [twoPointPhase, setTwoPointPhase] = useState<TwoPointPhase>('off')
  const [layerPickPoints, setLayerPickPoints] = useState<AlignPoint[]>([])
  const [portraitPickPoints, setPortraitPickPoints] = useState<AlignPoint[]>([])
  const [twoPointError, setTwoPointError] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setPortraitSize({ w: img.naturalWidth, h: img.naturalHeight })
      }
    }
    img.src = doc.portraitSrc || COLOR2_LAHARL_PORTRAIT
  }, [doc.portraitSrc])

  useEffect(() => {
    for (const layer of COLOR2_LAHARL_ALIGN_LAYERS) {
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth <= 0 || img.naturalHeight <= 0) return
        setNaturalSizes((prev) => {
          const current = prev[layer.id]
          if (current?.w === img.naturalWidth && current?.h === img.naturalHeight) return prev
          return { ...prev, [layer.id]: { w: img.naturalWidth, h: img.naturalHeight } }
        })
      }
      img.src = layer.src
    }
  }, [])

  const selected = doc.layers[selectedId]
  const selectedNatural = naturalSizes[selectedId] ?? { w: 0, h: 0 }
  const selectedDisplay = selected
    ? resolveLayerSize(selected, selectedNatural)
    : { widthPx: 0, heightPx: 0 }

  const updateDoc = useCallback((next: Color2AlignDocument) => {
    setDoc(next)
    saveColor2AlignDocument(next)
  }, [])

  const patchLayer = useCallback(
    (layerId: string, patch: Partial<Color2LayerAlignState>, allowWhenLocked = false) => {
      setDoc((prev) => {
        const current = prev.layers[layerId]
        if (!current) return prev
        const geometryKeys = ['xPx', 'yPx', 'xPct', 'yPct', 'widthPx', 'heightPx', 'widthPct', 'heightPct']
        if (
          current.locked &&
          !allowWhenLocked &&
          geometryKeys.some((key) => key in patch)
        ) {
          return prev
        }
        const nextLayer = { ...current, ...patch }
        const next = {
          ...prev,
          layers: { ...prev.layers, [layerId]: nextLayer },
        }
        saveColor2AlignDocument(next)
        return next
      })
    },
    [],
  )

  const setLayerPositionPx = useCallback(
    (layerId: string, xPx: number, yPx: number) => {
      patchLayer(layerId, { xPx, yPx, ...pxToPct(xPx, yPx, portraitSize.w, portraitSize.h) })
    },
    [patchLayer, portraitSize.h, portraitSize.w],
  )

  const setLayerSizePx = useCallback(
    (layerId: string, widthPx: number, heightPx: number, xPx?: number, yPx?: number) => {
      const w = clampSize(widthPx)
      const h = clampSize(heightPx)
      const pos = {
        xPx: xPx ?? doc.layers[layerId]?.xPx ?? 0,
        yPx: yPx ?? doc.layers[layerId]?.yPx ?? 0,
      }
      patchLayer(layerId, {
        widthPx: w,
        heightPx: h,
        ...pos,
        ...pxToPct(pos.xPx, pos.yPx, portraitSize.w, portraitSize.h),
        ...sizeToPct(w, h, portraitSize.w, portraitSize.h),
      })
    },
    [doc.layers, patchLayer, portraitSize.h, portraitSize.w],
  )

  const toggleLock = useCallback(
    async (layerId: string) => {
      const layer = doc.layers[layerId]
      if (!layer) return
      const natural = naturalSizes[layerId] ?? { w: 0, h: 0 }
      const { widthPx, heightPx } = resolveLayerSize(layer, natural)
      const nextLocked = !layer.locked
      const nextLayer: Color2LayerAlignState = {
        ...layer,
        locked: nextLocked,
        widthPx,
        heightPx,
        ...sizeToPct(widthPx, heightPx, portraitSize.w, portraitSize.h),
      }
      const next = {
        ...doc,
        layers: { ...doc.layers, [layerId]: nextLayer },
      }
      updateDoc(next)
      if (nextLocked) {
        setSaveStatus('saved')
        const ok = await persistColor2AlignToRepo(next)
        setSaveStatus(ok ? 'repo' : 'error')
      } else {
        setSaveStatus('idle')
      }
    },
    [doc, naturalSizes, portraitSize.h, portraitSize.w, updateDoc],
  )

  const onLayerPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>, layerId: string) => {
      const layer = doc.layers[layerId]
      if (!layer || layer.locked) return
      event.stopPropagation()
      setSelectedId(layerId)
      const scale = getViewportScaleFromEvent(event.currentTarget)
      event.currentTarget.setPointerCapture(event.pointerId)
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        baseXPx: layer.xPx,
        baseYPx: layer.yPx,
        scale,
      }
    },
    [doc.layers],
  )

  const onLayerPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>, layerId: string) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      const dx = (event.clientX - drag.startX) / drag.scale
      const dy = (event.clientY - drag.startY) / drag.scale
      setLayerPositionPx(layerId, drag.baseXPx + dx, drag.baseYPx + dy)
    },
    [setLayerPositionPx],
  )

  const endLayerDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  const onResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, layerId: string, handle: ResizeHandle) => {
      const layer = doc.layers[layerId]
      const natural = naturalSizes[layerId]
      if (!layer || layer.locked || !natural) return
      event.stopPropagation()
      event.preventDefault()
      setSelectedId(layerId)
      const { widthPx, heightPx } = resolveLayerSize(layer, natural)
      const scale = getViewportScaleFromEvent(event.currentTarget)
      event.currentTarget.setPointerCapture(event.pointerId)
      resizeRef.current = {
        pointerId: event.pointerId,
        handle,
        startX: event.clientX,
        startY: event.clientY,
        baseXPx: layer.xPx,
        baseYPx: layer.yPx,
        baseW: widthPx,
        baseH: heightPx,
        scale,
      }
    },
    [doc.layers, naturalSizes],
  )

  const onResizePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, layerId: string) => {
      const resize = resizeRef.current
      if (!resize || resize.pointerId !== event.pointerId) return
      const dx = (event.clientX - resize.startX) / resize.scale
      const dy = (event.clientY - resize.startY) / resize.scale
      const { nextW, nextH, nextX, nextY } = resizeLayerGeometry(
        resize.handle,
        resize.baseW,
        resize.baseH,
        resize.baseXPx,
        resize.baseYPx,
        dx,
        dy,
      )

      setLayerSizePx(layerId, nextW, nextH, nextX, nextY)
    },
    [setLayerSizePx],
  )

  const endResize = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current
    if (!resize || resize.pointerId !== event.pointerId) return
    resizeRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  const resetSelectedLayer = useCallback(() => {
    patchLayer(selectedId, defaultGeometryState(), true)
    setSaveStatus('idle')
  }, [patchLayer, selectedId])

  const cancelTwoPoint = useCallback(() => {
    setTwoPointPhase('off')
    setLayerPickPoints([])
    setPortraitPickPoints([])
    setTwoPointError(null)
  }, [])

  const startTwoPoint = useCallback(() => {
    if (selected?.locked) return
    setTwoPointPhase('layer-1')
    setLayerPickPoints([])
    setPortraitPickPoints([])
    setTwoPointError(null)
  }, [selected?.locked])

  const applyTwoPointResult = useCallback(
    (
      layerPts: [AlignPoint, AlignPoint],
      portraitPts: [AlignPoint, AlignPoint],
    ) => {
      const natural = naturalSizes[selectedId]
      if (!natural?.w || !natural?.h || !selected) return
      const result = computeTwoPointAlign(
        layerPts[0],
        layerPts[1],
        portraitPts[0],
        portraitPts[1],
        natural.w,
        natural.h,
      )
      if ('error' in result) {
        setTwoPointError(result.error)
        cancelTwoPoint()
        return
      }
      setLayerSizePx(
        selectedId,
        result.widthPx,
        result.heightPx,
        result.xPx,
        result.yPx,
      )
      cancelTwoPoint()
    },
    [cancelTwoPoint, naturalSizes, selected, selectedId, setLayerSizePx],
  )

  const onStackPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (twoPointPhase === 'off' || selected?.locked) return
      if (event.button !== 0) return
      const stack = stackRef.current
      const natural = naturalSizes[selectedId]
      if (!stack || !natural?.w || !selected) return

      const stackPt = clientToStackCoords(event.clientX, event.clientY, stack)
      if (!stackPt) return

      if (twoPointPhase === 'layer-1' || twoPointPhase === 'layer-2') {
        const { widthPx, heightPx } = resolveLayerSize(selected, natural)
        const layerPt = stackCoordsToLayerNatural(
          stackPt.x,
          stackPt.y,
          selected.xPx,
          selected.yPx,
          widthPx,
          heightPx,
          natural.w,
          natural.h,
        )
        if (!layerPt) {
          setTwoPointError('Clique sur le calque sélectionné.')
          return
        }
        event.stopPropagation()
        setTwoPointError(null)
        if (twoPointPhase === 'layer-1') {
          setLayerPickPoints([layerPt])
          setTwoPointPhase('layer-2')
        } else {
          const first = layerPickPoints[0]
          if (!first) return
          setLayerPickPoints([first, layerPt])
          setPortraitPickPoints([])
          setTwoPointPhase('portrait-1')
        }
        return
      }

      if (twoPointPhase === 'portrait-1' || twoPointPhase === 'portrait-2') {
        event.stopPropagation()
        setTwoPointError(null)
        if (twoPointPhase === 'portrait-1') {
          setPortraitPickPoints([stackPt])
          setTwoPointPhase('portrait-2')
        } else {
          const firstPortrait = portraitPickPoints[0]
          if (!firstPortrait || layerPickPoints.length < 2) return
          const portraitPair: [AlignPoint, AlignPoint] = [firstPortrait, stackPt]
          setPortraitPickPoints(portraitPair)
          applyTwoPointResult(layerPickPoints as [AlignPoint, AlignPoint], portraitPair)
        }
      }
    },
    [
      applyTwoPointResult,
      layerPickPoints,
      naturalSizes,
      portraitPickPoints,
      selected,
      selectedId,
      twoPointPhase,
    ],
  )

  const twoPointActive = twoPointPhase !== 'off'
  const hideLayerForPortraitPick =
    twoPointPhase === 'portrait-1' || twoPointPhase === 'portrait-2'

  const visibleLayers = useMemo(
    () => COLOR2_LAHARL_ALIGN_LAYERS.filter((layer) => doc.layers[layer.id]?.visible),
    [doc.layers],
  )

  return (
    <div className={`dc-layer-align${className ? ` ${className}` : ''}`}>
      <aside className="dc-layer-align-panel">
        <p className="dc-debug-title">Debug calques</p>

        <label className="dc-debug-row dc-layer-align-row">
          <input
            checked={doc.baseVisible}
            type="checkbox"
            onChange={(e) => updateDoc({ ...doc, baseVisible: e.target.checked })}
          />
          <span>Portrait Laharl (fond)</span>
        </label>

        <div className="dc-layer-align-list">
          {COLOR2_LAHARL_ALIGN_LAYERS.map((layer) => {
            const state = doc.layers[layer.id]
            const isSelected = selectedId === layer.id
            return (
              <div
                key={layer.id}
                className={`dc-layer-align-item${isSelected ? ' is-selected' : ''}`}
              >
                <label className="dc-layer-align-row">
                  <input
                    checked={state?.visible ?? false}
                    type="checkbox"
                    onChange={(e) =>
                      patchLayer(layer.id, { visible: e.target.checked }, true)
                    }
                  />
                  <button
                    className="dc-layer-align-name"
                    type="button"
                    onClick={() => setSelectedId(layer.id)}
                  >
                    {layer.label}
                  </button>
                  {state?.locked && <span className="dc-layer-align-lock">🔒</span>}
                </label>
              </div>
            )
          })}
        </div>

        {selected && (
          <div className="dc-layer-align-controls">
            <p className="dc-layer-align-subtitle">
              {COLOR2_LAHARL_ALIGN_LAYERS.find((l) => l.id === selectedId)?.label}
            </p>
            <label className="dc-debug-row">
              <span>X px</span>
              <input
                disabled={selected.locked}
                type="range"
                min={-400}
                max={400}
                step={1}
                value={Math.round(selected.xPx)}
                onChange={(e) =>
                  setLayerPositionPx(selectedId, Number(e.target.value), selected.yPx)
                }
              />
              <span className="dc-layer-align-value">{Math.round(selected.xPx)}</span>
            </label>
            <label className="dc-debug-row">
              <span>Y px</span>
              <input
                disabled={selected.locked}
                type="range"
                min={-400}
                max={400}
                step={1}
                value={Math.round(selected.yPx)}
                onChange={(e) =>
                  setLayerPositionPx(selectedId, selected.xPx, Number(e.target.value))
                }
              />
              <span className="dc-layer-align-value">{Math.round(selected.yPx)}</span>
            </label>
            <label className="dc-debug-row">
              <span>Largeur px</span>
              <input
                disabled={selected.locked}
                type="range"
                min={MIN_LAYER_PX}
                max={Math.max(MIN_LAYER_PX, portraitSize.w)}
                step={1}
                value={Math.round(selectedDisplay.widthPx)}
                onChange={(e) =>
                  setLayerSizePx(
                    selectedId,
                    Number(e.target.value),
                    selectedDisplay.heightPx,
                  )
                }
              />
              <span className="dc-layer-align-value">{Math.round(selectedDisplay.widthPx)}</span>
            </label>
            <label className="dc-debug-row">
              <span>Hauteur px</span>
              <input
                disabled={selected.locked}
                type="range"
                min={MIN_LAYER_PX}
                max={Math.max(MIN_LAYER_PX, portraitSize.h)}
                step={1}
                value={Math.round(selectedDisplay.heightPx)}
                onChange={(e) =>
                  setLayerSizePx(
                    selectedId,
                    selectedDisplay.widthPx,
                    Number(e.target.value),
                  )
                }
              />
              <span className="dc-layer-align-value">{Math.round(selectedDisplay.heightPx)}</span>
            </label>
            <button
              className="dc-debug-btn"
              disabled={selected.locked}
              type="button"
              onClick={resetSelectedLayer}
            >
              Réinitialiser calque
            </button>
            {!twoPointActive ? (
              <button
                className="dc-debug-btn"
                disabled={selected.locked || selectedNatural.w <= 0}
                type="button"
                onClick={startTwoPoint}
              >
                Alignement 2 points
              </button>
            ) : (
              <button className="dc-debug-btn" type="button" onClick={cancelTwoPoint}>
                Annuler 2 points
              </button>
            )}
            {twoPointActive && (
              <p className="dc-layer-align-status">{twoPointPhaseLabel(twoPointPhase)}</p>
            )}
            {twoPointError && (
              <p className="dc-layer-align-status dc-layer-align-status--warn">{twoPointError}</p>
            )}
            <button
              className={`dc-debug-btn${selected.locked ? ' is-locked' : ''}`}
              type="button"
              onClick={() => toggleLock(selectedId)}
            >
              {selected.locked ? 'Déverrouiller' : 'Verrouiller & enregistrer'}
            </button>
            {saveStatus === 'repo' && (
              <p className="dc-layer-align-status">Position enregistrée (repo + local).</p>
            )}
            {saveStatus === 'error' && (
              <p className="dc-layer-align-status dc-layer-align-status--warn">
                Sauvé en local — échec écriture repo (dev-api).
              </p>
            )}
            {saveStatus === 'saved' && (
              <p className="dc-layer-align-status">Sauvé en local.</p>
            )}
          </div>
        )}

        <p className="dc-debug-hint">
          Glisse le calque · coins = proportions · <strong>2 points</strong> = 2 clics calque puis 2
          clics portrait. Molette = zoom.
        </p>
      </aside>

      <div className="dc-layer-align-stage">
        <ToonPortraitViewport
          className="dc-portrait-viewport--align"
          contentSize={portraitSize}
          imageSrc={doc.portraitSrc || COLOR2_LAHARL_PORTRAIT}
          maxZoomRatio={80}
        >
          <div
            ref={stackRef}
            className={`dc-layer-align-stack${twoPointActive ? ' is-two-point' : ''}${
              hideLayerForPortraitPick ? ' is-picking-portrait' : ''
            }`}
            style={{ width: portraitSize.w, height: portraitSize.h }}
            onPointerDown={twoPointActive ? onStackPointerDown : undefined}
          >
            {doc.baseVisible && (
              <img
                alt="Laharl"
                className="dc-layer-align-base"
                draggable={false}
                src={doc.portraitSrc || COLOR2_LAHARL_PORTRAIT}
              />
            )}
            {visibleLayers.map((layer) => {
              const state = doc.layers[layer.id]
              const natural = naturalSizes[layer.id]
              if (!state || !natural) return null
              const isSelected = selectedId === layer.id
              if (hideLayerForPortraitPick && isSelected) return null
              const { widthPx, heightPx } = resolveLayerSize(state, natural)
              const pickingLayer = twoPointPhase === 'layer-1' || twoPointPhase === 'layer-2'
              return (
                <div
                  key={layer.id}
                  className={`dc-layer-align-frame${isSelected ? ' is-selected' : ''}${
                    state.locked ? ' is-locked' : ''
                  }${pickingLayer && isSelected ? ' is-picking' : ''}`}
                  style={{
                    height: heightPx,
                    opacity: layerOpacity(layer.kind, isSelected),
                    transform: `translate(${state.xPx}px, ${state.yPx}px)`,
                    width: widthPx,
                  }}
                >
                  <img
                    alt=""
                    aria-hidden
                    className={`dc-layer-align-overlay${
                      layer.kind === 'mask' ? ' is-mask' : ' is-overlay'
                    }`}
                    draggable={false}
                    src={layer.src}
                    style={{
                      pointerEvents:
                        state.locked || twoPointActive ? 'none' : 'auto',
                      cursor: state.locked ? 'default' : twoPointActive ? 'crosshair' : 'grab',
                    }}
                    onPointerCancel={twoPointActive ? undefined : endLayerDrag}
                    onPointerDown={twoPointActive ? undefined : (e) => onLayerPointerDown(e, layer.id)}
                    onPointerMove={twoPointActive ? undefined : (e) => onLayerPointerMove(e, layer.id)}
                    onPointerUp={twoPointActive ? undefined : endLayerDrag}
                  />
                  {isSelected && !state.locked && !twoPointActive && (
                    <div className="dc-layer-align-handles" aria-hidden>
                      {RESIZE_HANDLES.map((handle) => (
                        <button
                          key={handle}
                          className={`dc-layer-align-handle dc-layer-align-handle--${handle}`}
                          type="button"
                          onPointerCancel={endResize}
                          onPointerDown={(e) => onResizePointerDown(e, layer.id, handle)}
                          onPointerMove={(e) => onResizePointerMove(e, layer.id)}
                          onPointerUp={endResize}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            {layerPickPoints.map((pt, index) => {
              const state = doc.layers[selectedId]
              const natural = naturalSizes[selectedId]
              if (!state || !natural) return null
              const { widthPx } = resolveLayerSize(state, natural)
              const scale = widthPx / natural.w
              const stackX = state.xPx + pt.x * scale
              const stackY = state.yPx + pt.y * scale
              return (
                <AlignPickMarker
                  key={`layer-pt-${index}`}
                  coord={`${Math.round(pt.x)}, ${Math.round(pt.y)}`}
                  kind="layer"
                  x={stackX}
                  y={stackY}
                />
              )
            })}
            {portraitPickPoints.map((pt, index) => (
              <AlignPickMarker
                key={`portrait-pt-${index}`}
                coord={`${Math.round(pt.x)}, ${Math.round(pt.y)}`}
                kind="portrait"
                x={pt.x}
                y={pt.y}
              />
            ))}
          </div>
        </ToonPortraitViewport>
      </div>
    </div>
  )
}
