"use client"

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

// ═══════════════════════════════════════════════════════════════════════
// LETTER-WRITING ANIMATION (same technique as HeroSection & Gallery)
// ───────────────────────────────────────────────────────────────────────
// Each letter / word is a <span> that starts opacity:0 and animates in
// via `psLetterWrite`: translateY + scaleX + blur → normal.
// Staggered animationDelay creates the sequential writing feel.
//
// PRIORITY ORDER:
//   ① Monogram fades in                               (on scroll)
//   ② Quote "Con el amor…" — word by word             (+700ms)
//   ③ Decorative divider draws                        (after ② ends)
//   ④ "Padres de la novia" + names — letter/word      (after ③)
//   ⑤ "Padres del novio" + names — letter/word        (after ④ ends)
// ═══════════════════════════════════════════════════════════════════════

const LETTER_SPEED = 90   // ms per character (headings)
const WORD_SPEED   = 72   // ms per word (paragraphs / names)

// Quote split into words for word-by-word animation
const QUOTE_LINES = [
  'Con el amor,',
  'la bendición de Dios,',
  'y de nuestros padres.',
]
const QUOTE_WORDS = QUOTE_LINES.join(' ').split(' ')

// Bride parent data
const BRIDE_HEADING = 'Padres de la novia'
const BRIDE_NAMES   = [
  'María Magdalena Sánchez Ibarra',
  'Jorge Medina López',
]

// Groom parent data
const GROOM_HEADING = 'Padres del novio'
const GROOM_NAMES   = [
  'Patricia Perez Hernandez',
  'Jorge Alberto González Rodriguez',
]

// Compute duration of a letter-by-letter block (ms)
const lettersDuration = (text: string) => text.length * LETTER_SPEED + 380

// Compute duration of a word-by-word block (ms)
const wordsDuration = (text: string) => text.split(' ').length * WORD_SPEED + 400


