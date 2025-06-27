import React from 'react';

export default function About() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <h2 className="text-4xl font-bold text-center mb-4 text-red-800">حول</h2>
        <div className="w-32 h-0.5 bg-red-800 mx-auto mb-8"></div>
        
        {/* الوصف */}
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
          تطبيقنا هو الحل الأمثل لإدارة مشترياتك بسهولة وأمان يتيح لك عرض وشراء المنتجات بسرعة وسلاسة. مع
          واجهة استخدام بسيطة وتجربة مريحة نسعى من خلاله إلى تقديم خدمات متميزة تضمن الشفافية
          والموثوقية، مما يتيح لك الشراء في أي وقت ومن أي مكان.
        </p>

        {/* الميزات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* الأمان */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">الأمان</h3>
            <p className="text-gray-600 leading-relaxed">
              تطبيقنا مصمم بأعلى معايير الأمان لحماية بياناتك ومعلوماتك المالية، مما يضمن لك تجربة تسوق آمنة وواثقة في كل خطوة.
            </p>
          </div>

          {/* السرعة */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">السرعة</h3>
            <p className="text-gray-600 leading-relaxed">
              تطبيقنا يتميز بالسرعة العالية للتنفيذ العمليات، مما يجعل تجربة هادئة وسلسة تلبي احتياجاتك في أي وقت.
            </p>
          </div>

          {/* الدعم */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">الدعم</h3>
            <p className="text-gray-600 leading-relaxed">
              فريق الدعم الفني هو متواجد على مدار الساعة للرد على استفساراتك وحل أي مشاكل قد تواجهها لتضمن تجربة استخدام سلسة وخالية من التعقيدات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 