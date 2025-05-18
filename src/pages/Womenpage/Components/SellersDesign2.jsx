import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Product data with placeholder images
const bestSellingProducts = [
  {
    id: 1,
    name: 'High Waisted Isabel Wide Leg Scrub Pants',
    price: 58.00,
    image: '/src/assets/product/product_img1.png',
    colors: ['purple', 'blue', 'black', 'gray'],
    isNew: true
  },
  {
    id: 2,
    name: 'Catarina One-Pocket Scrub Top™',
    price: 38.00,
    image: '/src/assets/product/product_img2.png',
    colors: ['mint', 'gray', 'blue', 'black'],
    isNew: false
  },
  {
    id: 3,
    name: 'Catarina One-Pocket Scrub Top™',
    price: 38.00,
    image: '/src/assets/product/product_img3.png',
    colors: ['gray', 'mint', 'blue', 'black'],
    isNew: false
  },
  {
    id: 4,
    name: 'High Waisted Isabel Wide Leg Scrub Pants',
    price: 58.00,
    image: '/src/assets/product/product_img4.png',
    colors: ['blue', 'purple', 'black', 'gray'],
    isNew: true
  },
  {
    id: 5,
    name: 'Rafaela Oversized Scrub Top™',
    price: 38.00,
    image: '/src/assets/product/product_img5.png',
    colors: ['purple', 'blue', 'black', 'gray'],
    isNew: false
  },
  {
    id: 6,
    name: 'Rafaela Oversized Scrub Top™',
    price: 38.00,
    image: '/src/assets/product/product_img1.png',
    colors: ['purple', 'blue', 'black', 'gray'],
    isNew: false
  },
  {
    id: 7,
    name: 'Rafaela Oversized Scrub Top™',
    price: 38.00,
    image: '/src/assets/product/product_img2.png',
    colors: ['purple', 'blue', 'black', 'gray'],
    isNew: false
  }
];

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    
    gsap.fromTo(card, 
      { 
        y: 20,
        opacity: 0 
      },
      { 
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div ref={cardRef} className="group cursor-pointer w-full h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full aspect-[2.5/4] mb-4 bg-[#F8F8F8] overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full">
            NEW
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="px-1 mt-auto">
        <h3 className="text-base font-medium mb-2 text-gray-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-base font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const BestSellers = () => {
  return (
    <section className="py-16 overflow-hidden bg-white">
      <div className="max-w-[90%] mx-auto">
        {/* Title with left padding matching the layout */}
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 px-6 md:px-12">
          Women's Best Sellers
        </h2>

        {/* Swiper Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={24}
            slidesPerView={5}
            freeMode={true}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            className="!pl-6 md:!pl-12"
            wrapperClass="!items-stretch"
            style={{
              overflow: 'visible'
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 15
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 20
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24
              }
            }}
            initialSlide={0}
            observeParents={true}
            observer={true}
          >
            {bestSellingProducts.map((product) => (
              <SwiperSlide 
                key={product.id}
                className="!h-auto " // Increased width and added spacing
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;