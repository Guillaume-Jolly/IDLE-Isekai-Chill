import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function fail(message) {
  console.error(`[validate:destiny-wheel] FAIL — ${message}`)
  process.exitCode = 1
}

function ok(message) {
  console.log(`[validate:destiny-wheel] OK — ${message}`)
}

function validateSeedShape(seed, label) {
  const wheelIds = new Set()
  for (const wheel of seed.wheels ?? []) {
    if (!wheel.id) fail(`${label}: wheel missing id at order ${wheel.order}`)
    if (wheelIds.has(wheel.id)) fail(`${label}: duplicate wheel id: ${wheel.id}`)
    wheelIds.add(wheel.id)
    if (!Array.isArray(wheel.items) || wheel.items.length === 0) fail(`${label}: wheel ${wheel.id} has no items`)
    for (const item of wheel.items) {
      if (!item.id || !item.label) fail(`${label}: wheel ${wheel.id} item missing id/label`)
      const weight = item.base_weight ?? item.baseWeight
      if (typeof weight !== 'number') fail(`${label}: wheel ${wheel.id} item ${item.id} missing base_weight`)
      if (weight < 0) fail(`${label}: wheel ${wheel.id} item ${item.id} has negative weight`)
    }
  }

  for (const wheel of seed.wheels ?? []) {
    for (const item of wheel.items ?? []) {
      for (const unlockId of item.unlock_wheels ?? []) {
        if (!wheelIds.has(unlockId)) fail(`${label}: item ${item.id} unlocks missing wheel ${unlockId}`)
      }
    }
  }

  for (const combo of seed.combo_rules ?? []) {
    if (typeof combo.priority !== 'number') fail(`${label}: combo ${combo.id} missing priority`)
  }

  for (const verdict of seed.verdict_rules ?? []) {
    if (typeof verdict.priority !== 'number') fail(`${label}: verdict ${verdict.id} missing priority`)
  }

  ok(`${label}: ${seed.wheels.length} wheels · ${seed.combo_rules?.length ?? 0} combos · ${seed.verdict_rules?.length ?? 0} verdicts`)
}

const engineUrl = new URL('../src/data/destinyWheel/destinyWheelEngine.ts', import.meta.url)
const packsUrl = new URL('../src/data/destinyWheel/wheelPacks.ts', import.meta.url)

let runAutoSimulation
let loadWheelPackSeed
try {
  ;({ runAutoSimulation } = await import(engineUrl.href))
  ;({ loadWheelPackSeed } = await import(packsUrl.href))
} catch (error) {
  fail(`Engine import failed (run npm run build first if needed): ${error instanceof Error ? error.message : error}`)
  process.exit(1)
}

for (const packId of ['havre', 'disgaea']) {
  const seed = loadWheelPackSeed(packId)
  validateSeedShape(seed, packId)

  const simulation = runAutoSimulation(100, seed)
  ok(`${packId}: 100 auto-runs · wheels ${simulation.minWheels}-${simulation.maxWheels}`)

  const minExpected = packId === 'havre' ? 28 : 20
  if (simulation.minWheels < minExpected) {
    fail(`${packId}: expected at least ~${minExpected} wheels per run, got min ${simulation.minWheels}`)
  }
}

if (process.exitCode) process.exit(process.exitCode)
ok('Validation complete')
