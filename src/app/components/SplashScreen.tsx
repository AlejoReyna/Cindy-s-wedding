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
    setTimeout(() => onEnter(), 1600);
  };

  return (
    <div className="splash-root">

      {/* ── ENVELOPE PAPER BASE ── */}
      <div className="env-base" />

      {/* Paper grain texture */}
      <div className="env-grain" />

      {/* ── BOTTOM FLAP — triangle pointing UP ── */}
      <div className="env-flap env-flap--bottom" />

      {/* ── TOP FLAP (lid) — triangle pointing DOWN ── */}
      <div className={`env-flap env-flap--top ${exiting ? 'env-flap--top-open' : ''}`} />

      {/* ── Crease line where the two flaps meet ── */}
      <div className="env-crease" />

      {/* ── STAMP — centered ── */}
      <div className={`env-stamp ${exiting ? 'env-stamp--exit' : ''}`}>
        <div className="env-stamp-border">
          <div className="env-stamp-inner">
            <span className="env-stamp-date">03</span>
            <span className="env-stamp-divider" />
            <span className="env-stamp-month">ABR</span>
            <span className="env-stamp-year">2026</span>
          </div>
        </div>
      </div>

      {/* ── SEAL + HINT ── */}
      <div className={`seal-wrapper ${exiting ? 'seal-wrapper--exit' : ''}`}>
        <button
          onClick={handleEnter}
          className={`seal ${ready ? 'seal--visible' : ''}`}
          aria-label="Abrir invitación"
        >
          <span className="seal-glow" />
          <span className="seal-body">
            <span className="seal-ring" />
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

        <p className={`hint ${ready ? 'hint--visible' : ''}`}>
          Toca para abrir
        </p>
      </div>

      {/* ── EXIT CURTAINS ── */}
      <div className={`curtain curtain-top ${exiting ? 'curtain--exit-up' : ''}`} />
      <div className={`curtain curtain-bottom ${exiting ? 'curtain--exit-down' : ''}`} />

      <style jsx>{`
        /* ═══════════════════════════════════════════════════════════
           FULL-SCREEN ENVELOPE — TWO FLAPS
           ─────────────────────────────────────────────────────────
           Layers:
             1  env-base          cream paper
             2  env-grain         paper texture
             3  env-flap--bottom  bottom triangle (points up)
             4  env-flap--top     top triangle / lid (points down)
             5  env-crease        horizontal fold line
             6  env-stamp         centered stamp
             10 seal-wrapper      wax seal + hint
             20 curtains          exit split
        ═══════════════════════════════════════════════════════════ */

        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
        }

        /* ── 1. Base paper ── */
        .env-base {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            165deg,
            #f5efe5 0%,
            #efe8db 25%,
            #ece4d5 50%,
            #e9e0d0 75%,
            #e5dbc9 100%
          );
        }

        /* ── 2. Paper grain ── */
        .env-grain {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.28;
          mix-blend-mode: multiply;
          background-image:
            url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* ═══════════════════════════════════════════════════════════
           3 / 4. TWO TRIANGULAR FLAPS
        ═══════════════════════════════════════════════════════════ */

        .env-flap {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Bottom flap — triangle pointing UP toward top edge */
        .env-flap--bottom {
          z-index: 3;
          background: linear-gradient(
            0deg,
            #f3ece1 0%,
            #efe8db 35%,
            #ebe3d4 100%
          );
          clip-path: polygon(0 100%, 100% 100%, 50% 30%);
          filter: drop-shadow(0 -2px 6px rgba(100, 70, 40, 0.06));
        }

        /* Top flap (lid) — triangle pointing DOWN toward bottom edge */
        .env-flap--top {
          z-index: 4;
          background: linear-gradient(
            180deg,
            #e6ddd0 0%,
            #ebe3d6 35%,
            #f0e9dc 100%
          );
          clip-path: polygon(0 0, 100% 0, 50% 62%);
          filter: drop-shadow(0 3px 8px rgba(100, 70, 40, 0.08));
          transform-origin: top center;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.25s ease 0.45s;
        }

        .env-flap--top-open {
          transform: rotateX(180deg);
          opacity: 0;
        }

        /* ── 5. Horizontal crease where flaps overlap ── */
        .env-crease {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          z-index: 5;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(100, 70, 40, 0.06) 15%,
            rgba(100, 70, 40, 0.10) 50%,
            rgba(100, 70, 40, 0.06) 85%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* ═══════════════════════════════════════════════════════════
           6. STAMP — centered
        ═══════════════════════════════════════════════════════════ */

        .env-stamp {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(2.5deg);
          /* Sit above the flaps but below the seal */
          z-index: 6;
          transition: opacity 0.3s ease;
        }

        .env-stamp--exit { opacity: 0; }

        .env-stamp-border {
          padding: 5px;
          background: rgba(255, 255, 255, 0.85);
          border: 1.5px dashed rgba(140, 100, 60, 0.3);
          border-radius: 2px;
          box-shadow:
            0 1px 4px rgba(100, 70, 40, 0.10),
            0 0 0 1px rgba(140, 100, 60, 0.05);
        }

        .env-stamp-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 66px;
          background: linear-gradient(
            145deg,
            #faf3e8 0%,
            #f2e9d9 100%
          );
          border-radius: 1px;
        }

        .env-stamp-date {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: #8B7355;
          line-height: 1;
        }

        .env-stamp-divider {
          width: 20px;
          height: 1px;
          background: #c4a87a;
          margin: 4px 0;
        }

        .env-stamp-month {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: #a38d6d;
          text-transform: uppercase;
          line-height: 1;
        }

        .env-stamp-year {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: #b8a080;
          line-height: 1;
          margin-top: 2px;
        }

        /* ═══════════════════════════════════════════════════════════
           10. SEAL — Wax seal with monogram
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

        .seal-glow {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1.5px solid rgba(132, 88, 69, 0.12);
          animation: glowPulse 3s ease-in-out 1.5s infinite;
        }

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

        .seal-ring {
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          pointer-events: none;
        }

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

        /* ═══════════════════════════════════════════════════════════
           20. EXIT CURTAINS
        ═══════════════════════════════════════════════════════════ */

        .curtain {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 20;
          pointer-events: none;
          opacity: 0;
        }

        .curtain-top {
          top: 0;
          height: 50%;
          background: linear-gradient(180deg, #efe8db 0%, #f0e9dc 100%);
          box-shadow: 0 2px 24px rgba(84, 60, 36, 0.08);
          transition: transform 1.05s cubic-bezier(0.76, 0, 0.24, 1) 0.35s,
                      opacity 0.01s linear 0.35s;
        }

        .curtain-bottom {
          bottom: 0;
          height: 50%;
          background: linear-gradient(0deg, #efe8db 0%, #f0e9dc 100%);
          box-shadow: 0 -2px 24px rgba(84, 60, 36, 0.08);
          transition: transform 1.05s cubic-bezier(0.76, 0, 0.24, 1) 0.35s,
                      opacity 0.01s linear 0.35s;
        }

        .curtain--exit-up { opacity: 1; transform: translateY(-100%); }
        .curtain--exit-down { opacity: 1; transform: translateY(100%); }

        /* ═══════════════════════════════════════════════════════════
           KEYFRAMES
        ═══════════════════════════════════════════════════════════ */

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

        /* ═══════════════════════════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════════════════════════ */

        @media (min-width: 640px) {
          .seal { width: 160px; height: 160px; }
          .seal-body { width: 148px; height: 148px; }
          .seal-glow { inset: -12px; }
          .seal-ring { inset: 12px; }
          .seal :global(.seal-monogram) { width: 82px; height: 82px; }
          .hint { font-size: 14px; }
          .env-stamp-inner { width: 62px; height: 72px; }
          .env-stamp-date { font-size: 26px; }
          .env-stamp-month { font-size: 12px; }
          .env-stamp-year { font-size: 10px; }
        }

        @media (min-width: 768px) {
          .seal { width: 180px; height: 180px; }
          .seal-body { width: 166px; height: 166px; }
          .seal-glow { inset: -14px; }
          .seal-ring { inset: 14px; }
          .seal :global(.seal-monogram) { width: 92px; height: 92px; }
          .env-stamp-inner { width: 68px; height: 80px; }
          .env-stamp-date { font-size: 30px; }
          .env-stamp-month { font-size: 13px; }
          .env-stamp-year { font-size: 11px; }
          .env-stamp-divider { width: 24px; margin: 5px 0; }
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
