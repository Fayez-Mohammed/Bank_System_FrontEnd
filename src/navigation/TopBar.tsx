import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface TopBarProps {
  title: string
  showBackButton?: boolean
  onBack?: () => void
  actions?: React.ReactNode
  subtitle?: string
  className?: string
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBackButton = false,
  onBack,
  actions,
  subtitle,
  className,
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 safe-top flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="p-2 -mr-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800 transition-colors"
            aria-label="رجوع"
          >
            {/* RTL back arrow points right */}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col">
          <h1 className="text-base font-bold text-slate-100 truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <span className="text-2xs text-slate-400 truncate mt-0.5 font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-1.5 shrink-0">{actions}</div>
      )}
    </header>
  )
}
