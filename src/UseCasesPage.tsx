import { useEffect, useRef, useState } from 'react'
import { Building2, Menu, Moon, ShieldCheck, Sparkles, Sun, X } from 'lucide-react'
import './App.css'
import FooterGlowLogo from './FooterGlowLogo.tsx'

type ThemeMode = 'light' | 'dark'

type UseCase = {
  id: string
  industry: string
  title: string
  image: string
  imageAlt: string
  summary: string
  bullets: string[]
}

const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/'
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? '/#contact'

const useCases: UseCase[] = [
  {
    id: 'tax-use-case',
    industry: 'Tax Intelligence Platform',
    title: 'From naive RAG to an autonomous tax copilot suite.',
    image: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Tax and accounting professionals reviewing complex financial documents',
    summary:
      'We helped a tax platform evolve from structured datasets and naive retrieval into an enterprise-grade copilot for CPAs, taxpayers, startups, real-estate operators, and family offices.',
    bullets: [
      'Connected multi-source tax context in auto-pilot, including business records, filing history, and operational documentation.',
      'Delivered first-phase reconciliation across K-1, Schedule 1065, and crypto records, with architecture designed to extend to 1040 and additional forms.',
      'Implemented privacy-first workflows so users no longer needed to send documents through ad-hoc channels, with strict PII guarantees and traceability.',
      'Enabled expert-level tax Q&A and scenario computation in seconds, producing accurate answers for both corporate and individual complexity.',
    ],
  },
  {
    id: 'biopharma-use-case',
    industry: 'Biopharma Knowledge Operations',
    title: 'Unified research, clinical, and regulatory intelligence for faster decisions.',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Biopharma laboratory with researchers and data systems',
    summary:
      'A biopharma organization needed to unify trial protocols, assay outputs, quality events, and regulatory evidence into one trusted intelligence layer.',
    bullets: [
      'Mapped entities across R&D, clinical operations, manufacturing, and quality into a governed knowledge graph.',
      'Grounded assistant responses in validated evidence chains with provenance for audit and inspection readiness.',
      'Reduced handoff friction between scientific and regulatory teams by standardizing language and context across systems.',
      'Accelerated decision cycles for study risk assessment, change controls, and submission preparation.',
    ],
  },
  {
    id: 'financial-use-case',
    industry: 'Financial Services Advisory Intelligence',
    title: 'Institutional-grade advisory copilots with governance and explainability built in.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Financial services team analyzing market and portfolio data',
    summary:
      'For a financial institution, we transformed fragmented policy, portfolio, and client data into a reasoning-ready intelligence layer powering internal copilots.',
    bullets: [
      'Connected compliance policy, product rules, client profiles, and market context into a consistent semantic model.',
      'Enabled advisor copilots to generate explainable recommendations with evidence-linked rationale and risk controls.',
      'Improved speed and consistency for client-facing analyses without sacrificing governance requirements.',
      'Created a reusable architecture that scales across wealth, lending, and operations functions.',
    ],
  },
]

function getLinkProps(url: string) {
  const isExternal = /^(https?:)?\/\//.test(url)

  if (!isExternal) {
    return { href: url }
  }

  return {
    href: url,
    target: '_blank',
    rel: 'noreferrer',
  }
}

