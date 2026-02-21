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
// QUILL-TRACE TYPING ANIMATION
// ───────────────────────────────────────────────────────────────────────
// Unlike the Hero's "letter materialise" (translateY + scaleX + blur),
// this animation reveals letters *in place* behind a gliding golden cursor.
// The cursor is the star — it moves; the letters simply appear.
//
// HERO vs GALLERY comparison:
//   Hero  → letters POP IN with motion (translateY, scaleX, blur)
//   Gallery → letters APPEAR STILL, cursor GLIDES across revealing them
//
// PRIORITY ORDER (sequential, like Hero):
//   ① Decorative flowers fade in                   (0ms)
//   ② Date  "22 · 08 · 2026" — typed with cursor   (~600ms)
//   ③ Title "¡Nos Casamos!" — typed with cursor     (after ② done)
//   ④ Decorative line draws                         (after ③ done)
//   ⑤ Subtitle paragraph — word-by-word with cursor (after ④)
//   ⑥ Swipe hint fades in                           (after ⑤ done)
//   ⑦ Polaroid cards slide in                       (with ⑥)
// ═══════════════════════════════════════════════════════════════════════

/** Reusable component: types text with a trailing golden cursor.
 *  `mode`: 'letter' = char by char, 'word' = word by word.
 *  `started`: when true the animation begins.
 *  `speed`: ms per unit (char or word).
 *  `onDone`: fires once all units are revealed + cursor fades. */
