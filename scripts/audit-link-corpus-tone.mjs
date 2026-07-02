#!/usr/bin/env node
/**
 * Audit cohérence ton / personnalité — corpus Lien v2 (lot par compagnon).
 * Usage: node scripts/audit-link-corpus-tone.mjs lyra [--limit 50] [--affinity 1]
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const corpusPath = join(root, 'src/data/linkCorpusV2.json')

const VALID_TONES = ['sincere', 'playful', 'direct', 'romantic']

function parseArgs() {
  const args = process.argv.slice(2)
  const companionId = args.find((a) => !a.startsWith('-'))
  let limit = 50
  let affinity = null
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--limit' && args[i + 1]) limit = Number(args[i + 1])
    if (args[i] === '--affinity' && args[i + 1]) affinity = Number(args[i + 1])
  }
  if (!companionId) {
    console.error('Usage: node scripts/audit-link-corpus-tone.mjs <companionId> [--limit N] [--affinity 1-5]')
    process.exit(1)
  }
  return { companionId, limit, affinity }
}

function loadProfiles() {
  const src = readFileSync(join(root, 'src/data/conversations/profiles.ts'), 'utf8')
  const profiles = {}
  const blockRe = /(\w+):\s*\{[^}]*toneWeights:\s*\{([^}]+)\}/gs
  let m
  while ((m = blockRe.exec(src)) !== null) {
    const id = m[1]
    const weights = {}
    for (const part of m[2].split(',')) {
      const [tone, w] = part.split(':').map((s) => s.trim())
      if (tone && w) weights[tone] = Number(w)
    }
    profiles[id] = weights
  }
  return profiles
}

function bestTone(weights) {
  return Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0]
}

function preferredTones(weights, topN = 2) {
  return Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([tone]) => tone)
}

function main() {
  const { companionId, limit, affinity } = parseArgs()
  const profiles = loadProfiles()
  const weights = profiles[companionId]
  if (!weights) {
    console.error(`Profil inconnu: ${companionId}`)
    process.exit(1)
  }

  const data = JSON.parse(readFileSync(corpusPath, 'utf8'))
  const scenarios = data.scenarios.filter((s) => {
    if (s.companionId !== companionId) return false
    if (affinity == null) return true
    const minA = s.affinity ?? s.minAffinity
    const maxA = s.affinity ?? s.maxAffinity ?? minA
    if (typeof minA !== 'number') return false
    return affinity >= minA && affinity <= (maxA ?? minA)
  })

  const preferred = preferredTones(weights)
  const mismatches = []

  for (const scenario of scenarios) {
    for (let ri = 0; ri < scenario.rounds.length; ri += 1) {
      const round = scenario.rounds[ri]
      const correct = round.choices.find((c) => c.score === 1)
      if (!correct) continue
      if (!preferred.includes(correct.tone)) {
        mismatches.push({
          id: scenario.id,
          title: scenario.title,
          affinity: scenario.affinity ?? scenario.minAffinity,
          round: ri + 1,
          correctTone: correct.tone,
          preferred,
          hint: scenario.roundToneHints?.[ri],
          correctText: correct.text.slice(0, 80),
        })
      }
    }
  }

  console.log(`Companion: ${companionId}`)
  console.log(`Profil top tones: ${preferred.join(', ')} (best: ${bestTone(weights)})`)
  console.log(`Scenarios scanned: ${scenarios.length}`)
  console.log(`Tone mismatches (correct choice not in top-2): ${mismatches.length}`)
  console.log('--- sample (max --limit) ---')
  for (const row of mismatches.slice(0, limit)) {
    console.log(
      `[aff${row.affinity}] ${row.id} r${row.round} — got ${row.correctTone}, want ${row.preferred.join('|')} — "${row.correctText}…"`,
    )
  }

  if (mismatches.length > limit) {
    console.log(`… +${mismatches.length - limit} autres (relire avec --limit)`)
  }
}

main()
