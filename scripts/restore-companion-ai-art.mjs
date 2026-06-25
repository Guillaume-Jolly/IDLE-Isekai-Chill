/**
 * Restaure les portraits IA depuis public/generated-backup/
 * vers public/assets/companions/<id>/affinity-<n>.png
 *
 * Usage: npm run restore:companions
 */
import { mkdirSync } from 'node:fs'
import { copyFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { publicMinigamePaths, repoRoot } from './minigame-asset-paths.mjs'

const backup = join(repoRoot, 'public/generated-backup')
const companions = publicMinigamePaths.companions

const files = readdirSync(backup).filter((name) => /-affinity-\d+\.png$/.test(name))
if (files.length === 0) {
  console.error('No *-affinity-*.png files in public/generated-backup/')
  process.exit(1)
}

let restored = 0
for (const file of files) {
  const match = file.match(/^(.+)-affinity-(\d+)\.png$/)
  if (!match) continue
  const [, id, level] = match
  const destDir = join(companions, id)
  mkdirSync(destDir, { recursive: true })
  copyFileSync(join(backup, file), join(destDir, `affinity-${level}.png`))
  restored += 1
}

console.log(`Restored ${restored} AI portrait(s) from generated-backup.`)
