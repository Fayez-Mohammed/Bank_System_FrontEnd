import React, { useState, useMemo } from 'react'
import {
  UploadCloud,
  Search,
  RefreshCw,
  ArrowUpDown,
  FileSpreadsheet,
  Filter,
} from 'lucide-react'
import {
  useDataFiles,
  useToggleDataFileActive,
  useDownloadDataFile,
} from '../hooks/useDataFiles'
import { DEFAULT_GROUP_ID } from '../api/dataFilesService'
import type { DataFileSummaryDto } from '../types/dataFiles.types'
import { DataFilesHeaderStats } from '../components/DataFilesHeaderStats'
import { DataFileCard } from '../components/DataFileCard'
import { UploadDataFileSheet } from '../components/UploadDataFileSheet'
import { AppendDataFileSheet } from '../components/AppendDataFileSheet'
import { ReorderDataFilesSheet } from '../components/ReorderDataFilesSheet'
import { DeleteConfirmSheet } from '../components/DeleteConfirmSheet'
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  Button,
  Input,
  Badge,
} from '@/shared/components/ui'
import { TopBar } from '@/navigation/TopBar'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useAuth } from '@/features/auth/context/AuthContext'

export const DataFilesScreen: React.FC = () => {
  const groupId = DEFAULT_GROUP_ID
  const { user } = useAuth()

  // Queries & Mutations
  const { data, isLoading, isError, error, refetch, isFetching } = useDataFiles(groupId)
  const { mutate: toggleActive, isPending: isToggling } = useToggleDataFileActive(groupId)
  const { downloadFile } = useDownloadDataFile(groupId)

  // Local state for search & filtering
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PROCESSING'>('ALL')

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [reorderOpen, setReorderOpen] = useState(false)
  const [appendTarget, setAppendTarget] = useState<DataFileSummaryDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DataFileSummaryDto | null>(null)

  // Filtered files calculation
  const filteredFiles = useMemo(() => {
    if (!data?.items) return []

    return data.items.filter((item) => {
      // Search term filter
      const matchesSearch =
        !debouncedSearch ||
        item.fileName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(debouncedSearch.toLowerCase())

      if (!matchesSearch) return false

      // Status filter
      if (statusFilter === 'ACTIVE') {
        return item.isActiveForFiltering
      }
      if (statusFilter === 'PROCESSING') {
        return (
          item.importStatus.toLowerCase() === 'processing' ||
          item.importStatus.toLowerCase() === 'pending'
        )
      }

      return true
    })
  }, [data?.items, debouncedSearch, statusFilter])

  return (
    <div className="flex flex-col min-h-full">
      {/* Mobile Top Bar */}
      <TopBar
        title="ملفات البيانات"
        subtitle={data?.header?.groupName || 'إدارة ومطابقة ملفات الأسطول'}
        actions={
          <div className="flex items-center gap-1.5">
            {Boolean(data?.items && data.items.length > 1) && (
              <button
                type="button"
                onClick={() => setReorderOpen(true)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-750 transition-colors"
                aria-label="إعادة ترتيب الملفات"
                title="إعادة ترتيب الملفات"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-750 transition-colors"
              aria-label="تحديث البيانات"
              title="تحديث البيانات"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-400' : ''}`}
              />
            </button>
          </div>
        }
      />

      {/* Screen Content Container */}
      <div className="p-4 space-y-4 pb-12">
        {/* User Welcome Banner */}
        {user && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-850/60 border border-slate-750/50 text-xs">
            <span className="text-slate-300">
              المستخدم الحالي:{' '}
              <strong className="text-blue-300 font-bold">{user.fullName}</strong>
            </span>
            <Badge variant="outline" className="text-2xs font-mono">
              {user.role}
            </Badge>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <CardSkeleton count={3} />
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <ErrorState
            message={error?.message || 'تعذر تحميل قائمة الملفات من الخادم'}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        )}

        {/* Content when loaded successfully */}
        {!isLoading && !isError && data && (
          <>
            {/* Header Statistics Card */}
            <DataFilesHeaderStats header={data.header} />

            {/* Upload Primary Action Button */}
            <Button
              fullWidth
              size="lg"
              onClick={() => setIsUploadOpen(true)}
              leftIcon={<UploadCloud className="w-5 h-5" />}
              className="shadow-lg shadow-blue-600/20"
            >
              رفع ملف إكسل جديد
            </Button>

            {/* Search & Filter Toolbar */}
            <div className="space-y-2">
              <Input
                placeholder="ابحث باسم الملف أو اسم المالك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                rightIcon={<Search className="w-4 h-4 text-slate-400" />}
                onClear={() => setSearchTerm('')}
                className="h-11"
              />

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-2xs">
                <span className="flex items-center gap-1 text-slate-500 pl-1">
                  <Filter className="w-3 h-3" />
                  <span>تصفية:</span>
                </span>

                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    statusFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  الكل ({data.items.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    statusFilter === 'ACTIVE'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  المفعلة للتصفية ({data.items.filter((f) => f.isActiveForFiltering).length})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('PROCESSING')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    statusFilter === 'PROCESSING'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  قيد المعالجة (
                  {
                    data.items.filter(
                      (f) =>
                        f.importStatus.toLowerCase() === 'processing' ||
                        f.importStatus.toLowerCase() === 'pending'
                    ).length
                  }
                  )
                </button>
              </div>
            </div>

            {/* Empty Files State */}
            {data.items.length === 0 && (
              <EmptyState
                icon={<FileSpreadsheet className="w-8 h-8 text-blue-400" />}
                title="لا توجد ملفات بيانات حالياً"
                description="لم يتم رفع أي ملفات إكسل لهذه المجموعة بعد. ابدأ برفع ملفك الأول لتفعيل المطابقة وتتبع اللوحات."
                actionLabel="رفع ملف إكسل الآن"
                onAction={() => setIsUploadOpen(true)}
              />
            )}

            {/* No Search Results */}
            {data.items.length > 0 && filteredFiles.length === 0 && (
              <EmptyState
                title="لا توجد نتائج مطابقة"
                description="لم يتم العثور على أي ملف يطابق معايير البحث أو التصفية الحالية."
                actionLabel="إلغاء التصفية"
                onAction={() => {
                  setSearchTerm('')
                  setStatusFilter('ALL')
                }}
              />
            )}

            {/* Data Files List */}
            {filteredFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-2xs text-slate-400 px-1">
                  <span>الملفات المتاحة ({filteredFiles.length})</span>
                  <span>الترتيب حسب الأولوية</span>
                </div>

                {filteredFiles.map((file) => (
                  <DataFileCard
                    key={file.id}
                    file={file}
                    onToggleActive={(id) => toggleActive(id)}
                    isToggling={isToggling}
                    onDownload={(id, name) => downloadFile(id, name)}
                    onAppend={(target) => setAppendTarget(target)}
                    onDelete={(target) => setDeleteTarget(target)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sheets / Modals */}
      <UploadDataFileSheet
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        groupId={groupId}
      />

      <AppendDataFileSheet
        isOpen={Boolean(appendTarget)}
        onClose={() => setAppendTarget(null)}
        groupId={groupId}
        targetFile={appendTarget}
      />

      {data?.items && (
        <ReorderDataFilesSheet
          isOpen={reorderOpen}
          onClose={() => setReorderOpen(false)}
          groupId={groupId}
          files={data.items}
        />
      )}

      <DeleteConfirmSheet
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        groupId={groupId}
        file={deleteTarget}
      />
    </div>
  )
}
