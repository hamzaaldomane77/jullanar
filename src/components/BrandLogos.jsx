import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrandLogos = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const brands = [
    {
      id: 1,
      name: 'نايك',
      slug: 'nike',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      description: 'أحذية وملابس رياضية عالية الجودة'
    },
    {
      id: 2,
      name: 'أديداس',
      slug: 'adidas',
      image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f',
      description: 'تشكيلة واسعة من الملابس الرياضية'
    },
    {
      id: 3,
      name: 'بوما',
      slug: 'puma',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
      description: 'أحدث صيحات الموضة الرياضية'
    },
    {
      id: 4,
      name: 'ريبوك',
      slug: 'reebok',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570',
      description: 'تصاميم عصرية وراحة مثالية'
    },
    {
      id: 5,
      name: 'نيو بالانس',
      slug: 'new-balance',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570',
      description: 'أحذية رياضية مريحة وعصرية'
    },
    {
      id: 6,
      name: 'أندر آرمور',
      slug: 'under-armour',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c',
      description: 'ملابس رياضية متطورة'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % brands.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [brands.length]);

  const handleBrandClick = (slug) => {
    navigate(`/brands/${slug}`);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">الماركات المميزة</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.slug)}
              className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer
                ${index === activeIndex ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              style={{ aspectRatio: index === 0 ? '2/1' : '1/1' }}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{brand.name}</h3>
                <p className="text-sm md:text-base opacity-90">{brand.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandLogos; 