"use client"
import { useRef, useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import church        from '../../../assets/church.png';
import legalDocument from '../../../assets/legal-document.png';
import nightClub     from '../../../assets/night-club.png';

// ═══════════════════════════════════════════════════════════════════════
// ITINERARY — vertical alternating timeline
// ───────────────────────────────────────────────────────────────────────
// Layout per event row (3-column grid: 1fr | 20px | 1fr):
//
//   side='left'  →  col-left: ICON   | ◆ center | col-right: TEXT
//   side='right' →  col-left: TEXT   | ◆ center | col-right: ICON
//
// Text animation: same letter-by-letter keyframe as Hero / Gallery / Parents.
// NOTE: All letter-span rendering is INLINE inside ItinerarySection's JSX
// so styled-jsx scoped classes (.it-letter, .it-letter--on) apply correctly.
// ═══════════════════════════════════════════════════════════════════════

const LETTER_SPEED = 90   // ms per character

interface EventData {
  time:  string
  title: string
  icon:  StaticImageData
  alt:   string
  side:  'left' | 'right'
}

const EVENTS: EventData[] = [
  { time: '3:30 PM',  title: 'Misa',           icon: church,        alt: 'Misa',           side: 'left'  },
  { time: '6:30 PM',  title: 'Ceremonia Civil', icon: legalDocument, alt: 'Ceremonia Civil', side: 'right' },
  { time: '7:00 PM',  title: 'Recepción',       icon: nightClub,     alt: 'Recepción',      side: 'left'  },
]

const HEADER_TEXT = 'Itinerario'

// ms until the last character of a string has fully appeared
const writeDur = (s: string) => s.length * LETTER_SPEED + 380


export default function ItinerarySection() {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Sequential flags ──
  const [headerStarted, setHeaderStarted] = useState(false)
  const [line0Drawn,    setLine0Drawn]    = useState(false)
  const [event0Started, setEvent0Started] = useState(false)
  const [line1Drawn,    setLine1Drawn]    = useState(false)
  const [event1Started, setEvent1Started] = useState(false)
  const [line2Drawn,    setLine2Drawn]    = useState(false)
  const [event2Started, setEvent2Started] = useState(false)

  // ── Intersection → kick off chain ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '-40px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ① header done → first segment + event 0
  useEffect(() => {
    if (!headerStarted) return
    const headerDur = writeDur(HEADER_TEXT)
    const t1 = setTimeout(() => setLine0Drawn(true),    headerDur + 200)
    const t2 = setTimeout(() => setEvent0Started(true), headerDur + 650)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [headerStarted])

  // event 0 done → segment + event 1
  useEffect(() => {
    if (!event0Started) return
    const dur = Math.max(writeDur(EVENTS[0].time), writeDur(EVENTS[0].title)) + 300
    const t1 = setTimeout(() => setLine1Drawn(true),    dur)
    const t2 = setTimeout(() => setEvent1Started(true), dur + 450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [event0Started])

  // event 1 done → segment + event 2
  useEffect(() => {
    if (!event1Started) return
    const dur = Math.max(writeDur(EVENTS[1].time), writeDur(EVENTS[1].title)) + 300
    const t1 = setTimeout(() => setLine2Drawn(true),    dur)
    const t2 = setTimeout(() => setEvent2Started(true), dur + 450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [event1Started])

  const eventStarted = [event0Started, event1Started, event2Started]
  const lineDrawn    = [line0Drawn,    line1Drawn,    line2Drawn]

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full py-24 md:py-32 px-4 md:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      {/* Organic texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 20%, rgba(196,152,91,0.15) 0%, transparent 60%),
              radial-gradient(circle at 75% 60%, rgba(139,115,85,0.12) 0%, transparent 60%),
              radial-gradient(circle at 50% 90%, rgba(180,147,113,0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* ═══ Section Header ═══ */}
        <div className="text-center mb-20 md:mb-28">
          {/* Clock ornament */}
          <div
            className={`flex justify-center mb-10 transition-all duration-[1200ms] ease-out ${
              headerStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="w-16 h-16 bg-[#ede9e2] rounded-full flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(139,115,85,0.4)" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>

          {/* "Itinerario" — letter by letter (inline → styled-jsx applies) */}
          <h2 className="it-header-text mb-6">
            {HEADER_TEXT.split('').map((char, i) => (
              <span
                key={i}
                className={`it-letter${headerStarted ? ' it-letter--on' : ''}`}
                style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
              >
                {char}
              </span>
            ))}
          </h2>

          {/* Decorative divider */}
          <div
            className={`flex items-center justify-center gap-3 transition-all duration-[900ms] ease-out ${
              headerStarted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transitionDelay: `${writeDur(HEADER_TEXT)}ms` }}
          >
            <div className="w-10 h-[0.5px] bg-gradient-to-r from-transparent to-[#C4985B]/50" />
            <div className="w-1 h-1 rounded-full bg-[#C4985B]/40" />
            <div className="w-10 h-[0.5px] bg-gradient-to-l from-transparent to-[#C4985B]/50" />
          </div>
        </div>

        {/* ═══ Vertical Timeline ═══ */}
        <div className="relative">

          {EVENTS.map((event, i) => {
            const isLeft   = event.side === 'left'
            const started  = eventStarted[i]
            const segDrawn = lineDrawn[i]

            // Title starts partway through the time animation
            const titleDelay = Math.floor(event.time.length * LETTER_SPEED * 0.5)

            // ── Icon block (reused in left or right column) ──
            const iconBlock = (
              <div
                className={`transition-all duration-700 ease-out ${
                  started ? 'opacity-60 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ transitionDelay: started ? '100ms' : '0ms' }}
              >
                <Image
                  src={event.icon}
                  alt={event.alt}
                  width={34}
                  height={34}
                  className="object-contain"
                  style={{ filter: 'sepia(1) saturate(0.5) brightness(0.45)' }}
                />
              </div>
            )

            // ── Text block (time + title, letter by letter) ──
            // Uses inline styles so visibility is NOT dependent on styled-jsx scoping
            const textBlock = (
              <div className={`flex flex-col gap-[4px] ${isLeft ? 'items-start text-left' : 'items-end text-right'}`}>
                {/* Time */}
                <p style={{ margin: 0, lineHeight: 1 }}>
                  {event.time.split('').map((char, ci) => (
                    <span
                      key={`time-${i}-${ci}`}
                      className={`it-letter${started ? ' it-letter--on' : ''}`}
                      style={{
                        animationDelay: `${ci * LETTER_SPEED}ms`,
                        fontFamily: "'Cormorant Garamond', 'EB Garamond', serif",
                        fontWeight: 400,
                        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                        letterSpacing: '0.08em',
                        color: '#2e1e14',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </p>
                {/* Title */}
                <p style={{ margin: 0 }}>
                  {event.title.split('').map((char, ci) => (
                    <span
                      key={`ttl-${i}-${ci}`}
                      className={`it-letter${started ? ' it-letter--on' : ''}`}
                      style={{
                        animationDelay: `${titleDelay + ci * LETTER_SPEED}ms`,
                        fontFamily: "'Cormorant Garamond', 'EB Garamond', serif",
                        fontWeight: 500,
                        fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                        letterSpacing: '0.36em',
                        textTransform: 'uppercase',
                        color: '#4a3728',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </p>
              </div>
            )

            return (
              <div key={i} className="relative">

                {/* ── Line segment above this marker ── */}
                <div className="flex justify-center">
                  <div
                    style={{
                      width: '5px',
                      height: i === 0 ? '48px' : '72px',
                      backgroundImage: 'radial-gradient(circle at center, rgba(196,152,91,0.6) 1.5px, transparent 1.5px)',
                      backgroundSize: '5px 9px',
                      backgroundRepeat: 'repeat-y',
                      backgroundPosition: 'center top',
                      maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                      opacity:         segDrawn ? 1 : 0,
                      transform:       segDrawn ? 'scaleY(1)' : 'scaleY(0)',
                      transformOrigin: 'top center',
                      transition: 'opacity 700ms ease-out, transform 700ms ease-out',
                    }}
                  />
                </div>

                {/* ── 3-col row: [left 1fr] | [◆ 20px] | [right 1fr] ── */}
                <div className="it-grid items-center">

                  {/* ── Left column ── */}
                  <div className="it-col-left">
                    {isLeft
                      ? /* left event → icon goes here */ iconBlock
                      : /* right event → text goes here */ textBlock
                    }
                  </div>

                  {/* ── Center: diamond marker ── */}
                  <div className="flex justify-center z-10">
                    <div
                      className="it-marker"
                      style={{
                        opacity:   segDrawn ? 0.6 : 0,
                        transform: segDrawn ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)',
                        transition: 'opacity 500ms ease-out 300ms, transform 500ms ease-out 300ms',
                      }}
                    />
                  </div>

                  {/* ── Right column ── */}
                  <div className="it-col-right">
                    {isLeft
                      ? /* left event → text goes here */ textBlock
                      : /* right event → icon goes here */ iconBlock
                    }
                  </div>

                </div>

                {/* Trailing dotted line after last event */}
                {i === EVENTS.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <div
                      style={{
                        width: '5px',
                        height: '48px',
                        backgroundImage: 'radial-gradient(circle at center, rgba(196,152,91,0.5) 1.5px, transparent 1.5px)',
                        backgroundSize: '5px 9px',
                        backgroundRepeat: 'repeat-y',
                        backgroundPosition: 'center top',
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                        opacity:         started ? 1 : 0,
                        transform:       started ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin: 'top center',
                        transition: `opacity 700ms ease-out ${writeDur(event.title) + 200}ms, transform 700ms ease-out ${writeDur(event.title) + 200}ms`,
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}

          {/* Trailing diamond ornament */}
          <div
            className={`flex justify-center mt-1 transition-all duration-700 ease-out ${
              event2Started ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{ transitionDelay: `${writeDur(EVENTS[2].title) + 800}ms` }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="rgba(196,152,91,0.35)">
              <polygon points="7,1 13,7 7,13 1,7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
           ITINERARY — SCOPED STYLES
           NOTE: .it-letter / .it-letter--on are used on <span>s rendered
           DIRECTLY inside this component's JSX — styled-jsx scoping applies.
         ═══════════════════════════════════════════════════════════════ */}
      <style jsx>{`

        /* Grid: [left 1fr] [20px center] [right 1fr] */
        .it-grid {
          display: grid;
          grid-template-columns: 1fr 20px 1fr;
          gap: 0 2rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        @media (min-width: 768px) { .it-grid { gap: 0 3rem; } }

        .it-col-left  { display: flex; justify-content: flex-end;  padding: 1.5rem 0; }
        .it-col-right { display: flex; justify-content: flex-start; padding: 1.5rem 0; }

        /* Diamond marker */
        .it-marker {
          width:  11px;
          height: 11px;
          background: #C4985B;
          border-radius: 1px;
          box-shadow: 0 0 8px rgba(196,152,91,0.25);
        }

        /* Section header */
        .it-header-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: 2.5rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #2e1e14;
        }
        @media (min-width: 640px) { .it-header-text { font-size: 3rem; } }
        @media (min-width: 768px) { .it-header-text { font-size: 3.5rem; } }

        /* ═══ LETTER WRITING — same keyframe as Hero / Gallery / Parents ═══ */
        .it-letter {
          display: inline-block;
          opacity: 0;
        }
        .it-letter--on {
          animation: itLetterWrite 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes itLetterWrite {
          0%   { opacity: 0; transform: translateY(10px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1);  filter: blur(0); }
        }
      `}</style>
    </section>
  )
}
