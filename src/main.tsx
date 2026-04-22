import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './rev/rev.scss'
import App from './App.tsx'

/**
 * Start MSW service worker before rendering the app.
 * This ensures all production API calls are intercepted from the start.
 */
async function startApp() {
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false,
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

startApp();
