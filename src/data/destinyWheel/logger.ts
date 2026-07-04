const warnedKeys = new Set<string>()

export function warnDestinyWheel(key: string, message: string) {
  if (warnedKeys.has(key)) return
  warnedKeys.add(key)
  console.warn(`[destiny-wheel] ${message}`)
}

export function resetDestinyWheelWarnings() {
  warnedKeys.clear()
}
