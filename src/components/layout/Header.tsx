'use client'

import React from 'react'
import { Menu, Bell, User, Settings, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import LogoutButton from '@/components/auth/LogoutButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { data: session } = useSession()
  const [unread, setUnread] = React.useState<number>(0)

  // مزامنة عدد الإشعارات غير المقروءة من التخزين المحلي
  React.useEffect(() => {
    const readCount = () => {
      const v = Number(localStorage.getItem('notifications:unread') || '0')
      setUnread(Number.isNaN(v) ? 0 : v)
    }
    readCount()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'notifications:unread') readCount()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='container flex h-16 items-center px-4 sm:px-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onMenuClick}
            className='lg:hidden'
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
              <span className='text-lg font-bold text-primary-foreground'>
                ف
              </span>
            </div>
            <h1 className='hidden text-lg font-bold text-foreground sm:block'>
              نظام إدارة الفصول
            </h1>
          </div>
        </div>

        <div className='flex flex-1 items-center justify-end gap-2 sm:gap-4'>
          <nav className='flex items-center gap-2'>
            <ThemeToggle />

            {/* إضافة سريع */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <Plus className='h-5 w-5' />
                  <span className='sr-only'>Quick Add</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <Link href='/dashboard/classes'>إضافة فصل</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/dashboard/students'>إضافة طالب</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/dashboard/assignments'>إنشاء واجب</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications → صفحة مستقلة */}
            <Link href='/dashboard/notifications' className='relative'>
              <Button variant='ghost' size='icon' className='relative'>
                <Bell className='h-5 w-5' />
                {unread > 0 && (
                  <span className='absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white'>
                    {unread}
                  </span>
                )}
                <span className='sr-only'>Notifications</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='relative h-8 w-8 rounded-full'
                >
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={session?.user?.image || ''}
                      alt={session?.user?.name || 'User'}
                    />
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {session?.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {session?.user?.name || 'المعلم'}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {session?.user?.email}
                    </p>
                  </div>
                  <div className='mt-2'>
                    <Badge variant='secondary' className='text-xs'>
                      {session?.user?.role === 'teacher' ? 'معلم' : 'مستخدم'}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/dashboard/profile'>
                    <User className='mr-2 h-4 w-4' />
                    <span>الملف الشخصي</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/dashboard/settings'>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>الإعدادات</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='p-0'>
                  <LogoutButton className='w-full justify-start' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
