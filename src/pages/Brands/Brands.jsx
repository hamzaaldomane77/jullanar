import React from 'react';
import { useNavigate } from 'react-router-dom';

import reebokLogo from '../../assets/Logo.png'; // We'll use this temporarily as Reebok logo

const Brands = () => {
  const navigate = useNavigate();

  const brands = Array(9).fill({
    id: 'reebok',
    name: 'Reebok',
    logo: reebokLogo,
    slug: 'reebok'
  });

  const handleBrandClick = (brandSlug) => {
    navigate(`/brands/${brandSlug}`);
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 rtl">
          {brands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              onClick={() => handleBrandClick(brand.slug)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="aspect-square p-8 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-gray-50 p-4 text-center border-t">
                <h3 className="text-lg font-semibold text-gray-800">
                  {brand.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
   
    </div>
  );
};

export default Brands; 