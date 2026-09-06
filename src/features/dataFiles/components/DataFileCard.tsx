import React from 'react'
import {
  FileSpreadsheet,
  Download,
  PlusCircle,
  Trash2,
  Lock,
  User,
  Clock,
  Database,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import type { DataFileSummaryDto } from '../types/dataFiles.types'
import { Badge } from '@/shared/components/ui'
import { formatArabicNumber, formatArabicDate } from '@/shared/utils/formatters'
import { useAuth } from '@/features/auth/context/AuthContext'
import { cn } from '@/shared/utils/cn'

export interface DataFileCardProps {
  file: DataFileSummaryDto
  onToggleActive: (fileId: string) => void
  isToggling?: boolean
  onDownload: (fileId: string, fileName: string) => void
  onAppend: (file: DataFileSummaryDto) => void
  onDelete: (file: DataFileSummaryDto) => void
}

export const DataFileCard: React.FC<DataFileCardProps> = ({
  file,
  onToggleActive,
  isToggling = false,
  onDownload,
  onAppend,
  onDelete,
}) => {
  const { permissions } = useAuth()

  const getStatusBadge = () => {
    switch (file.importStatus.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>مكتمل</span>
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant="warning" className="gap-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>قيد المعالجة</span>
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="info" className="gap-1">
            <Clock className="w-3 h-3" />
            <span>في الانتظار</span>
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="danger" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>فشل الاستيراد</span>
          </Badge>
        )
      default:
        return <Badge variant="default">{file.importStatus}</Badge>
    }
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750/70 shadow-md transition-all duration-150 flex flex-col space-y-3">
      {/* Top row: File Icon, Name, and Status Badge */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <FileSpreadsheet className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-bold text-slate-100 truncate leading-snug">
                {file.fileName}
              </h4>
              {file.requiresPassword && (
                <span title="محمي بكلمة مرور">
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-2xs text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                <span>{file.ownerName}</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{formatArabicDate(file.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0">{getStatusBadge()}</div>
      </div>

      {/* Row count & Active Filter Switch */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-750/60">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-bold text-slate-100">
            {formatArabicNumber(file.rowCount)}
          </span>
          <span className="text-2xs text-slate-400 font-sans">سجل</span>
        </div>

        {/* Toggle Active for Filtering Switch */}
        <div className="flex items-center gap-2">
          <span className="text-2xs font-medium text-slate-400">
            {file.isActiveForFiltering ? 'مفعل للتصفية' : 'معطل'}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={file.isActiveForFiltering}
            onClick={() => onToggleActive(file.id)}
            disabled={isToggling || !permissions.canToggleFiles}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
              file.isActiveForFiltering ? 'bg-emerald-600' : 'bg-slate-700'
            )}
            title={
              permissions.canToggleFiles
                ? 'تبديل حالة التفعيل للمطابقة'
                : 'ليس لديك صلاحية لتفعيل/تعطيل الملفات'
            }
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                file.isActiveForFiltering ? '-translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-800/80">
        {/* Download Button */}
        {permissions.canDownload && (
          <button
            type="button"
            onClick={() => onDownload(file.id, file.fileName)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-2xs text-slate-200 border border-slate-700/60 transition-colors"
            title="تحميل الملف"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>تحميل</span>
          </button>
        )}

        {/* Append Records Button */}
        {permissions.canAppendToTeamFiles && (
          <button
            type="button"
            onClick={() => onAppend(file)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-2xs text-slate-200 border border-slate-700/60 transition-colors"
            title="إلحاق بيانات بهذا الملف"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>إلحاق</span>
          </button>
        )}

        {/* Delete Button (Allowed for SuperAdmin/Admin) */}
        {permissions.isAdmin && (
          <button
            type="button"
            onClick={() => onDelete(file)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 active:bg-rose-900 text-2xs text-rose-300 border border-rose-800/50 transition-colors"
            title="حذف الملف"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>حذف</span>
          </button>
        )}
      </div>
    </div>
  )
}
