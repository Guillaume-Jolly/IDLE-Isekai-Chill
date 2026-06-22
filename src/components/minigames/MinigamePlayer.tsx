import type { ComponentType } from 'react'
import type { BuildingActivity, MinigameType } from '../../data/buildingActivities'
import { BeatTapGame } from './BeatTapGame'
import { BubblePopGame } from './BubblePopGame'
import { FamiliarCaptureGame } from './FamiliarCaptureGame'
import { HarvestRushGame } from './HarvestRushGame'
import { IdleFarmGame } from './IdleFarmGame'
import { MemoryPairsGame } from './MemoryPairsGame'
import { PetSanctuaryGame } from './PetSanctuaryGame'
import { SwapMatchGame } from './SwapMatchGame'
import { TapSequenceGame } from './TapSequenceGame'
import { TileMergeGame } from './TileMergeGame'
import { TimingBarGame } from './TimingBarGame'
import { TowerDefenseGame } from './TowerDefenseGame'
import { ConversationGame } from './ConversationGame'
import { DressageGame } from './DressageGame'
import type { MinigameCompleteHandler } from './MinigameFrame'
import type { MinigameSave } from '../../data/minigameSave'

type MinigamePlayerProps = {
  activity: BuildingActivity
  companionName: string
  buildingName: string
  resourceLabel: string
  onComplete: MinigameCompleteHandler
  onClose: () => void
  minigameSave?: MinigameSave
  onSaveMinigame?: (save: MinigameSave) => void
  companionAffinity?: number
}

const GAME_BY_TYPE: Record<MinigameType, ComponentType<MinigamePlayerProps>> = {
  'tap-sequence': TapSequenceGame,
  'harvest-rush': HarvestRushGame,
  'timing-bar': TimingBarGame,
  'bubble-pop': BubblePopGame,
  'tile-merge': TileMergeGame,
  'memory-pairs': MemoryPairsGame,
  'beat-tap': BeatTapGame,
  'swap-match': SwapMatchGame,
  'tower-defense': TowerDefenseGame,
  'idle-farm': IdleFarmGame,
  'pet-sanctuary': PetSanctuaryGame,
  'familiar-capture': FamiliarCaptureGame,
  dressage: DressageGame,
  conversation: ConversationGame,
}

export function MinigamePlayer(props: MinigamePlayerProps) {
  const Game = GAME_BY_TYPE[props.activity.minigameType]
  return <Game {...props} />
}
