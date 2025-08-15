import { Outlet, Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-red-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src={Logo} alt="جُلّنار" className="w-16 h-20 md:w-20 md:h-24" />
                <div className="mr-3 hidden sm:block">
                  <h1 className="text-2xl font-bold text-gray-800">جُلّنار</h1>
                  <p className="text-sm text-gray-600">متجرك الأول للتسوق</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
              >
                الرئيسية
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
              >
                المنتجات
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/brands" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
              >
                الماركات
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/categories" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
              >
                الأصناف
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
             
              <Link 
                to="/order-tracking" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
              >
                تتبع الطلب
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
              >
                سياسة الخصوصية
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/returns" 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative group"
              >
                سياسة الاسترجاع
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Placeholder for spacing */}
              <div className="hidden md:block"></div>
          

              {/* Cart Icon */}
              <button 
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="none" stroke="#000" d="M5.5 21a2 2 0 1 0 4 0m3 0a2 2 0 1 0 4 0M7 7.5h15.5v.25l-.239.283A16 16 0 0 0 18.5 18.34v.16h-13v-1.88c0-2.08-.066-4.158-.386-6.212C4.56 6.852 3.337 1.5 1 1.5" strokeWidth="1" />
</svg>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="py-4 border-t border-gray-200">
              {/* Mobile Phone Number */}
              <div className="mb-4 px-4">
                <div className="text-center text-gray-600 text-sm">
                  تواصل معنا عبر الواتساب أو البريد الإلكتروني
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link 
                  to="/" 
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    الرئيسية
                  </div>
                </Link>
                <Link 
                  to="/products" 
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    المنتجات
                  </div>
                </Link>
                <Link 
                  to="/brands" 
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    الماركات
                  </div>
                </Link>
                <Link 
                  to="/categories" 
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    الأصناف
                  </div>
                </Link>
                <Link 
                  to="/order-tracking" 
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    تتبع الطلب
                  </div>
                </Link>
                <Link 
                  to="/privacy" 
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    سياسة الخصوصية
                  </div>
                </Link>
                <Link 
                  to="/returns" 
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                    </svg>
                    سياسة الاسترجاع
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    handleCartClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-right px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                      </svg>
                      سلة التسوق
                    </div>
                    {getCartItemsCount() > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Logo Section */}
            <div className="text-center md:text-right">
              <img src={Logo} alt="جُلّنار" className="w-[80px] h-[80px] mx-auto md:mx-0 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">جُلّنار</h3>
              <p className="mb-4">متجرك الأول للتسوق الإلكتروني</p>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-right">
              <h3 className="text-xl font-bold mb-4 text-white">روابط سريعة</h3>
              <ul className="space-y-2">
                <li><Link to="/categories" className="hover:text-white transition-colors">جميع الأصناف</Link></li>
                <li><Link to="/brands" className="hover:text-white transition-colors">الماركات</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link to="/order-tracking" className="hover:text-white transition-colors">تتبع الطلب</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="text-center sm:text-right">
              <h3 className="text-xl font-bold mb-4 text-white">خدمة العملاء</h3>
              <ul className="space-y-2">
                <li><Link to="/order-tracking" className="hover:text-white transition-colors">تتبع الطلب</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors">سياسة الاسترجاع والتبديل</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="text-center sm:text-right">
              <h3 className="text-xl font-bold mb-4 text-white">تواصل معنا</h3>
              <div className="space-y-3 mb-4">
                <p className="text-gray-300">0983596774</p>
                <p className="text-gray-300">info@jullanar.shop</p>
              </div>
              
              {/* Social Media */}
              <div className="flex justify-center sm:justify-start space-x-4 rtl:space-x-reverse">
                <a href="https://www.facebook.com/share/18gwjDK5nw/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <span className="sr-only">فيسبوك</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="https://wa.me/+963983596774" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                  <span className="sr-only">واتساب</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="mailto:info@jullanar.shop" className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <span className="sr-only">البريد الإلكتروني</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="text-center space-x-4 rtl:space-x-reverse mb-4 text-sm">
              <Link to="/returns" className="hover:text-white transition-colors">سياسة الاسترجاع والتبديل</Link>
              <span>|</span>
              <Link to="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            </div>
            <p className="text-center text-sm">
              جميع الحقوق محفوظة &copy; 2025 جُلّنار
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 