"use client"
import { useState, useEffect, useRef, useCallback } from 'react';

// ── Photo data ──
const photos = [
  { label: 'FOTO 1', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop' },
  { label: 'FOTO 2', src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=600&fit=crop' },
  { label: 'FOTO 3', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=600&fit=crop' },
  { label: 'FOTO 4', src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=600&fit=crop' },
  { label: 'FOTO 5', src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&h=600&fit=crop' },
  { label: 'FOTO 6', src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&h=600&fit=crop' },
  { label: 'FOTO 7', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=600&fit=crop' },
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
  const [cardsVisible, setCardsVisible] = useState(false);

  // ── 3D Carousel state ──
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

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
            after(1500, () => setCardsVisible(true));
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

  // ── Helper: wrap index for infinite loop ──
  const wrap = useCallback((i: number) => ((i % photos.length) + photos.length) % photos.length, []);

  // ── Navigation (circular) ──
  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    const wrapped = wrap(index);
    if (wrapped === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(wrapped);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentIndex, wrap]);

  const goPrev = useCallback(() => goTo(wrap(currentIndex - 1)), [goTo, currentIndex, wrap]);
  const goNext = useCallback(() => goTo(wrap(currentIndex + 1)), [goTo, currentIndex, wrap]);

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
    if (dragX > SWIPE_THRESHOLD) {
      goPrev();
    } else if (dragX < -SWIPE_THRESHOLD) {
      goNext();
    }
    setDragX(0);
  }, [isDragging, dragX, goPrev, goNext]);

  // ── Compute shortest circular offset ──
  const circularOffset = (index: number) => {
    const n = photos.length;
    let diff = index - currentIndex;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    return diff;
  };

  // ── Card positioning: single-image layout ──
  const getCard3DStyle = (index: number): React.CSSProperties => {
    const offset = circularOffset(index);
    const dragInfluence = isDragging ? dragX * 0.3 : 0;
    const absOffset = Math.abs(offset);

    // Only render the active card + 1 buffer on each side for smooth transitions
    if (absOffset > 1) return { display: 'none', opacity: 0 };

    const transition = isDragging ? 'none' : 'all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    // Active card — centered and fully visible
    if (offset === 0) {
      return {
        transform: `translateX(${dragInfluence}px) scale(1)`,
        zIndex: 10,
        opacity: 1,
        transition,
      };
    }

    // Buffer cards (offset ±1) — hidden off-screen for slide-in transition
    const direction = offset > 0 ? 1 : -1;
    return {
      transform: `translateX(${direction * 110}%) scale(1)`,
      zIndex: 1,
      opacity: 0,
      transition,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="min-h-screen w-full relative overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(135deg, #edeae3 0%, #eae6de 35%, #e7e2d9 70%, #eceae2 100%)',
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

      {/* Ambient vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.07) 100%)'
        }}
      />

      {/* ═══ Main Layout ═══ */}
      <div className="w-full max-w-[1600px] mx-auto relative z-10 px-4 md:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center">

          {/* ── TOP: Paper Note ── */}
          <div className={`relative w-full max-w-xl mx-auto mb-12 transition-all duration-[1300ms] ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>

            {/* Sheet 3 — deepest */}
            <div
              className="absolute inset-0"
              style={{
                background: '#e5e0d5',
                transform: 'rotate(2.2deg) translateY(7px) scale(0.994)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                borderRadius: '1px',
              }}
            />

            {/* Sheet 2 */}
            <div
              className="absolute inset-0"
              style={{
                background: '#ece8de',
                transform: 'rotate(-1.1deg) translateY(3.5px) scale(0.997)',
                boxShadow: '0 4px 18px rgba(0,0,0,0.09)',
                borderRadius: '1px',
              }}
            />

            {/* Main paper */}
            <div
              className="relative z-10 flex flex-col items-center text-center shrink-0"
              style={{
                background: 'linear-gradient(160deg, #fdfaf5 0%, #f9f5ee 60%, #f6f1e8 100%)',
                boxShadow: `
                  0 1px 2px rgba(0,0,0,0.04),
                  0 3px 8px rgba(0,0,0,0.06),
                  0 8px 20px rgba(0,0,0,0.07),
                  0 20px 48px rgba(0,0,0,0.09),
                  inset 0 1px 0 rgba(255,255,255,0.9),
                  inset 0 0 80px rgba(196,152,91,0.025)
                `,
                border: '1px solid rgba(196,152,91,0.14)',
                borderRadius: '1px',
                padding: 'clamp(2.5rem, 6vw, 4rem) clamp(2rem, 5vw, 3.5rem)',
              }}
            >
              {/* Paper grain */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  opacity: 0.6,
                  mixBlendMode: 'multiply',
                  borderRadius: '1px',
                }}
              />
              {/* Left binding shadow */}
              <div
                className="absolute top-0 left-0 bottom-0 w-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.022) 0%, transparent 100%)',
                  borderRadius: '1px 0 0 1px',
                }}
              />

              {/* ① Decorative flowers */}
              <div
                className={`mb-7 transition-all duration-500 ease-out ${
                  flowersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <div className="w-48 h-16 relative mx-auto bg-[#ede9e2]/60 rounded-sm flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8B7355]/35 garamond-300 select-none">
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
                  {`${titleLine1} ${titleLine2}`.split('').map((char, i) => (
                    <span
                      key={`t-${i}`}
                      className={`gl3d-letter${titleStarted ? ' gl3d-letter--animated' : ''}`}
                      style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                    >
                      {char === ' ' ? '\u00A0' : char}
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
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C4985B] to-transparent mb-6 mx-auto" />
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

            </div>{/* end main paper */}
          </div>{/* end paper stack */}

          {/* ── BOTTOM: 3D Coverflow Carousel ── */}
          <div
            className={`w-full flex flex-col items-center relative transition-all duration-1000 ease-out ${
              cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
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
              <div className="gl3d-cards-container">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="gl3d-card"
                    style={getCard3DStyle(index)}
                  >
                    <div className="gl3d-photo">
                      <img
                        src={photo.src}
                        alt={photo.label}
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ═══ Navigation Arrows ═══ */}
              <button
                onClick={goPrev}
                className="gl3d-nav-btn gl3d-nav-btn--left"
                aria-label="Foto anterior"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="gl3d-nav-btn gl3d-nav-btn--right"
                aria-label="Foto siguiente"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* ═══ Dot indicators ═══ */}
            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center gap-3">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`gl3d-dot ${i === currentIndex ? 'gl3d-dot--active' : ''}`}
                    aria-label={`Ir a foto ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Counter */}
            <p className="text-center mt-3 text-[10px] tracking-[0.3em] uppercase text-[#8B7355]/40 garamond-300">
              {currentIndex + 1}&thinsp;/&thinsp;{photos.length}
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
          max-width: 1600px;
          height: clamp(320px, 52vw, 620px);
          position: relative;
          cursor: grab;
          overflow: hidden;
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
        }

        .gl3d-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(300px, 94vw, 1500px);
          height: clamp(280px, 46vw, 560px);
          margin-left: calc(clamp(300px, 94vw, 1500px) / -2);
          margin-top: calc(clamp(280px, 46vw, 560px) / -2);
        }

        /* ── Photo card ── */
        .gl3d-photo {
          width: 100%;
          height: 100%;
          position: relative;
          background: #d5cfc6;
          border-radius: 8px;
          overflow: hidden;
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
        .gl3d-nav-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(196, 152, 91, 0.6);
          box-shadow: 0 4px 20px rgba(196, 152, 91, 0.15);
          transform: translateY(-50%) scale(1.08);
        }
        .gl3d-nav-btn:active {
          transform: translateY(-50%) scale(0.95);
        }
        .gl3d-nav-btn--left {
          left: 8px;
        }
        .gl3d-nav-btn--right {
          right: 8px;
        }

        @media (min-width: 768px) {
          .gl3d-nav-btn {
            width: 50px;
            height: 50px;
          }
          .gl3d-nav-btn--left { left: 16px; }
          .gl3d-nav-btn--right { right: 16px; }
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
