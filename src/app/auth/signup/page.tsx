'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        router.push('/auth/signin?message=تم إنشاء الحساب بنجاح')
      } else {
        const data = await response.json()
        setError(data.error || 'حدث خطأ أثناء إنشاء الحساب')
      }
    } catch (error) {
      setError('حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-background px-4'>
      <div className='w-full max-w-md'>
        <div className='flex justify-center mb-6'>
          <BookOpen className='h-12 w-12 text-primary' />
        </div>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle>إنشاء حساب جديد</CardTitle>
            <CardDescription>
              ابدأ رحلتك معنا لإدارة فصولك الدراسية بكفاءة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md font-medium text-sm'>
                  {error}
                </div>
              )}
              <div className='space-y-2'>
                <Label htmlFor='name'>الاسم الكامل</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='الاسم الكامل'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>البريد الإلكتروني</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>كلمة المرور</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>تأكيد كلمة المرور</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </Button>
            </form>
            <div className='mt-4 text-center text-sm'>
              لديك حساب بالفعل؟{' '}
              <Link
                href='/auth/signin'
                className='text-primary hover:underline'
              >
                تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
