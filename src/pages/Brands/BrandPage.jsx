import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBrands } from '../../services/api';

const BrandPage = () => {
  const { brandSlug } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBrand();
  }, [brandSlug]);

  const loadBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const brandsData = await fetchBrands();
      const foundBrand = brandsData.find(b => b.slug === brandSlug);
      
      if (foundBrand) {
        setBrand(foundBrand);
      } else {
        setError('العلامة التجارية غير موجودة');
      }
    } catch (err) {
      setError('فشل في تحميل معلومات العلامة التجارية');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto md:mx-0"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !brand) {
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
                  <Link to="/brands" className="text-gray-500 hover:text-gray-700 mr-1 md:mr-2">
                    العلامات التجارية
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-900 mr-1 md:mr-2 font-medium">{brandSlug}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Error State */}
          <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">خطأ في تحميل العلامة التجارية</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-x-4 rtl:space-x-reverse">
              <button
                onClick={loadBrand}
                className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              >
                إعادة المحاولة
              </button>
              <Link
                to="/brands"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              >
                العودة للعلامات التجارية
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <Link to="/brands" className="text-gray-500 hover:text-gray-700 mr-1 md:mr-2">
                  العلامات التجارية
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-900 mr-1 md:mr-2 font-medium">{brand.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Brand Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Brand Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white text-center">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
                <img
                  src={brand.image_url}
                  alt={brand.name}
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(brand.name);
                  }}
                />
              </div>
              <h1 className="text-4xl font-bold mb-2">{brand.name}</h1>
              <p className="text-blue-100">العلامة التجارية المتميزة</p>
            </div>
          </div>

          {/* Brand Content */}
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Brand Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">عن العلامة التجارية</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      مرحباً بكم في صفحة العلامة التجارية <strong>{brand.name}</strong>. 
                      نحن نفخر بتقديم منتجات عالية الجودة من هذه العلامة المميزة.
                    </p>
                    <p>
                      تابعوا معنا لاكتشاف أحدث المنتجات والعروض الحصرية من {brand.name}.
                    </p>
                  </div>
                </div>

                {/* Brand Actions */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">اكتشف المزيد</h2>
                  <div className="space-y-4">
                    <Link
                      to={`/products?brand=${encodeURIComponent(brand.name)}`}
                      className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      عرض جميع منتجات {brand.name}
                    </Link>
                    
                    <Link
                      to="/products"
                      className="block w-full px-6 py-3 bg-gray-100 text-gray-800 text-center rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      تصفح جميع المنتجات
                    </Link>
                    
                    <Link
                      to="/brands"
                      className="block w-full px-6 py-3 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      العودة للعلامات التجارية
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage; 