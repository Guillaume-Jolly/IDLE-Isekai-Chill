#!/usr/bin/env node
/**
 * Installe un cutout émotion (staging ou source) → assets/Compagnons/{id}/cutouts/ + chroma key.
 * Usage: node scripts/install-emotion-cutout.mjs <companionId> <emotionId> <sourcePng>
 */
import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { chromaKeyPng } from './chroma-key-png.mjs'
import { companionAssetPaths } from './minigame-asset-paths.mjs'

const [companionId, emotionId, sourcePath] = process.argv.slice(2)
if (!companionId || !emotionId || !sourcePath) {
  console.error('Usage: node scripts/install-emotion-cutout.mjs <companionId> <emotionId> <sourcePng>')
  process.exit(1)
}
if (!existsSync(sourcePath)) {
  console.error('Source introuvable:', sourcePath)
  process.exit(1)
}

const dest = companionAssetPaths.emotion(companionId, emotionId)
mkdirSync(dirname(dest), { recursive: true })
await chromaKeyPng(sourcePath, dest)
console.log(`✓ ${companionId}/emotion-${emotionId}.png`)
