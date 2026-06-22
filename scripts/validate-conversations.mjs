import { COMPANION_SCENARIO_PACKS, SCENARIOS_PER_COMPANION } from '../src/data/conversations/companionScenarios.generated.ts'

const issues = []

for (const [companionId, pack] of Object.entries(COMPANION_SCENARIO_PACKS)) {
  for (let i = 0; i < SCENARIOS_PER_COMPANION; i++) {
    const scenario = pack[i]
    if (!scenario) {
      issues.push(`${companionId} missing scenario ${i}`)
      continue
    }
    if (!scenario.rounds || scenario.rounds.length !== 3) {
      issues.push(`${companionId} ${scenario.id} rounds=${scenario.rounds?.length}`)
    }
    for (let r = 0; r < (scenario.rounds?.length ?? 0); r++) {
      const round = scenario.rounds[r]
      if (!round?.prompt) issues.push(`${companionId} ${scenario.id} r${r} prompt=${round?.prompt}`)
      for (const field of ['prompt', ...round?.choices?.flatMap((_, ci) => [`choices[${ci}].text`, `choices[${ci}].reaction`]) ?? []]) {
        // skip complex
      }
      round?.choices?.forEach((choice, ci) => {
        if (choice.text == null) issues.push(`${companionId} ${scenario.id} r${r} c${ci} text null`)
        if (choice.reaction == null) issues.push(`${companionId} ${scenario.id} r${r} c${ci} reaction null`)
      })
      round?.context?.forEach((line, li) => {
        if (line == null) issues.push(`${companionId} ${scenario.id} r${r} ctx${li} null`)
      })
    }
  }
}

console.log(`Issues: ${issues.length}`)
issues.slice(0, 50).forEach((line) => console.log(line))
