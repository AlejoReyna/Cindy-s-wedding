"use client"
import { useEffect, useState } from 'react';
import { useStatusBarSection } from '../../hooks/useStatusBarManager';
import { useTheme } from '../context/ThemeContext';
import CountdownTimer from '../../components/CountdownTimer';

// ── FLORAL DRAWN ANIMATION ───────────────────────────────────────────────────
// The ornament is drawn as if by hand: each SVG path is revealed over time using
// the stroke-dasharray / stroke-dashoffset technique. Paths are normalised with
// pathLength="1", so dasharray:1 + dashoffset:1 hides the stroke; animating
// dashoffset to 0 "draws" the line. Each path has its own delay and duration
// so stems, leaves, and the rose appear in a natural order (~3.1s total).
//
// FLORAL array: [svgPath d, delay(ms), duration(ms), strokeWidth, isGold]
// - delay: when this path starts (relative to start of floral sequence).
// - duration: how long the path takes to draw.
// - isGold: true = main gold stroke; false = secondary brown.
// ─────────────────────────────────────────────────────────────────────────────
const HeroSection = () => {
  const { isNightMode } = useTheme();
  const [loaded, setLoaded] = useState(false);

  const heroSectionRef = useStatusBarSection({
    sectionId: 'hero',
    color: '#f9f5e9',
    defaultColor: isNightMode ? '#000000' : '#f9f5e9',
    isNightMode
  });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  // ── Animation timing constants (ms after `loaded` fires at 150ms) ─────────
  // Names:    "Cindy" → pause → "&" → pause → "Jorge"  ≈ 0 – 1870ms
  // POST_NAMES: all other elements begin here
  // Flower:   draws over ~3100ms starting at POST_NAMES
  // Text etc: staggered in while flower draws
  const CINDY_START = 0;
  const AMP_START   = 700;
  const JORGE_START = 1050;
  const POST_NAMES  = 1900;

  // Misma fecha que el CountdownTimer (22 de agosto de 2026)
  const weddingDate = new Date('2026-08-22T00:00:00');
  const weddingDateLabel = weddingDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section
      id="hero-section"
      ref={heroSectionRef}
      className="relative flex flex-col min-h-screen overflow-hidden items-center justify-center"
      style={{
        backgroundColor: isNightMode ? '#0a0a0a' : '#f9f5e9',
        transition: 'background-color 0.5s ease',
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full">

        {/* ── Floral drawn animation (SVG) ───────────────────────────────────
             Each FLORAL path is a <path> with pathLength="1". The CSS class
             .floral-path sets stroke-dasharray:1 and stroke-dashoffset:1 (hidden).
             When `loaded` is true, .floral-drawing runs the floralDraw keyframe,
             animating stroke-dashoffset to 0 so the stroke appears to be drawn.
             Per-path timing: --fd = animation-delay (POST_NAMES + path delay),
             --fdr = animation-duration. Paths are inline (not in a sub-component)
             so styled-jsx scopes .floral-path / .floral-drawing and @keyframes
             floralDraw with the same suffix and they match.                         */}
      

        {/* "NUESTRA BODA" — fades in while rose petals are still being drawn */}
        <div
          className={`flex items-center justify-center gap-4 mb-8 transition-all duration-[1400ms] ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${POST_NAMES + 1500}ms` }}
        >
          <span className={`block w-14 md:w-20 h-[0.5px] ${isNightMode ? 'bg-white/30' : 'bg-[#C4985B]/50'}`} />
          <span className={`hero-label-text ${isNightMode ? 'text-white/60' : 'text-[#543c24]/55'}`}>
            {weddingDateLabel}
          </span>
          <span className={`block w-14 md:w-20 h-[0.5px] ${isNightMode ? 'bg-white/30' : 'bg-[#C4985B]/50'}`} />
        </div>

        {/* ── Names — FIRST animation: letter-by-letter writing ───────────── */}
        <div>

          {/* "Cindy" — letters write in one at a time */}
          <h1 className={`hero-names-text ${isNightMode ? 'text-white/90' : 'text-[#543c24]'}`}>
            {'Cindy'.split('').map((char, i) => (
              <span
                key={`c-${i}`}
                className={`letter-span${loaded ? ' letter-animated' : ''}`}
                style={{ animationDelay: `${CINDY_START + i * 110}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>

          {/* "&" — cursive swirl-in after a short pause */}
          <p
            className={`hero-ampersand ${isNightMode ? 'text-white/60' : 'text-[#8B7355]/60'}${
              loaded ? ' ampersand-animated' : ' ampersand-hidden'
            }`}
            style={{ animationDelay: `${AMP_START}ms` }}
          >
            &amp;
          </p>

          {/* "Jorge" — letters write in after the "&" settles */}
          <h1 className={`hero-names-text ${isNightMode ? 'text-white/90' : 'text-[#543c24]'}`}>
            {'Jorge'.split('').map((char, i) => (
              <span
                key={`j-${i}`}
                className={`letter-span${loaded ? ' letter-animated' : ''}`}
                style={{ animationDelay: `${JORGE_START + i * 110}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>

        </div>

        {/* Thin decorative line */}
        <div
          className={`mt-8 mb-12 transition-all duration-[1600ms] ease-out ${
            loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transitionDelay: `${POST_NAMES + 2000}ms` }}
        >
          <span className={`block w-10 h-[0.5px] mx-auto ${isNightMode ? 'bg-white/25' : 'bg-[#C4985B]/40'}`} />
        </div>

         {/* Confirmar asistencia — right below names */}
         <div
            className={`mt-6 transition-all duration-[1600ms] ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: `${POST_NAMES + 2200}ms` }}
          >
            <a
              href="#rsvp"
              className="hero-cta"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className={`hero-cta-text ${isNightMode ? 'text-white/90' : 'text-[#543c24]'}`}>
                Confirma Tu Asistencia
              </span>
              <span className={`hero-cta-underline ${loaded ? 'hero-cta-underline--drawn' : ''} ${isNightMode ? 'hero-cta-underline--night' : ''}`} />
            </a>
          </div>

        {/* Countdown timer */}
        <div
          className={`transition-all duration-[1800ms] ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: `${POST_NAMES + 2400}ms` }}
        >
          <CountdownTimer targetDate={weddingDate.toISOString()} variant="light" />
        </div>

      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-[1800ms] ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${POST_NAMES + 3200}ms` }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isNightMode ? 'white' : '#8B7355'}
          strokeWidth="1"
          className="animate-bounce opacity-30"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <style jsx>{`

        /* ═══════════════════════════════════════════════════════════════
           FLORAL DRAWN ANIMATION (hand-drawn line effect)
           ─────────────────────────────────────────────────────────────
           Technique: pathLength="1" on each <path> normalises stroke length
           to 1. With stroke-dasharray: 1 and stroke-dashoffset: 1 the stroke
           is fully "dashed away" (invisible). The animation runs stroke-dashoffset
           from 1 → 0, so the stroke is revealed along the path = "drawing" effect.
           Timing: --fd (animation-delay) and --fdr (animation-duration) are set
           per <path> in React; .floral-drawing and @keyframes floralDraw share
           the same styled-jsx scope so the keyframe name resolves correctly.
        ═══════════════════════════════════════════════════════════════ */

        /* Start with stroke hidden (dash covers full length, offset hides it) */
        .floral-path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }

        /* When .floral-drawing is added, animate stroke into view (ease-out) */
        .floral-drawing {
          animation: floralDraw var(--fdr) cubic-bezier(0.37, 0, 0.63, 1) var(--fd) forwards;
        }

        /* Single keyframe: reveal the full stroke (dashoffset 0 = fully visible) */
        @keyframes floralDraw {
          to { stroke-dashoffset: 0; }
        }

        /* ═══════════════════════════════════════════════════════════════
           LETTER WRITING ANIMATION
           animationDelay is set via inline style on each span, which
           overrides the implicit animation-delay:0s from the shorthand.
           Spans are rendered directly in HeroSection JSX (not a sub-
           component) so styled-jsx applies its scope attribute to them.
        ═══════════════════════════════════════════════════════════════ */

        .letter-span {
          display: inline-block;
          opacity: 0;
        }

        .letter-animated {
          animation: letterWrite 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes letterWrite {
          0%   { opacity: 0; transform: translateY(10px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }

        /* ═══════════════════════════════════════════════════════════════
           AMPERSAND — cursive swirl-in with spring bounce
        ═══════════════════════════════════════════════════════════════ */

        .ampersand-hidden { opacity: 0; }

        .ampersand-animated {
          animation: ampersandSwirl 0.65s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
          opacity: 0;
        }

        @keyframes ampersandSwirl {
          0%   { opacity: 0; transform: scale(0.3) rotate(-20deg) translateY(15px); filter: blur(4px); }
          60%  { opacity: 0.9; transform: scale(1.08) rotate(3deg) translateY(-3px); filter: blur(0); }
          100% { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); filter: blur(0); }
        }

        /* ═══════════════════════════════════════════════════════════════
           TYPE STYLES
        ═══════════════════════════════════════════════════════════════ */

        .hero-label-text {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 12px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
        }
        .hero-names-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: 48px;
          line-height: 1.05;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hero-ampersand {
          display: block;
          font-family: 'Mrs Saint Delafield', cursive;
          font-weight: 400;
          font-size: 32px;
          line-height: 1;
          margin: -2px 0;
        }
        @media (min-width: 640px) {
          .hero-label-text { font-size: 13px; letter-spacing: 0.4em; }
          .hero-names-text { font-size: 60px; }
          .hero-ampersand  { font-size: 38px; }
        }
        @media (min-width: 768px) {
          .hero-label-text { font-size: 14px; }
          .hero-names-text { font-size: 72px; }
          .hero-ampersand  { font-size: 44px; }
        }
        @media (min-width: 1024px) {
          .hero-label-text { font-size: 15px; }
          .hero-names-text { font-size: 84px; }
          .hero-ampersand  { font-size: 48px; }
        }

        /* ═══════════════════════════════════════════════════════════════
           CONFIRM RESERVATION CTA
        ═══════════════════════════════════════════════════════════════ */

        .hero-cta {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          text-decoration: none;
        }
        .hero-cta-text {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 13px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          transition: opacity 0.5s ease;
        }
        .hero-cta:hover .hero-cta-text { opacity: 1 !important; }

        .hero-cta-underline {
          display: block;
          height: 0.5px;
          margin-top: 8px;
          background: #543c24;
          width: 0;
          opacity: 0;
          transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.2s,
                      opacity 0.8s ease 2.2s;
        }
        .hero-cta-underline--drawn {
          width: 60%;
          opacity: 0.5;
          animation: ctaBreath 3.5s ease-in-out 4s infinite;
        }
        .hero-cta-underline--night { background: rgba(255, 255, 255, 0.6); }
        .hero-cta:hover .hero-cta-underline {
          width: 100%;
          opacity: 0.7;
          animation: none;
        }
        @keyframes ctaBreath {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.65; }
        }

        @media (min-width: 640px) { .hero-cta-text { font-size: 14px; letter-spacing: 0.35em; } }
        @media (min-width: 768px)  { .hero-cta-text { font-size: 15px; } }
        @media (min-width: 1024px) { .hero-cta-text { font-size: 16px; } }
      `}</style>
    </section>
  );
};

export default HeroSection;
