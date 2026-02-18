"use client"
import { useEffect, useState } from 'react';
import { useStatusBarSection } from '../../hooks/useStatusBarManager';
import { useTheme } from '../context/ThemeContext';
import CountdownTimer from '../../components/CountdownTimer';

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

  // ── Animation timing (ms after `loaded` fires) ──────────────────────────
  // "Cindy":  5 letters × 110ms → last starts at 440ms, done ~790ms
  // Pause →   "&" at 700ms (160ms gap), done ~1350ms
  // Pause →   "Jorge" at 1050ms (350ms gap), last starts at 1490ms, done ~1840ms
  // POST_NAMES: everything else fades in after names finish
  const CINDY_START = 0;
  const AMP_START   = 700;
  const JORGE_START = 1050;
  const POST_NAMES  = 1900;

  // Decorative flourish SVG — gold/brown tones for cream background
  const Ornament = () => (
    <svg width="90" height="55" viewBox="0 0 90 55" fill="none" className="mx-auto">
      {/* Center flower */}
      <circle cx="45" cy="18" r="3.5" stroke="#C4985B" strokeWidth="0.8" opacity="0.55" />
      <circle cx="45" cy="18" r="1.2" fill="#C4985B" opacity="0.45" />
      {/* Petals */}
      <ellipse cx="45" cy="11" rx="2.2" ry="4.5" stroke="#8B7355" strokeWidth="0.6" opacity="0.35" />
      <ellipse cx="38" cy="16" rx="2" ry="4" stroke="#8B7355" strokeWidth="0.6" opacity="0.3" transform="rotate(-40 38 16)" />
      <ellipse cx="52" cy="16" rx="2" ry="4" stroke="#8B7355" strokeWidth="0.6" opacity="0.3" transform="rotate(40 52 16)" />
      {/* Swirl left */}
      <path d="M34,22 Q28,17 22,22 Q16,27 22,30 Q28,32 32,27" stroke="#C4985B" strokeWidth="0.7" fill="none" opacity="0.4" />
      <path d="M22,22 Q16,17 10,22" stroke="#C4985B" strokeWidth="0.6" fill="none" opacity="0.3" />
      {/* Swirl right */}
      <path d="M56,22 Q62,17 68,22 Q74,27 68,30 Q62,32 58,27" stroke="#C4985B" strokeWidth="0.7" fill="none" opacity="0.4" />
      <path d="M68,22 Q74,17 80,22" stroke="#C4985B" strokeWidth="0.6" fill="none" opacity="0.3" />
      {/* Small leaves */}
      <path d="M24,30 Q19,35 14,32" stroke="#8B7355" strokeWidth="0.5" fill="none" opacity="0.25" />
      <path d="M66,30 Q71,35 76,32" stroke="#8B7355" strokeWidth="0.5" fill="none" opacity="0.25" />
      {/* Tiny dots */}
      <circle cx="8" cy="24" r="0.8" fill="#C4985B" opacity="0.25" />
      <circle cx="82" cy="24" r="0.8" fill="#C4985B" opacity="0.25" />
      <circle cx="41" cy="9" r="0.6" fill="#8B7355" opacity="0.2" />
      <circle cx="49" cy="9" r="0.6" fill="#8B7355" opacity="0.2" />
    </svg>
  );

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
      {/* ── Main content — centered ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full">

        {/* Ornament — fades in AFTER names finish */}
        <div
          className={`mb-8 transition-all duration-[1800ms] ease-out ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{ transitionDelay: `${POST_NAMES}ms` }}
        >
          <Ornament />
        </div>

        {/* "NUESTRA BODA" with lines — after ornament */}
        <div
          className={`flex items-center justify-center gap-4 mb-8 transition-all duration-[1600ms] ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${POST_NAMES + 200}ms` }}
        >
          <span className={`block w-14 md:w-20 h-[0.5px] ${isNightMode ? 'bg-white/30' : 'bg-[#C4985B]/50'}`} />
          <span className={`hero-label-text ${isNightMode ? 'text-white/60' : 'text-[#8B7355]/70'}`}>
            NUESTRA BODA
          </span>
          <span className={`block w-14 md:w-20 h-[0.5px] ${isNightMode ? 'bg-white/30' : 'bg-[#C4985B]/50'}`} />
        </div>

        {/* ── Names — FIRST animation: letter-by-letter writing ─────────────
             NOTE: spans are rendered directly here (not in a sub-component)
             so that styled-jsx scoping applies correctly to .letter-span     */}
        <div>

          {/* "Cindy" — each letter writes in one at a time */}
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
            className={`hero-ampersand ${isNightMode ? 'text-white/60' : 'text-[#8B7355]/60'}${loaded ? ' ampersand-animated' : ' ampersand-hidden'}`}
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

        {/* Thin decorative line — after names */}
        <div
          className={`mt-8 mb-12 transition-all duration-[1600ms] ease-out ${
            loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transitionDelay: `${POST_NAMES + 400}ms` }}
        >
          <span className={`block w-10 h-[0.5px] mx-auto ${isNightMode ? 'bg-white/25' : 'bg-[#C4985B]/40'}`} />
        </div>

        {/* Countdown timer — after names */}
        <div
          className={`transition-all duration-[1800ms] ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: `${POST_NAMES + 600}ms` }}
        >
          <CountdownTimer targetDate="2026-08-22T00:00:00" variant="light" />
        </div>

        {/* ── Confirm reservation — after names ── */}
        <div
          className={`mt-12 md:mt-16 transition-all duration-[2000ms] ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: `${POST_NAMES + 800}ms` }}
        >
          <a
            href="#rsvp"
            className="hero-cta"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className={`hero-cta-text ${isNightMode ? 'text-white/50' : 'text-[#8B7355]/70'}`}>
              Confirmar Asistencia
            </span>
            <span className={`hero-cta-underline ${loaded ? 'hero-cta-underline--drawn' : ''} ${isNightMode ? 'hero-cta-underline--night' : ''}`} />
          </a>
        </div>

      </div>

      {/* ── Scroll indicator at bottom — after names ── */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-[1800ms] ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${POST_NAMES + 900}ms` }}
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

        /* ═══════════════════════════════════════════════════════════
           Letter writing animation
           — spans are rendered inline so styled-jsx scoping applies
        ═══════════════════════════════════════════════════════════ */

        /* Initial hidden state — always applied */
        .letter-span {
          display: inline-block;
          opacity: 0;
        }

        /* Triggered when loaded=true — animationDelay is set via inline style
           which overrides the implicit animation-delay:0s from the shorthand  */
        .letter-animated {
          animation: letterWrite 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes letterWrite {
          0%   { opacity: 0; transform: translateY(10px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0)   scaleX(1);   filter: blur(0); }
        }

        /* ═══════════════════════════════════════════════════════════
           Ampersand — cursive swirl-in with spring bounce
        ═══════════════════════════════════════════════════════════ */

        .ampersand-hidden {
          opacity: 0;
        }

        /* animationDelay set via inline style */
        .ampersand-animated {
          animation: ampersandSwirl 0.65s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
          opacity: 0; /* starts transparent; keyframe takes over */
        }

        @keyframes ampersandSwirl {
          0%   { opacity: 0; transform: scale(0.3) rotate(-20deg) translateY(15px); filter: blur(4px); }
          60%  { opacity: 0.9; transform: scale(1.08) rotate(3deg) translateY(-3px); filter: blur(0); }
          100% { opacity: 1; transform: scale(1)   rotate(0deg)  translateY(0);    filter: blur(0); }
        }

        /* ═══════════════════════════════════════════════════════════
           Text styles
        ═══════════════════════════════════════════════════════════ */
        .hero-label-text {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 10px;
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
          .hero-label-text { font-size: 11px; letter-spacing: 0.4em; }
          .hero-names-text { font-size: 60px; }
          .hero-ampersand  { font-size: 38px; }
        }
        @media (min-width: 768px) {
          .hero-label-text { font-size: 12px; }
          .hero-names-text { font-size: 72px; }
          .hero-ampersand  { font-size: 44px; }
        }
        @media (min-width: 1024px) {
          .hero-names-text { font-size: 84px; }
          .hero-ampersand  { font-size: 48px; }
        }

        /* ═══════════════════════════════════════════════════════════
           Confirm reservation CTA
        ═══════════════════════════════════════════════════════════ */
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
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          transition: opacity 0.5s ease;
        }
        .hero-cta:hover .hero-cta-text { opacity: 1 !important; }

        /* Underline — draws from left */
        .hero-cta-underline {
          display: block;
          height: 0.5px;
          margin-top: 6px;
          background: #C4985B;
          width: 0;
          opacity: 0;
          transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.2s,
                      opacity 0.8s ease 2.2s;
        }
        .hero-cta-underline--drawn {
          width: 60%;
          opacity: 0.4;
          animation: ctaBreath 3.5s ease-in-out 4s infinite;
        }
        .hero-cta-underline--night { background: rgba(255, 255, 255, 0.5); }
        .hero-cta:hover .hero-cta-underline {
          width: 100%;
          opacity: 0.6;
          animation: none;
        }

        @keyframes ctaBreath {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.65; }
        }

        @media (min-width: 640px) { .hero-cta-text { font-size: 11.5px; letter-spacing: 0.35em; } }
        @media (min-width: 768px)  { .hero-cta-text { font-size: 12px; } }
        @media (min-width: 1024px) { .hero-cta-text { font-size: 12.5px; } }
      `}</style>
    </section>
  );
};

export default HeroSection;
