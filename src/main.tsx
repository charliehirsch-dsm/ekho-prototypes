import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './rev/rev.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
