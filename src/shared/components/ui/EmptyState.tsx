import React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from './Button'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h4 className="text-base font-semibold text-slate-200 mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
