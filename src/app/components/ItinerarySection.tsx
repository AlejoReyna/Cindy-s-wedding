"use client"
import { useRef, useEffect, useState, useCallback } from 'react'
import Image, { StaticImageData } from 'next/image'
import church        from '../../../assets/church.png'
import legalDocument from '../../../assets/legal-document.png'
import nightClub     from '../../../assets/night-club.png'

// ═══════════════════════════════════════════════════════════════════════
// ITINERARY — sticky scroll-driven full-viewport panels
// Each event fills the screen. Normal page scroll drives transitions.
// ═══════════════════════════════════════════════════════════════════════

interface EventData {
  time:  string
  title: string
  icon:  StaticImageData
  alt:   string
}

const EVENTS: EventData[] = [
  { time: '4:30 PM',  title: 'Misa',           icon: church,        alt: 'Misa'           },
  { time: '7:00 PM',  title: 'Ceremonia Civil', icon: legalDocument, alt: 'Ceremonia Civil' },
  { time: '7:00 PM',  title: 'Recepción',       icon: nightClub,     alt: 'Recepción'      },
]

const LETTER_SPEED = 80

// ═══════════════════════════════════════════════════════════════════════

export default function ItinerarySection() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1) // -1 = not yet entered
  const [hasEntered, setHasEntered]   = useState(false)
  // Track which events have been "seen" so their animations persist
  const [seen, setSeen] = useState<boolean[]>(EVENTS.map(() => false))

  // ── Scroll listener: compute which event to show ──
  useEffect(() => {
    const handleScroll = () => {
      const outer = outerRef.current
      if (!outer) return

      const rect = outer.getBoundingClientRect()
      const sectionTop    = -rect.top               // how far we've scrolled into the section
      const sectionHeight = outer.offsetHeight
      const viewportH     = window.innerHeight

      // Total scrollable distance within the section
      const scrollable = sectionHeight - viewportH
      if (scrollable <= 0) return

      // Progress 0→1 through the section
      const progress = Math.max(0, Math.min(1, sectionTop / scrollable))

      // Map progress to event index
      const idx = Math.min(
        EVENTS.length - 1,
        Math.floor(progress * EVENTS.length)
      )

      // Only activate once sticky is actually in view
      if (rect.top <= 0 && rect.bottom >= viewportH) {
        if (!hasEntered) setHasEntered(true)
        setActiveIndex(idx)
        setSeen(prev => {
          if (prev[idx]) return prev
          const next = [...prev]
          next[idx] = true
          return next
        })
      } else if (rect.top > 0) {
        // Haven't reached the section yet
        setActiveIndex(-1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasEntered])

  return (
    <>
      {/* Outer wrapper: tall enough for scroll distance */}
      <div
        ref={outerRef}
        className="it-outer"
        style={{ height: `${EVENTS.length * 100}vh` }}
      >
        {/* Sticky viewport-filling container */}
        <div ref={stickyRef} className="it-sticky">

          {/* Background */}
          <div className="it-bg" />

          {/* ── "Itinerario" header — always visible ── */}
          <div className="it-header">
            <h2 className="it-header-text">
              {'Itinerario'.split('').map((char, i) => (
                <span
                  key={i}
                  className={`it-letter${hasEntered ? ' it-letter--on' : ''}`}
                  style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                >
                  {char}
                </span>
              ))}
            </h2>

            {/* Divider */}
            <div
              className={`it-divider ${hasEntered ? 'it-divider--on' : ''}`}
            >
              <div className="it-divider-line it-divider-line--left" />
              <div className="it-divider-diamond" />
              <div className="it-divider-line it-divider-line--right" />
            </div>
          </div>

          {/* ── Event panels — stacked, only active one visible ── */}
          {EVENTS.map((event, i) => {
            const isActive  = activeIndex === i
            const wasSeen   = seen[i]
            const showPanel = isActive || wasSeen

            return (
              <div
                key={i}
                className="it-event-panel"
                style={{
                  opacity:        isActive ? 1 : 0,
                  pointerEvents:  isActive ? 'auto' : 'none',
                  zIndex:         isActive ? 3 : 1,
                }}
              >
                <div className="it-event-content">
                  {/* Step dots */}
                  <div className="it-step-dots">
                    {EVENTS.map((_, di) => (
                      <div
                        key={di}
                        className={`it-step-dot ${di === i ? 'it-step-dot--active' : ''} ${
                          di < i ? 'it-step-dot--done' : ''
                        }`}
                      />
                    ))}
                  </div>

                  {/* Icon */}
                  <div
                    className={`it-icon-circle ${showPanel ? 'it-icon-circle--in' : ''}`}
                  >
                    <Image
                      src={event.icon}
                      alt={event.alt}
                      width={40}
                      height={40}
                      className="object-contain"
                      style={{ filter: 'sepia(1) saturate(0.5) brightness(0.45)' }}
                    />
                  </div>

                  {/* Time */}
                  <p className="it-time">
                    {event.time.split('').map((char, ci) => (
                      <span
                        key={`t-${ci}`}
                        className={`it-letter${showPanel ? ' it-letter--on' : ''}`}
                        style={{ animationDelay: `${300 + ci * LETTER_SPEED}ms` }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </p>

                  {/* Accent line */}
                  <div className={`it-accent-line ${showPanel ? 'it-accent-line--on' : ''}`} />

                  {/* Title */}
                  <p className="it-title">
                    {event.title.split('').map((char, ci) => (
                      <span
                        key={`n-${ci}`}
                        className={`it-letter${showPanel ? ' it-letter--on' : ''}`}
                        style={{ animationDelay: `${600 + ci * LETTER_SPEED}ms` }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )
          })}

          {/* ── Progress bar at bottom ── */}
          <div className="it-progress-track">
            <div
              className="it-progress-fill"
              style={{
                transform: `scaleX(${activeIndex >= 0
                  ? (activeIndex + 1) / EVENTS.length
                  : 0
                })`,
              }}
            />
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════
           SCOPED STYLES
         ══════════════════════════════════════════════ */}
      <style jsx>{`

        /* ── Outer tall wrapper ── */
        .it-outer {
          position: relative;
          width: 100%;
        }

        /* ── Sticky viewport panel ── */
        .it-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          width: 100%;
          overflow: hidden;
        }

        /* ── Background ── */
        .it-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            #fbf9f6 0%, #f5f2ee 40%, #f0ece6 70%, #f8f6f3 100%
          );
          z-index: 0;
        }
        .it-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image:
            radial-gradient(circle at 25% 20%, rgba(196,152,91,0.2) 0%, transparent 55%),
            radial-gradient(circle at 75% 65%, rgba(139,115,85,0.15) 0%, transparent 55%);
        }

        /* ── Header — top area ── */
        .it-header {
          position: absolute;
          top: clamp(2.5rem, 8vh, 5rem);
          left: 0;
          right: 0;
          text-align: center;
          z-index: 5;
        }
        .it-header-text {
          margin: 0 0 1rem;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #2e1e14;
        }

        /* ── Divider ── */
        .it-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .it-divider-line {
          width: 0;
          height: 1px;
          background: rgba(196,152,91,0.35);
          transition: width 0.8s ease-out 1.2s;
        }
        .it-divider--on .it-divider-line { width: 28px; }
        .it-divider-diamond {
          width: 5px;
          height: 5px;
          background: rgba(196,152,91,0.4);
          transform: rotate(45deg) scale(0);
          transition: transform 0.5s ease-out 1.4s;
        }
        .it-divider--on .it-divider-diamond {
          transform: rotate(45deg) scale(1);
        }

        /* ── Event panel (one per event, stacked absolute) ── */
        .it-event-panel {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.5s ease-out;
        }

        .it-event-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.5rem;
          margin-top: 2rem;
        }

        /* ── Step dots ── */
        .it-step-dots {
          display: flex;
          gap: 10px;
          margin-bottom: clamp(2rem, 5vh, 3.5rem);
        }
        .it-step-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1.5px solid rgba(196,152,91,0.3);
          background: transparent;
          transition: all 0.4s ease;
        }
        .it-step-dot--active {
          background: rgba(196,152,91,0.7);
          border-color: rgba(196,152,91,0.7);
          box-shadow: 0 0 0 3px rgba(196,152,91,0.12);
          transform: scale(1.3);
        }
        .it-step-dot--done {
          background: rgba(196,152,91,0.35);
          border-color: rgba(196,152,91,0.35);
        }

        /* ── Icon ── */
        .it-icon-circle {
          width: clamp(5rem, 14vw, 7rem);
          height: clamp(5rem, 14vw, 7rem);
          border-radius: 50%;
          background: rgba(237,233,226,0.6);
          border: 1px solid rgba(196,152,91,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
        }
        .it-icon-circle--in {
          opacity: 1;
          transform: scale(1);
        }

        /* ── Time ── */
        .it-time {
          margin: 0 0 clamp(0.8rem, 2vh, 1.5rem);
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(3rem, 9vw, 5.5rem);
          letter-spacing: 0.06em;
          color: #2e1e14;
          line-height: 1;
        }

        /* ── Accent line ── */
        .it-accent-line {
          width: 0;
          height: 1px;
          background: rgba(196,152,91,0.35);
          margin-bottom: clamp(0.8rem, 2vh, 1.5rem);
          transition: width 0.7s ease-out 0.7s;
        }
        .it-accent-line--on {
          width: clamp(2.5rem, 8vw, 4rem);
        }

        /* ── Event title ── */
        .it-title {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 500;
          font-size: clamp(0.7rem, 1.4vw, 0.9rem);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8b7355;
        }

        /* ── Letter animation ── */
        .it-letter {
          display: inline-block;
          opacity: 0;
        }
        .it-letter--on {
          animation: itWrite 0.38s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
        }
        @keyframes itWrite {
          0%   { opacity: 0; transform: translateY(8px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }

        /* ── Progress bar ── */
        .it-progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(196,152,91,0.1);
          z-index: 10;
        }
        .it-progress-fill {
          height: 100%;
          background: rgba(196,152,91,0.45);
          transform-origin: left center;
          transition: transform 0.4s ease-out;
        }
      `}</style>
    </>
  )
}
