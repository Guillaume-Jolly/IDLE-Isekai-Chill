import type { HsbColor } from './scoring'
import { DIALED_COLOR_ROUNDS } from './scoring'

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Pastilles abstraites — saturation/luminosité modérées (mode facile). */
export function buildAbstractColorRounds(count = DIALED_COLOR_ROUNDS): HsbColor[] {
  const rounds: HsbColor[] = []
  for (let i = 0; i < count; i += 1) {
    rounds.push({
      h: Math.floor(Math.random() * 360),
      s: Math.round(randomInRange(35, 88)),
      b: Math.round(randomInRange(35, 88)),
    })
  }
  return rounds
}
