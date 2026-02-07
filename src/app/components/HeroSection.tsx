"use client"
import { useStatusBarSection } from '../../hooks/useStatusBarManager';
import { useTheme } from '../context/ThemeContext';

const HeroSection = () => {
  const { isNightMode } = useTheme();

  const heroSectionRef = useStatusBarSection({
    sectionId: 'hero',
    color: '#f9f5e9',
    defaultColor: isNightMode ? '#000000' : '#f9f5e9',
    isNightMode
  });

  return (
    <section 
      id="hero-section"
      ref={heroSectionRef}
      className="relative flex flex-col min-h-screen overflow-hidden items-center justify-between pt-24 pb-0"
      style={{
        backgroundColor: isNightMode ? '#0a0a0a' : '#f9f5e9',
        transition: 'background-color 0.5s ease'
      }}
    >
      {/* Content */}
      <div className="z-10 w-full px-4 mt-8 sm:mt-12 md:mt-16 fade-in-section">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full items-start">
          {/* Columna izquierda (vacía) */}
          <div className="hidden md:block" />

          {/* Columna derecha (contenido alineado a la derecha) */}
          <div className="flex flex-col items-end text-right">
            {/* Curved Text */}
            <div className="w-[260px] sm:w-[300px] md:w-[340px]">
          <svg viewBox="0 0 300 120" className="w-full h-auto">
            <path
              id="hero-arc"
              d="M 20 110 A 130 130 0 0 1 280 110"
              fill="transparent"
            />
            <text
              className={`hero-arc-text ${isNightMode ? 'fill-white/80' : 'fill-[#1f1f1f]'}`}
            >
              <textPath href="#hero-arc" startOffset="50%" textAnchor="middle">
                TOGETHER WITH THEIR FAMILIES
              </textPath>
            </text>
          </svg>
            </div>

            {/* Names */}
            <div className="mt-2 sm:mt-4">
              <div className={`hero-name ${isNightMode ? 'text-white/90' : 'text-black'}`}>
                CINDY
              </div>
              <div className={`hero-and ${isNightMode ? 'text-white/80' : 'text-black'}`}>
                and
              </div>
              <div className={`hero-name ${isNightMode ? 'text-white/90' : 'text-black'}`}>
                JORGE
              </div>
            </div>

            {/* Decorative Line */}
            <div className={`mt-3 sm:mt-4 h-px w-10 ${isNightMode ? 'bg-white/60' : 'bg-black/70'}`} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-in-section {
          animation: fadeIn 1.5s ease-out forwards;
          opacity: 0;
        }
        .hero-arc-text {
          font-family: 'EB Garamond', serif;
          font-weight: 300;
          letter-spacing: 0.35em;
          font-size: 10px;
        }
        .hero-name {
          font-family: 'EB Garamond', serif;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-size: 40px;
          line-height: 1.05;
        }
        .hero-and {
          font-family: 'Mrs Saint Delafield', cursive;
          font-weight: 400;
          font-size: 28px;
          line-height: 1;
          margin-top: -6px;
          margin-bottom: -6px;
        }
        @media (min-width: 640px) {
          .hero-arc-text {
            font-size: 11px;
          }
          .hero-name {
            font-size: 48px;
          }
          .hero-and {
            font-size: 32px;
          }
        }
        @media (min-width: 768px) {
          .hero-arc-text {
            font-size: 12px;
          }
          .hero-name {
            font-size: 56px;
          }
          .hero-and {
            font-size: 36px;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
