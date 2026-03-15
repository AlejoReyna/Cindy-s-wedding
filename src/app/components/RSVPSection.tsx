"use client"
import { useEffect, useRef, useState, useCallback } from 'react';
import { useStatusBarSection } from '../../hooks/useStatusBarManager';
import { useTheme } from '../context/ThemeContext';

// ═══════════════════════════════════════════════════════════════════════
// RSVP + GIFTS — merged section
// NEW LAYOUT: Tabbed card interface — interactive toggle between
// "Sobre" and "Transferencia" within a single elevated card.
// No other section on the site uses interactive state switching.
// ═══════════════════════════════════════════════════════════════════════

const LETTER_SPEED = 80;
const HEADER_TEXT = 'Obsequios';

const writeDur = (s: string) => s.length * LETTER_SPEED + 380;

type GiftTab = 'sobre' | 'transferencia';

export default function RSVPSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isNightMode } = useTheme();

  const [headerStarted, setHeaderStarted] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<GiftTab>('sobre');
  const [tabAnimating, setTabAnimating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const rsvpSectionRef = useStatusBarSection({
    sectionId: 'rsvp',
    color: '#4c4c48',
    defaultColor: isNightMode ? '#000000' : '#ffffff',
    isNightMode
  });

  // ── Intersection observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '-30px' }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Sequential chain ──
  useEffect(() => {
    if (!headerStarted) return;
    const hDur = writeDur(HEADER_TEXT);
    const t1 = setTimeout(() => setContentVisible(true), hDur + 400);
    const t2 = setTimeout(() => setMessageVisible(true), hDur + 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [headerStarted]);

  const switchTab = useCallback((tab: GiftTab) => {
    if (tab === activeTab || tabAnimating) return;
    setTabAnimating(true);
    // Brief fade-out then switch
    setTimeout(() => {
      setActiveTab(tab);
      setTimeout(() => setTabAnimating(false), 350);
    }, 200);
  }, [activeTab, tabAnimating]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  // ── Copy icon ──
  const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block ml-2.5 opacity-40 group-hover/copy:opacity-80 transition-opacity duration-300">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="#8B7355" strokeWidth="1.2" />
      <path d="M10,4 V2.5 A1.5,1.5 0 0,0 8.5,1 H2.5 A1.5,1.5 0 0,0 1,2.5 V8.5 A1.5,1.5 0 0,0 2.5,10 H4" stroke="#8B7355" strokeWidth="1.2" />
    </svg>
  );

  const DetailRow = ({ label, value, copyValue }: { label: string; value: string; copyValue?: string }) => (
    <div className="rsvp-detail-row">
      <span className="garamond-300 tracking-[0.22em] text-[10px] md:text-[11px] uppercase text-[#8B7355]/65">
        {label}
      </span>
      {copyValue ? (
        <button
          onClick={() => copyToClipboard(copyValue, label)}
          className="group/copy inline-flex items-center cursor-pointer hover:text-[#6b5635] transition-colors duration-300"
          title="Copiar"
        >
          <span className="font-mono text-[13px] md:text-sm text-[#3d2a14] tracking-wider font-medium">
            {value}
          </span>
          <CopyIcon />
          {copied === label && (
            <span className="ml-2 text-[10px] tracking-[0.15em] uppercase text-[#C4985B] rsvp-copied">
              copiado
            </span>
          )}
        </button>
      ) : (
        <span className="garamond-regular text-[13px] md:text-sm text-[#3d2a14]">
          {value}
        </span>
      )}
    </div>
  );

  return (
    <section
      ref={(el) => {
        sectionRef.current = el as HTMLDivElement;
        if (rsvpSectionRef) {
          (rsvpSectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }
      }}
      className="w-full relative overflow-hidden py-24 md:py-32 px-5 md:px-8"
      style={{
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)'
      }}
    >
      {/* Organic texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 20%, rgba(196,152,91,0.15) 0%, transparent 60%),
                              radial-gradient(circle at 75% 60%, rgba(139,115,85,0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180,147,113,0.1) 0%, transparent 60%)`
          }}
        />
      </div>

      <div className="max-w-lg mx-auto relative z-10 w-full">

        {/* ═══ Header ═══ */}
        <div className="text-center mb-12 md:mb-16">
          <p className={`rsvp-eyebrow${headerStarted ? ' rsvp-eyebrow--visible' : ''}`}>
            Mesa de regalos
          </p>

          <h2 className="rsvp-title mb-4">
            {HEADER_TEXT.split('').map((char, i) => (
              <span
                key={i}
                className={`rsvp-letter${headerStarted ? ' rsvp-letter--on' : ''}`}
                style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>

          <span className={`rsvp-rule${headerStarted ? ' rsvp-rule--visible' : ''}`} />

          {/* Intro text */}
          <p className={`garamond-regular text-sm md:text-base text-[#543c24]/75 leading-relaxed max-w-sm mx-auto mt-8 transition-all duration-[1600ms] ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            Tu presencia es nuestro regalo más preciado. Si deseas honrarnos con un obsequio, estas son nuestras opciones.
          </p>
        </div>

        {/* ═══ Main Card with Tabs ═══ */}
        <div className={`rsvp-card transition-all duration-[1400ms] ease-out ${
          contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>

          {/* ── Tab Selector ── */}
          <div className="rsvp-tab-bar">
            <button
              onClick={() => switchTab('sobre')}
              className={`rsvp-tab ${activeTab === 'sobre' ? 'rsvp-tab--active' : ''}`}
            >
              <svg width="20" height="16" viewBox="0 0 36 28" fill="none" className="rsvp-tab-icon">
                <rect x="1" y="1" width="34" height="26" rx="3" stroke="currentColor" strokeWidth="1" />
                <path d="M1,1 L18,15 L35,1" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
              <span>Sobre</span>
            </button>

            <button
              onClick={() => switchTab('transferencia')}
              className={`rsvp-tab ${activeTab === 'transferencia' ? 'rsvp-tab--active' : ''}`}
            >
              <svg width="22" height="15" viewBox="0 0 38 26" fill="none" className="rsvp-tab-icon">
                <rect x="1" y="1" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1" />
                <rect x="1" y="7" width="36" height="4" fill="currentColor" opacity="0.15" />
                <rect x="5" y="17" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
              </svg>
              <span>Transferencia</span>
            </button>
          </div>

          {/* ── Tab Content ── */}
          <div className={`rsvp-tab-content ${tabAnimating ? 'rsvp-tab-content--fading' : ''}`}>

            {activeTab === 'sobre' && (
              <div className="rsvp-pane">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f0ebe3 0%, #e8e1d5 100%)' }}
                  >
                    <svg width="34" height="26" viewBox="0 0 36 28" fill="none">
                      <rect x="1" y="1" width="34" height="26" rx="3" stroke="#b8985e" strokeWidth="0.8" />
                      <path d="M1,1 L18,15 L35,1" stroke="#b8985e" strokeWidth="0.8" fill="none" />
                      <path d="M1,27 L13,15" stroke="#b8985e" strokeWidth="0.5" opacity="0.5" fill="none" />
                      <path d="M35,27 L23,15" stroke="#b8985e" strokeWidth="0.5" opacity="0.5" fill="none" />
                    </svg>
                  </div>
                </div>

                <p className="garamond-regular text-lg md:text-xl text-[#3d2a14] text-center leading-relaxed mb-4">
                  Un sobre con tu contribución será recibido con profundo agradecimiento el día de nuestra celebración.
                </p>

                <p className="garamond-300 text-xs md:text-sm text-[#8B7355]/60 text-center leading-relaxed">
                  Habrá un espacio destinado para recibirlos durante la recepción.
                </p>
              </div>
            )}

            {activeTab === 'transferencia' && (
              <div className="rsvp-pane">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f0ebe3 0%, #e8e1d5 100%)' }}
                  >
                    <svg width="36" height="24" viewBox="0 0 38 26" fill="none">
                      <rect x="1" y="1" width="36" height="24" rx="3" stroke="#b8985e" strokeWidth="0.8" />
                      <rect x="1" y="7" width="36" height="4" fill="#8B7355" opacity="0.12" />
                      <rect x="5" y="17" width="10" height="2" rx="1" fill="#b8985e" opacity="0.3" />
                      <rect x="18" y="17" width="6" height="2" rx="1" fill="#b8985e" opacity="0.2" />
                    </svg>
                  </div>
                </div>

                <p className="garamond-regular text-base md:text-lg text-[#3d2a14] text-center leading-relaxed mb-8">
                  Transferencia directa a nuestra cuenta.
                </p>

                {/* Bank details */}
                <div className="rsvp-bank-details">
                  <DetailRow label="Banco" value="BBVA" />
                  <DetailRow label="CLABE" value="0125 8001 5127 6602 40" copyValue="012580015127660240" />
                  <DetailRow label="Tarjeta" value="4152 3141 2145 2463" copyValue="4152314121452463" />
                  <DetailRow label="Titular" value="Cindy Janeth Medina Sanchez" />
                </div>

                <p className="garamond-300 text-[10px] tracking-[0.12em] text-[#8B7355]/40 text-center mt-4 uppercase">
                  Toca un número para copiarlo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Message Section ═══ */}
        <div className={`mt-12 md:mt-16 transition-all duration-[1600ms] ease-out ${
          messageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="mrs-saint-delafield-regular text-2xl md:text-3xl text-[#8B7355]/50 text-center mb-2">
            Unas palabras
          </p>
          <p className="garamond-300 text-xs md:text-sm tracking-[0.08em] text-[#543c24]/50 text-center mb-6">
            Si deseas dejarnos un mensaje para esta aventura
          </p>

          <div className="rsvp-message-wrap">
            <textarea
              name="wedding-message"
              rows={4}
              placeholder="Escribe aquí tu mensaje..."
              className="rsvp-textarea w-full px-5 py-4 bg-transparent text-[#3d2a14] text-sm md:text-base garamond-regular placeholder-[#8B7355]/25 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* ═══ Trailing ornament ═══ */}
        <div className={`flex items-center justify-center gap-3 mt-14 transition-all duration-[1200ms] ease-out ${
          messageVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} style={{ transitionDelay: '500ms' }}>
          <span className="block w-12 h-[0.5px] bg-[#C4985B]/35" />
          <svg width="10" height="10" viewBox="0 0 14 14" fill="rgba(196,152,91,0.3)">
            <polygon points="7,1 13,7 7,13 1,7"/>
          </svg>
          <span className="block w-12 h-[0.5px] bg-[#C4985B]/35" />
        </div>

      </div>

      {/* ═══ Scoped Styles ═══ */}
      <style jsx>{`
        /* ── Header ── */
        .rsvp-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 9px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: rgba(160, 120, 70, 0.5);
          margin-bottom: 0.5rem;
          opacity: 0;
          transform: translateY(6px);
        }
        .rsvp-eyebrow--visible {
          animation: rsvpFadeUp 0.6s ease-out forwards;
        }

        .rsvp-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 2.4rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #5c5c5c;
          line-height: 1;
          margin: 0;
        }
        @media (min-width: 640px)  { .rsvp-title { font-size: 3rem;   letter-spacing: 0.28em; } }
        @media (min-width: 768px)  { .rsvp-title { font-size: 3.5rem; letter-spacing: 0.3em;  } }

        .rsvp-rule {
          display: block;
          height: 1px;
          width: 0;
          margin: 0.6rem auto 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(196, 152, 91, 0.5) 30%,
            rgba(160, 115, 60, 0.35) 70%,
            transparent 100%
          );
        }
        .rsvp-rule--visible {
          animation: rsvpRuleGrow 1s cubic-bezier(0.4, 0, 0.2, 1) ${writeDur(HEADER_TEXT) - 200}ms forwards;
        }

        .rsvp-letter {
          display: inline-block;
          opacity: 0;
        }
        .rsvp-letter--on {
          animation: rsvpLetterWrite 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* ══ Main elevated card ══ */
        .rsvp-card {
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(196, 152, 91, 0.14);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            0 4px 24px rgba(139, 115, 85, 0.06),
            0 1px 4px rgba(139, 115, 85, 0.04);
          overflow: hidden;
        }

        /* ══ Tab bar ══ */
        .rsvp-tab-bar {
          display: flex;
          border-bottom: 1px solid rgba(196, 152, 91, 0.1);
        }

        .rsvp-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1.1rem 1rem;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 12px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(139, 115, 85, 0.4);
          cursor: pointer;
          border: none;
          background: transparent;
          position: relative;
          transition: color 0.4s ease, background 0.4s ease;
        }

        .rsvp-tab:first-child {
          border-right: 1px solid rgba(196, 152, 91, 0.08);
        }

        .rsvp-tab--active {
          color: #6b5635;
          background: rgba(196, 152, 91, 0.04);
        }

        .rsvp-tab::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 15%;
          right: 15%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C4985B, transparent);
          border-radius: 1px;
          transform: scaleX(0);
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .rsvp-tab--active::after {
          transform: scaleX(1);
        }

        .rsvp-tab-icon {
          width: 18px;
          height: auto;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .rsvp-tab--active .rsvp-tab-icon {
          opacity: 0.8;
        }

        @media (min-width: 640px) {
          .rsvp-tab {
            font-size: 13px;
            padding: 1.25rem 1.2rem;
          }
        }

        /* ══ Tab content area ══ */
        .rsvp-tab-content {
          padding: 2rem 1.5rem 2.2rem;
          transition: opacity 0.25s ease;
        }
        .rsvp-tab-content--fading {
          opacity: 0.3;
        }

        @media (min-width: 640px) {
          .rsvp-tab-content {
            padding: 2.5rem 2.2rem 2.8rem;
          }
        }

        .rsvp-pane {
          animation: rsvpPaneIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* ══ Bank details ══ */
        .rsvp-bank-details {
          background: rgba(237, 233, 226, 0.45);
          border: 1px solid rgba(196, 152, 91, 0.12);
          border-radius: 12px;
          padding: 0.25rem 1.2rem;
        }

        .rsvp-detail-row {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding: 0.85rem 0;
          border-bottom: 1px solid rgba(196, 152, 91, 0.08);
        }
        .rsvp-detail-row:last-child {
          border-bottom: none;
        }

        @media (min-width: 480px) {
          .rsvp-detail-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 0;
          }
        }

        /* ══ Copied badge ══ */
        .rsvp-copied {
          animation: rsvpFadeUp 0.3s ease-out forwards;
        }

        /* ══ Message ══ */
        .rsvp-message-wrap {
          border: 1px solid rgba(196, 152, 91, 0.15);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .rsvp-message-wrap:focus-within {
          border-color: rgba(196, 152, 91, 0.35);
          box-shadow: 0 0 0 4px rgba(196, 152, 91, 0.05);
        }

        .rsvp-textarea::placeholder {
          font-style: italic;
        }

        /* ══ Keyframes ══ */
        @keyframes rsvpFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rsvpRuleGrow {
          from { width: 0; }
          to   { width: min(100%, 22rem); }
        }
        @keyframes rsvpLetterWrite {
          0%   { opacity: 0; transform: translateY(10px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }
        @keyframes rsvpPaneIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
