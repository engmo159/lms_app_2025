'use client'

import React from 'react'
import { BarChart3, TrendingUp, Download, Filter } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  attendanceRate: number
  averageGrade: number
  behaviorScore: number
  period: string
}

interface AnalyticsCardProps {
  data: AnalyticsData
  className?: string
  onFilter?: () => void
  onExport?: () => void
}

export function AnalyticsCard({
  data,
  className,
  onFilter,
  onExport,
}: AnalyticsCardProps) {
  const analyticsItems = [
    {
      title: 'معدل الحضور',
      value: `${data.attendanceRate}%`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      period: 'هذا الشهر',
    },
    {
      title: 'متوسط الدرجات',
      value: `${data.averageGrade}%`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      period: 'هذا الفصل',
    },
    {
      title: 'نقاط السلوك',
      value: data.behaviorScore.toString(),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      period: 'هذا الأسبوع',
    },
  ]

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center text-lg'>
              <BarChart3 className='h-5 w-5 ml-2' />
              التحليلات والإحصائيات
            </CardTitle>
            <CardDescription>
              تقارير مفصلة عن أداء الطلاب والفصول
            </CardDescription>
          </div>
          <div className='flex items-center space-x-2 space-x-reverse'>
            <Button variant='outline' size='sm' onClick={onFilter}>
              <Filter className='h-4 w-4 ml-2' />
              تصفية
            </Button>
            <Button variant='outline' size='sm' onClick={onExport}>
              <Download className='h-4 w-4 ml-2' />
              تصدير
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {analyticsItems.map((item, index) => (
            <div
              key={index}
              className='text-center p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors'
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3',
                  item.bgColor
                )}
              >
                <TrendingUp className={cn('h-6 w-6', item.color)} />
              </div>
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                {item.title}
              </h3>
              <p className={cn('text-3xl font-bold mb-1', item.color)}>
                {item.value}
              </p>
              <p className='text-sm text-muted-foreground'>{item.period}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
