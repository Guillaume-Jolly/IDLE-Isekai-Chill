import { BIOMES } from '../../data/wildFamiliars'
import type { PetState, RefugeProgressState, RefugeResourceState } from '../../data/minigameSave'
import {
  BIOME_RESOURCES,
  estimateDailyProduction,
  getBiomeCollectionStatus,
  normalizeRefugeBiomeId,
  uniqueSpeciesCount,
  type RefugeBiomeId,
} from '../../data/myrionRefuge'

type RefugeSummaryPanelProps = {
  activeBiomeId: RefugeBiomeId
  carePoints: number
  huntFavorsCount: number
  pets: PetState[]
  refugeProgress: RefugeProgressState
  refugeResources: Partial<Record<RefugeBiomeId, RefugeResourceState>>
}

function collectionBonusLabel(status: ReturnType<typeof getBiomeCollectionStatus>) {
  if (status.shinyComplete) return ' · shiny +30%'
  if (status.normalComplete) return ' · +10%'
  return ''
}

export function RefugeSummaryPanel({
  activeBiomeId,
  carePoints,
  huntFavorsCount,
  pets,
  refugeProgress,
  refugeResources,
}: RefugeSummaryPanelProps) {
  return (
    <div className="mg-refuge-summary">
      <section className="mg-refuge-summary-global">
        <h4>Récapitulatif global</h4>
        <ul className="mg-refuge-summary-stats">
          <li>
            <span>Myrions au refuge</span>
            <strong>{pets.length}</strong>
          </li>
          <li>
            <span>Soins effectués</span>
            <strong>{carePoints}</strong>
          </li>
          <li>
            <span>Faveurs chasse</span>
            <strong>{huntFavorsCount}</strong>
          </li>
        </ul>
      </section>

      <div className="mg-refuge-summary-biomes">
        {BIOMES.map((biome) => {
          const biomeId = biome.id as RefugeBiomeId
          const resourceDef = BIOME_RESOURCES[biomeId]
          const inBiome = pets.filter(
            (pet) => normalizeRefugeBiomeId(pet.biomeId) === biomeId,
          )
          const species = uniqueSpeciesCount(inBiome)
          const count = inBiome.length
          const resourceAmount = refugeResources[biomeId]?.amount ?? 0
          const biomeFavorBonus = refugeProgress.biomeFavors?.[biomeId] ?? 0
          const collectionStatus = getBiomeCollectionStatus(pets, biomeId)
          const dailyProduction = estimateDailyProduction(
            pets,
            biomeId,
            biomeFavorBonus,
            collectionStatus.collectionBonusPercent,
          )
          const isActive = activeBiomeId === biomeId

          return (
            <section
              className={`mg-refuge-summary-biome${isActive ? ' active' : ''}`}
              key={biomeId}
            >
              <h4>
                {biome.emoji} {biome.name}
                {isActive ? <small>· en cours</small> : null}
              </h4>
              <ul className="mg-refuge-summary-stats">
                <li>
                  <span>Myrions</span>
                  <strong>
                    {count > 0
                      ? species < count
                        ? `${species} espèces · ${count}`
                        : `${count}`
                      : 'Vide'}
                  </strong>
                </li>
                <li>
                  <span>
                    {resourceDef.resourceEmoji} {resourceDef.resourceName}
                  </span>
                  <strong>{resourceAmount}</strong>
                </li>
                <li>
                  <span>Production</span>
                  <strong>+{dailyProduction}/jour</strong>
                </li>
                <li>
                  <span>Collection</span>
                  <strong>
                    {collectionStatus.normalOwned}/{collectionStatus.totalSpecies}
                    {collectionBonusLabel(collectionStatus)}
                    {' · '}
                    Shiny {collectionStatus.shinyOwned}/{collectionStatus.totalSpecies}
                  </strong>
                </li>
                {biomeFavorBonus > 0 ? (
                  <li>
                    <span>Faveur biome</span>
                    <strong>+{biomeFavorBonus}</strong>
                  </li>
                ) : null}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
