'use client'

import Link from 'next/link'

// PublicFooter: تذييل بسيط للصفحات العامة
export default function PublicFooter() {
  return (
    <footer className='border-t bg-background'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-muted-foreground'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p>
            © {new Date().getFullYear()} نظام إدارة الفصول. جميع الحقوق محفوظة.
          </p>
          <nav className='flex items-center gap-4'>
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
        </div>
      </div>
    </footer>
  )
}
