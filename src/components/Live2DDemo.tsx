import { useEffect, useRef, useState } from 'react'
import './Live2DDemo.css'

declare global {
  interface Window {
    Live2DCubismCore?: unknown
    PIXI?: unknown
  }
}

const MODEL_PATH = '/live2d/haru/Haru.model3.json'
const CORE_SCRIPT = '/live2d/live2dcubismcore.min.js'

type Live2DDemoProps = {
  onClose: () => void
}

function loadScript(src: string): Promise<void> {
  if (window.Live2DCubismCore) {
    return Promise.resolve()
  }

  const existing = document.querySelector('script[data-live2d-core="true"]')
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Cubism core failed')), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.dataset.live2dCore = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Impossible de charger Cubism Core'))
    document.head.appendChild(script)
  })
}

function waitForLayout(element: HTMLElement): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const measure = () => {
      const rect = element.getBoundingClientRect()
      const width = Math.floor(rect.width)
      const height = Math.floor(rect.height)
      if (width > 0 && height > 0) {
        resolve({ width, height })
        return
      }
      requestAnimationFrame(measure)
    }
    requestAnimationFrame(measure)
  })
}

function layoutModel(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  stageWidth: number,
  stageHeight: number,
  startMotion = false,
) {
  const modelWidth = model.internalModel?.width ?? model.width
  const modelHeight = model.internalModel?.height ?? model.height
  if (!modelWidth || !modelHeight) return

  const scale =
    Math.min(stageWidth / modelWidth, stageHeight / modelHeight) * 0.88

  model.scale.set(scale)
  model.anchor.set(0.5, 1)
  model.x = stageWidth / 2
  model.y = stageHeight * 0.97
  if (startMotion) {
    model.motion?.('Idle')
  }
}

function canvasPointFromEvent(
  canvas: HTMLCanvasElement,
  stageWidth: number,
  stageHeight: number,
  event: PointerEvent,
) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * stageWidth,
    y: ((event.clientY - rect.top) / rect.height) * stageHeight,
  }
}

export function Live2DDemo({ onClose }: Live2DDemoProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let destroyed = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let app: any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let live2dModel: any = null
    let resizeObserver: ResizeObserver | null = null
    let canvas: HTMLCanvasElement | null = null

    const handlePointerMove = (event: PointerEvent) => {
      if (!app || !live2dModel || !canvas) return
      const point = canvasPointFromEvent(
        canvas,
        app.screen.width,
        app.screen.height,
        event,
      )
      live2dModel.focus(point.x, point.y)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!app || !live2dModel || !canvas) return
      const point = canvasPointFromEvent(
        canvas,
        app.screen.width,
        app.screen.height,
        event,
      )
      live2dModel.tap(point.x, point.y)
    }

    const handleHit = (areas: string[]) => {
      if (areas.includes('Body')) {
        void live2dModel?.motion('TapBody')
      }
    }

    async function boot() {
      try {
        if (!hostRef.current) return

        await loadScript(CORE_SCRIPT)
        if (destroyed || !hostRef.current) return

        if (!window.Live2DCubismCore) {
          throw new Error('Cubism Core indisponible')
        }

        const PIXI = await import('pixi.js')
        const { Live2DModel, config } = await import('pixi-live2d-display/cubism4')

        config.sound = false
        window.PIXI = PIXI

        const { width, height } = await waitForLayout(hostRef.current)
        if (destroyed || !hostRef.current) return

        const application = new PIXI.Application({
          antialias: true,
          autoDensity: true,
          backgroundAlpha: 0,
          height,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          width,
        })

        canvas = application.view as HTMLCanvasElement
        hostRef.current.replaceChildren(canvas)

        const modelInstance = await Live2DModel.from(MODEL_PATH, { autoInteract: false })
        if (destroyed) {
          application.destroy(true, { children: true, texture: true, baseTexture: true })
          return
        }

        modelInstance.interactive = false
        modelInstance.interactiveChildren = false

        layoutModel(modelInstance, width, height, true)
        modelInstance.on('hit', handleHit)
        application.stage.addChild(modelInstance as never)

        canvas.addEventListener('pointermove', handlePointerMove)
        canvas.addEventListener('pointerdown', handlePointerDown)

        resizeObserver = new ResizeObserver(() => {
          if (!hostRef.current || !app || !live2dModel) return
          const rect = hostRef.current.getBoundingClientRect()
          const nextWidth = Math.floor(rect.width)
          const nextHeight = Math.floor(rect.height)
          if (nextWidth < 1 || nextHeight < 1) return
          app.renderer.resize(nextWidth, nextHeight)
          layoutModel(live2dModel, nextWidth, nextHeight)
        })
        resizeObserver.observe(hostRef.current)

        app = application
        live2dModel = modelInstance
        setStatus('ready')
      } catch (bootError) {
        if (!destroyed) {
          setStatus('error')
          setError(bootError instanceof Error ? bootError.message : 'Erreur Live2D')
        }
      }
    }

    void boot()

    return () => {
      destroyed = true
      resizeObserver?.disconnect()
      canvas?.removeEventListener('pointermove', handlePointerMove)
      canvas?.removeEventListener('pointerdown', handlePointerDown)
      try {
        live2dModel?.off('hit', handleHit)
        live2dModel?.destroy()
      } catch {
        /* ignore teardown errors */
      }
      try {
        app?.destroy(true, { children: true, texture: true, baseTexture: true })
      } catch {
        /* ignore teardown errors */
      }
      hostRef.current?.replaceChildren()
      canvas = null
    }
  }, [])

  return (
    <div className="live2d-overlay" role="dialog" aria-modal="true" aria-label="Demo Live2D">
      <div className="live2d-panel">
        <header className="live2d-head">
          <div>
            <p className="eyebrow">Test technique</p>
            <h3>Live2D — Haru (modele officiel gratuit)</h3>
            <p className="live2d-note">
              Ce n est pas Lyra. Demo pour valider le runtime avant un vrai rig compagnon.
            </p>
          </div>
          <button className="live2d-close" type="button" onClick={onClose}>
            Fermer
          </button>
        </header>

        <div className="live2d-stage">
          <div className="live2d-canvas-host" ref={hostRef} />
          {status === 'loading' && <p className="live2d-status">Chargement du modele…</p>}
          {status === 'error' && (
            <p className="live2d-status live2d-status-error">
              {error || 'Echec du chargement Live2D.'}
            </p>
          )}
        </div>

        {status === 'ready' && (
          <p className="live2d-hint">Deplace la souris ou clique sur le personnage.</p>
        )}
      </div>
    </div>
  )
}
