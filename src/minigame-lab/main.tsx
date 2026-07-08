import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { MinigameLabApp } from './MinigameLabApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MinigameLabApp />
  </StrictMode>,
)
