import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface BottomSheetProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg bg-slate-900 border-t border-slate-700/80 rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] pb-6 safe-bottom animate-slide-up',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Grab Handle */}
        <div className="flex items-center justify-center pt-3 pb-1 cursor-grab">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
