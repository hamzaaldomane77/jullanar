import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import nikelogo from '../../../assets/png-clipart-swoosh-nike-logo-brand-top-nike-emblem-company 1.png';
import pumalogo from '../../../assets/puma 2.png';
import lvlogo from '../../../assets/lv 1.png';
import chanellogo from '../../../assets/chanel 1.png';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "سارة أحمد",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      role: "مصممة أزياء",
      review: "تجربة تسوق رائعة! المنتجات أصلية وذات جودة عالية. سعيدة جداً بالخدمة والتوصيل السريع.",
      logo: nikelogo
    },
    {
      id: 2,
      name: "محمد خالد",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      role: "مدير تقني",
      review: "منصة موثوقة للتسوق الإلكتروني. أسعار تنافسية ومنتجات عالية الجودة.",
      logo: pumalogo
    },
    {
      id: 3,
      name: "نور علي",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      role: "مؤثرة على مواقع التواصل",
      review: "أفضل موقع للتسوق عبر الإنترنت. خيارات متنوعة وخدمة عملاء ممتازة.",
      logo: lvlogo
    },
    {
      id: 4,
      name: "عمر حسن",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      role: "رائد أعمال",
      review: "تجربة تسوق استثنائية! سهولة في التصفح والشراء مع ضمان جودة المنتجات.",
      logo: chanellogo
    }
  ];

  return (
    <section className="py-16  overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#7C0000]">أراء العملاء</h2>
        <div className="w-40 h-0.5 bg-[#7C0000] mx-auto mb-8"></div>
        
        <div className="relative">
          <style>
            {`
              .swiper-pagination-bullet {
                width: 12px !important;
                height: 12px !important;
                background: #d1d5db !important;
                opacity: 0.5 !important;
                transition: all 0.3s ease;
              }
              .swiper-pagination-bullet-active {
                background: #7C0000 !important;
                opacity: 1 !important;
                transform: scale(1.2);
              }
            `}
          </style>
          
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.swiper-custom-pagination',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              }
            }}
            className="mb-4"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="pb-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 relative h-full">
                  <div className="absolute opacity-5 -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                    <img
                      src={review.logo}
                      alt="Brand Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-6 relative">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#0B171F] mb-2">
                      {review.name}
                    </h3>
                    
                    <p className="text-[#7C0000] font-medium mb-4">
                      {review.role}
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {review.review}
                    </p>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-[#7C0000]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-custom-pagination flex justify-center gap-2 mt-4"></div>
        </div>
      </div>
    </section>
  );
};

export default Reviews; 