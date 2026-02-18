"use client"
import { useEffect, useRef, useState } from 'react';
import MessageSection from './MessageSection';
import { useStatusBarSection } from '../../hooks/useStatusBarManager';
import { useTheme } from '../context/ThemeContext';

export default function RSVPSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { isNightMode } = useTheme();

  const rsvpSectionRef = useStatusBarSection({
    sectionId: 'rsvp',
    color: '#4c4c48',
    defaultColor: isNightMode ? '#000000' : '#ffffff',
    isNightMode
  });

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

  // WhatsApp icon
  const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity="0.9">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  // Calendar icon
  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );

  const addToCalendar = () => {
    const title = encodeURIComponent('Boda Cindy & Alexis');
    const date = '20251004'; // Placeholder — adjust to real date
    const details = encodeURIComponent('Celebración de boda');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}T170000/${date}T235900&details=${details}`;
    window.open(url, '_blank');
  };

  return (
    <section
      ref={(el) => {
        sectionRef.current = el as HTMLDivElement;
        if (rsvpSectionRef) {
          (rsvpSectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }
      }}
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center py-16 md:py-24"
      style={{
        backgroundImage: `url('/hands.JPG')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay — slightly lighter to let the glass panels pop (figure-ground) */}
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.22) 100%)'
        }}
      />

      {/* ═══════════════════════════════════════════════
          Gestalt: single centered column — continuity & proximity
          The eye flows naturally top → bottom through the glass panels
          ═══════════════════════════════════════════════ */}
      <div className="max-w-lg mx-auto relative z-10 px-5 w-full flex flex-col items-center gap-10 md:gap-14">

        {/* ── Header ── */}
        <div className="text-center">

          {/* Top ornamental line */}
          <div className={`flex items-center justify-center gap-3 mb-8 transition-all duration-[1800ms] ease-out ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`} style={{ transitionDelay: '100ms' }}>
            <span className="block w-16 h-[0.5px] bg-white/30" />
            <span className="block w-1.5 h-1.5 rounded-full bg-white/25" />
            <span className="block w-16 h-[0.5px] bg-white/30" />
          </div>

          {/* Script accent */}
          <p className={`mrs-saint-delafield-regular text-3xl md:text-4xl text-white/80 mb-2 transition-all duration-[1600ms] ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ transitionDelay: '250ms' }}>
            Confirma
          </p>

          {/* Section title */}
          <h2 className={`garamond-300 text-xs md:text-sm tracking-[0.35em] uppercase text-white/90 mb-6 transition-all duration-[1600ms] ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ transitionDelay: '400ms' }}>
            tu asistencia
          </h2>

          {/* Welcome message */}
          <p className={`garamond-regular text-base md:text-lg text-white/85 leading-relaxed max-w-md mx-auto transition-all duration-[1800ms] ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '550ms' }}>
            Para nosotros es muy importante tu presencia, es por eso que te pedimos confirmar tu asistencia antes del 15 de septiembre.
          </p>
        </div>

        {/* ── Glass Panel 1: RSVP Actions ──
            Gestalt "common region" — buttons grouped inside a shared glass surface */}
        <div className={`w-full transition-all duration-[1800ms] ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '750ms' }}>
          <div className="liquid-glass px-6 py-8 md:px-8 md:py-10 text-center">

            <p className="garamond-regular text-lg md:text-xl text-white/90 mb-8">
              ¡Te esperamos!
            </p>

            {/* Gestalt "similarity" — both buttons share the same glass style */}
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button
                className="liquid-glass-btn group inline-flex items-center justify-center gap-3 px-6 py-4 text-white garamond-300 tracking-[0.15em] uppercase text-xs"
                onClick={() => {
                  window.open('https://wa.me/0000000000?text=Confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Cindy%20%26%20Alexis.%0ALos%20nombres%20confirmados%20en%20esta%20invitaci%C3%B3n%20son%3A%20____________', '_blank');
                }}
              >
                <WhatsAppIcon />
                <span>Confirmar por WhatsApp</span>
              </button>

              <button
                className="liquid-glass-btn group inline-flex items-center justify-center gap-3 px-6 py-4 text-white garamond-300 tracking-[0.15em] uppercase text-xs"
                onClick={addToCalendar}
              >
                <CalendarIcon />
                <span>Agendar en Calendario</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Ornamental divider — Gestalt "continuity" guides the eye downward ── */}
        <div className={`flex items-center justify-center gap-4 transition-all duration-[1800ms] ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`} style={{ transitionDelay: '900ms' }}>
          <span className="block w-10 h-[0.5px] bg-white/20" />
          <span className="garamond-300 text-[11px] tracking-[0.25em] text-white/25 uppercase">&</span>
          <span className="block w-10 h-[0.5px] bg-white/20" />
        </div>

        {/* ── Glass Panel 2: Message Form ──
            Second "common region" — form lives in its own glass surface */}
        <div className={`w-full transition-all duration-[2000ms] ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '1000ms' }}>
          <div className="liquid-glass px-6 py-8 md:px-8 md:py-10">
            <MessageSection />
          </div>
        </div>

        {/* ── Bottom ornamental line ── */}
        <div className={`flex items-center justify-center gap-3 transition-all duration-[1800ms] ease-out ${
          isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`} style={{ transitionDelay: '1300ms' }}>
          <span className="block w-16 h-[0.5px] bg-white/30" />
          <span className="block w-1.5 h-1.5 rounded-full bg-white/25" />
          <span className="block w-16 h-[0.5px] bg-white/30" />
        </div>

      </div>
    </section>
  );
}
