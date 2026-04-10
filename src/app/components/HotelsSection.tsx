"use client"
import { useEffect, useRef, useState } from 'react';
import { MdDirections } from 'react-icons/md';

const hotels = [
  { name: 'Ecovergel Hotel Boutique', price: '$1,800', featured: true, mapsUrl: 'https://share.google/5KEKymd9U5YaPIQ3F' },
  { name: 'Hotel Mavira', price: '$700', featured: false, mapsUrl: 'https://share.google/hyEQ4Bj2LYNtr2CiG' },
  { name: 'Hotel Aljofar', price: '$800', featured: false, mapsUrl: 'https://share.google/pj2nxb28h1sYHLL4b' },
  { name: 'Hotel Alfa Inn', price: '$900', featured: false, mapsUrl: 'https://share.google/7xGCKY4dVtBc6iHF8' },
  { name: 'Monte Salerno Hotel & Suites', price: '$1,300', featured: true, mapsUrl: 'https://share.google/SveJk5GYsJ1H50V8A' },
  { name: 'GB Hotel', price: '$1,300', featured: true, mapsUrl: 'https://share.google/P8zeF9yeLpWON0Vqw' },
];

export default function HotelsSection() {
  const hotelsRef = useRef<HTMLDivElement>(null);
  const [hotelsVisible, setHotelsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setHotelsVisible(true); },
      { threshold: 0.1, rootMargin: '-20px' }
    );
    const el = hotelsRef.current;
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-8 relative overflow-hidden" style={{ backgroundColor: '#f3ebe2' }}>
      <div className="relative z-10">
        <div
          ref={hotelsRef}
          className="hotels-section"
          style={{ maxWidth: '72rem', margin: '0 auto' }}
        >
          <div className={`hotels-divider${hotelsVisible ? ' hotels-divider--visible' : ''}`} />

          <div className={`hotels-header${hotelsVisible ? ' hotels-header--visible' : ''}`}>
            <h3 className="hotels-title">Hoteles en Montemorelos</h3>
            <p className="hotels-subtitle">Si buscas hospedaje, te sugerimos las siguientes opciones:</p>
          </div>

          <div className="hotels-grid">
            {hotels.map((hotel, i) => (
              <div
                key={i}
                className={`hotel-card${hotelsVisible ? ' hotel-card--visible' : ''}`}
                style={{ '--card-delay': `${i * 90}ms` } as React.CSSProperties}
              >
                <div
                  className={`hotel-border-trace${hotelsVisible ? ' hotel-border-trace--visible' : ''}`}
                  style={{ '--hborder-start': `${200 + i * 90}ms` } as React.CSSProperties}
                >
                  <span className="hborder-top" />
                  <span className="hborder-right" />
                  <span className="hborder-bottom" />
                  <span className="hborder-left" />
                </div>

                {hotel.featured && (
                  <span className="hotel-star">✦</span>
                )}

                <p className="hotel-name">{hotel.name}</p>
                <span className="hotel-rule" />
                <p className="hotel-price-label">a partir de</p>
                <p className="hotel-price">{hotel.price} <span className="hotel-price-mxn">MXN / noche</span></p>
                <a
                  href={hotel.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hotel-maps-btn"
                >
                  <MdDirections className="text-sm" />
                  <span>Ver en Maps</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hotels-section {
          padding-top: 3.5rem;
        }

        @media (min-width: 768px) {
          .hotels-section {
            padding-top: 4.5rem;
          }
        }

        .hotels-divider {
          height: 1px;
          width: 0;
          background: linear-gradient(
            90deg,
            rgba(181, 150, 106, 0.10) 0%,
            rgba(181, 150, 106, 0.30) 40%,
            rgba(156, 130, 108, 0.15) 100%
          );
          margin-bottom: 3rem;
        }

        .hotels-divider--visible {
          animation: hotelsRuleGrow 1s cubic-bezier(0.4, 0, 0.2, 1) 0ms forwards;
        }

        .hotels-header {
          opacity: 0;
          transform: translateY(10px);
          margin-bottom: 2.25rem;
          text-align: center;
        }

        .hotels-header--visible {
          animation: hotelsHeaderFadeUp 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) 200ms forwards;
        }

        .hotels-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4a3728;
          margin: 0;
          line-height: 1.1;
        }

        @media (min-width: 640px)  { .hotels-title { font-size: 2.1rem; letter-spacing: 0.20em; } }
        @media (min-width: 768px)  { .hotels-title { font-size: 2.4rem; letter-spacing: 0.22em; } }

        .hotels-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 0.88rem;
          letter-spacing: 0.025em;
          color: rgba(156, 130, 108, 0.60);
          line-height: 1.65;
          margin: 0.85rem 0 0 0;
          max-width: 38rem;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 640px) { .hotels-subtitle { font-size: 0.95rem; } }
        @media (min-width: 768px) { .hotels-subtitle { font-size: 1rem; } }

        .hotels-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background-color: rgba(181, 150, 106, 0.10);
        }

        @media (min-width: 480px) {
          .hotels-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 900px) {
          .hotels-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .hotel-card {
          position: relative;
          background-color: #ffffff;
          padding: 2rem 1.75rem 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          opacity: 0;
          transform: translateY(14px);
          overflow: hidden;
        }

        .hotel-card--visible {
          animation: hotelCardIn 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) calc(300ms + var(--card-delay)) forwards;
        }

        .hotel-border-trace {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hotel-border-trace span {
          position: absolute;
          background: linear-gradient(
            90deg,
            rgba(156, 130, 108, 0.18),
            rgba(181, 150, 106, 0.35),
            rgba(156, 130, 108, 0.15)
          );
        }

        .hborder-top    { top: 0; left: 0; height: 1px; width: 0; }
        .hborder-right  { top: 0; right: 0; width: 1px; height: 0;
          background: linear-gradient(180deg, rgba(181,150,106,0.35), rgba(156,130,108,0.12)) !important; }
        .hborder-bottom { bottom: 0; right: 0; height: 1px; width: 0; }
        .hborder-left   { bottom: 0; left: 0; width: 1px; height: 0;
          background: linear-gradient(0deg, rgba(181,150,106,0.35), rgba(156,130,108,0.12)) !important; }

        .hotel-border-trace--visible .hborder-top {
          animation: borderTop 0.5s cubic-bezier(0.4,0,0.2,1) var(--hborder-start) forwards;
        }
        .hotel-border-trace--visible .hborder-right {
          animation: borderRight 0.4s cubic-bezier(0.4,0,0.2,1) calc(var(--hborder-start) + 500ms) forwards;
        }
        .hotel-border-trace--visible .hborder-bottom {
          animation: borderBottom 0.5s cubic-bezier(0.4,0,0.2,1) calc(var(--hborder-start) + 900ms) forwards;
        }
        .hotel-border-trace--visible .hborder-left {
          animation: borderLeft 0.4s cubic-bezier(0.4,0,0.2,1) calc(var(--hborder-start) + 1400ms) forwards;
        }

        .hotel-star {
          font-size: 9px;
          color: rgba(181, 150, 106, 0.70);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          display: block;
        }

        .hotel-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.05rem;
          letter-spacing: 0.02em;
          color: #4a3728;
          line-height: 1.35;
          margin: 0 0 1rem 0;
          flex: 1;
        }

        @media (min-width: 640px) { .hotel-name { font-size: 1.1rem; } }
        @media (min-width: 768px) { .hotel-name { font-size: 1.15rem; } }

        .hotel-rule {
          display: block;
          height: 1px;
          width: 2rem;
          background: linear-gradient(90deg, rgba(181, 150, 106, 0.40), rgba(156, 130, 108, 0.15));
          margin-bottom: 0.85rem;
        }

        .hotel-price-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 8.5px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(156, 130, 108, 0.45);
          margin: 0 0 0.2rem 0;
        }

        .hotel-price {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 1.25rem;
          letter-spacing: 0.04em;
          color: rgba(181, 150, 106, 0.85);
          margin: 0;
          line-height: 1;
        }

        .hotel-price-mxn {
          font-weight: 300;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          color: rgba(156, 130, 108, 0.45);
          text-transform: uppercase;
        }

        .hotel-maps-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-top: 1.1rem;
          padding: 0.45rem 1.1rem;
          border: 1px solid rgba(181, 150, 106, 0.20);
          border-radius: 2px;
          color: rgba(156, 130, 108, 0.60);
          text-decoration: none;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.3s, border-color 0.3s, background 0.3s;
        }

        .hotel-maps-btn:hover {
          color: #6d5a42;
          border-color: rgba(181, 150, 106, 0.38);
          background: rgba(181, 150, 106, 0.04);
        }

        @keyframes hotelsRuleGrow { to { width: clamp(8rem, 32vw, 14rem); } }
        @keyframes hotelsHeaderFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hotelCardIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes borderTop    { to { width: 100%; } }
        @keyframes borderRight  { to { height: 100%; } }
        @keyframes borderBottom { to { width: 100%; } }
        @keyframes borderLeft   { to { height: 100%; } }
      `}</style>
    </section>
  );
}
