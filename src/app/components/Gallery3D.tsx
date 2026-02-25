"use client"
import { useState, useEffect, useRef, useCallback } from 'react';

// ── Polaroid data ──
const polaroids = [
  { label: 'FOTO 1', rotation: -3, caption: '' },
  { label: 'FOTO 2', rotation: 4, caption: '' },
  { label: 'FOTO 3', rotation: -2, caption: '' },
  { label: 'FOTO 4', rotation: 5, caption: '' },
  { label: 'FOTO 5', rotation: -4, caption: '' },
  { label: 'FOTO 6', rotation: 2, caption: '' },
  { label: 'FOTO 7', rotation: -5, caption: '' },
];

// ═══════════════════════════════════════════════════════════════════════
// 3D COVERFLOW GALLERY
// ───────────────────────────────────────────────────────────────────────
// A 3D carousel where the active card is front-and-center, and adjacent
// cards are visible behind it, rotated in perspective. Navigation is
// via left/right arrow buttons (and drag/swipe is preserved).
//
// ANIMATION PRIORITY (same cascade as original):
//   ① Decorative flowers fade in                    (on scroll)
//   ② Date  "22 · 08 · 2026" — letter by letter     (+150ms)
//   ③ Title "¡Nos Casamos!" — letter by letter       (+400ms)
//   ④ Decorative line draws                          (+750ms)
//   ⑤ Subtitle paragraph — word by word              (+850ms)
//   ⑥ Swipe hint fades in                            (+1500ms)
//   ⑦ 3D carousel slides in                          (with ⑥)
// ═══════════════════════════════════════════════════════════════════════

const LETTER_SPEED = 35;
const WORD_SPEED   = 30;

