import { BIOME_RESOURCES, type RefugeBiomeId } from '../../data/myrionRefuge'
import {
  REFUGE_CRAFT_RECIPES,
  applyCraftRecipe,
  canAffordCraft,
  type CraftRecipe,
} from '../../data/myrionCraft'
import type { EchoEgg, PetState, RefugeResourceState } from '../../data/minigameSave'
import type { HuntFavor } from '../../data/myrionMvp2'
import './Minigames.css'

type RefugeCraftPanelProps = {
  activeBiomeId: RefugeBiomeId
  activePetId: string
  echoEggs: EchoEgg[]
  huntFavors: HuntFavor[]
  pets: PetState[]
  refugeResources: Partial<Record<RefugeBiomeId, RefugeResourceState>>
  onClose: () => void
  onCraft: (result: ReturnType<typeof applyCraftRecipe>) => void
}

export function RefugeCraftPanel({
  activeBiomeId,
  activePetId,
  echoEggs,
  huntFavors,
  pets,
  refugeResources,
  onClose,
  onCraft,
}: RefugeCraftPanelProps) {
  const tryCraft = (recipe: CraftRecipe) => {
    onCraft(
      applyCraftRecipe(recipe, {
        resources: refugeResources,
        pets,
        huntFavors,
        echoEggs,
        activePetId,
      }),
    )
  }

  return (
    <div className="mg-refuge-stable-overlay" role="presentation" onClick={onClose}>
      <div
        aria-labelledby="mg-refuge-craft-title"
        aria-modal="true"
        className="mg-refuge-craft"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mg-refuge-stable-head">
          <div>
            <p className="eyebrow">Atelier</p>
            <h3 id="mg-refuge-craft-title">Craft du refuge</h3>
          </div>
          <button className="secondary" type="button" onClick={onClose}>
            Fermer
          </button>
        </header>
        <p className="mg-refuge-stable-copy">
          Dépense les ressources de biome pour fabriquer des bonus utiles.
        </p>
        <ul className="mg-refuge-craft-list">
          {REFUGE_CRAFT_RECIPES.map((recipe) => {
            const resource = BIOME_RESOURCES[recipe.biomeId]
            const affordable = canAffordCraft(refugeResources, recipe)
            const amount = refugeResources[recipe.biomeId]?.amount ?? 0
            return (
              <li className="mg-refuge-craft-card" key={recipe.id}>
                <div className="mg-refuge-craft-card-head">
                  <strong>
                    {recipe.emoji} {recipe.name}
                  </strong>
                  <span>
                    {recipe.cost} {resource.resourceEmoji} ({amount.toFixed(1)} dispo)
                  </span>
                </div>
                <p>{recipe.description}</p>
                <button disabled={!affordable} type="button" onClick={() => tryCraft(recipe)}>
                  {affordable ? 'Fabriquer' : 'Ressources insuffisantes'}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mg-echo-hint">
          Biome actif : {BIOME_RESOURCES[activeBiomeId].resourceEmoji}{' '}
          {BIOME_RESOURCES[activeBiomeId].resourceName}
        </p>
      </div>
    </div>
  )
}
