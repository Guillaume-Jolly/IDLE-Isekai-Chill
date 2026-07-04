import shippedSceneLayoutUser from './destinyWheelSceneLayoutUser.json'
import type { DisgaeaWheelLayoutCalibration } from './disgaeaWheelLayoutCalibration.ts'

/** Defaults prod — alignés sur destinyWheelSceneLayoutUser.json → havreWheel. */
export function createDefaultHavreWheelCalibration(): DisgaeaWheelLayoutCalibration {
  return structuredClone(shippedSceneLayoutUser.havreWheel) as DisgaeaWheelLayoutCalibration
}
