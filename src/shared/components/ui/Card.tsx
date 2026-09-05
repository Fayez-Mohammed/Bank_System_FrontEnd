import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-slate-850/80 border border-slate-750/70 rounded-2xl p-4 shadow-sm backdrop-blur-sm',
          interactive &&
            'cursor-pointer active:scale-[0.99] hover:border-slate-600/80 transition-all duration-150',
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

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center justify-between pb-3 border-b border-slate-700/40 mb-3', className)} {...props}>
    {children}
  </div>
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-base font-semibold text-slate-100 leading-tight', className)} {...props}>
    {children}
  </h3>
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => <div className={cn('space-y-3', className)} {...props}>{children}</div>

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('pt-3 border-t border-slate-700/40 mt-3 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
)
