import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3500) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, type, message, duration }])

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id)
        }, duration)
      }
    },
    [dismissToast]
  )

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, 'success', duration),
    [showToast]
  )
  const error = useCallback(
    (message: string, duration?: number) => showToast(message, 'error', duration),
    [showToast]
  )
  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, 'warning', duration),
    [showToast]
  )
  const info = useCallback(
    (message: string, duration?: number) => showToast(message, 'info', duration),
    [showToast]
  )

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />
    }
  }

  const getBgClass = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-800/80 text-emerald-100'
      case 'error':
        return 'bg-rose-950/90 border-rose-800/80 text-rose-100'
      case 'warning':
        return 'bg-amber-950/90 border-amber-800/80 text-amber-100'
      case 'info':
      default:
        return 'bg-slate-800/95 border-slate-700 text-slate-100'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, dismissToast }}>
      {children}

      {/* Floating Mobile Toast Container (at top safe area) */}
      <div className="fixed top-3 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2 safe-top">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 text-sm font-medium',
              getBgClass(toast.type)
            )}
            role="alert"
          >
            <div className="flex items-center gap-3">
              {getIcon(toast.type)}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 -mr-1 rounded-full text-slate-400 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
