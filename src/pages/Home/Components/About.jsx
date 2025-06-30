import React from 'react';

export default function About() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <h2 className="text-4xl font-bold text-center mb-4 text-red-800">حول جُلّنار</h2>
        <div className="w-32 h-0.5 bg-red-800 mx-auto mb-8"></div>
        
        {/* الوصف */}
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
          في جلنار، نمنحك تجربة تسوق إلكترونية متكاملة تجمع بين السرعة، الأمان، والراحة. استعرض واطلب منتجاتك المفضلة بكل سهولة، عبر واجهة استخدام بسيطة وتجربة استخدام سلسة أينما كنت وفي أي وقت.
        </p>

        {/* الميزات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* الأمان */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">🔒 الأمان أولويتنا</h3>
            <p className="text-gray-600 leading-relaxed">
              تم تطوير جلنار وفق أعلى معايير الأمان والتشفير، لحماية بياناتك ومعلوماتك المالية، ولضمان تجربة تسوق آمنة وواثقة في كل خطوة.
            </p>
          </div>

          {/* السرعة */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">⚡ سرعة في كل تفصيل</h3>
            <p className="text-gray-600 leading-relaxed">
              من تصفح المنتجات إلى تأكيد الطلبات، تم تصميم كل جزء في جلنار ليكون سريعًا وفعالًا، لتلبية احتياجاتك دون تأخير أو تعقيد.
            </p>
          </div>

          {/* الدعم */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">🛠 دعم على مدار الساعة</h3>
            <p className="text-gray-600 leading-relaxed">
              فريق دعم جلنار متواجد دائمًا للإجابة عن استفساراتك ومساعدتك في أي مشكلة، ليبقى تسوقك معنا سلسًا ومريحًا دون انقطاع.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 