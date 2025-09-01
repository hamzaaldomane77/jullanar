const API_BASE_URL = 'https://backend.jullanar.shop/api/v1';

// Generic function to fetch data with direct API access
const fetchDirectAPI = async (targetUrl) => {
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Direct API fetch failed:', error.message);
    throw error;
  }
};

// Function to fetch products using direct API access
export const fetchProducts = async (page = 1, perPage = 12) => {
  const targetUrl = `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`;
  
  try {
    const result = await fetchDirectAPI(targetUrl);
    
    if (result && result.data && Array.isArray(result.data)) {
      // Process products to normalize the structure
      const processedProducts = result.data.map(product => {
        // For variable products, keep the original price text but ensure it has ل.س
        const displayPrice = product.type === 'variable' 
          ? (product.price.includes('ل.س') ? product.price : `${product.price} ل.س`) 
          : formatPrice(product.price);
          
        return {
          ...product,
          // Convert image to images array for compatibility
          images: product.image ? [product.image] : [],
          // Handle price display for variable products
          displayPrice: displayPrice
        };
      });
      
      // Return both the processed products and pagination info
      return {
        data: processedProducts,
        pagination: {
          current_page: result.meta?.current_page || 1,
          per_page: result.meta?.per_page || perPage,
          total: result.meta?.total || processedProducts.length,
          last_page: result.meta?.last_page || 1,
          from: result.meta?.from || 1,
          to: result.meta?.to || processedProducts.length,
          has_more: result.meta?.current_page < result.meta?.last_page || false
        }
      };
    }
  } catch (error) {
    console.error('fetchProducts error:', error);
    throw new Error('فشل في تحميل المنتجات. تحقق من الاتصال بالإنترنت.');
  }
};

// Get unique categories from products
export const getUniqueCategories = (products) => {
  const categories = new Set();
  products.forEach(product => {
    if (product.categories && Array.isArray(product.categories)) {
      product.categories.forEach(category => categories.add(category));
    }
  });
  return Array.from(categories);
};

// Get unique brands from products
export const getUniqueBrands = (products) => {
  const brands = new Set();
  products.forEach(product => {
    if (product.brand) {
      brands.add(product.brand);
    }
  });
  return Array.from(brands);
};

// Filter products based on criteria
export const filterProducts = (products, filters) => {
  let filteredProducts = [...products];

  // Search filter
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.categories.some(category => 
        filters.categories.includes(category)
      )
    );
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filters.brands.includes(product.brand)
    );
  }

  // Price range filter
  if (filters.priceMin || filters.priceMax) {
    filteredProducts = filteredProducts.filter(product => {
      // Handle different price formats
      let price = 0;
      
      // For variable products, try to extract the minimum price
      if (product.type === 'variable' && product.options && product.options.length > 0) {
        // Get minimum price from options
        const prices = product.options.map(opt => parseFloat(opt.price)).filter(p => !isNaN(p));
        price = prices.length > 0 ? Math.min(...prices) : 0;
      } else {
        // For simple products, parse the price
        const priceStr = typeof product.price === 'string' 
          ? product.price.replace(/[^\d.]/g, '') // Remove non-numeric characters
          : product.price;
        price = parseFloat(priceStr) || 0;
      }
      
      // Handle minimum price
      let minPrice = 0;
      if (filters.priceMin && filters.priceMin.trim() !== '') {
        const parsedMin = parseFloat(filters.priceMin);
        if (!isNaN(parsedMin)) {
          minPrice = parsedMin;
        }
      }
      
      // Handle maximum price
      let maxPrice = Infinity;
      if (filters.priceMax && filters.priceMax.trim() !== '') {
        const parsedMax = parseFloat(filters.priceMax);
        if (!isNaN(parsedMax)) {
          maxPrice = parsedMax;
        }
      }
      
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Featured filter
  if (filters.featured) {
    filteredProducts = filteredProducts.filter(product => product.featured);
  }

  // Sort products
  if (filters.sortBy) {
    filteredProducts.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return getProductPrice(a) - getProductPrice(b);
        case 'price_desc':
          return getProductPrice(b) - getProductPrice(a);
        case 'name_asc':
          return a.name.localeCompare(b.name, 'ar');
        case 'name_desc':
          return b.name.localeCompare(a.name, 'ar');
        case 'newest':
          return b.id - a.id; // Assuming higher ID means newer
        case 'featured':
          return b.featured - a.featured;
        default:
          return 0;
      }
    });
  }

  return filteredProducts;
};

// Helper function to get numeric price from product
const getProductPrice = (product) => {
  if (product.type === 'variable' && product.options && product.options.length > 0) {
    // Get minimum price from options
    const prices = product.options.map(opt => parseFloat(opt.price)).filter(p => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices) : 0;
  } else {
    // For simple products, parse the price
    const priceStr = typeof product.price === 'string' 
      ? product.price.replace(/[^\d.]/g, '') // Remove non-numeric characters
      : product.price;
    return parseFloat(priceStr) || 0;
  }
};

