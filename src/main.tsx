import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameDisplayShell } from './components/GameDisplayShell.tsx'
import { GameSessionGate } from './components/GameSessionGate.tsx'
import { GameSettingsProvider } from './hooks/useGameSettings.tsx'
import { RewardToastProvider } from './components/RewardToastProvider.tsx'
import { loadGameSettings } from './data/gameSettings'

loadGameSettings()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameSessionGate>
      <GameDisplayShell>
        <RewardToastProvider>
          <GameSettingsProvider>
            <App />
          </GameSettingsProvider>
        </RewardToastProvider>
      </GameDisplayShell>
    </GameSessionGate>
  </StrictMode>,
)
