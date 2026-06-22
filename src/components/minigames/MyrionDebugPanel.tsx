import { useMemo, useState } from 'react'
import {
  MYRION_REFUGE_DEBUG,
  speciesForBiome,
  spawnDebugFullBiome,
  spawnDebugHuntFavors,
  spawnDebugMyrion,
  spawnDebugMyrionBatch,
  spawnDebugSpeciesCopies,
} from '../../data/myrionDebug'
import type { RefugeBiomeId } from '../../data/myrionRefuge'
import type { HuntFavor } from '../../data/myrionMvp2'
import type { PetState } from '../../data/minigameSave'
import { PALMON_SPECIES } from '../../data/wildFamiliars'
import './Minigames.css'

type MyrionDebugPanelProps = {
  activeBiomeId?: RefugeBiomeId
  pets: PetState[]
  speciesScope?: 'biome' | 'all'
  onPetsChange: (pets: PetState[]) => void
  onClearAll?: () => void
  onFlash?: (message: string) => void
  onHuntFavorsChange?: (favors: HuntFavor[]) => void
  onRefugeProgressChange?: (patch: { shinyDiscovered?: boolean }) => void
}

export function MyrionDebugPanel({
  activeBiomeId = 'prairie-solaire',
  pets,
  speciesScope = 'biome',
  onPetsChange,
  onClearAll,
  onFlash,
  onHuntFavorsChange,
  onRefugeProgressChange,
}: MyrionDebugPanelProps) {
  const [speciesId, setSpeciesId] = useState('')
  const biomeSpecies = useMemo(
    () => (speciesScope === 'all' ? PALMON_SPECIES : speciesForBiome(activeBiomeId)),
    [activeBiomeId, speciesScope],
  )

  if (!MYRION_REFUGE_DEBUG) return null

  const flash = (message: string) => onFlash?.(message)

  const clearAll = () => {
    onPetsChange([])
    onClearAll?.()
    flash('Debug — tous les Myrions supprimés.')
  }

  return (
    <section aria-label="Outils debug Myrions" className="mg-myrion-debug">
      <header className="mg-myrion-debug-head">
        <span>🛠 Debug test</span>
        <small>{pets.length} Myrion(s)</small>
      </header>
      <div className="mg-myrion-debug-actions">
        <button className="mg-myrion-debug-danger" type="button" onClick={clearAll}>
          Vider la collection
        </button>
        <button
          type="button"
          onClick={() => {
            const pet = spawnDebugMyrion(activeBiomeId)
            onPetsChange([...pets, pet])
            flash(`Debug — ${pet.name} ajouté (${activeBiomeId}).`)
          }}
        >
          +1 aléatoire (biome)
        </button>
        <button
          type="button"
          onClick={() => {
            const pet = spawnDebugMyrion()
            onPetsChange([...pets, pet])
            flash(`Debug — ${pet.name} ajouté.`)
          }}
        >
          +1 aléatoire (global)
        </button>
        <button
          type="button"
          onClick={() => {
            const batch = spawnDebugMyrionBatch(5, activeBiomeId)
            onPetsChange([...pets, ...batch])
            flash(`Debug — ${batch.length} Myrions ajoutés au biome.`)
          }}
        >
          +5 (biome)
        </button>
      </div>
      <div className="mg-myrion-debug-presets">
        <span>Presets checklist</span>
        <button
          type="button"
          onClick={() => {
            const species = biomeSpecies[0]
            if (!species) return
            onPetsChange([...pets, ...spawnDebugSpeciesCopies(species.id, 10)])
            flash(`Debug — 10× ${species.name}.`)
          }}
        >
          10× même espèce
        </button>
        <button
          type="button"
          onClick={() => {
            onPetsChange([...pets, ...spawnDebugFullBiome(activeBiomeId)])
            flash(`Debug — biome ${activeBiomeId} complet.`)
          }}
        >
          Biome complet
        </button>
        <button
          type="button"
          onClick={() => {
            const species = biomeSpecies[0]
            if (!species) return
            const shiny = spawnDebugSpeciesCopies(species.id, 1, { shiny: true })[0]
            onPetsChange([...pets, shiny])
            onRefugeProgressChange?.({ shinyDiscovered: true })
            flash(`Debug — shiny ${species.name}.`)
          }}
        >
          +1 shiny
        </button>
        {onHuntFavorsChange ? (
          <button
            type="button"
            onClick={() => {
              onHuntFavorsChange(spawnDebugHuntFavors(5))
              flash('Debug — 5 faveurs en file.')
            }}
          >
            5 faveurs chasse
          </button>
        ) : null}
      </div>
      <div className="mg-myrion-debug-pick">
        <select value={speciesId} onChange={(event) => setSpeciesId(event.target.value)}>
          <option value="">Choisir une espèce…</option>
          {biomeSpecies.map((species) => (
            <option key={species.id} value={species.id}>
              {species.name} ({species.rarity})
            </option>
          ))}
        </select>
        <button
          disabled={!speciesId}
          type="button"
          onClick={() => {
            if (!speciesId) return
            const pet = spawnDebugMyrion(activeBiomeId, speciesId)
            onPetsChange([...pets, pet])
            setSpeciesId('')
            flash(`Debug — ${pet.name} ajouté.`)
          }}
        >
          Ajouter
        </button>
      </div>
    </section>
  )
}
