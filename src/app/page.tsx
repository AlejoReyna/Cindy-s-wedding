"use client"
import LocationSection from './components/LocationSection';
import GiftSection from './components/GiftSection';
import RSVPSection from './components/RSVPSection';
import MinimalistFooter from './components/Footer';
import ItinerarySection from './components/ItinerarySection';
import Navbar from './components/Navbar';
import Gallery3D from './components/Gallery3D';
import ParentsSection from './components/ParentsSection';
import DressCodeSection from './components/DressCodeSection';
import { ThemeProvider } from './context/ThemeContext';
import HeroSection from './components/HeroSection';

export default function Home() {
  return (
    <ThemeProvider>
      <Navbar />
      <HeroSection />
      
      
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
      
    
      <div id="regalos">
        <GiftSection />
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