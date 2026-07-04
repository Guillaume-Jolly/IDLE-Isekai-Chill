import { useCallback, useState } from 'react'
import type { WheelPackId } from '../../data/destinyWheel/seedLoader'
import {
  createDefaultDestinyWheelSceneCalibration,
  DESTINY_WHEEL_LAYOUT_LAYER_LABELS,
  DESTINY_WHEEL_SCENE_LAYERS,
  DISGAEA_WHEEL_CALIBRATION_LAYERS,
  exportDestinyWheelSceneCalibrationJson,
  loadDestinyWheelSceneCalibration,
  parseDestinyWheelSceneCalibrationJson,
  saveDestinyWheelSceneCalibration,
  isDialogueBubbleSceneLayer,
  type DestinyWheelLayoutLayerId,
  type DestinyWheelSceneLayoutCalibration,
  type SceneCalLayer,
} from '../../data/destinyWheel/destinyWheelSceneLayoutCalibration.ts'
import type { DisgaeaWheelCalLayer } from '../../data/destinyWheel/disgaeaWheelLayoutCalibration.ts'
import './DestinyWheelSceneCalibrator.css'

type Props = {
  calibration: DestinyWheelSceneLayoutCalibration
  onChange: (next: DestinyWheelSceneLayoutCalibration) => void
  wheelPackId: WheelPackId
}

type SliderField = keyof Pick<SceneCalLayer, 'x' | 'y' | 'scale' | 'rotate'>

const SLIDER_FIELDS: { key: SliderField; label: string; min: number; max: number; step: number }[] = [
  { key: 'x', label: 'X (%)', min: -200, max: 200, step: 0.5 },
  { key: 'y', label: 'Y (%)', min: -200, max: 200, step: 0.5 },
  { key: 'scale', label: 'Scale', min: 0.2, max: 2.5, step: 0.01 },
  { key: 'rotate', label: 'Rotation (°)', min: -180, max: 180, step: 0.5 },
]

const BUBBLE_SLIDER_FIELDS: { key: SliderField; label: string; min: number; max: number; step: number }[] = [
  { key: 'x', label: 'X (cqw)', min: -100, max: 100, step: 0.5 },
  { key: 'y', label: 'Y (cqh)', min: -100, max: 100, step: 0.5 },
  { key: 'scale', label: 'Scale', min: 0.2, max: 2.5, step: 0.01 },
  { key: 'rotate', label: 'Rotation (°)', min: -180, max: 180, step: 0.5 },
]

function isSceneLayer(id: DestinyWheelLayoutLayerId): id is (typeof DESTINY_WHEEL_SCENE_LAYERS)[number] {
  return (DESTINY_WHEEL_SCENE_LAYERS as readonly string[]).includes(id)
}

function isWheelLayer(id: DestinyWheelLayoutLayerId): id is (typeof DISGAEA_WHEEL_CALIBRATION_LAYERS)[number] {
  return (DISGAEA_WHEEL_CALIBRATION_LAYERS as readonly string[]).includes(id)
}

function wheelCalibrationKey(packId: WheelPackId): 'wheel' | 'havreWheel' {
  return packId === 'havre' ? 'havreWheel' : 'wheel'
}

