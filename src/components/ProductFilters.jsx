import React, { useState, useEffect } from 'react';

const ProductFilters = ({ filters, onFilterChange, onClearFilters, categories, brands = [], isMobile, isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Initialize price range from filters only on mount
  useEffect(() => {
    if (!priceRange.min && !priceRange.max) {
      setPriceRange({
        min: filters.priceMin || '',
        max: filters.priceMax || ''
      });
    }
  }, []); // Empty dependency array - run only once on mount

  const handleCategoryChange = (categoryName) => {
    const newCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter(cat => cat !== categoryName)
      : [...filters.categories, categoryName];
    
    onFilterChange({ ...filters, categories: newCategories, page: 1 });
  };

  const handleBrandChange = (brandName) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brandName)
      ? currentBrands.filter(brand => brand !== brandName)
      : [...currentBrands, brandName];
    
    onFilterChange({ ...filters, brands: newBrands, page: 1 });
  };

  const handlePriceRangeChange = (field, value) => {
    // Update local state only, no filter triggering
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceSearch = () => {
    // Apply price filter when search button is clicked
    onFilterChange({ 
      ...filters, 
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      page: 1
    });
  };

  const handleSortChange = (sortBy) => {
    onFilterChange({ ...filters, sortBy, page: 1 });
  };

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    onClearFilters();
  };

  // Reset price range when filters are cleared externally
  useEffect(() => {
    if (!filters.priceMin && !filters.priceMax && (priceRange.min || priceRange.max)) {
      setPriceRange({ min: '', max: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.priceMin, filters.priceMax]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
        <input
          type="text"
          placeholder="ابحث عن منتج أو علامة تجارية..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">الأصناف</label>
        {categories.length === 0 ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {categories.map((categoryName, index) => (
              <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(categoryName)}
                  onChange={() => handleCategoryChange(categoryName)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="mr-3 text-sm text-gray-700">{categoryName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">العلامات التجارية</label>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {brands.map((brandName, index) => (
              <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brandName) || false}
                  onChange={() => handleBrandChange(brandName)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="mr-3 text-sm text-gray-700">{brandName}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">النطاق السعري (ل.س)</label>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="tel"
                placeholder="من"
                value={priceRange.min}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, ''); // Only allow digits
                  handlePriceRangeChange('min', value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePriceSearch();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              />
              <span className="text-xs text-gray-500 mt-1 block">الحد الأدنى</span>
            </div>
            <div>
              <input
                type="tel"
                placeholder="إلى"
                value={priceRange.max}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, ''); // Only allow digits
                  handlePriceRangeChange('max', value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePriceSearch();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              />
              <span className="text-xs text-gray-500 mt-1 block">الحد الأعلى</span>
            </div>
          </div>
          
          {/* Price Search Button */}
          <button
            onClick={handlePriceSearch}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            بحث بالنطاق السعري
          </button>
          
          <div className="text-xs text-gray-500">
            مثال: 50000 - 500000
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">ترتيب حسب</label>
        <select
          value={filters.sortBy || ''}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">الافتراضي</option>
          <option value="price_asc">السعر: من الأقل إلى الأعلى</option>
          <option value="price_desc">السعر: من الأعلى إلى الأقل</option>
          <option value="name_asc">الاسم: أ-ي</option>
          <option value="name_desc">الاسم: ي-أ</option>
          <option value="newest">الأحدث</option>
          <option value="featured">المميزة</option>
        </select>
      </div>

      {/* Featured Products Only */}
      <div>
        <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) => onFilterChange({ ...filters, featured: e.target.checked, page: 1 })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="mr-3 text-sm text-gray-700">المنتجات المميزة فقط</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearAllFilters}
        className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors font-medium border border-gray-200"
      >
        مسح جميع المرشحات
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Filter Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative flex flex-col w-full h-full max-w-xs bg-white shadow-xl ml-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                <h2 className="text-lg font-medium text-gray-900">المرشحات</h2>
                <button
                  onClick={onClose}
                  className="p-2 -m-2 text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 px-4 py-6 overflow-y-auto bg-white">
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 h-fit">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">المرشحات</h2>
      <FilterContent />
    </div>
  );
};

export default ProductFilters; 