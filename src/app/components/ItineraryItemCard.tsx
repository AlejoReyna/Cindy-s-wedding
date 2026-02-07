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
          <Image src={church} alt="Misa" width={26} height={26} className={cls} />
        );
      case 'Ceremonia':
        return (
          <Image src={church} alt="Ceremonia" width={26} height={26} className={cls} />
        );
      case 'Ceremonia Civil':
        return (
          <Image
            src={legalDocument}
            alt="Ceremonia Civil"
            width={26}
            height={26}
            className={cls}
          />
        );
      case 'Recepción':
        return (
          <Image
            src={nightClub}
            alt="Recepción"
            width={26}
            height={26}
            className={`${cls} brightness-0`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={cardRef} className="group py-14 md:py-20 px-6 md:px-8 text-center">
      {/* ── Time (hero element) ── */}
      <div className="mb-5 overflow-hidden">
        <div
          className={`transition-all duration-700 ease-out ${
            showTime
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-5 scale-[0.92]'
          }`}
        >
          <span
            className="text-3xl md:text-4xl font-light tracking-[0.12em] garamond-300 transition-colors duration-500 group-hover:opacity-100"
            style={{ color: accentColor, opacity: showTime ? 0.85 : 0 }}
          >
            {item.time}
          </span>
        </div>
      </div>

      {/* ── Accent line (expands from center) ── */}
      <div className="flex justify-center mb-7">
        <div
          className={`h-[1px] transition-all ease-out group-hover:w-14 ${
            showLine ? 'w-10 opacity-100 duration-600' : 'w-0 opacity-0 duration-300'
          }`}
          style={{
            backgroundColor: `${accentColor}55`,
          }}
        />
      </div>

      {/* ── Icon (scales in with soft bounce) ── */}
      <div className="flex justify-center mb-7">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-110 ${
            showIcon ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6]'
          }`}
          style={{
            backgroundColor: CIRCLE_BG[index] || CIRCLE_BG[2],
            transitionTimingFunction: showIcon
              ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // slight overshoot
              : 'ease-out',
          }}
        >
          {getIcon()}
        </div>
      </div>

      {/* ── Title (fades up) ── */}
      <div className="overflow-hidden mb-5">
        <h3
          className={`text-base md:text-lg font-light tracking-[0.3em] uppercase text-[#5c5c5c] garamond-300 transition-all duration-600 ease-out ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {item.title}
        </h3>
      </div>

      {/* ── Location (gentle fade) ── */}
      {item.location && (
        <p
          className={`text-[11px] md:text-xs tracking-[0.08em] font-light max-w-[220px] mx-auto leading-relaxed transition-all duration-500 ease-out ${
            showDetails
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
          style={{ color: `${accentColor}88` }}
        >
          {item.location}
        </p>
      )}

      {/* ── Description (if any) ── */}
      {item.description && item.description.trim() !== '' && (
        <p
          className={`mt-5 text-xs font-light max-w-[200px] mx-auto leading-relaxed transition-all duration-500 ease-out ${
            showDetails ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: `${accentColor}66` }}
        >
          {item.description}
        </p>
      )}
    </div>
  );
}
