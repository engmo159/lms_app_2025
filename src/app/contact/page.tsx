'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Mail, MessageSquare, Phone } from 'lucide-react'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

// صفحة "اتصل بنا" — نموذج بسيط Placeholder + بيانات تواصل
export default function ContactPage() {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <PublicNavbar />
      <main className='flex-1'>
        {/* Header */}
        <section className='bg-muted/50 border-b'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
            <h1 className='text-3xl font-bold mb-2'>اتصل بنا</h1>
            <p className='text-muted-foreground'>
              يسعدنا تواصلك معنا لأي استفسار أو اقتراح
            </p>
          </div>
        </section>

        {/* Content */}
        <section className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Form */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MessageSquare className='h-5 w-5' />
                أرسل رسالة
              </CardTitle>
              <CardDescription>نموذج تجريبي Placeholder</CardDescription>
            </CardHeader>
            <CardContent>
              <form className='space-y-4' onSubmit={e => e.preventDefault()}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='name'>الاسم</Label>
                    <Input id='name' placeholder='اسمك الكامل' />
                  </div>
                  <div>
                    <Label htmlFor='email'>البريد الإلكتروني</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor='subject'>العنوان</Label>
                  <Input id='subject' placeholder='موضوع الرسالة' />
                </div>
                <div>
                  <Label htmlFor='message'>الرسالة</Label>
                  <textarea
                    id='message'
                    className='w-full rounded-md border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[140px]'
                    placeholder='اكتب رسالتك هنا...'
                  ></textarea>
                </div>
                <Button type='submit'>إرسال</Button>
              </form>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
              <CardDescription>طرق بديلة للتواصل</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 text-sm'>
              <div className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-primary' />
                <span>support@classroom.example</span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-primary' />
                <span>+966 555 000 111</span>
              </div>
            </CardContent>
            <CardFooter>
              <p className='text-xs text-muted-foreground'>
                سنرد عليك خلال 1-2 يوم عمل
              </p>
            </CardFooter>
          </Card>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
