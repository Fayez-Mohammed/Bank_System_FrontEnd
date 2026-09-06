import React from 'react'
import { Files, Database, UserCheck, FolderKanban } from 'lucide-react'
import type { DataFilesHeaderDto } from '../types/dataFiles.types'
import { formatArabicNumber } from '@/shared/utils/formatters'

export interface DataFilesHeaderStatsProps {
  header: DataFilesHeaderDto
}

export const DataFilesHeaderStats: React.FC<DataFilesHeaderStatsProps> = ({ header }) => {
  return (
    <div className="space-y-3">
      {/* Group Card */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-850 to-slate-900 border border-blue-900/50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xs text-blue-300 font-medium block">
              المجموعة الحالية
            </span>
            <h3 className="text-base font-bold text-white leading-tight">
              {header.groupName || 'مجموعة المصرف'}
            </h3>
          </div>
        </div>
        <div className="text-left font-mono">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {formatArabicNumber(header.totalFilesCount)} ملفات
          </span>
        </div>
      </div>

      {/* Grid of 3 key mobile stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-medium">الملفات</span>
            <Files className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="text-base font-bold text-slate-100 font-mono">
            {formatArabicNumber(header.totalFilesCount)}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-medium">سجلات المجموعة</span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-base font-bold text-emerald-300 font-mono truncate">
            {formatArabicNumber(header.groupTotalRows)}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-750/70 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-2xs font-medium">سجلاتي</span>
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="text-base font-bold text-sky-300 font-mono truncate">
            {formatArabicNumber(header.currentUserRows)}
          </span>
        </div>
      </div>
    </div>
  )
}
