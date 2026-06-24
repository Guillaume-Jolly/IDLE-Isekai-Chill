/**
 * Copy Etna cutout-5 into hunt guide companion paths for Disagrea event biome.
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'public/assets/companions/etna/cutout-5.png')
const guideDir = join(root, 'public/assets/minigames/capture/companions/etna')

const targets = [
  join(guideDir, 'point-disagrea-event.png'),
  join(guideDir, 'point.png'),
]

mkdirSync(guideDir, { recursive: true })

for (const dest of targets) {
  copyFileSync(source, dest)
  console.log(`Copied Etna cutout-5 → ${dest.replace(root + '/', '')}`)
}
