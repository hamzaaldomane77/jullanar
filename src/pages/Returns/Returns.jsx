import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Returns = () => {
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">سياسة الاسترجاع والتبديل</h1>
            <p className="text-lg opacity-90">متجر جُلّنار - نضمن لك حقك ونهتم برضاك</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <p className="text-gray-600 text-lg">
                في متجر جُلّنار، نحرص على رضاكم التام عن المنتجات التي نقدمها، ونسعى لتوفير تجربة تسوّق مرنة وسهلة. 
                توضح هذه السياسة الشروط والإجراءات المتعلقة بعمليات الاسترجاع والاستبدال.
              </p>
            </motion.div>

            <motion.section variants={itemVariants} className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">1</span>
                الشروط العامة
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                <li>يُمكن استرجاع أو استبدال المنتجات خلال 3 أيام من تاريخ الاستلام.</li>
                <li>يجب أن يكون المنتج بحالته الأصلية، غير مستخدم، وغير متضرر، وبكامل تغليفه الأصلي.</li>
                <li>يجب إرفاق إثبات الاستلام أو فاتورة الطلب (في حال تم إصدارها).</li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">2</span>
                الحالات التي يُقبل فيها الاسترجاع أو التبديل
              </h2>
              <ul className="space-y-2 text-gray-700 mr-6">
                <li className="flex items-start">
                  <span className="text-green-500 font-bold text-xl ml-2">✅</span>
                  <span>تم تسليم منتج مختلف عن المطلوب.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 font-bold text-xl ml-2">✅</span>
                  <span>وجود عيب مصنعي واضح أو تلف في المنتج عند الاستلام.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 font-bold text-xl ml-2">✅</span>
                  <span>وصول المنتج بحالة غير مطابقة للوصف أو الصور المعروضة.</span>
                </li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">3</span>
                الحالات التي لا يُقبل فيها الاسترجاع أو التبديل
              </h2>
              <ul className="space-y-2 text-gray-700 mr-6">
                <li className="flex items-start">
                  <span className="text-red-500 font-bold text-xl ml-2">❌</span>
                  <span>إذا تم استخدام المنتج أو فتحه أو تغييره عن حالته الأصلية.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 font-bold text-xl ml-2">❌</span>
                  <span>المنتجات المصنّعة حسب الطلب أو المصممة خصيصًا للمستخدم.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 font-bold text-xl ml-2">❌</span>
                  <span>مرور أكثر من 3 أيام على استلام الطلب دون تقديم طلب استرجاع.</span>
                </li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">4</span>
                آلية تقديم طلب الاسترجاع أو الاستبدال
              </h2>
              <p className="mb-3 text-gray-700">التواصل معنا عبر أحد قنوات الدعم التالية:</p>
              <div className="space-y-3 mr-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+963983596774" className="text-blue-600 hover:underline">0983596774</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@jullanar.shop" className="text-blue-600 hover:underline">info@jullanar.shop</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 ml-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" clipRule="evenodd" />
                  </svg>
                  <a href="https://wa.me/+963983596774" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">تواصل عبر واتساب</a>
                </div>
              </div>
              
              <div className="mt-4 mr-6">
                <p className="mb-2 text-gray-700 font-medium">تزويدنا بـ:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mr-6">
                  <li>اسم الزبون أو رقم الطلب و رقم الهاتف</li>
                  <li>سبب الاسترجاع أو الاستبدال</li>
                  <li>صورة توضح حالة المنتج (إن وُجدت)</li>
                </ul>
                <p className="mt-3 text-gray-700">سيتم الرد على طلبك خلال 1-2 يوم عمل.</p>
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">5</span>
                آلية إعادة المنتج
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                <li>يتم التنسيق مع فريق المتجر لاستلام المنتج أو إرجاعه يدويًا حسب المدينة/المنطقة.</li>
                <li>في حال كان الخطأ من طرفنا، نتحمل تكاليف الاسترجاع أو التوصيل.</li>
                <li>إذا كان السبب شخصيًا (مثل تغيير رأي الزبون)، يتحمل الزبون تكلفة الشحن.</li>
              </ul>
            </motion.section>

            <motion.section variants={itemVariants} className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center ml-2">6</span>
                الاسترداد المالي
              </h2>
              <div className="flex items-start">
                <span className="text-blue-500 font-bold text-xl ml-2">🔁</span>
                <p className="text-gray-700">
                  بما أن الدفع لا يتم داخل التطبيق حاليًا، فإن أي اتفاق مالي يتم بالتنسيق المباشر مع الزبون، وسيُعاد بنفس الطريقة التي تم بها.
                </p>
              </div>
            </motion.section>

            <motion.div variants={itemVariants} className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-2">
                متجر جُلّنار يضمن لك حقك، ويهتم برضاك.
              </p>
              <p className="text-gray-600 italic">
                شكراً لاختيارك لنا
              </p>
              
              <div className="mt-6 flex justify-center space-x-4 rtl:space-x-reverse">
                <a 
                  href="https://www.facebook.com/share/18gwjDK5nw/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                  فيسبوك
                </a>
                <a 
                  href="https://wa.me/+963983596774" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" clipRule="evenodd" />
                  </svg>
                  واتساب
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Returns;
