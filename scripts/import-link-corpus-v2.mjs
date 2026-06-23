/**
 * Importe wonderland_companion_link_corpus_v2_clean_compact.zip → src/data/linkCorpusV2.json
 * Ne modifie pas companionScenarios.generated.ts (legacy conservé).
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const importDir = join(root, 'assets/link-corpus-import')
const zipPath = join(importDir, 'wonderland_companion_link_corpus_v2_clean_compact.zip')
const extractDir = join(importDir, '_extract')
const outPath = join(root, 'src/data/linkCorpusV2.json')
const backupPath = join(root, 'src/data/linkCorpusV2.backup.json')

function findFirstJson(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      const nested = findFirstJson(full)
      if (nested) return nested
    } else if (name.endsWith('.json')) {
      return full
    }
  }
  return null
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
  throw new Error('Format corpus non reconnu après extraction')
}

function main() {
  if (!existsSync(zipPath)) {
    console.error(`Corpus zip introuvable: ${zipPath}`)
    console.error('Voir assets/link-corpus-import/README.md')
    process.exit(2)
  }

  if (existsSync(extractDir)) rmSync(extractDir, { recursive: true, force: true })
  mkdirSync(extractDir, { recursive: true })

  if (process.platform === 'win32') {
    const zipEsc = zipPath.replace(/'/g, "''")
    const destEsc = extractDir.replace(/'/g, "''")
    execSync(
      `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipEsc}' -DestinationPath '${destEsc}' -Force"`,
      { stdio: 'inherit' },
    )
  } else {
    execSync(`unzip -q "${zipPath}" -d "${extractDir}"`, { stdio: 'inherit' })
  }

  const jsonSource = findFirstJson(extractDir)
  if (!jsonSource) {
    console.error('Aucun JSON trouvé dans le zip extrait.')
    process.exit(1)
  }

  const raw = readFileSync(jsonSource, 'utf8')
  const parsed = JSON.parse(raw)
  const entries = normalizeEntries(parsed)

  entries.sort((a, b) => {
    const ca = a.companionId ?? a.companion ?? ''
    const cb = b.companionId ?? b.companion ?? ''
    if (ca !== cb) return ca.localeCompare(cb)
    return String(a.id ?? '').localeCompare(String(b.id ?? ''))
  })

  if (existsSync(outPath)) {
    writeFileSync(backupPath, readFileSync(outPath))
    console.log(`Backup: ${backupPath}`)
  }

  writeFileSync(outPath, `${JSON.stringify({ version: 2, scenarios: entries }, null, 2)}\n`)
  console.log(`Écrit: ${outPath} (${entries.length} scénarios)`)
  console.log('Lancer: npm run validate:link-corpus')
}

main()
