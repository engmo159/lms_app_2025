'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Rocket, Users, Shield, CheckCircle2 } from 'lucide-react'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

// صفحة "نبذة عنا" — محتوى تعريفي منظم ومتوافق مع التصميم الحالي
// تستخدم المكوّنات المشتركة (Card, Button) وتنسّق RTL وتدعم الوضع الليلي
export default function AboutPage() {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <PublicNavbar />
      <main className='flex-1'>
        {/* Hero */}
        <section className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16'>
            <div className='text-center'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>
                نبذة عن النظام
              </h1>
              <p className='text-lg md:text-xl text-primary-foreground/90'>
                نظام متكامل لإدارة الفصول، يسهّل على المعلم متابعة الطلاب
                والحضور والدرجات بكفاءة.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card>
              <CardHeader>
                <Rocket className='h-8 w-8 text-primary mb-2' />
                <CardTitle>رسالتنا</CardTitle>
                <CardDescription>
                  تبسيط العمليات اليومية للمعلمين
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>
                  نوفّر أدوات عملية لإدارة الفصل من مكان واحد وبخطوات قليلة.
                </p>
                <p>التركيز على سهولة الاستخدام والسرعة والموثوقية.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className='h-8 w-8 text-primary mb-2' />
                <CardTitle>قيمنا</CardTitle>
                <CardDescription>
                  التعاون والشفافية وتحسين تجربة المعلّم
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>نطوّر خصائص بناءً على احتياجات المعلمين الفعلية.</p>
                <p>واجهة RTL متناسقة ودعم كامل للوضع الليلي.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className='h-8 w-8 text-primary mb-2' />
                <CardTitle>الخصوصية</CardTitle>
                <CardDescription>حماية بيانات الطلاب والمعلمين</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>نلتزم بأفضل ممارسات الأمان وتشفير البيانات الحساسة.</p>
                <p>صلاحيات دقيقة وحسابات آمنة.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Highlights */}
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5' />
                لماذا نظامنا؟
              </CardTitle>
              <CardDescription>مزايا مختصرة بنظرة واحدة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm'>
                <div className='rounded-lg border p-4 bg-muted/40'>
                  واجهة عربية RTL متناسقة
                </div>
                <div className='rounded-lg border p-4 bg-muted/40'>
                  لوحة تحكم غنيّة بالبيانات
                </div>
                <div className='rounded-lg border p-4 bg-muted/40'>
                  إدارة حضور ودرجات مبسّطة
                </div>
                <div className='rounded-lg border p-4 bg-muted/40'>
                  تكامل سهل مع واجهات API
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <p className='text-muted-foreground'>ابدأ باستخدام النظام الآن</p>
            <div className='space-x-3 space-x-reverse'>
              <Link href='/auth/signup'>
                <Button size='lg'>إنشاء حساب</Button>
              </Link>
              <Link href='/contact'>
                <Button size='lg' variant='outline'>
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
