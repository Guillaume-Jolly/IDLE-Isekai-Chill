/**
 * URLs des fichiers statiques servis depuis public/ ou via le plugin repo-assets (assets/).
 * Toujours passer par cette helper (BASE_URL + pas de slash en double).
 * Les chemins runtime (`assets/companions/…`, `assets/minigames/…`, `gacha/…`) restent stables ;
 * le plugin `vite.repo-assets.ts` résout vers l’arbre `assets/` en dev et build.
 */
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`

export function publicAssetUrl(relativePath: string): string {
  return `${BASE}${relativePath.replace(/^\/+/, '')}`
}

/** Essaie le chemin canonique puis des chemins legacy (réorg. juin 2026). */
export function publicAssetCandidates(
  canonicalRelative: string,
  ...legacyRelatives: string[]
): string[] {
  return [canonicalRelative, ...legacyRelatives].map(publicAssetUrl)
}
