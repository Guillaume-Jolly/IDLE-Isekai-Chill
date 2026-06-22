import {
  ARCHETYPE_ORDER,
  CITY_ARCHETYPES,
  type CityArchetypeId,
} from '../data/cityArchetypes'
import {
  NEED_HINTS,
  NEED_KEYS,
  NEED_LABELS,
  POPULATION_STAGES,
  STAGE_BUILDING_NAMES,
  averageNeeds,
  checkStageAdvance,
  computeArchetypePoints,
  computeNeedSatisfaction,
  futureBuildingsForStage,
  getCurrentStage,
  getDominantArchetype,
  getNextStage,
  type NeedKey,
  type VillagePopulationState,
} from '../data/population'

type PopulationPanelProps = {
  village: VillagePopulationState
  buildings: Record<string, number>
  onAdvanceStage: () => void
}

export function PopulationPanel({ village, buildings, onAdvanceStage }: PopulationPanelProps) {
  const needs = computeNeedSatisfaction(buildings, village.population)
  const avg = averageNeeds(needs)
  const stage = getCurrentStage(village.stage)
  const nextStage = getNextStage(village.stage)
  const advance = checkStageAdvance(village, needs)
  const archetypePoints = computeArchetypePoints(buildings)
  const dominant = getDominantArchetype(archetypePoints)
  const futureBuildings = futureBuildingsForStage(village.stage)

  return (
    <section className="population-panel panel">
      <header className="population-head">
        <div>
          <p className="eyebrow">Population</p>
          <h2>
            {stage.name} — {Math.floor(village.population)} / {stage.popCap} habitants
          </h2>
        </div>
        <div className="population-avg">
          <span>Bonheur moyen</span>
          <strong className={avg >= 60 ? 'good' : avg >= 45 ? 'mid' : 'low'}>{avg}%</strong>
        </div>
      </header>

      <p className="population-copy">
        Monte les batiments qui couvrent les besoins de ta population. Quand tout le monde est
        satisfait, la ville grossit et debloque le stade suivant — plus de batiments et
        specialisations.
      </p>

      <div className="need-grid">
        {NEED_KEYS.map((key) => (
          <NeedBar key={key} needKey={key} value={needs[key]} />
        ))}
      </div>

      <div className="archetype-section">
        <h3>Orientation de la cite</h3>
        <p className="population-copy">
          Tes batiments poussent la ville vers un archetype. A 40+ points, bonus de production
          actif.
        </p>
        <div className="archetype-bars">
          {ARCHETYPE_ORDER.map((id) => (
            <ArchetypeBar
              active={dominant === id}
              id={id}
              key={id}
              points={archetypePoints[id]}
            />
          ))}
        </div>
        {dominant ? (
          <p className="archetype-active">
            <strong>{CITY_ARCHETYPES[dominant].name}</strong> — {CITY_ARCHETYPES[dominant].tagline}
          </p>
        ) : (
          <p className="archetype-active muted">Pas encore d archetype dominant (40 pts min).</p>
        )}
      </div>

      {nextStage && (
        <div className="stage-advance-box">
          <h3>Prochain stade : {nextStage.name}</h3>
          <ul>
            <li>Population : {stage.popToAdvance}+ (actuel {Math.floor(village.population)})</li>
            <li>Bonheur moyen : {stage.minAvgNeeds}%+ (actuel {avg}%)</li>
            <li>
              Debloque : {(STAGE_BUILDING_NAMES[nextStage.id] ?? []).join(', ') || 'specialisations'}
            </li>
          </ul>
          {advance.canAdvance ? (
            <button type="button" className="primary" onClick={onAdvanceStage}>
              Passer au stade {nextStage.name}
            </button>
          ) : (
            <div className="stage-blocked">
              <span>Encore requis :</span>
              {advance.reasons.map((reason) => (
                <small key={reason}>{reason}</small>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="future-buildings">
        <h3>A venir (par archetype)</h3>
        <div className="future-grid">
          {futureBuildings.slice(0, 6).map((building) => (
            <article className="future-card" key={building.id}>
              <span className="future-tag">{CITY_ARCHETYPES[building.archetype].name}</span>
              <strong>{building.name}</strong>
              <small>{building.role}</small>
              <small>Stade {building.unlockStage}+</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function NeedBar({ needKey, value }: { needKey: NeedKey; value: number }) {
  return (
    <div className="need-bar" title={NEED_HINTS[needKey]}>
      <div className="need-bar-top">
        <span>{NEED_LABELS[needKey]}</span>
        <strong>{value}%</strong>
      </div>
      <div className="need-track">
        <div
          className={`need-fill ${value >= 65 ? 'good' : value >= 45 ? 'mid' : 'low'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <small>{NEED_HINTS[needKey]}</small>
    </div>
  )
}

function ArchetypeBar({
  id,
  points,
  active,
}: {
  id: CityArchetypeId
  points: number
  active: boolean
}) {
  const meta = CITY_ARCHETYPES[id]
  const width = Math.min(100, points)

  return (
    <div className={`archetype-row ${active ? 'active' : ''}`}>
      <span>{meta.name}</span>
      <div className="archetype-track">
        <div className="archetype-fill" style={{ width: `${width}%` }} />
      </div>
      <strong>{points}</strong>
    </div>
  )
}

export const POPULATION_STAGE_NAMES = POPULATION_STAGES.map((stage) => stage.name)
