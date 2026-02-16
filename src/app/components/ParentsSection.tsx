"use client"

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

export default function ParentsSection() {
  const [step, setStep] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && step === 0) {
          setStep(1)
        }
      },
      { threshold: 0.25, rootMargin: '-30px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, []) // Removí la dependencia de `step`

  /* Cascade: each step triggers the next */
  useEffect(() => {
    if (step === 0 || step > 5) return
    const delay = step === 1 ? 100 : 350
    const timer = setTimeout(() => setStep((s) => s + 1), delay)
    return () => clearTimeout(timer)
  }, [step])

  return (
    <section 
      ref={sectionRef}
      className="min-h-[50vh] w-full py-24 px-4 md:px-8 relative overflow-hidden flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)'
      }}
    >
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
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="galleryPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path 
                d="M20,20 Q40,30 60,20 Q80,10 100,25" 
                stroke="#8B7355" 
                strokeWidth="0.5" 
                fill="none" 
                opacity="0.3"
              />
              <circle cx="30" cy="25" r="1" fill="#C4985B" opacity="0.2"/>
              <circle cx="70" cy="22" r="0.8" fill="#9B8366" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#galleryPattern)"/>
        </svg>
      </div>

      <div className="text-center z-10">

        {/* ── Step 1: Monogram (fade + gentle scale) ── */}
        <div
          className={`mx-10 flex justify-center items-center mb-8 transition-all duration-[1600ms] ease-out ${
            step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <Image
            src="/Diseño sin título.png"
            alt="Monograma"
            width={80}
            height={80}
            className="object-contain opacity-40"
          />
        </div>

        {/* ── Step 2: Main text (reveal from beneath) ── */}
        <div className="mx-10 flex justify-center items-center">
          <div className="relative">
            <p
              className={`text-lg md:text-xl font-light tracking-[0.1em] uppercase mb-12 text-[#8B7355] italic garamond-300 max-w-4xl transition-all duration-[1800ms] ease-out ${
                step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Con el amor,
              <br/>
              la bendición de Dios,
              <br/> y de nuestros padres.
            </p>
          </div>
        </div>

        {/* ── Step 3: Decorative divider (scale from center) ── */}
        <div
          className={`flex items-center justify-center gap-3 mb-10 transition-all duration-[1400ms] ease-out ${
            step >= 3 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        >
          <span className="block w-12 h-[0.5px] bg-[#C4985B]/40" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#C4985B]/35" />
          <span className="block w-12 h-[0.5px] bg-[#C4985B]/40" />
        </div>

        {/* ── Steps 4 & 5: Parent cards (staggered left/right) ── */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Vertical divider */}
          <div
            className={`absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C4985B]/30 to-transparent transform -translate-x-1/2 hidden md:block transition-all duration-[1200ms] ease-out ${
              step >= 4 ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            }`}
          />
          
          {/* Bride's parents — slides from left */}
          <div
            className={`text-center transition-all duration-[1600ms] ease-out ${
              step >= 4 ? 'opacity-100 translate-x-0' : 'opacity-0 md:-translate-x-8'
            }`}
          >
            <h3 className="text-2xl font-semibold tracking-widest uppercase text-[#5c5c5c] mb-4 garamond-300">Padres de la novia</h3>
            <p className="text-lg text-stone-600 garamond-300">María Magdalena Sánchez Ibarra</p>
            <p className="text-lg text-stone-600 garamond-300">Jorge Medina López</p>
          </div>

          {/* Groom's parents — slides from right, slightly delayed */}
          <div
            className={`text-center transition-all duration-[1600ms] ease-out ${
              step >= 5 ? 'opacity-100 translate-x-0' : 'opacity-0 md:translate-x-8'
            }`}
          >
            <h3 className="text-2xl font-semibold tracking-widest uppercase text-[#5c5c5c] mb-4 garamond-300">Padres del novio</h3>
            <p className="text-lg text-stone-600 garamond-300"> Patricia Perez Hernandez</p>
            <p className="text-lg text-stone-600 garamond-300"> Jorge Alberto González Rodriguez</p>
          </div>
        </div>
      </div>
    </section>
  );
} 
