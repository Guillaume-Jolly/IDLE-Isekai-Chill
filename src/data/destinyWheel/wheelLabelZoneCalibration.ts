export const WHEEL_LABEL_WHEEL_R = 182

export const WHEEL_LABEL_ZONE_CALIBRATION_STORAGE_KEY = 'idle-isekai-wheel-label-zone-calibration'

export type WheelLabelZoneCalibration = {
  version: 1
  /** Rayon intérieur zone texte (% du rayon roue, ex. 0.3 = 30 %). */
  rInnerRatio: number
  /** Rayon extérieur zone texte (% R). */
  rOuterRatio: number
  /** Marge angulaire début de case (ratio du sweep). */
  angPadStart: number
  /** Marge angulaire fin de case (ratio du sweep). */
  angPadEnd: number
  /** Remplissage bande radiale / longueur arc utilisable (0–1). */
  arcFill: number
  /** Position arc tangent dans la bande (0 = intérieur, 1 = extérieur). */
  arcRadiusRatio: number
  /** Estimation largeur caractère (fit texte). */
  charWidthRatio: number
  /** Marge contour SVG (fit texte). */
  strokePad: number
  /** Compression max textPath radial (× longueur piste). */
  shrinkToFitMax: number
  minFont: number
  maxFont: number
  /** startOffset textPath radial (%). */
  textPathStartRadialPct: number
  /** startOffset textPath tangent (%). */
  textPathStartTangentPct: number
  /** Décalage ancrage radial (× fontSize). */
  radialAnchorFontRatio: number
  /** Pad radiale côté bord extérieur (haut) — ratio de la largeur de bande. */
  radialPadOuterRatio: number
  /** Raccourcit la piste textPath radial côté extérieur (% longueur piste). */
  textPathEndInsetPct: number
  /** Position angulaire piste radiale dans la case (0=gauche segment, 1=droite). */
  textPathAngleRatio: number
  /** Prolonge la piste radiale vers l'extérieur (% largeur bande, au-delà de outerR). */
  textPathOuterExtendRatio: number
  /** Marge clip côté bord extérieur (× fontSize) — anti-scalpe haut des glyphes. */
  clipOuterGlyphPadRatio: number
}

export const DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION: WheelLabelZoneCalibration = {
  version: 1,
  rInnerRatio: 0.29,
  rOuterRatio: 0.86,
  angPadStart: 0.01,
  angPadEnd: 0,
  arcFill: 0.96,
  arcRadiusRatio: 0.45,
  charWidthRatio: 0.5,
  strokePad: 1,
  shrinkToFitMax: 2.2,
  minFont: 8.5,
  maxFont: 12.5,
  textPathStartRadialPct: 3.5,
  textPathStartTangentPct: 3.5,
  radialAnchorFontRatio: 0.35,
  radialPadOuterRatio: 0,
  textPathEndInsetPct: 0,
  textPathAngleRatio: 0.48,
  textPathOuterExtendRatio: 0.04,
  clipOuterGlyphPadRatio: 0.65,
}

export function getDefaultWheelLabelZoneCalibration(): WheelLabelZoneCalibration {
  return structuredClone(DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION)
}

export function mergeWheelLabelZoneCalibration(
  base: WheelLabelZoneCalibration,
  patch: Partial<WheelLabelZoneCalibration>,
): WheelLabelZoneCalibration {
  const merged: WheelLabelZoneCalibration = { ...base, ...patch, version: 1 }
  if (merged.shrinkToFitMax < base.shrinkToFitMax) {
    merged.shrinkToFitMax = base.shrinkToFitMax
  }
  return merged
}

export function loadWheelLabelZoneCalibration(): WheelLabelZoneCalibration {
  const shipped = getDefaultWheelLabelZoneCalibration()
  if (typeof localStorage === 'undefined') return shipped
  try {
    const raw = localStorage.getItem(WHEEL_LABEL_ZONE_CALIBRATION_STORAGE_KEY)
    if (!raw) return shipped
    const parsed = JSON.parse(raw) as Partial<WheelLabelZoneCalibration>
    if (parsed.version === 1) return mergeWheelLabelZoneCalibration(shipped, parsed)
  } catch {
    /* ignore */
  }
  return shipped
}

