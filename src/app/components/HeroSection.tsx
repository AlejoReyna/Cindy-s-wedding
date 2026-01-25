"use client"
import Image from 'next/image';
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
      <div className="flex flex-col items-center z-10 w-full px-4 text-center mt-8 sm:mt-12 md:mt-16 fade-in-section">
         {/* Monogram Logo */}
         <div className="mb-6 relative w-24 h-24 sm:w-32 sm:h-32 opacity-80">
           <Image
            src="/Diseño sin título.png"
             alt="Monograma"
             fill
             className={`object-contain ${isNightMode ? 'invert' : ''}`}
             priority
           />
         </div>

         {/* Names */}
         <h2 className={`text-lg sm:text-xl md:text-5xl tracking-[0.2em] uppercase ${isNightMode ? 'text-white/80' : 'text-[#5e5e5a]'} garamond-regular mb-8 sm:mb-12`}>
           Cindy <span className="mx-3 font-light">&</span> JORGE
         </h2>
         
         {/* Big Script Text */}
         <h1 className={`text-6xl sm:text-7xl md:text-8xl lg:text-5xl mrs-saint-delafield-regular ${isNightMode ? 'text-white' : 'text-[#2c2c28]'} leading-[0.8] sm:leading-[0.8] md:leading-[0.7] mb-8`}>
           Me and you.<br/>Just us two.
         </h1>
         
         {/* Date */}
         <p className={`text-base sm:text-lg md:text-xl tracking-[0.3em] ${isNightMode ? 'text-white/60' : 'text-[#5e5e5a]/90'} garamond-300 mt-6`}>
           22 . 08 . 2026
         </p>
      </div>

      {/* Image at bottom */}
      <div className="w-full h-[45vh] sm:h-[55vh] relative mt-auto">
         <div 
           className="absolute inset-0 bg-cover bg-top"
           style={{
             backgroundImage: `url('/hero.jpeg')`,
             maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
           }}
         />
      </div>

      <style jsx>{`
        .fade-in-section {
          animation: fadeIn 1.5s ease-out forwards;
          opacity: 0;
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
