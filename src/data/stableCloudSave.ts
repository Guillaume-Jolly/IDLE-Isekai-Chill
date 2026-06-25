import { isStablePresetBuild } from './stableDemoSave'

export function isStableCloudSaveEnabled(): boolean {
  return isStablePresetBuild()
}

export async function fetchStableCloudSaveRaw(): Promise<string | null> {
  try {
    const response = await fetch('/api/stable/save', {
      credentials: 'same-origin',
      cache: 'no-store',
    })
    if (response.status === 404) return null
    if (response.status === 409) {
      console.warn('[stable] compte deja connecte ailleurs')
      return null
    }
    if (!response.ok) return null
    return await response.text()
  } catch {
    return null
  }
}

export async function pushStableCloudSaveRaw(raw: string): Promise<boolean> {
  try {
    const response = await fetch('/api/stable/save', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: raw,
    })
    return response.ok
  } catch {
    return false
  }
}
