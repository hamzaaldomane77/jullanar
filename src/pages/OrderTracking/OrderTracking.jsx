import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackOrder } from '../../services/api';

const OrderTracking = () => {
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState(location.state?.orderNumber || '');
  const [phone, setPhone] = useState(location.state?.phone || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Track order when component mounts if order number and phone are provided
  useEffect(() => {
    if (orderNumber && phone) {
      handleTrackOrder();
    }
  }, []);

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      setError('يرجى إدخال رقم الطلب');
      return;
    }

    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setOrderData(null);

      // Use the API service function
      const result = await trackOrder(orderNumber, phone);
      
      setOrderData(result.data);
    } catch (error) {
      setError(error.message || 'حدث خطأ أثناء البحث عن الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrackOrder();
  };

  const getStatusColor = (statusObject) => {
    // Use the color from API if available, otherwise fallback to predefined colors
    if (statusObject && statusObject.color) {
      const apiColors = {
        'info': 'bg-blue-100 text-blue-800',
        'warning': 'bg-yellow-100 text-yellow-800',
        'primary': 'bg-orange-100 text-orange-800',
        'secondary': 'bg-purple-100 text-purple-800',
        'success': 'bg-green-100 text-green-800',
        'danger': 'bg-red-100 text-red-800'
      };
      return apiColors[statusObject.color] || 'bg-gray-100 text-gray-800';
    }
    
    // Fallback to status value-based colors
    const statusValue = statusObject?.value || statusObject;
    const statusColors = {
      'new': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-orange-100 text-orange-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[statusValue] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: 'SYP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تتبع الطلب</h1>
          <p className="text-gray-600">أدخل رقم طلبك لمعرفة حالة التوصيل</p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الطلب
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: OR-164799"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: 0999999999"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'جاري البحث...' : 'تتبع الطلب'}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      طلب رقم: {orderData.number}
                    </h2>
                    <p className="text-sm text-gray-600">
                      تاريخ الطلب: {formatDate(orderData.created_at)}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                      {orderData.status.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-900">{orderData.customer_name}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-900">{orderData.phone}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-400 ml-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-900">{orderData.full_address}</span>
                      </div>
                      
                      {orderData.notes && orderData.notes.trim() !== '' && orderData.notes !== 'ممكن يكون فاضي' && (
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-400 ml-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <span className="text-sm text-gray-600">ملاحظات:</span>
                            <p className="text-gray-900">{orderData.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الطلب</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">المجموع الفرعي:</span>
                          <span className="text-gray-900 font-medium">
                            {formatPrice(orderData.total_price)}
                          </span>
                        </div>
                        
                        <hr className="border-gray-200" />
                        
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-gray-900">المجموع الكلي:</span>
                          <span className="text-[#7C0000]">
                            {formatPrice(orderData.total_price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">حالة الطلب</h3>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      {/* Timeline Steps */}
                      {[
                        { key: 'new', label: 'طلب جديد', icon: '📝' },
                        { key: 'confirmed', label: 'تم التأكيد', icon: '✅' },
                        { key: 'processing', label: 'قيد التحضير', icon: '📦' },
                        { key: 'shipped', label: 'تم الشحن', icon: '🚚' },
                        { key: 'delivered', label: 'تم التوصيل', icon: '🎉' }
                      ].map((step, index, array) => {
                        const currentStatusValue = orderData.status?.value || orderData.status;
                        const isActive = step.key === currentStatusValue;
                        const statusOrder = ['new', 'confirmed', 'processing', 'shipped', 'delivered'];
                        const currentIndex = statusOrder.indexOf(currentStatusValue);
                        const isCompleted = currentIndex >= index;
                        
                        return (
                          <div key={step.key} className="flex flex-col items-center flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${
                              isActive 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : isCompleted 
                                  ? 'bg-green-600 border-green-600 text-white'
                                  : 'bg-gray-200 border-gray-300 text-gray-500'
                            }`}>
                              {step.icon}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${
                              isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </span>
                            {index < array.length - 1 && (
                              <div className={`absolute top-6 w-full h-0.5 ${
                                isCompleted ? 'bg-green-600' : 'bg-gray-300'
                              }`} style={{ 
                                left: `${(100 / (array.length - 1)) * index + (100 / (array.length - 1)) / 2}%`,
                                width: `${100 / (array.length - 1)}%`,
                                zIndex: -1
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
                  >
                    طباعة تفاصيل الطلب
                  </button>
                  <button
                    onClick={() => {
                      setOrderData(null);
                      setOrderNumber('');
                      setError('');
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    تتبع طلب آخر
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">هل تحتاج مساعدة؟</h3>
            <div className="space-y-2 text-blue-800">
              <p className="flex items-center">
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                اتصل بنا على: 0983596774
              </p>
              <p className="flex items-center">
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                أرسل إيميل: info@jullanar.shop
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 