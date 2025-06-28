import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBrands } from '../../services/api';

const Brands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const brandsData = await fetchBrands();
      setBrands(brandsData);
    } catch (err) {
      setError('فشل في تحميل العلامات التجارية. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brandSlug) => {
    navigate(`/brands/${brandSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="relative h-[300px] mb-12">
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600"
            alt="Traditional Market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              الماركات
            </h1>
          </div>
        </div>

        {/* Loading State */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="bg-gray-50 p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="relative h-[300px] mb-12">
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600"
            alt="Traditional Market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              الماركات
            </h1>
          </div>
        </div>

        {/* Error State */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">خطأ في تحميل العلامات التجارية</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadBrands}
              className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[300px] mb-12">
        <img
          src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600"
          alt="Traditional Market"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            الماركات
          </h1>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 pb-16">
        {brands.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد علامات تجارية</h3>
            <p className="text-gray-600">لم يتم العثور على أي علامات تجارية متاحة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 rtl">
            {brands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleBrandClick(brand.slug)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                <div className="aspect-square p-8 flex items-center justify-center bg-gray-50">
                  <img
                    src={brand.image_url}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(brand.name);
                    }}
                  />
                </div>
                <div className="bg-white p-4 text-center border-t">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {brand.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands; 