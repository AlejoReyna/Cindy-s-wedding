"use client"
import { useState, useLayoutEffect, useRef } from 'react';
import LocationSection from './components/LocationSection';
// import GiftSection from './components/GiftSection'; // Hidden — merged into RSVPSection
import RSVPSection from './components/RSVPSection';
import MinimalistFooter from './components/Footer';
import ItinerarySection from './components/ItinerarySection';
import Navbar from './components/Navbar';
import Gallery3D from './components/Gallery3D';
import ParentsSection from './components/ParentsSection';
import DressCodeSection from './components/DressCodeSection';
import HotelsSection from './components/HotelsSection';
import GiftEnvelopeBannerSection from './components/GiftEnvelopeBannerSection';
import { ThemeProvider } from './context/ThemeContext';
import HeroSection from './components/HeroSection';
import SplashScreen from './components/SplashScreen';
import { useNotchColor } from '../hooks/useNotchColor';

const SESSION_KEY = 'cj_envelope_opened';

export default function Home() {
  const [entered, setEntered] = useState(false);
  // showSplash controls whether the SplashScreen component is mounted.
  // It stays true during the exit animation so the fade-out can play.
  const [showSplash, setShowSplash] = useState(true);
  // When true, hero skips animations and shows content immediately (refresh case).
  const [immediate, setImmediate] = useState(false);
  // Navbar stays hidden until the splash finishes its exit animation.
  const [navbarReady, setNavbarReady] = useState(false);

  // Notch / status-bar color per section.
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const parentsRef = useRef<HTMLElement>(null);
  const itineraryRef = useRef<HTMLElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const dressCodeRef = useRef<HTMLElement>(null);
  const giftRef = useRef<HTMLElement>(null);
  const hotelsRef = useRef<HTMLElement>(null);
  const rsvpRef = useRef<HTMLElement>(null);

  useNotchColor({
    refs: [
      heroRef,
      galleryRef,
      parentsRef,
      itineraryRef,
      locationRef,
      dressCodeRef,
      giftRef,
      hotelsRef,
      rsvpRef,
    ],
    colors: [
      '#9b9b9b',
      '#edeae4',
      '#f9f8f4',
      '#f8f6f3',
      '#f3ebe2',
      '#f3ebe2',
      '#fefefe',
      '#ffffff',
      '#7b7774',
    ],
    defaultColor: '#ffffff',
  });

  // ── Scroll lock helpers ──────────────────────────────────────────────────
  // `overflow: hidden` alone doesn't block scroll on iOS Safari.
  // Fixing the body at its current top position is the only reliable approach.
  const lockScroll = () => {
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  };

  const unlockScroll = () => {
    const top = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(top || '0') * -1);
  };

  // useLayoutEffect runs BEFORE the browser paints, so on refresh the splash
  // is removed and hero shows instantly — no flash.
  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      window.scrollTo(0, 0);
      unlockScroll();
      setEntered(true);
      setShowSplash(false);
      setImmediate(true);
      setNavbarReady(true);
    } else {
      lockScroll();
    }
    return () => {
      unlockScroll();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    // Start hero animations — but keep splash mounted for its exit animation.
    // SplashScreen handles its own unmounting via internal `hidden` state.
    setEntered(true);
    unlockScroll();
    // Show navbar once the splash exit animation is fully done (1400ms).
    setTimeout(() => setNavbarReady(true), 1400);
  };

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onEnter={handleEnter} />}
      <Navbar visible={navbarReady} />
      <section ref={heroRef}>
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#9b9b9b' }}
        />
        <HeroSection entered={entered} immediate={immediate} />
      </section>


      <section ref={galleryRef} id="galeria">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#edeae4' }}
        />
        <Gallery3D />
      </section>
      <section ref={parentsRef} id="padres">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#f9f8f4' }}
        />
        <ParentsSection />
      </section>
      <section ref={itineraryRef} id="itinerario">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#f8f6f3' }}
        />
        <ItinerarySection />
      </section>
      <section ref={locationRef} id="ubicacion">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#f3ebe2' }}
        />
        <LocationSection />
      </section>

      <section ref={dressCodeRef} id="dresscode">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#f3ebe2' }}
        />
        <DressCodeSection />
      </section>
      <section ref={giftRef} id="regalos">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#fefefe' }}
        />
        <GiftEnvelopeBannerSection />
      </section>
      <section ref={hotelsRef} id="hoteles">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#ffffff' }}
        />
        <HotelsSection />
      </section>
      <section ref={rsvpRef} id="rsvp">
        <div
          aria-hidden="true"
          className="safari-tint-sentinel"
          style={{ backgroundColor: '#7b7774' }}
        />
        <RSVPSection />
      </section>
      <div id="footer">
        <MinimalistFooter />
      </div>
    </ThemeProvider>
  );
}
