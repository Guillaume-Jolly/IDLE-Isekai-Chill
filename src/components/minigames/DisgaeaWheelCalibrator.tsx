import { useCallback, useMemo, useState } from 'react'
import {
  createDefaultDisgaeaWheelCalibration,
  DISGAEA_WHEEL_CALIBRATION_LAYER_LABELS,
  DISGAEA_WHEEL_CALIBRATION_LAYERS,
  exportDisgaeaWheelCalibrationJson,
  loadDisgaeaWheelCalibration,
  parseDisgaeaWheelCalibrationJson,
  saveDisgaeaWheelCalibration,
  type DisgaeaWheelCalibrationLayerId,
  type DisgaeaWheelCalLayer,
  type DisgaeaWheelLayoutCalibration,
} from '../../data/destinyWheel/disgaeaWheelLayoutCalibration.ts'
import './DisgaeaWheelCalibrator.css'

type Props = {
  calibration: DisgaeaWheelLayoutCalibration
  onChange: (next: DisgaeaWheelLayoutCalibration) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SliderField = keyof DisgaeaWheelCalLayer

const SLIDER_FIELDS: { key: SliderField; label: string; min: number; max: number; step: number }[] = [
  { key: 'x', label: 'X (%)', min: -25, max: 25, step: 0.1 },
  { key: 'y', label: 'Y (%)', min: -25, max: 25, step: 0.1 },
  { key: 'scale', label: 'Scale', min: 0.25, max: 2.5, step: 0.01 },
  { key: 'rotate', label: 'Rotation (°)', min: -180, max: 180, step: 0.5 },
]

export function DisgaeaWheelCalibrator({ calibration, onChange, open, onOpenChange }: Props) {
  const [activeLayer, setActiveLayer] = useState<DisgaeaWheelCalibrationLayerId>('pointerStack')
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const layer = calibration[activeLayer] as DisgaeaWheelCalLayer & Record<string, number>

  const updateLayer = useCallback(
    (field: string, value: number) => {
      onChange({
        ...calibration,
        [activeLayer]: {
          ...calibration[activeLayer],
          [field]: value,
        },
      })
    },
    [activeLayer, calibration, onChange],
  )

  const handleSave = useCallback(() => {
    saveDisgaeaWheelCalibration(calibration)
    setSaveMsg('Sauvegardé (localStorage)')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [calibration])

  const handleReset = useCallback(() => {
    onChange(createDefaultDisgaeaWheelCalibration())
    setSaveMsg('Valeurs par défaut')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [onChange])

  const handleCopyJson = useCallback(async () => {
    const json = exportDisgaeaWheelCalibrationJson(calibration)
    try {
      await navigator.clipboard.writeText(json)
      setSaveMsg('JSON copié — colle-le à Cursor')
    } catch {
      setSaveMsg('Copie impossible — utilise Exporter')
    }
    window.setTimeout(() => setSaveMsg(null), 2800)
  }, [calibration])

  const handleExport = useCallback(() => {
    const json = exportDisgaeaWheelCalibrationJson(calibration)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'disgaea-wheel-layout-calibration.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setSaveMsg('Fichier JSON téléchargé')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [calibration])

  const handleImport = useCallback(() => {
    const raw = window.prompt('Coller le JSON de calibration :')
    if (!raw?.trim()) return
    try {
      onChange(parseDisgaeaWheelCalibrationJson(raw))
      setSaveMsg('Import OK')
    } catch {
      setSaveMsg('JSON invalide')
    }
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [onChange])

  const extraFields = useMemo(() => {
    if (activeLayer !== 'pointerMobile') return null
    const mobile = calibration.pointerMobile
    return (
      <>
        <label className="dw-cal-field">
          <span>Top sur fixed (%)</span>
          <input
            type="range"
            min={40}
            max={85}
            step={0.1}
            value={mobile.topOnFixedPct}
            onChange={(e) => updateLayer('topOnFixedPct', Number(e.target.value))}
          />
          <output>{mobile.topOnFixedPct.toFixed(1)}</output>
        </label>
        <label className="dw-cal-field">
          <span>Charnière Y (%)</span>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={mobile.hingeY}
            onChange={(e) => updateLayer('hingeY', Number(e.target.value))}
          />
          <output>{mobile.hingeY.toFixed(1)}</output>
        </label>
        <label className="dw-cal-field">
          <span>Largeur / fixed</span>
          <input
            type="range"
            min={0.3}
            max={0.65}
            step={0.005}
            value={mobile.widthRatio}
            onChange={(e) => updateLayer('widthRatio', Number(e.target.value))}
          />
          <output>{mobile.widthRatio.toFixed(3)}</output>
        </label>
      </>
    )
  }, [activeLayer, calibration.pointerMobile, updateLayer])

  if (!open) {
    return (
      <button
        type="button"
        className="dw-cal-toggle"
        onClick={() => onOpenChange(true)}
        title="Calibrer position des assets roue Disgaea"
      >
        Calibrer UI roue
      </button>
    )
  }

  return (
    <aside className="dw-cal-panel" aria-label="Calibration assets roue Disgaea">
      <header className="dw-cal-header">
        <strong>Calibration Disgaea</strong>
        <button type="button" className="dw-cal-close" onClick={() => onOpenChange(false)} aria-label="Fermer">
          ×
        </button>
      </header>

      <div className="dw-cal-layers">
        {DISGAEA_WHEEL_CALIBRATION_LAYERS.map((id) => (
          <button
            key={id}
            type="button"
            className={`dw-cal-layer-btn${activeLayer === id ? ' dw-cal-layer-btn--active' : ''}`}
            onClick={() => setActiveLayer(id)}
          >
            {DISGAEA_WHEEL_CALIBRATION_LAYER_LABELS[id]}
          </button>
        ))}
      </div>

      <p className="dw-cal-active">{DISGAEA_WHEEL_CALIBRATION_LAYER_LABELS[activeLayer]}</p>

      {SLIDER_FIELDS.map(({ key, label, min, max, step }) => (
        <label key={key} className="dw-cal-field">
          <span>{label}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={layer[key]}
            onChange={(e) => updateLayer(key, Number(e.target.value))}
          />
          <output>{typeof layer[key] === 'number' ? layer[key].toFixed(key === 'scale' ? 2 : 1) : layer[key]}</output>
        </label>
      ))}

      {extraFields}

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
        Sauvegarde locale + copie JSON pour Cursor. Fichier cible agent :{' '}
        <code>src/data/destinyWheel/disgaeaWheelLayoutUser.json</code>
      </p>
    </aside>
  )
}

export function useDisgaeaWheelCalibrationState() {
  return useState<DisgaeaWheelLayoutCalibration>(() => loadDisgaeaWheelCalibration())
}
