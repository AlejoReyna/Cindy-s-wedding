"use client";

import ItineraryItemCard from './ItineraryItemCard';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface ItineraryItem {
  time: string;
  displayTime: string;
  title: string;
  description: string;
  location?: string;
}

export default function ItinerarySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  // Preserve current itinerary events while using the older visual layout.
  const itineraryItems: ItineraryItem[] = useMemo(
    () => [
      {
        time: "4:30 PM",
        displayTime: "4:30",
        title: "Misa",
        description: "",
      },
      {
        time: "6:00 PM",
        displayTime: "6:00",
        title: "Cocktail de Bienvenida",
        description: "",
      },
      {
        time: "7:00 PM",
        displayTime: "7:00",
        title: "Ceremonia Civil",
        description: "",
      },
      {
        time: "8:00 PM",
        displayTime: "8:00",
        title: "Recepción",
        description: "",
      },
    ],
    []
  );

  useEffect(() => {
    setIsClient(true);
    const updateWindowHeight = () => setWindowHeight(window.innerHeight);
    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  }, []);

  const updateScrollProgress = useCallback(() => {
    if (!sectionRef.current || !isClient || windowHeight === 0) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;

    let progress = 0;
    if (sectionTop <= 0 && sectionBottom >= windowHeight) {
      const scrolledDistance = Math.abs(sectionTop);
      const totalScrollableDistance = sectionHeight - windowHeight;
      progress =
        totalScrollableDistance > 0
          ? Math.min(scrolledDistance / totalScrollableDistance, 1)
          : 0;
    } else if (sectionTop <= windowHeight && sectionBottom >= 0) {
      const visibleHeight =
        Math.min(sectionBottom, windowHeight) - Math.max(sectionTop, 0);
      progress = visibleHeight / windowHeight;
    }

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const isVisible =
      sectionTop <= windowHeight * 0.6 && sectionBottom >= windowHeight * 0.25;

    setIsSectionVisible(isVisible);
    setScrollProgress(clampedProgress);
  }, [isClient, windowHeight]);

  useEffect(() => {
    if (!isClient) return;
    const handleScroll = () => updateScrollProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient, updateScrollProgress]);

  useEffect(() => {
    if (!isSectionVisible || revealedCount >= itineraryItems.length) return;
    const timer = setTimeout(() => {
      setRevealedCount((prev) => Math.min(prev + 1, itineraryItems.length));
    }, 180);
    return () => clearTimeout(timer);
  }, [isSectionVisible, revealedCount, itineraryItems.length]);

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
      ref={sectionRef}
      className="min-h-screen w-full py-24 px-4 md:px-8 relative overflow-hidden transition-all duration-1000 ease-in-out"
      style={{
        background:
          'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      <div
        className="absolute celestial-transition animate-celestial-float opacity-100 scale-100"
        style={{
          zIndex: 1,
          top: `${20 + scrollProgress * 40}%`,
          right: `${10 + scrollProgress * 30}%`,
          transform: `translateX(${scrollProgress * 100}px) translateY(${Math.sin(scrollProgress * Math.PI) * 30}px) rotate(${scrollProgress * 360}deg)`,
        }}
      >
        <div className="relative animate-fade-celestial">
          <div className="w-32 h-32 bg-[#d4c4b0] rounded-full opacity-80 relative">
            <div className="absolute inset-0 animate-sun-rotate">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[#d4c4b0] opacity-60"></div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 rotate-180">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[#d4c4b0] opacity-60"></div>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 -rotate-90">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[#d4c4b0] opacity-60"></div>
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 rotate-90">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[#d4c4b0] opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <div className="flex justify-center mb-16">
            <div className="w-24 h-24 md:w-32 md:h-32 relative">
              <Image
                src="/assets/clock.png"
                alt="Reloj decorativo"
                fill
                className="object-contain opacity-80 transition-opacity duration-500 hover:opacity-100"
              />
            </div>
          </div>

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

        <div className="max-w-4xl mx-auto relative">
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-px transition-all duration-500 opacity-60 bg-gradient-to-b from-[#C4985B] via-[#8B7355] to-[#C4985B] hidden md:block"
            style={{ top: '3rem', height: 'calc(100% - 6rem)', zIndex: 1 }}
          />
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-px transition-all duration-500 opacity-40 bg-gradient-to-b from-[#C4985B] via-[#8B7355] to-[#C4985B] md:hidden"
            style={{ top: '2rem', height: 'calc(100% - 4rem)', zIndex: 1 }}
          />

          <div className="space-y-24 md:space-y-32 relative z-10">
            {itineraryItems.map((item, index) => (
              <ItineraryItemCard
                key={index}
                item={item}
                index={index}
                isRevealed={index < revealedCount}
                accentColor="#C4985B"
              />
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
