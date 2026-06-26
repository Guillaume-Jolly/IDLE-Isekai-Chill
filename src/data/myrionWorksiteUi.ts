/** Préférences UI Chantier Myrion — localStorage uniquement (hors save gameplay). */

const WORKSITE_MONITORING_STORAGE_KEY = 'idle-isekai-chill-worksite-monitoring'

export function loadWorksiteMonitoringMode(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(WORKSITE_MONITORING_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function saveWorksiteMonitoringMode(enabled: boolean): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(WORKSITE_MONITORING_STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    // préférence UI optionnelle — ignorer si stockage indisponible
  }
}
