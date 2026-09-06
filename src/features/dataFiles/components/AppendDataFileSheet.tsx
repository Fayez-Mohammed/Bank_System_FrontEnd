import React, { useState, useRef } from 'react'
import { PlusCircle, FileSpreadsheet, X } from 'lucide-react'
import { BottomSheet, Button } from '@/shared/components/ui'
import { useAppendDataFile } from '../hooks/useDataFiles'
import type { DataFileSummaryDto } from '../types/dataFiles.types'
import { useToast } from '@/shared/hooks/useToast'

export interface AppendDataFileSheetProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
  targetFile: DataFileSummaryDto | null
}

export const AppendDataFileSheet: React.FC<AppendDataFileSheetProps> = ({
  isOpen,
  onClose,
  groupId,
  targetFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: appendFile, isPending } = useAppendDataFile(groupId)
  const { warning } = useToast()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !targetFile) {
      warning('يرجى اختيار ملف للإلحاق')
      return
    }

    try {
      await appendFile({
        dataFileId: targetFile.id,
        request: { file: selectedFile },
      })
      setSelectedFile(null)
      onClose()
    } catch {
      // Handled by hook
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!targetFile) return null

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`إلحاق بيانات بملف: ${targetFile.fileName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-300 leading-relaxed">
          سيتم قراءة البيانات من الملف المختار وإضافتها كبيانات إضافية إلى الملف الأساسي{' '}
          <strong className="text-emerald-400 font-bold font-mono">
            {targetFile.fileName}
          </strong>{' '}
          في الخلفية.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xlsm,.xltx,.xltm,.xlsb,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
          id="append-file-input"
        />

        {!selectedFile ? (
          <label
            htmlFor="append-file-input"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-850/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-200">
              اختر ملف الإلحاق (إكسل)
            </span>
            <span className="text-2xs text-slate-400 mt-1">
              يدعم xlsx, csv حتى 200 ميجابايت
            </span>
          </label>
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-100 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-2xs text-slate-400 font-mono mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearFile}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-full transition-colors"
              aria-label="إلغاء الملف المختار"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isPending}
          disabled={!selectedFile || isPending}
          leftIcon={<PlusCircle className="w-5 h-5" />}
          className="mt-4"
        >
          {isPending ? 'جاري إلحاق البيانات...' : 'بدء إلحاق البيانات'}
        </Button>
      </form>
    </BottomSheet>
  )
}
