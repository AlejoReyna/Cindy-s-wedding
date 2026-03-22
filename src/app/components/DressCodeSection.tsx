"use client"
import { useEffect, useRef, useState } from 'react';

export default function DressCodeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

            {/* ── Script heading ── */}
            <p className={`mrs-saint-delafield-regular text-4xl md:text-5xl text-[#8B7355]/65 mb-2 transition-all duration-[1600ms] ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`} style={{ transitionDelay: '250ms' }}>
              Nota especial
            </p>

            {/* ── Small caps subtitle ── */}
            <h2 className={`garamond-300 text-[11px] md:text-xs tracking-[0.38em] uppercase text-[#5c5c5c]/70 mb-14 transition-all duration-[1600ms] ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`} style={{ transitionDelay: '420ms' }}>
              para nuestros invitados
            </h2>

            {/* ══ DRESS CODE BLOCK ══ */}
            <div className={`mb-14 transition-all duration-[1800ms] ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '620ms' }}>

              <p className="garamond-300 tracking-[0.32em] text-[11px] md:text-xs uppercase text-[#8B7355]/80 mb-4">
                Etiqueta
              </p>
              <p className="garamond-regular text-2xl md:text-3xl text-[#543c24] leading-snug mb-5">
                Formal
              </p>
              {/* ── Dress code icon ── */}
              <div className={`flex justify-center mb-5 transition-all duration-[1600ms] ease-out ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`} style={{ transitionDelay: '720ms' }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1124/1124043.png"
                  alt="Código de vestimenta formal"
                  className="dress-icon"
                  style={{
                    filter:
                      'invert(40%) sepia(30%) saturate(500%) hue-rotate(10deg) brightness(85%) contrast(90%)',
                    opacity: 0.75,
                  }}
                />
              </div>

              <p className="garamond-300 text-sm md:text-[15px] text-[#7a6a55] leading-relaxed max-w-xs mx-auto">
                El blanco está reservado para la novia.
                <br />
                Les agradecemos elegir otros colores.
              </p>
            </div>

            {/* ══ ADULTS ONLY BLOCK ══ */}
            <div className={`transition-all duration-[2000ms] ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '1100ms' }}>

              {/* No children badge (above message) */}
              <div
                className={`inline-flex items-center gap-4 mb-6 transition-all duration-[900ms] ease-out ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
                }`}
                style={{ transitionDelay: '1200ms' }}
              >
                <span className="block w-14 h-[1px] bg-[#C4985B]/55" />
                <span className="garamond-regular tracking-[0.3em] text-[15px] md:text-[18px] uppercase text-[#9a6e34] font-semibold drop-shadow-[0_1px_0_rgba(84,60,36,0.18)]">
                  NO NIÑOS
                </span>
                <span className="block w-14 h-[1px] bg-[#C4985B]/55" />
              </div>

              <p className="garamond-regular text-base md:text-[17px] text-[#543c24] leading-relaxed max-w-xs mx-auto">
                Con mucho cariño hemos planeado una velada íntima entre adultos.
                Les pedimos amablemente que este día tan especial sea solo para los grandes.
              </p>
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
                  <circle cx="50" cy="50" r="2" fill="#C4985B" opacity="0.2"/>
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
              <circle cx="32" cy="32" r="18" stroke="#C4985B" strokeWidth="0.5"/>
              <path d="M32,10 Q36,20 32,32 Q28,20 32,10Z" fill="#8B7355" opacity="0.4"/>
              <path d="M32,54 Q28,44 32,32 Q36,44 32,54Z" fill="#8B7355" opacity="0.4"/>
              <path d="M10,32 Q20,28 32,32 Q20,36 10,32Z" fill="#8B7355" opacity="0.4"/>
              <path d="M54,32 Q44,36 32,32 Q44,28 54,32Z" fill="#8B7355" opacity="0.4"/>
              <circle cx="32" cy="32" r="3" fill="#C4985B" opacity="0.3"/>
            </svg>

            <p className="garamond-300 tracking-[0.35em] text-[11px] uppercase text-center mb-2" style={{ color: '#8B7355', opacity: 0.55 }}>
              Imagen
            </p>
            <p className="garamond-300 tracking-[0.2em] text-[10px] uppercase text-center" style={{ color: '#9B8366', opacity: 0.4 }}>
              próximamente
            </p>

            <div className="flex items-center gap-3 mt-7 opacity-35">
              <span className="block w-10 h-[0.5px] bg-[#C4985B]" />
              <span className="block w-1 h-1 rounded-full bg-[#C4985B]" />
              <span className="block w-10 h-[0.5px] bg-[#C4985B]" />
            </div>
          </div>
        </div>

      </div>{/* end ds-two-col */}

      <style jsx>{`
        /* ══ OUTER SECTION already min-h-screen via className ══ */

        /* ══ TWO-COLUMN GRID ══ */
        .ds-two-col {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
        }

        /* Mobile: paper on top, placeholder below */
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

        /* Desktop: 50/50 side-by-side, full viewport height */
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
          /* show the right-edge feather only on desktop */
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
      `}</style>
    </section>
  );
}
