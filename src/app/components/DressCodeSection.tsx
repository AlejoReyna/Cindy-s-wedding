"use client"
import { useEffect, useRef, useState } from 'react';

export default function DressCodeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '-20px'
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Elegant leaf sprig — a single delicate branch
  const LeafSprig = ({ className = "", flip = false }: { className?: string; flip?: boolean }) => (
    <svg
      className={className}
      viewBox="0 0 120 24"
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M10,12 Q30,12 60,12 Q90,12 110,12"
        stroke="#C4985B"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <path d="M25,12 Q30,4 35,8 Q32,12 25,12Z" fill="#8B7355" opacity="0.25" />
      <path d="M42,12 Q47,5 52,9 Q49,12 42,12Z" fill="#9B8366" opacity="0.2" />
      <path d="M58,12 Q63,4 68,8 Q65,12 58,12Z" fill="#8B7355" opacity="0.22" />
      <path d="M75,12 Q80,5 85,9 Q82,12 75,12Z" fill="#9B8366" opacity="0.18" />
      <path d="M30,12 Q35,19 40,16 Q37,12 30,12Z" fill="#9B8366" opacity="0.18" />
      <path d="M50,12 Q55,20 60,16 Q57,12 50,12Z" fill="#8B7355" opacity="0.2" />
      <path d="M70,12 Q75,19 80,16 Q77,12 70,12Z" fill="#9B8366" opacity="0.22" />
      <circle cx="92" cy="11" r="1.2" fill="#C4985B" opacity="0.3" />
      <circle cx="97" cy="12.5" r="0.8" fill="#D4A971" opacity="0.25" />
    </svg>
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full py-28 px-6 md:px-8 relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #fbf9f6 0%, #f8f6f3 50%, #fbf9f6 100%)'
      }}
    >
      {/* Very subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(196,152,91,0.04) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-lg mx-auto relative z-10 text-center">

        {/* ── Top ornamental line ── */}
        <div className={`flex items-center justify-center gap-3 mb-14 transition-all duration-[1800ms] ease-out ${
          isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} style={{ transitionDelay: '100ms' }}>
          <span className="block w-16 h-[0.5px] bg-[#C4985B]/40" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#C4985B]/35" />
          <span className="block w-16 h-[0.5px] bg-[#C4985B]/40" />
        </div>

        {/* ── Script accent word ── */}
        <p className={`mrs-saint-delafield-regular text-3xl md:text-4xl text-[#8B7355]/60 mb-2 transition-all duration-[1600ms] ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ transitionDelay: '300ms' }}>
          Nota especial
        </p>

        {/* ── Section title ── */}
        <h2 className={`garamond-300 text-xs md:text-sm tracking-[0.35em] uppercase text-[#5c5c5c] mb-16 transition-all duration-[1600ms] ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ transitionDelay: '500ms' }}>
          para nuestros invitados
        </h2>

        {/* ── Dress Code Block ── */}
        <div className={`mb-16 transition-all duration-[1800ms] ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '700ms' }}>

          {/* Thin gold ring icon */}
          <div className="flex justify-center mb-6">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="18" stroke="#C4985B" strokeWidth="0.7" opacity="0.45" />
              <circle cx="22" cy="22" r="12" stroke="#C4985B" strokeWidth="0.5" opacity="0.3" />
              {/* Small bowtie / formal hint */}
              <path d="M17,22 L22,19 L27,22 L22,25 Z" fill="#8B7355" opacity="0.2" />
            </svg>
          </div>

          <p className="garamond-300 tracking-[0.3em] text-[11px] md:text-xs uppercase text-[#8B7355] mb-5">
            Etiqueta
          </p>
          <p className="garamond-regular text-xl md:text-2xl text-[#543c24] leading-relaxed">
            Formal
          </p>
          <p className="garamond-300 text-sm md:text-base text-[#8B7355]/70 mt-4 leading-relaxed max-w-sm mx-auto">
            El blanco está reservado para la novia.
            <br />
            Les agradecemos elegir otros colores.
          </p>
        </div>

        {/* ── Leaf divider ── */}
        <div className={`flex items-center justify-center mb-16 transition-all duration-[1800ms] ease-out ${
          isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
        }`} style={{ transitionDelay: '1000ms' }}>
          <LeafSprig className="w-28 h-6" />
          <div className="mx-2 w-1 h-1 rounded-full bg-[#C4985B]/30" />
          <LeafSprig className="w-28 h-6" flip />
        </div>

        {/* ── Adults Only Block ── */}
        <div className={`transition-all duration-[2000ms] ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '1200ms' }}>

          {/* Delicate heart icon */}
          <div className="flex justify-center mb-6">
            <svg width="28" height="26" viewBox="0 0 28 26" fill="none">
              <path
                d="M14,24 C14,24 2,16 2,8 C2,4 5,1 9,1 C11.5,1 13.5,2.5 14,4 C14.5,2.5 16.5,1 19,1 C23,1 26,4 26,8 C26,16 14,24 14,24Z"
                stroke="#C4985B"
                strokeWidth="0.8"
                fill="none"
                opacity="0.4"
              />
            </svg>
          </div>

          <p className="garamond-300 tracking-[0.3em] text-[11px] md:text-xs uppercase text-[#8B7355] mb-6">
            Celebración
          </p>

          <p className="garamond-regular text-base md:text-lg text-[#543c24] leading-relaxed max-w-sm mx-auto mb-8">
            Con mucho cariño hemos planeado una velada íntima entre adultos.
          </p>

          <p className="garamond-regular text-base md:text-lg text-[#543c24]/80 leading-relaxed max-w-sm mx-auto mb-10">
            Les pedimos amablemente que este día tan especial sea solo para los grandes.
          </p>

          {/* Understated accent badge */}
          <div className="inline-flex items-center gap-3">
            <span className="block w-8 h-[0.5px] bg-[#C4985B]/30" />
            <span className="garamond-300 tracking-[0.25em] text-[11px] md:text-xs uppercase text-[#C4985B]/70">
              NO NIÑOS
            </span>
            <span className="block w-8 h-[0.5px] bg-[#C4985B]/30" />
          </div>
        </div>

        {/* ── Bottom ornamental line ── */}
        <div className={`flex items-center justify-center gap-3 mt-16 transition-all duration-[1800ms] ease-out ${
          isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} style={{ transitionDelay: '1500ms' }}>
          <span className="block w-16 h-[0.5px] bg-[#C4985B]/40" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#C4985B]/35" />
          <span className="block w-16 h-[0.5px] bg-[#C4985B]/40" />
        </div>

      </div>
    </section>
  );
}
