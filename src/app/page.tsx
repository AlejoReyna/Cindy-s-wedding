"use client"
import { useState, useEffect } from 'react';
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

export default function Home() {
  const [entered, setEntered] = useState(false);

  // Lock body scroll while splash is visible
  useEffect(() => {
    if (!entered) {
      document.body.style.overflow = 'hidden';
    } else {
      // Scroll to top before revealing content
      window.scrollTo(0, 0);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
  };

  return (
    <ThemeProvider>
      <SplashScreen onEnter={handleEnter} />
      <Navbar />
      <HeroSection entered={entered} />


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
