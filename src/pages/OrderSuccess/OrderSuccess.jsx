import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract all data from location state
  const orderData = location.state?.orderData;
  const orderNumber = location.state?.orderNumber;
  const cartItems = location.state?.cartItems || [];
  const cartTotal = location.state?.cartTotal || 0;
  const grandTotal = location.state?.grandTotal || 0;
  const customerData = location.state?.formData;

  // If absolutely no useful data, redirect to home
  if (!orderData && !orderNumber && cartItems.length === 0 && !customerData) {
    navigate('/');
    return null;
  }

  // Generate order number if not provided
  const finalOrderNumber = orderData?.number || orderNumber || 'OR-' + Date.now();

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('تم نسخ رقم الطلب: ' + text);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('تم نسخ رقم الطلب: ' + text);
    });
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

  const getStatusColor = (status) => {
    const statusColors = {
      'info': 'bg-blue-100 text-blue-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'primary': 'bg-orange-100 text-orange-800',
      'secondary': 'bg-purple-100 text-purple-800',
      'success': 'bg-green-100 text-green-800',
      'danger': 'bg-red-100 text-red-800'
    };
    return statusColors[status.color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          body {
            font-size: 12px;
          }
          .print-title {
            font-size: 18px !important;
            font-weight: bold;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h1>
          <p className="text-gray-600">شكراً لك على ثقتك بنا. سنقوم بمعالجة طلبك في أقرب وقت ممكن.</p>
        </div>

        {/* Invoice/Order Details */}
        {(orderData || cartItems.length > 0) && (
          <div className="max-w-6xl mx-auto">
            {/* Invoice Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">
                        فاتورة رقم: {finalOrderNumber}
                      </h2>
                      <button
                        onClick={() => copyToClipboard(finalOrderNumber)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1"
                        title="نسخ رقم الطلب"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        نسخ
                      </button>
                    </div>
                    <p className="text-blue-100 mt-1">
                      تاريخ الطلب: {orderData ? formatDate(orderData.created_at) : new Date().toLocaleDateString('ar-SY')}
                    </p>
                  </div>
                  <div className="text-left">
                    {orderData?.status && (
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white ${
                        orderData.status.color === 'info' ? 'text-blue-800' : 
                        orderData.status.color === 'success' ? 'text-green-800' : 
                        orderData.status.color === 'warning' ? 'text-yellow-800' : 'text-gray-800'
                      }`}>
                        {orderData.status.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer & Delivery Info */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      معلومات العميل
                    </h3>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        <span className="font-medium">الاسم الكامل:</span> {
                          orderData?.customer_name || 
                          `${customerData?.customer_first_name || ''} ${customerData?.customer_father_name || ''} ${customerData?.customer_last_name || ''}`.trim() ||
                          'غير محدد'
                        }
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">رقم الهاتف:</span> {orderData?.phone || customerData?.customer_phone || 'غير محدد'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      عنوان التوصيل
                    </h3>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        <span className="font-medium">العنوان:</span> {
                          orderData?.full_address || 
                          `${customerData?.city || ''}, ${customerData?.street || ''}, ${customerData?.address || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',').trim() ||
                          'غير محدد'
                        }
                      </p>
                      {(orderData?.notes || customerData?.notes) && (
                        <p className="text-gray-700">
                          <span className="font-medium">ملاحظات:</span> {orderData?.notes || customerData?.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items */}
              {cartItems.length > 0 && (
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 ml-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    المنتجات المطلوبة ({cartItems.length} منتج)
                  </h3>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={item.id || index} className="flex items-start space-x-4 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{item.brand}</p>
                          <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoice Summary */}
              <div className="p-6 bg-gray-50">
                <div className="max-w-md ml-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الفاتورة</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>المجموع الفرعي:</span>
                      <span>{formatPrice(orderData?.total_price || cartTotal)}</span>
                    </div>
                    {orderData?.tax_amount && (
                      <div className="flex justify-between text-gray-600">
                        <span>الضريبة:</span>
                        <span>{formatPrice(orderData.tax_amount)}</span>
                      </div>
                    )}
                    <hr className="border-gray-300" />
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>المجموع الكلي:</span>
                      <span className="text-green-600">{formatPrice(orderData?.grand_total || grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4 no-print">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  طباعة الفاتورة
                </button>

                <Link
                  to="/order-tracking"
                  state={{ orderNumber: orderData?.number || orderNumber, phone: orderData?.phone || customerData?.customer_phone }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  تتبع الطلب
                </Link>
                
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  متابعة التسوق
                </Link>
              </div>

              {/* Important Notes */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-xl font-bold text-blue-800">معلومات مهمة</h4>
                </div>
                <div className="text-center space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <p className="text-blue-800 font-semibold text-lg">
                      رقم طلبك: <span className="text-2xl font-bold text-blue-600">{orderData?.number || orderNumber}</span>
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      احفظ هذا الرقم لتتبع طلبك لاحقاً
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-green-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium text-green-800">التواصل</span>
                      </div>
                      <p className="text-green-700">سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-yellow-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-yellow-800">التوصيل</span>
                      </div>
                      <p className="text-yellow-700">متوقع خلال 3-5 أيام عمل من تأكيد الطلب</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If only order number available */}
        {!orderData && orderNumber && (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                رقم طلبك: {orderNumber}
              </h2>
              <p className="text-gray-600 mb-6">
                احتفظ بهذا الرقم لتتبع حالة طلبك
              </p>
              <Link
                to="/order-tracking"
                state={{ orderNumber }}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                تتبع الطلب
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default OrderSuccess; 