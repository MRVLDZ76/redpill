import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import {
  ArrowUpRight,
  X,
  Menu,
  Moon,
  Sun,
  TriangleAlert,
  ChevronDown,
} from 'lucide-react'
import './App.css'
import KnowledgeGraph from './KnowledgeGraph.tsx'
import { applySeoMetadata } from './seo.ts'

import { getAppContent, localeLabels, supportedLocales, type Locale } from './content.ts'

type ThemeMode = 'light' | 'dark'

type ContactFormState = {
  name: string
  company: string
  email: string
  subject: string
  message: string
  website: string
  consent: boolean
}

type SubmitState = 'idle' | 'sending' | 'success' | 'error'
type ServiceLens = 'problem' | 'approach' | 'outcome' | 'impact'

const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/'
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? ''
const DESTINATION_EMAIL = import.meta.env.VITE_CONTACT_RECEIVER_EMAIL ?? 'noahedison7@gmail.com'
const CONTACT_COOLDOWN_MS = 60_000
const CONTACT_MIN_SUBMIT_DELAY_MS = 3_000
const CONTACT_LAST_SENT_KEY = 'contact-last-sent-at'
const HOME_URL = 'https://redpill.software/'
const HOME_OG_IMAGE_URL = 'https://redpill.software/og-image.png'

type IndustryOption = {
  en: string
  fr: string
  es: string
}

const INDUSTRY_OPTIONS: IndustryOption[] = [
  { en: 'Technology', fr: 'Technologie', es: 'Tecnologia' },
  { en: 'Financial Services', fr: 'Services financiers', es: 'Servicios financieros' },
  { en: 'Insurance', fr: 'Assurance', es: 'Seguros' },
  { en: 'Healthcare & Life Sciences', fr: 'Sante et sciences de la vie', es: 'Salud y ciencias de la vida' },
  { en: 'Manufacturing', fr: 'Industrie manufacturiere', es: 'Manufactura' },
  { en: 'Retail & E-commerce', fr: 'Commerce et e-commerce', es: 'Retail y comercio electronico' },
  { en: 'Energy & Utilities', fr: 'Energie et services publics', es: 'Energia y servicios publicos' },
  { en: 'Telecommunications', fr: 'Telecommunications', es: 'Telecomunicaciones' },
  { en: 'Transportation & Logistics', fr: 'Transport et logistique', es: 'Transporte y logistica' },
  { en: 'Public Sector', fr: 'Secteur public', es: 'Sector publico' },
  { en: 'Education', fr: 'Education', es: 'Educacion' },
  { en: 'Media & Entertainment', fr: 'Medias et divertissement', es: 'Medios y entretenimiento' },
  { en: 'Professional Services', fr: 'Services professionnels', es: 'Servicios profesionales' },
  { en: 'Other', fr: 'Autre', es: 'Otro' },
]
const INDUSTRY_PLACEHOLDER_BY_LOCALE: Record<Locale, string> = {
  en: 'Select an industry',
  fr: 'Sélectionnez un secteur',
  es: 'Seleccione una industria',
}
const CLIENT_LOGOS = [
  //{
    //name: 'Samsung',
    // src: '/logos/Samsung_idLNQNZGf5_0.svg',
 // },
  {
    name: 'Coinbase',
    src: '/logos/Coinbase_id8ei2lvLT_0.svg',
  },
  {
    name: 'HP',
    src: '/logos/HP_Logo_0.svg',
  },
  {
    name: 'SAP',
    src: '/logos/SAP_idL9dEduKh_0.svg',
  },
  {
    name: 'Nationwide Insurance',
    src: '/logos/Nationwide_Insurance_Logo_0.svg',
  },
]

const initialContactForm: ContactFormState = {
  name: '',
  company: '',
  email: '',
  subject: '',
  message: '',
  website: '',
  consent: false,
}

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

