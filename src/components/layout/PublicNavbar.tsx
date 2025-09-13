'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'

// PublicNavbar: شريط تنقّل للصفحات العامة (الصفحة الرئيسية وما شابه)
export default function PublicNavbar() {
  return (
    <header className='sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-lg'>ف</span>
          </div>
          <span className='font-semibold hidden sm:inline'>
            نظام إدارة الفصول
          </span>
        </Link>

        {/* Nav items */}
        <nav className='hidden md:flex items-center gap-4 text-sm text-muted-foreground'>
          <Link href='/about' className='hover:text-foreground'>
            عن النظام
          </Link>
          <Link href='/services' className='hover:text-foreground'>
            الخدمات
          </Link>
          <Link href='/contact' className='hover:text-foreground'>
            اتصل بنا
          </Link>
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <Link href='/auth/signin'>
            <Button variant='outline' size='sm'>
              تسجيل الدخول
            </Button>
          </Link>
          <Link href='/auth/signup'>
            <Button size='sm'>إنشاء حساب</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
