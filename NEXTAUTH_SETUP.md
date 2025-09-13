# دليل إعداد NextAuth.js

## نظرة عامة

تم إعداد NextAuth.js بشكل كامل في هذا المشروع مع الميزات التالية:

- ✅ تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
- ✅ تشفير كلمات المرور باستخدام bcrypt
- ✅ حماية الصفحات والـ API routes
- ✅ إدارة الجلسات التلقائية
- ✅ middleware للحماية
- ✅ مكونات مخصصة للمصادقة

## الملفات المهمة

### 1. إعداد NextAuth

- `src/lib/auth.ts` - إعداد NextAuth الرئيسي
- `src/app/api/auth/[...nextauth]/route.ts` - API route للمصادقة
- `src/types/next-auth.d.ts` - تعريفات TypeScript

### 2. مكونات المصادقة

- `src/components/auth/ProtectedRoute.tsx` - حماية الصفحات
- `src/components/auth/LogoutButton.tsx` - زر تسجيل الخروج
- `src/hooks/useAuth.ts` - hooks مخصصة للمصادقة

### 3. الحماية

- `src/middleware.ts` - middleware لحماية الصفحات
- `src/app/dashboard/layout.tsx` - حماية لوحة التحكم

## الاستخدام

### 1. تسجيل الدخول

```typescript
import { signIn } from 'next-auth/react'

const result = await signIn('credentials', {
  email: 'user@example.com',
  password: 'password',
  redirect: false,
})
```

### 2. تسجيل الخروج

```typescript
import { signOut } from 'next-auth/react'

await signOut({ callbackUrl: '/auth/signin' })
```

### 3. فحص الجلسة

```typescript
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()

if (status === 'loading') return <p>Loading...</p>
if (status === 'unauthenticated') return <p>Access Denied</p>
```

### 4. حماية الصفحات

```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>محتوى محمي</div>
    </ProtectedRoute>
  )
}
```

### 5. حماية API Routes

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // منطق API
}
```

## متغيرات البيئة المطلوبة

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=MOm4Iq/PkHzAuqK9XfFWfAmy1Wh6dky4dZzGLGjyJlg=
MONGODB_URI=mongodb://localhost:27017/teacher-app
```

## إنشاء مفتاح سري قوي

```bash
# باستخدام OpenSSL
openssl rand -base64 32

# أو باستخدام Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## نصائح الأمان

1. **استخدم HTTPS في الإنتاج**
2. **غير NEXTAUTH_SECRET بانتظام**
3. **استخدم كلمات مرور قوية**
4. **فعّل حماية CSRF**
5. **راقب محاولات تسجيل الدخول**

## استكشاف الأخطاء

### مشكلة: "Invalid credentials"

- تأكد من صحة البريد الإلكتروني وكلمة المرور
- تحقق من تشفير كلمة المرور في قاعدة البيانات

### مشكلة: "Session expired"

- تحقق من إعدادات الجلسة في `auth.ts`
- تأكد من صحة `NEXTAUTH_SECRET`

### مشكلة: "Redirect loop"

- تحقق من إعدادات `pages` في `authOptions`
- تأكد من صحة `NEXTAUTH_URL`

## التخصيص

### إضافة provider جديد

```typescript
// في src/lib/auth.ts
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({...}),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
}
```

### تخصيص صفحات المصادقة

```typescript
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
}
```

## الدعم

إذا واجهت أي مشاكل:

1. تحقق من console logs
2. راجع ملفات NextAuth documentation
3. تأكد من إعدادات البيئة
4. تحقق من اتصال قاعدة البيانات
