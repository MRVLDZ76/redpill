import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UseCasesPage from './UseCasesPage.tsx'

const isUseCasesPage = window.location.pathname === '/use-cases'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isUseCasesPage ? <UseCasesPage /> : <App />}
  </StrictMode>,
)
