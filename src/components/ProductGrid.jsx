import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const ProductGrid = ({ products, loading, pagination, onPageChange }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();

  const handleProductClick = (product) => {
    // Pass product data via state to avoid additional API calls
    navigate(`/products/${product.slug}`, { 
      state: { 
        product,
        // Include options data for variable products
        productOptions: product.options || []
      } 
    });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    
    // Show success toast
    toast.success(`تمت إضافة ${product.name} إلى السلة`, {
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

  const formatPrice = (price) => {
    if (!price) return '';
    
    // If price is already formatted (contains commas or is a string with text)
    if (typeof price === 'string' && (price.includes(',') || isNaN(parseFloat(price)))) {
      return price;
    }
    
    // Otherwise format it as number only, then add SYP manually
    const formattedNumber = new Intl.NumberFormat('ar-SY', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price);
    
    return `${formattedNumber} ل.س`;
  };

  const renderDiscountBadge = (price, oldPrice) => {
    if (!oldPrice || oldPrice === '0.00') return null;
    
    const discount = Math.round(((parseFloat(oldPrice) - parseFloat(price)) / parseFloat(oldPrice)) * 100);
    
    return (
      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
        -{discount}%
      </div>
    );
  };

  const renderFeaturedBadge = (featured) => {
    if (!featured) return null;
    
    return (
      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">
        مميز
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-5m-6 0H6" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد منتجات</h3>
      <p className="mt-1 text-sm text-gray-500">لم يتم العثور على منتجات تطابق البحث الخاص بك.</p>
    </div>
  );

  const Pagination = () => {
    if (!pagination || pagination.last_page <= 1) return null;

    const { current_page, last_page } = pagination;
    const pages = [];
    
    // Generate page numbers with ellipsis logic
    const startPage = Math.max(1, current_page - 2);
    const endPage = Math.min(last_page, current_page + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < last_page) {
      if (endPage < last_page - 1) pages.push('...');
      pages.push(last_page);
    }

    return (
      <div className="flex items-center justify-center mt-8 space-x-1 rtl:space-x-reverse">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium border rounded-md ${
              page === current_page
                ? 'text-white bg-blue-600 border-blue-600'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
            } ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Products Grid - Centered with 2 products per row */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => {
            const cartItem = getCartItem(product.id);
            const inCart = isInCart(product.id);
            
            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden group relative"
              >
                {/* Cart indicator */}
                {inCart && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                    في السلة ({cartItem.quantity})
                  </div>
                )}
                
                <div className="relative aspect-square overflow-hidden">
                  {renderDiscountBadge(product.price, product.old_price)}
                  {renderFeaturedBadge(product.featured)}
                  
                  <img
                    src={(product.images && product.images.length > 0) ? product.images[0] : '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Additional images indicator */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      +{product.images.length - 1}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
                    {product.categories && product.categories.length > 0 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {product.categories[0]}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-[#7C0000]">
                        {product.displayPrice || formatPrice(product.price)}
                      </span>
                      {product.old_price && product.old_price !== '0.00' && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.old_price)}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`px-4 py-2 text-white text-sm rounded-md transition-colors font-medium ${
                        inCart 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {inCart ? 'إضافة المزيد' : 'أضف للسلة'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default ProductGrid; 