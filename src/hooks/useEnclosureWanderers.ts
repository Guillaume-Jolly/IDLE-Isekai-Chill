import { useEffect, useRef, useState } from 'react'

import { clampToEnclosureBounds, resolveEnclosureObstacles, type EnclosureBounds, type EnclosureObstacle } from '../data/myrionRefuge'



export type ChibiBubble = 'none' | 'heart' | 'star' | 'zzz' | 'surprised'

export type ChibiMode = 'walk' | 'idle' | 'run' | 'hop' | 'sleep' | 'shake' | 'lie'

export type CareReaction = 'feed' | 'cuddle' | 'play' | 'observe'



export type EnclosureWanderer = {

  id: string

  speciesId: string

  name: string

  emoji: string

  x: number

  y: number

  vx: number

  vy: number

  facingLeft: boolean

  mode: ChibiMode

  bubble: ChibiBubble

  actionPop?: string

  actionPopUntil?: number

  reactionMode?: ChibiMode

  reactionUntil?: number

  reactionBoost?: boolean

}



type WandererInput = {

  id: string

  speciesId: string

  name: string

  emoji: string

}



type ReactionPreset = {

  actionEmoji: string

  bubble: ChibiBubble

  bubbleMs: number

  mode: ChibiMode

  modeMs: number

  runBoost?: boolean

}



const MIN_SEPARATION = 14

const SEPARATION_PASSES = 2



const REACTION_POOL: Record<CareReaction, ReactionPreset[]> = {

  feed: [

    { mode: 'hop', bubble: 'star', actionEmoji: '🍎', bubbleMs: 1400, modeMs: 700 },

    { mode: 'shake', bubble: 'star', actionEmoji: '🍎', bubbleMs: 1400, modeMs: 900 },

  ],

  cuddle: [

    { mode: 'shake', bubble: 'heart', actionEmoji: '💜', bubbleMs: 1800, modeMs: 1000 },

    { mode: 'hop', bubble: 'heart', actionEmoji: '💜', bubbleMs: 1800, modeMs: 750 },

    { mode: 'lie', bubble: 'heart', actionEmoji: '💜', bubbleMs: 2000, modeMs: 1400 },

  ],

  play: [

    { mode: 'run', bubble: 'surprised', actionEmoji: '🎾', bubbleMs: 1500, modeMs: 1400, runBoost: true },

    { mode: 'hop', bubble: 'star', actionEmoji: '🎾', bubbleMs: 1300, modeMs: 650, runBoost: true },

    { mode: 'run', bubble: 'star', actionEmoji: '🎾', bubbleMs: 1600, modeMs: 1500, runBoost: true },

  ],

  observe: [

    { mode: 'idle', bubble: 'surprised', actionEmoji: '👀', bubbleMs: 1200, modeMs: 900 },

    { mode: 'lie', bubble: 'zzz', actionEmoji: '👀', bubbleMs: 1600, modeMs: 1200 },

    { mode: 'shake', bubble: 'surprised', actionEmoji: '👀', bubbleMs: 1100, modeMs: 800 },

  ],

}



const rand = (min: number, max: number) => min + Math.random() * (max - min)



function pickReaction(action: CareReaction): ReactionPreset {

  const pool = REACTION_POOL[action]

  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0]

}



function applyObstacles(sprite: EnclosureWanderer, obstacles: EnclosureObstacle[]): EnclosureWanderer {
  if (obstacles.length === 0) return sprite
  const resolved = resolveEnclosureObstacles(sprite.x, sprite.y, sprite.vx, sprite.vy, obstacles)
  return { ...sprite, ...resolved }
}

function spawnWanderer(
  item: WandererInput,
  index: number,
  total: number,
  bounds: EnclosureBounds,
  obstacles: EnclosureObstacle[] = [],
): EnclosureWanderer {
  const vx = (index % 2 === 0 ? 1 : -1) * rand(0.12, 0.28)
  const cols = Math.max(1, Math.ceil(Math.sqrt(total)))
  const rows = Math.max(1, Math.ceil(total / cols))
  const col = index % cols
  const row = Math.floor(index / cols)
  const cellX = bounds.minX + ((col + 0.5) / cols) * (bounds.maxX - bounds.minX)
  const cellY = bounds.minY + ((row + 0.5) / rows) * (bounds.maxY - bounds.minY)
  const spawn = clampToEnclosureBounds(cellX + rand(-5, 5), cellY + rand(-5, 5), bounds)
  const resolved = resolveEnclosureObstacles(spawn.x, spawn.y, vx, 0, obstacles)

  return {
    ...item,
    x: resolved.x,
    y: resolved.y,
    vx: resolved.vx,
    vy: (index % 3 === 0 ? 1 : -1) * rand(0.08, 0.22) + resolved.vy,
    facingLeft: vx < 0,
    mode: 'walk',
    bubble: 'none',
  }
}