function App() {
  const [locale, setLocale] = useState<Locale>('en')
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [statementIndex, setStatementIndex] = useState(0)
  const [statementVisible, setStatementVisible] = useState(true)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => resolveInitialTheme())
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactForm)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [serviceLens, setServiceLens] = useState<ServiceLens>('problem')
  const [formOpenedAt, setFormOpenedAt] = useState(() => Date.now())
  const localeDropdownRef = useRef<HTMLDivElement | null>(null)
  const mobileNavRef = useRef<HTMLDivElement | null>(null)
  const copy = getAppContent(locale)

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    window.localStorage.setItem('theme-mode', themeMode)
  }, [themeMode])

  useEffect(() => {
    setStatementIndex(0)
    setStatementVisible(true)
  }, [locale])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (localeDropdownRef.current && !localeDropdownRef.current.contains(target)) {
        setIsLocaleMenuOpen(false)
      }

      if (mobileNavRef.current && !mobileNavRef.current.contains(target)) {
        setIsMobileNavOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLocaleMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [locale])

  useEffect(() => {
    document.documentElement.lang = locale
    applySeoMetadata({
      title: copy.meta.title,
      description: copy.meta.description,
      canonicalUrl: HOME_URL,
      ogUrl: HOME_URL,
      ogImage: HOME_OG_IMAGE_URL,
    })
  }, [copy.meta.description, copy.meta.title, locale])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStatementVisible(false)

      window.setTimeout(() => {
        setStatementIndex((currentIndex) => (currentIndex + 1) % copy.hero.rotatingStatements.length)
        setStatementVisible(true)
      }, 280)
    }, 6000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [copy.hero.rotatingStatements])

  const currentStatement = copy.hero.rotatingStatements[statementIndex]
  const isDarkMode = themeMode === 'dark'

  const handleContactChange = (field: keyof ContactFormState, value: string) => {
    setContactForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  if (submitState === 'sending') {
    return
  }

  // Check config
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    setSubmitState('error')
    setSubmitMessage(copy.contact.messages.configMissing)
    return
  }

  // Honeypot check
  if (contactForm.website.trim().length > 0) {
    setSubmitState('success')
    setSubmitMessage(copy.contact.messages.spam)
    return
  }

  // Consent validation
  if (!contactForm.consent) {
    setSubmitState('error')
    setSubmitMessage('Please agree to the privacy policy to continue')
    return
  }

  // Rate limiting
  if (Date.now() - formOpenedAt < CONTACT_MIN_SUBMIT_DELAY_MS) {
    setSubmitState('error')
    setSubmitMessage('Please wait a moment before submitting again.')
    return
  }

  // Cooldown check
  const previousSentAt = Number(window.localStorage.getItem(CONTACT_LAST_SENT_KEY) ?? '0')
  if (Date.now() - previousSentAt < CONTACT_COOLDOWN_MS) {
    setSubmitState('error')
    setSubmitMessage('You have already submitted recently. Please try again later.')
    return
  }

  setSubmitState('sending')
  setSubmitMessage('')

  try {
    // Send to EmailJS with template variables that MATCH your template
    const templateParams = {
      name: contactForm.name,
      title: contactForm.subject,
      // Add destination email to the template params
      to_email: DESTINATION_EMAIL, // This will be the recipient
      // Optional: include other fields if your template uses them
      email: contactForm.email,
      company: contactForm.company,
      message: contactForm.message,
    }

    console.log('Sending email with params:', templateParams)

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
      }
    )

    setSubmitState('success')
    setSubmitMessage(copy.contact.messages.success)
    window.localStorage.setItem(CONTACT_LAST_SENT_KEY, String(Date.now()))
    setContactForm(initialContactForm)
    setFormOpenedAt(Date.now())
  } catch (error) {
    console.error('Email send error:', error)
    
    if (error && typeof error === 'object' && 'text' in error) {
      console.error('Error details:', (error as any).text)
    }
    
    setSubmitState('error')
    setSubmitMessage(copy.contact.messages.error)
  }
}

  return (
    <main className="page-shell">
      <header className="site-header section-shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Red Pill Software home">
          <img
            className="brand-mark"
            src="/logos/REDPILL-logo-assets/REDPILL-transparent-2x-cropped.png"
            width={1347}
            height={433}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <span className="brand-copy">
           
          </span>
        </a>

        <nav className="site-nav site-nav-desktop" aria-label="Primary links">
          <a href="#approach">{copy.nav.approach}</a>
          <a href="#services">{copy.nav.services}</a>
          <a href="#ontoligent">{copy.nav.ontoligent}</a>
          <a href="/use-cases">Use Cases</a>
          <a href="#insights">{copy.nav.insights}</a>
          <a href="#contact">{copy.nav.contact}</a>
        </nav>

        <div className="header-actions">
          <div className="locale-dropdown" ref={localeDropdownRef}>
            <button
              type="button"
              className={isLocaleMenuOpen ? 'locale-dropdown-trigger is-open' : 'locale-dropdown-trigger'}
              onClick={() => setIsLocaleMenuOpen((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={isLocaleMenuOpen}
              aria-label="Select site language"
            >
              <span>{localeLabels[locale]}</span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>

            {isLocaleMenuOpen && (
              <div className="locale-dropdown-menu" role="menu" aria-label="Language options">
                {supportedLocales.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={locale === option ? 'locale-dropdown-item is-active' : 'locale-dropdown-item'}
                    onClick={() => {
                      setLocale(option)
                      setIsLocaleMenuOpen(false)
                    }}
                    role="menuitemradio"
                    aria-checked={locale === option}
                  >
                    <strong>{localeLabels[option]}</strong>
                    <span>{option === 'en' ? 'English' : option === 'fr' ? 'Français' : 'Español'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setThemeMode((mode) => (mode === 'light' ? 'dark' : 'light'))}
            aria-label={copy.theme.aria}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? copy.theme.light : copy.theme.dark}</span>
          </button>

          <a className="nav-cta" href="#contact">{copy.nav.sendMessage}</a>

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
            <a href="#approach" onClick={() => setIsMobileNavOpen(false)}>{copy.nav.approach}</a>
            <a href="#services" onClick={() => setIsMobileNavOpen(false)}>{copy.nav.services}</a>
            <a href="#ontoligent" onClick={() => setIsMobileNavOpen(false)}>{copy.nav.ontoligent}</a>
            <a href="/use-cases" onClick={() => setIsMobileNavOpen(false)}>Use Cases</a>
            <a href="#insights" onClick={() => setIsMobileNavOpen(false)}>{copy.nav.insights}</a>
            <a href="#contact" onClick={() => setIsMobileNavOpen(false)}>{copy.nav.contact}</a>
          </div>
        </div>
      )}

      <section className="hero section-shell" id="top">
        <div className="hero-pattern" aria-hidden="true" />

        <div className="hero-copy">
          <span className="eyebrow">{copy.hero.eyebrow}</span>
          <h1>{copy.hero.title}</h1>
          <p className="hero-intro">{copy.hero.intro}</p>
          <p className="hero-detail">{copy.hero.detail}</p>

          <div className="hero-actions">
            <a className="primary-cta" href="#contact">
              {copy.hero.primary}
            </a>
            <a className="secondary-cta" href="#approach">
              {copy.hero.secondary}
            </a>
          </div>

          <div className="rotating-message" aria-live="polite">
            <span className="rotating-label">{copy.hero.rotatingLabel}</span>
            <p className={`rotating-copy ${statementVisible ? 'is-visible' : ''}`}>{currentStatement}</p>
          </div>
        </div>

        <div className="hero-visual">
          <KnowledgeGraph locale={locale} />
        </div>
      </section>

      <section className="ontoligent-section section-shell" id="ontoligent" aria-labelledby="ontoligent-title">
        <div className="ontoligent-panel">
          <div className="ontoligent-copy">
            <span className="eyebrow">{copy.ontoligent.eyebrow}</span>
            <h2 id="ontoligent-title">{copy.ontoligent.title}</h2>
            <p className="ontoligent-intro">{copy.ontoligent.intro}</p>
            <p className="ontoligent-detail">{copy.ontoligent.detail}</p>

            <div className="ontoligent-actions">
              <a className="primary-cta" {...getLinkProps('https://ontoligent.io')}>
                <span>{copy.ontoligent.ctaPrimary}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a className="secondary-cta" {...getLinkProps('/briefs/ontoligent-executive-brief.html')}>
                {copy.ontoligent.ctaSecondary}
              </a>
            </div>

            <div className="ontoligent-highlights" aria-label="Ontoligent product highlights">
              {copy.ontoligent.highlights.map((highlight) => (
                <article key={highlight.title} className="ontoligent-highlight-card">
                  <span className="ontoligent-highlight-kicker">{highlight.title}</span>
                  <p>{highlight.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="ontoligent-visual" aria-label="Ontoligent architecture summary">
            <div className="ontoligent-visual-topline">
              <span>Enterprise Knowledge Operating System</span>
              <strong>Ontology-as-code, retrieval, agents, and governance in one control plane.</strong>
            </div>

            <div className="ontoligent-stat-grid" aria-label="Product signal metrics">
              {copy.ontoligent.stats.map((stat) => (
                <article key={stat.value} className="ontoligent-stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>

            <div className="ontoligent-stack" aria-label="Capability stack">
              <div>
                <span>Architecture Studio</span>
                <p>Solution-architect copilot for selecting ontology, retrieval, agents, and governance.</p>
              </div>
              <div>
                <span>Execution Proof</span>
                <p>Visible runtime behavior with lineage, citations, replay, and cost controls.</p>
              </div>
              <div>
                <span>Domain Packs</span>
                <p>Vertical bundles for regulated enterprise workflows ready for deployment.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="clients-section section-shell" aria-labelledby="clients-title">
        <div className="clients-wrap">
          <div className="clients-copy">
            <span className="eyebrow">{copy.clients.eyebrow}</span>
            <h2 id="clients-title">{copy.clients.title}</h2>
            <p>{copy.clients.subtitle}</p>
          </div>

          <ul className="clients-grid" aria-label="Client logos">
            {CLIENT_LOGOS.map((logo) => (
              <li key={logo.src} className="client-logo-tile">
                <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="failure-section section-shell" aria-labelledby="failure-title">
        <div className="section-heading section-heading-single">
          <span className="eyebrow">{copy.failure.eyebrow}</span>
          <h2 id="failure-title">{copy.failure.title}</h2>
        </div>

        <div className="failure-grid">
          {copy.failure.items.map((item) => (
            <article key={item.title} className="failure-card">
              <TriangleAlert size={18} strokeWidth={1.9} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <p className="failure-summary">{copy.failure.summary}</p>
      </section>

      <section className="approach-section section-shell" id="approach" aria-labelledby="approach-title">
        <div className="section-heading section-heading-single">
          <span className="eyebrow">{copy.approach.eyebrow}</span>
          <h2 id="approach-title">{copy.approach.title}</h2>
        </div>

        <div className="approach-grid">
          {copy.approach.steps.map((step, index) => (
            <article key={step.title} className="approach-card">
              <span className="approach-step">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gap-section section-shell" aria-labelledby="gap-title">
        <div className="gap-panel">
          <div className="gap-copy">
            <span className="eyebrow">{copy.gap.eyebrow}</span>
            <h2 id="gap-title">{copy.gap.title}</h2>
            {copy.gap.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <a className="gap-cta" href="#contact">
              {copy.gap.cta} <span aria-hidden="true">→</span>
            </a>
          </div>

          <aside className="gap-visual" aria-hidden="true">
            <div className="gap-visual-orbit" />
            <div className="gap-visual-grid" />
            <div className="gap-stage gap-stage-experimental">
              <div className="gap-stage-topline">
                <span>{copy.gap.nodes.experimental}</span>
                <strong>{locale === 'fr' ? 'Modèles expérimentaux' : locale === 'es' ? 'Modelos experimentales' : 'Experimental models'}</strong>
              </div>
              <p>{locale === 'fr' ? 'Sorties imprévisibles, contexte pauvre, confiance faible.' : locale === 'es' ? 'Resultados impredecibles, contexto débil, poca confianza.' : 'Unstable outputs, thin context, low trust.'}</p>
              <div className="gap-stage-meter">
                <i />
              </div>
            </div>

            <div className="gap-stage gap-stage-foundation">
              <div className="gap-stage-topline">
                <span>{copy.gap.nodes.foundation}</span>
                <strong>{locale === 'fr' ? 'Fondation sémantique' : locale === 'es' ? 'Base semántica' : 'Semantic foundation'}</strong>
              </div>
              <p>{locale === 'fr' ? 'Ontologies, graphes et gouvernance relient le sens du métier.' : locale === 'es' ? 'Ontologías, grafos y gobernanza conectan el significado del negocio.' : 'Ontologies, graphs, and governance connect business meaning.'}</p>
              <div className="gap-stage-bridge">
                <span className="bridge-segment bridge-segment-one" />
                <span className="bridge-segment bridge-segment-two" />
                <span className="bridge-segment bridge-segment-three" />
              </div>
            </div>

            <div className="gap-stage gap-stage-enterprise">
              <div className="gap-stage-topline">
                <span>{copy.gap.nodes.enterprise}</span>
                <strong>{locale === 'fr' ? 'Résultat entreprise' : locale === 'es' ? 'Resultado empresarial' : 'Enterprise outcome'}</strong>
              </div>
              <p>{locale === 'fr' ? 'Réponses fiables, traçables et utilisables à grande échelle.' : locale === 'es' ? 'Respuestas fiables, trazables y utilizables a escala.' : 'Reliable, traceable, scalable answers.'}</p>
              <div className="gap-stage-pillrow">
                <span>{locale === 'fr' ? 'Confiance' : locale === 'es' ? 'Confianza' : 'Trust'}</span>
                <span>{locale === 'fr' ? 'Traçabilité' : locale === 'es' ? 'Trazabilidad' : 'Traceability'}</span>
                <span>{locale === 'fr' ? 'Échelle' : locale === 'es' ? 'Escala' : 'Scale'}</span>
              </div>
            </div>

            <div className="gap-connector" />
          </aside>
        </div>
      </section>

      <section className="services-section section-shell" id="services" aria-labelledby="services-title">
        <div className="section-heading section-heading-single">
          <span className="eyebrow">{copy.services.eyebrow}</span>
          <h2 id="services-title">{copy.services.title}</h2>
        </div>

        <div className="services-lens" role="tablist" aria-label="Service detail selector">
          {(['problem', 'approach', 'outcome', 'impact'] as ServiceLens[]).map((lens) => {
            const lensLabel = copy.services.labels[lens]
            const isActive = serviceLens === lens

            return (
              <button
                key={lens}
                type="button"
                role="tab"
                className={isActive ? 'services-lens-button is-active' : 'services-lens-button'}
                aria-selected={isActive}
                onClick={() => setServiceLens(lens)}
              >
                {lensLabel}
              </button>
            )
          })}
        </div>

        <div className="services-grid">
          {copy.services.items.map((service) => {
            const ServiceIcon = service.icon
            const serviceDetailByLens: Record<ServiceLens, string> = {
              problem: service.problem,
              approach: service.approach,
              outcome: service.outcome,
              impact: service.impact,
            }

            return (
              <article key={service.title} className="service-card">
                <div className="service-icon-wrap" aria-hidden="true">
                  <ServiceIcon size={19} strokeWidth={1.9} />
                </div>

                <h3>{service.title}</h3>

                <p className="service-focus-label">{copy.services.labels[serviceLens]}</p>
                <p className="service-focus-copy">{serviceDetailByLens[serviceLens]}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="red-pill-section section-shell" aria-labelledby="red-pill-title">
        <span className="eyebrow">{copy.redPill.eyebrow}</span>
        <h2 id="red-pill-title">{copy.redPill.title}</h2>
        {copy.redPill.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="insights-section section-shell" id="insights" aria-labelledby="insights-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{copy.insights.eyebrow}</span>
            <h2 id="insights-title">{copy.insights.title}</h2>
          </div>
          <p>{copy.insights.intro}</p>
        </div>

        <div className="insights-grid">
          {copy.insights.items.map((insight, index) => (
            <article key={insight.title} className="insight-card">
              <span className="insight-index">0{index + 1}</span>
              <h3>{insight.title}</h3>
              <p>{insight.text}</p>
              <a href="#contact">{copy.insights.cta}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title">
        <div className="contact-panel">
          <div className="contact-copy">
            <span className="eyebrow">{copy.contact.eyebrow}</span>
            <h2 id="contact-title">{copy.contact.title}</h2>
            <p>{copy.contact.intro}</p>
          </div>

          <div className="contact-actions">
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label>
                <span>{copy.contact.fields.name}</span>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={(event) => handleContactChange('name', event.target.value)}
                  required
                />
              </label>

              <label>
                <span>{copy.contact.fields.company}</span>
                <select
                  name="company"
                  value={contactForm.company}
                  onChange={(event) => handleContactChange('company', event.target.value)}
                  required
                >
                  <option value="" disabled>
                    {INDUSTRY_PLACEHOLDER_BY_LOCALE[locale]}
                  </option>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <option key={industry.en} value={industry[locale]}>
                      {industry[locale]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>{copy.contact.fields.email}</span>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={(event) => handleContactChange('email', event.target.value)}
                  required
                />
              </label>

              <label>
                <span>{copy.contact.fields.subject}</span>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={(event) => handleContactChange('subject', event.target.value)}
                  required
                />
              </label>

              <label className="contact-form-full">
                <span>{copy.contact.fields.message}</span>
                <textarea
                  name="message"
                  rows={5}
                  value={contactForm.message}
                  onChange={(event) => handleContactChange('message', event.target.value)}
                  required
                />
              </label>

              <label className="contact-consent contact-form-full">
                <input
                  type="checkbox"
                  name="consent"
                  checked={contactForm.consent}
                  onChange={(event) => setContactForm((current) => ({ ...current, consent: event.target.checked }))}
                  required
                />
                <span>{copy.contact.fields.consent}</span>
              </label>

              <label className="contact-honeypot" aria-hidden="true" tabIndex={-1}>
                <span>Website</span>
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  value={contactForm.website}
                  onChange={(event) => handleContactChange('website', event.target.value)}
                  tabIndex={-1}
                />
              </label>

              <div className="contact-form-actions contact-form-full">
                <button type="submit" className="primary-cta" disabled={submitState === 'sending'}>
                  {submitState === 'sending' ? copy.contact.messages.sending : copy.contact.submit}
                </button>
                <a className="secondary-cta" {...getLinkProps(LINKEDIN_URL)}>
                  {copy.contact.linkedin}
                </a>
              </div>

              {submitMessage && (
                <p className={`contact-feedback contact-feedback-${submitState}`} role="status" aria-live="polite">
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer section-shell" aria-label="Footer">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="Red Pill Software home">
            <img
              className="brand-mark"
              src="/logos/REDPILL-logo-assets/REDPILL-transparent-2x-cropped.png"
              width={1347}
              height={433}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <span className="brand-copy">
             
              <span>Enterprise Intelligence Architecture</span>
            </span>
          </a>
          <address className="footer-address">
            {copy.footer.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>

        <div className="footer-links">
          <a href="#approach">{copy.footer.links[0]}</a>
          <a href="#services">{copy.footer.links[1]}</a>
          <a href="#ontoligent">{copy.footer.links[2]}</a>
          <a href="/use-cases">{copy.footer.links[3]}</a>
          <a href="#insights">{copy.footer.links[4]}</a>
          <a href="#contact">{copy.footer.links[5]}</a>
          <a {...getLinkProps(LINKEDIN_URL)}>{copy.footer.links[6]}</a>
          <a href="/legal/privacy-policy">Privacy Policy</a>
          <a href="/legal/terms-and-conditions">Terms & Conditions</a>
        </div>

        <div>
        
          <p className="footer-thesis">
            Red Pill Software helps organizations build semantic foundations so AI systems can reason with trusted context.
          </p>
        </div>
          
      </footer>
    </main>
  )
}

export default App
