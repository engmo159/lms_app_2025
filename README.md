# نظام إدارة الفصول - Teacher Management System

نظام شامل لإدارة الفصول الدراسية والطلاب والحضور والدرجات مخصص للمعلمين.

## المميزات الرئيسية

### 🔐 نظام المصادقة الآمن

- تسجيل دخول آمن باستخدام NextAuth.js
- تشفير كلمات المرور باستخدام bcrypt
- حماية الصفحات والـ API routes
- إدارة الجلسات التلقائية

### 🏫 إدارة الفصول

- إنشاء وإدارة الفصول الدراسية
- إضافة وصف وجدول زمني لكل فصل
- إعدادات مخصصة لكل فصل

### 👥 إدارة الطلاب

- إضافة وتعديل بيانات الطلاب
- ترتيب الطلاب حسب رقم الجلوس
- معلومات الاتصال بولي الأمر

### ✅ تسجيل الحضور

- تسجيل حضور وغياب الطلاب
- تتبع التأخير والإعذار
- إحصائيات الحضور اليومية والأسبوعية

### 📝 الواجبات والاختبارات

- إنشاء واجبات واختبارات متنوعة
- تحديد الدرجة العظمى والوزن
- نشر وإلغاء نشر الواجبات

### 📊 دفتر الدرجات

- إدخال درجات الطلاب
- حساب المتوسطات تلقائياً
- ترتيب الطلاب حسب الأداء

### 🎯 سجل السلوك

- تسجيل السلوك الإيجابي والسلبي
- نظام النقاط المخصص
- تتبع تطور السلوك

### 📈 التقارير والإحصائيات

- رسوم بيانية للحضور والدرجات
- تقارير مفصلة لكل فصل
- إحصائيات الأداء

### ⚙️ الإعدادات

- تخصيص الملف الشخصي
- إعدادات اللغة والمظهر
- إدارة الإشعارات

## التقنيات المستخدمة

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React

## متطلبات التشغيل

- Node.js 18+
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

## التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd teacher-management-system
```

### 2. تثبيت المتطلبات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في المجلد الجذر:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/teacher-app

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# App Configuration
NODE_ENV=development
```

**ملاحظة مهمة:**

- استخدم المفتاح السري التالي: `MOm4Iq/PkHzAuqK9XfFWfAmy1Wh6dky4dZzGLGjyJlg=`
- في الإنتاج، استخدم MongoDB Atlas أو خادم MongoDB آمن
- يمكنك إنشاء مفتاح جديد باستخدام: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### 4. تشغيل قاعدة البيانات

تأكد من تشغيل MongoDB:

```bash
# إذا كنت تستخدم MongoDB محلياً
mongod
```

