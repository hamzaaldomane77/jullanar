# دليل استخدام APIs الطلبات - متجر جولنار

## نظرة عامة

تم تحديث متجر جولنار ليدعم APIs الطلبات الجديدة لإرسال وتتبع الطلبات.

## 1. إرسال طلب جديد

### API Endpoint
```
POST https://backend.jullanar.shop/api/v1/orders
```

### البيانات المطلوبة
```json
{
  "customer_first_name": "محمود",
  "customer_father_name": "سمير", 
  "customer_last_name": "أيوب",
  "customer_phone": "0999999999",
  "city": "صحنايا",
  "street": "الباسل",
  "address": "مساكن الاشرفية",
  "notes": "ممكن يكون فاضي",
  "items": [
    {
      "shop_product_id": 1,
      "qty": 2
    },
    {
      "shop_product_id": 2,
      "qty": 1
    }
  ]
}
```

### الرد المتوقع
```json
{
  "data": {
    "number": "OR-471374",
    "status": {
      "value": "new",
      "label": "جديد",
      "color": "info"
    },
    "customer_name": "محمود سمير أيوب",
    "full_address": "صحنايا, الباسل, مساكن الاشرفية",
    "phone": "0999999999",
    "notes": "ممكن يكون فاضي",
    "total_price": 262000,
    "tax_amount": 26200,
    "grand_total": 288200,
    "created_at": "2025-06-28"
  }
}
```

## 2. تتبع طلب موجود

### API Endpoint
```
POST https://backend.jullanar.shop/api/v1/orders/track
```

### البيانات المطلوبة
```json
{
  "number": "OR-164799",
  "phone": "0999999999"
}
```

### الرد المتوقع
```json
{
  "data": {
    "number": "OR-164799",
    "status": {
      "value": "new",
      "label": "جديد",
      "color": "info"
    },
    "customer_name": "محمود سمير أيوب",
    "full_address": "صحنايا, الباسل, مساكن الاشرفية",
    "phone": "0999999999",
    "notes": "ممكن يكون فاضي",
    "total_price": "192090.00",
    "tax_amount": "19209.00",
    "grand_total": "211299.00",
    "created_at": "2025-06-26"
  }
}
```

## 3. التدفق في التطبيق

### إرسال طلب
1. المستخدم يضيف منتجات إلى السلة
2. يذهب إلى صفحة الدفع `/checkout`
3. يملأ نموذج معلومات العميل والتوصيل
4. عند الإرسال، يتم استدعاء API إرسال الطلب
5. في حالة النجاح، ينتقل إلى صفحة نجاح الطلب `/order-success`
6. يعرض تفاصيل الطلب ورقم الطلب

### تتبع طلب
1. المستخدم يذهب إلى صفحة تتبع الطلب `/order-tracking`
2. يدخل رقم الطلب ورقم الهاتف
3. يتم استدعاء API تتبع الطلب
4. تظهر تفاصيل الطلب وحالته

## 4. اختبار APIs

### في بيئة التطوير
افتح console المتصفح واستخدم:

```javascript
// اختبار إرسال طلب
await window.testApi.testSubmitOrder();

// اختبار تتبع طلب
await window.testApi.testTrackOrder("OR-164799", "0999999999");

// تشغيل جميع الاختبارات
await window.testApi.runApiTests();
```

### في Postman
1. **إرسال طلب**:
   - Method: POST
   - URL: `https://backend.jullanar.shop/api/v1/orders`
   - Headers: `Content-Type: application/json`
   - Body: استخدم JSON المثال أعلاه

2. **تتبع طلب**:
   - Method: POST
   - URL: `https://backend.jullanar.shop/api/v1/orders/track`
   - Headers: `Content-Type: application/json`
   - Body: `{"number": "OR-164799", "phone": "0999999999"}`

## 5. معالجة الأخطاء

### أخطاء شائعة

1. **CORS Issues**: يتم التعامل معها تلقائياً باستخدام proxy servers
2. **بيانات مفقودة**: يتم التحقق من البيانات قبل الإرسال
3. **طلب غير موجود**: رسالة واضحة للمستخدم
4. **مشاكل شبكة**: إعادة المحاولة مع proxies مختلفة

### الحالات المدعومة

**حالات الطلب المختلفة**:
- `new` (جديد) - لون أزرق
- `confirmed` (مؤكد) - لون أصفر
- `processing` (قيد المعالجة) - لون برتقالي
- `shipped` (تم الشحن) - لون بنفسجي
- `delivered` (تم التوصيل) - لون أخضر
- `cancelled` (ملغي) - لون أحمر

## 6. الملفات المحدثة

- `src/services/api.js` - دوال API محدثة
- `src/pages/Checkout/Checkout.jsx` - تنسيق البيانات الصحيح
- `src/pages/OrderTracking/OrderTracking.jsx` - POST request مع رقم الهاتف
- `src/pages/OrderSuccess/OrderSuccess.jsx` - صفحة جديدة لعرض نجاح الطلب
- `src/utils/testApi.js` - أدوات اختبار APIs
- `src/App.jsx` - مسار جديد لصفحة نجاح الطلب

## 7. نصائح مهمة

1. **احفظ رقم الطلب**: ضروري لتتبع الطلب لاحقاً
2. **رقم الهاتف**: مطلوب لتتبع الطلب (نفس الرقم المستخدم في الطلب)
3. **التحقق من البيانات**: يتم التحقق من صحة البيانات قبل الإرسال
4. **أمان البيانات**: لا يتم حفظ بيانات حساسة في localStorage
5. **تجربة المستخدم**: رسائل واضحة وتحديثات حالة في الوقت الفعلي

---

## للمطورين

### إضافة منتج جديد للطلب
```javascript
const newItem = {
  shop_product_id: productId, // مطلوب
  qty: quantity // مطلوب
};
```

### تخصيص حالات الطلب
قم بتحديث `getStatusColor` في الملفات ذات الصلة لإضافة حالات جديدة.

### إضافة validation إضافي
قم بتحديث `validateForm` في `Checkout.jsx` لإضافة قواعد تحقق جديدة 