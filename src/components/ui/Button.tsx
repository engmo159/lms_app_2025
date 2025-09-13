import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-soft hover:shadow-soft-md',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 shadow-soft hover:shadow-soft-md',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-soft-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 shadow-soft hover:shadow-soft-md',
        success:
          'bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 shadow-soft hover:shadow-soft-md',
        warning:
          'bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80 shadow-soft hover:shadow-soft-md',
        link: 'bg-transparent text-primary hover:underline hover:bg-transparent shadow-none',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2 text-base',
        lg: 'h-11 px-6 text-lg',
        xl: 'h-12 px-8 text-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      children,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSizes: Record<NonNullable<typeof size>, string> = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-7 w-7',
      icon: 'h-5 w-5',
    }

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && 'relative opacity-0'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {leftIcon && (
          <span
            className={cn('mr-2 rtl:ml-2 inline-flex', iconSizes[size ?? 'md'])}
          >
            {leftIcon}
          </span>
        )}

        {children}

        {rightIcon && (
          <span
            className={cn('ml-2 rtl:mr-2 inline-flex', iconSizes[size ?? 'md'])}
          >
            {rightIcon}
          </span>
        )}

        {loading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className={cn('animate-spin', iconSizes[size ?? 'md'])} />
          </div>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
