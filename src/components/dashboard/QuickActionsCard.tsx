'use client'

import React from 'react'
import {
  BookOpen,
  Users,
  UserCheck,
  Award,
  FileText,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface QuickAction {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  href?: string
  onClick?: () => void
}

interface QuickActionsCardProps {
  className?: string
  onActionClick?: (actionId: string) => void
}

export function QuickActionsCard({
  className,
  onActionClick,
}: QuickActionsCardProps) {
  const quickActions: QuickAction[] = [
    {
      id: 'add-class',
      title: 'إضافة فصل',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      onClick: () => onActionClick?.('add-class'),
    },
    {
      id: 'add-student',
      title: 'إضافة طالب',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      onClick: () => onActionClick?.('add-student'),
    },
    {
      id: 'take-attendance',
      title: 'تسجيل حضور',
      icon: UserCheck,
      color: 'text-yellow-600 dark:text-yellow-400',
      onClick: () => onActionClick?.('take-attendance'),
    },
    {
      id: 'enter-grades',
      title: 'إدخال درجات',
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400',
      onClick: () => onActionClick?.('enter-grades'),
    },
    {
      id: 'create-assignment',
      title: 'إنشاء واجب',
      icon: FileText,
      color: 'text-indigo-600 dark:text-indigo-400',
      onClick: () => onActionClick?.('create-assignment'),
    },
    {
      id: 'view-reports',
      title: 'عرض التقارير',
      icon: BarChart3,
      color: 'text-orange-600 dark:text-orange-400',
      onClick: () => onActionClick?.('view-reports'),
    },
  ]

  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader>
        <CardTitle className='flex items-center text-lg'>
          <Plus className='h-5 w-5 ml-2' />
          الإجراءات السريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3'>
          {quickActions.map(action => {
            const IconComponent = action.icon
            return (
              <Button
                key={action.id}
                variant='outline'
                size='sm'
                className='flex flex-col items-center p-4 h-auto hover:scale-105 transition-transform'
                onClick={action.onClick}
              >
                <IconComponent className={cn('h-5 w-5 mb-2', action.color)} />
                <span className='text-xs text-center leading-tight'>
                  {action.title}
                </span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
