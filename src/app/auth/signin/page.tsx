'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react'
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

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin'
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : 'حدث خطأ غير متوقع'
        )
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20 p-4'>
      <div className='w-full max-w-md space-y-6 animate-fade-in'>
        {/* Logo + Title */}
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='flex items-center justify-center p-3 rounded-full bg-primary/10'>
            <BookOpen className='h-10 w-10 text-primary' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              نظام إدارة الفصول
            </h1>
            <p className='text-muted-foreground mt-2'>
              مرحباً بعودتك! أدخل بياناتك للوصول إلى حسابك.
            </p>
          </div>
        </div>

        {/* Card */}
        <Card className='shadow-soft-lg border-0 overflow-hidden'>
          <CardHeader className='space-y-1 px-6 pt-6 pb-4'>
            <CardTitle className='text-2xl text-center'>تسجيل الدخول</CardTitle>
            <CardDescription className='text-center'>
              أدخل بريدك الإلكتروني وكلمة المرور للمتابعة
            </CardDescription>
          </CardHeader>
          <CardContent className='px-6 pb-6'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {error && (
                <div className='bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md flex items-start gap-3 animate-shake'>
                  <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
                  <div className='text-sm font-medium'>{error}</div>
                </div>
              )}

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-medium'>
                  البريد الإلكتروني
                </Label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground'>
                    <Mail className='h-5 w-5' />
                  </div>
                  <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className='pl-10'
                  />
                </div>
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password' className='text-sm font-medium'>
                    كلمة المرور
                  </Label>
                  <Link
                    href='/auth/forgot-password'
                    className='text-sm font-medium text-primary hover:underline transition-colors'
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground'>
                    <Lock className='h-5 w-5' />
                  </div>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='pl-10'
                  />
                  <button
                    type='button'
                    aria-label={
                      showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'
                    }
                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full'
                disabled={loading}
                size='lg'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className='flex items-center my-6'>
              <div className='flex-grow border-t border-muted-foreground/20'></div>
              <span className='px-2 text-xs text-muted-foreground'>أو</span>
              <div className='flex-grow border-t border-muted-foreground/20'></div>
            </div>

            {/* Social Login */}
            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={() => signIn('google')}
            >
              تسجيل الدخول عبر Google
            </Button>

            {/* Signup Link */}
            <div className='mt-6 text-center text-sm'>
              ليس لديك حساب؟{' '}
              <Link
                href='/auth/signup'
                className='text-primary hover:underline font-medium transition-colors'
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='text-center text-xs text-muted-foreground'>
          © 2025 نظام إدارة الفصول. جميع الحقوق محفوظة.
        </div>
      </div>
    </div>
  )
}
