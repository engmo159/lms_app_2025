import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  disabled?: boolean
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ className, value, onChange, placeholder = 'اختر التاريخ', disabled = false, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(value || new Date())

    const currentMonth = selectedDate.getMonth()
    const currentYear = selectedDate.getFullYear()

    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]

    const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (month: number, year: number) => {
      return new Date(year, month, 1).getDay()
    }

    const handleDateSelect = (day: number) => {
      const newDate = new Date(currentYear, currentMonth, day)
      setSelectedDate(newDate)
      onChange?.(newDate)
      setIsOpen(false)
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
      const newDate = new Date(selectedDate)
      if (direction === 'prev') {
        newDate.setMonth(currentMonth - 1)
      } else {
        newDate.setMonth(currentMonth + 1)
      }
      setSelectedDate(newDate)
    }

    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? value.toLocaleDateString('ar-SA') : placeholder}
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for first day */}
                {Array.from({ length: firstDay }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                
                {/* Days */}
                {days.map((day) => (
                  <Button
                    key={day}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      'h-8 w-8 p-0 text-sm',
                      value && value.getDate() === day && value.getMonth() === currentMonth && value.getFullYear() === currentYear
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
