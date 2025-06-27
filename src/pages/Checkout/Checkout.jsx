import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_first_name.trim()) {
      newErrors.customer_first_name = 'الاسم الأول مطلوب';
    }

    if (!formData.customer_father_name.trim()) {
      newErrors.customer_father_name = 'اسم الأب مطلوب';
    }

    if (!formData.customer_last_name.trim()) {
      newErrors.customer_last_name = 'الكنية مطلوبة';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'رقم الهاتف غير صحيح';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'اسم الشارع مطلوب';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'العنوان التفصيلي مطلوب';
    }

    return newErrors;
  };

  const submitOrder = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      // Validate form
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      // Prepare order data
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log('Submitting order:', orderData);

      // Try multiple strategies for API call
      let response;
      const apiUrl = 'https://backend.jullanar.shop/api/v1/orders';

      try {
        // Direct fetch attempt
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(orderData)
        });
      } catch (error) {
        console.warn('Direct fetch failed, trying CORS proxy...');
        
        // Try with CORS proxy
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(apiUrl);
        response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(orderData)
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log('Order submitted successfully:', result);
        
        setSubmitSuccess(true);
        clearCart();
        
        // Redirect to order tracking with order number
        setTimeout(() => {
          navigate('/order-tracking', { 
            state: { orderNumber: result.data?.number || 'OR-' + Date.now() }
          });
        }, 2000);
        
      } else {
        const errorData = await response.json();
        console.error('Order submission failed:', errorData);
        
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else {
          setErrors({ general: errorData.message || 'حدث خطأ أثناء إرسال الطلب' });
        }
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({ general: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لا توجد منتجات في السلة</h2>
            <p className="text-gray-600 mb-8">يجب إضافة منتجات إلى السلة أولاً قبل المتابعة للدفع</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              تصفح المنتجات
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">تم إرسال طلبك بنجاح!</h2>
            <p className="text-gray-600 mb-8">سيتم تحويلك إلى صفحة تتبع الطلب...</p>
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

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700">{errors.general}</p>
                </div>
              )}

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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.customer_first_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أدخل الاسم الأول"
                    />
                    {errors.customer_first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_first_name}</p>
                    )}
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.customer_father_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أدخل اسم الأب"
                    />
                    {errors.customer_father_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_father_name}</p>
                    )}
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.customer_last_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أدخل الكنية"
                    />
                    {errors.customer_last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_last_name}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="مثال: 0999999999"
                  />
                  {errors.customer_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.customer_phone}</p>
                  )}
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">اختر المدينة</option>
                      {syriaCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.street ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أدخل اسم الشارع"
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                    )}
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="أدخل العنوان التفصيلي (رقم البناء، الطابق، إلخ)"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
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
              <button
                onClick={submitOrder}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
              </button>

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