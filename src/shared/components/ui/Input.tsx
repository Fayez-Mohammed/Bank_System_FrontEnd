import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onClear?: () => void
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      value,
      onClear,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== ''

    return (
      <div className="w-full flex flex-col space-y-1.5 text-right">
        {label && (
          <label className="text-xs font-semibold text-slate-300 select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            disabled={disabled}
            className={cn(
              'w-full h-12 px-3.5 text-sm rounded-xl bg-slate-800/80 border text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-slate-900',
              error
                ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/20'
                : 'border-slate-700/80 hover:border-slate-600',
              leftIcon ? 'pl-10' : '',
              rightIcon || (onClear && hasValue) ? 'pr-10' : '',
              className
            )}
            {...props}
          />

          {onClear && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="مسح النص"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {rightIcon && (!onClear || !hasValue) && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
