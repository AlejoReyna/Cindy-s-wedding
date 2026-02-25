"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useStatusBarSection } from '../../hooks/useStatusBarManager';
import { useTheme } from '../context/ThemeContext';
import CountdownTimer from '../../components/CountdownTimer';
import SongPlayer from './SongPlayer';

const HERO_PHOTO_ONE = '/assets/hero-0624.jpg';

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
      {/* Background photo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-media">
          <Image
            src={HERO_PHOTO_ONE}
            alt="Cindy y Jorge caminando por el campo"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div
          className={`absolute inset-0 ${
            isNightMode
              ? 'bg-gradient-to-b from-black/55 via-black/45 to-black/60'
              : 'bg-gradient-to-b from-black/40 via-black/30 to-black/50'
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between text-center px-6 w-full min-h-screen py-16">

        {/* Top spacer — small so names sit in the upper-center */}
        <div className="flex-[0.4]" />

        {/* ── Center group: date + names ───────────────────────────────── */}
        <div className="flex flex-col items-center flex-[0]">
          {/* Wedding date label */}
          <div
            className={`flex items-center justify-center gap-4 mb-8 transition-all duration-[1400ms] ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${POST_NAMES + 1500}ms` }}
          >
            <span className="block w-14 md:w-20 h-[0.5px] bg-[#F9F6EE]/55" />
            <span className="hero-label-text text-[#F9F6EE]">
              {weddingDateLabel}
            </span>
            <span className="block w-14 md:w-20 h-[0.5px] bg-[#F9F6EE]/55" />
          </div>

          {/* ── Names — letter-by-letter writing ───────────── */}
          <div>
            <h1 className="hero-names-text text-[#F9F6EE]">
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

            <p
              className={`hero-ampersand text-[#F9F6EE]${
                loaded ? ' ampersand-animated' : ' ampersand-hidden'
              }`}
              style={{ animationDelay: `${AMP_START}ms` }}
            >
              &amp;
            </p>

            <h1 className="hero-names-text text-[#F9F6EE]">
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
        </div>

        {/* Bottom flexible space */}
        <div className="flex-[1.6]" />

        {/* ── Bottom group: CTA + separator + timer ── */}
        <div className="hero-bottom-group flex flex-col items-center gap-5 mb-0">
          {/* Confirmar asistencia — rectangular button with drawn border */}
          <a
            href="#rsvp"
            className={`hero-cta-btn ${loaded ? 'hero-cta-btn--animate' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              '--btn-delay': `${POST_NAMES + 2000}ms`,
              '--btn-draw-duration': '1.6s',
              '--btn-fill-delay': `${POST_NAMES + 2000 + 1600}ms`,
            } as React.CSSProperties}
          >
            {/* Border that draws itself via conic-gradient mask */}
            <span className={`hero-cta-border-el ${loaded ? 'hero-cta-border-el--draw' : ''}`} />
            {/* Background fill (fades in after border is drawn) */}
            <span className={`hero-cta-bg ${loaded ? 'hero-cta-bg--visible' : ''}`} />
            {/* Text */}
            <span className={`hero-cta-label ${loaded ? 'hero-cta-label--visible' : ''}`}>
              Confirma Tu Asistencia
            </span>
          </a>

          {/* Separator line */}
          <div
            className={`hero-separator mt-5 transition-all duration-[1600ms] ease-out ${
              loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transitionDelay: `${POST_NAMES + 2300}ms` }}
          >
            <span className="block w-16 md:w-24 h-[0.5px] mx-auto bg-[#F9F6EE]/40" />
          </div>

          {/* Countdown timer */}
          <div
            className={`hero-timer-wrap mt-4 transition-all duration-[1800ms] ease-out ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${POST_NAMES + 2400}ms` }}
          >
            <CountdownTimer targetDate={weddingDate.toISOString()} variant="dark" />
          </div>
        </div>

      </div>

      {/* ── Song Player — bottom-right corner ──────────────────────────── */}
      <SongPlayer
        loaded={loaded}
        delay={POST_NAMES + 3000}
        isNightMode={isNightMode}
      />

      {/* @property must be global so the browser can interpolate the angle */}
      <style>{`
        @property --cta-border-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
      `}</style>

      <style jsx>{`
        .hero-media {
          position: absolute;
          inset: 0;
        }
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
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }
        .hero-names-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: 48px;
          line-height: 1.05;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .hero-ampersand {
          display: block;
          font-family: 'Mrs Saint Delafield', cursive;
          font-weight: 400;
          font-size: 32px;
          line-height: 1;
          margin: -2px 0;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
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
           CONFIRM RESERVATION CTA — rectangular button with drawn border
           ─────────────────────────────────────────────────────────────
           1. The SVG <rect> border draws itself using stroke-dashoffset
              (same technique as the floral ornament).
           2. After the border finishes drawing, a semi-transparent
              background fades in behind the text.
           3. The text fades in simultaneously with the border draw.
        ═══════════════════════════════════════════════════════════════ */

        .hero-cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          cursor: pointer;
          text-decoration: none;
          min-width: 220px;
        }

        /* ── CSS-only drawn border ──────────────────────────────────
           Uses a conic-gradient mask that sweeps from 0→360° to
           progressively reveal the border, like a pen tracing it.
           The custom property --cta-border-angle is registered with
           @property so the browser can interpolate it smoothly.    */

        .hero-cta-border-el {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(249, 246, 238, 0.7);
          border-radius: 8px;
          pointer-events: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35), 0 1px 4px rgba(0, 0, 0, 0.2);
          --cta-border-angle: 0deg;
          -webkit-mask-image: conic-gradient(from -135deg at 50% 50%, #000 var(--cta-border-angle), transparent 0);
          mask-image: conic-gradient(from -135deg at 50% 50%, #000 var(--cta-border-angle), transparent 0);
          opacity: 0;
        }

        .hero-cta-border-el--draw {
          animation:
            ctaBorderAppear 0.01s linear var(--btn-delay) forwards,
            ctaBorderDraw var(--btn-draw-duration) cubic-bezier(0.25, 0.1, 0.25, 1) var(--btn-delay) forwards;
        }

        /* Tiny keyframe just to flip opacity so the border is visible during draw */
        @keyframes ctaBorderAppear {
          to { opacity: 1; }
        }

        @keyframes ctaBorderDraw {
          from { --cta-border-angle: 0deg; }
          to   { --cta-border-angle: 360deg; }
        }

        /* Background fill — starts invisible, fades in after border is drawn */
        .hero-cta-bg {
          position: absolute;
          inset: 1px;
          border-radius: 7px;
          background: rgba(101, 67, 33, 0.35);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
        }

        .hero-cta-bg--visible {
          animation: ctaBgFill 0.9s ease-in-out var(--btn-fill-delay) forwards;
        }

        @keyframes ctaBgFill {
          to { opacity: 1; }
        }

        /* Label text */
        .hero-cta-label {
          position: relative;
          z-index: 1;
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 13px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #F9F6EE;
          opacity: 0;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.3);
          transition: color 0.3s ease;
        }

        .hero-cta-label--visible {
          animation: ctaLabelIn 0.8s ease-out var(--btn-delay) forwards;
        }

        @keyframes ctaLabelIn {
          to { opacity: 1; }
        }

        /* Hover effects */
        .hero-cta-btn:hover .hero-cta-bg {
          background: rgba(101, 67, 33, 0.5);
        }
        .hero-cta-btn:hover .hero-cta-border-el {
          border-color: rgba(249, 246, 238, 1);
        }

        @media (min-width: 640px) {
          .hero-cta-btn { padding: 15px 38px; min-width: 250px; }
          .hero-cta-label { font-size: 14px; letter-spacing: 0.35em; }
        }
        @media (min-width: 768px) {
          .hero-cta-btn { padding: 16px 44px; min-width: 280px; }
          .hero-cta-label { font-size: 15px; }
        }
        @media (min-width: 1024px) {
          .hero-cta-label { font-size: 16px; }
        }

        /* ── 13" MacBook / short viewport fix ──────────────────────────
           On screens ≤ 820px tall the bottom group overlaps the couple.
           Shrink spacing and scale down the timer to keep it at the
           very bottom without covering the photo subjects.            */
        @media (max-height: 820px) {
          .hero-bottom-group {
            gap: 8px;
            margin-bottom: 0;
          }
          .hero-cta-btn {
            padding: 10px 26px;
            min-width: 200px;
          }
          .hero-cta-label {
            font-size: 12px;
          }
          .hero-timer-wrap {
            margin-top: 4px;
            transform: scale(0.85);
            transform-origin: top center;
          }
          .hero-separator {
            margin-top: 4px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
