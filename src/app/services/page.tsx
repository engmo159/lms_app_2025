'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Wrench,
  LayoutDashboard,
  UserCheck,
  FileText,
  Award,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

// صفحة "الخدمات" — تعرض خدمات/ميزات رئيسية كرؤوس بطاقات
export default function ServicesPage() {
  const services = [
    {
      icon: LayoutDashboard,
      title: 'لوحة التحكم',
      desc: 'نظرة عامة وإحصائيات',
    },
    { icon: UserCheck, title: 'تسجيل الحضور', desc: 'إدارة حضور وغياب الطلاب' },
    { icon: FileText, title: 'الواجبات', desc: 'إنشاء وتتبع الواجبات' },
    { icon: Award, title: 'الدرجات', desc: 'إدخال وتتبع الدرجات' },
    { icon: BarChart3, title: 'التقارير', desc: 'تقارير مفصلة وتحليلات' },
  ]

  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <PublicNavbar />
      <main className='flex-1'>
        {/* Header */}
        <section className='bg-muted/50 border-b'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold'>الخدمات</h1>
                <p className='text-muted-foreground'>
                  ما الذي نقدّمه في نظام إدارة الفصول؟
                </p>
              </div>
              <Wrench className='h-10 w-10 text-primary' />
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {services.map((s, i) => (
              <Card key={i}>
                <CardHeader>
                  <s.icon className='h-8 w-8 text-primary mb-2' />
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{s.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={mapServiceToHref(s.title)}>
                    <Button variant='outline' size='sm'>
                      فتح
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}

// Helper: يربط اسم الخدمة بالمسار داخل التطبيق
function mapServiceToHref(name: string) {
  switch (name) {
    case 'لوحة التحكم':
      return '/dashboard'
    case 'تسجيل الحضور':
      return '/dashboard/attendance'
    case 'الواجبات':
      return '/dashboard/assignments'
    case 'الدرجات':
      return '/dashboard/grades'
    case 'التقارير':
      return '/dashboard/reports'
    default:
      return '/dashboard'
  }
}
