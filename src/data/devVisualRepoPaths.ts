/** Chemin relatif à la racine du repo (pour ouverture Explorateur en dev). */
export type DevVisualRepoPath = string

export function publicCompanionRepoPath(companionId: string, filename: string): DevVisualRepoPath {
  return `public/assets/companions/${companionId}/${filename}`
}

export function integratedDisagreaRepoPath(companionId: string, filename: string): DevVisualRepoPath {
  if (filename.includes('nsfw')) {
    return `assets/Compagnons/${companionId}/NSFW/affinity-4-nsfw.png`
  }
  const levelMatch = filename.match(/affinity-(\d{2})/)
  if (levelMatch) {
    return `assets/Compagnons/${companionId}/affinite/affinity-${parseInt(levelMatch[1], 10)}.png`
  }
  return `assets/Compagnons/${companionId}/Autres/disagrea-integrated/${filename}`
}

export function stagingCompanionRepoPath(relativePath: string): DevVisualRepoPath {
  return `staging/companion-visual-pack/${relativePath.replace(/^\/+/, '')}`
}

/** Déduit le chemin repo depuis une URL dev ou public/assets. */
export function repoPathFromDevSrc(src: string): DevVisualRepoPath | undefined {
  let path = src.split('?')[0]
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      path = new URL(path).pathname
    } catch {
      return undefined
    }
  }
  path = path.replace(/^\/+/, '')
  const base = import.meta.env.BASE_URL.replace(/^\/+|\/+$/g, '')
  if (base && path.startsWith(`${base}/`)) {
    path = path.slice(base.length + 1)
  }
  if (path.startsWith('assets/companions/')) {
    return `public/${path}`
  }
  if (path.startsWith('dev-assets/event-disagrea/')) {
    const match = path.match(
      /dev-assets\/event-disagrea\/integrated\/companions\/([^/]+)\/(.+\.png)$/,
    )
    if (match) {
      return integratedDisagreaRepoPath(match[1], match[2])
    }
  }
  if (path.startsWith('dev-assets/staging-companion-visual-pack/')) {
    return path.replace(
      'dev-assets/staging-companion-visual-pack/',
      'staging/companion-visual-pack/',
    )
  }
  return undefined
}
