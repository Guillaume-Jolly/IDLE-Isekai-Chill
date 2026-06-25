/** Chemin relatif à la racine du repo (pour ouverture Explorateur en dev). */
export type DevVisualRepoPath = string

export function publicCompanionRepoPath(companionId: string, filename: string): DevVisualRepoPath {
  return `public/assets/companions/${companionId}/${filename}`
}

export function integratedDisagreaRepoPath(companionId: string, filename: string): DevVisualRepoPath {
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
    return path.replace('dev-assets/event-disagrea/', 'assets/event-disagrea/')
  }
  if (path.startsWith('dev-assets/staging-companion-visual-pack/')) {
    return path.replace(
      'dev-assets/staging-companion-visual-pack/',
      'staging/companion-visual-pack/',
    )
  }
  return undefined
}
