"use client"
import { useRef } from 'react';
import { useState } from 'react';
import { withBasePath } from '@/lib/basePath';

export default function RSVPSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);


  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(
          135deg,
          rgba(22, 16, 12, 0.62) 0%,
          rgba(28, 21, 16, 0.54) 35%,
          rgba(34, 25, 18, 0.5) 70%,
          rgba(22, 16, 12, 0.62) 100%
        ), url('${withBasePath('/hands.JPG')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-[30%] min-h-[280px] z-10 flex items-center justify-center px-5 md:px-8 pb-5 md:pb-8">
        <div className="max-w-3xl mx-auto w-full">
          <p className="rsvp-message">
          Tu presencia hará aún más especial este día.
          </p>

          <form
            className="rsvp-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setMessage('');
              setTimeout(() => setSent(false), 2200);
            }}
          >
            <p className="rsvp-form-title">
            Nos hará muy felices leer tu mensaje en este momento único
            </p>

            {!sent && (
              <>
                <div className="rsvp-input-bar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 20h4l9.8-9.8a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4Z"
                      stroke="rgba(247,239,226,0.82)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m13.5 6.5 4 4"
                      stroke="rgba(247,239,226,0.82)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>

                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="rsvp-input"
                  />
                </div>

                <button type="submit" className="rsvp-send-btn">
                  Enviar
                </button>
              </>
            )}

            <p className={`rsvp-send-feedback ${sent ? 'rsvp-send-feedback--visible' : ''}`}>
              Enviado con éxito.
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .rsvp-message {
          text-align: center;
          color: rgba(255, 255, 255, 0.95);
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 5.2vw, 3.4rem);
          font-weight: 300;
          letter-spacing: 0.04em;
          line-height: 1.25;
          text-wrap: balance;
          text-shadow:
            0 4px 16px rgba(18, 12, 7, 0.35),
            0 1px 2px rgba(18, 12, 7, 0.22);
        }

        .rsvp-form {
          margin: 1.9rem auto 0;
          max-width: 44rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .rsvp-form-title {
          text-align: center;
          color: rgba(255, 255, 255, 0.9);
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2.1vw, 1.18rem);
          font-weight: 400;
          line-height: 1.35;
          letter-spacing: 0.02em;
          margin: 0;
        }

        .rsvp-input-bar {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.48);
          padding: 0.25rem 0.1rem 0.55rem;
        }

        .rsvp-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.96);
          font-size: 1rem;
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: 0.02em;
        }

        .rsvp-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .rsvp-send-btn {
          margin-top: 0.2rem;
          border: 1px solid rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.96);
          border-radius: 999px;
          padding: 0.42rem 1.45rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.86rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: background 220ms ease, transform 220ms ease;
        }

        .rsvp-send-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          transform: translateY(-1px);
        }

        .rsvp-send-feedback {
          margin: 0.2rem 0 0;
          color: rgba(247, 239, 226, 0.92);
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 260ms ease, transform 260ms ease;
        }

        .rsvp-send-feedback--visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
