import type { CommentatorBucket, CommentatorLine, DestinyWheelSeed, RunState, WheelItem } from './types.ts'

const SPEAKERS = ['laharl', 'etna', 'flonne'] as const

function mapReactionBucket(reaction: string | undefined, rarity: string, state: RunState): CommentatorBucket {
  if (state.tags.contradiction > 0 || reaction === 'contradiction') return 'contradiction'
  if (reaction === 'stat_disaster' || reaction === 'disaster' || rarity === 'cursed') return 'negative'
  if (['legendary', 'mythic', 'illegal', 'cosmic_bug', 'epic', 'mist_touched', 'anomaly', 'havre_destiny'].includes(rarity)) return 'positive'
  if (reaction === 'stat_hype' || reaction === 'ultimate' || reaction === 'boss') return 'positive'
  if (reaction === 'negative' || reaction === 'curse') return 'negative'
  return 'neutral'
}

function pickLine(lines: string[], rng: () => number): string {
  if (lines.length === 0) return '…'
  return lines[Math.floor(rng() * lines.length)] ?? lines[0]
}

export function resolveCommentatorLine(
  state: RunState,
  seed: DestinyWheelSeed,
  item: WheelItem,
  wheelId: string,
): CommentatorLine {
  const bucket = mapReactionBucket(item.reaction, item.rarity, state)
  const speaker = SPEAKERS[Math.floor(state.rng() * SPEAKERS.length)] ?? 'etna'
  const def = seed.commentators[speaker]
  const text = pickLine(def?.[bucket] ?? [], state.rng)
  return { speaker, bucket, text, wheelId }
}

export function resolveFinalComment(state: RunState, seed: DestinyWheelSeed): CommentatorLine {
  const bucket: CommentatorBucket =
    (state.finalVerdict?.priority ?? 0) >= 100 ? 'positive' : state.tags.curse ? 'negative' : 'neutral'
  const speaker = SPEAKERS[Math.floor(state.rng() * SPEAKERS.length)] ?? 'laharl'
  const def = seed.commentators[speaker]
  return { speaker, bucket, text: pickLine(def?.[bucket] ?? [], state.rng) }
}
