'use client'

import React from 'react'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface UpcomingEvent {
  id: string
  title: string
  type: string
  date: string
  time: string
  class?: string
}

interface UpcomingEventsCardProps {
  events: UpcomingEvent[]
  className?: string
}

export function UpcomingEventsCard({
  events,
  className,
}: UpcomingEventsCardProps) {
  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'exam':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'assignment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'quiz':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'project':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'meeting':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'exam':
        return '📝'
      case 'assignment':
        return '📋'
      case 'quiz':
        return '❓'
      case 'project':
        return '📊'
      case 'meeting':
        return '👥'
      default:
        return '📅'
    }
  }

  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader>
        <CardTitle className='flex items-center text-lg'>
          <Calendar className='h-5 w-5 ml-2' />
          الأحداث القادمة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {events.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              لا توجد أحداث قادمة
            </div>
          ) : (
            events.map(event => (
              <div
                key={event.id}
                className='flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors group'
              >
                <div className='flex-1'>
                  <div className='flex items-center space-x-2 space-x-reverse mb-1'>
                    <span className='text-lg'>
                      {getEventTypeIcon(event.type)}
                    </span>
                    <h4 className='text-sm font-medium text-foreground group-hover:text-accent-foreground transition-colors'>
                      {event.title}
                    </h4>
                  </div>
                  <div className='flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground'>
                    <Clock className='h-3 w-3' />
                    <span>
                      {event.date} - {event.time}
                    </span>
                  </div>
                  {event.class && (
                    <div className='flex items-center space-x-1 space-x-reverse text-xs text-muted-foreground mt-1'>
                      <BookOpen className='h-3 w-3' />
                      <span>{event.class}</span>
                    </div>
                  )}
                </div>
                <Badge
                  variant='secondary'
                  className={cn('text-xs', getEventTypeColor(event.type))}
                >
                  {event.type}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
