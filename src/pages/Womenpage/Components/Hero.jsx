import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const [images, setImages] = useState({
    web: "",
    mobile: ""
  });

  const scrollToProducts = () => {
    navigate('/women');
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    // Fetch hero images
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get('https://steth-backend.onrender.com/api/hero-images/womens');
        if (response.data.success) {
          setImages({
            web: response.data.data.web.imageUrl,
            mobile: response.data.data.mobile.imageUrl
          });
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    // Initial animations
    const tl = gsap.timeline();

    // Animate hero container
    tl.fromTo(
      heroRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.inOut" }
    );

    // Animate background image
    tl.fromTo(
      imageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.4"
    );

    // Animate content
    tl.fromTo(
      contentRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.6"
    );

    // Animate heading 
    tl.fromTo(
      headingRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.5"
    );

    // Animate description
    tl.fromTo(
      descRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Animate buttons
    tl.fromTo(
      buttonsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // ScrollTrigger for parallax effect
    gsap.to(imageRef.current, {
      y: 50,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-[84vh] md:h-auto md:aspect-[16/9] font-poppins overflow-hidden">
      {/* Hero Background with responsive images */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          {/* Mobile Image */}
          <img 
            ref={imageRef}
            src={images.mobile} 
            alt="Medical professionals in scrubs" 
            className="md:hidden w-full h-full object-cover object-center"
          />
          {/* Desktop Image */}
          <img 
            src={images.web} 
            alt="Medical professionals in scrubs" 
            className="hidden md:block w-full h-full object-cover object-center"
          />
          
          {/* Bottom shadow gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Additional subtle vignette effect around the edges */}
          <div className="absolute inset-0 shadow-inner bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        </div>
      </div>
      
      {/* Hero Content Overlay */}
      <div className="relative h-full   mt-20 md:mt-0  flex flex-col items-center justify-center text-center px-4">
        <div 
          ref={contentRef} 
          className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 rounded-2xl max-w-3xl mx-auto transform hover:scale-105 transition-transform duration-300"
        >
          <h1 
            ref={headingRef} 
            className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg"
          >
            STETH WOMEN'S
          </h1>
          <h1 
            className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-white drop-shadow-lg"
          >
            COLLECTION
          </h1>
          <p 
            ref={descRef} 
            className="text-base sm:text-lg md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 text-white leading-relaxed px-2 sm:px-4 drop-shadow-md"
          >
            For the women who run the code and the wardrobe
          </p>
          <div 
            ref={buttonsRef} 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-2 sm:px-4"
          >
            <button 
              onClick={scrollToProducts}
              className="group relative sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-white text-sm sm:text-base font-medium uppercase tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl shadow-lg border-2 border-black"
              onMouseEnter={(e) => {
                gsap.to(e.target, {
                  scale: 1.05,
                  duration: 0.3,
                  ease: "power2.out"
                });
                gsap.to(e.target.querySelector('.button-shine'), {
                  x: '100%',
                  duration: 0.6,
                  ease: "power2.inOut"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.target, {
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out"
                });
                gsap.to(e.target.querySelector('.button-shine'), {
                  x: '-100%',
                  duration: 0.6,
                  ease: "power2.inOut"
                });
              }}
            >
              <span className="relative z-10 text-black">Shop Women</span>
              <div className="button-shine absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full"></div>
            </button>
          </div>
          <p 
            ref={descRef} 
            className="text-base sm:text-lg md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 text-white leading-relaxed px-2 sm:px-4 drop-shadow-md mt-5"
          >
            For doctors, by doctors
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;