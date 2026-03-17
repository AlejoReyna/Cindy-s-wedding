"use client"
import { useState, useEffect, useLayoutEffect } from 'react';
import LocationSection from './components/LocationSection';
// import GiftSection from './components/GiftSection'; // Hidden — merged into RSVPSection
import RSVPSection from './components/RSVPSection';
import MinimalistFooter from './components/Footer';
import ItinerarySection from './components/ItinerarySection';
import Navbar from './components/Navbar';
import Gallery3D from './components/Gallery3D';
import ParentsSection from './components/ParentsSection';
import DressCodeSection from './components/DressCodeSection';
import { ThemeProvider } from './context/ThemeContext';
import HeroSection from './components/HeroSection';
import SplashScreen from './components/SplashScreen';

const SESSION_KEY = 'cj_envelope_opened';

export default function Home() {
  const [entered, setEntered] = useState(false);
  // showSplash controls whether the SplashScreen component is mounted.
  // It stays true during the exit animation so the fade-out can play.
  const [showSplash, setShowSplash] = useState(true);
  // When true, hero skips animations and shows content immediately (refresh case).
  const [immediate, setImmediate] = useState(false);

  // useLayoutEffect runs BEFORE the browser paints, so on refresh the splash
  // is removed and hero shows instantly — no flash.
  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      window.scrollTo(0, 0);
      document.body.style.overflow = '';
      setEntered(true);
      setShowSplash(false);
      setImmediate(true);
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
  };

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onEnter={handleEnter} />}
      <Navbar />
      <HeroSection entered={entered} immediate={immediate} />


      <div id="galeria">
        <Gallery3D />
      </div>
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


      {/* GiftSection hidden — content merged into RSVPSection */}
      {/* <div id="regalos"><GiftSection /></div> */}
      <div id="rsvp">
        <RSVPSection />
      </div>
      <div id="footer">
        <MinimalistFooter />
      </div>
    </ThemeProvider>
  );
}
