import React from 'react';
import { useParams } from 'react-router-dom';

const BrandPage = () => {
  const { brandSlug } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#7C0000]">
          {brandSlug}
        </h1>
        
        {/* Placeholder content */}
        <div className="text-center text-gray-600">
          <p className="mb-4 text-lg">صفحة العلامة التجارية قيد الإنشاء</p>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage; 