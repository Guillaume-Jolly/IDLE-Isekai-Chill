import { useCallback, useMemo, useState } from 'react'
import {
  exportMinigameSceneLayoutJson,
  MINIGAME_SCENE_LAYER_GROUP_LABELS,
  parseMinigameSceneLayoutJson,
  saveMinigameSceneLayoutCalibration,
  type MinigameSceneLayerDef,
  type MinigameSceneLayerGroup,
  type MinigameSceneLayoutCalibration,
  type MinigameSceneLayerTransform,
} from '../../data/minigameSceneLayout'
import './MinigameSceneLayoutCalibrator.css'

type MinigameSceneLayoutCalibratorProps = {
  minigameId: string
  layers: readonly MinigameSceneLayerDef[]
  calibration: MinigameSceneLayoutCalibration
  onChange: (next: MinigameSceneLayoutCalibration) => void
  dragMode?: boolean
  onDragModeChange?: (enabled: boolean) => void
}

type SliderField = keyof Pick<MinigameSceneLayerTransform, 'x' | 'y' | 'scale' | 'rotate'>

const SLIDER_FIELDS: { key: SliderField; label: string; min: number; max: number; step: number }[] = [
  { key: 'x', label: 'X (%)', min: -200, max: 200, step: 0.5 },
  { key: 'y', label: 'Y (%)', min: -200, max: 200, step: 0.5 },
  { key: 'scale', label: 'Scale', min: 0.2, max: 2.5, step: 0.01 },
  { key: 'rotate', label: 'Rotation (°)', min: -180, max: 180, step: 0.5 },
]

const GROUP_ORDER: MinigameSceneLayerGroup[] = ['gameplay', 'interactive', 'decor', 'ui']

export function MinigameSceneLayoutCalibrator({
  minigameId,
  layers,
  calibration,
  onChange,
  dragMode = false,
  onDragModeChange,
}: MinigameSceneLayoutCalibratorProps) {
  const [activeLayerId, setActiveLayerId] = useState(layers[0]?.id ?? '')
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const layersByGroup = useMemo(() => {
    const map = new Map<MinigameSceneLayerGroup, MinigameSceneLayerDef[]>()
    for (const layer of layers) {
      const list = map.get(layer.group) ?? []
      list.push(layer)
      map.set(layer.group, list)
    }
    return map
  }, [layers])

  const activeLayer = layers.find((layer) => layer.id === activeLayerId) ?? layers[0]
  const activeTransform = activeLayer
    ? (calibration[activeLayer.id] ?? { x: 0, y: 0, scale: 1, rotate: 0 })
    : { x: 0, y: 0, scale: 1, rotate: 0 }

  const updateField = useCallback(
    (layerId: string, field: SliderField, value: number) => {
      onChange({
        ...calibration,
        [layerId]: {
          ...(calibration[layerId] ?? { x: 0, y: 0, scale: 1, rotate: 0 }),
          [field]: value,
        },
      })
    },
    [calibration, onChange],
  )

  const flash = (message: string) => {
    setSaveMsg(message)
    window.setTimeout(() => setSaveMsg(null), 2400)
  }

  const handleSave = () => {
    saveMinigameSceneLayoutCalibration(minigameId, calibration)
    flash('Sauvegardé (localStorage dev)')
  }

  const handleReset = () => {
    onChange(
      Object.fromEntries(layers.map((layer) => [layer.id, { x: 0, y: 0, scale: 1, rotate: 0 }])),
    )
    flash('Valeurs par défaut')
  }

  const handleCopyJson = async () => {
    const json = exportMinigameSceneLayoutJson(calibration)
    try {
      await navigator.clipboard.writeText(json)
      flash('JSON copié')
    } catch {
      flash('Copie impossible')
    }
  }

  const handleImportJson = () => {
    const raw = window.prompt('Coller le JSON de calibration')
    if (!raw) return
    try {
      onChange(parseMinigameSceneLayoutJson(raw))
      flash('JSON importé')
    } catch {
      flash('JSON invalide')
    }
  }

  if (layers.length === 0) {
    return <p className="mg-scene-cal-empty">Aucune couche déclarée pour ce mini-jeu.</p>
  }

  return (
    <div className="mg-scene-cal">
      <header className="mg-scene-cal-head">
        <p className="mg-scene-cal-kicker">Layout scène · dev</p>
        <p className="mg-scene-cal-hint">
          Sliders (comme Roue du Destin) ou glisser les poignées sur la scène quand le mode drag est
          actif. Cible les éléments via <code>data-mg-layout-layer</code>.
        </p>
      </header>

      {onDragModeChange ? (
        <label className="mg-scene-cal-toggle">
          <input checked={dragMode} type="checkbox" onChange={(event) => onDragModeChange(event.target.checked)} />
          <span>Mode drag — déplacer les poignées sur la scène</span>
        </label>
      ) : null}

      <div className="mg-scene-cal-groups">
        {GROUP_ORDER.map((group) => {
          const groupLayers = layersByGroup.get(group)
          if (!groupLayers?.length) return null
          return (
            <section className="mg-scene-cal-group" key={group}>
              <h4>{MINIGAME_SCENE_LAYER_GROUP_LABELS[group]}</h4>
              <div className="mg-scene-cal-layer-list">
                {groupLayers.map((layer) => (
                  <button
                    className={`mg-scene-cal-layer-btn${activeLayer?.id === layer.id ? ' active' : ''}`}
                    key={layer.id}
                    type="button"
                    onClick={() => setActiveLayerId(layer.id)}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {activeLayer ? (
        <div className="mg-scene-cal-sliders">
          <p className="mg-scene-cal-active">
            Couche active : <strong>{activeLayer.label}</strong> <code>{activeLayer.id}</code>
          </p>
          {SLIDER_FIELDS.map((field) => (
            <label className="mg-scene-cal-field" key={field.key}>
              <span>
                {field.label}{' '}
                <output>{activeTransform[field.key].toFixed(field.key === 'scale' ? 2 : 1)}</output>
              </span>
              <input
                max={field.max}
                min={field.min}
                step={field.step}
                type="range"
                value={activeTransform[field.key]}
                onChange={(event) =>
                  updateField(activeLayer.id, field.key, Number.parseFloat(event.target.value))
                }
              />
            </label>
          ))}
        </div>
      ) : null}

      <div className="mg-scene-cal-actions">
        <button className="secondary" type="button" onClick={handleSave}>
          Sauver local
        </button>
        <button className="secondary" type="button" onClick={handleReset}>
          Reset
        </button>
        <button className="secondary" type="button" onClick={handleCopyJson}>
          Copier JSON
        </button>
        <button className="secondary" type="button" onClick={handleImportJson}>
          Importer JSON
        </button>
      </div>

      {saveMsg ? <p className="mg-scene-cal-msg">{saveMsg}</p> : null}

      <pre className="mg-scene-cal-json">{exportMinigameSceneLayoutJson(calibration)}</pre>
    </div>
  )
}
