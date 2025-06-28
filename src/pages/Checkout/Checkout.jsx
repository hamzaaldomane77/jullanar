import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { submitOrder } from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    getCartTotal,
    getGrandTotal,
    formatPrice,
    clearCart
  } = useCart();

  const [formData, setFormData] = useState({
    customer_first_name: '',
    customer_father_name: '',
    customer_last_name: '',
    customer_phone: '',
    city: '',
    street: '',
    address: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Syrian cities
  const syriaCities = [
    'دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'دير الزور', 'الرقة', 'درعا', 
    'السويداء', 'القنيطرة', 'طرطوس', 'إدلب', 'الحسكة', 'ريف دمشق'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);

      // Prepare items for API
      const apiItems = cartItems.map(item => ({
        shop_product_id: item.id,
        qty: item.quantity
      }));

      // Prepare order data for API
      const orderData = {
        customer_first_name: formData.customer_first_name,
        customer_father_name: formData.customer_father_name,
        customer_last_name: formData.customer_last_name,
        customer_phone: formData.customer_phone,
        city: formData.city,
        street: formData.street,
        address: formData.address,
        notes: formData.notes || '',
        items: apiItems
      };

      // Submit order to API
      const result = await submitOrder(orderData);
      
      // Navigate to success page with order data
      navigate('/order-success', { 
        state: { 
          orderData: result.data,
          orderNumber: result.data.number,
          cartItems: [...cartItems],
          cartTotal: getCartTotal(),
          grandTotal: getGrandTotal(),
          formData: {...formData}
        }
      });
      
      // Clear cart after successful submission
      clearCart();
    } catch (error) {
      alert('خطأ في إرسال الطلب: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">السلة فارغة!</h2>
            <p className="text-gray-600 mb-8">يجب إضافة منتجات إلى السلة أولاً قبل المتابعة للدفع</p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                🛍️ تصفح المنتجات
              </button>
              <div className="text-sm text-gray-500">
                <p>💡 نصيحة: أضف منتجات إلى السلة من صفحة المنتجات، ثم عد هنا لإتمام الطلب</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">معلومات التوصيل</h2>

              <form className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الأول *
                    </label>
                    <input
                      type="text"
                      name="customer_first_name"
                      value={formData.customer_first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل الاسم الأول"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الأب *
                    </label>
                    <input
                      type="text"
                      name="customer_father_name"
                      value={formData.customer_father_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل اسم الأب"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكنية *
                    </label>
                    <input
                      type="text"
                      name="customer_last_name"
                      value={formData.customer_last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل الكنية"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: 0999999999"
                  />
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدينة *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">اختر المدينة</option>
                      {syriaCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الشارع *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل اسم الشارع"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان التفصيلي *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل العنوان التفصيلي (رقم البناء، الطابق، إلخ)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أي ملاحظات خاصة بالطلب (اختياري)"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ملخص الطلب</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>المجموع الكلي</span>
                  <span className="text-[#7C0000]">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white flex items-center justify-center gap-2`}
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
                </button>
              </div>

              {/* Order Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-blue-700">
                    سيتم التواصل معك لتأكيد الطلب وترتيب التوصيل
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 