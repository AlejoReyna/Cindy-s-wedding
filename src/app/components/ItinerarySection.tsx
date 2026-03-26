"use client";

import ItineraryItemCard from './ItineraryItemCard';
import { useEffect, useRef, useState, useMemo } from 'react';

interface ItineraryItem {
  time: string;
  displayTime: string;
  title: string;
  description: string;
  location?: string;
}

export default function ItinerarySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lineStyle, setLineStyle] = useState<{ top: string | number; height: string | number }>({
    top: '3rem',
    height: 'calc(100% - 6rem)',
  });
  const [activeIndex, setActiveIndex] = useState(0);

  // ── Track which card is most visible in the viewport ──
  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      let maxVisibility = -1;
      let newActiveIndex = 0;

      cardWrapperRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
        if (visibilityRatio > maxVisibility) {
          maxVisibility = visibilityRatio;
          newActiveIndex = index;
        }
      });

      setActiveIndex(newActiveIndex);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateLine = () => {
      const container = containerRef.current;
      const cards = cardsRef.current;
      if (!container || !cards) return;

      const cardEls = cards.children;
      if (cardEls.length === 0) return;

      const containerTop = container.getBoundingClientRect().top;
      const firstRect = cardEls[0].getBoundingClientRect();
      const lastRect = cardEls[cardEls.length - 1].getBoundingClientRect();

      const firstMidY = firstRect.top + firstRect.height / 2 - containerTop;
      const lastMidY = lastRect.top + lastRect.height / 2 - containerTop;

      setLineStyle({ top: firstMidY, height: lastMidY - firstMidY });
    };

    // Run after a brief delay so cards have rendered
    const timer = setTimeout(updateLine, 100);
    window.addEventListener('resize', updateLine);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateLine);
    };
  }, []);

  // Preserve the current itinerary events while using the previous visual design.
  const itineraryItems: ItineraryItem[] = useMemo(
    () => [
      {
        time: "4:30 PM",
        displayTime: "4:30",
        title: "Misa",
        description: "",
        location: "",
      },
      {
        time: "6:00 PM",
        displayTime: "6:00",
        title: "Cocktail de Bienvenida",
        description: "",
        location: "",
      },
      {
        time: "7:00 PM",
        displayTime: "7:00",
        title: "Ceremonia Civil",
        description: "",
        location: "",
      },
      {
        time: "8:00 PM",
        displayTime: "8:00",
        title: "Recepción",
        description: "",
        location: "",
      },
    ],
    []
  );

  const FloralDecoration = ({ className = "" }) => (
    <svg className={`w-full h-full ${className}`} viewBox="0 0 80 80" fill="none">
      <path
        d="M10,40 Q25,20 40,40 Q55,60 70,40 Q55,20 40,40 Q25,60 10,40"
        stroke="#8B7355"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      <path d="M25,35 Q30,25 35,35 Q30,45 25,35" fill="#9B8366" opacity="0.5" />
      <path d="M45,45 Q50,35 55,45 Q50,55 45,45" fill="#C4985B" opacity="0.4" />
      <circle cx="40" cy="40" r="2.5" fill="#D4A971" opacity="0.6" />
      <circle cx="32" cy="38" r="1" fill="#8B7355" opacity="0.4" />
      <circle cx="48" cy="42" r="1" fill="#8B7355" opacity="0.4" />
    </svg>
  );

  return (
    <section
      className="min-h-screen w-full py-24 px-4 md:px-8 relative transition-all duration-1000 ease-in-out"
      style={{
        background:
          'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-[0.02]" style={{ zIndex: 3 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(196, 152, 91, 0.15) 0%, transparent 60%),
                              radial-gradient(circle at 70% 60%, rgba(139, 115, 85, 0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180, 147, 113, 0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>
        <div
          className="text-center mb-20 transition-all duration-2000 ease-out opacity-100 translate-y-0"
          style={{ transitionDelay: '200ms' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.1em] uppercase mb-8 garamond-300 relative text-[#8B7355]">
            Itinerario
          </h2>
          <div className="w-24 h-px mx-auto mb-6 bg-[#C4985B] opacity-60"></div>
        </div>

        <div className="absolute left-8 top-1/3 w-12 h-12 opacity-20 hidden lg:block">
          <FloralDecoration />
        </div>
        <div className="absolute right-8 top-2/3 w-12 h-12 opacity-20 hidden lg:block">
          <FloralDecoration className="transform rotate-180" />
        </div>

        <div ref={containerRef} className="max-w-4xl mx-auto relative">
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-px transition-all duration-500 opacity-60 hidden md:block"
            style={{ backgroundColor: '#C4985B', top: lineStyle.top, height: lineStyle.height, zIndex: 1 }}
          />
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-px transition-all duration-500 opacity-40 bg-gradient-to-b from-[#C4985B] via-[#8B7355] to-[#C4985B] md:hidden"
            style={{ top: '2rem', height: 'calc(100% - 4rem)', zIndex: 1 }}
          />

          <div className="md:hidden">
            {itineraryItems.map((_, index) => (
              <div
                key={index}
                className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 z-10"
                style={{
                  top: `${3 + index * 24}rem`,
                }}
              >
                <div className="w-full h-full rounded-full border-2 shadow-lg transition-colors duration-500 bg-white border-[#947e63]/60">
                  <div className="absolute inset-1 rounded-full transition-colors duration-500 bg-[#947e63]/40"></div>
                </div>
              </div>
            ))}
          </div>

          <div ref={cardsRef} className="space-y-24 md:space-y-32 relative z-10">
            {itineraryItems.map((item, index) => (
              <div
                key={index}
                ref={(el) => { cardWrapperRefs.current[index] = el; }}
              >
                <ItineraryItemCard item={item} index={index} isActive={index === activeIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .celestial-transition {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes celestial-float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(1deg);
          }
          50% {
            transform: translateY(-12px) rotate(0deg);
          }
          75% {
            transform: translateY(-6px) rotate(-1deg);
          }
        }

        @keyframes fade-celestial {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes sun-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-celestial-float {
          animation: celestial-float 6s ease-in-out infinite;
        }

        .animate-fade-celestial {
          animation: fade-celestial 4s ease-in-out infinite;
        }

        .animate-sun-rotate {
          animation: sun-rotate 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
