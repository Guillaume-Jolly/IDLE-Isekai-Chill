import { useCallback } from 'react'
import { resumeAudio } from '../audio/audioEngine'
import { playCaptureFailure, playCaptureSuccess } from '../audio/huntAudio'
import { playUiTab } from '../audio/uiSounds'
import { COLOR_THEME_OPTIONS, LANGUAGE_OPTIONS } from '../data/gameSettings'
import { useGameSettings } from '../hooks/useGameSettings'
import { useSessionGate } from '../hooks/useSessionGate'

function volumeLabel(value: number): string {
  return `${Math.round(value * 100)} %`
}

export function SettingsPanel({ embedded = false }: { embedded?: boolean }) {
  const { settings, updateSettings, resetSettings } = useGameSettings()
  const { logout, logoutAndResetLoading } = useSessionGate()

  const previewInterface = useCallback(() => {
    void resumeAudio().then(() => {
      playUiTab()
      playCaptureSuccess()
    })
  }, [])

  const previewHuntFailure = useCallback(() => {
    void resumeAudio().then(() => {
      playCaptureFailure()
    })
  }, [])

  return (
    <section
      aria-labelledby={embedded ? undefined : 'settings-title'}
      className={`settings-panel${embedded ? ' settings-panel--embedded' : ''}`}
    >
      {!embedded ? (
        <header className="settings-panel-head">
          <h2 id="settings-title">Paramètres</h2>
          <p>Volume, langue et préférences générales du Havre.</p>
        </header>
      ) : null}

      <div className="settings-panel-grid">
        <article className="settings-card">
          <h3>Audio</h3>
          <label className="settings-field">
            <span className="settings-field-label">
              Volume global
              <strong>{volumeLabel(settings.masterVolume)}</strong>
            </span>
            <input
              max={100}
              min={0}
              step={1}
              type="range"
              value={Math.round(settings.masterVolume * 100)}
              onChange={(event) =>
                updateSettings({ masterVolume: Number(event.target.value) / 100 })
              }
            />
          </label>

          <label className="settings-field">
            <span className="settings-field-label">
              Sons d&apos;interface &amp; jeu
              <strong>{volumeLabel(settings.interfaceVolume)}</strong>
            </span>
            <input
              max={100}
              min={0}
              step={1}
              type="range"
              value={Math.round(settings.interfaceVolume * 100)}
              onChange={(event) =>
                updateSettings({ interfaceVolume: Number(event.target.value) / 100 })
              }
            />
            <small>Chasse, captures, menus et retours sonores.</small>
          </label>

          <div className="settings-actions">
            <button type="button" onClick={previewInterface}>
              Tester succès
            </button>
            <button className="secondary" type="button" onClick={previewHuntFailure}>
              Tester échec
            </button>
          </div>

          <label className="settings-field">
            <span className="settings-field-label">
              Musique
              <strong>{volumeLabel(settings.musicVolume)}</strong>
            </span>
            <input
              max={100}
              min={0}
              step={1}
              type="range"
              value={Math.round(settings.musicVolume * 100)}
              onChange={(event) =>
                updateSettings({ musicVolume: Number(event.target.value) / 100 })
              }
            />
            <small>Ambiance discrète du Havre — réglable ou coupable à 0 %.</small>
          </label>
        </article>

        <article className="settings-card">
          <h3>Contenu</h3>
          <label className="settings-field settings-field--checkbox">
            <input
              checked={settings.nsfwContent}
              type="checkbox"
              onChange={(event) => updateSettings({ nsfwContent: event.target.checked })}
            />
            <span>
              Contenu NSFW
              <small>
                Dialogues intimes Parler (aff. 4–5) et scènes intégrées. Choix initial à la connexion ;
                modifiable ici sans se déconnecter.
              </small>
            </span>
          </label>
          <div
            className="settings-theme-toggle settings-protagonist-gender"
            role="radiogroup"
            aria-label="Genre du protagoniste"
          >
            <span className="settings-field-label">Protagoniste (dialogues intimes)</span>
            <div className="settings-theme-toggle-row">
              <button
                aria-pressed={settings.protagonistGender === 'male'}
                className={`settings-theme-toggle-btn${settings.protagonistGender === 'male' ? ' is-active' : ''}`}
                type="button"
                onClick={() => updateSettings({ protagonistGender: 'male' })}
              >
                Homme (H)
              </button>
              <button
                aria-pressed={settings.protagonistGender === 'female'}
                className={`settings-theme-toggle-btn${settings.protagonistGender === 'female' ? ' is-active' : ''}`}
                type="button"
                onClick={() => updateSettings({ protagonistGender: 'female' })}
              >
                Femme (F)
              </button>
            </div>
            <small>Corpus aff. 4–5 en production. En dev, le sélecteur d&apos;échange permet H et F.</small>
          </div>
        </article>

        <article className="settings-card">
          <h3>Apparence</h3>
          <div className="settings-theme-toggle" role="radiogroup" aria-label="Thème de l'interface">
            {COLOR_THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                aria-pressed={settings.colorTheme === option.value}
                className={`settings-theme-toggle-btn${settings.colorTheme === option.value ? ' is-active' : ''}`}
                type="button"
                onClick={() => updateSettings({ colorTheme: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
          <small>
            {
              COLOR_THEME_OPTIONS.find((option) => option.value === settings.colorTheme)?.hint ??
              'Choisissez le rendu global de l’interface.'
            }
          </small>
        </article>

        <article className="settings-card">
          <h3>Langue</h3>
          <label className="settings-field">
            <span className="settings-field-label">Interface</span>
            <select
              value={settings.language}
              onChange={(event) => updateSettings({ language: event.target.value as 'fr' | 'en' })}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option disabled={!option.enabled} key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <small>Tout le contenu est en français pour l&apos;instant.</small>
          </label>
        </article>
        <article className="settings-card">
          <h3>Session</h3>
          <small>Quitte la session locale et revient à l&apos;écran de connexion.</small>
          <div className="settings-actions">
            <button className="secondary" type="button" onClick={logout}>
              Se déconnecter
            </button>
            <button className="secondary" type="button" onClick={logoutAndResetLoading}>
              Se déconnecter et revoir le chargement
            </button>
          </div>
        </article>
      </div>

      <footer className="settings-panel-foot">
        <button className="secondary" type="button" onClick={resetSettings}>
          Réinitialiser les paramètres
        </button>
      </footer>
    </section>
  )
}
