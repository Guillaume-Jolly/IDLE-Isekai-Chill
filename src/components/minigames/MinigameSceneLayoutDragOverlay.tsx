import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { MinigameSceneLayerDef, MinigameSceneLayoutCalibration } from '../../data/minigameSceneLayout'
import './MinigameSceneLayoutCalibrator.css'

type MinigameSceneLayoutDragOverlayProps = {
  layers: readonly MinigameSceneLayerDef[]
  calibration: MinigameSceneLayoutCalibration
  activeLayerId?: string
  enabled: boolean
  onChange: (next: MinigameSceneLayoutCalibration) => void
}

export function MinigameSceneLayoutDragOverlay({
  layers,
  calibration,
  activeLayerId,
  enabled,
  onChange,
}: MinigameSceneLayoutDragOverlayProps) {
  const dragRef = useRef<{
    layerId: string
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const host = (event.target as HTMLElement).closest('.mg-scene-layout-drag-overlay')
      if (!host || !(host instanceof HTMLElement)) return
      const rect = host.getBoundingClientRect()
      const dx = ((event.clientX - drag.startX) / rect.width) * 100
      const dy = ((event.clientY - drag.startY) / rect.height) * 100
      const current = calibration[drag.layerId] ?? { x: 0, y: 0, scale: 1, rotate: 0 }
      onChange({
        ...calibration,
        [drag.layerId]: {
          ...current,
          x: drag.originX + dx,
          y: drag.originY + dy,
        },
      })
    },
    [calibration, onChange],
  )

  const endDrag = useCallback(() => {
    dragRef.current = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('pointercancel', endDrag)
  }, [onPointerMove])

  useEffect(() => () => endDrag(), [endDrag])

  if (!enabled || !import.meta.env.DEV) return null

  return (
    <div aria-hidden className="mg-scene-layout-drag-overlay">
      {layers.map((layer) => {
        const transform = calibration[layer.id] ?? { x: 0, y: 0, scale: 1, rotate: 0 }
        const anchorX = 50 + transform.x
        const anchorY = 50 + transform.y
        return (
          <button
            className={`mg-scene-layout-drag-handle${activeLayerId === layer.id ? ' active' : ''}`}
            key={layer.id}
            style={{ left: `${anchorX}%`, top: `${anchorY}%` }}
            type="button"
            onPointerDown={(event) => {
              event.preventDefault()
              dragRef.current = {
                layerId: layer.id,
                startX: event.clientX,
                startY: event.clientY,
                originX: transform.x,
                originY: transform.y,
              }
              window.addEventListener('pointermove', onPointerMove)
              window.addEventListener('pointerup', endDrag)
              window.addEventListener('pointercancel', endDrag)
            }}
          >
            {layer.label}
          </button>
        )
      })}
    </div>
  )
}

export type MinigameSceneLayoutSceneProps = {
  children: ReactNode
  dragOverlay?: ReactNode
  className?: string
}

export function MinigameSceneLayoutScene({ children, dragOverlay, className = '' }: MinigameSceneLayoutSceneProps) {
  return (
    <div className={`mg-scene-layout-scene ${className}`.trim()}>
      {children}
      {dragOverlay}
    </div>
  )
}
