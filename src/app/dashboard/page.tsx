'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  UserCheck,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  Clock,
  Eye,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useTheme } from 'next-themes'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ClassOverviewCard } from '@/components/dashboard/ClassOverviewCard'
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard'
import { UpcomingEventsCard } from '@/components/dashboard/UpcomingEventsCard'
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard'
import { AnalyticsCard } from '@/components/dashboard/AnalyticsCard'

// Developer Note on Layout:
// This dashboard uses CSS Grid for its main layout (`grid-cols-1`, `lg:grid-cols-3`, etc.).
// Grid is preferred over Flexbox here because it excels at creating two-dimensional layouts,
// aligning items in both rows and columns simultaneously. This is ideal for complex dashboards.
// Flexbox is better suited for one-dimensional layouts (a single row or column).

interface DashboardStats {
  totalClasses: number
  totalStudents: number
  todayAttendance: number
  pendingGrades: number
  averageGrade: number
  behaviorScore: number
  upcomingEvents: number
  unreadNotifications: number
}

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

interface ClassOverview {
  id: string
  name: string
  subject: string
  grade: string
  studentCount: number
  attendanceRate: number
  averageGrade: number
  nextClass?: string
}

interface UpcomingEvent {
  id: string
  title: string
  type: string
  date: string
  time: string
  class?: string
}

