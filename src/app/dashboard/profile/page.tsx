import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'

// This is the user profile page.
// It allows users to view and edit their personal information and account settings.

export default function ProfilePage() {
  return (
    <div className='space-y-6 p-4 sm:p-6'>
      <header>
        <h1 className='text-3xl font-bold'>الملف الشخصي</h1>
        <p className='text-muted-foreground'>
          إدارة معلومات حسابك الشخصي وتفضيلاتك.
        </p>
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Personal Information Card */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
            <CardDescription>
              يمكنك تحديث اسمك وصورتك الشخصية هنا.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src='' alt='User' />
                <AvatarFallback className='bg-primary text-primary-foreground text-2xl'>
                  م
                </AvatarFallback>
              </Avatar>
              <Button variant='outline'>تغيير الصورة</Button>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='fullName'>الاسم الكامل</Label>
              <Input id='fullName' defaultValue='المعلم' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>البريد الإلكتروني</Label>
              <Input
                id='email'
                type='email'
                defaultValue='teacher@example.com'
                readOnly
              />
            </div>
            <div className='flex justify-end'>
              <Button>حفظ التغييرات</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الحساب</CardTitle>
            <CardDescription>إدارة إعدادات الأمان والخصوصية.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password'>كلمة المرور الحالية</Label>
              <Input id='password' type='password' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>كلمة المرور الجديدة</Label>
              <Input id='newPassword' type='password' />
            </div>
            <div className='flex justify-end'>
              <Button variant='secondary'>تغيير كلمة المرور</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
