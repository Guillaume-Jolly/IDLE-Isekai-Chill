import type { DialogueChoice } from './types'

type FourChoices = [DialogueChoice, DialogueChoice, DialogueChoice, DialogueChoice]

function shuffleChoices<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

/** Dev : +3 → +0. Prod : ordre aléatoire à chaque échange. */
export function orderDialogueChoices(choices: FourChoices): FourChoices {
  if (import.meta.env.DEV) {
    const sorted = [...choices].sort((left, right) => right.score - left.score)
    return sorted as FourChoices
  }
  return shuffleChoices(choices) as FourChoices
}
