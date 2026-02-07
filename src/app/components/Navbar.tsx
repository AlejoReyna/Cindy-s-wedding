"use client"
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';

interface NavigationItem {
  id: string;
  label: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInFooterSection, setIsInFooterSection] = useState(false);
  const [isInRSVPSection, setIsInRSVPSection] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isNightMode } = useTheme();

  // DEBUG: set true para rastrear por qué no cambian flags
  const DEBUG_NAVBAR = false;
  const navRef = useRef<HTMLElement | null>(null);
  const debugPrevRef = useRef({
    isVisible: true,
    isScrolled: false,
    isInFooterSection: false,
    isInRSVPSection: false,
  });
  const debugMissingSectionsLoggedRef = useRef({
    hero: false,
    footer: false,
    rsvp: false,
  });
  
  const navigationItems: NavigationItem[] = [
    { id: 'galeria', label: 'Galería' },
    { id: 'itinerario', label: 'Itinerario' },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'dresscode', label: 'Dress Code' },
    { id: 'regalos', label: 'Mesa de regalos' },
    { id: 'rsvp', label: 'Confirmar' }
  ];

  // Para integrar el monograma como elemento real de la navbar (sin overlay)
  const leftNavItems = navigationItems.slice(0, 3);
  const rightNavItems = navigationItems.slice(3);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Lógica para ocultar/mostrar la navbar al hacer scroll
      const nextIsVisible = !(currentScrollY > lastScrollY && currentScrollY > 100);
      if (!nextIsVisible) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      // Lógica para el fondo de la navbar
      const heroSection = document.getElementById('hero-section');
      const footerSection = document.getElementById('footer');
      const rsvpSection = document.getElementById('rsvp');

      // Log si faltan secciones (solo una vez)
      if (DEBUG_NAVBAR) {
        if (!heroSection && !debugMissingSectionsLoggedRef.current.hero) {
          console.log('[NAVBAR DEBUG] No existe #hero-section en el DOM');
          debugMissingSectionsLoggedRef.current.hero = true;
        }
        if (!footerSection && !debugMissingSectionsLoggedRef.current.footer) {
          console.log('[NAVBAR DEBUG] No existe #footer en el DOM');
          debugMissingSectionsLoggedRef.current.footer = true;
        }
        if (!rsvpSection && !debugMissingSectionsLoggedRef.current.rsvp) {
          console.log('[NAVBAR DEBUG] No existe #rsvp en el DOM');
          debugMissingSectionsLoggedRef.current.rsvp = true;
        }
      }

      const windowHeight = window.innerHeight;
      const heroRect = heroSection?.getBoundingClientRect();
      const footerRect = footerSection?.getBoundingClientRect();
      const rsvpRect = rsvpSection?.getBoundingClientRect();

      const nextIsScrolled = heroRect ? heroRect.bottom < 100 : false;
      const nextIsFooterVisible = footerRect ? footerRect.top < windowHeight * 0.8 : false;

      // RSVP visible: >=60% (o lo que quepa en viewport)
      let nextIsRSVPVisible = false;
      let rsvpDebug: null | {
        top: number;
        bottom: number;
        height: number;
        visibleTop: number;
        visibleBottom: number;
        actualVisibleHeight: number;
        requiredHeight: number;
      } = null;
      if (rsvpRect) {
        if (rsvpRect.bottom > 0 && rsvpRect.top < windowHeight) {
          const visibleTop = Math.max(0, rsvpRect.top);
          const visibleBottom = Math.min(windowHeight, rsvpRect.bottom);
          const actualVisibleHeight = visibleBottom - visibleTop;
          const requiredHeight = Math.min(rsvpRect.height * 0.6, windowHeight);
          nextIsRSVPVisible = actualVisibleHeight >= requiredHeight;
          rsvpDebug = {
            top: rsvpRect.top,
            bottom: rsvpRect.bottom,
            height: rsvpRect.height,
            visibleTop,
            visibleBottom,
            actualVisibleHeight,
            requiredHeight,
          };
        } else {
          rsvpDebug = {
            top: rsvpRect.top,
            bottom: rsvpRect.bottom,
            height: rsvpRect.height,
            visibleTop: 0,
            visibleBottom: 0,
            actualVisibleHeight: 0,
            requiredHeight: Math.min(rsvpRect.height * 0.6, windowHeight),
          };
        }
      }

      setIsScrolled(nextIsScrolled);
      setIsInFooterSection(nextIsFooterVisible);
      setIsInRSVPSection(nextIsRSVPVisible);

      // Log detallado solo cuando cambian flags (para no spamear)
      if (DEBUG_NAVBAR) {
        const prev = debugPrevRef.current;
        const changed =
          prev.isVisible !== nextIsVisible ||
          prev.isScrolled !== nextIsScrolled ||
          prev.isInFooterSection !== nextIsFooterVisible ||
          prev.isInRSVPSection !== nextIsRSVPVisible;

        if (changed) {
          console.log('=== NAVBAR SCROLL DEBUG (changed) ===');
          console.log('scrollY:', currentScrollY, 'lastScrollY:', lastScrollY, 'nextIsVisible:', nextIsVisible);
          console.log('heroRect:', heroRect ? { top: heroRect.top, bottom: heroRect.bottom, height: heroRect.height } : null, 'thresholdBottom<100');
          console.log('footerRect:', footerRect ? { top: footerRect.top, bottom: footerRect.bottom, height: footerRect.height } : null, 'thresholdTop<0.8vh:', windowHeight * 0.8);
          console.log('rsvpRect:', rsvpDebug);
          console.log('next flags:', {
            nextIsScrolled,
            nextIsFooterVisible,
            nextIsRSVPVisible,
          });
          console.log('===================================');
        }

        debugPrevRef.current = {
          isVisible: nextIsVisible,
          isScrolled: nextIsScrolled,
          isInFooterSection: nextIsFooterVisible,
          isInRSVPSection: nextIsRSVPVisible,
        };
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Llamar una vez al inicio para establecer el estado inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // DEBUG: confirma estilos computados reales del <nav>
  useEffect(() => {
    if (!DEBUG_NAVBAR) return;
    const el = navRef.current;
    if (!el) return;
    const cs = window.getComputedStyle(el);
    console.log('=== NAVBAR DOM COMPUTED (changed) ===');
    console.log('className:', el.className);
    console.log('computed:', {
      backgroundColor: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      boxShadow: cs.boxShadow,
      filter: cs.filter,
      opacity: cs.opacity,
    });
    console.log('====================================');
  }, [isNightMode, isScrolled, isInFooterSection, isInRSVPSection]);

  // Función para determinar el estilo basado en el estado de scroll y modo nocturno
      const getNavbarStyle = () => {
      let style; 
      // Hero y Gallery deben verse igual: NO tratamos el Hero como "sección especial".
      // Solo RSVP/Footer mantienen estilo especial.
      if (isInRSVPSection || isInFooterSection) {
        // En secciones especiales, realmente transparente (sin velo blanco)
        style = 'bg-transparent';
      } else if (isNightMode) {
        // Aplicar modo nocturno solo cuando no estamos en las secciones especiales
        style = 'bg-black/95 shadow-lg hover:bg-black';
      } else {
        // En todas las demás secciones, es blanco
      style = 'bg-white/95 shadow-lg hover:bg-white';
    }
    
    // DEBUG: log solo cuando cambia el estilo para evitar spam
    if (DEBUG_NAVBAR) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      // (Nota: NO usamos hooks aquí; esto solo es un comentario para linters de reglas agresivas)
      // Guardamos el último estilo en una propiedad de la ref de debugPrevRef para reutilizar refs existentes
      const prevStyle = (debugPrevRef.current as any).navbarStyle as string | undefined;
      if (prevStyle !== style) {
        console.log('=== NAVBAR STYLE DEBUG (changed) ===');
        console.log('isNightMode:', isNightMode);
        console.log('isInRSVPSection:', isInRSVPSection);
        console.log('isInFooterSection:', isInFooterSection);
        console.log('isScrolled:', isScrolled);
        console.log('isMobileMenuOpen:', isMobileMenuOpen);
        console.log('getNavbarStyle result:', style);
        console.log('===================================');
        (debugPrevRef.current as any).navbarStyle = style;
      }
    }
    
    return style;
  };

  const getTextStyle = () => {
    if (isNightMode) {
      return 'text-white/70 hover:text-white';
    }
    
    // En la sección RSVP o Footer, usar texto blanco
    if (isInRSVPSection || isInFooterSection) {
      return 'text-white/60 hover:text-white';
    }
    
    // En todas las demás secciones, usar texto oscuro
    return 'text-[#543c24]/70 hover:text-[#543c24]';
  };

  const getLineStyle = () => {
    if (isNightMode) {
      return 'bg-white';
    }
    
    // En la sección RSVP o Footer, usar línea blanca
    if (isInRSVPSection || isInFooterSection) {
      return 'bg-white';
    }
    
    // En todas las demás secciones, usar línea oscura
    return 'bg-[#543c24]';
  };

  const getDecorativeLineStyle = () => {
    if (isNightMode) {
      return 'bg-white/30';
    }
    
    // En la sección RSVP o Footer, usar línea decorativa blanca
    if (isInRSVPSection || isInFooterSection) {
      return 'bg-white/30';
    }
    
    // En todas las demás secciones, usar línea decorativa oscura
    return 'bg-[#543c24]/30';
  };

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    // Pequeño delay para permitir que la animación del menú termine
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-3 sm:py-4 transition-all duration-500 ${
      (isInRSVPSection || isInFooterSection) ? 'backdrop-blur-0' : 'backdrop-blur-sm'
    } ${getNavbarStyle()} ${
      isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
    }`}
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Desktop Navigation - Pantallas grandes (logo integrado, sin overlay) */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Links izquierda */}
          <ul className="flex items-center justify-end space-x-8 xl:space-x-12">
            {leftNavItems.map((item, index) => (
              <li key={item.id} className="flex items-center">
                <a
                  href={`#${item.id}`}
                  className={`text-xs garamond-300 tracking-[0.25em] transition-all duration-500 relative group px-2 py-1 ${getTextStyle()}`}
                >
                  {item.label.toUpperCase()}
                  <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-[1px] group-hover:w-3/4 transition-all duration-500 ${getLineStyle()}`}></span>
                </a>
                {index < leftNavItems.length - 1 && (
                  <div className={`ml-6 xl:ml-8 w-1 h-1 rounded-full transition-colors duration-500 ${getDecorativeLineStyle()}`}></div>
                )}
              </li>
            ))}
          </ul>

          {/* Monograma al centro como elemento real */}
          <div className="px-8 xl:px-12 flex items-center justify-center">
            <Image
              src="/Diseño sin título.png"
              alt="Monograma"
              width={144}
              height={144}
              className={`w-[120px] h-[120px] sm:w-[144px] sm:h-[144px] object-contain transition-all duration-500 ${
                isNightMode || isInRSVPSection || isInFooterSection ? 'invert' : ''
              }`}
              priority
            />
          </div>

          {/* Links derecha */}
          <ul className="flex items-center justify-start space-x-8 xl:space-x-12">
            {rightNavItems.map((item, index) => (
              <li key={item.id} className="flex items-center">
                <a
                  href={`#${item.id}`}
                  className={`text-xs garamond-300 tracking-[0.25em] transition-all duration-500 relative group px-2 py-1 ${getTextStyle()}`}
                >
                  {item.label.toUpperCase()}
                  <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-[1px] group-hover:w-3/4 transition-all duration-500 ${getLineStyle()}`}></span>
                </a>
                {index < rightNavItems.length - 1 && (
                  <div className={`ml-6 xl:ml-8 w-1 h-1 rounded-full transition-colors duration-500 ${getDecorativeLineStyle()}`}></div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation - MD and above */}
        <div className="hidden md:grid lg:hidden grid-cols-[1fr_auto_1fr_auto] items-center gap-4">
          {/* Links izquierda (2) */}
          <ul className="flex items-center justify-end space-x-3 sm:space-x-4 text-xs">
            {navigationItems.slice(0, 2).map((item, index) => (
              <li key={item.id} className="flex items-center">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`garamond-300 tracking-[0.1em] sm:tracking-[0.15em] transition-colors duration-500 px-1 ${getTextStyle()}`}
                >
                  {item.label.toUpperCase()}
                </a>
                {index < 1 && (
                  <span className={`ml-2 sm:ml-3 transition-colors duration-500 ${
                    isNightMode ? 'text-white/30' : 'text-[#543c24]/30'
                  }`}>·</span>
                )}
              </li>
            ))}
          </ul>

          {/* Monograma centro */}
          <div className="flex items-center justify-center">
            <Image
              src="/Diseño sin título.png"
              alt="Monograma"
              width={132}
              height={132}
              className={`w-[120px] h-[120px] object-contain transition-all duration-500 ${
                isNightMode || isInRSVPSection || isInFooterSection ? 'invert' : ''
              }`}
            />
          </div>

          {/* Links derecha (2) */}
          <ul className="flex items-center justify-start space-x-3 sm:space-x-4 text-xs">
            {navigationItems.slice(2, 4).map((item, index) => (
              <li key={item.id} className="flex items-center">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`garamond-300 tracking-[0.1em] sm:tracking-[0.15em] transition-colors duration-500 px-1 ${getTextStyle()}`}
                >
                  {item.label.toUpperCase()}
                </a>
                {index < 1 && (
                  <span className={`ml-2 sm:ml-3 transition-colors duration-500 ${
                    isNightMode ? 'text-white/30' : 'text-[#543c24]/30'
                  }`}>·</span>
                )}
              </li>
            ))}
          </ul>

          {/* Botón de menú hamburguesa para elementos secundarios */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors duration-500 ${getTextStyle()}`}
            aria-label="Menú adicional"
          >
            <div className="flex flex-col space-y-1">
              <div className={`w-4 h-0.5 transition-all duration-300 ${getLineStyle()} ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-4 h-0.5 transition-all duration-300 ${getLineStyle()} ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-4 h-0.5 transition-all duration-300 ${getLineStyle()} ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Small Mobile Navigation - Solo logo y hamburguesa */}
        <div className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center w-full">
          <div />

          {/* Monograma centro */}
          <div className="flex items-center justify-center">
            <Image
              src="/Diseño sin título.png"
              alt="Monograma"
              width={120}
              height={120}
              className={`w-[120px] h-[120px] object-contain transition-all duration-500 ${
                isNightMode || isInRSVPSection || isInFooterSection ? 'invert' : ''
              }`}
            />
          </div>

          {/* Botón de menú hamburguesa */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors duration-500 ${getTextStyle()}`}
              aria-label="Menú de navegación"
            >
              <div className="flex flex-col space-y-1.5">
                <div className={`w-6 h-0.5 transition-all duration-300 ${getLineStyle()} ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></div>
                <div className={`w-6 h-0.5 transition-all duration-300 ${getLineStyle()} ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}></div>
                <div className={`w-6 h-0.5 transition-all duration-300 ${getLineStyle()} ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* TEMPORALMENTE COMENTADO PARA DEBUG - Menú móvil desplegable para MD+ */}
        {/* <div className={`hidden md:block lg:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        </div> */}

        {/* Menú móvil elegante para SM - 50% ancho - CONTENEDOR UNIFICADO */}
        <div className={`md:hidden fixed top-0 right-0 w-1/2 transition-all duration-500 ease-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-[#543c24]/20 bg-white p-6`}
        style={{
          backgroundColor: 'white !important',
          height: '100vh',
          minHeight: '100vh'
        }}
        ref={(el) => {
          if (el && isMobileMenuOpen) {
            console.log('=== MOBILE MENU DEBUG ===');
            console.log('Menu element:', el);
            console.log('Computed styles:', window.getComputedStyle(el));
            console.log('Background color:', window.getComputedStyle(el).backgroundColor);
            console.log('Height:', window.getComputedStyle(el).height);
            console.log('Width:', window.getComputedStyle(el).width);
            console.log('Display:', window.getComputedStyle(el).display);
            console.log('Position:', window.getComputedStyle(el).position);
            console.log('isMobileMenuOpen:', isMobileMenuOpen);
            console.log('isScrolled:', isScrolled);
            console.log('isNightMode:', isNightMode);
            console.log('isInFooterSection:', isInFooterSection);
            console.log('isInRSVPSection:', isInRSVPSection);
            console.log('========================');
          }
        }}>
          
          {/* Header del menú */}
          <div className="flex items-center justify-between mb-8 border-b border-[#543c24]/10 pb-6"
            ref={(el) => {
              if (el && isMobileMenuOpen) {
                console.log('=== HEADER DEBUG ===');
                console.log('Header computed styles:', window.getComputedStyle(el));
                console.log('Header background:', window.getComputedStyle(el).backgroundColor);
                console.log('====================');
              }
            }}>
            <h2 className="text-sm garamond-300 tracking-[0.2em] text-[#543c24]/70">
              MENÚ
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-[#543c24]/70 hover:text-[#543c24]"
              aria-label="Cerrar menú"
            >
              <div className="relative w-5 h-5">
                <div className="absolute top-1/2 left-0 w-full h-0.5 rotate-45 bg-[#543c24]"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 -rotate-45 bg-[#543c24]"></div>
              </div>
            </button>
          </div>
          
          {/* Lista de navegación */}
          <ul className="space-y-6 flex-1"
            ref={(el) => {
              if (el && isMobileMenuOpen) {
                console.log('=== NAV LIST DEBUG ===');
                console.log('Nav list computed styles:', window.getComputedStyle(el));
                console.log('Nav list background:', window.getComputedStyle(el).backgroundColor);
                console.log('Nav list parent background:', el.parentElement ? window.getComputedStyle(el.parentElement).backgroundColor : 'no parent');
                console.log('=====================');
              }
            }}>
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className="block text-sm garamond-300 tracking-[0.2em] py-3 border-b border-[#543c24]/10 group text-[#543c24]/60 hover:text-[#543c24]"
                >
                  <span className="relative">
                    {item.label.toUpperCase()}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 bg-[#543c24]"></span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          
          {/* Elemento decorativo en el footer - posicionado al final */}
          <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-[#543c24]/10"
            ref={(el) => {
              if (el && isMobileMenuOpen) {
                console.log('=== FOOTER DEBUG ===');
                console.log('Footer computed styles:', window.getComputedStyle(el));
                console.log('Footer background:', window.getComputedStyle(el).backgroundColor);
                console.log('====================');
              }
            }}>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 rounded-full bg-[#543c24]/30"></div>
              <div className="w-8 h-0.5 bg-[#543c24]/30"></div>
              <div className="w-1 h-1 rounded-full bg-[#543c24]/30"></div>
            </div>
          </div>
        </div>

        {/* Overlay para cerrar el menú en SM */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>

      <style jsx>{`
        .garamond-300 {
          font-family: 'EB Garamond', serif;
          font-weight: 300;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;