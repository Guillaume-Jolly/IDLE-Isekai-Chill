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
  model: {
    width: number
    height: number
    scale: { set: (value: number) => void }
    anchor: { set: (x: number, y: number) => void }
    x: number
    y: number
    motion?: (group: string) => void
  },
  stageWidth: number,
  stageHeight: number,
  startMotion = false,
) {
  const scale =
    Math.min(stageWidth / model.width, stageHeight / model.height) * 0.88

  model.scale.set(scale)
  model.anchor.set(0.5, 1)
  model.x = stageWidth / 2
  model.y = stageHeight * 0.97
  if (startMotion) {
    model.motion?.('Idle')
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

    async function boot() {
      try {
        if (!hostRef.current) return

        await loadScript(CORE_SCRIPT)
        if (destroyed || !hostRef.current) return

        if (!window.Live2DCubismCore) {
          throw new Error('Cubism Core indisponible')
        }

        const PIXI = await import('pixi.js')
        const { Live2DModel } = await import('pixi-live2d-display/cubism4')

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

        hostRef.current.replaceChildren(application.view as HTMLCanvasElement)

        const modelInstance = await Live2DModel.from(MODEL_PATH, { autoInteract: true })
        if (destroyed) {
          application.destroy(true, { children: true, texture: true, baseTexture: true })
          return
        }

        layoutModel(modelInstance, width, height, true)
        application.stage.addChild(modelInstance as never)

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
      try {
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
