import { useEffect, useRef } from 'react'

interface FooterGlowLogoProps {
  className?: string
}

function FooterGlowLogo({ className = '' }: FooterGlowLogoProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let pointerInside = false
    let currentX = wrap.clientWidth * 0.5
    let targetX = currentX
    let animationFrame = 0

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const computeScrollTarget = () => {
      const rect = wrap.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height * 0.65), 0, 1)
      return progress * rect.width
    }

    const setGlowVariables = (x: number, width: number) => {
      wrap.style.setProperty('--footer-glow-x', `${x}px`)
      wrap.style.setProperty('--footer-glow-r', `${Math.max(150, width * 0.25)}px`)
    }

    const tick = () => {
      const width = wrap.clientWidth

      if (!pointerInside) {
        targetX = computeScrollTarget()
      }

      currentX += (targetX - currentX) * (reducedMotion ? 0.34 : 0.08)
      setGlowVariables(currentX, width)
      animationFrame = window.requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      pointerInside = true
      targetX = clamp(event.clientX - rect.left, 0, rect.width)
    }

    const onPointerLeave = () => {
      pointerInside = false
      targetX = computeScrollTarget()
    }

    const onScrollOrResize = () => {
      if (!pointerInside) {
        targetX = computeScrollTarget()
      }
    }

    wrap.addEventListener('pointermove', onPointerMove)
    wrap.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    setGlowVariables(currentX, wrap.clientWidth)
    animationFrame = window.requestAnimationFrame(tick)

    return () => {
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div 
      className={`footer-glow-logo ${className}`} 
      ref={wrapRef}
      aria-label="RedPill brand mark"
    >
      <div className="footer-glow-wrapper">
        <svg 
          viewBox="0 0 800 200" 
          role="img" 
          aria-hidden="true"
          className="footer-logo-svg"
        >
          <g>
            {/* Red Pill Icon - simple and clean */}
            <g transform="translate(20 50)">
              <g transform="rotate(-25 60 50)">
                <rect 
                  x="10" 
                  y="10" 
                  width="100" 
                  height="80" 
                  rx="40"
                  fill="#dc2626"
                  opacity="0.9"
                />
                <line 
                  x1="60" 
                  y1="10" 
                  x2="60" 
                  y2="90"
                  stroke="white"
                  strokeWidth="2.5"
                  opacity="0.3"
                />
              </g>
            </g>
            
            {/* Text - clean and bold */}
            <text 
              x="180" 
              y="145"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="140"
              fontWeight="700"
              fill="#dc2626"
              letterSpacing="-4"
            >
              RedPill
            </text>
          </g>
        </svg>

        {/* Glow circle that follows cursor/scroll */}
        <div className="footer-glow-circle" />
      </div>
    </div>
  )
}

export default FooterGlowLogo