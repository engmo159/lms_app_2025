'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-destructive">خطأ</h1>
        <h2 className="text-2xl font-semibold text-foreground">حدث خطأ غير متوقع</h2>
        <p className="text-muted-foreground">
          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
        </p>
        <div className="space-x-4 space-x-reverse">
          <Button onClick={reset}>
            المحاولة مرة أخرى
          </Button>
          <Link href="/">
            <Button variant="outline">
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
