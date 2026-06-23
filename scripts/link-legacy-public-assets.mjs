/**
 * Crée des jonctions Windows (ou copies) pour que d’anciennes URLs publiques
 * continuent de servir les fichiers déplacés sous public/assets/.
 *
 * Usage: node scripts/link-legacy-public-assets.mjs
 */
import { existsSync, lstatSync, symlinkSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const links = [
  ['public/companions', 'public/assets/companions'],
]

for (const [linkPath, targetPath] of links) {
  const absLink = join(root, linkPath)
  const absTarget = join(root, targetPath)
  if (!existsSync(absTarget)) {
    console.warn(`SKIP ${linkPath} — cible absente: ${targetPath}`)
    continue
  }
  if (existsSync(absLink)) {
    console.log(`OK ${linkPath} (existe déjà)`)
    continue
  }
  mkdirSync(dirname(absLink), { recursive: true })
  try {
    symlinkSync(absTarget, absLink, 'junction')
    console.log(`LINK ${linkPath} → ${targetPath}`)
  } catch (error) {
    console.warn(`FAIL ${linkPath}: ${error.message}`)
  }
}

console.log('Les chemins /minigames/… sont réécrits en dev via vite.config.ts')
