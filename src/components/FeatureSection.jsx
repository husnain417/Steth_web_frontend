import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Local icon imports
import FreeShippingIcon from '../assets/icons/2.png';
import Support247Icon from '../assets/icons/1.png';
import MoneyReturnIcon from '../assets/icons/3.png';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const FeatureSection = () => {
  const sectionRef = useRef(null);
  const featuresRef = useRef([]);

  useEffect(() => {
    const features = featuresRef.current;
    
    // Ensure GSAP animation works on both mobile and desktop
    const animationContext = gsap.context(() => {
      gsap.fromTo(
        features, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power2.out'
        }
      );
    }, sectionRef);

    // Cleanup function
    return () => animationContext.revert();
  }, []);

  const features = [
    {
      icon: FreeShippingIcon,
      title: 'Free Shipping',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed'
    },
    {
      icon: Support247Icon,
      title: 'Support 24/7',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed'
    },
    {
      icon: MoneyReturnIcon,
      title: 'Money Return',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="w-full px-4 py-8 md:py-16 bg-gray-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              ref={el => featuresRef.current[index] = el}
              className="flex flex-col items-center text-center text-black space-y-3 p-4 md:p-6 w-full"
            >
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <img 
                  src={feature.icon} 
                  alt={feature.title} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-base md:text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-black px-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;