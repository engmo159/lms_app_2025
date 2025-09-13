'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Users,
  UserCheck,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  Download,
  Filter,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ClassOverviewCard } from '@/components/dashboard/ClassOverviewCard'
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard'
import { UpcomingEventsCard } from '@/components/dashboard/UpcomingEventsCard'
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard'
import { AnalyticsCard } from '@/components/dashboard/AnalyticsCard'

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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch classes with stats
      const classesResponse = await fetch('/api/classes?includeStats=true')
      const classesData = await classesResponse.json()

      // Fetch notifications
      const notificationsResponse = await fetch(
        '/api/notifications?isRead=false'
      )
      const notificationsData = await notificationsResponse.json()

      // Fetch upcoming activities
      const activitiesResponse = await fetch('/api/activities?status=scheduled')
      const activitiesData = await activitiesResponse.json()

      // Calculate stats
      const totalStudents = classesData.reduce(
        (sum: number, cls: any) => sum + (cls.stats?.studentCount || 0),
        0
      )
      const totalAttendance = classesData.reduce(
        (sum: number, cls: any) => sum + (cls.stats?.attendanceToday || 0),
        0
      )
      const averageAttendance =
        totalStudents > 0 ? (totalAttendance / totalStudents) * 100 : 0
      const averageGrade =
        classesData.reduce(
          (sum: number, cls: any) => sum + (cls.stats?.averageGrade || 0),
          0
        ) / classesData.length || 0

      setStats({
        totalClasses: classesData.length,
        totalStudents,
        todayAttendance: Math.round(averageAttendance),
        pendingGrades: 8, // TODO: Calculate from assignments
        averageGrade: Math.round(averageGrade),
        behaviorScore: 85, // TODO: Calculate from behavior data
        upcomingEvents: activitiesData.length,
        unreadNotifications: notificationsData.unreadCount || 0,
      })

      setClasses(
        classesData.map((cls: any) => ({
          id: cls._id,
          name: cls.name,
          subject: cls.subject,
          grade: cls.grade,
          studentCount: cls.stats?.studentCount || 0,
          attendanceRate: cls.stats?.attendanceRate || 0,
          averageGrade: cls.stats?.averageGrade || 0,
          nextClass: cls.schedule?.[0]?.day,
        }))
      )

      setUpcomingEvents(
        activitiesData.slice(0, 5).map((activity: any) => ({
          id: activity._id,
          title: activity.title,
          type: activity.type,
          date: new Date(activity.startDate).toLocaleDateString('ar-SA'),
          time: new Date(activity.startDate).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          class: activity.class?.name,
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
        {
          id: '4',
          type: 'behavior',
          description: 'تم تسجيل سلوك إيجابي لطالب في فصل اللغة العربية',
          time: 'منذ 3 ساعات',
          status: 'success',
        },
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'إجمالي الفصول',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      trend: '+2',
      trendUp: true,
    },
    {
      title: 'إجمالي الطلاب',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      trend: '+12',
      trendUp: true,
    },
    {
      title: 'حضور اليوم',
      value: `${stats.todayAttendance}%`,
      icon: UserCheck,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'متوسط الدرجات',
      value: `${stats.averageGrade}%`,
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      trend: '+3%',
      trendUp: true,
    },
    {
      title: 'نقاط السلوك',
      value: stats.behaviorScore,
      icon: TrendingUp,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      trend: '+8',
      trendUp: true,
    },
    {
      title: 'الأحداث القادمة',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      trend: 'اليوم',
      trendUp: false,
    },
    {
      title: 'إشعارات جديدة',
      value: stats.unreadNotifications,
      icon: Bell,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      trend: 'جديد',
      trendUp: false,
    },
    {
      title: 'درجات معلقة',
      value: stats.pendingGrades,
      icon: Clock,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      trend: 'يحتاج مراجعة',
      trendUp: false,
    },
  ]

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* Header Section */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            لوحة التحكم
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            مرحباً بك في نظام إدارة الفصول الدراسية
          </p>
        </div>
        <div className='flex items-center space-x-4 space-x-reverse'>
          <ThemeToggle />
          <Button
            variant='outline'
            size='sm'
            className='flex items-center space-x-2 space-x-reverse'
          >
            <Settings className='h-4 w-4' />
            <span>الإعدادات</span>
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center space-x-2 space-x-reverse relative'
          >
            <Bell className='h-4 w-4' />
            <span>الإشعارات</span>
            {stats.unreadNotifications > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center'>
                {stats.unreadNotifications}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Classes Overview */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center'>
                    <BookOpen className='h-5 w-5 ml-2' />
                    نظرة عامة على الفصول
                  </CardTitle>
                  <CardDescription>
                    إحصائيات مفصلة لفصولك الدراسية
                  </CardDescription>
                </div>
                <Button variant='outline' size='sm'>
                  <Eye className='h-4 w-4 ml-2' />
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <RecentActivityCard activities={recentActivity} />
          <UpcomingEventsCard events={upcomingEvents} />
          <QuickActionsCard />
        </div>
      </div>

      {/* Analytics Section */}
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
    </div>
  )
}
