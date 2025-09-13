'use client'

import React from 'react'
import { CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface RecentActivity {
  id: string
  type:
    | 'attendance'
    | 'grade'
    | 'student'
    | 'behavior'
    | 'assignment'
    | 'notification'
  description: string
  time: string
  status?: 'success' | 'warning' | 'error' | 'info'
}

interface RecentActivityCardProps {
  activities: RecentActivity[]
  className?: string
}

export function RecentActivityCard({
  activities,
  className,
}: RecentActivityCardProps) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className='h-4 w-4 text-green-600' />
      case 'warning':
        return <AlertCircle className='h-4 w-4 text-yellow-600' />
      case 'error':
        return <AlertCircle className='h-4 w-4 text-red-600' />
      case 'info':
        return <Info className='h-4 w-4 text-blue-600' />
      default:
        return <Clock className='h-4 w-4 text-gray-500' />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader>
        <CardTitle className='flex items-center text-lg'>
          <Clock className='h-5 w-5 ml-2' />
          النشاط الأخير
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              لا توجد أنشطة حديثة
            </div>
          ) : (
            activities.map(activity => (
              <div
                key={activity.id}
                className='flex items-start space-x-3 space-x-reverse group hover:bg-accent/50 p-2 rounded-lg transition-colors'
              >
                <div className='flex-shrink-0 mt-1'>
                  {getStatusIcon(activity.status)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-foreground group-hover:text-accent-foreground transition-colors'>
                    {activity.description}
                  </p>
                  <p
                    className={cn(
                      'text-xs mt-1',
                      getStatusColor(activity.status)
                    )}
                  >
                    {activity.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
