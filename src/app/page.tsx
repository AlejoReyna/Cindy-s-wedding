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
  const heroRef    = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);

  useNotchColor({
    refs:         [heroRef, galleryRef],
    colors:       ['#9b9b9b', '#eceae4'],
    defaultColor: '#ffffff',
  });

  // useLayoutEffect runs BEFORE the browser paints, so on refresh the splash
  // is removed and hero shows instantly — no flash.
  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      window.scrollTo(0, 0);
      document.body.style.overflow = '';
      setEntered(true);
      setShowSplash(false);
      setImmediate(true);
      setNavbarReady(true);
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    // Start hero animations — but keep splash mounted for its exit animation.
    // SplashScreen handles its own unmounting via internal `hidden` state.
    setEntered(true);
    document.body.style.overflow = '';
    // Show navbar once the splash exit animation is fully done (1400ms).
    setTimeout(() => setNavbarReady(true), 1400);
  };

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onEnter={handleEnter} />}
      <Navbar visible={navbarReady} />
      <section ref={heroRef}>
        <HeroSection entered={entered} immediate={immediate} />
      </section>


      <section ref={galleryRef} id="galeria">
        <Gallery3D />
      </section>
      <ParentsSection />
      <div id="itinerario">
        <ItinerarySection />
      </div>
      <div id="ubicacion">
        <LocationSection />
      </div>

      <div id="dresscode">
        <DressCodeSection />
      </div>
      <HotelsSection />
      <div id="regalos">
        <GiftEnvelopeBannerSection />
      </div>
      <div id="rsvp">
        <RSVPSection />
      </div>
      <div id="footer">
        <MinimalistFooter />
      </div>
    </ThemeProvider>
  );
}
