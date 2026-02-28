"use client"
import { useEffect, useRef, useState } from 'react';
import { MdDirections } from 'react-icons/md';
import Image from 'next/image';
import churchImg from '../../../assets/church.png';
import receptionImg from '../../../assets/museum.jpg';

const locations = [
  {
    label: 'Ceremonia religiosa',
    venue: 'Iglesia Sagrado Corazón de Jesús',
    address: 'Calle Ignacio Zaragoza 700, Centro de Montemorelos',
    city: '67500 Montemorelos, N.L.',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Iglesia+Sagrado+Corazón+de+Jesús+Calle+Ignacio+Zaragoza+700+Montemorelos+N.L.',
    image: churchImg,
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
          className={`text-center mb-6 md:mb-10 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex justify-center mb-6">
            <svg className="w-8 h-8 text-[#8B7355]/35" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase text-[#5c5c5c] mb-5 garamond-300">
            Ubicaciones
          </h2>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C4985B]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C4985B]/40" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C4985B]/50" />
          </div>
        </div>

        {/* ═══ Location rows — rendered inline (not a child component) ═══ */}
        <div className="flex flex-col gap-2 md:gap-4">
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
        /* ── Row layout ── */
        .loc-row {
          min-height: 60vh;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .loc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          width: 100%;
          max-width: 72rem;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .loc-grid {
            grid-template-columns: 1.2fr 0.8fr;
            gap: 2.5rem;
          }
          .loc-grid--reversed {
            grid-template-columns: 0.8fr 1.2fr;
          }
        }

        /* ── Image ── */
        .loc-image-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          aspect-ratio: 4 / 3;
        }

        @media (min-width: 768px) {
          .loc-image-wrap {
            aspect-ratio: 16 / 11;
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
          align-items: flex-start;
          text-align: left;
          padding: 1rem 0.5rem;
        }

        .loc-text-block--right {
          align-items: flex-end;
          text-align: right;
        }

        @media (min-width: 768px) {
          .loc-text-block {
            padding: 0 1.5rem;
          }
        }

        /* ── Label ── */
        .loc-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 0.35em;
          color: rgba(139, 115, 85, 0.4);
          margin-bottom: 0.75rem;
          opacity: 0;
        }

        .loc-label--visible {
          animation: locFade 0.4s ease-out var(--label-delay) forwards;
        }

        /* ── Venue name — Hero-style letter animation ── */
        .loc-venue {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.25rem;
          letter-spacing: 0.04em;
          color: #5c5c5c;
          margin-bottom: 0.5rem;
          min-height: 1.8em;
          line-height: 1.3;
        }

        @media (min-width: 640px)  { .loc-venue { font-size: 1.5rem; } }
        @media (min-width: 768px)  { .loc-venue { font-size: 1.65rem; } }
        @media (min-width: 1024px) { .loc-venue { font-size: 1.85rem; } }

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
          font-size: 0.75rem;
          letter-spacing: 0.03em;
          color: rgba(139, 115, 85, 0.5);
          line-height: 1.6;
          margin-bottom: 1.25rem;
          opacity: 0;
        }

        @media (min-width: 640px) { .loc-addr { font-size: 0.85rem; } }

        .loc-addr--visible {
          animation: locFade 0.45s ease-out var(--addr-delay) forwards;
        }

        /* ── Gold accent ── */
        .loc-line {
          display: block;
          height: 1px;
          width: 0;
          background: rgba(196, 152, 91, 0.25);
          margin-bottom: 1.25rem;
        }

        .loc-line--visible {
          animation: locLineGrow 0.5s ease-out var(--line-delay) forwards;
        }

        @keyframes locLineGrow {
          to { width: 2.5rem; }
        }

        /* ── Button ── */
        .loc-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 1.5rem;
          border: 1px solid rgba(139, 115, 85, 0.15);
          color: rgba(139, 115, 85, 0.55);
          border-radius: 2px;
          text-decoration: none;
          opacity: 0;
          transform: translateY(8px);
          transition: color 0.3s, border-color 0.3s;
        }

        .loc-btn:hover {
          color: #8B7355;
          border-color: rgba(139, 115, 85, 0.35);
        }

        .loc-btn--visible {
          animation: locBtnIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--btn-delay) forwards;
        }

        .loc-btn-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

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
