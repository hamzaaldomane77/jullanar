import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { findProductBySlug } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, isInCart, getCartItem, formatPrice } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll use mock data since we need to integrate with the existing API
      // In a real implementation, you would fetch the product by slug from the API
      const mockProduct = {
        id: 1,
        name: 'جوارب السماح',
        slug: 'goarb-alsmah',
        description: 'جوارب السماح عالية الجودة مصنوعة من أفضل الخامات',
        price: '86000.00',
        old_price: '96000.00',
        featured: false,
        brand: 'ماما هيام',
        categories: ['جوارب'],
        images: [
          'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800',
          'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800',
          'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800'
        ]
      };
      
      setProduct(mockProduct);
    } catch (err) {
      console.error('Error loading product:', err);
      setError('فشل في تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    
    // Show success toast
    toast.success(`تمت إضافة ${quantity} من ${product.name} إلى السلة`, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#fff',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif'
      },
      icon: '🛒',
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    toast.success('تم إضافة المنتج إلى السلة وتحويلك للدفع', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#059669',
        color: '#fff',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif'
      },
      icon: '💳',
    });
    
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h2>
            <p className="text-gray-600 mb-8">{error || 'لم يتم العثور على المنتج المطلوب'}</p>
            <Link 
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة إلى المنتجات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.old_price && product.old_price !== '0.00' 
    ? Math.round(((parseFloat(product.old_price) - parseFloat(product.price)) / parseFloat(product.old_price)) * 100)
    : 0;

  const cartItem = getCartItem(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                الرئيسية
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link to="/products" className="text-gray-500 hover:text-gray-700 mr-1 md:mr-2">
                  المنتجات
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 mr-1 md:mr-2 font-medium">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden relative">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=صورة+غير+متوفرة';
                }}
              />
              {product.featured && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-medium">
                  مميز
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                  -{discount}%
                </div>
              )}
              {inCart && (
                <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-medium">
                  في السلة ({cartItem.quantity})
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 rtl:space-x-reverse">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                <span className="text-3xl font-bold text-[#7C0000]">
                  {formatPrice(product.price)}
                </span>
                {product.old_price && product.old_price !== '0.00' && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.old_price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    توفير {discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Brand */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">الماركة</h3>
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {product.brand}
              </span>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">الفئات</h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">الكمية</h3>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {inCart ? `إضافة ${quantity} المزيد إلى السلة` : `إضافة ${quantity} إلى السلة`}
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                اشتري الآن
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                شحن مجاني للطلبات فوق 50,000 ل.س
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ضمان الجودة لمدة سنة
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                سيتم التواصل معك لتأكيد الطلب
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 