export default function ParentsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Sequential flags ──
  const [monoVisible,      setMonoVisible]      = useState(false)
  const [quoteStarted,     setQuoteStarted]     = useState(false)
  const [dividerDrawn,     setDividerDrawn]     = useState(false)
  const [brideStarted,     setBrideStarted]     = useState(false)
  const [groomStarted,     setGroomStarted]     = useState(false)

  // Compute chain durations up front
  const quoteDuration    = wordsDuration(QUOTE_WORDS.join(' '))
  const brideHDuration   = lettersDuration(BRIDE_HEADING)
  const brideName0Dur    = wordsDuration(BRIDE_NAMES[0])
  const brideName1Dur    = wordsDuration(BRIDE_NAMES[1])
  const brideBlockDur    = brideHDuration + 200 + brideName0Dur + 100 + brideName1Dur + 380

  // ── Section observer → kick off chain ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMonoVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25, rootMargin: '-30px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ② Quote starts after monogram settles
  useEffect(() => {
    if (!monoVisible) return
    const t = setTimeout(() => setQuoteStarted(true), 700)
    return () => clearTimeout(t)
  }, [monoVisible])

  // ③ Divider draws after quote finishes
  useEffect(() => {
    if (!quoteStarted) return
    const t = setTimeout(() => setDividerDrawn(true), quoteDuration + 200)
    return () => clearTimeout(t)
  }, [quoteStarted, quoteDuration])

  // ④ Bride parents start after divider
  useEffect(() => {
    if (!dividerDrawn) return
    const t = setTimeout(() => setBrideStarted(true), 600)
    return () => clearTimeout(t)
  }, [dividerDrawn])

  // ⑤ Groom parents start after bride block finishes
  useEffect(() => {
    if (!brideStarted) return
    const t = setTimeout(() => setGroomStarted(true), brideBlockDur + 200)
    return () => clearTimeout(t)
  }, [brideStarted, brideBlockDur])

  // ── Helper: bride name delays (relative to brideStarted) ──
  const brideName0Delay = brideHDuration + 200         // after heading finishes
  const brideName1Delay = brideName0Delay + brideName0Dur + 100

  // ── Helper: groom name delays (relative to groomStarted) ──
  const groomHDuration  = lettersDuration(GROOM_HEADING)
  const groomName0Delay = groomHDuration + 200
  const groomName0Dur   = wordsDuration(GROOM_NAMES[0])
  const groomName1Delay = groomName0Delay + groomName0Dur + 100

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
    >
      {/* ═══ TWO-COLUMN LAYOUT: Image (left 50%) | Content (right 50%) ═══ */}
      <div className="ps-two-col">

        {/* ── LEFT COLUMN: Image ── */}
        <div className="ps-col-image">
          <Image
            src="/hands.JPG"
            alt="Parents"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Soft overlay to blend with the right side */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, transparent 60%, rgba(251,249,246,0.35) 100%)'
            }}
          />
        </div>

        {/* ── RIGHT COLUMN: Parents content ── */}
        <div
          className="ps-col-content"
          style={{
            background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)'
          }}
        >
          {/* Background texture */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 20%, rgba(196, 152, 91, 0.15) 0%, transparent 60%),
                                  radial-gradient(circle at 70% 60%, rgba(139, 115, 85, 0.12) 0%, transparent 60%),
                                  radial-gradient(circle at 50% 90%, rgba(180, 147, 113, 0.1) 0%, transparent 60%)`
              }}
            />
          </div>
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="parentsPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path d="M20,20 Q40,30 60,20 Q80,10 100,25" stroke="#8B7355" strokeWidth="0.5" fill="none" opacity="0.3"/>
                  <circle cx="30" cy="25" r="1" fill="#C4985B" opacity="0.2"/>
                  <circle cx="70" cy="22" r="0.8" fill="#9B8366" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#parentsPattern)"/>
            </svg>
          </div>

          <div className="relative z-10 text-center px-6 md:px-10 py-16 md:py-24 flex flex-col items-center justify-center h-full">

            {/* ① Monogram — fades in */}
            <div
              className={`flex justify-center items-center mb-8 transition-all duration-[1600ms] ease-out ${
                monoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <Image
                src="/Diseño sin título.png"
                alt="Monograma"
                width={80}
                height={80}
                className="object-contain opacity-40"
              />
            </div>

            {/* ② Quote — word by word writing */}
            <div className="flex justify-center items-center mb-12">
              <p className="ps-quote-text">
                {QUOTE_WORDS.map((word, i) => (
                  <span key={`q-${i}`}>
                    <span
                      className={`ps-word${quoteStarted ? ' ps-word--animated' : ''}`}
                      style={{ animationDelay: `${i * WORD_SPEED}ms` }}
                    >
                      {word}
                    </span>
                    {word === 'amor,' ? <br /> : word === 'Dios,' ? <br /> : ' '}
                  </span>
                ))}
              </p>
            </div>

            {/* ③ Decorative divider — draws in */}
            <div
              className={`flex items-center justify-center gap-3 mb-10 transition-all duration-[1400ms] ease-out ${
                dividerDrawn ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
            >
              <span className="block w-12 h-[0.5px] bg-[#C4985B]/40" />
              <span className="block w-1.5 h-1.5 rounded-full bg-[#C4985B]/35" />
              <span className="block w-12 h-[0.5px] bg-[#C4985B]/40" />
            </div>

            {/* ④ & ⑤ Parent cards — stacked vertically in the right column */}
            <div className="w-full max-w-md mx-auto space-y-10">

              {/* ④ Bride's parents */}
              <div className="text-center">
                <h3 className="ps-heading-text mb-4">
                  {BRIDE_HEADING.split('').map((char, i) => (
                    <span
                      key={`bh-${i}`}
                      className={`ps-letter${brideStarted ? ' ps-letter--animated' : ''}`}
                      style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h3>
                <p className="ps-name-text">
                  {BRIDE_NAMES[0].split(' ').map((word, i) => (
                    <span key={`bn0-${i}`}>
                      <span
                        className={`ps-word${brideStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${brideName0Delay + i * WORD_SPEED}ms` }}
                      >
                        {word}
                      </span>
                      {i < BRIDE_NAMES[0].split(' ').length - 1 && ' '}
                    </span>
                  ))}
                </p>
                <p className="ps-name-text">
                  {BRIDE_NAMES[1].split(' ').map((word, i) => (
                    <span key={`bn1-${i}`}>
                      <span
                        className={`ps-word${brideStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${brideName1Delay + i * WORD_SPEED}ms` }}
                      >
                        {word}
                      </span>
                      {i < BRIDE_NAMES[1].split(' ').length - 1 && ' '}
                    </span>
                  ))}
                </p>
              </div>

              {/* Small divider between parent groups */}
              <div
                className={`flex items-center justify-center gap-2 transition-all duration-[1000ms] ease-out ${
                  groomStarted ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="block w-8 h-[0.5px] bg-[#C4985B]/30" />
                <span className="block w-1 h-1 rounded-full bg-[#C4985B]/25" />
                <span className="block w-8 h-[0.5px] bg-[#C4985B]/30" />
              </div>

              {/* ⑤ Groom's parents */}
              <div className="text-center">
                <h3 className="ps-heading-text mb-4">
                  {GROOM_HEADING.split('').map((char, i) => (
                    <span
                      key={`gh-${i}`}
                      className={`ps-letter${groomStarted ? ' ps-letter--animated' : ''}`}
                      style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h3>
                <p className="ps-name-text">
                  {GROOM_NAMES[0].split(' ').map((word, i) => (
                    <span key={`gn0-${i}`}>
                      <span
                        className={`ps-word${groomStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${groomName0Delay + i * WORD_SPEED}ms` }}
                      >
                        {word}
                      </span>
                      {i < GROOM_NAMES[0].split(' ').length - 1 && ' '}
                    </span>
                  ))}
                </p>
                <p className="ps-name-text">
                  {GROOM_NAMES[1].split(' ').map((word, i) => (
                    <span key={`gn1-${i}`}>
                      <span
                        className={`ps-word${groomStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${groomName1Delay + i * WORD_SPEED}ms` }}
                      >
                        {word}
                      </span>
                      {i < GROOM_NAMES[1].split(' ').length - 1 && ' '}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
           PARENTS SECTION — LETTER-WRITING STYLES
           Same keyframe as HeroSection / Gallery
         ═══════════════════════════════════════════════════════════════ */}
      <style jsx>{`
        /* ═══ TWO-COLUMN LAYOUT ═══ */
        .ps-two-col {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 80vh;
        }
        .ps-col-image {
          position: relative;
          width: 100%;
          height: 45vh;
          overflow: hidden;
        }
        .ps-col-content {
          position: relative;
          width: 100%;
          min-height: 55vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Desktop: side-by-side 50/50 */
        @media (min-width: 768px) {
          .ps-two-col {
            flex-direction: row;
            min-height: 90vh;
          }
          .ps-col-image {
            width: 50%;
            height: auto;
            min-height: 90vh;
          }
          .ps-col-content {
            width: 50%;
            min-height: 90vh;
          }
        }

        /* ── Typography ── */
        .ps-quote-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: 1.125rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-style: italic;
          color: #8B7355;
          line-height: 1.8;
        }
        .ps-heading-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 600;
          font-size: 1.5rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #5c5c5c;
          line-height: 1.2;
        }
        .ps-name-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.125rem;
          color: #57534e;
          line-height: 1.7;
          margin-bottom: 0;
        }

        @media (min-width: 768px) {
          .ps-quote-text   { font-size: 1.25rem; }
          .ps-heading-text { font-size: 1.75rem; }
        }

        /* ═══ LETTER WRITING — same keyframe as Hero / Gallery ═══ */
        .ps-letter {
          display: inline-block;
          opacity: 0;
        }
        .ps-letter--animated {
          animation: psLetterWrite 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes psLetterWrite {
          0%   { opacity: 0; transform: translateY(10px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0)  scaleX(1);   filter: blur(0); }
        }

        /* ═══ WORD WRITING — softer variant for names / quote ═══ */
        .ps-word {
          display: inline-block;
          opacity: 0;
        }
        .ps-word--animated {
          animation: psWordWrite 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes psWordWrite {
          0%   { opacity: 0; transform: translateY(8px) scaleX(0.6); filter: blur(1.5px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1);   filter: blur(0); }
        }
      `}</style>
    </section>
  )
}
