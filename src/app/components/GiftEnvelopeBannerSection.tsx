"use client"
import { useEffect, useRef, useState } from 'react';

export default function GiftEnvelopeBannerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '-20px' }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`gift-envelope-section${isVisible ? ' gift-envelope-section--visible' : ''}`}
    >
      <div className="gift-envelope-section__inner">
        <p className="gift-envelope-section__eyebrow">Mesa de regalos</p>
        <p className="gift-envelope-section__presence">
          Su presencia es nuestro mejor regalo.
        </p>
        <p className="gift-envelope-section__text">
          Si desean tener un detalle adicional, una contribucion en sobre sera recibida con mucho cariño.
        </p>
        <span className="gift-envelope-section__line" />
        <div className="gift-envelope-section__options">
          <div className="gift-envelope-section__seal" aria-hidden="true">
            <svg viewBox="0 0 36 28" fill="none">
              <rect x="1" y="1" width="34" height="26" rx="2" stroke="currentColor" strokeWidth="1" />
              <path d="M1 2 L18 15 L35 2" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <p className="gift-envelope-section__or">ó</p>

          <div className="gift-envelope-section__bank-card">
            <p className="gift-envelope-section__bank-title">Transferencia bancaria</p>
            <div className="gift-envelope-section__bank-row">
              <span>Banco</span>
              <strong>BBVA</strong>
            </div>
            <div className="gift-envelope-section__bank-row">
              <span>CLABE</span>
              <strong>0125 8001 5127 6602 40</strong>
            </div>
            <div className="gift-envelope-section__bank-row">
              <span>Tarjeta</span>
              <strong>4152 3141 2145 2463</strong>
            </div>
            <div className="gift-envelope-section__bank-row">
              <span>Titular</span>
              <strong>Cindy Janeth Medina Sanchez</strong>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gift-envelope-section {
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          padding: 2.2rem 1.25rem;
          background: linear-gradient(135deg, #fbf9f6 0%, #f8f6f3 35%, #f5f2ee 70%, #f9f7f4 100%);
          border-top: 1px solid rgba(196, 152, 91, 0.2);
          border-bottom: 1px solid rgba(196, 152, 91, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(14px);
        }

        .gift-envelope-section--visible {
          animation: giftEnvelopeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .gift-envelope-section__inner {
          width: min(100%, 42rem);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }

        .gift-envelope-section__eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(139, 115, 85, 0.68);
          margin: 0;
        }

        .gift-envelope-section__presence {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.95rem;
          line-height: 1.1;
          letter-spacing: 0.03em;
          color: #5a4631;
          margin: 0;
        }

        .gift-envelope-section__text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 1.02rem;
          line-height: 1.8;
          color: rgba(92, 73, 50, 0.86);
          margin: 0;
          max-width: 34rem;
        }

        .gift-envelope-section__line {
          display: block;
          width: 3.3rem;
          height: 1px;
          margin-top: 0.2rem;
          background: linear-gradient(90deg, rgba(196, 152, 91, 0.45), rgba(139, 90, 43, 0.28));
        }

        .gift-envelope-section__options {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }

        .gift-envelope-section__seal {
          color: rgba(139, 115, 85, 0.58);
          width: 3.4rem;
          height: 2.55rem;
        }

        .gift-envelope-section__seal svg {
          width: 100%;
          height: 100%;
        }

        .gift-envelope-section__or {
          margin: 0.1rem 0 0.05rem;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.35rem;
          line-height: 1;
          color: rgba(122, 98, 69, 0.72);
        }

        .gift-envelope-section__bank-card {
          width: min(100%, 34rem);
          margin-top: 0.35rem;
          background: rgba(255, 255, 255, 0.36);
          border: 1px solid rgba(196, 152, 91, 0.14);
          border-radius: 12px;
          padding: 0.5rem 1rem;
          text-align: left;
        }

        .gift-envelope-section__bank-title {
          margin: 0.8rem 0 0.35rem;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.15rem;
          letter-spacing: 0.05em;
          color: #5a4631;
        }

        .gift-envelope-section__bank-row {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          padding: 0.65rem 0.4rem;
          border-bottom: 1px solid rgba(196, 152, 91, 0.1);
        }

        .gift-envelope-section__bank-row:last-child {
          border-bottom: none;
        }

        .gift-envelope-section__bank-row span {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(139, 115, 85, 0.75);
        }

        .gift-envelope-section__bank-row strong {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 1rem;
          letter-spacing: 0.02em;
          color: #3d2a14;
        }

        @media (min-width: 768px) {
          .gift-envelope-section {
            padding: 3rem 2rem;
          }

          .gift-envelope-section__options {
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
          }

          .gift-envelope-section__bank-card {
            margin-top: 0;
          }

          .gift-envelope-section__presence {
            font-size: 2.75rem;
          }
          .gift-envelope-section__text {
            font-size: 1.12rem;
          }
          .gift-envelope-section__bank-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
          }
          .gift-envelope-section__bank-row strong {
            text-align: right;
          }
        }

        @keyframes giftEnvelopeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
