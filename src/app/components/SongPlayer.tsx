"use client"
import { useState, useRef, useEffect } from 'react';

interface SongPlayerProps {
  loaded: boolean;
  delay: number;
  isNightMode?: boolean;
}

const SongPlayer = ({ loaded, delay, isNightMode }: SongPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Pause when component unmounts
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/snow-on-the-beach.mp3" loop />

      <div
        className={`song-player transition-all ease-out ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{
          transitionDuration: '1200ms',
          transitionDelay: `${delay}ms`,
        }}
      >
        <button
          onClick={togglePlay}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="song-player-pill"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {/* Equalizer bars or music note — left side */}
          <div className="song-player-icon-area">
            {isPlaying ? (
              <div className="equalizer">
                <span className="eq-bar" style={{ '--eq-delay': '0ms' } as React.CSSProperties} />
                <span className="eq-bar" style={{ '--eq-delay': '150ms' } as React.CSSProperties} />
                <span className="eq-bar" style={{ '--eq-delay': '80ms' } as React.CSSProperties} />
                <span className="eq-bar" style={{ '--eq-delay': '220ms' } as React.CSSProperties} />
              </div>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="song-player-note"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            )}
          </div>

          {/* Song info — center */}
          <div className="song-player-info">
            <span className="song-player-title">Snow on the Beach</span>
            <span className="song-player-artist">Taylor Swift</span>
          </div>

          {/* Play / Pause button — right */}
          <div className={`song-player-control ${isPlaying ? 'song-player-control--playing' : ''}`}>
            {isPlaying ? (
              /* Pause icon */
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              /* Play icon */
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </div>
        </button>
      </div>

      <style jsx>{`
        /* ═══════════════════════════════════════════════════════════
           SONG PLAYER — Spotify-like minimalist pill
           Positioned in HeroSection's bottom-right corner.
           Uses the project's glass / warm-cream design language.
        ═══════════════════════════════════════════════════════════ */

        .song-player {
          position: absolute;
          bottom: 2rem;
          right: 1.5rem;
          z-index: 20;
        }

        .song-player-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px 10px 12px;
          border-radius: 100px;
          cursor: pointer;
          border: 1px solid rgba(249, 246, 238, 0.22);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.10) 0%,
            rgba(255, 255, 255, 0.04) 100%
          );
          backdrop-filter: blur(20px) saturate(1.3);
          -webkit-backdrop-filter: blur(20px) saturate(1.3);
          box-shadow:
            0 4px 24px rgba(0, 0, 0, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          /* Reset button defaults */
          appearance: none;
          -webkit-appearance: none;
          color: #F9F6EE;
          text-align: left;
        }

        .song-player-pill:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.17) 0%,
            rgba(255, 255, 255, 0.08) 100%
          );
          border-color: rgba(249, 246, 238, 0.38);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(255, 255, 255, 0.06);
          transform: translateY(-1px) scale(1.01);
        }

        .song-player-pill:active {
          transform: translateY(0) scale(0.99);
        }

        /* ── Left icon area ──────────────────────────────────────── */
        .song-player-icon-area {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          opacity: 0.7;
        }

        .song-player-note {
          color: #F9F6EE;
        }

        /* ── Equalizer bars (animated when playing) ─────────────── */
        .equalizer {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }

        .eq-bar {
          display: block;
          width: 2.5px;
          border-radius: 2px;
          background: rgba(249, 246, 238, 0.85);
          animation: eqBounce 1.1s ease-in-out infinite alternate var(--eq-delay);
          height: 4px;
        }

        @keyframes eqBounce {
          0%   { height: 4px;  opacity: 0.5; }
          30%  { height: 10px; opacity: 0.9; }
          60%  { height: 6px;  opacity: 0.7; }
          100% { height: 14px; opacity: 1;   }
        }

        /* ── Song info (title + artist) ──────────────────────────── */
        .song-player-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .song-player-title {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 11.5px;
          letter-spacing: 0.06em;
          color: rgba(249, 246, 238, 0.95);
          white-space: nowrap;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          line-height: 1.2;
        }

        .song-player-artist {
          font-family: 'EB Garamond', 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 9.5px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(249, 246, 238, 0.50);
          white-space: nowrap;
          line-height: 1.2;
        }

        /* ── Play / Pause control circle ─────────────────────────── */
        .song-player-control {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          flex-shrink: 0;
          background: rgba(249, 246, 238, 0.14);
          border: 1px solid rgba(249, 246, 238, 0.25);
          transition: all 0.25s ease;
          margin-left: 2px;
          color: rgba(249, 246, 238, 0.90);
        }

        .song-player-pill:hover .song-player-control {
          background: rgba(249, 246, 238, 0.22);
          border-color: rgba(249, 246, 238, 0.45);
        }

        .song-player-control--playing {
          background: rgba(249, 246, 238, 0.18);
        }

        /* ── Responsive tweaks ───────────────────────────────────── */
        @media (max-width: 640px) {
          .song-player {
            bottom: 1.5rem;
            right: 1rem;
          }

          .song-player-pill {
            padding: 9px 12px 9px 10px;
            gap: 8px;
          }

          .song-player-title { font-size: 11px; }
          .song-player-artist { font-size: 9px; }
          .song-player-control { width: 24px; height: 24px; }
        }
      `}</style>
    </>
  );
};

export default SongPlayer;
