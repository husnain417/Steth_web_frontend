import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import back3 from '../../../assets/back3.jpeg';
import finalBack from '../../../assets/final_back.jpg';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

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
    <section ref={heroRef} className="relative w-full h-[90vh] font-poppins overflow-hidden">
      {/* Hero Background with responsive images */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          {/* Mobile Image */}
          <img 
            ref={imageRef}
            src={back3} 
            alt="Medical professionals in scrubs" 
            className="md:hidden w-full h-full object-cover object-center"
          />
          {/* Desktop Image */}
          <img 
            src={finalBack} 
            alt="Medical professionals in scrubs" 
            className="hidden md:block w-full h-full object-cover object-center"
          />
          {/* Enhanced gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
          {/* Additional shadow overlay */}
          <div className="absolute inset-0 shadow-inner-2xl bg-black/20"></div>
        </div>
      </div>
      
      {/* Hero Content Overlay */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div 
          ref={contentRef} 
          className=" py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 rounded-2xl max-w-3xl mx-auto transform hover:scale-105 transition-transform duration-300"
        >
          <h1 
            ref={headingRef} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 text-white drop-shadow-lg"
          >
            THE STETH SET
          </h1>
          <p 
            ref={descRef} 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 text-white leading-relaxed px-2 sm:px-4 drop-shadow-md"
          >
            Conquer the day in our premium scrubs, crafted to be softer than your consultant’s heart.
          </p>
          <div 
            ref={buttonsRef} 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-2 sm:px-4"
          >
            <a 
              href="/women" 
              className="group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-black text-white text-sm sm:text-base font-medium uppercase tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl shadow-lg"
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
              <span className="relative z-10">Shop Women</span>
              <div className="button-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"></div>
            </a>
            <a 
              href="/men" 
              className="group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white text-black text-sm sm:text-base font-medium uppercase tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl shadow-lg border-2 border-black"
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
              <span className="relative z-10">Shop Men</span>
              <div className="button-shine absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full"></div>
            </a>
          </div>
          <p 
            ref={descRef} 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 text-white leading-relaxed px-2 sm:px-4 drop-shadow-mdtext-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 text-white leading-relaxed px-2 sm:px-4 drop-shadow-md mt-5"
          >
            For doctors, by doctors
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;