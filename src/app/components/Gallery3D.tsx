"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// ── Photo data ──
const photos = [
  { label: 'FOTO 1', src: '/second_section/1.jpeg' },
  { label: 'FOTO 2', src: '/second_section/2.jpeg' },
  { label: 'FOTO 3', src: '/second_section/3.jpeg' },
  { label: 'FOTO 4', src: '/second_section/4.jpeg' },
  { label: 'FOTO 5', src: '/second_section/5.jpeg' },
  { label: 'FOTO 6', src: '/second_section/6.jpeg' },
  { label: 'FOTO 7', src: '/second_section/7.jpeg' },
  { label: 'FOTO 8', src: '/second_section/8.jpeg' },
  { label: 'FOTO 9', src: '/second_section/9.jpeg' },
  { label: 'FOTO 10', src: '/second_section/10.jpeg' },
  { label: 'FOTO 11', src: '/second_section/11.jpeg' },
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

const LETTER_SPEED = 12;
const WORD_SPEED   = 18;

export default function Gallery3D() {
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const borderPathRef = useRef<SVGRectElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [titleWidth, setTitleWidth] = useState(0);
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

  // ── Measure title width for divider ──
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTitleWidth(el.getBoundingClientRect().width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Sequential animation chain flags ──
  const [titleStarted, setTitleStarted] = useState(false);
  const [, setLineDrawn] = useState(false);
  const [dividerVisible, setDividerVisible] = useState(false);
  const [subtitleStarted, setSubtitleStarted] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  // ── 3D Carousel state ──
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  // ── Text data ──
  const titleLine1 = '¡Nos';
  const titleLine2 = 'Casamos!';
  const subtitleWords = 'Con gran ilusión, te invitamos a celebrar el inicio de nuestra vida juntos'.split(' ');

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
            after(120,  () => setTitleStarted(true));
            after(180,  () => setLineDrawn(true));
            after(250,  () => setDividerVisible(true));
            after(400,  () => setSubtitleStarted(true));
            after(900,  () => setCardsVisible(true));
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

  // ── Navigation (finite, no wrap) ──
  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    if (index < 0 || index >= photos.length || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, currentIndex]);

  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < photos.length - 1;

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

  // ── Card positioning: active card + side previews ──
  const getCard3DStyle = (index: number): React.CSSProperties => {
    const offset = index - currentIndex;
    const dragInfluence = isDragging ? dragX * 0.3 : 0;
    const absOffset = Math.abs(offset);

    // Only render the active card + 1 buffer on each side for smooth transitions
    if (absOffset > 1) return { display: 'none', opacity: 0 };

    const transition = isDragging ? 'none' : 'all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    // Active card — centered and fully visible
    if (offset === 0) {
      return {
        transform: `translateX(${dragInfluence}px) translateZ(90px) scale(1.03)`,
        zIndex: 12,
        opacity: 1,
        filter: 'brightness(1.02)',
        transition,
      };
    }

    // Adjacent cards (offset ±1) — semi-preview on the sides
    const direction = offset > 0 ? 1 : -1;
    return {
      transform: `translateX(${direction * 59}%) translateZ(-40px) rotateY(${direction * -24}deg) scale(0.82)`,
      zIndex: 4,
      opacity: 0.58,
      filter: 'brightness(0.92) saturate(0.95)',
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
        backgroundColor: '#edeae4',
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
            stroke="#dfac59"
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
      <div className="w-full max-w-[1600px] mx-auto relative z-10 px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-0">

          {/* ── TOP: Text Section ── */}
          <div className="w-full max-w-6xl flex flex-col items-center text-center shrink-0 pt-1 mt-0 md:pt-0 lg:mt-30">

            {/* ③ Title */}
            <div className="mb-1 mt-0 md:mb-3 md:mt-2">
              <h2 className="gl3d-title-text">
                <span ref={titleRef} className="gl3d-title-inner">
                  {`${titleLine1} ${titleLine2}`.split('').map((char, i) => (
                    <span
                      key={`t-${i}`}
                      className={`gl3d-letter${titleStarted ? ' gl3d-letter--animated' : ''}`}
                      style={{ animationDelay: `${i * LETTER_SPEED}ms` }}
                    >
                      <span className={char === '¡' || char === '!' ? 'gl3d-punct-lower' : ''}>
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    </span>
                  ))}
                </span>
              </h2>
            </div>

            {/* ④ Decorative divider — expands from center */}
            <div className="gl3d-divider-wrap mt-2 md:mb-3">
              <div
                className={`gl3d-divider${dividerVisible ? ' gl3d-divider--visible' : ''}`}
                style={{ ['--divider-target' as string]: `${titleWidth}px` } as React.CSSProperties}
              />
            </div>

            {/* ⑤ Subtitle */}
            <div
              className="w-full px-3 mt-1 mb-3 md:mt-0 md:mb-4"
              style={{ width: `${titleWidth}px`, maxWidth: '100%' }}
            >
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
          </div>

          {/* ── BOTTOM: 3D Coverflow Carousel ── */}
          <div
            className={`w-full md:w-[80%] flex flex-col items-center relative transition-all duration-1000 ease-out ${
              cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } mt-0`}
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
                    <div className="gl3d-photo relative">
                      <Image
                        src={photo.src}
                        alt={photo.label}
                        fill
                        className="object-cover"
                        draggable={false}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 50vw"
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
                disabled={!canGoPrev}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="gl3d-nav-btn gl3d-nav-btn--right"
                aria-label="Foto siguiente"
                disabled={!canGoNext}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* ═══ Dot indicators ═══ */}
            <div className="flex items-center justify-center mt-3 md:mt-5">
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
            <p className="text-center mt-1 md:mt-2 text-[10px] tracking-[0.3em] uppercase text-[#8B7355]/40 garamond-300">
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
          font-size: clamp(1.75rem, 7vw, 2.6rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ba764e;
          line-height: 1;
        }
        .gl3d-title-inner {
          display: inline;
        }
        .gl3d-title-inner > span:last-child {
          letter-spacing: 0;
        }
        .gl3d-subtitle-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.05rem;
          color: #8B7355;
          line-height: 1.55;
          text-align: justify;
          text-align-last: center;
        }

        @media (min-width: 640px) {
          .gl3d-date-text { font-size: 15px; }
          .gl3d-title-text { font-size: 3.5rem; }
          .gl3d-subtitle-text { font-size: 1.3rem; }
        }
        @media (min-width: 768px) {
          .gl3d-date-text { font-size: 16px; }
          .gl3d-title-text { font-size: 5rem; }
          .gl3d-subtitle-text { font-size: 1.5rem; }
        }

        /* ═══ LETTER / WORD WRITING ANIMATIONS ═══ */
        .gl3d-letter {
          display: inline-block;
          opacity: 0;
        }
        .gl3d-punct-lower {
          display: inline-block;
          transform: translateY(0.09em);
        }
        .gl3d-letter--animated {
          animation: gl3dLetterWrite 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
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
          animation: gl3dWordWrite 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes gl3dWordWrite {
          0%   { opacity: 0; transform: translateY(8px) scaleX(0.6); filter: blur(1.5px); }
          55%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }

        /* ═══ DECORATIVE DIVIDER ═══ */
        .gl3d-divider-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .gl3d-divider {
          height: 1px;
          width: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #C4985B 20%,
            #C4985B 80%,
            transparent 100%
          );
          opacity: 0;
          transition: none;
        }
        .gl3d-divider--visible {
          animation: gl3dDividerExpand 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes gl3dDividerExpand {
          0%   { width: 0; opacity: 0; }
          20%  { opacity: 1; }
          100% { width: var(--divider-target, 200px); opacity: 1; }
        }

        /* ═══ BORDER FRAME ═══ */
        .gl3d-border-frame {
          position: absolute;
          top: 12px; left: 12px; right: 12px; bottom: 12px;
          z-index: 2;
        }
        @media (max-width: 767px) {
          .gl3d-border-frame {
            display: none;
          }
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
          height: clamp(374px, 55vw, 682px);
          position: relative;
          cursor: grab;
          overflow: hidden;
          perspective: 1400px;
          perspective-origin: center center;
        }
        @media (max-width: 767px) {
          .gl3d-stage {
            height: clamp(330px, 94vw, 528px);
            perspective: 1100px;
          }
        }
        .gl3d-stage:active {
          cursor: grabbing;
        }

        .gl3d-reflection {
          position: absolute;
          bottom: -2px;
          left: 10%;
          right: 10%;
          height: 40px;
          background: linear-gradient(
            to bottom,
            rgba(196, 152, 91, 0.02) 0%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }
        @media (max-width: 767px) {
          .gl3d-reflection {
            display: none;
          }
        }

        .gl3d-cards-container {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
          transform-style: preserve-3d;
        }

        .gl3d-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: clamp(280px, 76vw, 1100px);
          aspect-ratio: 3 / 2;
          margin-left: calc(clamp(280px, 76vw, 1100px) / -2);
          margin-top: calc((clamp(280px, 76vw, 1100px) / (3 / 2)) / -2);
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
        }

        @media (max-width: 767px) {
          .gl3d-card {
            width: clamp(300px, 92vw, 560px);
            aspect-ratio: 4 / 3;
            margin-left: calc(clamp(300px, 92vw, 560px) / -2);
            margin-top: calc((clamp(300px, 92vw, 560px) / (4 / 3)) / -2);
          }
        }

        /* ── Photo card ── */
        .gl3d-photo {
          width: 100%;
          height: 100%;
          position: relative;
          background: #d5cfc6;
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.10),
            0 2px 6px rgba(0, 0, 0, 0.05);
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
        .gl3d-nav-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: translateY(-50%);
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
        }
        .gl3d-nav-btn:disabled:hover {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(196, 152, 91, 0.35);
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
          transform: translateY(-50%);
        }
        .gl3d-nav-btn--left {
          left: 8px;
        }
        .gl3d-nav-btn--right {
          right: 8px;
        }

        @media (max-width: 767px) {
          .gl3d-nav-btn {
            width: 42px;
            height: 42px;
            background: rgba(255, 255, 255, 0.78);
          }
          .gl3d-nav-btn--left { left: 10px; }
          .gl3d-nav-btn--right { right: 10px; }
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
