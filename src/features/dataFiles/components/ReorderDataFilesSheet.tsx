import React, { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, FileSpreadsheet } from 'lucide-react'
import { BottomSheet, Button } from '@/shared/components/ui'
import { useReorderDataFiles } from '../hooks/useDataFiles'
import type { DataFileSummaryDto } from '../types/dataFiles.types'

export interface ReorderDataFilesSheetProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
  files: DataFileSummaryDto[]
}

export const ReorderDataFilesSheet: React.FC<ReorderDataFilesSheetProps> = ({
  isOpen,
  onClose,
  groupId,
  files,
}) => {
  const { mutateAsync: saveOrder, isPending } = useReorderDataFiles(groupId)
  const [orderedFiles, setOrderedFiles] = useState<DataFileSummaryDto[]>([])

  useEffect(() => {
    if (files) {
      setOrderedFiles([...files].sort((a, b) => a.sortOrder - b.sortOrder))
    }
  }, [files, isOpen])

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...orderedFiles]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    setOrderedFiles(newItems)
  }

  const moveDown = (index: number) => {
    if (index === orderedFiles.length - 1) return
    const newItems = [...orderedFiles]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    setOrderedFiles(newItems)
  }

  const handleSave = async () => {
    const items = orderedFiles.map((file, idx) => ({
      id: file.id,
      sortOrder: idx + 1,
    }))

    try {
      await saveOrder({ items })
      onClose()
    } catch {
      // Handled in hook
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="إعادة ترتيب أولوية الملفات">
      <div className="space-y-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          الملف ذو الأولوية الأعلى (رقم ١) يُفحص أولاً أثناء المطابقة والتصفية. استخدم الأسهم لتحريك الملفات لأعلى أو لأسفل.
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
          {orderedFiles.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-750"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-100 truncate">
                  {file.fileName}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-200 transition-colors"
                  aria-label="تحريك لأعلى"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === orderedFiles.length - 1}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-200 transition-colors"
                  aria-label="تحريك لأسفل"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          fullWidth
          size="lg"
          isLoading={isPending}
          onClick={handleSave}
          leftIcon={<ArrowUpDown className="w-5 h-5" />}
          className="mt-2"
        >
          {isPending ? 'جاري الحفظ...' : 'حفظ الترتيب الجديد'}
        </Button>
      </div>
    </BottomSheet>
  )
}
