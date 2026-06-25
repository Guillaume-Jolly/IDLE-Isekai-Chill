import { DEV_UNLIMITED_GACHA, RARITY_META } from '../data/gacha'
import { FESTIVAL_EVENT_BANNER, getFestivalFeaturedItem } from '../data/festivalGacha'
import { getFestivalGachaRates } from '../data/gachaRates'
import { GachaLootDetailsContent } from './GachaLootDetailsContent'
import { LootDetailsLens } from './LootDetailsLens'
import './FestivalEventBanner.css'

type FestivalEventBannerProps = {
  pulls: number
  tickets: number
  onPull: (count: number) => void
}

export function FestivalEventBanner({ pulls, tickets, onPull }: FestivalEventBannerProps) {
  const festivalRates = getFestivalGachaRates()

  return (
    <section aria-labelledby="festival-event-title" className="event-festival-banner">
      <div className="event-festival-banner-visual">
        <img
          alt="Festival des lanternes — jackpots LR, reliques UR et trésors SSR"
          className="event-festival-banner-img"
          decoding="async"
          src={FESTIVAL_EVENT_BANNER.bannerSrc}
        />
      </div>

      <div className="event-festival-banner-side">
        <header className="event-festival-banner-head">
          <div>
            <p className="event-festival-banner-eyebrow">Gacha saisonnier</p>
            <h3 id="festival-event-title">{FESTIVAL_EVENT_BANNER.title}</h3>
            <p className="event-festival-banner-tagline">{FESTIVAL_EVENT_BANNER.subtitle}</p>
          </div>
          <LootDetailsLens
            className="loot-details-lens--dark"
            label="Voir les lots et taux du festival"
            title="Lots & taux — Festival des lanternes"
          >
            <GachaLootDetailsContent
              featuredLoot={festivalRates.featuredLoot}
              featuredNote={festivalRates.featuredNote}
              lootRates={festivalRates.lootRates}
              pityRules={festivalRates.pityRules}
              rarityRates={festivalRates.rarityRates}
              title={festivalRates.title}
            />
          </LootDetailsLens>
        </header>

        <p className="event-festival-banner-desc">
          Ressources, fragments compagnons et jetons de stat. Pity{' '}
          <span className="rarity-ssr">SSR</span> /10 · <span className="rarity-ur">UR</span> /50 ·{' '}
          <span className="rarity-lr">LR</span> /100.
        </p>

        <ul className="event-festival-featured">
          {FESTIVAL_EVENT_BANNER.featured.map((entry) => {
            const item = getFestivalFeaturedItem(entry.itemId)
            return (
              <li key={entry.itemId}>
                <img
                  alt=""
                  className="event-festival-featured-icon"
                  src={item?.icon ?? '/gacha/icons/lantern.svg'}
                />
                <div className="event-festival-featured-meta">
                  <span className="event-festival-featured-name">{entry.displayName}</span>
                  <span className="event-festival-featured-archetype">{entry.archetype}</span>
                  <span
                    className="event-festival-featured-rarity"
                    style={{
                      color: RARITY_META[entry.rarity].color,
                      boxShadow: `0 0 10px ${RARITY_META[entry.rarity].glow}`,
                    }}
                  >
                    {entry.rarity}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="gacha-pull-actions event-festival-pull-actions">
          {[1, 10, 50, 100].map((count) => (
            <button
              className={count === 10 ? 'primary' : 'secondary'}
              key={count}
              type="button"
              onClick={() => onPull(count)}
            >
              Tirer x{count}
            </button>
          ))}
        </div>

        <div className="event-festival-banner-foot">
          <small>
            {DEV_UNLIMITED_GACHA ? 'Mode dev : tickets illimités' : `${tickets} tickets disponibles`}
          </small>
          <small className="gacha-stat-bank">
            Tirages {pulls} · Fragments & jetons visibles dans l&apos;Inventaire
          </small>
        </div>
      </div>
    </section>
  )
}
