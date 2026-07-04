import { useCallback, useState } from 'react'
import {
  exportWheelLabelZoneCalibrationJson,
  getDefaultWheelLabelZoneCalibration,
  loadWheelLabelZoneCalibration,
  parseWheelLabelZoneCalibrationJson,
  saveWheelLabelZoneCalibration,
  type WheelLabelZoneCalibration,
} from '../../data/destinyWheel/wheelLabelZoneCalibration.ts'
import './DestinyWheelSceneCalibrator.css'

type Props = {
  calibration: WheelLabelZoneCalibration
  onChange: (next: WheelLabelZoneCalibration) => void
  showZoneOverlay: boolean
  onShowZoneOverlayChange: (value: boolean) => void
}

type NumericField = {
  key: keyof WheelLabelZoneCalibration
  label: string
  hint?: string
  min: number
  max: number
  step: number
}

/** Réglages qui contrôlent vraiment troncature / position (≠ pad clip angulaire). */
const PATH_PLACEMENT_FIELDS: NumericField[] = [
  {
    key: 'textPathAngleRatio',
    label: 'Position piste dans la case',
    hint: '0=gauche · 0.5=centre — déplace le texte sans rétrécir la zone clip',
    min: 0,
    max: 0.85,
    step: 0.02,
  },
  {
    key: 'textPathOuterExtendRatio',
    label: 'Extension piste vers l’extérieur (% bande)',
    hint: '↑ prolonge la fin du texte vers le bord roue',
    min: 0,
    max: 0.35,
    step: 0.01,
  },
  {
    key: 'clipOuterGlyphPadRatio',
    label: 'Marge clip haut des lettres (× font)',
    hint: '↑ évite le « scalpe » du haut des glyphes',
    min: 0.2,
    max: 1.2,
    step: 0.05,
  },
  {
    key: 'rOuterRatio',
    label: 'Bord extérieur bande (% R)',
    hint: '0.89 = 89 % du rayon roue',
    min: 0.55,
    max: 1,
    step: 0.01,
  },
]

const ZONE_FIELDS: NumericField[] = [
  { key: 'rInnerRatio', label: 'Rayon intérieur (% R)', hint: '0.30 = 30 %', min: 0.08, max: 0.55, step: 0.01 },
  { key: 'angPadStart', label: 'Marge clip angle gauche (case)', hint: '≠ position texte', min: 0, max: 0.35, step: 0.01 },
  { key: 'angPadEnd', label: 'Pad angle fin case', min: 0, max: 0.3, step: 0.01 },
  { key: 'arcFill', label: 'Remplissage bande (arc / radial)', min: 0.7, max: 1, step: 0.01 },
  { key: 'arcRadiusRatio', label: 'Arc tangent (% bande)', hint: '0.5 = milieu', min: 0, max: 1, step: 0.05 },
]

const TEXT_FIELDS: NumericField[] = [
  { key: 'charWidthRatio', label: 'Largeur caractère (fit)', min: 0.5, max: 1, step: 0.01 },
  { key: 'strokePad', label: 'Marge contour (fit)', min: 1, max: 1.35, step: 0.01 },
  { key: 'shrinkToFitMax', label: 'Compression max (× piste)', min: 1, max: 3, step: 0.05 },
  { key: 'minFont', label: 'Police min (px)', min: 4, max: 10, step: 0.5 },
  { key: 'maxFont', label: 'Police max (px)', min: 7, max: 14, step: 0.5 },
]

const PATH_FIELDS: NumericField[] = [
  { key: 'textPathStartRadialPct', label: 'Offset début textPath radial (%)', min: 0, max: 12, step: 0.5 },
  { key: 'textPathStartTangentPct', label: 'Offset textPath tangent (%)', min: 0, max: 12, step: 0.5 },
  { key: 'radialAnchorFontRatio', label: 'Inset ancrage radial (× font)', min: 0, max: 0.8, step: 0.05 },
  {
    key: 'radialPadOuterRatio',
    label: 'Rétrécit zone clip extérieur (% bande)',
    hint: 'avancé — réduit la bande clip, pas la piste',
    min: 0,
    max: 0.45,
    step: 0.01,
  },
  {
    key: 'textPathEndInsetPct',
    label: 'Raccourcit piste radial (fin, %)',
    hint: 'avancé — raccourcit la piste texte',
    min: 0,
    max: 25,
    step: 0.5,
  },
]

function clampField(field: NumericField, value: number): number {
  if (!Number.isFinite(value)) return field.min
  const stepped = Math.round(value / field.step) * field.step
  return Math.min(field.max, Math.max(field.min, stepped))
}

function CalNumberField({
  field,
  value,
  onChange,
}: {
  field: NumericField
  value: number
  onChange: (value: number) => void
}) {
  const display = field.step >= 1 ? value.toFixed(0) : value.toFixed(2)

  return (
    <label className="dw-cal-field dw-cal-field--dual">
      <span>
        {field.label}
        {field.hint ? <small className="dw-cal-field-hint"> — {field.hint}</small> : null}
      </span>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(clampField(field, Number(e.target.value)))}
      />
      <input
        type="number"
        className="dw-cal-number"
        min={field.min}
        max={field.max}
        step={field.step}
        value={display}
        onChange={(e) => onChange(clampField(field, Number(e.target.value)))}
      />
    </label>
  )
}

export function DestinyWheelLabelZoneCalibrator({
  calibration,
  onChange,
  showZoneOverlay,
  onShowZoneOverlayChange,
}: Props) {
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const patch = useCallback(
    (key: keyof WheelLabelZoneCalibration, value: number | boolean) => {
      onChange({ ...calibration, [key]: value })
    },
    [calibration, onChange],
  )

  const handleSave = useCallback(() => {
    saveWheelLabelZoneCalibration(calibration)
    setSaveMsg('Sauvegardé (localStorage dev)')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [calibration])

  const handleReset = useCallback(() => {
    onChange(getDefaultWheelLabelZoneCalibration())
    setSaveMsg('Valeurs par défaut')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [onChange])

  const handleCopyJson = useCallback(async () => {
    const json = exportWheelLabelZoneCalibrationJson(calibration)
    try {
      await navigator.clipboard.writeText(json)
      setSaveMsg('JSON copié — colle-le à Cursor')
    } catch {
      setSaveMsg('Copie impossible — utilise Exporter')
    }
    window.setTimeout(() => setSaveMsg(null), 2800)
  }, [calibration])

  const handleExport = useCallback(() => {
    const json = exportWheelLabelZoneCalibrationJson(calibration)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'wheel-label-zone-calibration.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setSaveMsg('Fichier JSON téléchargé')
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [calibration])

  const handleImport = useCallback(() => {
    const raw = window.prompt('Coller le JSON calibration zone texte :')
    if (!raw?.trim()) return
    try {
      onChange(parseWheelLabelZoneCalibrationJson(raw))
      setSaveMsg('Import OK')
    } catch {
      setSaveMsg('JSON invalide')
    }
    window.setTimeout(() => setSaveMsg(null), 2200)
  }, [onChange])

  const renderGroup = (title: string, fields: NumericField[], highlight = false) => (
    <div className={`dw-cal-field-group${highlight ? ' dw-cal-field-group--highlight' : ''}`}>
      <span className="dw-cal-group-label">{title}</span>
      {fields.map((field) => (
        <CalNumberField
          key={field.key}
          field={field}
          value={calibration[field.key] as number}
          onChange={(value) => patch(field.key, value)}
        />
      ))}
    </div>
  )

  return (
    <section className="dw-dev-layout" aria-label="Calibration zone texte roue">
      <p className="dw-debug-block-title">Zone texte roue (dev)</p>
      <p className="dw-dev-layout-hint">
        Ajuste la bande clip + fit des libellés. Prévisualisation live sur la roue (overlay jaune). Copie le JSON
        une fois satisfait.
      </p>

      <label className="dw-cal-field dw-cal-field--toggle">
        <span>Afficher overlay zones</span>
        <input
          type="checkbox"
          checked={showZoneOverlay}
          onChange={(e) => onShowZoneOverlayChange(e.target.checked)}
        />
      </label>

      {renderGroup('Troncature & position texte', PATH_PLACEMENT_FIELDS, true)}
      {renderGroup('Géométrie zone clip', ZONE_FIELDS)}
      {renderGroup('Fit texte', TEXT_FIELDS)}
      {renderGroup('Chemin & orientation', PATH_FIELDS)}

      <div className="dw-cal-actions">
        <button type="button" className="dw-cal-btn dw-cal-btn--primary" onClick={handleSave}>
          Sauver dev
        </button>
        <button type="button" className="dw-cal-btn" onClick={handleReset}>
          Reset
        </button>
        <button type="button" className="dw-cal-btn" onClick={handleCopyJson}>
          Copier JSON
        </button>
        <button type="button" className="dw-cal-btn dw-cal-btn--muted" onClick={handleExport}>
          Exporter
        </button>
        <button type="button" className="dw-cal-btn dw-cal-btn--muted" onClick={handleImport}>
          Importer
        </button>
      </div>

      {saveMsg ? <p className="dw-cal-msg">{saveMsg}</p> : null}
      <p className="dw-cal-hint">
        Fichier cible prod : <code>wheelLabelZoneCalibration.ts</code> (DEFAULT) ou JSON dédié après validation.
      </p>
    </section>
  )
}

export function useWheelLabelZoneCalibrationState() {
  return useState<WheelLabelZoneCalibration>(() =>
    import.meta.env.DEV ? loadWheelLabelZoneCalibration() : getDefaultWheelLabelZoneCalibration(),
  )
}
