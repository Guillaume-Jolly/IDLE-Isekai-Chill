import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { SPLASH_SLIDES, LOGIN_BACKGROUND } from '../data/splashSlides'
import {
  loadGameSettings,
  saveGameSettings,
  type ProtagonistGender,
} from '../data/gameSettings'
import {
  getDevLoginDefaults,
  isDevSessionLogin,
  isPreloadDone,
  isSessionAuthenticated,
  logoutSession,
  setPreloadDone,
  setSessionAuthenticated,
  validateLogin,
} from '../lib/gameSessionAuth'
import { warmupGameAssets, warmupGameAssetsDeferred, type WarmupProgress } from '../lib/gameAssetWarmup'
import { useAppBuildVersion } from '../hooks/useAppBuildVersion'
import { SessionGateProvider } from '../hooks/useSessionGate'
import './GameSessionGate.css'

const MIN_LOADING_MS_FIRST = 600
const SLIDE_INTERVAL_MS = 3200

type GatePhase = 'login' | 'loading' | 'ready'

type GameSessionGateProps = {
  children: ReactNode
}

function resolveInitialPhase(): GatePhase {
  if (!isSessionAuthenticated()) return 'login'
  if (!isPreloadDone()) return 'loading'
  return 'ready'
}

function devLoginDefaults() {
  return getDevLoginDefaults()
}

