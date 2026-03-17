"use client"
import { useEffect, useRef, useState } from 'react';
import { MdDirections } from 'react-icons/md';
import Image from 'next/image';
import receptionImg from '../../../assets/museum.jpg';

const locations = [
  {
    label: 'Ceremonia religiosa',
    venue: 'Iglesia Sagrado Corazón de Jesús',
    address: 'Calle Ignacio Zaragoza 700, Centro de Montemorelos',
    city: '67500 Montemorelos, N.L.',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Iglesia+Sagrado+Corazón+de+Jesús+Calle+Ignacio+Zaragoza+700+Montemorelos+N.L.',
    image: '/assets/iglesia.jpg',
    imageAlt: 'Ceremonia religiosa - Iglesia Sagrado Corazón de Jesús',
  },
  {
    label: 'Recepción',
    venue: "Museo histórico 'Valle del Pilón'",
    address: 'Prolongación Frontera, s/n, Barrio Parar',
    city: '67500 Montemorelos, N.L.',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Museo+Valle+del+Pilón+Prolongación+Frontera+Montemorelos+N.L.',
    image: receptionImg,
    imageAlt: "Recepción - Museo histórico Valle del Pilón",
  },
] as const;

export default function LocationSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const row0Ref = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [row0Visible, setRow0Visible] = useState(false);
  const [row1Visible, setRow1Visible] = useState(false);

  // ── Header observer ──
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2, rootMargin: '-40px' }
    );
    const el = headerRef.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  // ── Row observers ──
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (e.target === row0Ref.current) setRow0Visible(true);
          if (e.target === row1Ref.current) setRow1Visible(true);
        });
      },
      { threshold: 0.15, rootMargin: '-20px' }
    );
    const r0 = row0Ref.current;
    const r1 = row1Ref.current;
    if (r0) obs.observe(r0);
    if (r1) obs.observe(r1);
    return () => { if (r0) obs.unobserve(r0); if (r1) obs.unobserve(r1); };
  }, []);

  const rowRefs = [row0Ref, row1Ref];
  const rowVisibles = [row0Visible, row1Visible];

  return (
    <section
      className="w-full py-12 md:py-16 px-4 md:px-8 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      {/* Subtle organic texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 20%, rgba(196,152,91,0.15) 0%, transparent 60%),
                              radial-gradient(circle at 75% 60%, rgba(139,115,85,0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180,147,113,0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ═══ Header ═══ */}
        <div
          ref={headerRef}
          className={`mb-6 md:mb-10 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Same max-width container as the loc-grid rows */}
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            
            <h2 className={`loc-section-title${headerVisible ? ' loc-section-title--visible' : ''}`}>
              Ubicaciones
            </h2>
            <span className={`loc-section-rule${headerVisible ? ' loc-section-rule--visible' : ''}`} />
          </div>
        </div>

        {/* ═══ Location rows — rendered inline (not a child component) ═══ */}
        <div className="flex flex-col">
          {locations.map((loc, index) => {
            const reversed = index === 1;
            const visible = rowVisibles[index];

            // Row 1: image first → text  |  Row 2: text first → image
            const imageDelay = reversed ? 500 : 0;
            const textDelay  = reversed ? 0   : 500;
            const btnDelay   = 900;

            const venueLetters = loc.venue.split('');
            const addrDelay = textDelay + 80 + venueLetters.length * 35 + 100;

            const imageBlock = (
              <div
                className="loc-image-wrap"
                style={{ '--img-delay': `${imageDelay}ms` } as React.CSSProperties}
              >
                <div className={`loc-image${visible ? ' loc-image--visible' : ''}`}>
                  <Image
                    src={loc.image}
                    alt={loc.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 55vw"
                  />
                </div>
              </div>
            );

            const textBlock = (
              <div className={`loc-text-block ${reversed ? 'loc-text-block--right' : ''}`}>
                {/* Animated tracing border */}
                <div
                  className={`loc-border-trace${visible ? ' loc-border-trace--visible' : ''}`}
                  style={{ '--border-start': `${textDelay + 300}ms` } as React.CSSProperties}
                >
                  <span className="loc-border-top" />
                  <span className="loc-border-right" />
                  <span className="loc-border-bottom" />
                  <span className="loc-border-left" />
                </div>

                {/* Label */}
                <p
                  className={`loc-label${visible ? ' loc-label--visible' : ''}`}
                  style={{ '--label-delay': `${textDelay}ms` } as React.CSSProperties}
                >
                  {loc.label.toUpperCase()}
                </p>

                {/* Venue — letter by letter */}
                <h3 className="loc-venue">
                  {venueLetters.map((char, i) => (
                    <span
                      key={i}
                      className={`loc-letter${visible ? ' loc-letter--animated' : ''}`}
                      style={{ animationDelay: `${textDelay + 80 + i * 35}ms` }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h3>

                {/* Address */}
                <p
                  className={`loc-addr${visible ? ' loc-addr--visible' : ''}`}
                  style={{ '--addr-delay': `${addrDelay}ms` } as React.CSSProperties}
                >
                  {loc.address}<br />{loc.city}
                </p>

                {/* Gold line */}
                <span
                  className={`loc-line${visible ? ' loc-line--visible' : ''}`}
                  style={{ '--line-delay': `${btnDelay - 100}ms` } as React.CSSProperties}
                />

                {/* Maps button */}
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`loc-btn${visible ? ' loc-btn--visible' : ''}`}
                  style={{ '--btn-delay': `${btnDelay}ms` } as React.CSSProperties}
                >
                  <MdDirections className="text-base" />
                  <span className="loc-btn-label">Ver en Maps</span>
                </a>
              </div>
            );

            return (
              <div key={index} ref={rowRefs[index]} className="loc-row">
                <div className={`loc-grid ${reversed ? 'loc-grid--reversed' : ''}`}>
                  {reversed ? <>{textBlock}{imageBlock}</> : <>{imageBlock}{textBlock}</>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ All styles in parent so styled-jsx scopes correctly ═══ */}
      <style jsx>{`
        /* ── Section header ── */
        .loc-section-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 9px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: rgba(160, 120, 70, 0.5);
          margin-bottom: 0.6rem;
          opacity: 0;
          transform: translateY(6px);
        }
        .loc-section-eyebrow--visible {
          animation: locHeaderFadeUp 0.6s ease-out 0ms forwards;
        }

        .loc-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2.4rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #5c5c5c;
          line-height: 1;
          margin: 0 0 1.1rem 0;
          opacity: 0;
          transform: translateY(10px);
        }
        @media (min-width: 640px)  { .loc-section-title { font-size: 3rem;   letter-spacing: 0.28em; } }
        @media (min-width: 768px)  { .loc-section-title { font-size: 3.5rem; letter-spacing: 0.3em;  } }
        @media (min-width: 1024px) { .loc-section-title { font-size: 4rem;   letter-spacing: 0.32em; } }

        .loc-section-title--visible {
          animation: locHeaderFadeUp 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) 120ms forwards;
        }

        .loc-section-rule {
          display: block;
          height: 1px;
          width: 0;
          background: linear-gradient(
            90deg,
            rgba(196, 152, 91, 0.6) 0%,
            rgba(160, 115, 60, 0.35) 55%,
            transparent 100%
          );
        }
        .loc-section-rule--visible {
          animation: locRuleGrow 0.9s cubic-bezier(0.4, 0, 0.2, 1) 500ms forwards;
        }
        @keyframes locRuleGrow { to { width: 100%; } }
        @keyframes locHeaderFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Row layout ── */
        .loc-row {
          display: flex;
          align-items: stretch;
          width: 100%;
        }

        .loc-row + .loc-row {
          margin-top: 3rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(196, 152, 91, 0.12);
        }

        @media (min-width: 768px) {
          .loc-row + .loc-row {
            margin-top: 4rem;
            padding-top: 4rem;
          }
        }

        .loc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          width: 100%;
          max-width: 72rem;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .loc-grid {
            grid-template-columns: 1.2fr 0.8fr;
            gap: 0;
          }
          .loc-grid--reversed {
            grid-template-columns: 0.8fr 1.2fr;
          }
        }

        /* ── Image ── */
        .loc-image-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 0;
          aspect-ratio: 4 / 3;
          min-height: 260px;
        }

        @media (min-width: 768px) {
          .loc-image-wrap {
            aspect-ratio: unset;
            min-height: 420px;
          }
        }

        .loc-image {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(1.06);
        }

        .loc-image--visible {
          animation: locImgIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--img-delay) forwards;
        }

        @keyframes locImgIn {
          to { opacity: 1; transform: scale(1); }
        }

        /* ── Text block ── */
        .loc-text-block {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 2.5rem 1.5rem;
          position: relative;
          min-height: 260px;
          background-color: #ffffff;
        }

        .loc-text-block--right {
          align-items: center;
          text-align: center;
        }

        @media (min-width: 768px) {
          .loc-text-block {
            align-items: flex-start;
            text-align: left;
            padding: 3rem 2.5rem;
            min-height: 420px;
          }
          .loc-text-block--right {
            align-items: flex-end;
            text-align: right;
          }
        }

        /* ── Tracing border ── */
        .loc-border-trace {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .loc-border-trace span {
          position: absolute;
          background: linear-gradient(
            90deg,
            rgba(139, 90, 43, 0.25),
            rgba(196, 152, 91, 0.55),
            rgba(160, 115, 60, 0.3)
          );
        }

        /* Top: left → right */
        .loc-border-top {
          top: 0; left: 0;
          height: 1px;
          width: 0;
        }
        /* Right: top → bottom */
        .loc-border-right {
          top: 0; right: 0;
          width: 1px;
          height: 0;
          background: linear-gradient(
            180deg,
            rgba(196, 152, 91, 0.55),
            rgba(160, 115, 60, 0.3),
            rgba(139, 90, 43, 0.2)
          ) !important;
        }
        /* Bottom: right → left */
        .loc-border-bottom {
          bottom: 0; right: 0;
          height: 1px;
          width: 0;
        }
        /* Left: bottom → top */
        .loc-border-left {
          bottom: 0; left: 0;
          width: 1px;
          height: 0;
          background: linear-gradient(
            0deg,
            rgba(196, 152, 91, 0.55),
            rgba(160, 115, 60, 0.3),
            rgba(139, 90, 43, 0.2)
          ) !important;
        }

        .loc-border-trace--visible .loc-border-top {
          animation: borderTop 0.65s cubic-bezier(0.4, 0, 0.2, 1) var(--border-start) forwards;
        }
        .loc-border-trace--visible .loc-border-right {
          animation: borderRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--border-start) + 650ms) forwards;
        }
        .loc-border-trace--visible .loc-border-bottom {
          animation: borderBottom 0.65s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--border-start) + 1150ms) forwards;
        }
        .loc-border-trace--visible .loc-border-left {
          animation: borderLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--border-start) + 1800ms) forwards;
        }

        @keyframes borderTop    { to { width: 100%; } }
        @keyframes borderRight  { to { height: 100%; } }
        @keyframes borderBottom { to { width: 100%; } }
        @keyframes borderLeft   { to { height: 100%; } }

        /* ── Label ── */
        .loc-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 9px;
          letter-spacing: 0.4em;
          color: rgba(139, 115, 85, 0.45);
          margin-bottom: 0.65rem;
          text-transform: uppercase;
          opacity: 0;
        }

        @media (min-width: 640px) { .loc-label { font-size: 10px; letter-spacing: 0.38em; } }
        @media (min-width: 768px) { .loc-label { font-size: 10.5px; letter-spacing: 0.35em; } }

        .loc-label--visible {
          animation: locFade 0.4s ease-out var(--label-delay) forwards;
        }

        /* ── Venue name — Hero-style letter animation ── */
        .loc-venue {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.35rem;
          letter-spacing: 0.03em;
          color: #5c5c5c;
          margin-bottom: 0.6rem;
          min-height: 1.8em;
          line-height: 1.35;
          word-break: break-word;
          hyphens: auto;
          max-width: 100%;
        }

        @media (min-width: 480px)  { .loc-venue { font-size: 1.5rem; } }
        @media (min-width: 640px)  { .loc-venue { font-size: 1.65rem; letter-spacing: 0.04em; } }
        @media (min-width: 768px)  { .loc-venue { font-size: 1.75rem; } }
        @media (min-width: 1024px) { .loc-venue { font-size: 1.95rem; } }

        .loc-letter {
          display: inline-block;
          opacity: 0;
        }

        .loc-letter--animated {
          animation: letterWrite 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes letterWrite {
          0%   { opacity: 0; transform: translateY(8px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }

        /* ── Address ── */
        .loc-addr {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 0.78rem;
          letter-spacing: 0.025em;
          color: rgba(139, 115, 85, 0.5);
          line-height: 1.7;
          margin-bottom: 1.4rem;
          opacity: 0;
          max-width: 100%;
        }

        @media (min-width: 480px) { .loc-addr { font-size: 0.82rem; } }
        @media (min-width: 640px) { .loc-addr { font-size: 0.88rem; } }
        @media (min-width: 768px) { .loc-addr { font-size: 0.9rem; letter-spacing: 0.03em; } }

        .loc-addr--visible {
          animation: locFade 0.45s ease-out var(--addr-delay) forwards;
        }

        /* ── Gold accent ── */
        .loc-line {
          display: block;
          height: 1px;
          width: 0;
          background: linear-gradient(90deg, rgba(196, 152, 91, 0.45), rgba(139, 90, 43, 0.2));
          margin-bottom: 1.4rem;
        }

        .loc-text-block--right .loc-line {
          align-self: flex-end;
        }

        @media (max-width: 767px) {
          .loc-text-block .loc-line,
          .loc-text-block--right .loc-line {
            align-self: center;
          }
        }

        .loc-line--visible {
          animation: locLineGrow 0.5s ease-out var(--line-delay) forwards;
        }

        @keyframes locLineGrow {
          to { width: 2.75rem; }
        }

        /* ── Button ── */
        .loc-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.6rem 1.4rem;
          border: 1px solid rgba(139, 115, 85, 0.18);
          color: rgba(139, 115, 85, 0.6);
          border-radius: 2px;
          text-decoration: none;
          opacity: 0;
          transform: translateY(8px);
          transition: color 0.3s, border-color 0.3s, background 0.3s;
        }

        .loc-btn:hover {
          color: #7a6245;
          border-color: rgba(139, 115, 85, 0.4);
          background: rgba(196, 152, 91, 0.04);
        }

        .loc-btn--visible {
          animation: locBtnIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--btn-delay) forwards;
        }

        .loc-btn-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        @media (min-width: 640px) { .loc-btn-label { font-size: 11px; letter-spacing: 0.15em; } }

        @keyframes locBtnIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Shared ── */
        @keyframes locFade {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
