import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div 
        className="container mx-auto px-4 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">سياسة الخصوصية</h1>
            <p className="text-lg opacity-90">متجر جُلّنار - نعتني بخصوصيتك كما نعتني بتجربتك</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <p className="text-gray-600 text-lg">
                في متجر جُلّنار، نلتزم بحماية خصوصيتك وبياناتك الشخصية، ونحرص على أن تكون تجربتك معنا آمنة ومريحة. 
                توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك.
              </p>
            </motion.div>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">1</span>
                المعلومات التي نجمعها
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                <li>بيانات الزبون: الاسم، رقم الهاتف، عنوان الشحن.</li>
                <li>بيانات الطلب: تفاصيل المنتجات.</li>
                <li>بيانات تقنية: نوع الجهاز، نظام التشغيل، عنوان IP، اللغة، معلومات الاستخدام.</li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">2</span>
                كيفية استخدام البيانات
              </h2>
              <p className="mb-3 text-gray-700">نستخدم بياناتك من أجل:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                <li>معالجة الطلبات وتوصيل المنتجات.</li>
                <li>تقديم دعم فني وخدمة عملاء فعالة.</li>
                <li>تحسين تجربة المستخدم وتخصيص العروض.</li>
                <li>إرسال الإشعارات والعروض الخاصة.</li>
                <li>حماية المستخدمين من الاستخدام غير المشروع.</li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">3</span>
                حماية المعلومات
              </h2>
              <p className="text-gray-700">
                نستخدم تقنيات حماية متقدمة تشمل التشفير، جدران الحماية، وإجراءات الأمان الصارمة لمنع أي وصول غير مصرح به إلى بياناتك.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">4</span>
                مشاركة المعلومات
              </h2>
              <p className="mb-3 text-gray-700">نشارك بياناتك فقط مع جهات موثوقة وضمن حدود الاستخدام المشروع، مثل:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                <li>شركات الشحن والتوصيل.</li>
                <li>الجهات القانونية المختصة في حال وجود طلب رسمي.</li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">5</span>
                ملفات تعريف الارتباط (Cookies)
              </h2>
              <p className="text-gray-700">
                نستخدم ملفات الكوكيز لتحسين تجربة التصفح داخل التطبيق/الموقع. ويمكنك دائمًا تعديل إعدادات الكوكيز من جهازك.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">6</span>
                حقوق المستخدم
              </h2>
              <p className="mb-3 text-gray-700">يحق لك:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                <li>تعديل أو تحديث بياناتك.</li>
                <li>الاستفسار عن استخدام بياناتك.</li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">7</span>
                التحديثات
              </h2>
              <p className="text-gray-700">
                قد نقوم بتحديث هذه السياسة. سيتم إعلامك بأي تغييرات جوهرية داخل التطبيق أو عبر وسائل التواصل.
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">8</span>
                بيانات التواصل
              </h2>
              <p className="mb-3 text-gray-700">لأي استفسار أو دعم، يسعدنا تواصلك معنا عبر:</p>
              <div className="space-y-3 mr-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+963983596774" className="text-blue-600 hover:underline">0983596774</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@jullanar.shop" className="text-blue-600 hover:underline">info@jullanar.shop</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href="https://www.jullnar.shop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.jullnar.shop</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                  <a href="https://www.facebook.com/share/18gwjDK5nw/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">صفحتنا على فيسبوك</a>
                </div>
              </div>
            </motion.section>

            <motion.div variants={itemVariants} className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 italic">
                متجر جُلّنار – نعتني بخصوصيتك كما نعتني بتجربتك.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Privacy;
