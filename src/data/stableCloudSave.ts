/**
 * Stub public — cloud save PROD désactivé (stack locale dans deploy/, hors Git).
 * Copie complète : deploy/stable/local-src/stableCloudSave.full.ts
 */

export function isStableCloudSaveEnabled(): boolean {
  return false
}

export async function fetchStableCloudSaveRaw(): Promise<string | null> {
  return null
}

export async function pushStableCloudSaveRaw(_raw: string): Promise<boolean> {
  return false
}
