#!/usr/bin/env node
/**
 * Affiche les 5 prompts batch6 Etna all-fours (side view, smile).
 * Usage: node scripts/staging/print-etna-allfours-prompts.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const batch = JSON.parse(
  readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      '../../staging/companion-visual-pack/disagrea/etna/tests/allfours-batch/GENERATION_BATCH.json',
    ),
    'utf8',
  ),
)

console.log(`Ancre style : ${batch.styleAnchor}\n`)

for (const variant of batch.variants) {
  console.log('='.repeat(72))
  console.log(`${variant.id.toUpperCase()} → ${variant.output}`)
  console.log('='.repeat(72))
  console.log(`${variant.lighting}. ${batch.sharedPromptTail}\n`)
}

console.log('Après génération :')
console.log(
  '  node scripts/staging/copy-generated-visual.mjs <png> staging/companion-visual-pack/disagrea/etna/tests/allfours-batch/<output>',
)
