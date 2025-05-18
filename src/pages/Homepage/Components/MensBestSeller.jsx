import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const imageContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

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
        duration: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const imageContainer = imageContainerRef.current;
    if (isHovered) {
      gsap.to(imageContainer, {
        '--hover-progress': 1,
        duration: 0.3,
        ease: "power1.inOut"
      });
    } else {
      gsap.to(imageContainer, {
        '--hover-progress': 0,
        duration: 0.3,
        ease: "power1.inOut"
      });
    }
  }, [isHovered, isLoaded]);

  const handleImagesLoaded = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (!product.defaultImages || product.defaultImages.length < 2) return;
    
    const img1 = new Image();
    const img2 = new Image();
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        handleImagesLoaded();
      }
    };

    img1.onload = checkAllLoaded;
    img2.onload = checkAllLoaded;
    img1.onerror = handleImageError;
    img2.onerror = handleImageError;
    img1.src = product.defaultImages[0].url;
    img2.src = product.defaultImages[1].url;
  }, [product.defaultImages]);

  const handleClick = () => {
    console.log('Product clicked:', product);
    console.log('Navigating to product ID:', product._id);
    navigate(`/product/${product._id}`);
  };

  return (
    <div 
      ref={cardRef} 
      className="group cursor-pointer w-full h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div 
        ref={imageContainerRef}
        className="relative w-full aspect-[2.5/4] mb-4 bg-[#F8F8F8] overflow-hidden rounded-lg"
        style={{
          '--hover-progress': 0
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Base Image */}
        {product.defaultImages && product.defaultImages[0] && (
          <img
            src={product.defaultImages[0].url}
            alt={product.defaultImages[0].alt}
            className="absolute inset-0 w-full h-full object-cover object-center z-10"
            style={{
              transform: `translateX(calc(-100% * var(--hover-progress)))`,
              transition: 'transform 0.8s ease-in-out'
            }}
            onError={handleImageError}
          />
        )}

        {/* Hover Image */}
        {product.defaultImages && product.defaultImages[1] && (
          <img
            src={product.defaultImages[1].url}
            alt={product.defaultImages[1].alt}
            className="absolute inset-0 w-full h-full object-cover object-center z-9"
            style={{
              transform: `translateX(calc(100% * (1 - var(--hover-progress))))`,
              transition: 'transform 0.8s ease-in-out'
            }}
            onError={handleImageError}
          />
        )}

        {/* Fallback content when images fail to load */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <p className="text-gray-500 text-sm">Image not available</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="px-1 mt-auto">
          <h3 className="text-base font-medium mb-2 text-gray-900 leading-tight">
            {product.name}
          </h3>
          <p className="text-base font-bold text-gray-900">
            Rs.{(product.price)}
          </p>
        </div>
    </div>
  );
};

const MenBestSellers = () => {
  const [swiper, setSwiper] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://steth-backend.onrender.com/api/products?gender=Men');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('Error fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-[90%] mx-auto px-4 md:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-[90%] mx-auto px-4 md:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[90%] mx-auto px-4 md:px-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
          Men's
        </h2>

        {/* Swiper Container */}
        {isMounted && (
          <div className="relative">
            <Swiper
              modules={[FreeMode, Mousewheel]}
              spaceBetween={24}
              slidesPerView="auto"
              freeMode={{
                enabled: true,
                momentum: true,
                momentumRatio: 0.5,
              }}
              mousewheel={{
                forceToAxis: true,
              }}
              onSwiper={setSwiper}
              className="!overflow-visible"
              breakpoints={{
                0: {
                  slidesPerView: 1.2,
                  spaceBetween: 16
                },
                480: {
                  slidesPerView: 2.2,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 3.2,
                  spaceBetween: 24
                },
                1024: {
                  slidesPerView: 4.2,
                  spaceBetween: 24
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 24
                }
              }}
              watchOverflow={true}
              observer={true}
              observeParents={true}
              resizeObserver={true}
            >
              {products.map((product) => (
                <SwiperSlide 
                  key={product._id}
                  className="!h-auto"
                >
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenBestSellers;