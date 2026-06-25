import type { CSSProperties } from 'react'
import { DISAGREA_EVENT_BANNER } from '../data/disagreaGacha'
import { getDisagreaGachaRates } from '../data/gachaRates'
import { DEV_UNLIMITED_GACHA, RARITY_META, type GachaRarity } from '../data/gacha'
import { GachaLootDetailsContent } from './GachaLootDetailsContent'
import { LootDetailsLens } from './LootDetailsLens'
import './DisagreaEventBanner.css'

type DisagreaEventBannerProps = {
  pulls: number
  tickets: number
  onPull: (count: number) => void
}

function rarityStyle(rarity: GachaRarity) {
  const meta = RARITY_META[rarity]
  return {
    '--rarity-color': meta.color,
    '--rarity-glow': meta.glow,
  } as CSSProperties
}

export function DisagreaEventBanner({ pulls, tickets, onPull }: DisagreaEventBannerProps) {
  const disagreaRates = getDisagreaGachaRates()

  return (
    <section aria-labelledby="disagrea-event-title" className="event-disagrea-banner">
      <div className="event-disagrea-banner-visual">
        <img
          alt="Ouverture de l'event Disagrea — Etna, Flonne, Laharl et Pleinair devant la faille"
          className="event-disagrea-banner-img"
          decoding="async"
          src={DISAGREA_EVENT_BANNER.bannerSrc}
        />
      </div>

      <div className="event-disagrea-banner-side">
        <header className="event-disagrea-banner-head">
          <div>
            <p className="event-disagrea-banner-eyebrow">Événement limité</p>
            <h3 id="disagrea-event-title">{DISAGREA_EVENT_BANNER.subtitle}</h3>
            <p className="event-disagrea-banner-tagline">{DISAGREA_EVENT_BANNER.title}</p>
          </div>
          <LootDetailsLens
            className="loot-details-lens--dark"
            label="Voir les lots et taux Disagrea"
            title="Lots & taux — Faille Disagrea"
          >
            <GachaLootDetailsContent
              featuredLoot={disagreaRates.featuredLoot}
              featuredNote={disagreaRates.featuredNote}
              lootRates={disagreaRates.lootRates}
              pityRules={disagreaRates.pityRules}
              rarityRates={disagreaRates.rarityRates}
              title={disagreaRates.title}
            />
          </LootDetailsLens>
        </header>

        <p className="event-disagrea-banner-desc">
          Invoque des fragments des invités de la faille. Etna en{' '}
          <span className="rarity-lr">LR</span>, les autres en{' '}
          <span className="rarity-ur">UR</span>.
        </p>

        <ul className="event-disagrea-featured">
          {DISAGREA_EVENT_BANNER.featured.map((entry) => (
            <li key={entry.companionId} style={rarityStyle(entry.rarity)}>
              <img
                alt=""
                className="event-disagrea-featured-portrait"
                src={`/assets/companions/${entry.companionId}/affinity-1.png`}
              />
              <div className="event-disagrea-featured-meta">
                <span className="event-disagrea-featured-name">{entry.displayName}</span>
                <span className="event-disagrea-featured-archetype">{entry.archetype}</span>
                <span className="event-disagrea-featured-rarity">{entry.rarity}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="gacha-pull-actions event-disagrea-pull-actions">
          {[1, 10, 50, 100].map((count) => (
            <button
              className={count === 10 ? 'primary' : 'secondary'}
              key={count}
              type="button"
              onClick={() => onPull(count)}
            >
              Invoquer x{count}
            </button>
          ))}
        </div>

        <div className="event-disagrea-banner-foot">
          <small>
            {DEV_UNLIMITED_GACHA ? 'Mode dev : tickets illimités' : `${tickets} tickets disponibles`}
          </small>
          <small className="gacha-stat-bank">
            Tirages {pulls} · Pity SSR+ /10 · UR /50 · LR /100
          </small>
        </div>
      </div>
    </section>
  )
}
