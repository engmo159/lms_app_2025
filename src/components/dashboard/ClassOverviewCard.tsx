'use client'

import React from 'react'
import { Eye, Settings, Users, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ClassOverviewCardProps {
  id: string
  name: string
  subject: string
  grade: string
  studentCount: number
  attendanceRate: number
  averageGrade: number
  nextClass?: string
  className?: string
}

export function ClassOverviewCard({
  id,
  name,
  subject,
  grade,
  studentCount,
  attendanceRate,
  averageGrade,
  nextClass,
  className,
}: ClassOverviewCardProps) {
  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-all duration-200 hover:scale-[1.02]',
        className
      )}
    >
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <h3 className='font-semibold text-foreground text-lg mb-1'>
              {name}
            </h3>
            <p className='text-sm text-muted-foreground mb-3'>
              {subject} - الصف {grade}
            </p>
            <div className='flex items-center space-x-4 space-x-reverse'>
              <div className='flex items-center space-x-1 space-x-reverse'>
                <Users className='h-4 w-4 text-blue-500' />
                <span className='text-xs text-muted-foreground'>
                  {studentCount} طالب
                </span>
              </div>
              <div className='flex items-center space-x-1 space-x-reverse'>
                <TrendingUp className='h-4 w-4 text-green-500' />
                <span className='text-xs text-muted-foreground'>
                  حضور: {attendanceRate.toFixed(1)}%
                </span>
              </div>
              <div className='flex items-center space-x-1 space-x-reverse'>
                <Award className='h-4 w-4 text-purple-500' />
                <span className='text-xs text-muted-foreground'>
                  متوسط: {averageGrade.toFixed(1)}%
                </span>
              </div>
            </div>
            {nextClass && (
              <div className='mt-2 text-xs text-muted-foreground'>
                الفصل القادم: {nextClass}
              </div>
            )}
          </div>
          <div className='flex items-center space-x-2 space-x-reverse'>
            <Button variant='outline' size='sm'>
              <Eye className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='sm'>
              <Settings className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
