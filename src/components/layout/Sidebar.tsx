'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  GraduationCap,
  UserCheck,
  FileText,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import LogoutButton from '@/components/auth/LogoutButton'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

const navigation = [
  {
    name: 'لوحة التحكم',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'نظرة عامة على النظام',
  },
  {
    name: 'الفصول',
    href: '/dashboard/classes',
    icon: BookOpen,
    description: 'إدارة الفصول الدراسية',
  },
  {
    name: 'الطلاب',
    href: '/dashboard/students',
    icon: Users,
    description: 'قائمة الطلاب وتفاصيلهم',
  },
  {
    name: 'الحضور',
    href: '/dashboard/attendance',
    icon: UserCheck,
    description: 'تسجيل حضور وغياب الطلاب',
  },
  {
    name: 'الواجبات',
    href: '/dashboard/assignments',
    icon: FileText,
    description: 'إدارة الواجبات والمهام',
  },
  {
    name: 'الدرجات',
    href: '/dashboard/grades',
    icon: Award,
    description: 'تتبع درجات الطلاب',
  },
  {
    name: 'السلوك',
    href: '/dashboard/behavior',
    icon: GraduationCap,
    description: 'متابعة سلوك الطلاب',
  },
  {
    name: 'التقارير',
    href: '/dashboard/reports',
    icon: BarChart3,
    description: 'تقارير وإحصائيات',
  },
  {
    name: 'الإعدادات',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'إعدادات النظام',
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  // حفظ حالة الطيّ محلياً لضمان التناسق بين الزيارات
  React.useEffect(() => {
    const saved = localStorage.getItem('sidebar:collapsed')
    if (saved === 'true') setIsCollapsed(true)
  }, [])
  React.useEffect(() => {
    localStorage.setItem('sidebar:collapsed', isCollapsed ? 'true' : 'false')
  }, [isCollapsed])

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full bg-background shadow-soft-md transition-all duration-300 ease-in-out lg:translate-x-0 lg:static rtl:left-0 rtl:border-r rtl:right-auto rtl:border-l-0',
          isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center justify-between border-b px-4'>
            {!isCollapsed && (
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                  <span className='text-primary-foreground font-bold text-lg'>
                    ف
                  </span>
                </div>
                <h1 className='text-xl font-bold text-primary'>
                  نظام إدارة الفصول
                </h1>
              </div>
            )}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsCollapsed(!isCollapsed)}
              className='hidden lg:flex'
            >
              {isCollapsed ? (
                <ChevronLeft className='h-5 w-5' />
              ) : (
                <ChevronRight className='h-5 w-5' />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-1 px-3 py-4 overflow-y-auto'>
            {navigation.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-accent text-accent-foreground font-medium'
                  )}
                  onClick={onClose}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className='h-5 w-5 flex-shrink-0' />
                  {!isCollapsed && (
                    <div className='flex flex-col'>
                      <span>{item.name}</span>
                      {isActive && (
                        <Badge
                          variant='secondary'
                          className='text-xs mt-1 w-fit'
                        >
                          {item.description}
                        </Badge>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User profile */}
          {!isCollapsed && (
            <div className='p-4 border-t'>
              <div className='flex items-center gap-3 mb-4'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src='' alt='User' />
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    م
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <p className='text-sm font-medium'>المعلم</p>
                  <p className='text-xs text-muted-foreground'>
                    teacher@example.com
                  </p>
                </div>
              </div>
              <LogoutButton className='w-full justify-start' />
            </div>
          )}

          {/* Collapsed logout */}
          {isCollapsed && (
            <div className='p-3 border-t flex justify-center'>
              <LogoutButton size='sm' className='h-8 w-8 p-0' />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