export default function Gallery3D() {
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const borderPathRef = useRef<SVGRectElement>(null);
  const [borderPerimeter, setBorderPerimeter] = useState(0);

  // ── Measure SVG rect perimeter ──
  useEffect(() => {
    const measure = () => {
      const rect = borderPathRef.current;
      if (rect) setBorderPerimeter(rect.getTotalLength());
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ── Sequential animation chain flags ──
  const [flowersVisible, setFlowersVisible] = useState(false);
  const [dateStarted, setDateStarted] = useState(false);
  const [titleStarted, setTitleStarted] = useState(false);
  const [lineDrawn, setLineDrawn] = useState(false);
  const [subtitleStarted, setSubtitleStarted] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  // ── 3D Carousel state ──
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  // ── View mode toggle ──
  const [viewMode, setViewMode] = useState<'polaroid' | 'photo'>('polaroid');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = useCallback(() => {
    if (isSwapping) return;
    setIsSwapping(true);
    setTimeout(() => {
      setViewMode(prev => prev === 'polaroid' ? 'photo' : 'polaroid');
      setTimeout(() => setIsSwapping(false), 400);
    }, 200);
  }, [isSwapping]);

  // ── Text data ──
  const dateText = '22 · 08 · 2026';
  const titleLine1 = '¡Nos';
  const titleLine2 = 'Casamos!';
  const subtitleWords = 'Con inmensa alegría en nuestros corazones, queremos invitarte a celebrar el día en que uniremos nuestras vidas para siempre.'.split(' ');

  // ── Scroll observer → animation cascade ──
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered.current) {
            hasTriggered.current = true;
            setIsVisible(true);
            setFlowersVisible(true);
            after(150,  () => setDateStarted(true));
            after(400,  () => setTitleStarted(true));
            after(750,  () => setLineDrawn(true));
            after(850,  () => setSubtitleStarted(true));
            after(1500, () => { setHintVisible(true); setCardsVisible(true); });
          }
        });
      },
      { threshold: 0.1, rootMargin: '-20px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      timers.forEach(clearTimeout);
    };
  }, []);

  // ── Navigation ──
  const goTo = useCallback((index: number) => {
    if (isAnimating || index < 0 || index >= polaroids.length || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentIndex]);

  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);

  // ── Keyboard navigation ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  // ── Swipe / Drag ──
  const SWIPE_THRESHOLD = 60;

  const handleDragStart = useCallback((clientX: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    dragStartX.current = clientX;
    setDragX(0);
  }, [isAnimating]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setDragX(clientX - dragStartX.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > SWIPE_THRESHOLD && currentIndex > 0) {
      goTo(currentIndex - 1);
    } else if (dragX < -SWIPE_THRESHOLD && currentIndex < polaroids.length - 1) {
      goTo(currentIndex + 1);
    }
    setDragX(0);
  }, [isDragging, dragX, currentIndex, goTo]);

  // ── 3D Card positioning ──
  const getCard3DStyle = (index: number): React.CSSProperties => {
    const offset = index - currentIndex;
    const dragInfluence = isDragging ? dragX * 0.3 : 0;

    // How many cards away from center
    const absOffset = Math.abs(offset);

    if (absOffset > 3) return { display: 'none' };

    // Center card
    if (offset === 0) {
      return {
        transform: `
          perspective(1200px)
          translateX(${dragInfluence}px)
          translateZ(0px)
          rotateY(${isDragging ? dragX * -0.05 : 0}deg)
          scale(1)
        `,
        zIndex: 10,
        opacity: 1,
        transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        filter: 'brightness(1)',
      };
    }

    // Side cards — 3D perspective with rotation
    const direction = offset > 0 ? 1 : -1;
    const translateX = direction * absOffset * 160 + dragInfluence;
    const translateZ = -absOffset * 120;
    const rotateY = direction * -45;
    const scale = Math.max(0.65, 1 - absOffset * 0.12);
    const opacity = Math.max(0.3, 1 - absOffset * 0.25);

    return {
      transform: `
        perspective(1200px)
        translateX(${translateX}px)
        translateZ(${translateZ}px)
        rotateY(${rotateY}deg)
        scale(${scale})
      `,
      zIndex: 10 - absOffset,
      opacity,
      transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      filter: `brightness(${1 - absOffset * 0.08})`,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="min-h-screen w-full relative overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      {/* ═══ Border frame ═══ */}
      <div className="gl3d-border-frame pointer-events-none" aria-hidden="true">
        <svg
          className={`gl3d-border-svg ${isVisible && borderPerimeter > 0 ? 'gl3d-border-svg--draw' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ ['--perim' as string]: borderPerimeter } as React.CSSProperties}
        >
          <rect
            ref={borderPathRef}
            className="gl3d-border-path"
            x="1" y="1"
            width="calc(100% - 2px)" height="calc(100% - 2px)"
            rx="0" ry="0"
            fill="none"
            stroke="rgba(196,152,91,0.28)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Organic texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(196, 152, 91, 0.15) 0%, transparent 60%),
                              radial-gradient(circle at 70% 60%, rgba(139, 115, 85, 0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180, 147, 113, 0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* ═══ Main Layout ═══ */}
      <div className="w-full max-w-[1400px] mx-auto relative z-10 px-6 md:px-10 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

          {/* ── LEFT: Text Section (identical cascade) ── */}
          <div className="w-full lg:w-[32%] flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">

            {/* ① Decorative flowers */}
            <div
              className={`mb-6 transition-all duration-500 ease-out ${
                flowersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <div className="w-56 h-20 relative mx-auto lg:mx-0 bg-[#ede9e2] rounded-sm flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.25em] text-[#8B7355]/40 garamond-300 select-none">
                  Flores decorativas
                </span>
              </div>
            </div>

            {/* ② Date */}
            <div className="mb-4">
              <p className="gl3d-date-text">
                {dateText.split('').map((char, i) => (
                  <span
                    key={`d-${i}`}
                    className={`gl3d-letter${dateStarted ? ' gl3d-letter--animated' : ''}`}
                    style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </p>
            </div>

            {/* ③ Title */}
            <div className="mb-6">
              <h2 className="gl3d-title-text">
                {titleLine1.split('').map((char, i) => (
                  <span
                    key={`t1-${i}`}
                    className={`gl3d-letter${titleStarted ? ' gl3d-letter--animated' : ''}`}
                    style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                  >
                    {char}
                  </span>
                ))}
                <br />
                {titleLine2.split('').map((char, i) => (
                  <span
                    key={`t2-${i}`}
                    className={`gl3d-letter${titleStarted ? ' gl3d-letter--animated' : ''}`}
                    style={{ animationDelay: `${(titleLine1.length + i) * LETTER_SPEED}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </h2>
            </div>

            {/* ④ Decorative line */}
            <div
              className={`transition-all duration-[900ms] ease-out ${
                lineDrawn ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
              style={{ transformOrigin: 'center center' }}
            >
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C4985B] to-transparent mb-6 mx-auto lg:mx-0" />
            </div>

            {/* ⑤ Subtitle */}
            <div className="max-w-sm">
              <p className="gl3d-subtitle-text">
                {subtitleWords.map((word, i) => (
                  <span key={`w-${i}`}>
                    <span
                      className={`gl3d-word${subtitleStarted ? ' gl3d-word--animated' : ''}`}
                      style={{ animationDelay: `${i * WORD_SPEED}ms` }}
                    >
                      {word}
                    </span>
                    {i < subtitleWords.length - 1 && ' '}
                  </span>
                ))}
              </p>
            </div>

            {/* ⑥ Navigation hint */}
            <div
              className={`mt-8 flex items-center gap-2 transition-all duration-[800ms] ${
                hintVisible ? 'opacity-60' : 'opacity-0'
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355]/50 garamond-300">
                Explora las fotos
              </span>
              <svg className="w-4 h-4 text-[#8B7355]/40 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>

          {/* ── RIGHT: 3D Coverflow Carousel ── */}
          <div
            className={`w-full lg:w-[68%] flex flex-col items-center relative transition-all duration-1000 ease-out ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* 3D Stage */}
            <div
              className="gl3d-stage relative select-none"
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => { if (isDragging) { e.preventDefault(); handleDragMove(e.clientX); } }}
              onMouseUp={handleDragEnd}
              onMouseLeave={() => { if (isDragging) handleDragEnd(); }}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              {/* Reflection surface gradient */}
              <div className="gl3d-reflection" aria-hidden="true" />

              {/* Cards */}
              <div className={`gl3d-cards-container ${isSwapping ? 'gl3d-cards--swapping' : ''}`}>
                {polaroids.map((polaroid, index) => (
                  <div
                    key={index}
                    className="gl3d-card"
                    style={getCard3DStyle(index)}
                    onClick={() => {
                      if (index !== currentIndex && !isDragging) goTo(index);
                    }}
                  >
                    {viewMode === 'polaroid' ? (
                      /* ── Polaroid frame ── */
                      <div className="gl3d-polaroid">
                        <div className="gl3d-polaroid-image">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm md:text-base uppercase tracking-[0.25em] text-[#8B7355]/30 garamond-300 select-none">
                              {polaroid.label}
                            </span>
                          </div>
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.05)' }}
                          />
                        </div>
                        <div className="gl3d-polaroid-caption">
                          <p className="text-[10px] md:text-xs text-[#8B7355]/40 garamond-300 tracking-[0.2em] uppercase italic">
                            {polaroid.caption || '\u00A0'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* ── Clean photo (no frame) ── */
                      <div className="gl3d-photo">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm md:text-base uppercase tracking-[0.25em] text-white/40 garamond-300 select-none drop-shadow-sm">
                            {polaroid.label}
                          </span>
                        </div>
                        <div
                          className="absolute inset-0 pointer-events-none rounded-lg"
                          style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.08)' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ═══ Navigation Arrows ═══ */}
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="gl3d-nav-btn gl3d-nav-btn--left"
                aria-label="Foto anterior"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                disabled={currentIndex === polaroids.length - 1}
                className="gl3d-nav-btn gl3d-nav-btn--right"
                aria-label="Foto siguiente"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* ═══ Swap Button + Dot indicators row ═══ */}
            <div className="flex items-center justify-center gap-6 mt-8">
              {/* Dots */}
              <div className="flex items-center gap-3">
                {polaroids.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`gl3d-dot ${i === currentIndex ? 'gl3d-dot--active' : ''}`}
                    aria-label={`Ir a foto ${i + 1}`}
                  />
                ))}
              </div>

              {/* Swap button */}
              <button
                onClick={handleSwap}
                className={`gl3d-swap-btn ${isSwapping ? 'gl3d-swap-btn--active' : ''}`}
                aria-label={viewMode === 'polaroid' ? 'Cambiar a vista foto' : 'Cambiar a vista polaroid'}
                title={viewMode === 'polaroid' ? 'Vista foto' : 'Vista polaroid'}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''}`}
                >
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="gl3d-swap-label">
                  {viewMode === 'polaroid' ? 'Foto' : 'Polaroid'}
                </span>
              </button>
            </div>

            {/* Counter */}
            <p className="text-center mt-3 text-[10px] tracking-[0.3em] uppercase text-[#8B7355]/40 garamond-300">
              {currentIndex + 1}&thinsp;/&thinsp;{polaroids.length}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
           3D GALLERY STYLES
           ═══════════════════════════════════════════════════════════════ */}
      <style jsx>{`

        /* ── Typography (same as original) ── */
        .gl3d-date-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 400;
          font-size: 14px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: #C4985B;
        }
        .gl3d-title-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: 2.25rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #5c5c5c;
          line-height: 1.1;
        }
        .gl3d-subtitle-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1rem;
          color: #8B7355;
          line-height: 1.7;
        }

        @media (min-width: 640px) {
          .gl3d-date-text { font-size: 15px; }
          .gl3d-title-text { font-size: 2.8rem; }
          .gl3d-subtitle-text { font-size: 1.05rem; }
        }
        @media (min-width: 768px) {
          .gl3d-date-text { font-size: 16px; }
          .gl3d-title-text { font-size: 3.4rem; }
          .gl3d-subtitle-text { font-size: 1.125rem; }
        }

        /* ═══ LETTER / WORD WRITING ANIMATIONS ═══ */
        .gl3d-letter {
          display: inline-block;
          opacity: 0;
        }
        .gl3d-letter--animated {
          animation: gl3dLetterWrite 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes gl3dLetterWrite {
          0%   { opacity: 0; transform: translateY(10px) scaleX(0.4); filter: blur(2px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }

        .gl3d-word {
          display: inline-block;
          opacity: 0;
        }
        .gl3d-word--animated {
          animation: gl3dWordWrite 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes gl3dWordWrite {
          0%   { opacity: 0; transform: translateY(8px) scaleX(0.6); filter: blur(1.5px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }

        /* ═══ BORDER FRAME ═══ */
        .gl3d-border-frame {
          position: absolute;
          top: 20px; left: 20px; right: 20px; bottom: 20px;
          z-index: 2;
        }
        @media (min-width: 640px) {
          .gl3d-border-frame { top: 28px; left: 28px; right: 28px; bottom: 28px; }
        }
        @media (min-width: 768px) {
          .gl3d-border-frame { top: 36px; left: 36px; right: 36px; bottom: 36px; }
        }

        .gl3d-border-svg {
          display: block; width: 100%; height: 100%; overflow: visible;
        }
        .gl3d-border-path {
          stroke-dasharray: var(--perim);
          stroke-dashoffset: var(--perim);
          opacity: 0;
        }
        .gl3d-border-svg--draw .gl3d-border-path {
          animation: gl3dDrawBorder 1.8s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          animation-delay: 0.15s;
        }
        @keyframes gl3dDrawBorder {
          0%   { stroke-dashoffset: var(--perim); opacity: 0; }
          3%   { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        /* ═══ 3D CAROUSEL STAGE ═══ */
        .gl3d-stage {
          width: 100%;
          max-width: 700px;
          height: clamp(420px, 58vw, 680px);
          position: relative;
          perspective: 1200px;
          cursor: grab;
        }
        .gl3d-stage:active {
          cursor: grabbing;
        }

        .gl3d-reflection {
          position: absolute;
          bottom: -2px;
          left: 10%;
          right: 10%;
          height: 60px;
          background: linear-gradient(
            to bottom,
            rgba(196, 152, 91, 0.04) 0%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(20px);
          pointer-events: none;
        }

        .gl3d-cards-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .gl3d-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(260px, 38vw, 420px);
          height: clamp(340px, 50vw, 560px);
          margin-left: calc(clamp(260px, 38vw, 420px) / -2);
          margin-top: calc(clamp(340px, 50vw, 560px) / -2);
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* ── Polaroid card inner ── */
        .gl3d-polaroid {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 3px;
          padding: 8px 8px clamp(36px, 5.5vw, 56px) 8px;
          box-shadow:
            0 15px 50px rgba(0, 0, 0, 0.15),
            0 5px 15px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }

        .gl3d-polaroid-image {
          position: relative;
          flex: 1;
          background: #ede9e2;
          overflow: hidden;
        }

        .gl3d-polaroid-caption {
          display: flex;
          align-items: center;
          justify-content: center;
          height: clamp(28px, 4.5vw, 48px);
        }

        /* ── Clean photo card (no frame) ── */
        .gl3d-photo {
          width: 100%;
          height: 100%;
          position: relative;
          background: #d5cfc6;
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.2),
            0 8px 20px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.04);
        }

        /* ── Swap transition ── */
        .gl3d-cards--swapping {
          animation: gl3dSwapPulse 0.6s ease;
        }
        @keyframes gl3dSwapPulse {
          0%   { opacity: 1; transform: scale(1); }
          30%  { opacity: 0.4; transform: scale(0.97); }
          60%  { opacity: 0.4; transform: scale(0.97); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* ═══ SWAP BUTTON ═══ */
        .gl3d-swap-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(196, 152, 91, 0.3);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          color: #8B7355;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }
        .gl3d-swap-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(196, 152, 91, 0.55);
          box-shadow: 0 4px 18px rgba(196, 152, 91, 0.12);
          transform: scale(1.04);
        }
        .gl3d-swap-btn:active {
          transform: scale(0.96);
        }
        .gl3d-swap-btn--active {
          border-color: rgba(196, 152, 91, 0.6);
          background: rgba(196, 152, 91, 0.08);
        }
        .gl3d-swap-label {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        /* ═══ NAVIGATION BUTTONS ═══ */
        .gl3d-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(196, 152, 91, 0.35);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          color: #8B7355;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }
        .gl3d-nav-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(196, 152, 91, 0.6);
          box-shadow: 0 4px 20px rgba(196, 152, 91, 0.15);
          transform: translateY(-50%) scale(1.08);
        }
        .gl3d-nav-btn:active:not(:disabled) {
          transform: translateY(-50%) scale(0.95);
        }
        .gl3d-nav-btn:disabled {
          opacity: 0.25;
          cursor: default;
        }
        .gl3d-nav-btn--left {
          left: -6px;
        }
        .gl3d-nav-btn--right {
          right: -6px;
        }

        @media (min-width: 768px) {
          .gl3d-nav-btn {
            width: 50px;
            height: 50px;
          }
          .gl3d-nav-btn--left { left: -12px; }
          .gl3d-nav-btn--right { right: -12px; }
        }

        /* ═══ DOT INDICATORS ═══ */
        .gl3d-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(196, 152, 91, 0.25);
          border: none;
          cursor: pointer;
          transition: all 0.35s ease;
          padding: 0;
        }
        .gl3d-dot:hover {
          background: rgba(196, 152, 91, 0.5);
          transform: scale(1.3);
        }
        .gl3d-dot--active {
          background: rgba(196, 152, 91, 0.7);
          width: 20px;
          border-radius: 10px;
        }

        /* ── Scrollbar hide ── */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
