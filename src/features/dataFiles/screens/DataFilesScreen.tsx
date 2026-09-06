import React, { useState, useMemo } from 'react'
import {
  UploadCloud,
  Search,
  RefreshCw,
  ArrowUpDown,
  FileSpreadsheet,
  Filter,
  FolderKanban,
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
    <div className="space-y-6">
      {/* Page Header (Responsive on Mobile and Desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              ملفات البيانات
            </h1>
            {data?.header?.groupName && (
              <Badge variant="info" className="text-xs">
                {data.header.groupName}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            إدارة، رفع، ومطابقة ملفات إكسل لأرقام لوحات السيارات
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {Boolean(data?.items && data.items.length > 1) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReorderOpen(true)}
              leftIcon={<ArrowUpDown className="w-4 h-4 text-slate-400" />}
            >
              ترتيب الملفات
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            leftIcon={
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-400' : 'text-slate-400'}`}
              />
            }
          >
            تحديث
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            leftIcon={<UploadCloud className="w-4 h-4" />}
            className="shadow-md shadow-blue-600/20"
          >
            رفع ملف إكسل
          </Button>
        </div>
      </div>

      {/* User Information Banner if logged in */}
      {user && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-300">
            المستخدم الحالي:{' '}
            <strong className="text-blue-300 font-bold">{user.fullName}</strong>
          </span>
          <Badge variant="outline" className="text-2xs font-mono">
            {user.role}
          </Badge>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton count={3} />
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <ErrorState
          message={error?.message || 'تعذر الاتصال بالخادم لجلب قائمة الملفات'}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}

      {/* Content when data is loaded */}
      {!isLoading && !isError && data && (
        <>
          {/* Header Stats */}
          <DataFilesHeaderStats header={data.header} />

          {/* Search & Filter Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="w-full sm:w-72">
              <Input
                placeholder="ابحث باسم الملف أو اسم المالك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                rightIcon={<Search className="w-4 h-4 text-slate-400" />}
                onClear={() => setSearchTerm('')}
                className="h-10 text-xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-2xs">
              <span className="flex items-center gap-1 text-slate-500 pl-1">
                <Filter className="w-3.5 h-3.5" />
                <span>التصفية:</span>
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
                المفعلة ({data.items.filter((f) => f.isActiveForFiltering).length})
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

          {/* Empty State */}
          {data.items.length === 0 && (
            <EmptyState
              icon={<FileSpreadsheet className="w-10 h-10 text-blue-400" />}
              title="لا توجد ملفات بيانات حالياً"
              description="لم يتم رفع أي ملفات إكسل لهذه المجموعة بعد. اضغط على الزر أدناه لرفع ملفك الأول."
              actionLabel="رفع ملف إكسل الآن"
              onAction={() => setIsUploadOpen(true)}
            />
          )}

          {/* No Filter Results */}
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

          {/* Responsive Cards Grid */}
          {filteredFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>الملفات ({filteredFiles.length})</span>
                <span>مرتبة حسب الأولوية</span>
              </div>

              {/* Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          )}
        </>
      )}

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
