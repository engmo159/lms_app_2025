'use client'

import React from 'react'
import { LucideIcon, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        'shadow-soft hover:shadow-soft-md transition-shadow',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {trend && (
          <p
            className={cn(
              'text-xs text-muted-foreground',
              trendUp ? 'text-success' : 'text-destructive'
            )}
          >
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
