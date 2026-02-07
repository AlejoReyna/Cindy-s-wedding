"use client"
import { useEffect, useRef, useState } from 'react';
import { MdDirections } from 'react-icons/md';
import Image from 'next/image';
import receptionImg from '../../../assets/museum.jpg';

interface LocationData {
  label: string;
  venue: string;
  address: string;
  city: string;
  mapsUrl: string;
  image: string | typeof receptionImg;
  imageAlt: string;
}

const locations: LocationData[] = [
  {
    label: 'Ceremonia Religiosa',
    venue: 'Parroquia Maria Auxiliadora',
    address: 'Calle 3 8-72',
    city: 'Cartago, Valle del Cauca',
    mapsUrl: 'https://maps.app.goo.gl/3q4Q1',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Templo_Parroquial_Sagrado_Coraz%C3%B3n_de_Jes%C3%BAs.jpg/330px-Templo_Parroquial_Sagrado_Coraz%C3%B3n_de_Jes%C3%BAs.jpg',
    imageAlt: 'Ceremonia religiosa - Iglesia Sagrado Corazón',
  },
  {
    label: 'Recepción',
    venue: 'Casa Museo del Virrey',
    address: 'Cra. 4 #13-130',
    city: 'Cartago, Valle del Cauca',
    mapsUrl: 'https://maps.app.goo.gl/w1R1',
    image: receptionImg,
    imageAlt: 'Recepción - Casa Museo del Virrey',
  },
];

export default function LocationSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Header fade-in ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setHeaderVisible(true);
        });
      },
      { threshold: 0.2, rootMargin: '-40px' }
    );

    const ref = headerRef.current;
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, []);

  // ── Staggered card reveals ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            setTimeout(() => {
              setVisibleCards((prev) => new Set([...prev, idx]));
            }, idx * 250);
          }
        });
      },
      { threshold: 0.12, rootMargin: '-30px' }
    );

    const refs = cardRefs.current;
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section
      className="min-h-screen w-full py-24 md:py-32 px-4 md:px-8 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%)',
      }}
    >
      {/* Subtle organic texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 20%, rgba(196,152,91,0.15) 0%, transparent 60%),
                              radial-gradient(circle at 75% 60%, rgba(139,115,85,0.12) 0%, transparent 60%),
                              radial-gradient(circle at 50% 90%, rgba(180,147,113,0.1) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ═══ Header ═══ */}
        <div
          ref={headerRef}
          className={`text-center mb-20 md:mb-24 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Location pin icon */}
          <div className="flex justify-center mb-8">
            <svg
              className="w-8 h-8 text-[#8B7355]/35"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase text-[#5c5c5c] mb-6 garamond-300">
            Ubicaciones
          </h2>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C4985B]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C4985B]/40" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C4985B]/50" />
          </div>
        </div>

        {/* ═══ Location cards ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {locations.map((loc, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              data-index={index}
              className={`group transition-all duration-800 ease-out ${
                index === 1 ? 'md:mt-14' : ''
              } ${
                visibleCards.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Card container */}
              <div
                className="overflow-hidden transition-shadow duration-500 group-hover:shadow-lg"
                style={{
                  borderRadius: '3px',
                  boxShadow: '0 4px 20px rgba(139,115,85,0.08)',
                }}
              >
                {/* ── Image area ── */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={loc.image}
                    alt={loc.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Bottom gradient — blends image into content area */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, #f3ede6 0%, rgba(243,237,230,0.5) 40%, transparent 100%)',
                    }}
                  />
                </div>

                {/* ── Content area ── */}
                <div
                  className="px-6 py-8 md:px-8 md:py-10 text-center"
                  style={{ backgroundColor: '#f3ede6' }}
                >
                  {/* Label */}
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#8B7355]/40 mb-4 garamond-300">
                    {loc.label.toUpperCase()}
                  </p>

                  {/* Venue name */}
                  <h3 className="text-xl md:text-2xl font-light tracking-[0.06em] text-[#5c5c5c] mb-4 garamond-300">
                    {loc.venue}
                  </h3>

                  {/* Address */}
                  <p className="text-xs tracking-[0.04em] text-[#8B7355]/45 font-light mb-1">
                    {loc.address}
                  </p>
                  <p className="text-xs tracking-[0.04em] text-[#8B7355]/40 font-light mb-7">
                    {loc.city}
                  </p>

                  {/* Gold accent line */}
                  <div className="w-8 h-[1px] bg-[#C4985B]/25 mx-auto mb-7" />

                  {/* Maps button */}
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-2.5 px-6 py-2.5 border border-[#8B7355]/15 text-[#8B7355]/55 hover:text-[#8B7355] hover:border-[#8B7355]/35 transition-all duration-400"
                  >
                    <MdDirections className="text-base transition-transform duration-300 group-hover/btn:rotate-12" />
                    <span className="text-[11px] tracking-[0.15em] uppercase font-light garamond-300">
                      Ver en Maps
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