export function GameSessionGate({ children }: GameSessionGateProps) {
  const versionLabel = useAppBuildVersion()
  const [phase, setPhase] = useState<GatePhase>(resolveInitialPhase)
  const [username, setUsername] = useState(() => devLoginDefaults().username)
  const [password, setPassword] = useState(() => devLoginDefaults().password)
  const [nsfwContent, setNsfwContent] = useState(() => loadGameSettings().nsfwContent)
  const [protagonistGender, setProtagonistGender] = useState<ProtagonistGender>(
    () => loadGameSettings().protagonistGender,
  )
  const [loginError, setLoginError] = useState('')
  const [slideIndex, setSlideIndex] = useState(0)
  const [progress, setProgress] = useState<WarmupProgress>({
    done: 0,
    total: 1,
    ratio: 0,
    label: 'Initialisation…',
  })

  const handleLogin = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      if (!validateLogin(username, password)) {
        setLoginError('Identifiant ou mot de passe incorrect.')
        return
      }
      setLoginError('')
      saveGameSettings({
        ...loadGameSettings(),
        nsfwContent,
        protagonistGender,
      })
      setSessionAuthenticated(username)
      if (isPreloadDone()) {
        setPhase('ready')
        return
      }
      setPhase('loading')
    },
    [nsfwContent, password, protagonistGender, username],
  )

  const handleLogout = useCallback((resetPreload = false) => {
    logoutSession({ resetPreload })
    const defaults = devLoginDefaults()
    setUsername(defaults.username)
    setPassword(defaults.password)
    setNsfwContent(loadGameSettings().nsfwContent)
    setProtagonistGender(loadGameSettings().protagonistGender)
    setLoginError('')
    setPhase('login')
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return

    let cancelled = false
    const startedAt = performance.now()

    const slideTimer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % SPLASH_SLIDES.length)
    }, SLIDE_INTERVAL_MS)

    const run = async () => {
      await warmupGameAssets((next) => {
        if (!cancelled) setProgress(next)
      }, { scope: 'critical' })

      const elapsed = performance.now() - startedAt
      const minWait = isPreloadDone() ? 0 : MIN_LOADING_MS_FIRST
      const waitMs = Math.max(0, minWait - elapsed)
      if (waitMs > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, waitMs))
      }

      if (!cancelled) {
        setProgress((current) => ({ ...current, ratio: 1, label: 'Bienvenue au Havre' }))
        setPreloadDone()
        setPhase('ready')
        void warmupGameAssetsDeferred().catch((error) => {
          console.warn('[Havre des Brumes] Warmup différé', error)
        })
      }
    }

    void run().catch(() => {
      if (!cancelled) {
        setPreloadDone()
        setPhase('ready')
      }
    })

    return () => {
      cancelled = true
      window.clearInterval(slideTimer)
    }
  }, [phase])

  if (phase === 'login') {
    return (
      <div
        className="session-gate session-gate--login"
        role="dialog"
        aria-modal="true"
        aria-label="Connexion Havre des Brumes"
      >
        <div className="session-login-backdrop" aria-hidden>
          <img alt="" src={LOGIN_BACKGROUND} />
        </div>
        <div className="session-login-card">
          <p className="session-login-kicker">Havre des Brumes</p>
          <h1 className="session-login-title">Connexion</h1>
          <p className="session-login-copy">
            Entrez dans votre havre — compagnons, Myrions et village vous attendent dans la brume.
          </p>
          <form className="session-login-form" onSubmit={handleLogin}>
            <label>
              Identifiant
              <input
                autoComplete="username"
                name="username"
                placeholder={isDevSessionLogin() ? devLoginDefaults().username : 'Identifiant'}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <label>
              Mot de passe
              <input
                autoComplete="current-password"
                name="password"
                placeholder="••••••"
                type={isDevSessionLogin() ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <fieldset className="session-login-preferences">
              <legend>Préférences de jeu</legend>
              <label className="session-login-checkbox">
                <input
                  checked={nsfwContent}
                  type="checkbox"
                  onChange={(event) => setNsfwContent(event.target.checked)}
                />
                <span>
                  Contenu NSFW
                  <small>Dialogues intimes Parler (aff. 4–5) et scènes intégrées.</small>
                </span>
              </label>
              <div
                className="session-login-gender"
                role="radiogroup"
                aria-label="Genre du protagoniste"
              >
                <span className="session-login-gender-label">Protagoniste</span>
                <div className="session-login-gender-options">
                  <label className="session-login-gender-option">
                    <input
                      checked={protagonistGender === 'male'}
                      name="protagonistGender"
                      type="radio"
                      value="male"
                      onChange={() => setProtagonistGender('male')}
                    />
                    <span>Homme (H)</span>
                  </label>
                  <label className="session-login-gender-option">
                    <input
                      checked={protagonistGender === 'female'}
                      name="protagonistGender"
                      type="radio"
                      value="female"
                      onChange={() => setProtagonistGender('female')}
                    />
                    <span>Femme (F)</span>
                  </label>
                </div>
              </div>
            </fieldset>
            {loginError ? <p className="session-login-error">{loginError}</p> : null}
            <button type="submit" className="session-login-btn">
              Entrer au Havre
            </button>
          </form>
          {isDevSessionLogin() ? (
            <p className="session-login-hint session-login-hint--dev">
              Compte démo local prérempli — <strong>{devLoginDefaults().username}</strong> /{' '}
              <strong>{devLoginDefaults().password}</strong>
            </p>
          ) : null}
        </div>
        <p className="session-login-version">{versionLabel}</p>
      </div>
    )
  }

  if (phase === 'loading') {
    const percent = Math.min(100, Math.round(progress.ratio * 100))
    const activeSlide = SPLASH_SLIDES[slideIndex]

    return (
      <div className="session-gate session-gate--loading" aria-busy="true" aria-label="Chargement">
        <div className="session-loading-stage">
          {SPLASH_SLIDES.map((slide, index) => (
            <div
              className={`session-loading-slide${index === slideIndex ? ' is-active' : ''}`}
              key={slide.id}
            >
              <img alt="" aria-hidden src={slide.image} />
            </div>
          ))}
          <div className="session-loading-caption">
            <h2>{activeSlide.title}</h2>
            <p>{activeSlide.caption}</p>
          </div>
        </div>
        <footer className="session-loading-footer">
          <p className="session-loading-label">{progress.label}</p>
          <div
            className="session-loading-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Chargement des assets"
          >
            <div className="session-loading-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="session-loading-meta">
            <span>
              {progress.done}/{progress.total} assets
            </span>
            <span>{percent}% · {versionLabel}</span>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <SessionGateProvider
      logout={() => handleLogout(false)}
      logoutAndResetLoading={() => handleLogout(true)}
    >
      {children}
    </SessionGateProvider>
  )
}