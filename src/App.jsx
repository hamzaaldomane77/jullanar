import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import { CartProvider } from './contexts/CartContext';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';



import Home from './pages/Home/Home';
import Brands from './pages/Brands/Brands';
import BrandPage from './pages/Brands/BrandPage';
import Categories from './pages/Categories/Categories';
import CategoryPage from './pages/Categories/CategoryPage';
import Products from './pages/Products/Products';
import ProductDetail from './pages/Products/ProductDetail';


import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Toaster />
        {isLoading ? (
          <Loading />
        ) : (
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:slug" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="order-tracking" element={<OrderTracking />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/:brandSlug" element={<BrandPage />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:slug" element={<CategoryPage />} />
              
             
              
              {/* صفحة 404 للمسارات غير الموجودة */}
              <Route path="*" element={<div className="text-center p-12">
                <h1 className="text-3xl font-bold text-red-600 mb-4">خطأ 404</h1>
                <p className="text-lg text-gray-700">الصفحة المطلوبة غير موجودة</p>
              </div>} />
            </Route>
          </Routes>
        )}
      </Router>
    </CartProvider>
  );
}

export default App;
