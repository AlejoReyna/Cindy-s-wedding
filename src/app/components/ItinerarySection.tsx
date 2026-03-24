"use client"
import { useRef, useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import church        from '../../../assets/church.png'
import legalDocument from '../../../assets/legal-document.png'
import nightClub     from '../../../assets/night-club.png'

// ═══════════════════════════════════════════════════════════════════════
// ITINERARY — sticky scroll-driven, one event at a time.
// After all 3 events are scrolled, a 3-card summary appears and persists.
// ═══════════════════════════════════════════════════════════════════════

interface EventData {
  time:  string
  title: string
  icon:  StaticImageData
  alt:   string
}

const EVENTS: EventData[] = [
  { time: '4:30 PM',  title: 'Misa',                   icon: church,        alt: 'Misa'                   },
  { time: '6:00 PM',  title: 'Cocktail de Bienvenida',  icon: nightClub,     alt: 'Cocktail de Bienvenida'  },
  { time: '7:00 PM',  title: 'Ceremonia Civil',          icon: legalDocument, alt: 'Ceremonia Civil'         },
  { time: '8:00 PM',  title: 'Recepción',                icon: nightClub,     alt: 'Recepción'               },
]

const LETTER_SPEED   = 80
const HEADER_TEXT    = 'Itinerario'
// How many viewport-heights the section occupies for scroll distance
const SCROLL_SCREENS = EVENTS.length + 1.5 // events + summary buffer

export default function ItinerarySection() {
  const outerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLSpanElement>(null)
  const [headerWidth, setHeaderWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [hasEntered, setHasEntered]   = useState(false)
  // Once set, never goes back — summary cards lock in
  const [completed, setCompleted]     = useState(false)
  // Track which events have been activated (for animation persistence)
  const [seen, setSeen] = useState<boolean[]>(EVENTS.map(() => false))
  // After party reveal
  const [afterRevealed, setAfterRevealed] = useState(false)

  // ── Measure header width for divider ──
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      setHeaderWidth(rect.width)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Scroll correction + lock: when completed, pin viewport and freeze
  //    scrolling until the summary card animation finishes (~1 s) ──
  useEffect(() => {
    if (!completed) return
    const outer = outerRef.current
    if (!outer) return

    // Pin viewport to the section's top so the height collapse doesn't jump
    const sectionTop = outer.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: sectionTop, behavior: 'instant' })

    // Lock scrolling while the summary cards animate in
    document.body.style.overflow = 'hidden'
    const unlock = setTimeout(() => {
      document.body.style.overflow = ''
    }, 1000)

    return () => {
      clearTimeout(unlock)
      document.body.style.overflow = ''
    }
  }, [completed])

  // ── Scroll listener ──
  useEffect(() => {
    const handleScroll = () => {
      const outer = outerRef.current
      if (!outer) return

      const rect      = outer.getBoundingClientRect()
      const viewportH = window.innerHeight
      const scrollable = outer.offsetHeight - viewportH
      if (scrollable <= 0) return

      const sectionTop = -rect.top
      const progress   = Math.max(0, Math.min(1, sectionTop / scrollable))

      // Is the sticky container actually pinned?
      const isPinned = rect.top <= 0 && rect.bottom >= viewportH

      if (isPinned || progress >= 0.95) {
        if (!hasEntered) setHasEntered(true)

        // Map progress to event index (0..N-1) then summary
        // Each event gets an equal share of the first ~80% of progress
        const eventProgress = Math.min(progress / 0.8, 1)
        const idx = Math.min(
          EVENTS.length - 1,
          Math.floor(eventProgress * EVENTS.length)
        )

        // If we've scrolled past ~80%, show summary
        if (progress >= 0.8) {
          if (!completed) setCompleted(true)
        }

        // If not yet completed, show individual events
        if (!completed) {
          setActiveIndex(idx)
          setSeen(prev => {
            if (prev[idx]) return prev
            const next = [...prev]
            next[idx] = true
            return next
          })
        }
      } else if (rect.top > viewportH * 0.5) {
        // Haven't reached the section
        if (!completed) setActiveIndex(-1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasEntered, completed])

  return (
    <section className="it-section">
      {/* Outer wrapper: tall for scroll-driving, collapses once done */}
      <div
        ref={outerRef}
        className="it-outer"
        style={{ height: completed ? '100svh' : `${SCROLL_SCREENS * 100}svh` }}
      >
        {/* Sticky viewport container (becomes static once completed) */}
        <div className={completed ? 'it-static' : 'it-sticky'}>

          {/* Background */}
          <div className="it-bg" />

          {/* ── Header — always visible ── */}
          <div className="it-header">
            <h2 className="it-header-text">
              <span ref={headerRef} className="it-header-inner">
                {HEADER_TEXT.split('').map((char, i) => (
                  <span
                    key={i}
                    className={`it-letter${hasEntered ? ' it-letter--on' : ''}`}
                    style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h2>
            <div className="it-divider-wrap">
              <div
                className={`it-divider-expand${hasEntered ? ' it-divider-expand--visible' : ''}`}
                style={{ '--it-divider-target': `${headerWidth}px` } as React.CSSProperties}
              />
            </div>
          </div>

          {/* ── Single-event panels (hidden once completed) ── */}
          {!completed && EVENTS.map((event, i) => {
            const isActive = activeIndex === i
            const wasSeen  = seen[i]

            return (
              <div
                key={i}
                className="it-event-panel"
                style={{
                  opacity:       isActive ? 1 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex:        isActive ? 3 : 1,
                }}
              >
                <div className="it-event-content">
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
                      opacity:   wasSeen ? 1 : 0,
                      transform: wasSeen ? 'scale(1)' : 'scale(0.55)',
                    }}
                  >
                    <Image
                      src={event.icon}
                      alt={event.alt}
                      fill
                      sizes="(max-width: 640px) 88px, 112px"
                      className="it-icon-image"
                      style={{ filter: 'sepia(1) saturate(0.35) brightness(0.50)' }}
                    />
                  </div>

                  {/* Time */}
                  <p className="it-time">
                    {event.time.split('').map((char, ci) => (
                      <span
                        key={`t-${ci}`}
                        className={`it-letter${wasSeen ? ' it-letter--on' : ''}`}
                        style={{ animationDelay: `${250 + ci * LETTER_SPEED}ms` }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </p>

                  {/* Accent */}
                  <div
                    className="it-accent"
                    style={{
                      width: wasSeen ? 'clamp(2.5rem, 8vw, 4rem)' : '0',
                      transitionDelay: '0.65s',
                    }}
                  />

                  {/* Title */}
                  <p className="it-title">
                    {event.title.split('').map((char, ci) => (
                      <span
                        key={`n-${ci}`}
                        className={`it-letter${wasSeen ? ' it-letter--on' : ''}`}
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

          {/* ── Summary cards (once completed, never goes back) ── */}
          <div
            className="it-summary"
            style={{
              opacity:   completed ? 1 : 0,
              transform: completed ? 'translateY(0)' : 'translateY(30px)',
              pointerEvents: completed ? 'auto' : 'none',
            }}
          >
            {/* ── Cards row ── */}
            <div className="it-cards-row">
              {EVENTS.map((event, i) => (
                <div
                  key={i}
                  className="it-card-wrapper"
                  style={{
                    transitionDelay: `${i * 120}ms`,
                    opacity:   completed ? 1 : 0,
                    transform: completed ? 'translateY(0)' : 'translateY(20px)',
                  }}
                >
                  <div className="it-card">
                    <div className="it-card-icon-wrap">
                      <Image
                        src={event.icon}
                        alt={event.alt}
                        fill
                        sizes="(max-width: 640px) 52px, 68px"
                        className="it-card-icon-image"
                        style={{ filter: 'sepia(1) saturate(0.35) brightness(0.50)' }}
                      />
                    </div>
                    <p className="it-card-time">{event.time}</p>
                    <p className="it-card-title">{event.title}</p>
                  </div>
                  {/* Vertical divider on the right — skip last card */}
                  {i < EVENTS.length - 1 && (
                    <div className="it-card-sep" />
                  )}
                </div>
              ))}
            </div>

            {/* ── After party reveal button row ── */}
            <div
              className="it-after-row"
              style={{
                transitionDelay: `${EVENTS.length * 120 + 200}ms`,
                opacity:   completed ? 1 : 0,
                transform: completed ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.6s ease-out, transform 0.5s ease-out',
              }}
            >
              <button
                className={`it-after-btn${afterRevealed ? ' it-after-btn--open' : ''}`}
                onClick={() => !afterRevealed && setAfterRevealed(true)}
              >
                {/* Revealed content sitting underneath */}
                <div className="it-after-revealed">
                  <p className="it-after-revealed-title">After Party</p>
                  <p className="it-after-revealed-location">Lugar: TBD</p>
                </div>
                {/* Sheet cover that lifts on click */}
                <div className={`it-after-sheet${afterRevealed ? ' it-after-sheet--lifted' : ''}`}>
                  <p className="it-after-sheet-title">After Party</p>
                  <p className="it-after-sheet-hint">Click para revelar</p>
                </div>
              </button>
            </div>
          </div>

          {/* Scroll cue (only before completion) */}
          {!completed && (
            <div
              className="it-scroll-cue"
              style={{
                opacity: hasEntered ? 0.45 : 0,
                transitionDelay: '1.6s',
              }}
            >
              <svg className="it-bounce-arrow" width="14" height="22"
                viewBox="0 0 16 24" fill="none"
                stroke="rgba(156,130,108,0.35)" strokeWidth="1.2">
                <path d="M8 4v14M3 14l5 5 5-5"/>
              </svg>
            </div>
          )}

        </div>
      </div>

      {/* ═══ SCOPED STYLES ═══ */}
      <style jsx>{`
        .it-section {
          width: 100%;
          position: relative;
          background-color: #f6ece6;
        }

        .it-outer {
          position: relative;
          width: 100%;
        }

        /* ── Sticky viewport container (scroll-driving phase) ── */
        .it-sticky {
          position: sticky;
          top: 0;
          height: 100svh;
          width: 100%;
          overflow: hidden;
        }
        /* ── Static container (after completion, normal flow) ── */
        .it-static {
          position: relative;
          height: 100svh;
          width: 100%;
          overflow: hidden;
        }

        /* ── Background ── */
        .it-bg {
          position: absolute;
          inset: 0;
          background: #f6ece6;
          z-index: 0;
        }
        .it-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image:
            radial-gradient(circle at 30% 25%, rgba(181,143,108,0.12) 0%, transparent 55%),
            radial-gradient(circle at 70% 70%, rgba(156,130,108,0.08) 0%, transparent 55%);
        }

        /* ══════════════ HEADER ══════════════ */

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
          color: #4a3728;
        }
        .it-header-inner {
          display: inline;
        }
        /* Remove trailing letter-spacing on last letter */
        .it-header-inner > span:last-child {
          letter-spacing: 0;
        }
        .it-divider-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .it-divider-expand {
          height: 1px;
          width: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(181,150,106,0.40) 20%,
            rgba(181,150,106,0.40) 80%,
            transparent 100%
          );
          opacity: 0;
        }
        .it-divider-expand--visible {
          animation: itDividerExpand 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          animation-delay: 1.1s;
        }
        @keyframes itDividerExpand {
          0%   { width: 0; opacity: 0; }
          20%  { opacity: 1; }
          100% { width: var(--it-divider-target, 200px); opacity: 1; }
        }

        /* ══════════════ SINGLE-EVENT PANELS ══════════════ */

        .it-event-panel {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.45s ease-out;
          z-index: 2;
        }

        .it-event-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.5rem;
          margin-top: 2rem;
        }

        .it-step-dots {
          display: flex;
          gap: 10px;
          margin-bottom: clamp(2rem, 5vh, 3.5rem);
        }
        .it-step-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1.5px solid rgba(181,150,106,0.22);
          background: transparent;
          transition: all 0.35s ease;
        }
        .it-step-dot--active {
          background: rgba(181,150,106,0.60);
          border-color: rgba(181,150,106,0.60);
          box-shadow: 0 0 0 3px rgba(181,150,106,0.10);
          transform: scale(1.3);
        }
        .it-step-dot--done {
          background: rgba(181,150,106,0.25);
          border-color: rgba(181,150,106,0.25);
        }

        .it-icon {
          position: relative;
          width: clamp(5rem, 14vw, 7rem);
          height: clamp(5rem, 14vw, 7rem);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
          transition: opacity 0.6s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1);
        }
        .it-icon-image {
          object-fit: contain;
        }

        .it-time {
          margin: 0 0 clamp(0.8rem, 2vh, 1.5rem);
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(3.2rem, 10vw, 6rem);
          letter-spacing: 0.06em;
          color: #4a3728;
          line-height: 1;
        }

        .it-accent {
          height: 1px;
          background: rgba(181,150,106,0.30);
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
          color: #9c8068;
        }

        /* ══════════════ SUMMARY CARDS ══════════════ */

        .it-summary {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(1.2rem, 3vh, 2rem);
          padding: 6rem 2rem 2rem;
          z-index: 4;
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        /* ── Row of event cards ── */
        .it-cards-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          width: min(100%, 980px);
        }

        /* Wrapper holds card + optional right separator */
        .it-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        /* Vertical divider between columns */
        .it-card-wrapper:nth-child(odd) {
          border-right: 1px solid rgba(181,150,106,0.15);
        }

        /* Horizontal divider between rows */
        .it-card-wrapper:nth-child(-n+2) {
          border-bottom: 1px solid rgba(181,150,106,0.15);
        }

        .it-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: clamp(230px, 30vh, 330px);
          padding: clamp(1.5rem, 3vw, 2.5rem);
        }

        /* Vertical separator on the right side */
        .it-card-sep {
          width: 1px;
          height: clamp(80px, 14vh, 140px);
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(181,150,106,0.15),
            transparent
          );
          flex-shrink: 0;
          display: none;
        }

        .it-card-icon-wrap {
          position: relative;
          width: clamp(44px, 10vw, 68px);
          height: clamp(44px, 10vw, 68px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: clamp(0.6rem, 2.5vh, 2rem);
        }
        .it-card-icon-image {
          object-fit: contain;
        }

        .it-card-time {
          margin: 0 0 clamp(0.5rem, 1.2vh, 0.8rem);
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(1.4rem, 4.5vw, 3.2rem);
          letter-spacing: 0.06em;
          color: #4a3728;
          line-height: 1;
        }

        .it-card-title {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 500;
          font-size: clamp(0.65rem, 1.2vw, 0.82rem);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #9c8068;
          text-align: center;
        }

        /* ══════════════ AFTER PARTY REVEAL ══════════════ */

        .it-after-row {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .it-after-btn {
          position: relative;
          overflow: hidden;
          width: clamp(200px, 28vw, 340px);
          height: clamp(60px, 9vh, 82px);
          border-radius: 3px;
          border: 1px solid rgba(181,150,106,0.22);
          background: transparent;
          cursor: pointer;
          padding: 0;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.3s ease;
        }
        .it-after-btn:not(.it-after-btn--open):hover {
          border-color: rgba(181,150,106,0.40);
        }
        .it-after-btn--open {
          cursor: default;
        }

        /* Content revealed underneath the sheet */
        .it-after-revealed {
          position: absolute;
          inset: 0;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }
        .it-after-revealed-title {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-style: italic;
          font-size: clamp(0.85rem, 1.8vw, 1.05rem);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(74,55,40,0.75);
        }
        .it-after-revealed-location {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(0.62rem, 1.1vw, 0.76rem);
          letter-spacing: 0.18em;
          color: rgba(156,130,108,0.55);
        }

        /* The sheet that sits on top and lifts away */
        .it-after-sheet {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #ede0d9 0%, #e6d5cc 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.22rem;
          transform: translateY(0);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .it-after-sheet--lifted {
          transform: translateY(-108%);
        }
        .it-after-sheet-title {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: clamp(0.85rem, 1.8vw, 1.05rem);
          letter-spacing: 0.30em;
          text-transform: uppercase;
          color: #4a3728;
        }
        .it-after-sheet-hint {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 400;
          font-size: clamp(0.58rem, 1vw, 0.72rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(132,88,69,0.85);
          animation: itHintPulse 2.4s ease-in-out infinite;
        }
        @keyframes itHintPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        /* ── Mobile: summary cards in balanced 2×2 grid ── */
        @media (max-width: 640px) {
          .it-header {
            top: clamp(1.8rem, 5vh, 3rem);
          }

          .it-summary {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: clamp(1rem, 2.5vh, 1.6rem);
            padding: clamp(4rem, 10vh, 6rem) 0 1rem;
          }

          .it-cards-row {
            width: 100%;
          }

          .it-card {
            width: 100%;
            height: auto;
            padding: clamp(1rem, 3.5vh, 1.8rem) 0.5rem;
          }

          .it-card-icon-wrap {
            width: 52px;
            height: 52px;
            margin-bottom: 0.6rem;
          }

          .it-card-time {
            font-size: clamp(1.5rem, 6vw, 2rem);
            margin-bottom: 0.35rem;
          }

          .it-card-title {
            font-size: 0.55rem;
            letter-spacing: 0.22em;
          }

          .it-after-row {
            width: 100%;
            padding: 0 1.2rem;
          }

          .it-after-btn {
            width: 100%;
          }
        }

        /* ══════════════ SCROLL CUE ══════════════ */

        .it-scroll-cue {
          position: absolute;
          bottom: clamp(1.5rem, 4vh, 3rem);
          left: 50%;
          transform: translateX(-50%);
          z-index: 6;
          transition: opacity 0.6s ease-out;
        }
        .it-bounce-arrow {
          animation: itBounce 2s ease-in-out infinite;
        }
        @keyframes itBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
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
