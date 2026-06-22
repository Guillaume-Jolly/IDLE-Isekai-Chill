import type { HuntFavor } from '../../data/myrionMvp2'
import { MAX_ACTIVE_HUNT_FAVORS } from '../../data/myrionMvp2'
import './Minigames.css'

type HuntActiveFavorsPanelProps = {
  active: HuntFavor[]
  queuedCount: number
}

const CATEGORY_LABELS: Record<HuntFavor['category'], string> = {
  biome_appearance: 'Biome',
  species_appearance: 'Espèce',
  capture: 'Capture',
  anti_flee: 'Anti-fuite',
  hint: 'Indice',
  rarity: 'Rareté',
  shiny: 'Shiny',
}

export function HuntActiveFavorsPanel({ active, queuedCount }: HuntActiveFavorsPanelProps) {
  if (active.length === 0 && queuedCount === 0) return null

  return (
    <section aria-label="Faveurs de chasse actives" className="mg-hunt-favors">
      <header className="mg-hunt-favors-head">
        <div>
          <p className="eyebrow">Chasse</p>
          <h4>Faveurs actives</h4>
        </div>
        <span className="mg-hunt-favors-count">
          {active.length}/{MAX_ACTIVE_HUNT_FAVORS}
          {queuedCount > 0 ? ` · ${queuedCount} en attente` : ''}
        </span>
      </header>
      {active.length > 0 ? (
        <ul className="mg-hunt-favors-list">
          {active.map((favor) => (
            <li key={favor.id}>
              <strong>{favor.name}</strong>
              <span>
                {CATEGORY_LABELS[favor.category]} · niv. {favor.level} ·{' '}
                {favor.remainingEncounters} rencontre{favor.remainingEncounters > 1 ? 's' : ''}
                {favor.targetSpeciesId ? ` · espèce ciblée` : ''}
                {favor.targetBiomeId ? ` · biome ${favor.targetBiomeId.split('-')[0]}` : ''}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mg-hunt-favors-empty">Aucune faveur active — chasse standard.</p>
      )}
    </section>
  )
}
