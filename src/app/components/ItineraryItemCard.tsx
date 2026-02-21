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
  isRevealed: boolean;
  accentColor: string;
}

// Progressively deeper circle backgrounds (afternoon → evening)
const CIRCLE_BG = [
  'rgba(245,238,223,0.9)', // warm gold
  'rgba(242,232,227,0.9)', // amber
  'rgba(234,229,223,0.9)', // deep warm
];

export default function ItineraryItemCard({
  item,
  index,
  isRevealed,
  accentColor,
}: ItineraryItemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [animating, setAnimating] = useState(false);

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
          <Image src={church} alt="Misa" width={32} height={32} className={cls} />
        );
      case 'Ceremonia':
        return (
          <Image src={church} alt="Ceremonia" width={32} height={32} className={cls} />
        );
      case 'Ceremonia Civil':
        return (
          <Image
            src={legalDocument}
            alt="Ceremonia Civil"
            width={32}
            height={32}
            className={cls}
          />
        );
      case 'Recepción':
        return (
          <Image
            src={nightClub}
            alt="Recepción"
            width={32}
            height={32}
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
  const accent = accentColor || '#C4985B';

  return (
    <div ref={cardRef} className="group px-2 md:px-3 text-center">
      {/* ── Elegant card container ── */}
      <div
        className={`relative py-16 md:py-24 px-8 md:px-10 rounded-none transition-all duration-1000 ease-out ${
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

        {/* ── Icon (scales in with soft bounce) ── */}
        <div className="flex justify-center mb-8">
          <div
            className={`w-18 h-18 rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110 ${
              showIcon ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6]'
            }`}
            style={{
              width: '4.5rem',
              height: '4.5rem',
              backgroundColor: CIRCLE_BG[index] || CIRCLE_BG[2],
              transitionTimingFunction: showIcon
                ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'ease-out',
            }}
          >
            {getIcon()}
          </div>
        </div>

        {/* ── Title (fades up) ── */}
        <div className="overflow-hidden mb-5">
          <h3
            className={`text-lg md:text-xl font-light tracking-[0.3em] uppercase garamond-300 transition-all duration-600 ease-out ${
              showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ color: cardColor }}
          >
            {item.title}
          </h3>
        </div>

        {/* ── Accent line (expands from center) ── */}
        <div className="flex justify-center mb-6">
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
        <div className="mb-5 overflow-hidden">
          <div
            className={`transition-all duration-700 ease-out ${
              showTime
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-5 scale-[0.92]'
            }`}
          >
            <span
              className="text-3xl md:text-4xl font-light tracking-[0.15em] garamond-300 transition-all duration-500 group-hover:opacity-100"
              style={{ color: cardColor, opacity: showTime ? 0.8 : 0 }}
            >
              {item.time}
            </span>
          </div>
        </div>

        {/* ── Location (gentle fade) ── */}
        {item.location && (
          <p
            className={`text-xs md:text-sm tracking-[0.08em] font-light max-w-[260px] mx-auto leading-relaxed transition-all duration-500 ease-out ${
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
            className={`mt-5 text-sm font-light max-w-[240px] mx-auto leading-relaxed transition-all duration-500 ease-out ${
              showDetails ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ color: cardColorLight }}
          >
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
