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

  const existing = document.querySelector(`script[data-live2d-core="true"]`)
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

export function Live2DDemo({ onClose }: Live2DDemoProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let destroyed = false
    let app: { destroy: (removeView?: boolean, options?: object) => void } | null = null
    let model: { destroy: () => void } | null = null

    async function boot() {
      try {
        await loadScript(CORE_SCRIPT)
        if (destroyed || !hostRef.current) return

        const PIXI = await import('pixi.js')
        const { Live2DModel } = await import('pixi-live2d-display/cubism4')

        ;(window as Window & { PIXI?: typeof PIXI }).PIXI = PIXI

        const application = new PIXI.Application({
          antialias: true,
          backgroundAlpha: 0,
          resizeTo: hostRef.current,
        })

        hostRef.current.appendChild(application.view as HTMLCanvasElement)

        const live2dModel = await Live2DModel.from(MODEL_PATH, { autoInteract: true })
        if (destroyed) {
          application.destroy(true, { children: true, texture: true, baseTexture: true })
          return
        }

        const scale =
          Math.min(
            application.screen.width / live2dModel.width,
            application.screen.height / live2dModel.height,
          ) * 0.92

        live2dModel.scale.set(scale)
        live2dModel.anchor.set(0.5, 1)
        live2dModel.x = application.screen.width / 2
        live2dModel.y = application.screen.height * 0.98

        application.stage.addChild(live2dModel as unknown as import('pixi.js').DisplayObject)
        app = application
        model = live2dModel
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
      model?.destroy()
      app?.destroy(true, { children: true, texture: true, baseTexture: true })
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

        <div className="live2d-stage" ref={hostRef}>
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