function QuillText({
  text,
  started,
  speed = 70,
  mode = 'letter',
  className = '',
  cursorColor = 'rgba(196, 152, 91, 0.7)',
  onDone,
}: {
  text: string;
  started: boolean;
  speed?: number;
  mode?: 'letter' | 'word';
  className?: string;
  cursorColor?: string;
  onDone?: () => void;
}) {
  const [revealCount, setRevealCount] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorFading, setCursorFading] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Split into renderable units
  const units = mode === 'word' ? text.split(/(\s+)/) : text.split('');
  const totalUnits = units.length;

  useEffect(() => {
    if (!started) return;
    setCursorVisible(true);
    setCursorFading(false);
    doneRef.current = false;
    setRevealCount(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealCount(count);
      if (count >= totalUnits) {
        clearInterval(interval);
        // Cursor lingers briefly, then fades away gracefully
        setTimeout(() => {
          setCursorFading(true);
          setTimeout(() => {
            setCursorVisible(false);
            if (!doneRef.current) {
              doneRef.current = true;
              onDoneRef.current?.();
            }
          }, 350);
        }, 400);
      }
    }, speed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, totalUnits, speed]);

  // Build the revealed portion
  const revealedUnits = units.slice(0, revealCount);

  // Render text (supporting \n for multi-line titles)
  const renderRevealed = () => {
    const joinedText = revealedUnits.join('');
    const lines = joinedText.split('\n');
    return lines.map((line, li) => (
      <span key={li}>
        {line.split('').map((ch, ci) => (
          <span key={`${li}-${ci}`} className="gallery-quill-letter">
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
        {li < lines.length - 1 && <br />}
      </span>
    ));
  };

  // Placeholder (invisible) to reserve layout space
  const renderPlaceholder = () => {
    const lines = text.split('\n');
    return lines.map((line, li) => (
      <span key={li}>
        {line}
        {li < lines.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <span className={`gallery-quill-wrap ${className}`}>
      <span className="gallery-quill-visible" aria-live="polite">
        {renderRevealed()}
        {cursorVisible && (
          <span
            className={`gallery-quill-cursor${cursorFading ? ' gallery-quill-cursor--fading' : ''}`}
            style={{ '--qc': cursorColor } as React.CSSProperties}
          />
        )}
      </span>
      {/* Invisible copy to hold width/height */}
      <span className="gallery-quill-ghost" aria-hidden="true">
        {renderPlaceholder()}
      </span>
    </span>
  );
}


export default function Gallery() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // ── Quill typing sequence flags ──
  // Each becomes true when the previous finishes, creating a chain.
  const [flowersVisible, setFlowersVisible] = useState(false);
  const [dateStarted, setDateStarted] = useState(false);
  const [titleStarted, setTitleStarted] = useState(false);
  const [lineDrawn, setLineDrawn] = useState(false);
  const [subtitleStarted, setSubtitleStarted] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  // ── Card stack state ──
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const dragStartX = useRef(0);
  const stackRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  // ── Section observer → kicks off the chain ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            // ① Flowers fade in immediately
            setFlowersVisible(true);
            // ② Date typing starts 700ms later
            setTimeout(() => setDateStarted(true), 700);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-20px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [isVisible]);

  // ── Chain callbacks ──
  const onDateDone = useCallback(() => {
    // ③ Title starts after small pause
    setTimeout(() => setTitleStarted(true), 250);
  }, []);

  const onTitleDone = useCallback(() => {
    // ④ Line draws in
    setTimeout(() => setLineDrawn(true), 200);
    // ⑤ Subtitle starts after line
    setTimeout(() => setSubtitleStarted(true), 800);
  }, []);

  const onSubtitleDone = useCallback(() => {
    // ⑥⑦ Hint + cards appear together
    setTimeout(() => {
      setHintVisible(true);
      setCardsVisible(true);
    }, 300);
  }, []);

  // ── Auto-scroll filmstrip to active thumb ──
  useEffect(() => {
    const filmstrip = filmstripRef.current;
    if (!filmstrip) return;

    const activeThumb = filmstrip.children[currentIndex] as HTMLElement | undefined;
    if (!activeThumb) return;

    const targetLeft =
      activeThumb.offsetLeft - (filmstrip.clientWidth - activeThumb.clientWidth) / 2;

    filmstrip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [currentIndex]);

  // ── Swipe threshold ──
  const SWIPE_THRESHOLD = 80;

  // ── Mouse handlers ──
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (currentIndex >= polaroids.length) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    setDragX(0);
  }, [currentIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragX(e.clientX - dragStartX.current);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragX) > SWIPE_THRESHOLD && currentIndex < polaroids.length) {
      const direction = dragX > 0 ? 'right' : 'left';
      setExitDirection(direction);
      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, polaroids.length));
        setExitDirection(null);
        setDragX(0);
      }, 350);
    } else {
      setDragX(0);
    }
  }, [isDragging, dragX, currentIndex]);

  // ── Touch handlers ──
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (currentIndex >= polaroids.length) return;
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    setDragX(0);
  }, [currentIndex]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragX(e.touches[0].clientX - dragStartX.current);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragX) > SWIPE_THRESHOLD && currentIndex < polaroids.length) {
      const direction = dragX > 0 ? 'right' : 'left';
      setExitDirection(direction);
      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, polaroids.length));
        setExitDirection(null);
        setDragX(0);
      }, 350);
    } else {
      setDragX(0);
    }
  }, [isDragging, dragX, currentIndex]);

  // ── Navigate to specific photo via filmstrip ──
  const goToPhoto = (index: number) => {
    if (index === currentIndex || index >= polaroids.length) return;
    setCurrentIndex(index);
    setDragX(0);
    setExitDirection(null);
  };

  // ── Reset carousel ──
  const resetCarousel = () => {
    setCurrentIndex(0);
    setDragX(0);
    setExitDirection(null);
  };

  // ── Compute card styles ──
  const getCardStyle = (index: number): React.CSSProperties => {
    const relativeIndex = index - currentIndex;

    if (relativeIndex < 0) {
      return { display: 'none' };
    }

    if (relativeIndex === 0) {
      const rotation = polaroids[index].rotation;

      if (exitDirection) {
        const exitX = exitDirection === 'right' ? 900 : -900;
        const exitRotation = exitDirection === 'right' ? rotation + 25 : rotation - 25;
        return {
          transform: `translateX(${exitX}px) rotate(${exitRotation}deg)`,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
          opacity: 0.4,
          zIndex: polaroids.length - relativeIndex,
          cursor: 'grab',
        };
      }

      if (isDragging) {
        const dragRotation = rotation + dragX * 0.08;
        return {
          transform: `translateX(${dragX}px) rotate(${dragRotation}deg)`,
          transition: 'none',
          zIndex: polaroids.length - relativeIndex,
          cursor: 'grabbing',
        };
      }

      return {
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        zIndex: polaroids.length - relativeIndex,
        cursor: 'grab',
      };
    }

    if (relativeIndex <= 3) {
      const offsetY = relativeIndex * 8;
      const offsetX = relativeIndex * 5;
      const scale = 1 - relativeIndex * 0.03;
      const stackRotation = polaroids[index].rotation * 0.6;
      return {
        transform: `translateY(${offsetY}px) translateX(${offsetX}px) scale(${scale}) rotate(${stackRotation}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        zIndex: polaroids.length - relativeIndex,
        pointerEvents: 'none' as const,
      };
    }

    return { display: 'none' };
  };

  const dragProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);

  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="min-h-screen w-full relative overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
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

      {/* ═══ Main Split Layout ═══ */}
      <div className="w-full max-w-[1400px] mx-auto relative z-10 px-6 md:px-10 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

          {/* ── LEFT: Elegant Text with Quill-Trace Typing ── */}
          <div className="w-full lg:w-[32%] flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">

            {/* ① Decorative flowers — simple fade in (first element) */}
            <div
              className={`mb-6 transition-all duration-1000 ease-out ${
                flowersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <div className="w-56 h-20 relative mx-auto lg:mx-0 bg-[#ede9e2] rounded-sm flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.25em] text-[#8B7355]/40 garamond-300 select-none">
                  Flores decorativas
                </span>
              </div>
            </div>

            {/* ② Date — quill-typed letter by letter */}
            <div className="mb-4">
              <p className="gallery-date-text">
                <QuillText
                  text="22 · 08 · 2026"
                  started={dateStarted}
                  speed={80}
                  mode="letter"
                  cursorColor="rgba(196, 152, 91, 0.8)"
                  onDone={onDateDone}
                />
              </p>
            </div>

            {/* ③ Title — quill-typed letter by letter (two lines) */}
            <div className="mb-6">
              <h2 className="gallery-title-text">
                <QuillText
                  text={"¡Nos\nCasamos!"}
                  started={titleStarted}
                  speed={90}
                  mode="letter"
                  cursorColor="rgba(92, 92, 92, 0.5)"
                  onDone={onTitleDone}
                />
              </h2>
            </div>

            {/* ④ Decorative line — draws in after title */}
            <div
              className={`transition-all duration-[900ms] ease-out ${
                lineDrawn ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
              style={{ transformOrigin: 'center center' }}
            >
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C4985B] to-transparent mb-6 mx-auto lg:mx-0" />
            </div>

            {/* ⑤ Subtitle — quill-typed word by word */}
            <div className="max-w-sm">
              <p className="gallery-subtitle-text">
                <QuillText
                  text="Con inmensa alegría en nuestros corazones, queremos invitarte a celebrar el día en que uniremos nuestras vidas para siempre."
                  started={subtitleStarted}
                  speed={55}
                  mode="word"
                  cursorColor="rgba(139, 115, 85, 0.6)"
                  onDone={onSubtitleDone}
                />
              </p>
            </div>

            {/* ⑥ Swipe hint — fades in last */}
            <div
              className={`mt-8 flex items-center gap-2 transition-all duration-[800ms] ${
                hintVisible ? 'opacity-60' : 'opacity-0'
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B7355]/50 garamond-300">
                Desliza las fotos
              </span>
              <svg className="w-4 h-4 text-[#8B7355]/40 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* ── RIGHT: Stacked Polaroid Carousel + Filmstrip ── */}
          {/* ⑦ Cards slide in with the hint */}
          <div
            className={`w-full lg:w-[68%] flex flex-col items-center lg:items-end relative transition-all duration-1000 ease-out ${
              cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Card stack container */}
            <div
              ref={stackRef}
              className="relative select-none"
              style={{
                width: 'clamp(320px, 46vw, 540px)',
                height: 'clamp(420px, 58vw, 680px)',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { if (isDragging) handleMouseUp(); }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {polaroids.map((polaroid, index) => (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={getCardStyle(index)}
                >
                  {/* Polaroid frame — tight margins */}
                  <div
                    className="bg-white rounded-[3px] w-full h-full"
                    style={{
                      padding: '8px 8px clamp(36px, 5.5vw, 56px) 8px',
                      boxShadow: index === currentIndex
                        ? '0 10px 40px rgba(0,0,0,0.13), 0 3px 10px rgba(0,0,0,0.07)'
                        : '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Photo area — placeholder */}
                    <div className="relative w-full h-full bg-[#ede9e2] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm md:text-base uppercase tracking-[0.25em] text-[#8B7355]/30 garamond-300 select-none">
                          {polaroid.label}
                        </span>
                      </div>

                      {/* Subtle vignette */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.05)' }}
                      />
                    </div>

                    {/* Caption area */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{ height: 'clamp(30px, 5vw, 50px)' }}>
                      <p className="text-[10px] md:text-xs text-[#8B7355]/40 garamond-300 tracking-[0.2em] uppercase italic">
                        {polaroid.caption || '\u00A0'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* All swiped away — reset */}
              {currentIndex >= polaroids.length && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[#8B7355]/50 garamond-300 text-sm tracking-[0.2em] uppercase mb-6">
                    Fin de las fotos
                  </p>
                  <button
                    onClick={resetCarousel}
                    className="px-6 py-2.5 border border-[#C4985B]/40 text-[#8B7355] garamond-300 text-xs tracking-[0.25em] uppercase hover:bg-[#C4985B]/10 transition-all duration-300 rounded-sm"
                  >
                    Ver de nuevo
                  </button>
                </div>
              )}

              {/* Drag direction indicator */}
              {isDragging && Math.abs(dragX) > 20 && (
                <div
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ opacity: dragProgress * 0.6 }}
                >
                  <svg
                    className="w-5 h-5 text-[#C4985B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    style={{
                      transform: dragX > 0 ? 'rotate(0deg)' : 'rotate(180deg)',
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* ═══ Filmstrip / Carrete ═══ */}
            <div className="mt-8 w-full max-w-md lg:max-w-lg">
              {/* Thin line above */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C4985B]/20 to-transparent mb-3" />

              <div
                ref={filmstripRef}
                className="flex items-center gap-2 overflow-x-auto px-2 py-1"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {polaroids.map((_polaroid, i) => (
                  <button
                    key={i}
                    onClick={() => goToPhoto(i)}
                    className="flex-shrink-0 relative overflow-hidden rounded-[2px] transition-all duration-300 focus:outline-none"
                    style={{
                      width: i === currentIndex ? 48 : 40,
                      height: i === currentIndex ? 60 : 50,
                      opacity: i === currentIndex ? 1 : i < currentIndex ? 0.35 : 0.55,
                      border: i === currentIndex
                        ? '2px solid rgba(196, 152, 91, 0.6)'
                        : '1px solid rgba(139, 115, 85, 0.15)',
                      transform: i === currentIndex ? 'scale(1)' : 'scale(0.95)',
                      boxShadow: i === currentIndex
                        ? '0 2px 8px rgba(196, 152, 91, 0.2)'
                        : 'none',
                    }}
                  >
                    {/* Thumbnail placeholder */}
                    <div className="w-full h-full bg-[#ede9e2] flex items-center justify-center">
                      <span className="text-[6px] uppercase tracking-wider text-[#8B7355]/30 garamond-300 select-none">
                        {i + 1}
                      </span>
                    </div>

                    {/* Seen overlay for already-swiped */}
                    {i < currentIndex && (
                      <div className="absolute inset-0 bg-[#f5f2ee]/40" />
                    )}
                  </button>
                ))}
              </div>

              {/* Thin line below */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C4985B]/20 to-transparent mt-3" />

              {/* Counter text */}
              <p className="text-center mt-2 text-[10px] tracking-[0.3em] uppercase text-[#8B7355]/40 garamond-300">
                {Math.min(currentIndex + 1, polaroids.length)}&thinsp;/&thinsp;{polaroids.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
           GALLERY QUILL-TRACE STYLES
           ─────────────────────────────────────────────────────────────
           .gallery-quill-wrap    — inline container using CSS grid overlap
           .gallery-quill-visible — the real (revealed) text layer
           .gallery-quill-ghost   — invisible copy holding layout space
           .gallery-quill-letter  — each revealed character fades in
           .gallery-quill-cursor  — the thin golden bar that glides
         ═══════════════════════════════════════════════════════════════ */}
      <style jsx>{`

        /* ── Typography ── */
        .gallery-date-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 400;
          font-size: 14px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: #C4985B;
        }
        .gallery-title-text {
          font-family: 'Cormorant Garamond', 'EB Garamond', serif;
          font-weight: 300;
          font-size: 2.25rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #5c5c5c;
          line-height: 1.1;
        }
        .gallery-subtitle-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1rem;
          color: #8B7355;
          line-height: 1.7;
        }

        @media (min-width: 640px) {
          .gallery-date-text { font-size: 15px; }
          .gallery-title-text { font-size: 2.8rem; }
          .gallery-subtitle-text { font-size: 1.05rem; }
        }
        @media (min-width: 768px) {
          .gallery-date-text { font-size: 16px; }
          .gallery-title-text { font-size: 3.4rem; }
          .gallery-subtitle-text { font-size: 1.125rem; }
        }

        /* ── Quill container: grid overlap so ghost holds space ── */
        .gallery-quill-wrap {
          display: inline-grid;
        }
        .gallery-quill-wrap > * {
          grid-area: 1 / 1;
        }
        .gallery-quill-visible {
          z-index: 1;
        }
        .gallery-quill-ghost {
          visibility: hidden;
          pointer-events: none;
          user-select: none;
        }

        /* ── Letter reveal: pure opacity (no motion — that's the hero's thing) ── */
        .gallery-quill-letter {
          display: inline;
          animation: quillReveal 0.22s ease-out forwards;
        }
        @keyframes quillReveal {
          from { opacity: 0.15; }
          to   { opacity: 1; }
        }

        /* ── Cursor: thin golden bar with breathing glow ── */
        .gallery-quill-cursor {
          display: inline-block;
          width: 1.5px;
          height: 0.85em;
          vertical-align: baseline;
          margin-left: 1px;
          background: var(--qc, rgba(196, 152, 91, 0.7));
          border-radius: 1px;
          animation: quillCursorPulse 0.8s ease-in-out infinite;
          transition: opacity 0.35s ease;
        }
        .gallery-quill-cursor--fading {
          opacity: 0 !important;
          animation: none;
        }

        @keyframes quillCursorPulse {
          0%, 100% { opacity: 0.9; box-shadow: 0 0 3px var(--qc, rgba(196, 152, 91, 0.3)); }
          50%      { opacity: 0.4; box-shadow: 0 0 6px var(--qc, rgba(196, 152, 91, 0.15)); }
        }

        /* ── Scrollbar hide ── */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
