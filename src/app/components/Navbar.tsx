"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';

interface NavigationItem {
  id: string;
  label: string;
}

const SCROLL_RANGE = 180; // px over which the transition interpolates

const navigationItems: NavigationItem[] = [
  { id: 'galeria', label: 'Galería' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'dresscode', label: 'Dress Code' },
  { id: 'regalos', label: 'Mesa de regalos' },
  { id: 'rsvp', label: 'Confirmar' },
];

const leftNavItems = navigationItems.slice(0, 3);
const rightNavItems = navigationItems.slice(3);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInFooterSection, setIsInFooterSection] = useState(false);
  const [isInRSVPSection, setIsInRSVPSection] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { isNightMode } = useTheme();

  const navRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const ticking = useRef(false);

  // ── Scroll handler (uses refs to avoid re-creating listener) ──
  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const prevY = lastScrollYRef.current;

      // Hide on scroll-down, show on scroll-up
      if (currentY > prevY && currentY > 80) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      // Continuous progress 0→1
      setScrollProgress(Math.min(currentY / SCROLL_RANGE, 1));

      // Footer / RSVP section detection
      const wh = window.innerHeight;
      const footerRect = document.getElementById('footer')?.getBoundingClientRect();
      const rsvpRect = document.getElementById('rsvp')?.getBoundingClientRect();

      setIsInFooterSection(footerRect ? footerRect.top < wh * 0.8 : false);

      if (rsvpRect && rsvpRect.bottom > 0 && rsvpRect.top < wh) {
        const visTop = Math.max(0, rsvpRect.top);
        const visBot = Math.min(wh, rsvpRect.bottom);
        const actual = visBot - visTop;
        const required = Math.min(rsvpRect.height * 0.6, wh);
        setIsInRSVPSection(actual >= required);
      } else {
        setIsInRSVPSection(false);
      }

      // Active section highlight
      let current = '';
      for (const item of navigationItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom > 140) {
            current = item.id;
            break;
          }
        }
      }
      setActiveSection(current);

      lastScrollYRef.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  // ── Derived visual values ──
  const t = scrollProgress;
  const isDark = isNightMode || isInRSVPSection || isInFooterSection;
  const isSpecialSection = isInRSVPSection || isInFooterSection;

  const logoDesktop = lerp(100, 48, t);
  const logoMobile = lerp(88, 42, t);
  const padY = lerp(14, 4, t);
  const bgAlpha = isSpecialSection ? 0 : lerp(0, 0.97, t);
  const blur = isSpecialSection ? 0 : lerp(0, 16, t);
  const lineAlpha = isSpecialSection ? 0 : t;
  const shadowAlpha = isSpecialSection ? 0 : lerp(0, 0.06, t);

  const textCls = isDark
    ? 'text-white/60 hover:text-white'
    : 'text-[#543c24]/55 hover:text-[#543c24]';

  const lineColor = isDark ? '#ffffff' : '#543c24';
  const dotColor = isDark ? '#ffffff' : '#C4985B';

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  // ── Render ──
  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        paddingTop: `${padY}px`,
        paddingBottom: `${padY}px`,
        paddingLeft: 'clamp(16px, 3vw, 48px)',
        paddingRight: 'clamp(16px, 3vw, 48px)',
        backgroundColor: isNightMode
          ? `rgba(0,0,0,${bgAlpha})`
          : `rgba(255,255,255,${bgAlpha})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        boxShadow:
          shadowAlpha > 0.005
            ? `0 1px 24px rgba(${isDark ? '255,255,255' : '84,60,36'},${shadowAlpha})`
            : 'none',
      }}
    >
      {/* Bottom accent line — fades in as you scroll */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 8%, ${
            isDark ? 'rgba(255,255,255,0.12)' : 'rgba(196,152,91,0.35)'
          } 50%, transparent 92%)`,
          opacity: lineAlpha,
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* ═══════════════════════════════════════════
            DESKTOP  (lg+)
        ═══════════════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left links */}
          <ul className="flex items-center justify-end gap-8 xl:gap-10">
            {leftNavItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`text-[11px] garamond-300 tracking-[0.25em] transition-all duration-400 relative group py-1 ${textCls}`}
                >
                  {item.label.toUpperCase()}
                  {/* Hover underline */}
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                    style={{ backgroundColor: lineColor }}
                  />
                  {/* Active section dot */}
                  <span
                    className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full transition-all duration-500 ${
                      activeSection === item.id
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-0'
                    }`}
                    style={{ backgroundColor: dotColor }}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Center monogram */}
          <div className="px-8 xl:px-10 flex items-center justify-center">
            <Image
              src="/Diseño sin título.png"
              alt="Monograma"
              width={144}
              height={144}
              className={`object-contain ${isDark ? 'invert' : ''}`}
              style={{
                width: `${logoDesktop}px`,
                height: `${logoDesktop}px`,
                transition: 'filter 0.5s ease',
              }}
              priority
            />
          </div>

          {/* Right links */}
          <ul className="flex items-center justify-start gap-8 xl:gap-10">
            {rightNavItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`text-[11px] garamond-300 tracking-[0.25em] transition-all duration-400 relative group py-1 ${textCls}`}
                >
                  {item.label.toUpperCase()}
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                    style={{ backgroundColor: lineColor }}
                  />
                  <span
                    className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full transition-all duration-500 ${
                      activeSection === item.id
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-0'
                    }`}
                    style={{ backgroundColor: dotColor }}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ═══════════════════════════════════════════
            TABLET  (md → lg)
        ═══════════════════════════════════════════ */}
        <div className="hidden md:grid lg:hidden grid-cols-[1fr_auto_1fr_auto] items-center gap-3">
          <ul className="flex items-center justify-end gap-3 text-[11px]">
            {navigationItems.slice(0, 2).map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`garamond-300 tracking-[0.12em] transition-colors duration-400 px-1 ${textCls}`}
                >
                  {item.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center">
            <Image
              src="/Diseño sin título.png"
              alt="Monograma"
              width={132}
              height={132}
              className={`object-contain ${isDark ? 'invert' : ''}`}
              style={{
                width: `${logoMobile}px`,
                height: `${logoMobile}px`,
                transition: 'filter 0.5s ease',
              }}
            />
          </div>

          <ul className="flex items-center justify-start gap-3 text-[11px]">
            {navigationItems.slice(2, 4).map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`garamond-300 tracking-[0.12em] transition-colors duration-400 px-1 ${textCls}`}
                >
                  {item.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors duration-400 ${textCls}`}
            aria-label="Menú adicional"
          >
            <div className="flex flex-col gap-[4px]">
              <div
                className="w-4 h-[1px] transition-all duration-300 origin-center"
                style={{
                  backgroundColor: lineColor,
                  transform: isMobileMenuOpen
                    ? 'rotate(45deg) translateY(2.5px)'
                    : 'none',
                }}
              />
              <div
                className="w-4 h-[1px] transition-all duration-300"
                style={{
                  backgroundColor: lineColor,
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
              <div
                className="w-4 h-[1px] transition-all duration-300 origin-center"
                style={{
                  backgroundColor: lineColor,
                  transform: isMobileMenuOpen
                    ? 'rotate(-45deg) translateY(-2.5px)'
                    : 'none',
                }}
              />
            </div>
          </button>
        </div>

        {/* ═══════════════════════════════════════════
            MOBILE  (< md)
        ═══════════════════════════════════════════ */}
        <div className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center w-full">
          <div />

          <div className="flex items-center justify-center">
            <Image
              src="/Diseño sin título.png"
              alt="Monograma"
              width={120}
              height={120}
              className={`object-contain ${isDark ? 'invert' : ''}`}
              style={{
                width: `${logoMobile}px`,
                height: `${logoMobile}px`,
                transition: 'filter 0.5s ease',
              }}
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors duration-400 ${textCls}`}
              aria-label="Menú de navegación"
            >
              <div className="flex flex-col gap-[5px]">
                <div
                  className="w-5 h-[1px] transition-all duration-300 origin-center"
                  style={{
                    backgroundColor: lineColor,
                    transform: isMobileMenuOpen
                      ? 'rotate(45deg) translateY(3px)'
                      : 'none',
                  }}
                />
                <div
                  className="w-5 h-[1px] transition-all duration-300"
                  style={{
                    backgroundColor: lineColor,
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                />
                <div
                  className="w-5 h-[1px] transition-all duration-300 origin-center"
                  style={{
                    backgroundColor: lineColor,
                    transform: isMobileMenuOpen
                      ? 'rotate(-45deg) translateY(-3px)'
                      : 'none',
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SLIDE-OUT MOBILE MENU  (< md)
        ═══════════════════════════════════════════ */}
        <div
          className={`md:hidden fixed top-0 right-0 w-1/2 h-screen z-50 border-l transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'rgba(84,60,36,0.08)',
          }}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Menu header */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#543c24]/8">
              <span className="text-[10px] garamond-300 tracking-[0.3em] text-[#543c24]/50">
                MENÚ
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-[#543c24]/50 hover:text-[#543c24] transition-colors"
                aria-label="Cerrar menú"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation links with staggered entrance */}
            <ul className="space-y-0.5 flex-1">
              {navigationItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className="block text-sm garamond-300 tracking-[0.18em] py-3 border-b border-[#543c24]/5 text-[#543c24]/45 hover:text-[#543c24] hover:pl-2 transition-all duration-300"
                    style={{
                      opacity: isMobileMenuOpen ? 1 : 0,
                      transform: isMobileMenuOpen
                        ? 'translateX(0)'
                        : 'translateX(14px)',
                      transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                      transitionDelay: isMobileMenuOpen ? `${i * 60}ms` : '0ms',
                    }}
                  >
                    {item.label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>

            {/* Decorative footer */}
            <div className="pt-5 border-t border-[#543c24]/8 flex items-center justify-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#C4985B]/35" />
              <div className="w-6 h-[1px] bg-[#C4985B]/25" />
              <div className="w-1 h-1 rounded-full bg-[#C4985B]/35" />
            </div>
          </div>
        </div>

        {/* Overlay backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/35 backdrop-blur-sm z-40 transition-opacity duration-500"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
