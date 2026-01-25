import { useEffect, useRef, useState } from 'react';
import { MdDirections } from 'react-icons/md';
import Image from 'next/image';

// Import images from assets - ajustando rutas
import receptionImg from '../../../assets/museum.jpg';

export default function LocationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.15, rootMargin: '-20px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  // Decorative floral elements matching the project style
  const FloralDecoration = ({ className = "" }) => (
    <svg className={`w-full h-full ${className}`} viewBox="0 0 80 80" fill="none">
      <path 
        d="M10,40 Q25,20 40,40 Q55,60 70,40 Q55,20 40,40 Q25,60 10,40" 
        stroke="#8B7355" 
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      <path d="M25,35 Q30,25 35,35 Q30,45 25,35" fill="#9B8366" opacity="0.5"/>
      <path d="M45,45 Q50,35 55,45 Q50,55 45,45" fill="#C4985B" opacity="0.4"/>
    </svg>
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full py-24 px-4 md:px-8 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)'
      }}
    >
      {/* Subtle organic texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(196, 152, 91, 0.15) 0%, transparent 60%),
                              radial-gradient(circle at 70% 60%, rgba(139, 115, 85, 0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180, 147, 113, 0.1) 0%, transparent 60%)`
          }}
        />
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="locationPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path 
                d="M20,20 Q40,30 60,20 Q80,10 100,25" 
                stroke="#8B7355" 
                strokeWidth="0.5" 
                fill="none" 
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#locationPattern)"/>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with elegant styling */}
        <div className={`text-center mb-20 transition-all duration-2000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`} style={{ transitionDelay: '200ms' }}>
          
          {/* Decorative top element */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 opacity-40">
              <FloralDecoration />
            </div>
          </div>
          
          {/* Main title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase text-[#5c5c5c] mb-8 garamond-300 relative">
            Ubicaciones
          </h2>

          {/* Decorative line */}
          <div className="w-100 h-px mx-auto mb-6 bg-[#C4985B] opacity-60"></div>
        </div>

        {/* Side decorative elements */}
        <div className="absolute left-8 top-1/3 w-12 h-12 opacity-20 hidden lg:block">
          <FloralDecoration />
        </div>
        <div className="absolute right-8 top-2/3 w-12 h-12 opacity-20 hidden lg:block">
          <FloralDecoration className="transform rotate-180" />
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-20 max-w-[1500px] mx-auto">
          
          {/* Ceremonia Card */}
          <div
            className={`group transition-all duration-2500 ease-out h-[550px] md:h-[600px] ${
              isVisible ? 'opacity-100 translate-y-0 md:translate-x-4' : 'opacity-0 translate-y-8 translate-x-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            {/* FRAME + PAPER SURFACE (reemplaza el cuadro blanco) */}
            <div className="card-frame h-full relative overflow-hidden">
                {/* Imagen de fondo que cubre toda la card */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Templo_Parroquial_Sagrado_Coraz%C3%B3n_de_Jes%C3%BAs.jpg/330px-Templo_Parroquial_Sagrado_Coraz%C3%B3n_de_Jes%C3%BAs.jpg"
                    alt="Ceremonia religiosa - Iglesia Sagrado Corazón" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay oscuro para legibilidad - Se ilumina al hover (menos opacidad) */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-all duration-700"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                    <div className="accent-bar" aria-hidden />
                    
                    {/* Content Section - Ahora sobre la imagen */}
                    <div className="p-10 md:p-12 text-center relative flex-grow flex flex-col justify-center items-center text-white">
                      
                      {/* Decorative top icon/text */}
                      <div className="mb-6 opacity-80">
                        <div className="w-12 h-px bg-white/60 mx-auto mb-3"></div>
                        <p className="text-xs tracking-[0.2em] uppercase font-light">LUGAR DE CEREMONIA</p>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wide drop-shadow-md" style={{fontFamily: 'Georgia, serif'}}>
                        Ceremonia religiosa
                      </h3>

                      {/* Location Info */}
                      <div className="space-y-2 mb-10 text-white/90">
                        <p className="text-xl font-medium tracking-wide drop-shadow-sm">
                          Parroquia Maria Auxiliadora
                        </p>
                        <p className="text-sm leading-relaxed font-light opacity-90">
                          Calle 3 8-72
                        </p>
                        <p className="text-sm font-light opacity-90">
                          Cartago, Valle del Cauca
                        </p>
                      </div>
                      
                      {/* Action Button - Estilo transparente/blanco */}
                      <div className="mt-4">
                        <a 
                          href="https://maps.app.goo.gl/3q4Q1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-3 px-8 py-3 border border-white/50 text-white hover:bg-white/10 transition-all duration-400 relative overflow-hidden backdrop-blur-sm"
                        >
                          <MdDirections className="text-lg relative z-10 rotate-12 transition-transform duration-300" />
                          <span className="font-light tracking-[0.1em] uppercase text-sm relative z-10">Ver en Maps</span>
                        </a>
                      </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Recepción Card */}
          <div
            className={`group transition-all duration-2500 ease-out h-[550px] md:h-[600px] ${
              isVisible ? 'opacity-100 translate-y-0 md:-translate-x-4' : 'opacity-0 translate-y-8 translate-x-0'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <div className="card-frame h-full relative overflow-hidden">
                {/* Imagen de fondo que cubre toda la card */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={receptionImg} 
                    alt="Recepción" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay oscuro para legibilidad - Se ilumina al hover (menos opacidad) */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-all duration-700"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                    <div className="accent-bar" aria-hidden />
                    
                    {/* Content Section */}
                    <div className="p-10 md:p-12 text-center relative flex-grow flex flex-col justify-center items-center text-white">
                      
                      {/* Decorative top icon/text */}
                      <div className="mb-6 opacity-80">
                        <div className="w-12 h-px bg-white/60 mx-auto mb-3"></div>
                        <p className="text-xs tracking-[0.2em] uppercase font-light">LUGAR DE RECEPCIÓN</p>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wide drop-shadow-md" style={{fontFamily: 'Georgia, serif'}}>
                        Recepción
                      </h3>

                      {/* Location Info */}
                      <div className="space-y-2 mb-10 text-white/90">
                        <p className="text-xl font-medium tracking-wide drop-shadow-sm">
                          Casa Museo del Virrey
                        </p>
                        <p className="text-sm leading-relaxed font-light opacity-90">
                          Cra. 4 #13-130
                        </p>
                        <p className="text-sm font-light opacity-90">
                          Cartago, Valle del Cauca
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <a 
                          href="https://maps.app.goo.gl/w1R1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-3 px-8 py-3 border border-white/50 text-white hover:bg-white/10 transition-all duration-400 relative overflow-hidden backdrop-blur-sm"
                        >
                          <MdDirections className="text-lg relative z-10 rotate-12 transition-transform duration-300" />
                          <span className="font-light tracking-[0.1em] uppercase text-sm relative z-10">Ver en Maps</span>
                        </a>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
       
      </div>

      <style jsx>{`
        /* ====== NUEVO LOOK ELEGANTE PARA LAS CARDS ====== */
        .card-frame {
          position: relative;
          border-radius: 22px;
          padding: 1px; /* finísimo borde */
          background: linear-gradient(
            135deg,
            rgba(196, 152, 91, 0.65),
            rgba(139, 115, 85, 0.55) 45%,
            rgba(180, 147, 113, 0.6)
          );
          box-shadow:
            0 10px 24px -12px rgba(0,0,0,0.2),
            0 0 0 1px rgba(0,0,0,0.03) inset;
          transition: transform 400ms ease, box-shadow 400ms ease, opacity 400ms ease;
        }
        .card-frame:hover {
          box-shadow:
            0 20px 60px -20px rgba(0,0,0,0.28),
            0 0 0 1px rgba(0,0,0,0.04) inset;
        }

        /* Barra superior “filo dorado” para remate de lujo */
        .accent-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #C4985B, #8B7355, #C4985B);
          opacity: .8;
          z-index: 20;
        }

        @keyframes fadeInSeparate {
          0% { opacity: 0; transform: translateY(20px) translateX(0); }
          70% { opacity: 1; transform: translateY(0) translateX(0); }
          100% { opacity: 1; transform: translateY(0) translateX(var(--final-x, 0)); }
        }
        
        @media (max-width: 768px) {
          .md\\:translate-x-4,
          .md\\:-translate-x-4 {
            transform: translateY(0) translateX(0) !important;
          }
        }
      `}</style>
    </section>
  );
}
