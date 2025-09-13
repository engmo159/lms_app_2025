import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
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
