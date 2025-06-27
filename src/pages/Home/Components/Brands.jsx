import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Grid, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/effect-fade';

const Brands = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % 6);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      id: 1,
      title: 'الإلكترونيات',
      subtitle: 'أحدث الأجهزة الذكية',
      image: 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=800&auto=format&fit=crop&q=80',
      color: 'from-blue-600/90',
      size: 'lg:col-span-1 lg:row-span-1',
    },
    {
      id: 2,
      title: 'أحذية',
      subtitle: 'تصاميم رياضية عصرية',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      color: 'from-red-600/90',
      size: 'lg:col-span-2 lg:row-span-2',
    },
    {
      id: 3,
      title: 'هواتف',
      subtitle: 'أحدث الإصدارات',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
      color: 'from-purple-600/90',
      size: 'lg:col-span-1 lg:row-span-1',
    },
    {
      id: 4,
      title: 'كهربائيات',
      subtitle: 'شواحن متنقلة',
      image: 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=800&auto=format&fit=crop&q=80',
      color: 'from-green-600/90',
      size: 'lg:col-span-1 lg:row-span-1',
    },
    {
      id: 5,
      title: 'هواتف',
      subtitle: 'تجربة استخدام مميزة',
      image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format&fit=crop&q=80',
      color: 'from-indigo-600/90',
      size: 'lg:col-span-1 lg:row-span-1',
    },
    {
      id: 6,
      title: 'كهربائيات',
      subtitle: 'أجهزة منزلية ذكية',
      image: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=800&auto=format&fit=crop&q=80',
      color: 'from-teal-600/90',
      size: 'lg:col-span-1 lg:row-span-1',
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#7C0000]"> أبرز العلامات التجارية</h2>
      <div className="w-64 h-0.5 bg-[#7C0000] mx-auto mb-8"></div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-3 gap-6 h-auto">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 aspect-[4/3] ${
                activeIndex === index 
                  ? 'ring-2 ring-offset-2 ring-blue-500 shadow-2xl scale-[1.02] z-10' 
                  : 'hover:shadow-xl hover:scale-[1.02]'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="absolute inset-0 bg-black/20 z-10"></div>
              <img 
                src={category.image} 
                alt={category.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  activeIndex === index ? 'scale-110' : 'group-hover:scale-110'
                }`}
                loading="lazy"
              />
              <div 
                className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent transition-all duration-300 z-20 ${
                  activeIndex === index ? 'opacity-75' : 'opacity-60 group-hover:opacity-75'
                }`}
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-30">
                <h3 className={`text-white font-bold text-2xl mb-2 drop-shadow-lg text-center transform transition-transform duration-300 ${
                  activeIndex === index ? 'scale-105' : ''
                }`}>
                  {category.title}
                </h3>
                <p className="text-white/90 text-base drop-shadow-md mb-3 text-center transform transition-all duration-300 ${
                  activeIndex === index ? 'opacity-100' : 'opacity-90'
                }">
                  {category.subtitle}
                </p>
                <div className="w-full max-w-[200px] mx-auto h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className={`h-full bg-white rounded-full transition-all duration-700 ${
                    activeIndex === index ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <Swiper
            modules={[Grid, Autoplay, EffectFade]}
            grid={{
              rows: 2,
              fill: true
            }}
            spaceBetween={16}
            slidesPerView={2}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            className="h-[600px]"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div className="group h-full rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-white">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300 z-20`}
                    />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end z-30">
                      <h3 className="text-white text-lg font-bold mb-1 drop-shadow-lg text-center">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-sm drop-shadow-md text-center">
                        {category.subtitle}
                      </p>
                      <div className="w-full h-0.5 bg-white/30 rounded-full overflow-hidden mt-2">
                        <div className="w-0 h-full bg-white rounded-full transition-all duration-500 group-hover:w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Brands;