export function saveWheelLabelZoneCalibration(cal: WheelLabelZoneCalibration): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(WHEEL_LABEL_ZONE_CALIBRATION_STORAGE_KEY, JSON.stringify(cal, null, 2))
}

export function exportWheelLabelZoneCalibrationJson(cal: WheelLabelZoneCalibration): string {
  return JSON.stringify(cal, null, 2)
}

export function parseWheelLabelZoneCalibrationJson(raw: string): WheelLabelZoneCalibration {
  const parsed = JSON.parse(raw) as Partial<WheelLabelZoneCalibration>
  return mergeWheelLabelZoneCalibration(getDefaultWheelLabelZoneCalibration(), parsed)
}

export function resolveWheelLabelZoneCalibration(
  config?: WheelLabelZoneCalibration,
): WheelLabelZoneCalibration {
  return config ?? DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION
}

export function effectiveLabelZoneRadii(config: WheelLabelZoneCalibration): {
  innerR: number
  outerR: number
} {
  const innerR = WHEEL_LABEL_WHEEL_R * config.rInnerRatio
  const outerNominal = WHEEL_LABEL_WHEEL_R * config.rOuterRatio
  const bandWidth = Math.max(0, outerNominal - innerR)
  const outerR = outerNominal - bandWidth * config.radialPadOuterRatio
  return { innerR, outerR: Math.max(innerR + 1, outerR) }
}

export function radialTextPathAngle(
  segment: Pick<{ startAngle: number; endAngle: number }, 'startAngle' | 'endAngle'>,
  config: WheelLabelZoneCalibration,
): number {
  const sweep = segment.endAngle - segment.startAngle
  return segment.startAngle + sweep * config.textPathAngleRatio
}

export function radialTextPathOuterR(
  zone: Pick<{ innerR: number; outerR: number }, 'innerR' | 'outerR'>,
  config: WheelLabelZoneCalibration,
): number {
  const band = Math.max(0, zone.outerR - zone.innerR)
  const insetOuter = zone.innerR + band * (1 - config.textPathEndInsetPct / 100)
  const extend = band * config.textPathOuterExtendRatio
  return Math.min(WHEEL_LABEL_WHEEL_R - 4, insetOuter + extend)
}

/** Longueur radiale utilisable le long du textPath (startOffset + arcFill). */
export function effectiveRadialTextTrack(
  zone: Pick<{ innerR: number; outerR: number }, 'innerR' | 'outerR'>,
  config: WheelLabelZoneCalibration,
): number {
  const outerR = radialTextPathOuterR(zone, config)
  const span = Math.max(0, outerR - zone.innerR)
  const startLoss = span * (config.textPathStartRadialPct / 100)
  return Math.max(0, span - startLoss) * config.arcFill
}

/** Longueur d'arc tangent utilisable (startOffset + arcFill). */
export function effectiveTangentArcLength(
  zone: Pick<{ innerR: number; outerR: number; startAngle: number; endAngle: number }, 'innerR' | 'outerR' | 'startAngle' | 'endAngle'>,
  config: WheelLabelZoneCalibration,
): number {
  const sweep = zone.endAngle - zone.startAngle
  const radius = zone.innerR + (zone.outerR - zone.innerR) * config.arcRadiusRatio
  const arcLength = ((sweep * Math.PI) / 180) * radius
  const startLoss = arcLength * (config.textPathStartTangentPct / 100)
  return Math.max(0, arcLength - startLoss) * config.arcFill
}

/** Marge clip pour demi-hauteur glyphe + contour (évite la « scalpe » vers l'extérieur). */
export function labelGlyphClipPad(
  fontSize: number,
  config: WheelLabelZoneCalibration,
): { outer: number; inner: number } {
  return {
    outer: fontSize * config.clipOuterGlyphPadRatio + 2.5,
    inner: fontSize * 0.12,
  }
}
