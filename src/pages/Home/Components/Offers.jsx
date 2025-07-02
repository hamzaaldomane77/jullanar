import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { fetchOffersProducts } from '../../../services/api';
import { useCart } from '../../../contexts/CartContext';
import toast from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadOffersProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const offersData = await fetchOffersProducts();
        setProducts(offersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOffersProducts();
  }, []);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=800',
      quantity: 1
    };
    
    addToCart(cartItem);
    toast.success(`تم إضافة ${product.name} إلى السلة`);
  };

  const calculateDiscountPercentage = (price, oldPrice) => {
    if (!oldPrice || oldPrice === "0.00" || parseFloat(oldPrice) <= parseFloat(price)) {
      return 0;
    }
    const discount = ((parseFloat(oldPrice) - parseFloat(price)) / parseFloat(oldPrice)) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#e5e5e5] overflow-hidden">
        <div className="container mx-auto ">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#a00000]">العروض</h2>
          <div className="text-center text-[#585D60] mx-auto mb-8">استكشف معنا اهم العروض المتوفرة في متجرنا</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12 my-12 max-w-[90%] mx-auto">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md z-20 relative overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-[#e5e5e5] overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#a00000]">العروض</h2>
          <div className="text-center text-[#585D60] mx-auto mb-8">استكشف معنا اهم العروض المتوفرة في متجرنا</div>
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

  if (loading) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#a00000]">العروض</h2>
          <div className="text-center text-[#585D60] mx-auto mb-8">استكشف معنا اهم العروض المتوفرة في متجرنا</div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a00000]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#a00000]">العروض</h2>
          <div className="text-center text-[#585D60] mx-auto mb-8">استكشف معنا اهم العروض المتوفرة في متجرنا</div>
          <div className="text-center py-8">
            <p className="text-gray-600">{error || "لا توجد عروض متوفرة حالياً"}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
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
              key={`offers-swiper-${products.length}`}
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: '.offers-prev',
                nextEl: '.offers-next',
                enabled: products.length > 0
              }}
              autoplay={products.length > 4 ? {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              } : false}
              speed={800}
              loop={products.length > 4}
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
              watchOverflow={true}
              observer={true}
              observeParents={true}
              onSwiper={(swiper) => {
                // Ensure swiper is properly initialized
                if (swiper && products.length > 0) {
                  setTimeout(() => {
                    swiper.update();
                  }, 100);
                }
              }}
            >
              {products.map((product) => {
                const discountPercentage = calculateDiscountPercentage(product.price, product.old_price);
                const productImage = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=800';
                
                return (
                  <SwiperSlide key={product.id}>
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="relative">
                          <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=800';
                            }}
                          />
                          {/* Discount Badge */}
                          {discountPercentage > 0 && (
                            <div className="absolute top-4 left-4 bg-[#a00000] text-white px-2 py-1 rounded-md font-bold">
                              {discountPercentage}%
                            </div>
                          )}
                          {/* Offer Label */}
                          <div className="absolute bottom-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                            عرض خاص
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-bold text-[#2b2b2b] mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex flex-col">
                              <span className="text-[#a00000] font-bold text-lg">
                                {parseFloat(product.price).toLocaleString()} ل.س
                              </span>
                              {product.old_price && product.old_price !== "0.00" && (
                                <span className="text-gray-500 text-sm line-through">
                                  {parseFloat(product.old_price).toLocaleString()} ل.س
                                </span>
                              )}
                            </div>
                            <span className="text-gray-600 text-sm">
                              {product.brand}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-green-600 font-medium text-sm">
                              متوفر
                            </span>
                       
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
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