export default function DashboardPage() {
  const { theme } = useTheme()
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    todayAttendance: 0,
    pendingGrades: 0,
    averageGrade: 0,
    behaviorScore: 0,
    upcomingEvents: 0,
    unreadNotifications: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [classes, setClasses] = useState<ClassOverview[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [loading, setLoading] = useState(true)

  // يربط الإجراءات السريعة بمسارات/أكشنات فعلية
  const handleQuickAction = (id: string) => {
    switch (id) {
      case 'add-class':
        window.location.href = '/dashboard/classes'
        break
      case 'add-student':
        window.location.href = '/dashboard/students'
        break
      case 'take-attendance':
        window.location.href = '/dashboard/attendance'
        break
      case 'enter-grades':
        window.location.href = '/dashboard/grades'
        break
      case 'create-assignment':
        window.location.href = '/dashboard/assignments'
        break
      case 'view-reports':
        window.location.href = '/dashboard/reports'
        break
      default:
        break
    }
  }

  useEffect(() => {
    // Mock data fetching
    const fetchDashboardData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data
      const classesData = [
        {
          _id: '1',
          name: 'الرياضيات',
          subject: 'الرياضيات',
          grade: 'الصف الخامس',
          stats: { studentCount: 25, attendanceRate: 95, averageGrade: 88 },
        },
        {
          _id: '2',
          name: 'العلوم',
          subject: 'العلوم',
          grade: 'الصف الخامس',
          stats: { studentCount: 24, attendanceRate: 92, averageGrade: 91 },
        },
      ]
      const notificationsData = { unreadCount: 3 }
      const activitiesData = [
        {
          _id: '1',
          title: 'اختبار نصف الفصل',
          type: 'exam',
          startDate: new Date(),
          class: { name: 'العلوم' },
        },
        {
          _id: '2',
          title: 'رحلة ميدانية',
          type: 'trip',
          startDate: new Date(),
          class: { name: 'التاريخ' },
        },
      ]

      const totalStudents = classesData.reduce(
        (sum, cls) => sum + (cls.stats?.studentCount || 0),
        0
      )

      setStats({
        totalClasses: 2,
        totalStudents: 49,
        todayAttendance: 93,
        pendingGrades: 8,
        averageGrade: 89,
        behaviorScore: 85,
        upcomingEvents: 2,
        unreadNotifications: 3,
      })

      setClasses(
        classesData.map(cls => ({
          id: cls._id,
          name: cls.name,
          subject: cls.subject,
          grade: cls.grade,
          studentCount: cls.stats.studentCount,
          attendanceRate: cls.stats.attendanceRate,
          averageGrade: cls.stats.averageGrade,
          nextClass: 'الأحد',
        }))
      )

      setUpcomingEvents(
        activitiesData.map(activity => ({
          id: activity._id,
          title: activity.title,
          type: activity.type,
          date: new Date(activity.startDate).toLocaleDateString('ar-SA'),
          time: new Date(activity.startDate).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          class: activity.class.name,
        }))
      )

      setRecentActivity([
        {
          id: '1',
          type: 'attendance',
          description: 'تم تسجيل حضور 25 طالب في فصل الرياضيات',
          time: 'منذ 10 دقائق',
          status: 'success',
        },
        {
          id: '2',
          type: 'grade',
          description: 'تم إدخال درجات اختبار العلوم',
          time: 'منذ ساعة',
          status: 'success',
        },
        {
          id: '3',
          type: 'student',
          description: 'تم إضافة طالب جديد: أحمد محمد',
          time: 'منذ ساعتين',
          status: 'info',
        },
      ])

      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'إجمالي الفصول',
      value: stats.totalClasses,
      icon: BookOpen,
      trend: '+2',
    },
    {
      title: 'إجمالي الطلاب',
      value: stats.totalStudents,
      icon: Users,
      trend: '+12',
    },
    {
      title: 'حضور اليوم',
      value: `${stats.todayAttendance}%`,
      icon: UserCheck,
      trend: '+5%',
    },
    {
      title: 'متوسط الدرجات',
      value: `${stats.averageGrade}%`,
      icon: Award,
      trend: '+3%',
    },
    {
      title: 'نقاط السلوك',
      value: stats.behaviorScore,
      icon: TrendingUp,
      trend: '+8',
    },
    {
      title: 'الأحداث القادمة',
      value: stats.upcomingEvents,
      icon: Calendar,
      trend: 'اليوم',
    },
    {
      title: 'إشعارات جديدة',
      value: stats.unreadNotifications,
      icon: Bell,
      trend: 'جديد',
    },
    {
      title: 'درجات معلقة',
      value: stats.pendingGrades,
      icon: Clock,
      trend: 'يحتاج مراجعة',
    },
  ]

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <main className='flex-1 space-y-6 p-4 sm:p-6 bg-muted/40'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>لوحة التحكم</h1>
          <p className='text-muted-foreground'>
            مرحباً بك في نظام إدارة الفصول الدراسية
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <Settings className='h-4 w-4' />
            <span>الإعدادات</span>
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2 relative'
          >
            <Bell className='h-4 w-4' />
            <span>الإشعارات</span>
            {stats.unreadNotifications > 0 && (
              <span className='absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-2 py-1 text-xs text-destructive-foreground'>
                {stats.unreadNotifications}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div className='flex flex-col'>
                <CardTitle className='flex items-center gap-2'>
                  <BookOpen className='h-5 w-5' />
                  نظرة عامة على الفصول
                </CardTitle>
                <CardDescription>
                  إحصائيات مفصلة لفصولك الدراسية
                </CardDescription>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <Eye className='h-4 w-4' />
                عرض الكل
              </Button>
            </CardHeader>
            <CardContent className='space-y-4'>
              {classes.map(cls => (
                <ClassOverviewCard
                  key={cls.id}
                  id={cls.id}
                  name={cls.name}
                  subject={cls.subject}
                  grade={cls.grade}
                  studentCount={cls.studentCount}
                  attendanceRate={cls.attendanceRate}
                  averageGrade={cls.averageGrade}
                  nextClass={cls.nextClass}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <RecentActivityCard activities={recentActivity} />
          <UpcomingEventsCard events={upcomingEvents} />
          <QuickActionsCard onActionClick={handleQuickAction} />
        </div>
      </div>

      <AnalyticsCard
        data={{
          attendanceRate: stats.todayAttendance,
          averageGrade: stats.averageGrade,
          behaviorScore: stats.behaviorScore,
          period: 'هذا الشهر',
        }}
        onFilter={() => console.log('Filter clicked')}
        onExport={() => console.log('Export clicked')}
      />
    </main>
  )
}
