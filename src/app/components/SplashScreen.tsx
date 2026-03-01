"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen = ({ onEnter }: SplashScreenProps) => {
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    window.dispatchEvent(new CustomEvent('startMusic'));
    setExiting(true);
    setTimeout(() => onEnter(), 1500);
  };

  return (
    <div className="splash-root">

      {/* ── ENVELOPE BODY ── */}
      <div className="env-body" />

      {/* Fold panels — four triangles that form the inner envelope shape */}
      <div className="env-fold env-fold--bottom" />
      <div className="env-fold env-fold--left" />
      <div className="env-fold env-fold--right" />

      {/* Diagonal fold-crease lines */}
      <div className="env-crease env-crease--bl" />
      <div className="env-crease env-crease--br" />

      {/* ── TRIANGULAR FLAP (top fold — closes the envelope) ── */}
      <div className={`envelope-flap ${exiting ? 'flap--open' : ''}`}>
        <div className="flap-inner" />
      </div>

      {/* ── Horizontal fold line at center ── */}
      <div className={`fold-line ${exiting ? 'fold-line--exit' : ''}`} />

      {/* ── SEAL + HINT (always on top) ── */}
      <div className={`seal-wrapper ${exiting ? 'seal-wrapper--exit' : ''}`}>

        {/* Wax seal — the button */}
        <button
          onClick={handleEnter}
          className={`seal ${ready ? 'seal--visible' : ''}`}
          aria-label="Abrir invitación"
        >
          {/* Outer ring glow pulse */}
          <span className="seal-glow" />

          {/* Seal body */}
          <span className="seal-body">
            {/* Inner ring border */}
            <span className="seal-ring" />

            {/* Monogram image */}
            <Image
              src="/Diseño sin título.png"
              alt="C&J"
              width={72}
              height={72}
              className="seal-monogram"
              priority
            />
          </span>
        </button>

        {/* Hint text */}
        <p className={`hint ${ready ? 'hint--visible' : ''}`}>
          Toca para abrir
        </p>
      </div>

      {/* ── TOP CURTAIN ── */}
      <div className={`curtain curtain-top ${exiting ? 'curtain-top--exit' : ''}`} />

      {/* ── BOTTOM CURTAIN ── */}
      <div className={`curtain curtain-bottom ${exiting ? 'curtain-bottom--exit' : ''}`} />

      <style jsx>{`
        /* ═══════════════════════════════════════════════════════════
           SPLASH — ENVELOPE WITH WAX SEAL
           ─────────────────────────────────────────────────────────
           Layers:
             1. envelope-paper   — cream bg (z:1)
             2. curtains         — split on exit (z:2)
             3. flap             — triangle fold (z:3)
             4. fold-line        — center crease (z:4)
             5. seal-wrapper     — monogram seal + hint (z:10)
        ═══════════════════════════════════════════════════════════ */

        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
        }

        /* ═══════════════════════════════════════════════════════════
           ENVELOPE BODY — realistic inner-fold structure
           ─────────────────────────────────────────────────────────
           Base layer + three triangular folds (bottom, left, right)
           overlapping toward the center. The top flap is separate
           and sits above. Subtle crease lines along diagonals.
        ═══════════════════════════════════════════════════════════ */

        .env-body {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: #ede5d5;
        }

        /* ── Fold panels (triangular flaps inside the envelope) ── */
        .env-fold {
          position: absolute;
          inset: 0;
          z-index: 2;
        }

        /* Bottom flap — triangle pointing up from bottom edge */
        .env-fold--bottom {
          background: #f4ede1;
          clip-path: polygon(0 100%, 100% 100%, 50% 42%);
        }

        /* Left flap — triangle pointing right from left edge */
        .env-fold--left {
          background: #f0e9dc;
          clip-path: polygon(0 0, 0 100%, 50% 50%);
          z-index: 3;
        }

        /* Right flap — triangle pointing left from right edge */
        .env-fold--right {
          background: #eee7d9;
          clip-path: polygon(100% 0, 100% 100%, 50% 50%);
          z-index: 3;
        }

        /* ── Diagonal crease lines along fold edges ── */
        .env-crease {
          position: absolute;
          z-index: 4;
          pointer-events: none;
        }

        /* Bottom-left crease: from bottom-left corner to center */
        .env-crease--bl {
          bottom: 0;
          left: 0;
          width: 72%;
          height: 60%;
          background: linear-gradient(
            to top right,
            transparent 49.3%,
            rgba(84, 60, 36, 0.07) 49.5%,
            rgba(84, 60, 36, 0.07) 50.5%,
            transparent 50.7%
          );
        }

        /* Bottom-right crease: from bottom-right corner to center */
        .env-crease--br {
          bottom: 0;
          right: 0;
          width: 72%;
          height: 60%;
          background: linear-gradient(
            to top left,
            transparent 49.3%,
            rgba(84, 60, 36, 0.07) 49.5%,
            rgba(84, 60, 36, 0.07) 50.5%,
            transparent 50.7%
          );
        }

        /* ── Curtains (split on exit) ──────────────────────────── */
        .curtain {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0;
        }

        .curtain-top {
          top: 0;
          height: 50%;
          background: linear-gradient(180deg, #ede5d5 0%, #f0e9dc 100%);
          box-shadow: 0 2px 24px rgba(84, 60, 36, 0.08);
          transition: transform 1.05s cubic-bezier(0.76, 0, 0.24, 1) 0.35s,
                      opacity 0.01s linear 0.35s;
        }

        .curtain-bottom {
          bottom: 0;
          height: 50%;
          background: linear-gradient(0deg, #ede5d5 0%, #f0e9dc 100%);
          box-shadow: 0 -2px 24px rgba(84, 60, 36, 0.08);
          transition: transform 1.05s cubic-bezier(0.76, 0, 0.24, 1) 0.35s,
                      opacity 0.01s linear 0.35s;
        }

        .curtain-top--exit { opacity: 1; transform: translateY(-100%); }
        .curtain-bottom--exit { opacity: 1; transform: translateY(100%); }

        /* ── Top Flap (the lid) ─────────────────────────────────── */
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 52%;
          z-index: 5;
          perspective: 900px;
          pointer-events: none;
        }

        .flap-inner {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(180deg, #e8e0d0 0%, #efe8da 100%);
          clip-path: polygon(0 100%, 50% 10%, 100% 100%);
          transform-origin: bottom center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.25s ease 0.45s;
          filter: drop-shadow(0 1px 2px rgba(84, 60, 36, 0.06));
        }

        .flap--open .flap-inner {
          transform: rotateX(180deg);
          opacity: 0;
        }

        /* ── Fold line ─────────────────────────────────────────── */
        .fold-line {
          position: absolute;
          top: 50%;
          left: 12%;
          right: 12%;
          height: 1px;
          z-index: 4;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(84, 60, 36, 0.05) 25%,
            rgba(84, 60, 36, 0.08) 50%,
            rgba(84, 60, 36, 0.05) 75%,
            transparent 100%
          );
          transition: opacity 0.25s ease;
        }

        .fold-line--exit { opacity: 0; }

        /* ═══════════════════════════════════════════════════════════
           SEAL — Wax seal with monogram
        ═══════════════════════════════════════════════════════════ */

        .seal-wrapper {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          transition: opacity 0.3s ease, transform 0.45s ease;
        }

        .seal-wrapper--exit {
          opacity: 0;
          transform: scale(0.92);
        }

        /* ── The seal button ── */
        .seal {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          opacity: 0;
          transform: scale(0.6);
        }

        .seal--visible {
          animation: sealIn 0.8s cubic-bezier(0.34, 1.4, 0.64, 1) 0.3s forwards;
        }

        /* Outer glow ring — pulses to attract attention */
        .seal-glow {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1.5px solid rgba(132, 88, 69, 0.12);
          animation: glowPulse 3s ease-in-out 1.5s infinite;
        }

        /* Main seal body */
        .seal-body {
          position: relative;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            145deg,
            #c49a7e 0%,
            #b5846a 30%,
            #a3725a 60%,
            #c49a7e 100%
          );
          box-shadow:
            0 6px 24px rgba(132, 88, 69, 0.30),
            0 2px 6px rgba(84, 60, 36, 0.18),
            inset 0 2px 4px rgba(255, 255, 255, 0.20),
            inset 0 -2px 6px rgba(84, 60, 36, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .seal:hover .seal-body {
          transform: scale(1.04);
          box-shadow:
            0 8px 32px rgba(132, 88, 69, 0.38),
            0 3px 10px rgba(84, 60, 36, 0.22),
            inset 0 2px 4px rgba(255, 255, 255, 0.22),
            inset 0 -2px 6px rgba(84, 60, 36, 0.15);
        }

        .seal:active .seal-body {
          transform: scale(0.97);
          box-shadow:
            0 3px 12px rgba(132, 88, 69, 0.25),
            0 1px 4px rgba(84, 60, 36, 0.15),
            inset 0 2px 4px rgba(255, 255, 255, 0.15),
            inset 0 -2px 6px rgba(84, 60, 36, 0.15);
        }

        /* Inner decorative ring */
        .seal-ring {
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          pointer-events: none;
        }

        /* Monogram image */
        .seal :global(.seal-monogram) {
          position: relative;
          z-index: 1;
          width: 72px;
          height: 72px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.92;
        }

        /* ── Hint text ── */
        .hint {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 13px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(132, 88, 69, 0.38);
          opacity: 0;
          transform: translateY(6px);
        }

        .hint--visible {
          animation: hintIn 0.6s ease-out 1.4s forwards,
                     hintPulse 3.5s ease-in-out 2.5s infinite;
        }

        /* ── Keyframes ─────────────────────────────────────────── */
        @keyframes sealIn {
          0%   { opacity: 0; transform: scale(0.6); }
          70%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes glowPulse {
          0%, 100% {
            transform: scale(1);
            border-color: rgba(132, 88, 69, 0.08);
            box-shadow: 0 0 0 0 rgba(132, 88, 69, 0);
          }
          50% {
            transform: scale(1.08);
            border-color: rgba(132, 88, 69, 0.18);
            box-shadow: 0 0 20px 4px rgba(132, 88, 69, 0.06);
          }
        }

        @keyframes hintIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes hintPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* ── Responsive ────────────────────────────────────────── */
        @media (min-width: 640px) {
          .seal { width: 160px; height: 160px; }
          .seal-body { width: 148px; height: 148px; }
          .seal-glow { inset: -12px; }
          .seal-ring { inset: 12px; }
          .seal :global(.seal-monogram) { width: 82px; height: 82px; }
          .hint { font-size: 14px; }
        }

        @media (min-width: 768px) {
          .seal { width: 180px; height: 180px; }
          .seal-body { width: 166px; height: 166px; }
          .seal-glow { inset: -14px; }
          .seal-ring { inset: 14px; }
          .seal :global(.seal-monogram) { width: 92px; height: 92px; }
        }

        @media (min-width: 1024px) {
          .seal { width: 190px; height: 190px; }
          .seal-body { width: 176px; height: 176px; }
          .seal :global(.seal-monogram) { width: 100px; height: 100px; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
