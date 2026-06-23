/**
 * Alias legacy → nouvelle arborescence (réorg. assets juin 2026).
 * Utilisé par le plugin Vite pour servir d’anciennes URLs si les fichiers
 * n’ont pas encore été déplacés sous public/assets/.
 */
export const LEGACY_MINIGAME_REWRITES = [
  [/^\/minigames\/enclosures\/(.+)$/, '/assets/minigames/dressage/enclosures/$1'],
  [/^\/minigames\/palmons\/chibi\/(.+)$/, '/assets/minigames/dressage/myrions/chibi/$1'],
  [/^\/minigames\/palmons\/silhouettes\/(.+)$/, '/assets/minigames/capture/myrions/silhouette/$1'],
  [/^\/minigames\/palmons\/(.+)$/, '/assets/minigames/capture/myrions/cutout/$1'],
  [/^\/minigames\/biomes\/(.+)$/, '/assets/minigames/capture/biomes/$1'],
  [/^\/minigames\/guides\/talia-point-(.+)\.png$/, '/assets/minigames/capture/companions/talia/point-$1.png'],
  [/^\/minigames\/guides\/talia-point\.png$/, '/assets/minigames/capture/companions/talia/point.png'],
  [/^\/minigames\/guides\/(.+)$/, '/assets/minigames/capture/companions/$1'],
  [/^\/minigames\/presentations\/(.+)$/, '/assets/minigames/hub/presentations/$1'],
  [/^\/minigames\/stages\/(.+)$/, '/assets/minigames/hub/stages/$1'],
  [/^\/companions\/(.+)$/, '/assets/companions/$1'],
]

export function rewriteLegacyAssetUrl(pathname) {
  for (const [pattern, replacement] of LEGACY_MINIGAME_REWRITES) {
    const next = pathname.replace(pattern, replacement)
    if (next !== pathname) {
      return next
    }
  }
  return null
}