### 5. تشغيل التطبيق

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## هيكل المشروع

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # صفحات المصادقة
│   ├── dashboard/         # صفحات لوحة التحكم
│   └── layout.tsx         # Layout الرئيسي
├── components/            # المكونات القابلة لإعادة الاستخدام
│   ├── ui/               # مكونات واجهة المستخدم
│   ├── layout/           # مكونات التخطيط
│   └── providers/        # مقدمي الخدمات
├── lib/                  # مكتبات مساعدة
├── models/               # نماذج Mongoose
└── types/                # تعريفات TypeScript
```

## API Endpoints

### المصادقة

- `POST /api/auth/register` - تسجيل حساب جديد
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### الفصول

- `GET /api/classes` - جلب جميع الفصول
- `POST /api/classes` - إنشاء فصل جديد
- `GET /api/classes/[id]` - جلب فصل محدد
- `PUT /api/classes/[id]` - تحديث فصل
- `DELETE /api/classes/[id]` - حذف فصل

### الطلاب

- `GET /api/students` - جلب جميع الطلاب
- `POST /api/students` - إضافة طالب جديد
- `GET /api/students/[id]` - جلب طالب محدد
- `PUT /api/students/[id]` - تحديث طالب
- `DELETE /api/students/[id]` - حذف طالب

### الحضور

- `GET /api/attendance` - جلب سجلات الحضور
- `POST /api/attendance` - تسجيل حضور جديد
- `PUT /api/attendance/[id]` - تحديث سجل حضور
- `DELETE /api/attendance/[id]` - حذف سجل حضور

### الواجبات

- `GET /api/assignments` - جلب جميع الواجبات
- `POST /api/assignments` - إنشاء واجب جديد
- `GET /api/assignments/[id]` - جلب واجب محدد
- `PUT /api/assignments/[id]` - تحديث واجب
- `DELETE /api/assignments/[id]` - حذف واجب

### الدرجات

- `GET /api/grades` - جلب جميع الدرجات
- `POST /api/grades` - إدخال درجة جديدة

### السلوك

- `GET /api/behavior` - جلب سجلات السلوك
- `POST /api/behavior` - إضافة سجل سلوك
- `GET /api/behavior/[id]` - جلب سجل محدد
- `PUT /api/behavior/[id]` - تحديث سجل
- `DELETE /api/behavior/[id]` - حذف سجل

### الملف الشخصي

- `GET /api/teacher/profile` - جلب بيانات المعلم
- `PUT /api/teacher/profile` - تحديث بيانات المعلم

## الاستخدام

### 1. إنشاء حساب

- اذهب إلى صفحة التسجيل (`/auth/signup`)
- أدخل بياناتك الشخصية
- أنشئ حسابك

### 2. تسجيل الدخول

- اذهب إلى صفحة تسجيل الدخول (`/auth/signin`)
- أدخل البريد الإلكتروني وكلمة المرور
- سيتم توجيهك تلقائياً إلى لوحة التحكم

### 3. إدارة الفصول

- من لوحة التحكم، اذهب إلى "الفصول"
- اضغط "إضافة فصل جديد"
- أدخل تفاصيل الفصل

### 4. إضافة الطلاب

- اذهب إلى "الطلاب"
- اضغط "إضافة طالب جديد"
- اختر الفصل وأدخل بيانات الطالب

### 5. تسجيل الحضور

- اذهب إلى "الحضور"
- اختر الفصل والتاريخ
- سجل حضور كل طالب

### 6. إدارة الواجبات

- اذهب إلى "الواجبات"
- أنشئ واجبات جديدة
- حدد الدرجة العظمى والوزن

### 7. إدخال الدرجات

- اذهب إلى "الدرجات"
- اختر الفصل
- أدخل درجات الطلاب

### 8. تتبع السلوك

- اذهب إلى "السلوك"
- سجل السلوك الإيجابي والسلبي
- تابع النقاط

### 9. عرض التقارير

- اذهب إلى "التقارير"
- اختر الفصل
- شاهد الإحصائيات والرسوم البيانية

## التخصيص

## الأمان والحماية

### 🔒 ميزات الأمان

- **تشفير كلمات المرور**: استخدام bcrypt لتشفير كلمات المرور
- **حماية الجلسات**: إدارة آمنة للجلسات باستخدام JWT
- **حماية الصفحات**: middleware لحماية الصفحات الحساسة
- **التحقق من الصلاحيات**: فحص الصلاحيات في كل API call
- **حماية CSRF**: حماية من هجمات Cross-Site Request Forgery

### 🛡️ أفضل الممارسات

- استخدم كلمات مرور قوية
- لا تشارك بيانات الاعتماد
- احتفظ بنسخ احتياطية منتظمة
- حدث النظام بانتظام

## التطوير والتخصيص

### إضافة مكونات جديدة

```typescript
// src/components/ui/NewComponent.tsx
import React from 'react'

interface NewComponentProps {
  // تعريف الخصائص
}

const NewComponent: React.FC<NewComponentProps> = ({ ...props }) => {
  return <div>{/* محتوى المكون */}</div>
}

export default NewComponent
```

### إضافة API Route جديد

```typescript
// src/app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // منطق GET
}

export async function POST(request: NextRequest) {
  // منطق POST
}
```

## النشر

### Vercel (مستحسن)

1. ارفع المشروع إلى GitHub
2. اربط المشروع بـ Vercel
3. أضف متغيرات البيئة في Vercel
4. انشر المشروع

### خادم VPS

1. ارفع الملفات إلى الخادم
2. ثبت Node.js و MongoDB
3. شغل `npm run build`
4. شغل `npm start`

## المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى:

- فتح issue جديد في GitHub
- التواصل عبر البريد الإلكتروني
- مراجعة الوثائق

## التحديثات المستقبلية

- [ ] تطبيق جوال (React Native)
- [ ] نظام إشعارات متقدم
- [ ] تصدير التقارير إلى PDF
- [ ] دعم متعدد اللغات
- [ ] نظام النسخ الاحتياطي التلقائي
- [ ] تكامل مع أنظمة إدارة المدارس
- [ ] نظام الدردشة مع أولياء الأمور
- [ ] تقارير متقدمة مع AI

---

تم تطوير هذا المشروع بـ ❤️ للمعلمين العرب
