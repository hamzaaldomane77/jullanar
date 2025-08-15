import React, { useState, useEffect } from 'react';
import { fetchProducts, getUniqueCategories, filterProducts, paginateProducts } from '../../services/api';
import ProductFilters from '../../components/ProductFilters';
import ProductGrid from '../../components/ProductGrid';

const Products = () => {
  const [allProducts, setAllProducts] = useState([]); // All products from API
  const [displayedProducts, setDisplayedProducts] = useState([]); // Filtered and paginated products
  const [categories, setCategories] = useState([]); // Available categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pagination, setPagination] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    priceMin: '',
    priceMax: '',
    sortBy: '',
    featured: false,
    page: 1,
    perPage: 8
  });

  // Load products whenever page or perPage changes
  useEffect(() => {
    loadProducts(filters.page, filters.perPage);
  }, [filters.page, filters.perPage]);

  // Apply filters whenever other filter options change (not page/perPage)
  useEffect(() => {
    if (allProducts.data && allProducts.data.length > 0) {
      applyFiltersAndPagination();
    }
  }, [
    allProducts, 
    filters.search, 
    filters.categories, 
    filters.priceMin, 
    filters.priceMax, 
    filters.sortBy, 
    filters.featured
  ]);

  const loadProducts = async (page = 1, perPage = 8) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchProducts(page, perPage);
      
      setAllProducts(result);
      
      // Extract unique categories
      const uniqueCategories = getUniqueCategories(result.data);
      setCategories(uniqueCategories);
      
      // Set displayed products and pagination directly from API result
      setDisplayedProducts(result.data);
      setPagination(result.pagination);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    if (!allProducts.data) return;
    
    // Filter products
    const filteredProducts = filterProducts(allProducts.data, filters);
    
    // Paginate filtered products (local pagination when filters are applied)
    const paginatedResult = paginateProducts(filteredProducts, 1, filters.perPage);
    
    setDisplayedProducts(paginatedResult.data);
    setPagination({
      ...paginatedResult.pagination,
      current_page: 1 // Reset to first page when filters change
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      priceMin: '',
      priceMax: '',
      sortBy: '',
      featured: false,
      page: 1,
      perPage: 8
    });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[200px] md:h-[300px] mb-8">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt="Products Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            منتجاتنا
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            المرشحات والفرز
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              categories={categories}
              isMobile={false}
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">
                {pagination && (
                  <span className="font-medium">
                    عرض {pagination.from} - {pagination.to} من {pagination.total} منتج
                  </span>
                )}
              </div>
              
              {/* Items per page selector */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <label className="text-sm text-gray-600">عرض:</label>
                <select
                  value={filters.perPage}
                  onChange={(e) => setFilters({ ...filters, perPage: parseInt(e.target.value), page: 1 })}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-red-800">خطأ في تحميل المنتجات</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={loadProducts}
                    className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={displayedProducts}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Mobile Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          categories={categories}
          isMobile={true}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
      </div>
    </div>
  );
};

export default Products; 