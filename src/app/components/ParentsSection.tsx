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
// Two-column layout with image placeholder on the left.
// ═══════════════════════════════════════════════════════════════════════

const TOTAL_TEXT_RENDER_MS = 2000
const ITEM_ANIMATION_MS = 220

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

export default function ParentsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Trigger flags ──
  const [monoVisible,      setMonoVisible]      = useState(false)
  const [textStarted,      setTextStarted]      = useState(false)

  // Single timeline: all text should finish in <= 1 second.
  const quoteWords = QUOTE_WORDS
  const brideHeadingChars = BRIDE_HEADING.split('')
  const groomHeadingChars = GROOM_HEADING.split('')
  const brideName0Words = BRIDE_NAMES[0].split(' ')
  const brideName1Words = BRIDE_NAMES[1].split(' ')
  const groomName0Words = GROOM_NAMES[0].split(' ')
  const groomName1Words = GROOM_NAMES[1].split(' ')

  let timelineCursor = 0
  const quoteStart = timelineCursor
  timelineCursor += quoteWords.length
  const brideHeadingStart = timelineCursor
  timelineCursor += brideHeadingChars.length
  const brideName0Start = timelineCursor
  timelineCursor += brideName0Words.length
  const brideName1Start = timelineCursor
  timelineCursor += brideName1Words.length
  const groomHeadingStart = timelineCursor
  timelineCursor += groomHeadingChars.length
  const groomName0Start = timelineCursor
  timelineCursor += groomName0Words.length
  const groomName1Start = timelineCursor
  timelineCursor += groomName1Words.length

  const totalUnits = timelineCursor
  const unitDelay =
    totalUnits > 1
      ? Math.max(0, Math.floor((TOTAL_TEXT_RENDER_MS - ITEM_ANIMATION_MS) / (totalUnits - 1)))
      : 0

  // ── Section observer → kick off chain ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMonoVisible(true)
          setTextStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25, rootMargin: '-30px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden min-h-screen"
    >
      <div className="ps-two-col">
        <div className="ps-col-image" aria-hidden="true">
          <div className="ps-image-placeholder">
            <span className="ps-image-placeholder-label">Imagen placeholder</span>
          </div>
        </div>

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

       
            {/* ② Quote — word by word writing */}
            <div className="flex justify-center items-center mb-12">
              <p className="ps-quote-text">
                {QUOTE_WORDS.map((word, i) => (
                  <span key={`q-${i}`}>
                    <span
                      className={`ps-word${textStarted ? ' ps-word--animated' : ''}`}
                      style={{ animationDelay: `${(quoteStart + i) * unitDelay}ms` }}
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
              className={`flex items-center justify-center gap-3 mb-10 transition-all duration-[350ms] ease-out ${
                textStarted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
            >
              <span className="block w-12 h-[0.5px] bg-[#C4985B]/40" />
              <span className="block w-1.5 h-1.5 rounded-full bg-[#C4985B]/35" />
              <span className="block w-12 h-[0.5px] bg-[#C4985B]/40" />
            </div>

            {/* ④ & ⑤ Parent cards */}
            <div className="w-full max-w-md mx-auto space-y-10">

              {/* ④ Bride's parents */}
              <div className="text-center">
                <h3 className="ps-heading-text mb-4">
                  {brideHeadingChars.map((char, i) => (
                    <span
                      key={`bh-${i}`}
                      className={`ps-letter${textStarted ? ' ps-letter--animated' : ''}`}
                      style={{ animationDelay: `${(brideHeadingStart + i) * unitDelay}ms` }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h3>
                <p className="ps-name-text">
                  {brideName0Words.map((word, i) => (
                    <span key={`bn0-${i}`}>
                      <span
                        className={`ps-word${textStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${(brideName0Start + i) * unitDelay}ms` }}
                      >
                        {word}
                      </span>
                      {i < brideName0Words.length - 1 && ' '}
                    </span>
                  ))}
                </p>
                <p className="ps-name-text">
                  {brideName1Words.map((word, i) => (
                    <span key={`bn1-${i}`}>
                      <span
                        className={`ps-word${textStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${(brideName1Start + i) * unitDelay}ms` }}
                      >
                        {word}
                      </span>
                      {i < brideName1Words.length - 1 && ' '}
                    </span>
                  ))}
                </p>
              </div>

              {/* Small divider between parent groups */}
              <div
                className={`flex items-center justify-center gap-2 transition-all duration-[350ms] ease-out ${
                  textStarted ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="block w-8 h-[0.5px] bg-[#C4985B]/30" />
                <span className="block w-1 h-1 rounded-full bg-[#C4985B]/25" />
                <span className="block w-8 h-[0.5px] bg-[#C4985B]/30" />
              </div>

              {/* ⑤ Groom's parents */}
              <div className="text-center">
                <h3 className="ps-heading-text mb-4">
                  {groomHeadingChars.map((char, i) => (
                    <span
                      key={`gh-${i}`}
                      className={`ps-letter${textStarted ? ' ps-letter--animated' : ''}`}
                      style={{ animationDelay: `${(groomHeadingStart + i) * unitDelay}ms` }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h3>
                <p className="ps-name-text">
                  {groomName0Words.map((word, i) => (
                    <span key={`gn0-${i}`}>
                      <span
                        className={`ps-word${textStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${(groomName0Start + i) * unitDelay}ms` }}
                      >
                        {word}
                      </span>
                      {i < groomName0Words.length - 1 && ' '}
                    </span>
                  ))}
                </p>
                <p className="ps-name-text">
                  {groomName1Words.map((word, i) => (
                    <span key={`gn1-${i}`}>
                      <span
                        className={`ps-word${textStarted ? ' ps-word--animated' : ''}`}
                        style={{ animationDelay: `${(groomName1Start + i) * unitDelay}ms` }}
                      >
                        {word}
                      </span>
                      {i < groomName1Words.length - 1 && ' '}
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
        .ps-two-col {
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
          min-height: 100svh;
        }
        .ps-col-image {
          position: relative;
          width: 100%;
          height: 45vh;
          overflow: hidden;
          background: linear-gradient(145deg, #ede7df 0%, #f4efe8 50%, #e8dfd4 100%);
        }
        .ps-image-placeholder {
          position: absolute;
          inset: 1.25rem;
          border: 1px dashed rgba(139, 115, 85, 0.45);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 30% 20%, rgba(196, 152, 91, 0.14) 0%, transparent 60%),
            radial-gradient(circle at 70% 75%, rgba(139, 115, 85, 0.12) 0%, transparent 60%);
        }
        .ps-image-placeholder-label {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(92, 92, 92, 0.72);
        }
        .ps-col-content {
          position: relative;
          width: 100%;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .ps-two-col {
            flex-direction: row;
            min-height: 100svh;
          }
          .ps-col-image {
            width: 50%;
            height: auto;
            min-height: 100svh;
          }
          .ps-col-content {
            width: 50%;
            min-height: 100svh;
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
          animation: psLetterWrite ${ITEM_ANIMATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
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
          animation: psWordWrite ${ITEM_ANIMATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
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
