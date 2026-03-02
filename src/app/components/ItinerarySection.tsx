"use client"
import { useRef, useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import church        from '../../../assets/church.png';
import legalDocument from '../../../assets/legal-document.png';
import nightClub     from '../../../assets/night-club.png';

// ═══════════════════════════════════════════════════════════════════════
// ITINERARY — left-aligned timeline with right-side cards
// ═══════════════════════════════════════════════════════════════════════

const LETTER_SPEED = 90   // ms per character

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

      <div className="max-w-3xl mx-auto relative z-10">

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

          {/* "Itinerario" — letter by letter */}
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

        {/* ═══ Left-aligned Timeline ═══ */}
        <div className="it-timeline">

          {EVENTS.map((event, i) => {
            const started  = eventStarted[i]
            const segDrawn = lineDrawn[i]

            // Title starts partway through the time animation
            const titleDelay = Math.floor(event.time.length * LETTER_SPEED * 0.5)

            return (
              <div key={i} className="it-event-row">

                {/* ── Left: Timeline track (dot + line) ── */}
                <div className="it-track">
                  {/* Connecting line above dot */}
                  <div
                    className="it-line-segment"
                    style={{
                      opacity:         segDrawn ? 1 : 0,
                      transform:       segDrawn ? 'scaleY(1)' : 'scaleY(0)',
                      transformOrigin: 'top center',
                      transition: 'opacity 700ms ease-out, transform 700ms ease-out',
                    }}
                  />

                  {/* Dot marker */}
                  <div
                    className="it-dot"
                    style={{
                      opacity:   segDrawn ? 1 : 0,
                      transform: segDrawn ? 'scale(1)' : 'scale(0)',
                      transition: 'opacity 500ms ease-out 300ms, transform 500ms ease-out 300ms',
                    }}
                  />

                  {/* Connecting line below dot (or trailing fade on last) */}
                  {i < EVENTS.length - 1 ? (
                    <div
                      className="it-line-segment it-line-segment--below"
                      style={{
                        opacity:         started ? 1 : 0,
                        transform:       started ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin: 'top center',
                        transition: `opacity 700ms ease-out ${writeDur(event.title) + 100}ms, transform 700ms ease-out ${writeDur(event.title) + 100}ms`,
                      }}
                    />
                  ) : (
                    <div
                      className="it-line-segment it-line-segment--fade"
                      style={{
                        opacity:         started ? 1 : 0,
                        transform:       started ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin: 'top center',
                        transition: `opacity 700ms ease-out ${writeDur(event.title) + 200}ms, transform 700ms ease-out ${writeDur(event.title) + 200}ms`,
                      }}
                    />
                  )}
                </div>

                {/* ── Right: Event card ── */}
                <div
                  className="it-card"
                  style={{
                    opacity:   started ? 1 : 0,
                    transform: started ? 'translateX(0)' : 'translateX(20px)',
                    transition: 'opacity 600ms ease-out, transform 600ms ease-out',
                  }}
                >
                  {/* Icon */}
                  <div className="it-card-icon">
                    <Image
                      src={event.icon}
                      alt={event.alt}
                      width={30}
                      height={30}
                      className="object-contain"
                      style={{ filter: 'sepia(1) saturate(0.5) brightness(0.45)' }}
                    />
                  </div>

                  {/* Text content */}
                  <div className="it-card-content">
                    {/* Time */}
                    <p className="it-card-time">
                      {event.time.split('').map((char, ci) => (
                        <span
                          key={`time-${i}-${ci}`}
                          className={`it-letter${started ? ' it-letter--on' : ''}`}
                          style={{
                            animationDelay: `${ci * LETTER_SPEED}ms`,
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </p>
                    {/* Title */}
                    <p className="it-card-title">
                      {event.title.split('').map((char, ci) => (
                        <span
                          key={`ttl-${i}-${ci}`}
                          className={`it-letter${started ? ' it-letter--on' : ''}`}
                          style={{
                            animationDelay: `${titleDelay + ci * LETTER_SPEED}ms`,
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Trailing diamond ornament */}
          <div
            className={`flex mt-2 transition-all duration-700 ease-out ${
              event2Started ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{
              transitionDelay: `${writeDur(EVENTS[2].title) + 800}ms`,
              paddingLeft: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="rgba(196,152,91,0.35)">
              <polygon points="7,1 13,7 7,13 1,7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
           ITINERARY — SCOPED STYLES
         ═══════════════════════════════════════════════════════════════ */}
      <style jsx>{`

        /* ── Timeline container ── */
        .it-timeline {
          position: relative;
          padding-left: 0;
        }

        /* ── Each event row: track + card ── */
        .it-event-row {
          display: grid;
          grid-template-columns: 26px 1fr;
          gap: 0 clamp(1.2rem, 3vw, 2.5rem);
          min-height: 100px;
        }

        /* ── Left track column ── */
        .it-track {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        /* Line segments */
        .it-line-segment {
          width: 2px;
          flex: 1;
          background: linear-gradient(
            to bottom,
            rgba(196,152,91,0.15),
            rgba(196,152,91,0.35),
            rgba(196,152,91,0.15)
          );
        }
        .it-line-segment--below {
          flex: 1;
        }
        .it-line-segment--fade {
          flex: 0.6;
          background: linear-gradient(
            to bottom,
            rgba(196,152,91,0.3),
            rgba(196,152,91,0.05)
          );
        }

        /* Dot marker */
        .it-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 35%, #d4b078, #C4985B);
          box-shadow: 0 0 0 4px rgba(196,152,91,0.12), 0 0 12px rgba(196,152,91,0.15);
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }

        /* ── Event card ── */
        .it-card {
          display: flex;
          align-items: center;
          gap: clamp(0.8rem, 2vw, 1.5rem);
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(196,152,91,0.12);
          border-radius: 16px;
          padding: clamp(1rem, 2.5vw, 1.5rem) clamp(1.2rem, 3vw, 2rem);
          margin-top: 0.4rem;
          margin-bottom: 1.8rem;
          box-shadow:
            0 2px 12px rgba(139,115,85,0.06),
            0 1px 3px rgba(139,115,85,0.04);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .it-card:hover {
          box-shadow:
            0 4px 20px rgba(139,115,85,0.1),
            0 2px 6px rgba(139,115,85,0.06);
          border-color: rgba(196,152,91,0.22);
        }

        /* Card icon container */
        .it-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(237,233,226,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Card text */
        .it-card-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .it-card-time {
          margin: 0;
          line-height: 1.1;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 400;
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          letter-spacing: 0.06em;
          color: #2e1e14;
        }
        .it-card-title {
          margin: 0;
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 500;
          font-size: clamp(0.72rem, 1.3vw, 0.88rem);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #8b7355;
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

        /* ═══ LETTER WRITING animation ═══ */
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
