"use client";

import ItineraryItemCard from './ItineraryItemCard';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

interface ItineraryItem {
  time: string;
  displayTime: string;
  title: string;
  description: string;
  location?: string;
}

// ═══════════════════════════════════════════════════════════════════
//  PETAL CANVAS
//  Pétalos minimalistas (lágrima bezier) cayendo con drift sinusoidal.
//  Se activan al entrar la sección en viewport y pausan al salir.
//  pointer-events: none, z-index 5 (entre fondo z-3 y contenido z-10).
// ═══════════════════════════════════════════════════════════════════

const PETAL_COUNT  = 22
const PETAL_COLORS = ['#f4b8c8', '#f0a0b8', '#fad4df', '#e8899e', '#f7c9d4']
const PETAL_ALPHA  = 0.14

interface Petal {
  x: number; y: number
  vx: number; vy: number
  size: number
  ratio: number
  angle: number
  spin: number
  swayAmp: number
  swayFreq: number
  swayOffset: number
  colorIdx: number
  time: number
}

function makePetal(W: number, H: number, init: boolean): Petal {
  return {
    x:          init ? Math.random() * W : -15 + Math.random() * (W + 30),
    y:          init ? Math.random() * H : -20,
    vx:         (Math.random() - 0.5) * 0.3,
    vy:         0.3 + Math.random() * 0.5,
    size:       6.875 + Math.random() * 12.375,
    ratio:      0.32 + Math.random() * 0.28,
    angle:      Math.random() * Math.PI * 2,
    spin:       (Math.random() - 0.5) * 0.022,
    swayAmp:    16 + Math.random() * 26,
    swayFreq:   0.005 + Math.random() * 0.007,
    swayOffset: Math.random() * Math.PI * 2,
    colorIdx:   Math.floor(Math.random() * PETAL_COLORS.length),
    time:       Math.random() * 1000,
  }
}

function tickPetal(p: Petal, dt: number, H: number): boolean {
  p.time  += dt
  p.angle += p.spin * dt
  p.x     += p.vx * dt + Math.sin(p.time * p.swayFreq + p.swayOffset) * 0.3
  p.y     += p.vy * dt
  return p.y > H + 25
}

function paintPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  const a = p.size
  const b = p.size * p.ratio
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.angle)
  ctx.beginPath()
  ctx.moveTo(0, -a)
  ctx.bezierCurveTo( b * 1.15, -a * 0.45,  b,  a * 0.35,  0,  a * 0.55)
  ctx.bezierCurveTo(-b,         a * 0.35, -b * 1.15, -a * 0.45, 0, -a)
  ctx.fillStyle = PETAL_COLORS[p.colorIdx]
  ctx.fill()
  ctx.restore()
}

// ═══════════════════════════════════════════════════════════════════
//  COMPONENTE
// ═══════════════════════════════════════════════════════════════════

