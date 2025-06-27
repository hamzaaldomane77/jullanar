import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Offers = () => {
  const products = [
    {
      id: 1,
      name: "سماعات بلوتوث",
      price: 120,
      location: "صنعاء",
      status: "متاح",
      discount: 60,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      label: "عرض خاص"
    },
    {
      id: 2,
      name: "ساعة ذكية",
      price: 200,
      location: "عدن",
      status: "متاح",
      discount: 45,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      label: "عرض اليوم"
    },
    {
      id: 3,
      name: "مكبر صوت",
      price: 150,
      location: "تعز",
      status: "متاح",
      discount: 55,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
      label: "حصري"
    },
    {
      id: 4,
      name: "كاميرا رقمية",
      price: 300,
      location: "الحديدة",
      status: "متاح",
      discount: 35,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
      label: "توفير كبير"
    },
    {
      id: 5,
      name: "لوحة مفاتيح",
      price: 80,
      location: "إب",
      status: "متاح",
      discount: 50,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      label: "عرض خاص"
    },
    {
      id: 6,
      name: "ماوس لاسلكي",
      price: 40,
      location: "ذمار",
      status: "متاح",
      discount: 40,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
      label: "عرض محدود"
    },
    {
      id: 7,
      name: "شاشة كمبيوتر",
      price: 250,
      location: "عمران",
      status: "متاح",
      discount: 30,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
      label: "عرض الأسبوع"
    },
    {
      id: 8,
      name: "طابعة ليزر",
      price: 180,
      location: "المكلا",
      status: "متاح",
      discount: 45,
      image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
      label: "عرض مميز"
    }
  ];

  return (
    <section className="py-16bg-[#e5e5e5] overflow-hidden py-14 bg-[#e5e5e5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#a00000]">
          العروض
        </h2>
        <div className="text-center text-[#585D60] mx-auto mb-8">استكشف معنا اهم العروض المتوفرة في متجرنا</div>
        <div className="relative group">
          <style>
            {`
              .offers-navigation {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
                pointer-events: none;
                z-index: 10;
              }

              .offers-prev,
              .offers-next {
                position: absolute;
                width: 45px !important;
                height: 45px !important;
                background-color: #363636;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                pointer-events: auto;
              }

              .offers-prev {
                right: -60px;
              }

              .offers-next {
                left: -60px;
              }

              .offers-prev:hover,
              .offers-next:hover {
                background-color: #a00000;
                transform: scale(1.1);
              }

              .offers-prev svg,
              .offers-next svg {
                width: 24px;
                height: 24px;
                fill: white;
              }

              .offers-prev:disabled,
              .offers-next:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
              }

              @media (max-width: 1280px) {
                .offers-prev {
                  right: -20px;
                }
                .offers-next {
                  left: -20px;
                }
              }

              @media (max-width: 640px) {
                .offers-prev,
                .offers-next {
                  width: 35px !important;
                  height: 35px !important;
                }

                .offers-prev svg,
                .offers-next svg {
                  width: 20px;
                  height: 20px;
                }
              }
            `}
          </style>

          <div className="max-w-[90%] mx-auto relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: '.offers-prev',
                nextEl: '.offers-next'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              speed={800}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              dir="rtl"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 pb-3">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {/* Discount Badge */}
                      <div className="absolute top-4 left-4 bg-[#a00000] text-white px-2 py-1 rounded-md font-bold">
                        {product.discount}%
                      </div>
                      {/* Label */}
                      <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {product.label}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[#2b2b2b] mb-2">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#a00000] font-bold text-xl">
                          ${product.price}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {product.location}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-medium">
                          {product.status}
                        </span>
                        <button className="bg-[#2b2b2b] text-white px-4 py-1 rounded-md text-sm hover:bg-[#a00000] transition-colors duration-300">
                          اشتري الآن
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="offers-navigation">
              <button className="offers-prev" aria-label="السابق">
                <svg viewBox="0 0 24 24">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </button>
              <button className="offers-next" aria-label="التالي">
                <svg viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers; 