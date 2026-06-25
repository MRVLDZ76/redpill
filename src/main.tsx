import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UseCasesPage from './UseCasesPage.tsx'
import LegalPages from './LegalPages.tsx'

const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
const isUseCasesPage = pathname === '/use-cases'
const isPrivacyPolicyPage = pathname === '/legal/privacy-policy' || pathname === '/legal/privacy-policy.html'
const isTermsPage =
  pathname === '/legal/terms-and-conditions' || pathname === '/legal/terms-and-conditions.html'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isUseCasesPage ? (
      <UseCasesPage />
    ) : isPrivacyPolicyPage ? (
      <LegalPages type="privacy" />
    ) : isTermsPage ? (
      <LegalPages type="terms" />
    ) : (
      <App />
    )}
  </StrictMode>,
)
