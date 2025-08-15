const API_BASE_URL = 'https://backend.jullanar.shop/api/v1';

// CORS Proxy URLs - multiple options to try
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/'
];

// Function to fetch products using multiple strategies
export const fetchProducts = async (page = 1, perPage = 12) => {
  const targetUrl = `${API_BASE_URL}/products?page=${page}&per_page=${perPage}`;
  
  // Strategy 1: Try direct fetch first
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
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
          current_page: result.meta.current_page,
          per_page: result.meta.per_page,
          total: result.meta.total,
          last_page: result.meta.last_page,
          from: result.meta.from,
          to: result.meta.to,
          has_more: result.meta.current_page < result.meta.last_page
        }
      };
    }
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 2: Try with different CORS proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      let proxyUrl;
      if (proxy.includes('allorigins.win')) {
        proxyUrl = `${proxy}${encodeURIComponent(targetUrl)}`;
      } else {
        proxyUrl = `${proxy}${targetUrl}`;
      }
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        let data = await response.json();
        
        // Handle allorigins.win response format (sometimes returns string)
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (parseError) {
            continue;
          }
        }
        
        // Handle different proxy response formats
        if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else if (Array.isArray(data)) {
          return data;
        } else if (data && typeof data === 'object') {
          // If it's an object but not the expected format, try to find the products array
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            return possibleArrays[0];
          }
        }
      }
    } catch (error) {
      // Continue to next strategy
    }
  }

  // Strategy 3: Try using JSONP-like approach with script tag
  try {
    const jsonpData = await fetchWithJSONP(targetUrl);
    if (jsonpData && jsonpData.data) {
      return jsonpData.data;
    }
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 4: Try XMLHttpRequest (sometimes works when fetch doesn't)
  try {
    const xhrData = await fetchWithXHR(targetUrl);
    if (xhrData && xhrData.data) {
      return xhrData.data;
    }
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 5: Use Vite proxy (development only)
  if (import.meta.env.DEV) {
    try {
      const response = await fetch('/api/v1/products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      // Continue to error
    }
  }

  // If all strategies fail, throw error
  throw new Error('فشل في تحميل المنتجات من جميع المصادر. تحقق من إعدادات CORS على الخادم.');
};

// XMLHttpRequest approach for CORS bypass
const fetchWithXHR = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (parseError) {
            reject(new Error('Failed to parse XHR response'));
          }
        } else {
          reject(new Error(`XHR failed with status: ${xhr.status}`));
        }
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('XHR network error'));
    };
    
    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      reject(new Error('XHR timeout'));
    };
    
    xhr.send();
  });
};

