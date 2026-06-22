import { BIOME_AMBIENT, type AmbientParticleKind } from '../../data/captureHunt'

type BiomeAmbientParticlesProps = {
  biomeId: string
}

const PARTICLE_COUNT: Record<AmbientParticleKind, number> = {
  pollen: 14,
  fireflies: 12,
  mist: 10,
  snow: 16,
  sand: 12,
  bubbles: 10,
  embers: 14,
  stars: 12,
}

export function BiomeAmbientParticles({ biomeId }: BiomeAmbientParticlesProps) {
  const kind = BIOME_AMBIENT[biomeId] ?? 'pollen'
  const count = PARTICLE_COUNT[kind]

  return (
    <div aria-hidden className={`mg-biome-ambient mg-ambient-${kind}`}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="mg-ambient-dot"
          style={{
            left: `${8 + ((index * 17) % 84)}%`,
            top: `${6 + ((index * 23) % 78)}%`,
            animationDelay: `${(index * 0.37) % 4}s`,
            animationDuration: `${3.2 + (index % 5) * 0.6}s`,
          }}
        />
      ))}
    </div>
  )
}
