import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 select-none'

    const sizeStyles = {
      sm: 'h-10 px-3 text-xs gap-1.5 min-h-[40px]',
      md: 'h-12 px-4 text-sm gap-2 min-h-[48px]', // Meets mobile 48px touch target
      lg: 'h-14 px-6 text-base gap-2.5 min-h-[56px]',
    }

    const variantStyles = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-md shadow-blue-900/30',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-850 border border-slate-700/60',
      outline:
        'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/60 active:bg-slate-800',
      ghost:
        'bg-transparent text-slate-300 hover:bg-slate-800/60 active:bg-slate-800',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-md shadow-rose-900/30',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
