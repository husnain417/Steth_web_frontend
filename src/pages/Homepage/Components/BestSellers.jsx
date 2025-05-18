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

// Import product images
import product1Img1 from '../../../assets/product/product1_img1.png';
import product1Img2 from '../../../assets/product/product1_img2.png';
import product2Img1 from '../../../assets/product/product2_img1.png';
import product2Img2 from '../../../assets/product/product2_img2.png';
import product3Img1 from '../../../assets/product/product3_img1.png';
import product3Img2 from '../../../assets/product/product3_img2.png';
import product4Img1 from '../../../assets/product/product4_img1.png';
import product4Img2 from '../../../assets/product/product4_img2.png';
import product5Img1 from '../../../assets/product/product5_img1.png';

const products = [
  {
    id: 1,
    name: "Premium Medical Scrubs",
    brand: "STETH",
    price: 2999,
    rating: 4.8,
    reviews: 128,
    colors: ["#1E3A8A", "#1E40AF", "#1E3A8A"],
    images: [product1Img1, product1Img2],
  },
  {
    id: 2,
    name: "Comfort Fit Nursing Shoes",
    brand: "STETH",
    price: 2499,
    rating: 4.6,
    reviews: 95,
    colors: ["#1E3A8A", "#1E40AF", "#1E3A8A"],
    images: [product2Img1, product2Img2],
  },
  {
    id: 3,
    name: "Professional Lab Coat",
    brand: "STETH",
    price: 1999,
    rating: 4.7,
    reviews: 156,
    colors: ["#1E3A8A", "#1E40AF", "#1E3A8A"],
    images: [product3Img1, product3Img2],
  },
  {
    id: 4,
    name: "Medical Face Masks",
    brand: "STETH",
    price: 499,
    rating: 4.5,
    reviews: 89,
    colors: ["#1E3A8A", "#1E40AF", "#1E3A8A"],
    images: [product4Img1, product4Img2],
  },
  {
    id: 5,
    name: "Surgical Gloves",
    brand: "STETH",
    price: 299,
    rating: 4.4,
    reviews: 112,
    colors: ["#1E3A8A", "#1E40AF", "#1E3A8A"],
    images: [product5Img1, product5Img1],
  },
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
    <div ref={cardRef} className="group cursor-pointer w-full">
      {/* Image Container */}
      <div className="relative aspect-[3/4] mb-4 bg-[#F8F8F8] overflow-hidden rounded-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full  object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full">
            NEW
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="px-1">
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
        <h2 className="text-2xl md:text-3xl font-bold  text-black mb-8 px-6 md:px-12">
          Women's Best Sellers
        </h2>

        {/* Swiper Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={24}
            slidesPerView="auto"
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
              320: {
                slidesPerView: 1.2,
                spaceBetween: 15
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 20
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 24
              },
              1280: {
                slidesPerView: 4.2,
                spaceBetween: 24
              }
            }}
          >
            {products.map((product) => (
              <SwiperSlide 
                key={product.id}
                className="!h-auto"
                style={{ width: '300px' }}
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
