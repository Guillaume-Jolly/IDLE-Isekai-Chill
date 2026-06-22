import type { CSSProperties } from 'react'

import { BUILDING_ACTIVITIES } from '../../data/buildingActivities'

import { getCurrentStage } from '../../data/population'

import { CompanionPresenter } from './CompanionPresenter'

import './Minigames.css'



type CompanionInfo = { id: string; name: string }



type MinigameHubProps = {

  buildings: Record<string, number>

  villageStage: number

  resourceLabels: Record<string, string>

  companions: CompanionInfo[]

  unlockAtByBuilding: Record<string, number>

  focusBuildingId?: string | null

  onPlay: (activityId: string) => void

}



export function MinigameHub({

  buildings,

  villageStage,

  resourceLabels,

  companions,

  unlockAtByBuilding,

  focusBuildingId,

  onPlay,

}: MinigameHubProps) {

  const companionById = Object.fromEntries(companions.map((companion) => [companion.id, companion]))



  return (

    <>

      <section className="section-heading">

        <div>

          <p className="eyebrow">Village actif</p>

          <h2>Mini-jeux des batiments</h2>

        </div>

        <p>

          Tower defense, ferme idle, refuge familiers et plus — chaque activite a son compagnon,

          sa ressource et un skin inspire d un hit mobile.

        </p>

      </section>



      <section className="grid mini-grid">

        {BUILDING_ACTIVITIES.map((activity) => {

          const requiredStage = unlockAtByBuilding[activity.buildingId] ?? 0

          const locked = villageStage < requiredStage

          const level = buildings[activity.buildingId] ?? 0

          const companion = companionById[activity.companionId]

          const focused = focusBuildingId === activity.buildingId



          return (

            <article

              className={`panel minigame-card ${locked ? 'locked' : ''} ${focused ? 'focused' : ''}`}

              key={activity.id}

            >

              <div className="minigame-card-layout">

                <CompanionPresenter

                  accent={activity.accent}

                  activityId={activity.id}

                  companionId={activity.companionId}

                  name={companion?.name ?? activity.companionId}

                  variant="card"

                />

                <div className="minigame-card-body">

                  <div className="minigame-card-top" style={{ '--mg-accent': activity.accent } as CSSProperties}>

                    <span className="minigame-card-icon">{activity.icon}</span>

                    <div>

                      <small>{activity.tagline}</small>

                      <h3>{activity.name}</h3>

                    </div>

                  </div>

                  <p>{activity.description}</p>

                  <div className="minigame-card-links">

                    <span>Compagnon: {companion?.name ?? activity.companionId}</span>

                    <span>Ressource: {resourceLabels[activity.focusResource]}</span>

                    <span>Inspire de: {activity.inspiration}</span>

                    <span>Niv. batiment: {level}</span>

                    {activity.persistent && <span className="mg-persistent-tag">Progression sauvegardee</span>}

                  </div>

                  <button disabled={locked} type="button" onClick={() => onPlay(activity.id)}>

                    {locked

                      ? `Stade ${getCurrentStage(requiredStage).name}`

                      : 'Jouer'}

                  </button>

                </div>

              </div>

            </article>

          )

        })}

      </section>

    </>

  )

}