function syncWanderers(
  current: EnclosureWanderer[],
  items: WandererInput[],
  bounds: EnclosureBounds,
  obstacles: EnclosureObstacle[] = [],
): EnclosureWanderer[] {
  const byId = new Map(current.map((sprite) => [sprite.id, sprite]))
  return items.map((item, index) => {
    const existing = byId.get(item.id)
    if (existing) {
      const clamped = clampToEnclosureBounds(existing.x, existing.y, bounds)
      return applyObstacles(
        {
          ...existing,
          ...clamped,
          speciesId: item.speciesId,
          name: item.name,
          emoji: item.emoji,
        },
        obstacles,
      )
    }

    return spawnWanderer(item, index, items.length, bounds, obstacles)
  })
}



function applyRepulsion(sprite: EnclosureWanderer, others: EnclosureWanderer[]) {

  let pushX = 0

  let pushY = 0



  for (const other of others) {

    if (other.id === sprite.id) continue

    const dx = sprite.x - other.x

    const dy = sprite.y - other.y

    const dist = Math.hypot(dx, dy)

    if (dist >= MIN_SEPARATION || dist < 0.001) continue

    const strength = (MIN_SEPARATION - dist) / MIN_SEPARATION

    pushX += (dx / dist) * strength

    pushY += (dy / dist) * strength

  }



  if (pushX === 0 && pushY === 0) return sprite



  return {

    ...sprite,

    x: sprite.x + pushX * 0.35,

    y: sprite.y + pushY * 0.35,

    vx: sprite.vx + pushX * 0.08,

    vy: sprite.vy + pushY * 0.08,

  }

}



function separateWanderers(
  sprites: EnclosureWanderer[],
  bounds: EnclosureBounds,
  obstacles: EnclosureObstacle[] = [],
): EnclosureWanderer[] {

  let next = sprites.map((sprite) => ({ ...sprite }))



  for (let pass = 0; pass < SEPARATION_PASSES; pass += 1) {

    for (let i = 0; i < next.length; i += 1) {

      for (let j = i + 1; j < next.length; j += 1) {

        const a = next[i]

        const b = next[j]

        const dx = b.x - a.x

        const dy = b.y - a.y

        const dist = Math.hypot(dx, dy)

        if (dist >= MIN_SEPARATION || dist < 0.001) continue



        const overlap = (MIN_SEPARATION - dist) / 2

        const nx = dx / dist

        const ny = dy / dist



        a.x -= nx * overlap

        a.y -= ny * overlap

        b.x += nx * overlap

        b.y += ny * overlap



        a.vx -= nx * 0.04

        a.vy -= ny * 0.04

        b.vx += nx * 0.04

        b.vy += ny * 0.04

      }

    }



    next = next.map((sprite) =>
      applyObstacles(
        {
          ...sprite,
          ...clampToEnclosureBounds(sprite.x, sprite.y, bounds),
        },
        obstacles,
      ),
    )

  }



  return next

}



function clearExpiredReaction(sprite: EnclosureWanderer, now: number): EnclosureWanderer {

  let next = sprite



  if (next.actionPopUntil && now >= next.actionPopUntil) {

    next = { ...next, actionPop: undefined, actionPopUntil: undefined }

  }



  if (next.reactionUntil && now >= next.reactionUntil) {

    next = {

      ...next,

      reactionMode: undefined,

      reactionUntil: undefined,

      reactionBoost: undefined,

      mode: next.mode === next.reactionMode ? 'idle' : next.mode,

    }

  }



  if (next.bubble !== 'none' && next.actionPopUntil && now >= next.actionPopUntil) {

    next = { ...next, bubble: 'none' }

  }



  return next

}



