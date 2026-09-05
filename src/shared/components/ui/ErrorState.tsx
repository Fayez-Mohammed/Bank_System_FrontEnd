import React from 'react'
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  message?: string
  isNetworkError?: boolean
  onRetry?: () => void
  isRetrying?: boolean
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'حدث خطأ غير متوقع أثناء تحميل البيانات',
  isNetworkError = false,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 my-6 bg-rose-950/20 border border-rose-900/40 rounded-2xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-900/30 border border-rose-800/50 flex items-center justify-center text-rose-400 mb-3">
        {isNetworkError ? (
          <WifiOff className="w-6 h-6" />
        ) : (
          <AlertTriangle className="w-6 h-6" />
        )}
      </div>

      <h4 className="text-sm font-semibold text-rose-200 mb-1">
        {isNetworkError ? 'تعذر الاتصال بالخادم' : 'تنبيه'}
      </h4>

      <p className="text-xs text-rose-300/80 max-w-xs mb-4 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          isLoading={isRetrying}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="border-rose-800/80 hover:bg-rose-900/30 text-rose-200"
        >
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}
