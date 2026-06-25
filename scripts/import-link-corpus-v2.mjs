/**
 * Importe le corpus Lien v2 → src/data/linkCorpusV2.json (format ScenarioScript).
 * Source : JSONL dans scripts/references/link-corpus/ ou zip compact.
 * Ne modifie pas companionScenarios.generated.ts (legacy conservé).
 */
import { execSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
import { oldAssetsRoot, pipelineReferencesRoot } from './minigame-asset-paths.mjs'

const importDir = join(pipelineReferencesRoot, 'link-corpus')
const jsonlPath = join(importDir, 'companion_link_conversations.v2.clean.jsonl')
const zipPath = join(oldAssetsRoot, 'prompts-archive/link-corpus-import/wonderland_companion_link_corpus_v2_clean_compact.zip')
const extractDir = join(importDir, '_extract')
const outPath = join(root, 'src/data/linkCorpusV2.json')
const backupPath = join(root, 'src/data/linkCorpusV2.backup.json')

const VALID_TONES = new Set(['sincere', 'playful', 'direct', 'romantic'])

function findFirstJson(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      const nested = findFirstJson(full)
      if (nested) return nested
    } else if (name.endsWith('.json') && name !== 'manifest.json') {
      return full
    }
  }
  return null
}

function findFirstJsonl(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      const nested = findFirstJsonl(full)
      if (nested) return nested
    } else if (name.endsWith('.jsonl')) {
      return full
    }
  }
  return null
}

function powershellExe() {
  if (process.env.SystemRoot) {
    return join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  }
  return 'powershell'
}

function extractZip() {
  if (existsSync(extractDir)) rmSync(extractDir, { recursive: true, force: true })
  mkdirSync(extractDir, { recursive: true })

  if (process.platform === 'win32') {
    const ps = powershellExe()
    const zipEsc = zipPath.replace(/'/g, "''")
    const destEsc = extractDir.replace(/'/g, "''")
    execSync(
      `"${ps}" -NoProfile -Command "Expand-Archive -LiteralPath '${zipEsc}' -DestinationPath '${destEsc}' -Force"`,
      { stdio: 'inherit' },
    )
  } else {
    execSync(`unzip -q "${zipPath}" -d "${extractDir}"`, { stdio: 'inherit' })
  }
}

async function loadJsonl(path) {
  const entries = []
  const rl = createInterface({ input: createReadStream(path, 'utf8'), crlfDelay: Infinity })
  let lineNo = 0
  for await (const line of rl) {
    lineNo += 1
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      entries.push(JSON.parse(trimmed))
    } catch {
      throw new Error(`JSONL ${path} ligne ${lineNo}: JSON invalide`)
    }
  }
  return entries
}

function normalizeEntries(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data.scenarios)) return data.scenarios
  if (Array.isArray(data.conversations)) return data.conversations
  if (data.packs && typeof data.packs === 'object') {
    return Object.entries(data.packs).flatMap(([companionId, scenarios]) =>
      scenarios.map((scenario) => ({ ...scenario, companionId })),
    )
  }
  throw new Error('Format corpus non reconnu')
}

function roundToneHintFromChoices(choices, fallback = 'sincere') {
  const correct = choices.find((choice) => choice.score === 1)
  if (correct && VALID_TONES.has(correct.tone)) return correct.tone
  return fallback
}

/** Convertit une entrée corpus V2 (JSONL) en ScenarioScript + companionId. */
export function convertV2Entry(entry) {
  const companionId = entry.companionId ?? entry.companion ?? entry.companion_id
  const affinity = entry.affinity ?? entry.minAffinity ?? 1
  const fallbackTone = entry.primaryTone ?? entry.preferredTones?.[0] ?? 'sincere'

  const rounds = entry.rounds.map((round, roundIndex) => {
    const context = []
    if (roundIndex === 0 && entry.context?.trim()) context.push(entry.context.trim())
    if (round.narrator?.trim()) context.push(round.narrator.trim())
    if (round.companionLine?.trim()) context.push(round.companionLine.trim())

    const choices = round.choices.map((choice) => ({
      text: choice.text,
      tone: choice.tone,
      reaction: choice.reaction,
    }))

    return { context, prompt: round.prompt, choices }
  })

  const roundToneHints = entry.rounds.map((round) =>
    roundToneHintFromChoices(round.choices, fallbackTone),
  )

  return {
    id: entry.id,
    companionId,
    title: entry.title,
    minAffinity: affinity,
    maxAffinity: entry.maxAffinity ?? affinity,
    roundToneHints,
    rounds,
  }
}

async function resolveSourceEntries() {
  if (existsSync(jsonlPath)) {
    console.log(`Source JSONL: ${jsonlPath}`)
    return loadJsonl(jsonlPath)
  }

  if (existsSync(zipPath)) {
    console.log(`Extraction zip: ${zipPath}`)
    extractZip()
    const extractedJsonl = findFirstJsonl(extractDir)
    if (extractedJsonl) {
      console.log(`Source JSONL (zip): ${extractedJsonl}`)
      return loadJsonl(extractedJsonl)
    }
    const jsonSource = findFirstJson(extractDir)
    if (!jsonSource) {
      throw new Error('Aucun JSON/JSONL trouvé dans le zip extrait.')
    }
    console.log(`Source JSON: ${jsonSource}`)
    const parsed = JSON.parse(readFileSync(jsonSource, 'utf8'))
    return normalizeEntries(parsed)
  }

  throw new Error(
    `Corpus introuvable. Déposer ${jsonlPath} ou ${zipPath} (voir scripts/references/link-corpus/README.md)`,
  )
}

async function main() {
  const rawEntries = await resolveSourceEntries()
  const rejected = []

  const scenarios = rawEntries
    .map((entry) => {
      try {
        return convertV2Entry(entry)
      } catch (error) {
        rejected.push({ id: entry.id ?? '?', reason: error.message })
        return null
      }
    })
    .filter(Boolean)

  scenarios.sort((a, b) => {
    if (a.companionId !== b.companionId) return a.companionId.localeCompare(b.companionId)
    if (a.minAffinity !== b.minAffinity) return a.minAffinity - b.minAffinity
    return String(a.id).localeCompare(String(b.id))
  })

  if (existsSync(outPath)) {
    writeFileSync(backupPath, readFileSync(outPath))
    console.log(`Backup: ${backupPath}`)
  }

  writeFileSync(outPath, `${JSON.stringify({ version: 2, scenarios, rejected }, null, 2)}\n`)
  console.log(`Écrit: ${outPath} (${scenarios.length} scénarios, ${rejected.length} rejetés)`)
  console.log('Lancer: npm run validate:link-corpus')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
