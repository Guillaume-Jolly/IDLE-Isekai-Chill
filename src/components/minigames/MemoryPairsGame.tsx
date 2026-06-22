import { useMemo, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const RUNES = ['✦', '☽', '♨', '❀', '✧', '☆']

type Card = { id: number; symbol: string; flipped: boolean; matched: boolean }

function buildDeck(): Card[] {
  const symbols = RUNES.slice(0, 4)
  const pairs = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({ id: index, symbol, flipped: false, matched: false }))
  return pairs
}

export function MemoryPairsGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [cards, setCards] = useState(buildDeck)
  const [openIds, setOpenIds] = useState<number[]>([])
  const [pairs, setPairs] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [moves, setMoves] = useState(0)

  const maxPairs = 4

  const flip = (card: Card) => {
    if (status !== 'playing' || card.flipped || card.matched || openIds.length >= 2) return
    const nextOpen = [...openIds, card.id]
    setCards((current) =>
      current.map((item) => (item.id === card.id ? { ...item, flipped: true } : item)),
    )
    setOpenIds(nextOpen)
    if (nextOpen.length === 2) {
      const nextMoves = moves + 1
      setMoves(nextMoves)
      const [a, b] = nextOpen.map((id) => cards.find((item) => item.id === id)!)
      window.setTimeout(() => {
        if (a.symbol === b.symbol) {
          setCards((current) =>
            current.map((item) =>
              item.id === a.id || item.id === b.id ? { ...item, matched: true } : item,
            ),
          )
          const nextPairs = pairs + 1
          setPairs(nextPairs)
          if (nextPairs >= maxPairs) {
            setStatus('won')
            onComplete(maxPairs, maxPairs, scaleReward(activity.baseReward, maxPairs, maxPairs))
          }
        } else {
          setCards((current) =>
            current.map((item) =>
              item.id === a.id || item.id === b.id ? { ...item, flipped: false } : item,
            ),
          )
          if (nextMoves >= 10) {
            setStatus('lost')
            onComplete(pairs, maxPairs, scaleReward(activity.baseReward, pairs, maxPairs))
          }
        }
        setOpenIds([])
      }, 650)
    }
  }

  const restart = () => {
    setCards(buildDeck())
    setOpenIds([])
    setPairs(0)
    setMoves(0)
    setStatus('playing')
  }

  const hidden = useMemo(() => cards.filter((card) => !card.matched).length, [cards])

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={maxPairs}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={pairs}
      status={status}
    >
      <div className="mg-memory">
        <p className="mg-flash">
          Paires {pairs}/{maxPairs} — coups {moves}/10 — reste {hidden}
        </p>
        <div className="mg-memory-grid">
          {cards.map((card) => (
            <button
              className={`mg-memory-card ${card.flipped || card.matched ? 'open' : ''} ${card.matched ? 'matched' : ''}`}
              key={card.id}
              type="button"
              onClick={() => flip(card)}
            >
              {card.flipped || card.matched ? card.symbol : '?'}
            </button>
          ))}
        </div>
      </div>
    </MinigameFrame>
  )
}
