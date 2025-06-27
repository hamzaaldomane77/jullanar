# مشروع React مع Tailwind CSS

هذا مشروع React أساسي مع Tailwind CSS. يوضح المشروع كيفية استخدام React مع Tailwind CSS لإنشاء واجهات مستخدم جميلة وسريعة الاستجابة.

## الميزات

- إعداد React مع Vite للتطوير السريع
- تكامل Tailwind CSS
- مكونات قابلة لإعادة الاستخدام
- تصميم متجاوب
- أنيميشن وتأثيرات
- دعم RTL للغة العربية

## البدء

```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء للإنتاج
npm run build
```

## هيكل المشروع

```
/
├── public/           # الملفات الثابتة
├── src/              # مصدر التطبيق
│   ├── assets/       # الصور والأصول
│   ├── components/   # مكونات React
│   ├── App.jsx       # مكون التطبيق الرئيسي
│   ├── main.jsx      # نقطة الدخول الرئيسية
│   └── index.css     # أنماط CSS وتوجيهات Tailwind
├── index.html        # ملف HTML الرئيسي
├── tailwind.config.js # تكوين Tailwind CSS
├── postcss.config.js # تكوين PostCSS
└── package.json      # تبعيات المشروع
```

## تخصيص

يمكنك تخصيص تكوين Tailwind CSS في ملف `tailwind.config.js` وإضافة المزيد من المكونات في مجلد `src/components`.
