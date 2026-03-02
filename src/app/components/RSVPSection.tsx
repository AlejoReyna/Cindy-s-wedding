"use client"
import { useEffect, useRef, useState } from 'react';
import { useStatusBarSection } from '../../hooks/useStatusBarManager';
import { useTheme } from '../context/ThemeContext';

export default function RSVPSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showMessagePrompt, setShowMessagePrompt] = useState(false);

  const { isNightMode } = useTheme();

  const rsvpSectionRef = useStatusBarSection({
    sectionId: 'rsvp',
    color: '#4c4c48',
    defaultColor: isNightMode ? '#000000' : '#ffffff',
    isNightMode
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '-20px'
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = window.setTimeout(() => {
      setShowMessagePrompt(true);
    }, 3300);

    return () => window.clearTimeout(timeout);
  }, [isVisible]);

  return (
    <section
      ref={(el) => {
        sectionRef.current = el as HTMLDivElement;
        if (rsvpSectionRef) {
          (rsvpSectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }
      }}
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center py-16 md:py-24"
      style={{
        backgroundImage: `url('/hands.JPG')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.22) 100%)'
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10 px-5 w-full flex flex-col items-center gap-10 md:gap-14">
        <div className={`text-center transition-all duration-[1600ms] ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="draw-wrap">
            <p className={`draw-text rsvp-script-text ${
              isVisible ? 'animate-draw' : ''
            }`}>
              Con amor, los esperamos
            </p>
          </div>
        </div>

        <div className={`w-full max-w-xl transition-all duration-[900ms] ease-out ${
          showMessagePrompt ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}>
          <p className="garamond-regular text-center text-base md:text-lg text-white/85 mb-5">
            Si deseas dejarnos un mensaje para esta aventura...
          </p>

          <div className={`message-box ${showMessagePrompt ? 'message-box--visible' : ''}`}>
            <span className={`message-border ${showMessagePrompt ? 'message-border--draw' : ''}`} />
            <span className={`message-bg ${showMessagePrompt ? 'message-bg--visible' : ''}`} />
            <textarea
              name="wedding-message"
              rows={4}
              placeholder="Escribe aqui tu mensaje..."
              className={`message-input w-full px-5 py-4 bg-transparent text-white text-sm md:text-base garamond-regular placeholder-white/45 focus:outline-none resize-none ${
                showMessagePrompt ? 'message-input--visible' : ''
              }`}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .rsvp-script-text {
          font-family: 'Mrs Saint Delafield', cursive;
          font-weight: 400;
          font-size: clamp(3rem, 8vw, 5.25rem);
          line-height: 1;
          color: rgba(249, 246, 238, 0.95);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.38);
        }

        .draw-wrap {
          display: inline-block;
          overflow: hidden;
          max-width: 100%;
          min-height: clamp(3rem, 8vw, 5.25rem);
        }

        .draw-text {
          width: 0;
          white-space: nowrap;
          overflow: hidden;
          color: rgba(255, 255, 255, 0.9);
          border-right: 1px solid rgba(255, 255, 255, 0.75);
          margin: 0 auto;
        }

        .animate-draw {
          animation: draw-script 2.8s ease forwards, caret-blink 700ms steps(1, end) 5, caret-hide 0.1s linear 3.2s forwards;
          animation-delay: 350ms;
        }

        @keyframes draw-script {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes caret-blink {
          0%, 49% {
            border-right-color: rgba(255, 255, 255, 0.75);
          }
          50%, 100% {
            border-right-color: transparent;
          }
        }

        @keyframes caret-hide {
          to {
            border-right-color: transparent;
            border-right-width: 0;
          }
        }

        .message-box {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .message-border {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          --msg-border-angle: 0deg;
          -webkit-mask-image: conic-gradient(from -90deg at 50% 50%, #000 var(--msg-border-angle), transparent 0);
          mask-image: conic-gradient(from -90deg at 50% 50%, #000 var(--msg-border-angle), transparent 0);
          opacity: 0;
          pointer-events: none;
        }

        .message-border--draw {
          animation: msgBorderAppear 0.01s linear forwards, msgBorderDraw 0.9s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }

        .message-bg {
          position: absolute;
          inset: 1px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(3px);
          opacity: 0;
          pointer-events: none;
        }

        .message-bg--visible {
          animation: msgBgIn 0.45s ease-out 0.75s forwards;
        }

        .message-input {
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(12px) scale(0.98);
          clip-path: inset(0 0 100% 0);
        }

        .message-input--visible {
          animation: msgInputReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards;
        }

        @keyframes msgBorderAppear {
          to { opacity: 1; }
        }

        @keyframes msgBorderDraw {
          from { --msg-border-angle: 0deg; }
          to { --msg-border-angle: 360deg; }
        }

        @keyframes msgBgIn {
          to { opacity: 1; }
        }

        @keyframes msgInputReveal {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
            clip-path: inset(0 0 100% 0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>
    </section>
  );
}
