import type { Metadata } from 'next'
import './globals.css'
import AuthSessionProvider from '@/components/providers/SessionProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'

// تم تعطيل الخطوط مؤقتاً لتجنب مشاكل Turbopack

export const metadata: Metadata = {
  title: 'نظام إدارة الفصول - Teacher Management System',
  description: 'نظام شامل لإدارة الفصول والطلاب والحضور والدرجات',
  keywords: ['إدارة الفصول', 'إدارة الطلاب', 'تتبع الحضور', 'تسجيل الدرجات', 'نظام تعليمي'],
  authors: [{ name: 'فريق تطوير نظام إدارة الفصول' }],
  openGraph: {
    title: 'نظام إدارة الفصول',
    description: 'نظام شامل لإدارة الفصول والطلاب والحضور والدرجات',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang='ar' 
      dir="rtl" 
      suppressHydrationWarning 
      className=""
    >
      <head>
        <meta name="theme-color" content="hsl(var(--primary))" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className='min-h-screen bg-background font-sans antialiased'
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange={false}
          storageKey='classroom-theme'
        >
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}