import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import KnowledgeGraph from './KnowledgeGraph'

type ContactPayload = {
  company: string
  email: string
  message: string
  name: string
  phone: string
  subject: string
}

const initialForm: ContactPayload = {
  company: '',
  email: '',
  message: '',
  name: '',
  phone: '',
  subject: '',
}

const API_URL = import.meta.env.VITE_CONTACT_API_URL ?? 'https://backend.prompt.tax/api/contact/landing/'

function App() {
  const [preloaderHidden, setPreloaderHidden] = useState(false)
  const [showT1, setShowT1] = useState(false)
  const [showT2, setShowT2] = useState(false)
  const [showT3, setShowT3] = useState(false)
  const [showT3Confirm, setShowT3Confirm] = useState(false)
  const [animateDrop, setAnimateDrop] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [cursorX, setCursorX] = useState<number>(0)
  const [cursorY, setCursorY] = useState<number>(0)
  const [formData, setFormData] = useState<ContactPayload>(initialForm)
  const [consent, setConsent] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const navLinks = ['Products', 'Solutions', 'About', 'Resources']

  const metrics = [
    { value: '6', label: 'Connected Nodes' },
    { value: '12', label: 'Active Agents' },
    { value: '128K+', label: 'Knowledge Entities' },
    { value: '99.9%', label: 'System Uptime' },
  ]

  const footerColumns = [
    {
      title: 'Products',
      links: ['PromptTax', 'Ontologent', 'Studio', 'OnlyPPL', 'Recurring22AI Node', 'Series Academy'],
    },
    {
      title: 'Solutions',
      links: ['AI Automation', 'Knowledge Graphs', 'Agentic Workflows', 'Data Intelligence', 'Workflow Optimization', 'Enterprise AI'],
    },
    {
      title: 'Resources',
      links: ['Docs', 'Case Studies', 'Blog', 'Developer Portal', 'Status'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'],
    },
  ]

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setAnimateDrop(true), 1000),
      window.setTimeout(() => setShowT1(true), 2000),
      window.setTimeout(() => setShowT2(true), 3000),
      window.setTimeout(() => setShowT3(true), 4000),
      window.setTimeout(() => setShowT3Confirm(true), 4500),
      window.setTimeout(() => setPreloaderHidden(true), 5500),
    ]

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      setCursorX(event.clientX)
      setCursorY(event.clientY)
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false)
      }
    }

    window.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('keydown', onEsc)
    }
  }, [])

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    const timer = window.setTimeout(() => {
      setToastMessage('')
    }, 3500)

    return () => {
      window.clearTimeout(timer)
    }
  }, [toastMessage])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    let animationId = 0
    const letters = '01ABCDEF<>*#'
    const fontSize = 16
    let drops: number[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const columns = Math.floor(canvas.width / fontSize)
      drops = Array.from({ length: columns }, () => 1)
    }

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.08)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = 'rgba(22, 255, 156, 0.25)'
      context.font = `${fontSize}px monospace`

      for (let index = 0; index < drops.length; index += 1) {
        const char = letters[Math.floor(Math.random() * letters.length)]
        context.fillText(char, index * fontSize, drops[index] * fontSize)

        if (drops[index] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0
        }
        drops[index] += 1
      }

      animationId = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleModalOpen = () => {
    setModalOpen(true)
    setErrorMessage('')
    if (submitState !== 'sending') {
      setSubmitState('idle')
    }
  }

  const handleModalClose = () => {
    if (submitState === 'sending') {
      return
    }

    setModalOpen(false)
    setSubmitState('idle')
    setErrorMessage('')
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!consent || submitState === 'sending') {
      return
    }

    const normalizedSubject = formData.subject.trim()
    const normalizedPhone = formData.phone.trim()
    const normalizedEmail = formData.email.trim()

    if (normalizedSubject.length < 4) {
      setSubmitState('error')
      setErrorMessage('Subject must be at least 4 characters.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setSubmitState('error')
      setErrorMessage('Please provide a valid email address.')
      return
    }

    if (!/^\+?[0-9()\-\s]{7,20}$/.test(normalizedPhone)) {
      setSubmitState('error')
      setErrorMessage('Please provide a valid phone number.')
      return
    }

    setSubmitState('sending')
    setErrorMessage('')

    try {
      const payload = new FormData()
      payload.append('company', formData.company)
      payload.append('email', formData.email)
      payload.append('message', formData.message)
      payload.append('name', formData.name)
      payload.append('phone', formData.phone)
      payload.append('subject', formData.subject)

      const response = await fetch(API_URL, {
        method: 'POST',
        body: payload,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to transmit signal. Please try again.')
      }

      setSubmitState('success')
      window.setTimeout(() => {
        setModalOpen(false)
        setSubmitState('idle')
        setConsent(false)
        setFormData(initialForm)
        setToastMessage('Signal delivered. Operator will respond soon.')
      }, 1500)
    } catch {
      setSubmitState('error')
      setErrorMessage('Transmission failed. Verify fields and retry.')
    }
  }

  return (
    <>
      <canvas ref={canvasRef} id="matrix" aria-hidden="true" />

      <div
        className="cursor-glow"
        style={{
          left: cursorX,
          top: cursorY,
        }}
        aria-hidden="true"
      />

      <div
        id="preloader"
        className={preloaderHidden ? 'preloader-hidden' : ''}
        aria-hidden={preloaderHidden}
      >
        <div id="sapphire-pill" className={`sapphire-pill ${animateDrop ? 'animate-drop' : ''}`} />
        <div className="terminal-boot font-mono">
          {showT1 && (
            <p className={`term-line ${!showT2 ? 'typing-cursor' : ''}`}>{'> INITIALIZING SECURE CONNECTION...'}</p>
          )}
          {showT2 && (
            <p className={`term-line ${!showT3 ? 'typing-cursor' : ''}`}>{'> BYPASSING MAINFRAME...'}</p>
          )}
          {showT3 && (
            <p className="term-line">
              <span>{'> TRACING SIGNAL... '}</span>
              {showT3Confirm && <span className="term-red typing-cursor">PATH CONFIRMED: RED PILL.</span>}
            </p>
          )}
        </div>
      </div>

      <main className={`page ${preloaderHidden ? 'page-ready' : ''}`}>
        <header className="site-header section-shell" aria-label="Primary navigation">
          <a className="brand" href="#hero-section" aria-label="Red Pill Software home">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-copy">
              <strong>Red Pill</strong>
              <span>Software</span>
            </span>
          </a>
          <nav className="site-nav">
            {navLinks.map((link) => (
              <a key={link} href="#hero-section">
                {link}
              </a>
            ))}
          </nav>
          <button type="button" className="nav-cta" onClick={handleModalOpen}>
            Take The Red Pill
          </button>
        </header>

        <section className="hero section-shell" id="hero-section">
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-radial" aria-hidden="true" />
          <div className="hero-copy">
            <div className="pill-mark" aria-hidden="true">
              <span className="pill-half pill-half-solid" />
              <span className="pill-half pill-half-glass" />
            </div>
            <h1>
              Escape the
              <span className="red">Software Matrix.</span>
            </h1>
            <p>AI systems and automation tools designed to wake your business up.</p>
            <button type="button" className="primary-cta" onClick={handleModalOpen}>
              <span>Take The Red Pill</span>
            </button>
          </div>
        </section>

        <section className="graph-section section-shell" aria-labelledby="graph-title">
          <div className="graph-frame">
            <div className="graph-frame-head">
              <div>
                <p className="graph-eyebrow">System Network</p>
                <h2 id="graph-title">Live Knowledge Graph</h2>
              </div>
              <div className="graph-legend" aria-label="Graph legend">
                <span><i className="legend-dot legend-system" />System</span>
                <span><i className="legend-dot legend-agent" />Agent</span>
                <span><i className="legend-dot legend-resource" />Resource</span>
                <span><i className="legend-dot legend-connection" />Connection</span>
              </div>
            </div>

            <KnowledgeGraph onContactClick={handleModalOpen} />

            <div className="graph-metrics" aria-label="System metrics">
              {metrics.map((metric) => (
                <article key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="protocol section-shell" aria-labelledby="protocol-title">
          <header className="protocol-head">
            <span className="protocol-tag">{'// OPERATOR PROTOCOL'}</span>
            <h2 id="protocol-title">
              Three steps to <span className="red">unplug</span>.
            </h2>
            <p>
              Every engagement follows the same path: find the loop draining your team, replace it with an agent, then
              hand back the time it stole.
            </p>
          </header>
          <ol className="protocol-steps">
            <li className="protocol-step">
              <span className="protocol-step-num">01</span>
              <h3>Identify the glitch</h3>
              <p>
                We map the workflow, the tools and the humans inside it. Bottlenecks, manual handoffs and silent rework
                get tagged.
              </p>
            </li>
            <li className="protocol-step">
              <span className="protocol-step-num">02</span>
              <h3>Inject the agent</h3>
              <p>
                We build, deploy and integrate the AI system — tax engine, knowledge graph, retrieval pipeline or
                bespoke agent — directly into your stack.
              </p>
            </li>
            <li className="protocol-step">
              <span className="protocol-step-num">03</span>
              <h3>Reclaim the loop</h3>
              <p>
                Your team stops shipping the same task twice. Outputs are governed, auditable, and tenant-isolated by
                default.
              </p>
            </li>
          </ol>
        </section>

        <section className="final-cta section-shell" aria-labelledby="final-cta-title">
          <h2 id="final-cta-title">This is your last chance.</h2>
          <p>
            You take the blue pill and the story ends.<br />
            You take the red pill and see how deep the rabbit hole goes.
          </p>
          <button type="button" className="primary-cta" onClick={handleModalOpen}>
            <span>Take The Red Pill</span>
          </button>
        </section>

        <footer className="site-footer section-shell" aria-label="Company footer">
          <div className="site-footer-grid">
            <div className="footer-brand-block">
              <a className="brand footer-brand" href="#hero-section" aria-label="Red Pill Software home">
                <span className="brand-mark" aria-hidden="true" />
                <span className="brand-copy">
                  <strong>Red Pill</strong>
                  <span>Software</span>
                </span>
              </a>
              <p>AI systems and automation tools that wake your business up.</p>
              <div className="footer-socials" aria-label="Social links">
                <span>X</span>
                <span>in</span>
                <span>yt</span>
                <span>gh</span>
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title} className="footer-column">
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#hero-section">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="footer-column footer-signup">
              <h3>Stay Connected</h3>
              <p>Join our newsletter for insights, updates and deep dives.</p>
              <label className="footer-input" htmlFor="footer-email">
                <input id="footer-email" type="email" placeholder="Your email" />
                <span aria-hidden="true">&gt;</span>
              </label>
            </div>
          </div>
          <div className="site-footer-meta">
            <p>© 2025 Red Pill Software. All rights reserved.</p>
            <p>Built for the builders who refuse the loop.</p>
            <p>Access Node: United States</p>
          </div>
        </footer>
      </main>

      <div
        id="modal"
        className={`modal-wrapper ${modalOpen ? 'modal-open' : ''}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleModalClose()
          }
        }}
      >
        <div className="terminal-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <div className="terminal-modal-bg" aria-hidden="true" />
          <button type="button" className="close-hitbox" onClick={handleModalClose} aria-label="Close dialog" />
          <header className="terminal-modal-header" aria-hidden="true">
            <span className="terminal-modal-status">
              <span className="terminal-modal-dot" /> SECURE LINE ESTABLISHED
            </span>
            <span className="terminal-modal-meta">NODE / NEBUCHADNEZZAR · CHANNEL 01</span>
          </header>
          <form id="secure-form" onSubmit={handleSubmit}>
            <h3 id="contact-title" className="terminal-modal-title">Contact Transmission</h3>
            <p className="terminal-modal-subtitle">
              Drop your signal. We respond inside 24 hours, usually faster.
            </p>

            <div className="form-grid">
              <label className="field">
                <span className="field-label">{'> ALIAS'}</span>
                <input
                  type="text"
                  id="alias"
                  name="name"
                  className="seamless-input"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">{'> COMM CHANNEL'}</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="seamless-input"
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">{'> COMPANY'}</span>
                <input
                  type="text"
                  name="company"
                  className="seamless-input"
                  placeholder="Organization"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">{'> PHONE'}</span>
                <input
                  type="tel"
                  name="phone"
                  className="seamless-input"
                  placeholder="+1 ..."
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="field field-full">
                <span className="field-label">{'> SUBJECT'}</span>
                <input
                  type="text"
                  name="subject"
                  className="seamless-input"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="field field-full">
                <span className="field-label">{'> THE GLITCH (your message)'}</span>
                <textarea
                  id="message"
                  name="message"
                  className="seamless-input"
                  placeholder="Describe what should be automated, what is broken, or who you need to reach..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="consent-wrapper">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                required
              />
              <label htmlFor="consent">I verify my choice and reject automated spam protocols.</label>
            </div>

            <button type="submit" className="terminal-submit" disabled={submitState === 'sending'}>
              {submitState === 'sending' && 'TRANSMITTING...'}
              {submitState === 'success' && 'SIGNAL SENT'}
              {submitState === 'error' && 'RETRY TRANSMISSION'}
              {submitState === 'idle' && 'TRANSMIT DATA'}
            </button>

            {errorMessage && <p className="submit-status">{errorMessage}</p>}
          </form>
        </div>
      </div>

      <div className={`success-toast ${toastMessage ? 'success-toast-visible' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </>
  )
}

export default App
