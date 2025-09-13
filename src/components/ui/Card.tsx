import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    children, 
    variant = 'default',
    padding = 'md',
    rounded = '2xl',
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-card text-card-foreground border',
      outlined: 'bg-transparent text-card-foreground border',
      elevated: 'bg-card text-card-foreground border shadow-soft-md hover:shadow-soft-lg transition-shadow',
      filled: 'bg-surface text-surface-foreground border-0',
    }
    
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
    
    const roundeds = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          paddings[padding],
          roundeds[rounded],
          'transition-all duration-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  divider?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, divider = false, padding = 'md', ...props }, ref) => {
    const paddings = {
      none: 'p-0',
      sm: 'p-4 pb-2',
      md: 'p-6 pb-4',
      lg: 'p-8 pb-6',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5',
          paddings[padding],
          divider && 'border-b mb-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, size = 'lg', ...props }, ref) => {
    const sizes = {
      sm: 'text-lg font-semibold',
      md: 'text-xl font-semibold',
      lg: 'text-2xl font-semibold',
      xl: 'text-3xl font-bold',
      '2xl': 'text-4xl font-bold',
    }
    
    return (
      <h2
        ref={ref}
        className={cn(
          'leading-none tracking-tight',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </h2>
    )
  }
)

CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, padding = 'md', ...props }, ref) => {
    const paddings = {
      none: 'p-0',
      sm: 'p-4 pt-0',
      md: 'p-6 pt-0',
      lg: 'p-8 pt-0',
    }
    
    return (
      <div 
        ref={ref} 
        className={cn(paddings[padding], className)} 
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  divider?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, divider = false, padding = 'md', ...props }, ref) => {
    const paddings = {
      none: 'p-0',
      sm: 'p-4 pt-2',
      md: 'p-6 pt-4',
      lg: 'p-8 pt-6',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          paddings[padding],
          divider && 'border-t mt-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
