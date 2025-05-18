import React, { useEffect } from 'react';
import Header from '../../components/Header';
import Hero from './Components/Hero';
import BestSellers from './Components/WomenBestSellers';
import FeatureSection from '../../components/FeatureSection';
import MensBestSellers from './Components/MensBestSeller';
import RewardsCTA from '../../components/DiscountOffers';
import NewsletterSignup from '../../components/NewsletterSignup';
import ColorTileCarousel from './Components/ColorTileCarousal';
import ColorTileSlider from './Components/ColorTile';
import AwsomeHumansFooter from '../../components/Footer';
import RegistrationPopup from './Components/PopUp'; // Import the new popup component

const Homepage = ({ children }) => {
  // Add fonts and styles directly without API calls
  useEffect(() => {
    // Add local styles to fix layout issues and add fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-300.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-regular.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-500.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-600.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-700.woff2') format('woff2');
      }
      
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden;
      }
      
      .font-poppins {
        font-family: 'Poppins', sans-serif;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="font-poppins min-h-screen flex flex-col w-full bg-white">
      <Header />
      <Hero />
      <ColorTileCarousel />
      <BestSellers />
      <MensBestSellers />
      <RewardsCTA />
      <FeatureSection />
      <NewsletterSignup />
      <AwsomeHumansFooter />
      <main className="flex-grow">{children}</main>
      <RegistrationPopup /> {/* Add the popup component here */}
    </div>
  );
};

export default Homepage;