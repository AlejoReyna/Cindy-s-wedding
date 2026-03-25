"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
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

// ── Per-section navbar theme overrides ──────────────────────────────────────
// Add an entry here to give any section its own navbar appearance.
// bgRgb: background color as "r,g,b" (will be combined with bgAlpha)
// textCls: Tailwind classes for link color + hover state
// lineColor: color for the bottom accent line and hover underline
// dotColor: color for the active-section dot indicator
// ─────────────────────────────────────────────────────────────────────────────
interface SectionTheme {
  bgRgb: string;
  textCls: string;
  lineColor: string;
  dotColor: string;
  logoColor: string; // exact fill color applied to the monogram via CSS mask-image
}

const DEFAULT_TEXT_CLS  = 'text-[#543c24]/55 hover:text-[#543c24]';
const DEFAULT_LINE_COLOR = '#543c24';
const DEFAULT_DOT_COLOR  = '#C4985B';
const DEFAULT_LOGO_COLOR = '#000000';

const SECTION_THEMES: Record<string, SectionTheme> = {
  galeria: {
    bgRgb:     '237,234,228',                            // #edeae4 — Gallery3D bg
    textCls:   'text-[#ba764e]/75 hover:text-[#ba764e]', // same as gl3d-title-text
    lineColor: '#ba764e',
    dotColor:  '#C4985B',
    logoColor: '#9e5f3c',
  },
  itinerario: {
    bgRgb:     '246,236,230',                            // #f6ece6 — ItinerarySection bg
    textCls:   DEFAULT_TEXT_CLS,
    lineColor: DEFAULT_LINE_COLOR,
    dotColor:  DEFAULT_DOT_COLOR,
    logoColor: DEFAULT_LOGO_COLOR,
  },
  ubicacion: {
    bgRgb:     '243,235,226',                            // #f3ebe2 — LocationSection bg
    textCls:   DEFAULT_TEXT_CLS,
    lineColor: DEFAULT_LINE_COLOR,
    dotColor:  DEFAULT_DOT_COLOR,
    logoColor: DEFAULT_LOGO_COLOR,
  },
  dresscode: {
    // Lighter, warmer variant to avoid the "greenish" cast.
    bgRgb:     '242,238,228',                            // #f2eee4 — light parchment
    textCls:   'text-[#6a6048]/75 hover:text-[#6a6048]',
    lineColor: '#9b9072',
    dotColor:  '#9b9072',
    logoColor: '#6a6048',
  },
};

const Navbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInFooterSection, setIsInFooterSection] = useState(false);
  const [isInRSVPSection, setIsInRSVPSection] = useState(false);
  // Start as true — page always loads at the top over the hero image.
  // The scroll handler will correct this once it fires.
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { isNightMode } = useTheme();

  const navRef = useRef<HTMLElement | null>(null);
  const ticking = useRef(false);

  // ── Scroll handler (uses refs to avoid re-creating listener) ──
  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentY = window.scrollY;

      // Continuous progress 0→1
      setScrollProgress(Math.min(currentY / SCROLL_RANGE, 1));

      // Footer / RSVP section detection
      const wh = window.innerHeight;
      const heroRect = document.getElementById('hero-section')?.getBoundingClientRect();
      const footerRect = document.getElementById('footer')?.getBoundingClientRect();
      const rsvpRect = document.getElementById('rsvp')?.getBoundingClientRect();

      if (heroRect && heroRect.bottom > 0 && heroRect.top < wh) {
        const probeLine = wh * 0.35;
        setIsInHeroSection(heroRect.top <= probeLine && heroRect.bottom >= probeLine);
      } else {
        setIsInHeroSection(false);
      }

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
  const isDark = isNightMode || isInHeroSection || isInRSVPSection || isInFooterSection;
  const isSpecialSection = isInFooterSection;

  const heroLikeNav = isInHeroSection || isInRSVPSection;
  const logoProgress = heroLikeNav ? 0 : t;
  const logoDesktop = lerp(130, 62, logoProgress);
  const logoMobile = lerp(104, 50, logoProgress);
  const padY = lerp(14, 4, t);
  const navProgress = heroLikeNav ? 0 : t;
  const bgAlpha = isSpecialSection ? 0 : lerp(0, 0.97, navProgress);
  const blur = isSpecialSection ? 0 : lerp(0, 16, navProgress);
  const lineAlpha = isSpecialSection ? 0 : navProgress;
  const shadowAlpha = isSpecialSection ? 0 : lerp(0, 0.06, navProgress);

  // Pick a per-section theme override, but only when the navbar isn't already
  // in a "dark" state (hero / rsvp / footer / night-mode take precedence).
  const sectionTheme = !isDark ? (SECTION_THEMES[activeSection] ?? null) : null;

  const textCls = isDark
    ? 'text-white hover:text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]'
    : sectionTheme
      ? sectionTheme.textCls
      : 'text-[#543c24]/55 hover:text-[#543c24]';

  const lineColor = isDark ? '#ffffff' : (sectionTheme?.lineColor ?? '#543c24');
  const dotColor  = isDark ? '#ffffff' : (sectionTheme?.dotColor  ?? '#C4985B');

  // Background color: white by default, overridden per-section when applicable.
  const navBgRgb = isNightMode ? '0,0,0' : (sectionTheme?.bgRgb ?? '255,255,255');

  // Monogram color via CSS mask-image (PNG is pure black #000 on transparent).
  // mask-image uses the alpha channel as the stencil; background-color fills it.
  const navLogoColor = isDark
    ? '#ffffff'                           // white on dark backgrounds
    : (sectionTheme?.logoColor ?? '#000000'); // section override, or original black

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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        paddingTop: `${padY}px`,
        paddingBottom: `${padY}px`,
        paddingLeft: 'clamp(16px, 3vw, 48px)',
        paddingRight: 'clamp(16px, 3vw, 48px)',
        backgroundColor: `rgba(${navBgRgb},${bgAlpha})`,
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
                  className={`text-[13px] garamond-300 tracking-[0.25em] transition-all duration-400 relative group py-1 ${textCls}`}
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
            <div
              role="img"
              aria-label="Monograma"
              style={{
                width: `${logoDesktop}px`,
                height: `${logoDesktop}px`,
                backgroundColor: navLogoColor,
                WebkitMaskImage: "url('/Diseño sin título.png')",
                maskImage: "url('/Diseño sin título.png')",
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                transition: 'background-color 0.5s ease, width 0.3s ease, height 0.3s ease',
                flexShrink: 0,
              }}
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
                  className={`text-[13px] garamond-300 tracking-[0.25em] transition-all duration-400 relative group py-1 ${textCls}`}
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
          <ul className="flex items-center justify-end gap-3 text-[13px]">
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
            <div
              role="img"
              aria-label="Monograma"
              style={{
                width: `${logoMobile}px`,
                height: `${logoMobile}px`,
                backgroundColor: navLogoColor,
                WebkitMaskImage: "url('/Diseño sin título.png')",
                maskImage: "url('/Diseño sin título.png')",
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                transition: 'background-color 0.5s ease, width 0.3s ease, height 0.3s ease',
                flexShrink: 0,
              }}
            />
          </div>

          <ul className="flex items-center justify-start gap-3 text-[13px]">
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
            <div
              role="img"
              aria-label="Monograma"
              style={{
                width: `${logoMobile}px`,
                height: `${logoMobile}px`,
                backgroundColor: navLogoColor,
                WebkitMaskImage: "url('/Diseño sin título.png')",
                maskImage: "url('/Diseño sin título.png')",
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                transition: 'background-color 0.5s ease, width 0.3s ease, height 0.3s ease',
                flexShrink: 0,
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
          className={`md:hidden fixed top-0 right-0 bottom-0 w-3/5 h-[100dvh] z-50 border-l transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundColor: '#f9f5e9',
            borderColor: 'rgba(196,152,91,0.15)',
          }}
        >
          <div className="px-7 py-8 h-full flex flex-col">

            {/* Menu header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <span className="block w-6 h-[0.5px] bg-[#C4985B]/35" />
                <span className="text-[10px] garamond-300 tracking-[0.3em] text-[#8B7355]/50 uppercase">
                  Menú
                </span>
                <span className="block w-6 h-[0.5px] bg-[#C4985B]/35" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-[#8B7355]/40 hover:text-[#543c24] transition-colors duration-300"
                aria-label="Cerrar menú"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.2}
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
            <ul className="flex-1 space-y-1">
              {navigationItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className={`group flex items-center gap-3 py-3.5 garamond-300 text-[13px] tracking-[0.22em] uppercase transition-all duration-400 ${
                      activeSection === item.id
                        ? 'text-[#543c24]'
                        : 'text-[#8B7355]/50 hover:text-[#543c24]'
                    }`}
                    style={{
                      opacity: isMobileMenuOpen ? 1 : 0,
                      transform: isMobileMenuOpen
                        ? 'translateX(0)'
                        : 'translateX(16px)',
                      transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                      transitionDelay: isMobileMenuOpen ? `${150 + i * 70}ms` : '0ms',
                    }}
                  >
                    {/* Active indicator dot */}
                    <span
                      className={`block w-1 h-1 rounded-full transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-[#C4985B] scale-100'
                          : 'bg-transparent scale-0'
                      }`}
                    />
                    <span>{item.label.toUpperCase()}</span>
                  </a>
                  {/* Separator line */}
                  {i < navigationItems.length - 1 && (
                    <div className="h-[0.5px] bg-[#C4985B]/10 ml-4" />
                  )}
                </li>
              ))}
            </ul>

            {/* Decorative footer — matching the ornamental line pattern */}
            <div className="pt-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="block w-10 h-[0.5px] bg-[#C4985B]/25" />
                <span className="block w-1.5 h-1.5 rounded-full bg-[#C4985B]/25" />
                <span className="block w-10 h-[0.5px] bg-[#C4985B]/25" />
              </div>
              <p className="mrs-saint-delafield-regular text-lg text-[#8B7355]/30">
                C &amp; J
              </p>
            </div>
          </div>
        </div>

        {/* Overlay backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 h-[100dvh] bg-black/45 z-40 transition-opacity duration-500"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
