import type { ReactNode } from 'react'
import type { Biome, PalmonSpecies } from '../../data/wildFamiliars'
import type { GuidePose } from '../../data/minigameAssets'
import { BiomeBackground } from './BiomeBackground'
import { GuideCompanionCutout } from './GuideCompanionCutout'
import { PalmonSprite } from './PalmonSprite'
import './Minigames.css'

type BiomeEncounterSceneProps = {
  biome: Biome
  palmon: PalmonSpecies
  biomeBgFailed: boolean
  onBiomeBgError: () => void
  captureRing?: ReactNode
  dimmed?: boolean
  /** Compagnon en detourage sur le cote (ex. Talia qui pointe). */
  guideCompanion?: {
    id: string
    name: string
    side?: 'left' | 'right'
    pose?: GuidePose
    biomeId?: string
  }
}

export function BiomeEncounterScene({
  biome,
  palmon,
  biomeBgFailed,
  onBiomeBgError,
  captureRing,
  dimmed = false,
  guideCompanion,
}: BiomeEncounterSceneProps) {
  return (
    <div
      aria-label={`Biome ${biome.name}, ${palmon.name}`}
      className={`mg-capture-field mg-capture-field-biome mg-biome-scene ${dimmed ? 'dimmed' : ''}`}
      role="img"
      style={{ background: biome.fallbackGradient }}
    >
      {!biomeBgFailed && (
        <BiomeBackground
          biomeId={biome.id}
          className="mg-capture-biome-bg"
          layout="auto"
          onFailed={onBiomeBgError}
        />
      )}

      {guideCompanion && (
        <GuideCompanionCutout
          biomeId={biome.id}
          companionId={guideCompanion.id}
          name={guideCompanion.name}
          pose={guideCompanion.pose ?? 'point'}
          side={guideCompanion.side ?? 'left'}
        />
      )}

      <div className="mg-biome-center-slot">
        <PalmonSprite
          key={palmon.id}
          emoji={palmon.emoji}
          name={palmon.name}
          size="encounter"
          speciesId={palmon.id}
          variant="full"
        />
        <p className="mg-capture-palmon-name">{palmon.name}</p>
        <span className="mg-rarity-badge">{palmon.rarity}</span>
      </div>

      {captureRing && <div className="mg-biome-capture-layer">{captureRing}</div>}
    </div>
  )
}
