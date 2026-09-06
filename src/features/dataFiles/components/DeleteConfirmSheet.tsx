import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { BottomSheet, Button } from '@/shared/components/ui'
import { useDeleteDataFile } from '../hooks/useDataFiles'
import type { DataFileSummaryDto } from '../types/dataFiles.types'
import { formatArabicNumber } from '@/shared/utils/formatters'

export interface DeleteConfirmSheetProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
  file: DataFileSummaryDto | null
}

export const DeleteConfirmSheet: React.FC<DeleteConfirmSheetProps> = ({
  isOpen,
  onClose,
  groupId,
  file,
}) => {
  const { mutateAsync: deleteFile, isPending } = useDeleteDataFile(groupId)

  if (!file) return null

  const handleDelete = async () => {
    try {
      await deleteFile(file.id)
      onClose()
    } catch {
      // Handled in hook
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="تأكيد حذف الملف">
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 flex items-start gap-3 text-right">
          <div className="w-10 h-10 rounded-xl bg-rose-900/40 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-200">
              هل أنت متأكد من حذف هذا الملف؟
            </h4>
            <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
              سيتم حذف الملف{' '}
              <span className="font-mono font-bold text-white">{file.fileName}</span>{' '}
              وكافة السجلات المرتبطة به البالغ عددها (
              <span className="font-mono font-bold text-white">
                {formatArabicNumber(file.rowCount)}
              </span>{' '}
              سجل) بشكل نهائي من الخادم.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="button"
            variant="danger"
            fullWidth
            size="lg"
            isLoading={isPending}
            onClick={handleDelete}
            leftIcon={<Trash2 className="w-5 h-5" />}
          >
            {isPending ? 'جاري الحذف...' : 'نعم، حذف الملف نهائياً'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={isPending}
            className="w-1/3"
          >
            إلغاء
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
