'use client'

import { Bell, Eye } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function NotificationsPage() {
  const notifications = [
    {
      id: '1',
      title: 'تم إضافة واجب جديد',
      time: 'قبل 10 دقائق',
      type: 'assignment',
    },
    {
      id: '2',
      title: 'تذكير: إدخال درجات اختبار العلوم',
      time: 'قبل ساعة',
      type: 'grade',
    },
    {
      id: '3',
      title: 'تم تسجيل غياب 3 طلاب اليوم',
      time: 'قبل ساعتين',
      type: 'attendance',
    },
  ]

  return (
    <main className='flex-1 space-y-6 p-4 sm:p-6 bg-muted/40'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            الإشعارات
          </h1>
          <p className='text-sm text-muted-foreground'>
            عرض آخر التنبيهات والتحديثات
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            تعليم الكل كمقروء
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Eye className='h-4 w-4' />
            أحدث الإشعارات
          </CardTitle>
          <CardDescription>إشعارات النظام الأخيرة</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          {notifications.map(n => (
            <div
              key={n.id}
              className='flex items-center justify-between rounded-md border bg-background p-3'
            >
              <div className='flex flex-col'>
                <span className='font-medium'>{n.title}</span>
                <span className='text-xs text-muted-foreground'>{n.time}</span>
              </div>
              <Button variant='ghost' size='sm'>
                تفاصيل
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
