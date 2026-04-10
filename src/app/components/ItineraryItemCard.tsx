"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import church from '../../../assets/church.png';
import legalDocument from '../../../assets/legal-document.png';
import nightClub from '../../../assets/night-club.png';

interface ItineraryItem {
  time: string;
  displayTime: string;
  title: string;
  description: string;
  location?: string;
}

interface ItineraryItemCardProps {
  item: ItineraryItem;
  index: number;
  isRevealed?: boolean;
  accentColor?: string;
  isActive?: boolean;
}


export default function ItineraryItemCard({
  item,
  index,
  isRevealed = true,
  accentColor = '#C4985B',
  isActive = false,
}: ItineraryItemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [animating, setAnimating] = useState(false);
  const isLeftSide = index % 2 === 0;

  // Internal choreography states
  const [showTime, setShowTime] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // ── Self-observe for viewport entry (important for mobile) ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsInView(true);
        });
      },
      { threshold: 0.2, rootMargin: '-30px' }
    );

    const ref = cardRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, []);

  // ── Start animation when BOTH parent says "go" AND card is in viewport ──
  // On desktop: both are true near-simultaneously (all 3 columns visible)
  // On mobile: isRevealed fires from parent cascade, but waits for scroll into view
  useEffect(() => {
    if (isRevealed && isInView && !animating) {
      setAnimating(true);
    }
  }, [isRevealed, isInView, animating]);

  // ── Internal choreographed sequence ──
  useEffect(() => {
    if (!animating) return;

    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setShowTime(true), 0));
    timers.push(setTimeout(() => setShowLine(true), 350));
    timers.push(setTimeout(() => setShowIcon(true), 550));
    timers.push(setTimeout(() => setShowTitle(true), 800));
    timers.push(setTimeout(() => setShowDetails(true), 1050));

    return () => timers.forEach(clearTimeout);
  }, [animating]);

  const getIcon = () => {
    const cls =
      'opacity-60 group-hover:opacity-90 transition-opacity duration-500';
    switch (item.title) {
      case 'Misa':
        return (
          <Image src={church} alt="Misa" width={72} height={72} className={cls} />
        );
      case 'Ceremonia':
        return (
          <Image src={church} alt="Ceremonia" width={72} height={72} className={cls} />
        );
      case 'Ceremonia Civil':
        return (
          <Image
            src={legalDocument}
            alt="Ceremonia Civil"
            width={44}
            height={44}
            className={cls}
          />
        );
      case 'Cocktail de Bienvenida':
        return (
          <Image
            src={nightClub}
            alt="Cocktail de Bienvenida"
            width={44}
            height={44}
            className={cls}
          />
        );
      case 'Recepción':
        return (
          <Image
            src={nightClub}
            alt="Recepción"
            width={44}
            height={44}
            className={`${cls} brightness-0`}
          />
        );
      default:
        return null;
    }
  };

  // Unified color palette
  const cardColor = '#7a6a5a';
  const cardColorLight = '#7a6a5a99';
  const accent = accentColor;

  return (
    <div ref={cardRef} className="group relative px-2 md:px-0">

      {/* ── Desktop: horizontal connector line at midpoint of card height ── */}
      {/* md gap: wrapper(2.5rem) + pr-10(2.5rem) = 5rem | lg gap: wrapper(2.5rem) + pr-14(3.5rem) = 6rem */}
      <div
        className={`absolute hidden md:block pointer-events-none top-1/2 -translate-y-1/2 h-px transition-opacity duration-700 ease-out ${
          animating ? 'opacity-60' : 'opacity-0'
        } ${
          isLeftSide
            ? 'left-[calc(50%_-_5rem)] w-20 lg:left-[calc(50%_-_6rem)] lg:w-24'
            : 'left-1/2 w-20 lg:w-24'
        }`}
        style={{
          backgroundColor: '#C4985B',
          zIndex: 2,
        }}
      />

      {/* ── Desktop: dot at the junction with the vertical bar ── */}
      <div
        className={`absolute hidden md:block pointer-events-none rounded-full transition-opacity duration-700 ease-out ${
          animating ? 'opacity-70' : 'opacity-0'
        }`}
        style={{
          left: 'calc(50% - 3px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '6px',
          backgroundColor: '#C4985B',
          zIndex: 3,
        }}
      />

      <div
        className={`w-full max-w-[420px] mx-auto md:max-w-none md:w-[calc(50%-2.5rem)] transition-transform duration-500 ${
          isActive ? 'scale-[1.02] md:scale-[1.3]' : 'scale-100'
        } ${isLeftSide ? 'md:mr-auto md:pr-10 lg:pr-14' : 'md:ml-auto md:pl-10 lg:pl-14'}`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: isActive ? 20 : 1,
          position: 'relative',
        }}
      >
        {/* ── Elegant card container ── */}
        <div
          className={`relative flex flex-col rounded-none text-center h-[300px] sm:h-[330px] md:h-[380px] transition-all duration-1000 ease-out ${
            animating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(196,152,91,0.12)',
            boxShadow: '0 2px 20px rgba(139,115,85,0.04), 0 1px 4px rgba(139,115,85,0.02)',
          }}
        >
          {/* Corner accents — delicate L-shapes */}
          <div
            className="absolute top-4 left-4 w-6 h-6 pointer-events-none"
            style={{
              borderTop: '1px solid rgba(196,152,91,0.25)',
              borderLeft: '1px solid rgba(196,152,91,0.25)',
            }}
          />
          <div
            className="absolute top-4 right-4 w-6 h-6 pointer-events-none"
            style={{
              borderTop: '1px solid rgba(196,152,91,0.25)',
              borderRight: '1px solid rgba(196,152,91,0.25)',
            }}
          />
          <div
            className="absolute bottom-4 left-4 w-6 h-6 pointer-events-none"
            style={{
              borderBottom: '1px solid rgba(196,152,91,0.25)',
              borderLeft: '1px solid rgba(196,152,91,0.25)',
            }}
          />
          <div
            className="absolute bottom-4 right-4 w-6 h-6 pointer-events-none"
            style={{
              borderBottom: '1px solid rgba(196,152,91,0.25)',
              borderRight: '1px solid rgba(196,152,91,0.25)',
            }}
          />

          {/* ── Top half — Icon (sin círculo) ── */}
          <div
            className="flex items-center justify-center"
            style={{ height: '50%', paddingTop: '1.1rem', paddingBottom: '0.6rem', paddingLeft: '1.2rem', paddingRight: '1.2rem' }}
          >
            <div
              className={`transition-all duration-700 scale-90 sm:scale-100 group-hover:scale-100 sm:group-hover:scale-110 ${
                showIcon ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6]'
              }`}
              style={{
                transitionTimingFunction: showIcon
                  ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'ease-out',
              }}
            >
              {getIcon()}
            </div>
          </div>

          {/* ── Divisor central ── */}
          <div
            className="w-full h-px mx-auto opacity-10 pointer-events-none"
            style={{ backgroundColor: accent }}
          />

          {/* ── Bottom half — Texto ── */}
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: '50%', paddingTop: '0.7rem', paddingBottom: '1.2rem', paddingLeft: '1.1rem', paddingRight: '1.1rem' }}
          >
            {/* ── Title (fades up) ── */}
            <div className="overflow-hidden mb-3 sm:mb-4">
              <h3
                className={`text-base sm:text-lg md:text-xl font-light tracking-[0.22em] sm:tracking-[0.3em] uppercase garamond-300 transition-all duration-600 ease-out ${
                  showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ color: cardColor }}
              >
                {item.title}
              </h3>
            </div>

            {/* ── Accent line (expands from center) ── */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div
                className={`h-[1px] transition-all ease-out group-hover:w-16 ${
                  showLine ? 'w-12 opacity-100 duration-600' : 'w-0 opacity-0 duration-300'
                }`}
                style={{
                  backgroundColor: accent,
                  opacity: 0.35,
                }}
              />
            </div>

            {/* ── Time ── */}
            <div className="overflow-hidden">
              <div
                className={`transition-all duration-700 ease-out ${
                  showTime
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-5 scale-[0.92]'
                }`}
              >
                <span
                  className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.12em] sm:tracking-[0.15em] garamond-300 transition-all duration-500 group-hover:opacity-100"
                  style={{ color: cardColor, opacity: showTime ? 0.8 : 0 }}
                >
                  {item.time}
                </span>
              </div>
            </div>

            {/* ── Location (gentle fade) ── */}
            {item.location && (
              <p
                className={`mt-3 text-xs md:text-sm tracking-[0.08em] font-light max-w-[260px] mx-auto leading-relaxed transition-all duration-500 ease-out ${
                  showDetails
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                }`}
                style={{ color: cardColorLight }}
              >
                {item.location}
              </p>
            )}

            {/* ── Description (if any) ── */}
            {item.description && item.description.trim() !== '' && (
              <p
                className={`mt-3 text-sm font-light max-w-[240px] mx-auto leading-relaxed transition-all duration-500 ease-out ${
                  showDetails ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ color: cardColorLight }}
              >
                {item.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