// Helper function to format price
const formatPrice = (price) => {
  if (!price) return '';
  
  // Handle string prices that might already be formatted
  if (typeof price === 'string' && price.includes(',')) {
    // Add ل.س if it doesn't already have it
    return price.includes('ل.س') ? price : `${price} ل.س`;
  }
  
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;
  
  // Format the number and add Syrian Pound
  const formattedNumber = new Intl.NumberFormat('ar-SY', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(numPrice);
  
  return `${formattedNumber} ل.س`;
};

// Paginate products
export const paginateProducts = (products, page = 1, perPage = 12) => {
  // If products already includes pagination info, use it
  if (products.pagination) {
    return {
      data: products.data,
      pagination: products.pagination
    };
  }
  
  // Otherwise, create pagination manually
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(products.length / perPage);
  
  return {
    data: paginatedProducts,
    pagination: {
      current_page: page,
      per_page: perPage,
      total: products.length,
      last_page: totalPages,
      from: startIndex + 1,
      to: Math.min(endIndex, products.length),
      has_more: page < totalPages
    }
  };
};

// Find product by slug
export const findProductBySlug = (products, slug) => {
  return products.find(product => product.slug === slug);
};

// Order submission function
export const submitOrder = async (orderData) => {
  console.log('Submitting order with data:', orderData);
  
  // Validate order data structure
  if (!orderData.items || !Array.isArray(orderData.items)) {
    throw new Error('بيانات المنتجات غير صحيحة');
  }
  
  // Ensure each item has the correct structure and required fields
  const processedItems = orderData.items.map(item => {
    if (!item.shop_product_id || !item.qty) {
      throw new Error('بيانات أحد المنتجات غير مكتملة');
    }
    
    // Create a new item object with all required fields
    const processedItem = {
      shop_product_id: item.shop_product_id,
      qty: item.qty,
      // Ensure unit_price is always present
      unit_price: item.unit_price || 0
    };
    
    // Add option_id if available
    if (item.option_id) {
      processedItem.option_id = item.option_id;
    }
    
    return processedItem;
  });
  
  // Replace items with processed items
  orderData.items = processedItems;
  
  const directUrl = 'https://backend.jullanar.shop/api/v1/orders';
  
  try {
    const response = await fetch(directUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
        body: JSON.stringify(orderData),
      });

    console.log('Order response:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('Order submission successful:', result);
        
        // Validate the response structure
        if (result && result.data) {
          return result;
        } else {
          throw new Error('استجابة غير صالحة من الخادم');
        }
    } else {
        // Try to get error details
        let errorMessage = `HTTP ${response.status}`;
        try {
          const responseText = await response.text();
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (jsonParseError) {
            errorMessage = responseText || errorMessage;
          }
        } catch (readError) {
          errorMessage = `HTTP ${response.status}`;
        }
        
      console.error('Order submission failed:', errorMessage);
          throw new Error(`خطأ في الخادم: ${errorMessage}`);
      }
    } catch (error) {
    console.error('Order submission error:', error);
      
        // Provide more detailed error message based on error type
    if (error.name === 'TypeError') {
          if (error.message.includes('fetch')) {
            throw new Error('فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.');
          } else if (error.message.includes('NetworkError')) {
            throw new Error('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
          } else {
            throw new Error('خطأ في الشبكة. تحقق من الاتصال.');
          }
        } else if (error.message.includes('CORS')) {
          throw new Error('مشكلة في إعدادات الخادم (CORS). تواصل مع المطور.');
        } else if (error.message.includes('خطأ في الخادم')) {
          throw error;
        } else {
          console.error('Unexpected error:', error);
          throw new Error(`خطأ غير متوقع: ${error.message || 'خطأ في إرسال الطلب'}`);
        }
      }
};

// Order tracking function
export const trackOrder = async (orderNumber, phone) => {
  const apiUrl = 'https://backend.jullanar.shop/api/v1/orders/track';
  const requestData = {
    number: orderNumber,
    phone: phone
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      try {
        const responseText = await response.text();
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'لم يتم العثور على الطلب');
        } catch (jsonParseError) {
          throw new Error(responseText || 'لم يتم العثور على الطلب');
        }
      } catch (readError) {
        throw new Error('لم يتم العثور على الطلب');
      }
    }
  } catch (error) {
      throw new Error('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
  }
};

// Function to fetch brands using direct API access
export const fetchBrands = async () => {
  const targetUrl = `${API_BASE_URL}/brands`;
  
  try {
    const data = await fetchDirectAPI(targetUrl);
    return data.data || data;
  } catch (error) {
    console.error('fetchBrands error:', error);
    throw new Error('فشل في تحميل العلامات التجارية. تحقق من الاتصال بالإنترنت.');
  }
};

