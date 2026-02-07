"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import CountdownTimer from '../../components/CountdownTimer';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const photos = [
    { label: 'FOTO PLACEHOLDER 1' },
    { label: 'FOTO PLACEHOLDER 2' },
    { label: 'FOTO PLACEHOLDER 3' },
    { label: 'FOTO PLACEHOLDER 4' },
    { label: 'FOTO PLACEHOLDER 5' },
    { label: 'FOTO PLACEHOLDER 6' },
    { label: 'FOTO PLACEHOLDER 7' },
  ];

  // Grid area names — each photo maps to a named CSS grid area
  const gridAreaNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  // ── Section observer for header entrance animations ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            setAnimationStep(1);
            setTimeout(() => setAnimationStep(2), 700);
            setTimeout(() => setAnimationStep(3), 1200);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-20px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [isVisible]);

  // ── Quote observer ──
  useEffect(() => {
    const quoteObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !quoteVisible) setQuoteVisible(true);
        });
      },
      { threshold: 0.3, rootMargin: '-50px' }
    );

    const currentQuoteRef = quoteRef.current;
    if (currentQuoteRef) quoteObserver.observe(currentQuoteRef);
    return () => { if (currentQuoteRef) quoteObserver.unobserve(currentQuoteRef); };
  }, [quoteVisible]);

  // ── Staggered photo reveal on scroll ──
  useEffect(() => {
    if (animationStep < 3) return;

    const photoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setTimeout(() => {
              setVisiblePhotos((prev) => new Set([...prev, index]));
            }, index * 120);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-20px' }
    );

    const refs = photoRefs.current;
    refs.forEach((ref) => {
      if (ref) photoObserver.observe(ref);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) photoObserver.unobserve(ref);
      });
    };
  }, [animationStep]);

  // ── Keyboard navigation for lightbox ──
  const closeModal = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft' && selectedImage > 0) setSelectedImage(selectedImage - 1);
      if (e.key === 'ArrowRight' && selectedImage < photos.length - 1) setSelectedImage(selectedImage + 1);
    },
    [selectedImage, photos.length, closeModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openModal = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="min-h-screen w-full py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      {/* Organic texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-[2] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(196, 152, 91, 0.15) 0%, transparent 60%),
                              radial-gradient(circle at 70% 60%, rgba(139, 115, 85, 0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180, 147, 113, 0.1) 0%, transparent 60%),
                              radial-gradient(circle at 20% 70%, rgba(155, 131, 102, 0.08) 0%, transparent 50%),
                              radial-gradient(circle at 80% 30%, rgba(212, 169, 113, 0.1) 0%, transparent 55%)`,
          }}
        />
      </div>

      {/* ═══ Header ═══ */}
      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8 pointer-events-none">
        <div className="text-center mb-16">
          {/* Flowers decoration */}
          <div
            className={`flex justify-center mb-6 transition-all duration-1000 ease-out ${
              animationStep >= 1 ? 'opacity-100 -translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="w-68 h-24 relative">
              <Image
                src="/assets/legal_assets/flowers_s2.png"
                alt="Decorative flowers"
                fill
                className="object-contain"
                style={{
                  filter: 'sepia(20%) saturate(90%) hue-rotate(10deg) brightness(1.05)',
                  opacity: 0.8,
                }}
              />
            </div>
          </div>

          {/* Title */}
          <div className="relative overflow-hidden">
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase text-[#5c5c5c] mb-2 garamond-300 relative transition-all duration-500 ease-out ${
                animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              ¡Nos Casamos!
            </h2>
          </div>

          {/* Countdown */}
          <div
            className={`flex justify-center mt-4 transition-all duration-500 ease-out ${
              animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <CountdownTimer targetDate="2026-08-22T00:00:00" variant="light" />
          </div>
        </div>
      </div>

      {/* ═══ MOSAIC GRID ═══ */}
      <div
        className={`max-w-6xl mx-auto px-4 md:px-8 relative z-10 transition-all duration-1000 ease-out ${
          animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="gallery-mosaic">
          {photos.map((photo, index) => (
            <div
              key={index}
              ref={(el) => {
                photoRefs.current[index] = el;
              }}
              data-index={index}
              className="mosaic-cell group cursor-pointer relative overflow-hidden"
              style={{
                gridArea: gridAreaNames[index],
                opacity: visiblePhotos.has(index) ? 1 : 0,
                transform: visiblePhotos.has(index)
                  ? 'translateY(0) scale(1)'
                  : 'translateY(24px) scale(0.97)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
              onClick={() => openModal(index)}
            >
              {/* Photo container */}
              <div className="relative w-full h-full bg-[#ede9e2] overflow-hidden">
                {/* Placeholder label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#8B7355]/50 text-center px-4 garamond-300 select-none">
                    {photo.label}
                  </span>
                </div>

                {/* Soft inner image zoom on hover */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />

                {/* Hover tint */}
                <div className="absolute inset-0 bg-[#8B7355]/0 group-hover:bg-[#8B7355]/[0.06] transition-colors duration-500" />

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C4985B]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />

                {/* View indicator */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full p-1.5">
                    <svg
                      className="w-3 h-3 text-[#8B7355]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Quote ═══ */}
      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8">
        <div
          ref={quoteRef}
          className={`text-center mt-20 transition-all duration-1000 ease-out pointer-events-none ${
            quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative py-2 px-8">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'none',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'contain',
                filter: 'sepia(60%) saturate(120%) hue-rotate(25deg) brightness(1.1) contrast(1.05)',
                opacity: 0.15,
              }}
            />
            <div className="relative z-10">
              <p className="text-3xl text-stone-700 italic max-w-lg mx-auto garamond-300 leading-relaxed font-medium">
                &ldquo; Frase pendiente &rdquo;
                <br />
                <small>- Autor pendiente</small>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Lightbox Modal ═══ */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2 text-white/30 text-sm tracking-[0.3em] uppercase garamond-300">
            {selectedImage + 1}&thinsp;/&thinsp;{photos.length}
          </div>

          {/* Previous arrow */}
          {selectedImage > 0 && (
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 text-white/30 hover:text-white/80 transition-colors duration-300 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {selectedImage < photos.length - 1 && (
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 text-white/30 hover:text-white/80 transition-colors duration-300 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image display area */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4 md:mx-16 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full bg-[#1a1a1a] flex items-center justify-center rounded-sm">
              <span className="text-white/25 text-sm uppercase tracking-[0.25em] garamond-300">
                {photos[selectedImage].label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Grid Styles ═══ */}
      <style jsx>{`
        /* ── Mobile-first: 2-column mosaic ── */
        .gallery-mosaic {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(6, clamp(120px, 22vw, 180px));
          gap: 6px;
          grid-template-areas:
            'a a'
            'a a'
            'b c'
            'd d'
            'e f'
            'g g';
        }

        /* ── Tablet+: 4-column editorial mosaic ── */
        @media (min-width: 768px) {
          .gallery-mosaic {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(3, 220px);
            gap: 10px;
            grid-template-areas:
              'a a b c'
              'a a d d'
              'e f f g';
          }
        }

        /* ── Desktop: taller cells, more breathing room ── */
        @media (min-width: 1024px) {
          .gallery-mosaic {
            grid-template-rows: repeat(3, 260px);
            gap: 12px;
          }
        }

        .mosaic-cell {
          border-radius: 2px;
        }
      `}</style>
    </section>
  );
}
