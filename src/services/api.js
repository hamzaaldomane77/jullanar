const API_BASE_URL = 'https://backend.jullanar.shop/api/v1';

// CORS Proxy URLs - multiple options to try
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/'
];

// Function to fetch products using multiple strategies
export const fetchProducts = async () => {
  const targetUrl = `${API_BASE_URL}/products`;
  
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
      const response = await fetch('/api/products', {
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

// Paginate products
export const paginateProducts = (products, page = 1, perPage = 12) => {
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
      total_pages: totalPages,
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
  // Use proxy in development, direct URL in production
  const apiUrl = import.meta.env.DEV 
    ? '/api/orders'  // Uses Vite proxy
    : 'https://backend.jullanar.shop/api/v1/orders';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      mode: 'cors',
      credentials: 'same-origin',
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      const result = await response.json();
      
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
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(`خطأ في الخادم: ${errorMessage}`);
    }
  } catch (error) {
    // Provide more detailed error message based on error type
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.');
    } else if (error.message.includes('CORS')) {
      throw new Error('مشكلة في إعدادات الخادم (CORS). تواصل مع المطور.');
    } else {
      throw new Error(`خطأ في الإرسال: ${error.message}`);
    }
  }
};

// Order tracking function
export const trackOrder = async (orderNumber, phone) => {
  // Use proxy in development, direct URL in production
  const apiUrl = import.meta.env.DEV 
    ? '/api/orders/track'  // Uses Vite proxy
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'لم يتم العثور على الطلب');
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
        const errorData = await proxyResponse.json();
        throw new Error(errorData.message || 'لم يتم العثور على الطلب');
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
      const response = await fetch('/api/brands', {
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
      const response = await fetch('/api/categories', {
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