// Function to fetch categories using direct API access
export const fetchCategories = async (page = 1, perPage = 12) => {
  const targetUrl = `${API_BASE_URL}/categories?page=${page}&per_page=${perPage}`;
  
  try {
    const result = await fetchDirectAPI(targetUrl);
    
    if (result && result.data && Array.isArray(result.data)) {
      // Return both the categories and pagination info
      return {
        data: result.data,
        pagination: {
          current_page: result.meta?.current_page || 1,
          per_page: result.meta?.per_page || perPage,
          total: result.meta?.total || result.data.length,
          last_page: result.meta?.last_page || 1,
          from: result.meta?.from || 1,
          to: result.meta?.to || result.data.length,
          has_more: result.meta?.current_page < result.meta?.last_page || false
        }
      };
    }
    
    // Fallback if no proper structure
    return {
      data: result.data || result || [],
      pagination: {
        current_page: 1,
        per_page: perPage,
        total: (result.data || result || []).length,
        last_page: 1,
        from: 1,
        to: (result.data || result || []).length,
        has_more: false
      }
    };
  } catch (error) {
    console.error('fetchCategories error:', error);
    throw new Error('فشل في تحميل الأصناف. تحقق من الاتصال بالإنترنت.');
  }
};

// Function to fetch featured products using direct API access
export const fetchFeaturedProducts = async () => {
  const targetUrl = `${API_BASE_URL}/featured-products`;
  
  try {
    const data = await fetchDirectAPI(targetUrl);
    return data.data || data;
  } catch (error) {
    console.error('fetchFeaturedProducts error:', error);
    throw new Error('فشل في تحميل المنتجات المميزة. تحقق من الاتصال بالإنترنت.');
  }
};

// Function to fetch offers products using direct API access
export const fetchOffersProducts = async () => {
  const targetUrl = `${API_BASE_URL}/offers-products`;
  
  try {
    const data = await fetchDirectAPI(targetUrl);
    return data.data || data;
  } catch (error) {
    console.error('fetchOffersProducts error:', error);
    throw new Error('فشل في تحميل منتجات العروض. تحقق من الاتصال بالإنترنت.');
  }
};

// Function to fetch products by category using direct API access
export const fetchProductsByCategory = async (categorySlug, page = 1, perPage = 12) => {
  const targetUrl = `${API_BASE_URL}/categories/${categorySlug}/products?page=${page}&per_page=${perPage}`;
  
  try {
    const result = await fetchDirectAPI(targetUrl);
    
    if (result && result.data && Array.isArray(result.data)) {
      // Process products to normalize the structure
      const processedProducts = result.data.map(product => {
        // For variable products, keep the original price text but ensure it has ل.س
        const displayPrice = product.type === 'variable' 
          ? (product.price.includes('ل.س') ? product.price : `${product.price} ل.س`) 
          : formatPrice(product.price);
          
        return {
          ...product,
          // Convert image to images array for compatibility
          images: product.image ? [product.image] : [],
          // Handle price display for variable products
          displayPrice: displayPrice
        };
      });
      
      // Return both the processed products and pagination info
      return {
        data: processedProducts,
        pagination: {
          current_page: result.meta?.current_page || 1,
          per_page: result.meta?.per_page || perPage,
          total: result.meta?.total || processedProducts.length,
          last_page: result.meta?.last_page || 1,
          from: result.meta?.from || 1,
          to: result.meta?.to || processedProducts.length,
          has_more: result.meta?.current_page < result.meta?.last_page || false
        }
      };
    }
    
    // If the category-specific endpoint doesn't exist, fallback to filtering all products
    console.warn(`Category-specific endpoint not available for ${categorySlug}, falling back to filtering all products`);
    return await fetchProductsFilteredByCategory(categorySlug, page, perPage);
    
  } catch (error) {
    console.warn(`fetchProductsByCategory error for ${categorySlug}:`, error);
    // Fallback to filtering all products if category endpoint fails
    return await fetchProductsFilteredByCategory(categorySlug, page, perPage);
  }
};

// Fallback function to filter products by category name
const fetchProductsFilteredByCategory = async (categorySlug, page = 1, perPage = 12) => {
  try {
    // First get the category to know its name
    const categoriesResult = await fetchCategories();
    const category = categoriesResult.data.find(cat => cat.slug === categorySlug);
    
    if (!category) {
      throw new Error('الصنف غير موجود');
    }
    
    // Then get all products and filter them
    const productsResult = await fetchProducts(1, 1000); // Get a large number to ensure we get all products
    
    // Filter products by category
    const filteredProducts = productsResult.data.filter(product => {
      // Check if product has categories array that includes this category
      if (product.categories && Array.isArray(product.categories)) {
        return product.categories.some(cat => 
          (typeof cat === 'string' && cat === category.name) ||
          (typeof cat === 'object' && (cat.id === category.id || cat.slug === category.slug || cat.name === category.name))
        );
      }
      
      // Check if product has category field that matches
      if (product.category === category.name) {
        return true;
      }
      
      return false;
    });
    
    // Apply pagination to filtered results
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(filteredProducts.length / perPage);
    
    return {
      data: paginatedProducts,
      pagination: {
        current_page: page,
        per_page: perPage,
        total: filteredProducts.length,
        last_page: totalPages,
        from: startIndex + 1,
        to: Math.min(endIndex, filteredProducts.length),
        has_more: page < totalPages
      }
    };
    
  } catch (error) {
    console.error('fetchProductsFilteredByCategory error:', error);
    throw new Error('فشل في تحميل منتجات الصنف. تحقق من الاتصال بالإنترنت.');
  }
}; 