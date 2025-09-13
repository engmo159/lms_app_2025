import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير موجودة.
        </p>
        <Link href="/">
          <Button>
            العودة للصفحة الرئيسية
          </Button>
        </Link>
      </div>
    </div>
  )
}
