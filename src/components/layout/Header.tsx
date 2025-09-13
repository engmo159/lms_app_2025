'use client'

import React from 'react'
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react'
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

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft'>
      <div className='container flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-4 rtl:space-x-reverse'>
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
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
              <span className='text-primary-foreground font-bold text-lg'>
                ف
              </span>
            </div>
            <h1 className='text-lg font-bold text-foreground hidden sm:block'>
              نظام إدارة الفصول
            </h1>
          </div>
        </div>

        <div className='flex items-center gap-2 rtl:space-x-reverse'>
          <nav className='flex items-center gap-1 rtl:space-x-reverse'>
            <ThemeToggle />

            <Button variant='ghost' size='icon' className='relative'>
              <Bell className='h-5 w-5' />
              <span className='absolute top-1 right-1 flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-red-500'></span>
              </span>
              <span className='sr-only'>Notifications</span>
            </Button>

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
