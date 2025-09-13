import * as React from 'react'
import { Search, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(type)
    
    React.useEffect(() => {
      if (type === 'password' && showPassword) {
        setInputType('text')
      } else {
        setInputType(type || 'text')
      }
    }, [type, showPassword])
    
    const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`
    
    const variants = {
      default: 'bg-background border border-input',
      filled: 'bg-muted/50 border-transparent',
      outlined: 'bg-transparent border border-input',
    }
    
    const sizes = {
      sm: 'h-9 px-3 py-1 text-sm',
      md: 'h-10 px-4 py-2 text-base',
      lg: 'h-12 px-5 py-3 text-lg',
    }
    
    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }
    
    const stateClasses = error 
      ? 'border-destructive focus:border-destructive focus:ring-destructive' 
      : success 
        ? 'border-success focus:border-success focus:ring-success' 
        : 'focus:border-primary focus:ring-primary'
    
    const togglePassword = () => {
      setShowPassword(!showPassword)
    }
    
    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={cn(
              'block mb-1.5 font-medium text-sm',
              error ? 'text-destructive' : success ? 'text-success' : 'text-foreground'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            id={inputId}
            className={cn(
              'flex w-full rounded-md transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-soft',
              variants[variant],
              sizes[size],
              stateClasses,
              leftIcon && 'pl-10',
              (rightIcon || type === 'password') && 'pr-10',
              error && 'animate-shake'
            )}
            ref={ref}
            {...props}
          />
          
          {type === 'password' && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
              onClick={togglePassword}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className={iconSizes[size]} />
              ) : (
                <Eye className={iconSizes[size]} />
              )}
            </button>
          )}
          
          {rightIcon && type !== 'password' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              {rightIcon}
            </div>
          )}
          
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-destructive">
              <AlertCircle className={iconSizes[size]} />
            </div>
          )}
          
          {success && !error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-success">
              <CheckCircle className={iconSizes[size]} />
            </div>
          )}
        </div>
        
        {(error || success || helperText) && (
          <p className={cn(
            'mt-1.5 text-xs',
            error ? 'text-destructive' : success ? 'text-success' : 'text-muted-foreground'
          )}>
            {error || success || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
