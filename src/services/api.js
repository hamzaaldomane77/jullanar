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
    console.log('Attempting direct fetch from API...');
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
      console.log('✅ Direct fetch successful:', data);
      return data.data;
    }
  } catch (error) {
    console.warn('❌ Direct fetch failed:', error.message);
  }

  // Strategy 2: Try with different CORS proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      console.log(`Attempting with CORS proxy ${i + 1}:`, proxy);
      
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
        console.log(`✅ CORS proxy ${i + 1} successful:`, data);
        
        // Handle allorigins.win response format (sometimes returns string)
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (parseError) {
            console.warn('Failed to parse string response:', parseError);
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
      console.warn(`❌ CORS proxy ${i + 1} failed:`, error.message);
    }
  }

  // Strategy 3: Try using JSONP-like approach with script tag
  try {
    console.log('Attempting JSONP-like approach...');
    const jsonpData = await fetchWithJSONP(targetUrl);
    if (jsonpData && jsonpData.data) {
      console.log('✅ JSONP approach successful:', jsonpData);
      return jsonpData.data;
    }
  } catch (error) {
    console.warn('❌ JSONP approach failed:', error.message);
  }

  // Strategy 4: Try XMLHttpRequest (sometimes works when fetch doesn't)
  try {
    console.log('Attempting with XMLHttpRequest...');
    const xhrData = await fetchWithXHR(targetUrl);
    if (xhrData && xhrData.data) {
      console.log('✅ XMLHttpRequest successful:', xhrData);
      return xhrData.data;
    }
  } catch (error) {
    console.warn('❌ XMLHttpRequest failed:', error.message);
  }

  // Strategy 5: Use Vite proxy (development only)
  if (import.meta.env.DEV) {
    try {
      console.log('Attempting with Vite proxy...');
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Vite proxy successful:', data);
        return data.data;
      }
    } catch (error) {
      console.warn('❌ Vite proxy failed:', error.message);
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
  const apiUrl = 'https://backend.jullanar.shop/api/v1/orders';
  
  try {
    // Direct fetch attempt
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit order');
    }
  } catch (error) {
    console.warn('Direct order submission failed, trying CORS proxy...');
    
    try {
      // Try with CORS proxy
      const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(apiUrl);
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit order');
      }
    } catch (proxyError) {
      console.error('Order submission failed with proxy:', proxyError);
      throw new Error('Network error. Please try again.');
    }
  }
};

// Order tracking function
export const trackOrder = async (orderNumber) => {
  const apiUrl = `https://backend.jullanar.shop/api/v1/orders/track?number=${encodeURIComponent(orderNumber)}`;
  
  try {
    // Direct fetch attempt
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Order not found');
    }
  } catch (error) {
    console.warn('Direct order tracking failed, trying CORS proxy...');
    
    try {
      // Try with CORS proxy
      const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(apiUrl);
      const proxyResponse = await fetch(proxyUrl);
      const proxyData = await proxyResponse.json();
      
      if (proxyData.status.http_code === 200) {
        return JSON.parse(proxyData.contents);
      } else {
        throw new Error('Order not found');
      }
    } catch (proxyError) {
      console.error('Order tracking failed with proxy:', proxyError);
      throw new Error('Network error. Please try again.');
    }
  }
}; 