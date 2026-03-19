import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

type ContactPayload = {
  company: string
  email: string
  message: string
  name: string
  phone: string
  subject: string
}

type ProductCard = {
  title: string
  subtitle: string
  description: string
  href?: string
  cta: string
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

const productCards: ProductCard[] = [
  {
    title: 'PromptTax',
    subtitle: 'AI TAX ENGINE',
    description: 'Automate Schedule K-1 workflows, BOIR filings and complex tax preparation with AI.',
    href: 'https://prompt.tax',
    cta: 'Access prompt.tax',
  },
  {
    title: 'OnlyPPL',
    subtitle: 'HUMAN CONNECTION AI',
    description: 'Describe a problem and instantly connect to the exact person who can solve it.',
    href: 'https://mageek.dev',
    cta: 'Access mageek.dev',
  },
  {
    title: 'Studio',
    subtitle: 'CREATIVE AI ENGINE',
    description: 'Generate content, publish books, and automate social media campaigns using AI.',
    href: 'https://studio.mageek.dev',
    cta: 'Access studio.mageek.dev',
  },
  {
    title: 'Nebuchadnezzar Node',
    subtitle: 'MATRIX SIGNAL OPS',
    description: 'Route encrypted prompts through a live command node and transmit secure outreach data.',
    cta: 'Open Signal Channel',
  },
]

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
        <section className="hero" id="hero-section">
          <div className="hero-glow" />
          <div className="pill-mark" />
          <h1>Escape the</h1>
          <h1 className="red">Software Matrix.</h1>
          <p>AI systems and automation tools designed to wake your business up.</p>
          <button type="button" onClick={handleModalOpen}>
            Take The Red Pill
          </button>
        </section>

        <section className="products">
          {productCards.map((card) => (
            <article className="card" key={card.title}>
              <h3>{card.title}</h3>
              <small>{card.subtitle}</small>
              <p>{card.description}</p>
              {card.href ? (
                <a className="access-link" href={card.href} target="_blank" rel="noreferrer">
                  {card.cta}
                </a>
              ) : (
                <button type="button" className="access-link access-button" onClick={handleModalOpen}>
                  {card.cta}
                </button>
              )}
            </article>
          ))}
        </section>

        <section className="section">
          <h2>This is your last chance.</h2>
          <p>
            You take the blue pill and the story ends.<br />
            You take the red pill and see how deep the rabbit hole goes.
          </p>
          <button type="button" onClick={handleModalOpen}>
            Take The Red Pill
          </button>
        </section>

        <footer className="matrix-footer" aria-label="Company contact information">
          <div className="matrix-footer-inner">
            <p className="matrix-footer-label">ACCESS NODE: UNITED STATES</p>
            <h3>United States</h3>
            <p>931 NE 199TH ST APT 203 Miami, FL, United States, Florida 33179</p>
            <p>
              Call:{' '}
              <a href="tel:+17866003010" className="footer-phone-link">
                786 600 3010
              </a>
            </p>
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
          <button type="button" className="close-hitbox" onClick={handleModalClose} aria-label="Close dialog" />
          <form id="secure-form" onSubmit={handleSubmit}>
            <h3 id="contact-title" className="sr-only">
              Contact Transmission
            </h3>

            <input
              type="text"
              id="alias"
              name="name"
              className="seamless-input"
              placeholder=">_"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              className="seamless-input"
              placeholder=">_"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <textarea
              id="message"
              name="message"
              className="seamless-input"
              placeholder=">_"
              value={formData.message}
              onChange={handleInputChange}
              required
            />

            <div className="extra-fields">
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
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
              {submitState === 'idle' && 'Transmit Data'}
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