export function DestinyWheelSceneCalibrator({ calibration, onChange, wheelPackId }: Props) {
  const [activeLayer, setActiveLayer] = useState<DestinyWheelLayoutLayerId>('pointerStack')
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const updateSceneLayer = useCallback(
    (layerId: (typeof DESTINY_WHEEL_SCENE_LAYERS)[number], field: keyof SceneCalLayer, value: number | boolean) => {
      onChange({
        ...calibration,
        [layerId]: {
          ...calibration[layerId],
          [field]: value,
        },
      })
    },
    [calibration, onChange],
  )

  const updateWheelLayer = useCallback(
    (layerId: (typeof DISGAEA_WHEEL_CALIBRATION_LAYERS)[number], field: string, value: number) => {
      const calKey = wheelCalibrationKey(wheelPackId)
      onChange({
        ...calibration,
        [calKey]: {
          ...calibration[calKey],
          [layerId]: {
            ...calibration[calKey][layerId],
            [field]: value,
          },
        },
      })
    },
    [calibration, onChange, wheelPackId],
  )

  const handleSave = useCallback(() => {
    saveDestinyWheelSceneCalibration(calibration)
    setSaveMsg('Sauvegardé (localStorage dev)')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [calibration])

  const handleReset = useCallback(() => {
    onChange(createDefaultDestinyWheelSceneCalibration())
    setSaveMsg('Valeurs par défaut')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [onChange])

  const handleCopyJson = useCallback(async () => {
    const json = exportDestinyWheelSceneCalibrationJson(calibration)
    try {
      await navigator.clipboard.writeText(json)
      setSaveMsg('JSON copié — colle-le à Cursor')
    } catch {
      setSaveMsg('Copie impossible — utilise Exporter')
    }
    window.setTimeout(() => setSaveMsg(null), 2800)
  }, [calibration])

  const handleExport = useCallback(() => {
    const json = exportDestinyWheelSceneCalibrationJson(calibration)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'destiny-wheel-scene-layout-calibration.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setSaveMsg('Fichier JSON téléchargé')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [calibration])

  const handleImport = useCallback(() => {
    const raw = window.prompt('Coller le JSON de calibration :')
    if (!raw?.trim()) return
    try {
      onChange(parseDestinyWheelSceneCalibrationJson(raw))
      setSaveMsg('Import OK')
    } catch {
      setSaveMsg('JSON invalide')
    }
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [onChange])

  const activeWheelCalKey = wheelCalibrationKey(wheelPackId)
  const activeWheelCal = calibration[activeWheelCalKey]

  const sceneLayer = isSceneLayer(activeLayer) ? calibration[activeLayer] : null
  const wheelLayer =
    isWheelLayer(activeLayer) && (wheelPackId === 'disgaea' || wheelPackId === 'havre')
      ? (activeWheelCal[activeLayer] as DisgaeaWheelCalLayer & Record<string, number>)
      : null

  const extraWheelFields =
    activeLayer === 'pointerMobile' && wheelLayer ? (
      <>
        <label className="dw-cal-field">
          <span>Top sur fixed (%)</span>
          <input
            type="range"
            min={40}
            max={85}
            step={0.1}
            value={activeWheelCal.pointerMobile.topOnFixedPct}
            onChange={(e) => updateWheelLayer('pointerMobile', 'topOnFixedPct', Number(e.target.value))}
          />
          <output>{activeWheelCal.pointerMobile.topOnFixedPct.toFixed(1)}</output>
        </label>
        <label className="dw-cal-field">
          <span>Charnière Y (%)</span>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={activeWheelCal.pointerMobile.hingeY}
            onChange={(e) => updateWheelLayer('pointerMobile', 'hingeY', Number(e.target.value))}
          />
          <output>{activeWheelCal.pointerMobile.hingeY.toFixed(1)}</output>
        </label>
        <label className="dw-cal-field">
          <span>Largeur / fixed</span>
          <input
            type="range"
            min={0.3}
            max={0.65}
            step={0.005}
            value={activeWheelCal.pointerMobile.widthRatio}
            onChange={(e) => updateWheelLayer('pointerMobile', 'widthRatio', Number(e.target.value))}
          />
          <output>{activeWheelCal.pointerMobile.widthRatio.toFixed(3)}</output>
        </label>
      </>
    ) : null

  const sceneSliderFields =
    sceneLayer && (isDialogueBubbleSceneLayer(activeLayer) || activeLayer === 'currentCase')
      ? BUBBLE_SLIDER_FIELDS
      : SLIDER_FIELDS

  const extraBubbleFields =
    sceneLayer && isDialogueBubbleSceneLayer(activeLayer) ? (
      <>
        <label className="dw-cal-field">
          <span>Largeur bulle (cqw)</span>
          <input
            type="range"
            min={12}
            max={72}
            step={0.5}
            value={sceneLayer.widthCqw ?? (activeLayer === 'laharlBubble' ? 52 : 38)}
            onChange={(e) => updateSceneLayer(activeLayer, 'widthCqw', Number(e.target.value))}
          />
          <output>{(sceneLayer.widthCqw ?? (activeLayer === 'laharlBubble' ? 52 : 38)).toFixed(1)}</output>
        </label>
        <label className="dw-cal-field">
          <span>Hauteur bulle (cqh)</span>
          <input
            type="range"
            min={6}
            max={50}
            step={0.5}
            value={sceneLayer.heightCqh ?? (activeLayer === 'laharlBubble' ? 16 : 22)}
            onChange={(e) => updateSceneLayer(activeLayer, 'heightCqh', Number(e.target.value))}
          />
          <output>{(sceneLayer.heightCqh ?? (activeLayer === 'laharlBubble' ? 16 : 22)).toFixed(1)}</output>
        </label>
      </>
    ) : activeLayer === 'currentCase' && sceneLayer ? (
      <>
        <label className="dw-cal-field">
          <span>Largeur panneau (cqw)</span>
          <input
            type="range"
            min={16}
            max={80}
            step={0.5}
            value={sceneLayer.widthCqw ?? 26.5}
            onChange={(e) => updateSceneLayer('currentCase', 'widthCqw', Number(e.target.value))}
          />
          <output>{(sceneLayer.widthCqw ?? 26.5).toFixed(1)}</output>
        </label>
        <label className="dw-cal-field">
          <span>Hauteur panneau (cqh)</span>
          <input
            type="range"
            min={10}
            max={36}
            step={0.5}
            value={sceneLayer.heightCqh ?? 14}
            onChange={(e) => updateSceneLayer('currentCase', 'heightCqh', Number(e.target.value))}
          />
          <output>{(sceneLayer.heightCqh ?? 14).toFixed(1)}</output>
        </label>
      </>
    ) : null

  return (
    <section className="dw-dev-layout" aria-label="Calibration layout scène">
      <p className="dw-debug-block-title">Layout scène (dev)</p>
      <p className="dw-dev-layout-hint">
        Ajuste compagnons, textes et assets roue (Disgaea / Havre). Case en cours & bulles : X/Y en cqw/cqh (scène entière). Prévisualisation live tant que cet onglet est ouvert.
      </p>

      {wheelPackId === 'disgaea' || wheelPackId === 'havre' ? (
        <div className="dw-cal-layers">
          <span className="dw-cal-group-label">
            Roue {wheelPackId === 'havre' ? 'Havre' : 'Disgaea'}
          </span>
          {DISGAEA_WHEEL_CALIBRATION_LAYERS.map((id) => (
            <button
              key={id}
              type="button"
              className={`dw-cal-layer-btn${activeLayer === id ? ' dw-cal-layer-btn--active' : ''}`}
              onClick={() => setActiveLayer(id)}
            >
              {DESTINY_WHEEL_LAYOUT_LAYER_LABELS[id]}
            </button>
          ))}
        </div>
      ) : null}

      <div className="dw-cal-layers">
        <span className="dw-cal-group-label">Compagnons & UI</span>
        {DESTINY_WHEEL_SCENE_LAYERS.map((id) => (
          <button
            key={id}
            type="button"
            className={`dw-cal-layer-btn${activeLayer === id ? ' dw-cal-layer-btn--active' : ''}`}
            onClick={() => setActiveLayer(id)}
          >
            {DESTINY_WHEEL_LAYOUT_LAYER_LABELS[id]}
          </button>
        ))}
      </div>

      <p className="dw-cal-active">{DESTINY_WHEEL_LAYOUT_LAYER_LABELS[activeLayer]}</p>

      {sceneLayer ? (
        <label className="dw-cal-field dw-cal-field--toggle">
          <span>Afficher</span>
          <input
            type="checkbox"
            checked={sceneLayer.visible}
            onChange={(e) =>
              updateSceneLayer(activeLayer as (typeof DESTINY_WHEEL_SCENE_LAYERS)[number], 'visible', e.target.checked)
            }
          />
        </label>
      ) : null}

      {sceneLayer
        ? sceneSliderFields.map(({ key, label, min, max, step }) => (
            <label key={key} className="dw-cal-field">
              <span>{label}</span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={sceneLayer[key]}
                onChange={(e) =>
                  updateSceneLayer(
                    activeLayer as (typeof DESTINY_WHEEL_SCENE_LAYERS)[number],
                    key,
                    Number(e.target.value),
                  )
                }
              />
              <output>{sceneLayer[key].toFixed(key === 'scale' ? 2 : 1)}</output>
            </label>
          ))
        : null}

      {wheelLayer
        ? SLIDER_FIELDS.map(({ key, label, min, max, step }) => (
            <label key={key} className="dw-cal-field">
              <span>{label}</span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={wheelLayer[key]}
                onChange={(e) =>
                  updateWheelLayer(activeLayer as (typeof DISGAEA_WHEEL_CALIBRATION_LAYERS)[number], key, Number(e.target.value))
                }
              />
              <output>{wheelLayer[key].toFixed(key === 'scale' ? 2 : 1)}</output>
            </label>
          ))
        : null}

      {extraWheelFields}

      {extraBubbleFields}

      <div className="dw-cal-actions">
        <button type="button" className="dw-cal-btn dw-cal-btn--primary" onClick={handleSave}>
          Sauvegarder
        </button>
        <button type="button" className="dw-cal-btn" onClick={handleCopyJson}>
          Copier JSON
        </button>
        <button type="button" className="dw-cal-btn" onClick={handleExport}>
          Exporter
        </button>
        <button type="button" className="dw-cal-btn" onClick={handleImport}>
          Importer
        </button>
        <button type="button" className="dw-cal-btn dw-cal-btn--muted" onClick={handleReset}>
          Reset
        </button>
      </div>

      {saveMsg ? <p className="dw-cal-msg">{saveMsg}</p> : null}
      <p className="dw-cal-hint">
        Sauvegarde locale dev + copie JSON pour Cursor. Cible agent :{' '}
        <code>src/data/destinyWheel/destinyWheelSceneLayoutUser.json</code>
      </p>
    </section>
  )
}

export function useDestinyWheelSceneCalibrationState() {
  return useState<DestinyWheelSceneLayoutCalibration>(() => loadDestinyWheelSceneCalibration())
}