export default function ItinerarySection() {
  const containerRef    = useRef<HTMLDivElement>(null)
  const cardsRef        = useRef<HTMLDivElement>(null)
  const cardWrapperRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef      = useRef<HTMLElement>(null)
  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const rafRef          = useRef<number>(0)
  const petalsRef       = useRef<Petal[]>([])
  const lastTimeRef     = useRef<number>(0)
  const activeRef       = useRef(false)

  const [activeIndex, setActiveIndex] = useState(0)

  // ── card activa por scroll ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight
      let maxVis = -1, newActive = 0
      cardWrapperRefs.current.forEach((ref, i) => {
        if (!ref) return
        const r   = ref.getBoundingClientRect()
        const vis = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0))
        const ratio = r.height > 0 ? vis / r.height : 0
        if (ratio > maxVis) { maxVis = ratio; newActive = i }
      })
      setActiveIndex(newActive)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // ── loop RAF ──────────────────────────────────────────────────────
  const loop = useCallback((now: number) => {
    if (!activeRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dt  = Math.min((now - lastTimeRef.current) / 16.67, 3)
    lastTimeRef.current = now

    const dpr = window.devicePixelRatio || 1
    const W   = canvas.width  / dpr
    const H   = canvas.height / dpr

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.globalAlpha = PETAL_ALPHA

    for (let i = 0; i < petalsRef.current.length; i++) {
      if (tickPetal(petalsRef.current[i], dt, H)) {
        petalsRef.current[i] = makePetal(W, H, false)
      }
      paintPetal(ctx, petalsRef.current[i])
    }

    ctx.restore()
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  const startPetals = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || activeRef.current) return
    const dpr = window.devicePixelRatio || 1
    const W   = canvas.offsetWidth
    const H   = canvas.offsetHeight
    canvas.width  = W * dpr
    canvas.height = H * dpr
    petalsRef.current   = Array.from({ length: PETAL_COUNT }, () => makePetal(W, H, true))
    activeRef.current   = true
    lastTimeRef.current = performance.now()
    rafRef.current      = requestAnimationFrame(loop)
  }, [loop])

  const stopPetals = useCallback(() => {
    activeRef.current = false
    cancelAnimationFrame(rafRef.current)
  }, [])

  // ── resize ────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      if (!canvas || !activeRef.current) return
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── IntersectionObserver ──────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startPetals()
        else stopPetals()
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { observer.disconnect(); stopPetals() }
  }, [startPetals, stopPetals])

  // ── data ──────────────────────────────────────────────────────────
  const itineraryItems: ItineraryItem[] = useMemo(() => [
    { time: "4:30 PM", displayTime: "4:30", title: "Misa",                   description: "", location: "" },
    { time: "6:00 PM", displayTime: "6:00", title: "Cocktail de Bienvenida", description: "", location: "" },
    { time: "6:30 PM", displayTime: "6:30", title: "Ceremonia Civil",        description: "", location: "" },
    { time: "7:30 PM", displayTime: "7:30", title: "Recepción",              description: "", location: "" },
  ], [])

  // ── render ────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full pt-0 pb-14 sm:pt-8 sm:pb-20 md:py-24 px-4 md:px-8 relative transition-all duration-1000 ease-in-out"
      style={{
        background: 'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      {/* Fondo radial sutil */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ zIndex: 3 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(196,152,91,0.15) 0%, transparent 60%),
                              radial-gradient(circle at 70% 60%, rgba(139,115,85,0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180,147,113,0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* ── Canvas de pétalos ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
      />

      {/* ── Contenido ── */}
      <div className="max-w-6xl mx-auto relative pt-14 md:pt-4" style={{ zIndex: 10 }}>

        <div
          className="text-center mb-10 sm:mb-12 md:mb-16 transition-all duration-2000 ease-out opacity-100 translate-y-0"
          style={{ transitionDelay: '200ms' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.1em] uppercase mt-0 sm:mt-3 md:mt-6 mb-6 garamond-300 text-[#8B7355]">
            Itinerario
          </h2>
          <div className="w-24 h-px mx-auto mb-2 bg-[#C4985B] opacity-60" />
        </div>

        <div ref={containerRef} className="max-w-4xl mx-auto relative">
          {/* Línea vertical desktop */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-px transition-all duration-500 opacity-60 hidden md:block"
            style={{ backgroundColor: '#C4985B', top: '3rem', height: 'calc(100% - 6rem)', zIndex: 1 }}
          />
          {/* Línea vertical mobile */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-px transition-all duration-500 opacity-40 bg-gradient-to-b from-[#C4985B] via-[#8B7355] to-[#C4985B] md:hidden"
            style={{ top: '2rem', height: 'calc(100% - 4rem)', zIndex: 1 }}
          />

          {/* Dots mobile */}
          <div className="md:hidden">
            {itineraryItems.map((_, index) => (
              <div
                key={index}
                className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 z-10"
                style={{ top: `${3 + index * 20}rem` }}
              >
                <div className="w-full h-full rounded-full border-2 shadow-lg transition-colors duration-500 bg-white border-[#947e63]/60">
                  <div className="absolute inset-1 rounded-full transition-colors duration-500 bg-[#947e63]/40" />
                </div>
              </div>
            ))}
          </div>

          <div ref={cardsRef} className="space-y-16 sm:space-y-20 md:space-y-32 relative z-10">
            {itineraryItems.map((item, index) => (
              <div
                key={index}
                ref={(el) => { cardWrapperRefs.current[index] = el }}
              >
                <ItineraryItemCard item={item} index={index} isActive={index === activeIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .celestial-transition { transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes celestial-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          25%      { transform: translateY(-8px) rotate(1deg); }
          50%      { transform: translateY(-12px) rotate(0deg); }
          75%      { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes fade-celestial {
          0%,100% { opacity: 0.8; }
          50%      { opacity: 1; }
        }
        @keyframes sun-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-celestial-float { animation: celestial-float 6s ease-in-out infinite; }
        .animate-fade-celestial  { animation: fade-celestial 4s ease-in-out infinite; }
        .animate-sun-rotate      { animation: sun-rotate 20s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          canvas { display: none !important; }
        }
      `}</style>
    </section>
  )
}
