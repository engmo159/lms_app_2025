'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export default function LogoutButton({
  variant = 'ghost',
  size = 'sm',
  className = '',
  children,
}: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true,
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      {children || (
        <>
          <LogOut className='h-4 w-4 ml-2' />
          تسجيل الخروج
        </>
      )}
    </Button>
  )
}
