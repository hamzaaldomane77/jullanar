import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Grid, EffectFade } from 'swiper/modules';
import { fetchBrands } from '../../../services/api';
import SwiperErrorBoundary from '../../../components/SwiperErrorBoundary';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/effect-fade';

const Brands = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsInitialized(false);
        
        const brandsData = await fetchBrands();
        if (Array.isArray(brandsData) && brandsData.length > 0) {
          setBrands(brandsData);
          // Wait for DOM to update before initializing
          setTimeout(() => setIsInitialized(true), 100);
        } else {
          setBrands([]);
        }
      } catch (err) {
        setError(err.message);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  useEffect(() => {
    if (brands.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % brands.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [brands.length]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#7C0000]">أبرز العلامات التجارية</h2>
          <div className="w-64 h-0.5 bg-[#7C0000] mx-auto mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#7C0000]">أبرز العلامات التجارية</h2>
          <div className="w-64 h-0.5 bg-[#7C0000] mx-auto mb-8"></div>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#7C0000]">أبرز العلامات التجارية</h2>
          <div className="w-64 h-0.5 bg-[#7C0000] mx-auto mb-8"></div>
          <div className="text-center py-8">
            <p className="text-gray-600">لا توجد علامات تجارية متوفرة حالياً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#7C0000]">أبرز العلامات التجارية</h2>
        <div className="w-64 h-0.5 bg-[#7C0000] mx-auto mb-8"></div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 aspect-square ${
                activeIndex === index 
                  ? 'ring-2 ring-offset-2 ring-red-500 shadow-2xl scale-[1.02] z-10' 
                  : 'hover:shadow-xl hover:scale-[1.02]'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="absolute inset-0 bg-black/20 z-10"></div>
              <img 
                src={brand.image_url} 
                alt={brand.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  activeIndex === index ? 'scale-110' : 'group-hover:scale-110'
                }`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=400&h=400&fit=crop';
                }}
              />
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-red-600/90 to-transparent transition-all duration-300 z-20 ${
                  activeIndex === index ? 'opacity-75' : 'opacity-60 group-hover:opacity-75'
                }`}
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-30">
                <h3 className={`text-white font-bold text-xl mb-2 drop-shadow-lg text-center transform transition-transform duration-300 ${
                  activeIndex === index ? 'scale-105' : ''
                }`}>
                  {brand.name}
                </h3>
                <div className="w-full max-w-[150px] mx-auto h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className={`h-full bg-white rounded-full transition-all duration-700 ${
                    activeIndex === index ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {isInitialized && brands.length > 0 && (
          <SwiperErrorBoundary>
          <Swiper
            key={`brands-swiper-${brands.length}-${isInitialized ? 'init' : 'loading'}`}
            ref={swiperRef}
            modules={[Grid, Autoplay]}
            grid={{
              rows: 2,
              fill: 'row'
            }}
            spaceBetween={16}
            slidesPerView={2}
            autoplay={brands.length > 4 ? {
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            } : false}
            speed={800}
            className="h-[400px]"
            loop={false}
            watchOverflow={true}
            observer={true}
            observeParents={true}
            onSwiper={(swiper) => {
              try {
                if (swiper && brands.length > 0) {
                  // Store swiper instance for future reference
                  swiperRef.current = swiper;
                  // Small delay to ensure DOM is ready
                  setTimeout(() => {
                    if (swiper && !swiper.destroyed) {
                      swiper.update();
                    }
                  }, 200);
                }
              } catch (error) {
                console.warn('Swiper initialization warning:', error);
              }
            }}
            onInit={(swiper) => {
              try {
                if (swiper && brands.length > 0) {
                  swiper.update();
                }
              } catch (error) {
                console.warn('Swiper init warning:', error);
              }
            }}
            onBeforeDestroy={(swiper) => {
              try {
                if (swiperRef.current === swiper) {
                  swiperRef.current = null;
                }
              } catch (error) {
                console.warn('Swiper destroy warning:', error);
              }
            }}
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <Link 
                  to={`/brands/${brand.slug}`}
                  className="group h-full rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-white block"
                >
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    <img 
                      src={brand.image_url} 
                      alt={brand.name}
                      className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=400&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300 z-20" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end z-30">
                      <h3 className="text-white text-base font-bold mb-1 drop-shadow-lg text-center">
                        {brand.name}
                      </h3>
                      <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden mt-2">
                        <div className="w-0 h-full bg-white rounded-full transition-all duration-500 group-hover:w-full" />
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          </SwiperErrorBoundary>
          )}
        </div>

        {/* View All Brands Button */}
        <div className="text-center mt-8">
          <Link
            to="/brands"
            className="inline-block bg-[#7C0000] text-white px-8 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
          >
            عرض جميع العلامات التجارية
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Brands;
