"use client"
import { useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import ItineraryItemCard from './ItineraryItemCard';

interface ItineraryItem {
  time: string;
  displayTime: string;
  title: string;
  description: string;
  location?: string;
}

// Afternoon → golden-hour → evening accent colors
const TIME_ACCENTS = ['#D4A971', '#C4985B', '#8B7355'];

export default function ItinerarySection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealPhase, setRevealPhase] = useState(0); // 0 = nothing, 1–3 = which cards are revealed

  const itineraryItems: ItineraryItem[] = useMemo(
    () => [
      {
        time: '3:30 PM',
        displayTime: '3:30',
        title: 'Misa',
        description: '',
        location: 'Nombre de ubicación (placeholder)',
      },
      {
        time: '6:30 PM',
        displayTime: '06:30',
        title: 'Ceremonia Civil',
        description: '',
        location: 'Nombre de ubicación (placeholder)',
      },
      {
        time: '7:00 PM',
        displayTime: '07:00',
        title: 'Recepción',
        description: '',
        location: 'Nombre de ubicación (placeholder)',
      },
    ],
    []
  );

  // ── Header fade-in ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setHeaderVisible(true);
        });
      },
      { threshold: 0.2, rootMargin: '-40px' }
    );

    const ref = headerRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, []);

  // ── Grid enters viewport → start the sequential cascade ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && revealPhase === 0) {
            setRevealPhase(1);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    const ref = gridRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [revealPhase]);

  // ── Cascade: advance to next card after the current finishes its choreography ──
  useEffect(() => {
    if (revealPhase === 0 || revealPhase > 3) return;

    // Each card's internal animation takes ~1100ms; wait a bit more before next
    const timer = setTimeout(() => {
      if (revealPhase < 3) setRevealPhase((p) => p + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [revealPhase]);

  // ── Subtle ambient warmth that deepens with each reveal ──
  const ambientOverlay = (() => {
    if (revealPhase >= 3)
      return 'linear-gradient(180deg, rgba(139,115,85,0.03) 0%, rgba(139,115,85,0.07) 100%)';
    if (revealPhase >= 2)
      return 'linear-gradient(180deg, rgba(196,152,91,0.02) 0%, rgba(196,152,91,0.04) 100%)';
    if (revealPhase >= 1)
      return 'linear-gradient(180deg, rgba(212,169,113,0.01) 0%, rgba(212,169,113,0.02) 100%)';
    return 'transparent';
  })();

  return (
    <section
      className="min-h-screen w-full py-24 md:py-32 px-4 md:px-8 relative overflow-hidden"
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

      {/* Ambient warmth overlay — deepens from afternoon to evening */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: ambientOverlay,
          transition: 'background 2s ease-out',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ═══ Header ═══ */}
        <div
          ref={headerRef}
          className={`text-center mb-20 md:mb-28 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Clock asset placeholder */}
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 md:w-24 md:h-24 relative bg-[#ede9e2] rounded-full flex items-center justify-center">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8B7355]/40 garamond-300 select-none">
                Reloj
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase text-[#5c5c5c] mb-6 garamond-300">
            Itinerario
          </h2>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C4985B]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C4985B]/40" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C4985B]/50" />
          </div>
        </div>

        {/* ═══ Events triptych ═══ */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {itineraryItems.map((item, index) => (
            <ItineraryItemCard
              key={index}
              item={item}
              index={index}
              isRevealed={revealPhase >= index + 1}
              accentColor={TIME_ACCENTS[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
