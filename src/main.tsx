import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameSettingsProvider } from './hooks/useGameSettings.tsx'
import { GameDisplayShell } from './components/GameDisplayShell.tsx'
import { RewardToastProvider } from './components/RewardToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameDisplayShell>
      <RewardToastProvider>
        <GameSettingsProvider>
          <App />
        </GameSettingsProvider>
      </RewardToastProvider>
    </GameDisplayShell>
  </StrictMode>,
)
