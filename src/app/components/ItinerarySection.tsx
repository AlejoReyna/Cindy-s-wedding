"use client"
import { useRef, useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import church        from '../../../assets/church.png'
import legalDocument from '../../../assets/legal-document.png'
import nightClub     from '../../../assets/night-club.png'

// ═══════════════════════════════════════════════════════════════════════
// ITINERARY — stacked full-viewport panels in normal document flow.
// Each event is 100svh. Animations fire via IntersectionObserver.
// No scroll tricks — everyone sees everything just by scrolling.
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
const HEADER_TEXT  = 'Itinerario'

// ─── Hook: trigger once when element enters viewport ──────────────────
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

// ═══════════════════════════════════════════════════════════════════════

export default function ItinerarySection() {
  // One observer per panel (header + 3 events = 4)
  const h  = useInView(0.3)
  const e0 = useInView(0.3)
  const e1 = useInView(0.3)
  const e2 = useInView(0.3)
  const eventVis = [e0, e1, e2]

  return (
    <section className="it-section">

      {/* ════════════════ HEADER PANEL ════════════════ */}
      <div ref={h.ref} className="it-panel">
        <div className="it-panel-bg" />
        <div className="it-inner">
          {/* Clock ornament */}
          <div
            className="it-clock"
            style={{
              opacity:   h.visible ? 1 : 0,
              transform: h.visible ? 'scale(1)' : 'scale(0.8)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="rgba(139,115,85,0.4)" strokeWidth="1">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>

          {/* "Itinerario" letter by letter */}
          <h2 className="it-header-text">
            {HEADER_TEXT.split('').map((char, i) => (
              <span
                key={i}
                className={`it-letter${h.visible ? ' it-letter--on' : ''}`}
                style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
              >
                {char}
              </span>
            ))}
          </h2>

          {/* Decorative divider */}
          <div className="it-divider-wrap">
            <div
              className="it-divider-line"
              style={{
                width: h.visible ? 32 : 0,
                transitionDelay: '1.1s',
              }}
            />
            <div
              className="it-divider-diamond"
              style={{
                transform: h.visible
                  ? 'rotate(45deg) scale(1)'
                  : 'rotate(45deg) scale(0)',
                transitionDelay: '1.3s',
              }}
            />
            <div
              className="it-divider-line"
              style={{
                width: h.visible ? 32 : 0,
                transitionDelay: '1.1s',
              }}
            />
          </div>

          {/* Scroll cue */}
          <div
            className="it-scroll-cue"
            style={{
              opacity: h.visible ? 0.5 : 0,
              transitionDelay: '1.8s',
            }}
          >
            <svg className="it-bounce-arrow" width="16" height="24"
              viewBox="0 0 16 24" fill="none"
              stroke="rgba(139,115,85,0.45)" strokeWidth="1.2">
              <path d="M8 4v14M3 14l5 5 5-5"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ════════════════ EVENT PANELS ════════════════ */}
      {EVENTS.map((event, i) => {
        const { ref, visible } = eventVis[i]

        return (
          <div key={i} ref={ref} className="it-panel">
            <div className="it-panel-bg" />
            <div className="it-inner">

              {/* Step dots */}
              <div className="it-step-dots">
                {EVENTS.map((_, di) => (
                  <div
                    key={di}
                    className={`it-step-dot${
                      di === i ? ' it-step-dot--active' : ''
                    }${di < i ? ' it-step-dot--done' : ''}`}
                  />
                ))}
              </div>

              {/* Icon */}
              <div
                className="it-icon"
                style={{
                  opacity:   visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(0.55)',
                }}
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
                    className={`it-letter${visible ? ' it-letter--on' : ''}`}
                    style={{ animationDelay: `${250 + ci * LETTER_SPEED}ms` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </p>

              {/* Accent line */}
              <div
                className="it-accent"
                style={{
                  width: visible ? 'clamp(2.5rem, 8vw, 4rem)' : '0',
                  transitionDelay: '0.65s',
                }}
              />

              {/* Title */}
              <p className="it-title">
                {event.title.split('').map((char, ci) => (
                  <span
                    key={`n-${ci}`}
                    className={`it-letter${visible ? ' it-letter--on' : ''}`}
                    style={{ animationDelay: `${550 + ci * LETTER_SPEED}ms` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )
      })}

      {/* ═══ SCOPED STYLES ═══ */}
      <style jsx>{`
        .it-section {
          width: 100%;
        }

        /* ── Each panel fills viewport ── */
        .it-panel {
          width: 100%;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Background layer */
        .it-panel-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            #fbf9f6 0%, #f5f2ee 40%, #f0ece6 70%, #f8f6f3 100%
          );
          z-index: 0;
        }
        .it-panel-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image:
            radial-gradient(circle at 30% 25%, rgba(196,152,91,0.2) 0%, transparent 55%),
            radial-gradient(circle at 70% 70%, rgba(139,115,85,0.15) 0%, transparent 55%);
        }

        .it-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem;
        }

        /* ══════════════ HEADER ══════════════ */

        .it-clock {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(237,233,226,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .it-header-text {
          margin: 0 0 1.2rem;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(2.2rem, 6vw, 3.2rem);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #2e1e14;
          text-align: center;
        }

        .it-divider-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2rem;
        }
        .it-divider-line {
          height: 1px;
          background: rgba(196,152,91,0.35);
          transition: width 0.8s ease-out;
        }
        .it-divider-diamond {
          width: 5px;
          height: 5px;
          background: rgba(196,152,91,0.4);
          transition: transform 0.5s ease-out;
        }

        .it-scroll-cue {
          position: absolute;
          bottom: clamp(2rem, 6vh, 4rem);
          left: 50%;
          transform: translateX(-50%);
          transition: opacity 0.6s ease-out;
        }
        .it-bounce-arrow {
          animation: itBounce 2s ease-in-out infinite;
        }
        @keyframes itBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }

        /* ══════════════ EVENT PANELS ══════════════ */

        .it-step-dots {
          display: flex;
          gap: 10px;
          margin-bottom: clamp(2rem, 5vh, 3.5rem);
        }
        .it-step-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1.5px solid rgba(196,152,91,0.25);
          background: transparent;
          transition: all 0.35s ease;
        }
        .it-step-dot--active {
          background: rgba(196,152,91,0.7);
          border-color: rgba(196,152,91,0.7);
          box-shadow: 0 0 0 3px rgba(196,152,91,0.12);
          transform: scale(1.3);
        }
        .it-step-dot--done {
          background: rgba(196,152,91,0.3);
          border-color: rgba(196,152,91,0.3);
        }

        .it-icon {
          width: clamp(5rem, 14vw, 7rem);
          height: clamp(5rem, 14vw, 7rem);
          border-radius: 50%;
          background: rgba(237,233,226,0.55);
          border: 1px solid rgba(196,152,91,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
          transition: opacity 0.6s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1);
        }

        .it-time {
          margin: 0 0 clamp(0.8rem, 2vh, 1.5rem);
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(3.2rem, 10vw, 6rem);
          letter-spacing: 0.06em;
          color: #2e1e14;
          line-height: 1;
        }

        .it-accent {
          height: 1px;
          background: rgba(196,152,91,0.35);
          margin-bottom: clamp(0.8rem, 2vh, 1.5rem);
          transition: width 0.7s ease-out;
        }

        .it-title {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 500;
          font-size: clamp(0.75rem, 1.5vw, 0.95rem);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8b7355;
        }

        /* ══════════════ LETTER ANIMATION ══════════════ */

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
      `}</style>
    </section>
  )
}