// JSONP-like approach for CORS bypass
const fetchWithJSONP = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };
    
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    script.onerror = function() {
      delete window[callbackName];
      document.body.removeChild(script);
      reject(new Error('JSONP request failed'));
    };
    
    document.body.appendChild(script);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        document.body.removeChild(script);
        reject(new Error('JSONP request timeout'));
      }
    }, 10000);
  });
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

  // Price range filter
  if (filters.priceMin || filters.priceMax) {
    filteredProducts = filteredProducts.filter(product => {
      const price = parseFloat(product.price);
      
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
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
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
  
  // Ensure each item has the correct structure
  orderData.items.forEach(item => {
    if (!item.shop_product_id || !item.qty) {
      throw new Error('بيانات أحد المنتجات غير مكتملة');
    }
  });
  
  const directUrl = 'https://backend.jullanar.shop/api/v1/orders';
  const proxyUrl = '/api/v1/orders';
  
  // Try multiple strategies for better mobile support
  const strategies = [
    // Strategy 1: Use proxy in development, direct in production
    {
      url: import.meta.env.DEV ? proxyUrl : directUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'same-origin'
    },
    // Strategy 2: Direct call with minimal headers (better for mobile)
    {
      url: directUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors'
    },
    // Strategy 3: Direct call with no-cors mode (last resort)
    {
      url: directUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors'
    }
  ];

  for (let i = 0; i < strategies.length; i++) {
    const strategy = strategies[i];
    console.log(`Trying strategy ${i + 1}:`, strategy.url);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(strategy.url, {
        method: 'POST',
        headers: strategy.headers,
        mode: strategy.mode,
        credentials: strategy.credentials,
        body: JSON.stringify(orderData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`Strategy ${i + 1} response:`, response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('Order submission successful:', result);
        
        // Validate the response structure
        if (result && result.data) {
          return result;
        } else {
          throw new Error('استجابة غير صالحة من الخادم');
        }
      } else if (response.status !== 0) { // Skip no-cors responses with status 0
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
        
        console.error(`Strategy ${i + 1} failed:`, errorMessage);
        
        // If this is not the last strategy, continue to next
        if (i < strategies.length - 1) {
          continue;
        } else {
          throw new Error(`خطأ في الخادم: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error(`Strategy ${i + 1} error:`, error);
      
      // If this is the last strategy, throw the error
      if (i === strategies.length - 1) {
        // Provide more detailed error message based on error type
        if (error.name === 'AbortError') {
          throw new Error('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.');
        } else if (error.name === 'TypeError') {
          if (error.message.includes('fetch')) {
            throw new Error('فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.');
          } else if (error.message.includes('NetworkError')) {
            throw new Error('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
          } else {
            throw new Error('خطأ في الشبكة. تحقق من الاتصال.');
          }
        } else if (error.message.includes('CORS')) {
          throw new Error('مشكلة في إعدادات الخادم (CORS). تواصل مع المطور.');
        } else if (error.message.includes('body stream already read')) {
          throw new Error('خطأ في معالجة الاستجابة. يرجى المحاولة مرة أخرى.');
        } else if (error.message.includes('خطأ في الخادم')) {
          throw error;
        } else {
          console.error('Unexpected error:', error);
          throw new Error(`خطأ غير متوقع: ${error.message || 'خطأ في إرسال الطلب'}`);
        }
      }
      // Continue to next strategy
    }
  }
  
  // If all fetch strategies failed, try XMLHttpRequest as final fallback
  console.log('All fetch strategies failed, trying XMLHttpRequest fallback');
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', directUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.timeout = 30000; // 30 second timeout
    
    xhr.onload = function() {
      console.log('XHR response:', xhr.status, xhr.statusText);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          console.log('XHR submission successful:', result);
          if (result && result.data) {
            resolve(result);
          } else {
            reject(new Error('استجابة غير صالحة من الخادم'));
          }
        } catch (parseError) {
          console.error('XHR parse error:', parseError);
          reject(new Error('خطأ في تحليل استجابة الخادم'));
        }
      } else {
        console.error('XHR failed:', xhr.status, xhr.responseText);
        let errorMessage = `HTTP ${xhr.status}`;
        try {
          const errorData = JSON.parse(xhr.responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = xhr.responseText || errorMessage;
        }
        reject(new Error(`خطأ في الخادم: ${errorMessage}`));
      }
    };
    
    xhr.onerror = function() {
      console.error('XHR network error');
      reject(new Error('فشل في الاتصال بالخادم باستخدام XMLHttpRequest'));
    };
    
    xhr.ontimeout = function() {
      console.error('XHR timeout');
      reject(new Error('انتهت مهلة الاتصال'));
    };
    
    try {
      xhr.send(JSON.stringify(orderData));
      console.log('XHR request sent');
    } catch (sendError) {
      console.error('XHR send error:', sendError);
      reject(new Error('خطأ في إرسال البيانات'));
    }
  });
};

// Order tracking function
export const trackOrder = async (orderNumber, phone) => {
  // Use proxy in development, direct URL in production
  const apiUrl = import.meta.env.DEV 
    ? '/api/v1/orders/track'  // Uses Vite proxy
    : 'https://backend.jullanar.shop/api/v1/orders/track';
  const requestData = {
    number: orderNumber,
    phone: phone
  };
  
  try {
    // Direct fetch attempt
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
    try {
      // Try with CORS proxy
      const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(apiUrl);
      const proxyResponse = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (proxyResponse.ok) {
        const result = await proxyResponse.json();
        return result;
      } else {
        try {
          const responseText = await proxyResponse.text();
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
    } catch (proxyError) {
      throw new Error('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    }
  }
};

// Function to fetch brands using multiple strategies
export const fetchBrands = async () => {
  const targetUrl = `${API_BASE_URL}/brands`;
  
  // Strategy 1: Try direct fetch first
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 2: Try with different CORS proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      let proxyUrl;
      if (proxy.includes('allorigins.win')) {
        proxyUrl = `${proxy}${encodeURIComponent(targetUrl)}`;
      } else {
        proxyUrl = `${proxy}${targetUrl}`;
      }
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        let data = await response.json();
        
        // Handle allorigins.win response format (sometimes returns string)
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (parseError) {
            continue;
          }
        }
        
        // Handle different proxy response formats
        if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else if (Array.isArray(data)) {
          return data;
        } else if (data && typeof data === 'object') {
          // If it's an object but not the expected format, try to find the brands array
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            return possibleArrays[0];
          }
        }
      }
    } catch (error) {
      // Continue to next strategy
    }
  }

  // Strategy 3: Use Vite proxy (development only)
  if (import.meta.env.DEV) {
    try {
      const response = await fetch('/api/v1/brands', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      // Continue to error
    }
  }

  // If all strategies fail, throw error
  throw new Error('فشل في تحميل العلامات التجارية من جميع المصادر. تحقق من إعدادات CORS على الخادم.');
};

// Function to fetch categories using multiple strategies
export const fetchCategories = async () => {
  const targetUrl = `${API_BASE_URL}/categories`;
  
  // Strategy 1: Try direct fetch first
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 2: Try with different CORS proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      let proxyUrl;
      if (proxy.includes('allorigins.win')) {
        proxyUrl = `${proxy}${encodeURIComponent(targetUrl)}`;
      } else {
        proxyUrl = `${proxy}${targetUrl}`;
      }
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        let data = await response.json();
        
        // Handle allorigins.win response format (sometimes returns string)
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (parseError) {
            continue;
          }
        }
        
        // Handle different proxy response formats
        if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else if (Array.isArray(data)) {
          return data;
        } else if (data && typeof data === 'object') {
          // If it's an object but not the expected format, try to find the categories array
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            return possibleArrays[0];
          }
        }
      }
    } catch (error) {
      // Continue to next strategy
    }
  }

  // Strategy 3: Use Vite proxy (development only)
  if (import.meta.env.DEV) {
    try {
      const response = await fetch('/api/v1/categories', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      // Continue to error
    }
  }

  // If all strategies fail, throw error
  throw new Error('فشل في تحميل الأصناف من جميع المصادر. تحقق من إعدادات CORS على الخادم.');
};

// Function to fetch featured products using multiple strategies
export const fetchFeaturedProducts = async () => {
  const targetUrl = `${API_BASE_URL}/featured-products`;
  
  // Strategy 1: Try direct fetch first
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 2: Try with different CORS proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      let proxyUrl;
      if (proxy.includes('allorigins.win')) {
        proxyUrl = `${proxy}${encodeURIComponent(targetUrl)}`;
      } else {
        proxyUrl = `${proxy}${targetUrl}`;
      }
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        let data = await response.json();
        
        // Handle allorigins.win response format (sometimes returns string)
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (parseError) {
            continue;
          }
        }
        
        // Handle different proxy response formats
        if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else if (Array.isArray(data)) {
          return data;
        } else if (data && typeof data === 'object') {
          // If it's an object but not the expected format, try to find the products array
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            return possibleArrays[0];
          }
        }
      }
    } catch (error) {
      // Continue to next strategy
    }
  }

  // Strategy 3: Use Vite proxy (development only)
  if (import.meta.env.DEV) {
    try {
      const response = await fetch('/api/v1/featured-products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      // Continue to error
    }
  }

  // If all strategies fail, throw error
  throw new Error('فشل في تحميل المنتجات المميزة من جميع المصادر. تحقق من إعدادات CORS على الخادم.');
};

// Function to fetch offers products using multiple strategies
export const fetchOffersProducts = async () => {
  const targetUrl = `${API_BASE_URL}/offers-products`;
  
  // Strategy 1: Try direct fetch first
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 2: Try with different CORS proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      let proxyUrl;
      if (proxy.includes('allorigins.win')) {
        proxyUrl = `${proxy}${encodeURIComponent(targetUrl)}`;
      } else {
        proxyUrl = `${proxy}${targetUrl}`;
      }
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        let data = await response.json();
        
        // Handle allorigins.win response format (sometimes returns string)
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (parseError) {
            continue;
          }
        }
        
        // Handle different proxy response formats
        if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else if (Array.isArray(data)) {
          return data;
        } else if (data && typeof data === 'object') {
          // If it's an object but not the expected format, try to find the products array
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            return possibleArrays[0];
          }
        }
      }
    } catch (error) {
      // Continue to next strategy
    }
  }

  // Strategy 3: Use Vite proxy (development only)
  if (import.meta.env.DEV) {
    try {
      const response = await fetch('/api/v1/offers-products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      // Continue to error
    }
  }

  // If all strategies fail, throw error
  throw new Error('فشل في تحميل منتجات العروض من جميع المصادر. تحقق من إعدادات CORS على الخادم.');
}; 