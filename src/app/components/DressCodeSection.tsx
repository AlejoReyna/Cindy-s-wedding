"use client"
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/* ─── Letter-span renderer (hero-style stagger) ─── */
function LetterReveal({ text, active, baseDelay = 0, charStagger = 55, className = '' }: {
  text: string; active: boolean; baseDelay?: number; charStagger?: number; className?: string;
}) {
  return (
    <span className={className}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className={`ds-letter ${active ? 'ds-letter-go' : ''}`}
          style={{ animationDelay: active ? `${baseDelay + i * charStagger}ms` : '0ms' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}

export default function DressCodeSection() {
  const ACCENT_COLOR = '#bdb49b';
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [noNinosReady, setNoNinosReady] = useState(false);
  const [noNinosTextStart, setNoNinosTextStart] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.15, rootMargin: '-20px' }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Stagger: "No niños" badge appears after dress-code block settles */
  useEffect(() => {
    if (!isVisible) return;
    const t1 = setTimeout(() => setNoNinosReady(true), 1000);
    const t2 = setTimeout(() => setNoNinosTextStart(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isVisible]);


  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden min-h-screen"
    >
      {/* ═══ TWO-COLUMN LAYOUT: Paper (left 50%) | Image (right 50%) ═══ */}
      <div className="ds-two-col">

        {/* ══════════════════════════════════════════
            LEFT COLUMN — the column itself IS the paper
        ══════════════════════════════════════════ */}
        <div className="ds-col-paper">

          {/* Paper base — warm parchment */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, #fdfaf5 0%, #f9f5ee 55%, #f5f0e6 100%)'
            }}
          />

          {/* Paper grain texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.032'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              opacity: 0.7,
              mixBlendMode: 'multiply',
            }}
          />

          {/* Warm ambient blush at top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 40% 15%, rgba(196,152,91,0.07) 0%, transparent 60%),
                           radial-gradient(ellipse at 60% 85%, rgba(139,115,85,0.05) 0%, transparent 55%)`
            }}
          />

          {/* Left binding shadow */}
          <div
            className="absolute top-0 left-0 bottom-0 w-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.03) 0%, transparent 100%)',
            }}
          />

          {/* Right-edge feather into image column */}
          <div
            className="absolute top-0 right-0 bottom-0 w-14 pointer-events-none ds-right-feather"
            style={{
              background: 'linear-gradient(to right, transparent 0%, rgba(226,220,210,0.18) 100%)',
            }}
          />

          {/* ── Content — centred on the paper ── */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-10 md:px-16 py-20">

            {/* ══ 1) NOTA ESPECIAL HEADING ══ */}
            <p className="mrs-saint-delafield-regular text-4xl md:text-5xl text-[#8B7355]/65 mb-2">
              <LetterReveal
                text="Nota especial"
                active={isVisible}
                baseDelay={0}
                charStagger={22}
              />
            </p>

            <h2 className="garamond-300 text-[11px] md:text-xs tracking-[0.38em] uppercase text-[#5c5c5c]/70 mb-14">
              <LetterReveal
                text="para nuestros invitados"
                active={isVisible}
                baseDelay={100}
                charStagger={14}
              />
            </h2>

            {/* ══ 2) DRESS CODE / ETIQUETA FORMAL BLOCK ══ */}
            <div className="mb-14">
              <p className="garamond-300 tracking-[0.32em] text-[11px] md:text-xs uppercase mb-4" style={{ color: ACCENT_COLOR, opacity: 0.8 }}>
                <LetterReveal
                  text="Etiqueta"
                  active={isVisible}
                  baseDelay={350}
                  charStagger={22}
                />
              </p>
              <p className="garamond-regular text-2xl md:text-3xl leading-snug mb-5" style={{ color: ACCENT_COLOR }}>
                <LetterReveal
                  text="Formal"
                  active={isVisible}
                  baseDelay={500}
                  charStagger={28}
                />
              </p>

              {/* Dress code icon */}
              <div className={`flex justify-center mb-5 transition-all duration-[400ms] ease-out ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`} style={{ transitionDelay: '580ms' }}>
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/1124/1124043.png"
                  alt="Código de vestimenta formal"
                  className="dress-icon"
                  width={60}
                  height={60}
                  style={{
                    filter:
                      'invert(40%) sepia(30%) saturate(500%) hue-rotate(10deg) brightness(85%) contrast(90%)',
                    opacity: 0.75,
                  }}
                />
              </div>

              <p className="garamond-300 text-sm md:text-[15px] text-[#7a6a55] leading-relaxed max-w-xs mx-auto">
                <LetterReveal
                  text="El blanco está reservado para la novia."
                  active={isVisible}
                  baseDelay={620}
                  charStagger={8}
                />
                <br />
                <LetterReveal
                  text="Les agradecemos elegir otros colores."
                  active={isVisible}
                  baseDelay={750}
                  charStagger={8}
                />
              </p>
            </div>

            {/* ══ 3) NO NIÑOS — elegant apparition from nothing ══ */}
            <div className="relative">
              {/* "NO NIÑOS" badge — materializes from nothing */}
              <div className={`ds-no-ninos-badge ${noNinosReady ? 'ds-no-ninos-visible' : ''}`}>
                <span className="ds-ninos-line" />
                <span className="garamond-regular tracking-[0.3em] text-[15px] md:text-[18px] uppercase font-semibold drop-shadow-[0_1px_0_rgba(84,60,36,0.18)]" style={{ color: ACCENT_COLOR }}>
                  <LetterReveal
                    text="NO NIÑOS"
                    active={noNinosReady}
                    baseDelay={100}
                    charStagger={35}
                  />
                </span>
                <span className="ds-ninos-line" />
              </div>

              {/* Paragraph — simple fade-in after badge */}
              <div className={`mt-6 max-w-xs mx-auto transition-all duration-[800ms] ease-out ${
                noNinosTextStart ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <p className="garamond-regular text-base md:text-[17px] leading-relaxed" style={{ color: ACCENT_COLOR }}>
                  Con mucho cariño hemos planeado una velada íntima entre adultos.
                  {' '}Les pedimos amablemente que este día tan especial sea solo para los grandes.
                </p>
              </div>
            </div>

          </div>{/* end content */}
        </div>{/* end left paper column */}

        {/* ── RIGHT COLUMN: Placeholder image ── */}
        <div className="ds-col-image">
          {/* Warm parchment base */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, #e8e3d8 0%, #ddd8cc 40%, #d4cfc3 70%, #dbd6cb 100%)'
            }}
          />

          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              mixBlendMode: 'multiply',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.12) 100%)'
            }}
          />

          {/* Decorative tiling pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="dressPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M10,50 Q25,10 50,20 Q75,30 90,50 Q75,70 50,80 Q25,90 10,50Z" stroke="#8B7355" strokeWidth="0.4" fill="none" opacity="0.4"/>
              <circle cx="50" cy="50" r="2" fill="#bdb49b" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dressPattern)"/>
            </svg>
          </div>

          {/* Centred placeholder mark */}
          <div className={`relative z-10 flex flex-col items-center justify-center h-full px-10 transition-all duration-[1600ms] ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '400ms' }}>

            <svg width="60" height="60" viewBox="0 0 64 64" fill="none" className="mb-8 opacity-30">
              <circle cx="32" cy="32" r="28" stroke="#8B7355" strokeWidth="0.6"/>
              <circle cx="32" cy="32" r="18" stroke="#bdb49b" strokeWidth="0.5"/>
              <path d="M32,10 Q36,20 32,32 Q28,20 32,10Z" fill="#8B7355" opacity="0.4"/>
              <path d="M32,54 Q28,44 32,32 Q36,44 32,54Z" fill="#8B7355" opacity="0.4"/>
              <path d="M10,32 Q20,28 32,32 Q20,36 10,32Z" fill="#8B7355" opacity="0.4"/>
              <path d="M54,32 Q44,36 32,32 Q44,28 54,32Z" fill="#8B7355" opacity="0.4"/>
              <circle cx="32" cy="32" r="3" fill="#bdb49b" opacity="0.3"/>
            </svg>

            <p className="garamond-300 tracking-[0.35em] text-[11px] uppercase text-center mb-2" style={{ color: '#8B7355', opacity: 0.55 }}>
              Imagen
            </p>
            <p className="garamond-300 tracking-[0.2em] text-[10px] uppercase text-center" style={{ color: '#9B8366', opacity: 0.4 }}>
              próximamente
            </p>

            <div className="flex items-center gap-3 mt-7 opacity-35">
              <span className="block w-10 h-[0.5px]" style={{ backgroundColor: ACCENT_COLOR }} />
              <span className="block w-1 h-1 rounded-full" style={{ backgroundColor: ACCENT_COLOR }} />
              <span className="block w-10 h-[0.5px]" style={{ backgroundColor: ACCENT_COLOR }} />
            </div>
          </div>
        </div>

      </div>{/* end ds-two-col */}

      <style jsx>{`
        /* ══ TWO-COLUMN GRID ══ */
        .ds-two-col {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
        }

        .ds-col-paper {
          position: relative;
          width: 100%;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          order: 1;
        }
        .ds-col-image {
          position: relative;
          width: 100%;
          height: 40vh;
          overflow: hidden;
          order: 2;
        }

        @media (min-width: 768px) {
          .ds-two-col {
            flex-direction: row;
            min-height: 100vh;
          }
          .ds-col-paper {
            width: 50%;
            min-height: 100vh;
            order: 1;
          }
          .ds-col-image {
            width: 50%;
            height: auto;
            min-height: 100vh;
            order: 2;
          }
          .ds-right-feather {
            display: block;
          }
        }

        @media (max-width: 767px) {
          .ds-right-feather {
            display: none;
          }
        }

        /* ══ DRESS CODE ICON ══ */
        .dress-icon {
          width: 52px;
          height: 52px;
          object-fit: contain;
          display: block;
        }
        @media (min-width: 768px) {
          .dress-icon {
            width: 60px;
            height: 60px;
          }
        }

        /* ══ LETTER-BY-LETTER REVEAL (hero style) ══ */
        .ds-letter {
          display: inline-block;
          opacity: 0;
        }
        .ds-letter-go {
          animation: dsLetterWrite 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes dsLetterWrite {
          0%   { opacity: 0; transform: translateY(8px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }

        /* ══ NO NIÑOS — elegant apparition ══ */
        .ds-no-ninos-badge {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          transform: scale(0.7) translateY(12px);
          filter: blur(6px);
          transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1),
                      transform 0.6s cubic-bezier(0.19, 1, 0.22, 1),
                      filter 0.45s ease-out;
        }
        .ds-no-ninos-visible {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }

        .ds-ninos-line {
          display: block;
          width: 3.5rem;
          height: 1px;
          background: rgba(189, 180, 155, 0.55);
          transform-origin: center;
          transform: scaleX(0);
          transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0.15s;
        }
        .ds-no-ninos-visible .ds-ninos-line {
          transform: scaleX(1);
        }

      `}</style>
    </section>
  );
}
