import type { CSSProperties, ReactNode } from 'react'
import type { HuntPhase } from '../../data/captureHunt'
import type { Biome, PalmonSpecies } from '../../data/wildFamiliars'
import { RARITY_AURA_COLORS, RARITY_COLORS, RARITY_ENCOUNTER_SCALE } from '../../data/wildFamiliars'
import type { GuidePose } from '../../data/minigameAssets'
import { BiomeAmbientParticles } from './BiomeAmbientParticles'
import { BiomeBackground } from './BiomeBackground'
import { GuideCompanionCutout } from './GuideCompanionCutout'
import { PalmonSprite } from './PalmonSprite'
import { useIsMobileCapture } from '../../hooks/useMediaQuery'
import './Minigames.css'

type HuntSceneProps = {
  biome: Biome
  palmon: PalmonSpecies
  biomeBgFailed: boolean
  onBiomeBgError: () => void
  huntPhase: HuntPhase
  captureUi?: ReactNode
  guideCompanion?: {
    id: string
    name: string
    side?: 'left' | 'right'
    pose?: GuidePose
    speech?: {
      line: string
      detail?: string
      tone: 'success' | 'failed'
    }
  }
  resultOverlay?: ReactNode
  paused?: boolean
}

export function HuntScene({
  biome,
  palmon,
  biomeBgFailed,
  onBiomeBgError,
  huntPhase,
  captureUi,
  guideCompanion,
  resultOverlay,
  paused = false,
}: HuntSceneProps) {
  const isMobile = useIsMobileCapture()
  const showIdentity = huntPhase !== 'entering'
  const showApproachFx = huntPhase === 'entering'
  const myrionAnim =
    huntPhase === 'entering'
      ? 'reveal'
      : huntPhase === 'failed'
        ? 'flee'
        : huntPhase === 'success'
          ? 'success'
          : 'idle'

  const rarityStyle = {
    '--mg-rarity-color': RARITY_AURA_COLORS[palmon.rarity],
    '--mg-rarity-scale': RARITY_ENCOUNTER_SCALE[palmon.rarity],
  } as CSSProperties

  const sceneBackground = biomeBgFailed
    ? biome.fallbackGradient
    : isMobile
      ? '#000'
      : biome.fallbackGradient

  return (
    <div
      aria-label={`Biome ${biome.name}, ${palmon.name}`}
      className={`mg-hunt-scene mg-capture-field mg-capture-field-biome mg-biome-scene ${
        huntPhase === 'entering' ? 'entering' : ''
      } ${huntPhase === 'capturing' ? 'capturing' : ''} ${
        huntPhase === 'success' ? 'capture-success' : ''
      } ${huntPhase === 'failed' ? 'capture-failed' : ''}${paused ? ' paused' : ''}`}
      role="img"
      style={{
        background: sceneBackground,
        ...rarityStyle,
      }}
    >
      {!biomeBgFailed && (
        <BiomeBackground
          biomeId={biome.id}
          className="mg-capture-biome-bg"
          layout={isMobile ? 'portrait' : 'landscape'}
          onFailed={onBiomeBgError}
        />
      )}

      <BiomeAmbientParticles biomeId={biome.id} />

      {guideCompanion && (
        <GuideCompanionCutout
          biomeId={biome.id}
          celebrate={huntPhase === 'success'}
          commiserate={huntPhase === 'failed'}
          companionId={guideCompanion.id}
          name={guideCompanion.name}
          pose="point"
          side={guideCompanion.side ?? 'left'}
          speech={guideCompanion.speech}
        />
      )}

      <div className="mg-hunt-safe">
        <div className="mg-wild-myrion-slot">
          <span aria-hidden className="mg-creature-shadow" />
          {showApproachFx && (
            <>
              <span aria-hidden className="mg-rarity-approach-glow" />
              <span aria-hidden className="mg-rarity-approach-ring" />
            </>
          )}
          <div className="mg-wild-myrion-anchor">
            <div className="mg-wild-myrion">
              <PalmonSprite
                key={palmon.id}
                animate={myrionAnim}
                emoji={palmon.emoji}
                name={palmon.name}
                size="encounter"
                speciesId={palmon.id}
                variant="full"
              />
              {huntPhase === 'success' && <span aria-hidden className="mg-capture-burst" />}
            </div>
          </div>

          <div className={`mg-wild-myrion-meta${showIdentity ? ' visible' : ''}`}>
            <p className="mg-capture-palmon-name">{palmon.name}</p>
            <span
              className="mg-rarity-badge"
              style={{ color: RARITY_COLORS[palmon.rarity] }}
            >
              {palmon.rarity}
            </span>
          </div>
        </div>

        {captureUi && (
          <div
            className={`mg-biome-capture-layer${
              huntPhase === 'capturing' ? ' active' : ''
            }`}
          >
            {captureUi}
          </div>
        )}
        {resultOverlay}
      </div>
    </div>
  )
}