function resolveInitialTheme(): ThemeMode {
  const stored = window.localStorage.getItem('theme-mode')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function UseCasesPage() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => resolveInitialTheme())
  const mobileNavRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    window.localStorage.setItem('theme-mode', themeMode)
    document.title = 'Red Pill Software | Enterprise AI Use Cases'
  }, [themeMode])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (mobileNavRef.current && !mobileNavRef.current.contains(target)) {
        setIsMobileNavOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const isDarkMode = themeMode === 'dark'

  return (
    <main className="page-shell use-cases-page-shell">
      <header className="site-header section-shell" aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="Red Pill Software home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-copy">
            <strong>Red Pill Software</strong>
            <span>Knowledge Before AI.</span>
          </span>
        </a>

        <nav className="site-nav site-nav-desktop" aria-label="Primary links">
          <a href="/">Home</a>
          <a href="#tax-use-case">Tax</a>
          <a href="#biopharma-use-case">Biopharma</a>
          <a href="#financial-use-case">Financial</a>
          <a href="/#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setThemeMode((mode) => (mode === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle color theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          <a className="nav-cta" href="/#contact">Start a Conversation</a>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setIsMobileNavOpen((current) => !current)}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileNavOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {isMobileNavOpen && (
        <div className="mobile-nav-shell section-shell" ref={mobileNavRef} id="mobile-navigation">
          <div className="mobile-nav-panel" aria-label="Mobile navigation">
            <a href="/" onClick={() => setIsMobileNavOpen(false)}>Home</a>
            <a href="#tax-use-case" onClick={() => setIsMobileNavOpen(false)}>Tax</a>
            <a href="#biopharma-use-case" onClick={() => setIsMobileNavOpen(false)}>Biopharma</a>
            <a href="#financial-use-case" onClick={() => setIsMobileNavOpen(false)}>Financial</a>
            <a href="/#contact" onClick={() => setIsMobileNavOpen(false)}>Contact</a>
          </div>
        </div>
      )}

      <section className="hero section-shell" id="top">
        <div className="hero-pattern" aria-hidden="true" />

        <div className="hero-copy">
          <span className="eyebrow">Use Cases</span>
          <h1>Where Enterprise Knowledge Architecture Delivers Measurable Results.</h1>
          <p className="hero-intro">
            Real deployments across tax intelligence, biopharma operations, and financial advisory systems.
          </p>


          <div className="hero-actions">
            <a className="primary-cta" href="/#contact">Discuss Your Use Case</a>
            <a className="secondary-cta" href="#tax-use-case">Explore Case Studies</a>
          </div>
        </div>

        <aside className="hero-visual use-cases-hero-panel" aria-label="Use cases summary">
          <p className="use-cases-hero-title">Industries Covered</p>

          <div className="use-cases-hero-kpis" aria-label="Delivery signals">
            <article>
              <strong>3</strong>
              <span>Live industry tracks</span>
            </article>
            <article>
              <strong>PII-first</strong>
              <span>Security by design</span>
            </article>
            <article>
              <strong>Seconds</strong>
              <span>Expert-grade answers</span>
            </article>
          </div>

          <div className="use-cases-hero-stack" aria-label="Architecture anchors">
            <div>
              <Building2 size={16} aria-hidden="true" />
              <span>Enterprise Context Layer</span>
            </div>
            <div>
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Governance + PII Controls</span>
            </div>
            <div>
              <Sparkles size={16} aria-hidden="true" />
              <span>Copilot-Ready Intelligence</span>
            </div>
          </div>

          <ul className="use-cases-hero-industries">
            <li>Tax & Accounting Intelligence</li>
            <li>Biopharma Knowledge Operations</li>
            <li>Financial Services Advisory</li>
          </ul>

          <p className="hero-detail">
            Each case demonstrates the same principle: when knowledge is structured first, AI becomes reliable,
            explainable, and production-ready.
          </p>
        </aside>
      </section>

      <section className="use-cases-section section-shell" aria-labelledby="use-cases-title">
        <div className="section-heading section-heading-single">
          <span className="eyebrow">Case Library</span>
          <h2 id="use-cases-title">Three enterprise programs, one architectural advantage.</h2>
        </div>

        <div className="use-cases-grid">
          {useCases.map((useCase) => (
            <article key={useCase.id} className="use-case-card" id={useCase.id}>
              <img src={useCase.image} alt={useCase.imageAlt} loading="lazy" decoding="async" />

              <div className="use-case-card-copy">
                <span className="eyebrow">{useCase.industry}</span>
                <h3>{useCase.title}</h3>
                <p>{useCase.summary}</p>

                <ul>
                  {useCase.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section section-shell" aria-labelledby="use-cases-cta-title">
        <div className="contact-panel use-cases-contact-panel">
          <div className="contact-copy">
            <span className="eyebrow">Your Industry Next</span>
            <h2 id="use-cases-cta-title">Bring your most complex workflow. We will architect it for reliable AI.</h2>
            <p>
              If your organization is still relying on fragmented context, disconnected systems, and manual handoffs,
              the opportunity is architectural.
            </p>
          </div>

          <div className="contact-actions">
            <a className="primary-cta" {...getLinkProps(CALENDLY_URL)}>Schedule Architecture Discussion</a>
            <a className="secondary-cta" href="/">Back to Home</a>
          </div>
        </div>
      </section>

      <footer className="site-footer section-shell" aria-label="Footer">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="Red Pill Software home">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-copy">
              <strong>Red Pill Software</strong>
              <span>Enterprise Intelligence Architecture</span>
            </span>
          </a>
          <p>Knowledge Before AI.</p>
          <address className="footer-address">
            <span>7901 4TH ST N, STE 300</span>
            <span>ST. PETERSBURG, FL 33702 - USA</span>
          </address>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="#tax-use-case">Tax</a>
          <a href="#biopharma-use-case">Biopharma</a>
          <a href="#financial-use-case">Financial</a>
          <a href="/#contact">Contact</a>
          <a {...getLinkProps(LINKEDIN_URL)}>LinkedIn</a>
        </div>

        <div>
          <FooterGlowLogo />
          <p className="footer-thesis">
            Enterprise use cases prove the thesis: structure knowledge first, then let AI reason with confidence.
          </p>
        </div>
      </footer>
    </main>
  )
}

export default UseCasesPage