export function useEnclosureWanderers(
  items: WandererInput[],
  bounds: EnclosureBounds,
  obstacles: EnclosureObstacle[] = [],
) {
  const itemKey = items.map((item) => item.id).join(',')
  const boundsKey = `${bounds.minX}-${bounds.maxX}-${bounds.minY}-${bounds.maxY}`
  const obstaclesKey = obstacles.map((o) => `${o.x}-${o.y}-${o.radius}`).join('|')
  const bubbleTimers = useRef<Map<string, number>>(new Map())

  const [wanderers, setWanderers] = useState<EnclosureWanderer[]>(() =>
    items.map((item, index) => spawnWanderer(item, index, items.length, bounds, obstacles)),
  )

  useEffect(() => {
    setWanderers((current) => syncWanderers(current, items, bounds, obstacles))
  }, [boundsKey, itemKey, obstaclesKey])



  useEffect(() => {

    const timer = window.setInterval(() => {

      const now = Date.now()

      setWanderers((current) => {

        const moved = current.map((sprite) => {

          const next = clearExpiredReaction(sprite, now)

          let { x, y, vx, vy, mode, bubble, facingLeft } = next
          const { reactionMode, reactionBoost } = next



          if (bubble !== 'none') {

            const until = bubbleTimers.current.get(sprite.id) ?? 0

            if (now >= until) {

              bubble = 'none'

              bubbleTimers.current.delete(sprite.id)

            }

          }



          if (reactionMode && next.reactionUntil && now < next.reactionUntil) {

            mode = reactionMode



            if (reactionMode === 'run' && reactionBoost) {

              x += vx * 2.4

              y += vy * 1.6

              facingLeft = vx < 0

            } else if (reactionMode === 'hop' || reactionMode === 'shake') {

              vx *= 0.92

              vy *= 0.92

            } else if (reactionMode === 'lie') {

              vx = 0

              vy = 0

            }



            const updated = {

              ...next,

              ...clampToEnclosureBounds(x, y, bounds),

              vx,

              vy,

              mode,

              bubble,

              facingLeft,

            }

            return applyRepulsion(applyObstacles(updated, obstacles), current)

          }



          if (mode === 'sleep') {

            if (Math.random() < 0.015) {

              mode = 'idle'

              bubble = 'none'

            }

            return { ...next, mode, bubble }

          }



          if (mode === 'idle') {

            if (Math.random() < 0.04) {

              mode = 'walk'

              vx = (Math.random() < 0.5 ? -1 : 1) * rand(0.1, 0.24)

              vy = (Math.random() < 0.5 ? -1 : 1) * rand(0.08, 0.18)

            } else if (Math.random() < 0.008) {

              mode = 'sleep'

              bubble = 'zzz'

            }

            return { ...next, mode, bubble, vx, vy }

          }



          if (mode === 'hop' || mode === 'shake' || mode === 'lie') {

            return { ...next, mode, bubble }

          }



          x += vx

          y += vy



          if (x < bounds.minX || x > bounds.maxX) {

            vx = -vx

            x = Math.max(bounds.minX, Math.min(bounds.maxX, x))

            facingLeft = vx < 0

          }

          if (y < bounds.minY || y > bounds.maxY) {

            vy = -vy

            y = Math.max(bounds.minY, Math.min(bounds.maxY, y))

          }



          const speed = Math.abs(vx) + Math.abs(vy)

          mode = speed > 0.32 ? 'run' : 'walk'



          if (Math.random() < 0.012) {

            mode = 'idle'

            vx = 0

            vy = 0

          } else if (Math.random() < 0.006) {

            mode = 'hop'

          } else if (Math.random() < 0.003) {

            mode = 'run'

            vx = (vx >= 0 ? 1 : -1) * rand(0.34, 0.48)

            vy = (vy >= 0 ? 1 : -1) * rand(0.24, 0.38)

            facingLeft = vx < 0

          }



          const updated = {

            ...next,

            ...clampToEnclosureBounds(x, y, bounds),

            vx,

            vy,

            mode,

            bubble,

            facingLeft,

          }

          return applyRepulsion(applyObstacles(updated, obstacles), current)

        })



        return separateWanderers(moved, bounds, obstacles)

      })

    }, 48)



    return () => window.clearInterval(timer)

  }, [bounds.maxX, bounds.maxY, bounds.minX, bounds.minY, boundsKey, itemKey, obstaclesKey])



  const flashBubble = (id: string, bubble: ChibiBubble, durationMs = 1800) => {

    bubbleTimers.current.set(id, Date.now() + durationMs)

    setWanderers((current) =>

      current.map((sprite) =>

        sprite.id === id ? { ...sprite, bubble, mode: bubble === 'heart' ? 'hop' : sprite.mode } : sprite,

      ),

    )

  }



  const triggerCareReaction = (id: string, action: CareReaction) => {

    const preset = pickReaction(action)

    const now = Date.now()

    bubbleTimers.current.set(id, now + preset.bubbleMs)



    setWanderers((current) =>

      current.map((sprite) => {

        if (sprite.id !== id) return sprite



        let vx = sprite.vx

        let vy = sprite.vy

        let facingLeft = sprite.facingLeft



        if (preset.runBoost) {

          vx = (Math.random() < 0.5 ? -1 : 1) * rand(0.38, 0.52)

          vy = (Math.random() < 0.5 ? -1 : 1) * rand(0.22, 0.36)

          facingLeft = vx < 0

        }



        return {

          ...sprite,

          vx,

          vy,

          facingLeft,

          bubble: preset.bubble,

          actionPop: preset.actionEmoji,

          actionPopUntil: now + preset.bubbleMs,

          reactionMode: preset.mode,

          reactionUntil: now + preset.modeMs,

          reactionBoost: preset.runBoost,

          mode: preset.mode,

        }

      }),

    )

  }



  return { wanderers, flashBubble, triggerCareReaction }

}


