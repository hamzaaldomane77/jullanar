import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCategories, fetchProductsByCategory } from '../../services/api';
import Loading from '../../components/Loading';
import ProductGrid from '../../components/ProductGrid';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadCategoryAndProducts(currentPage);
  }, [slug, currentPage]);

  const loadCategoryAndProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories to get category info, and products by category in parallel
      const [categoriesResult, productsResult] = await Promise.all([
        fetchCategories(),
        fetchProductsByCategory(slug, page, 12)
      ]);
      
      // Find the current category by slug
      const currentCategory = categoriesResult.data.find(cat => cat.slug === slug);
      
      if (!currentCategory) {
        setError('الصنف غير موجود');
        return;
      }
      
      setCategory(currentCategory);
      setProducts(productsResult.data);
      setPagination(productsResult.pagination);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">خطأ في تحميل الصنف</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4 rtl:space-x-reverse">
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                إعادة المحاولة
              </button>
              <Link 
                to="/categories"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors inline-block"
              >
                العودة للأصناف
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">الصنف غير موجود</h3>
          <p className="text-gray-500 mb-4">لم يتم العثور على الصنف المطلوب</p>
          <Link 
            to="/categories"
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors inline-block"
          >
            العودة للأصناف
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="relative h-[200px] md:h-[300px] mb-8">
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              {category.name}
            </h1>
            <p className="text-lg md:text-xl opacity-90 drop-shadow">
              {pagination ? pagination.total : products.length} منتج متوفر
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
          <Link to="/" className="text-gray-500 hover:text-red-600 transition-colors">
            الرئيسية
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <Link to="/categories" className="text-gray-500 hover:text-red-600 transition-colors">
            الأصناف
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 pb-16">
        {products.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">لا توجد منتجات في هذا الصنف</h3>
            <p className="text-gray-500 mb-6">لم يتم العثور على أي منتجات في صنف "{category?.name}" حالياً</p>
            <div className="space-x-4 rtl:space-x-reverse">
              <Link 
                to="/categories"
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors inline-block"
              >
                تصفح الأصناف الأخرى
              </Link>
              <Link 
                to="/products"
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors inline-block"
              >
                جميع المنتجات
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  منتجات {category?.name}
                </h2>
                <p className="text-gray-600">
                  {pagination && (
                    <>عرض {pagination.from} - {pagination.to} من {pagination.total} منتج</>
                  )}
                </p>
              </div>
              
              <Link 
                to="/categories"
                className="text-red-600 hover:text-red-700 font-medium flex items-center transition-colors"
              >
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                العودة للأصناف
              </Link>
            </div>

            <ProductGrid 
              products={products} 
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Related Categories */}
      {products.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                أصناف أخرى قد تهمك
              </h2>
              <p className="text-gray-600">
                اكتشف المزيد من المنتجات في أصناف مختلفة
              </p>
            </div>
            
            <div className="flex justify-center">
              <Link
                to="/categories"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                تصفح جميع الأصناف
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 