import { createInitialRunState, computeWheelSegments } from '../src/data/destinyWheel/destinyWheelEngine.ts'
import { getSortedWheels, loadDestinyWheelSeed, loadWheelPackSeed } from '../src/data/destinyWheel/seedLoader.ts'
import { planWheelLabels, verifyLabelPlans, LABEL_ZONE_R_INNER_RATIO, LABEL_ZONE_R_OUTER_RATIO, computeSegmentLabelZone } from '../src/data/destinyWheel/wheelLabelPlanner.ts'

function validateWheels(label, seed, wheels) {
  let failures = 0
  for (const wheel of wheels) {
    const state = createInitialRunState(seed)
    const segments = computeWheelSegments(state, wheel, seed)
    const plans = planWheelLabels(segments, null)
    const visible = [...plans.values()].filter(Boolean).length
    const { ok, overlaps } = verifyLabelPlans(segments, plans)

    const sample = segments[0]
    const sampleZone = computeSegmentLabelZone(sample)
    const innerRatio = sampleZone.innerR / 182
    const outerRatio = sampleZone.outerR / 182
    if (Math.abs(innerRatio - LABEL_ZONE_R_INNER_RATIO) > 0.01 || Math.abs(outerRatio - LABEL_ZONE_R_OUTER_RATIO) > 0.01) {
      failures += 1
      console.error(
        `[validate:wheel-labels] FAIL ${label}/${wheel.id} — zone radiale ${innerRatio.toFixed(2)}–${outerRatio.toFixed(2)} (attendu ${LABEL_ZONE_R_INNER_RATIO}–${LABEL_ZONE_R_OUTER_RATIO})`,
      )
    }

    if (!ok) {
      failures += 1
      console.error(`[validate:wheel-labels] FAIL ${label}/${wheel.id} — ${overlaps.length} overlap(s)`)
      for (const line of overlaps.slice(0, 5)) console.error(`  · ${line}`)
    } else {
      console.log(`[validate:wheel-labels] OK ${label}/${wheel.id} — ${visible}/${segments.length} labels`)
    }
  }
  return failures
}

let failures = 0
const havreSeed = loadDestinyWheelSeed()
failures += validateWheels('havre', havreSeed, getSortedWheels(havreSeed).slice(0, 12))

const disgaeaSeed = loadWheelPackSeed('disgaea')
const disgaeaWheels = getSortedWheels(disgaeaSeed).filter((wheel) =>
  ['rank', 'rpg_class', 'origin_world', 'crime_debt'].includes(wheel.id),
)
failures += validateWheels('disgaea', disgaeaSeed, disgaeaWheels)

if (failures > 0) {
  console.error(`[validate:wheel-labels] ${failures} wheel(s) with overlaps`)
  process.exit(1)
}

console.log('[validate:wheel-labels] complete')
