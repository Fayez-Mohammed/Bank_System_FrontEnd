import React, { useState, useRef } from 'react'
import { UploadCloud, FileSpreadsheet, Lock, X } from 'lucide-react'
import { BottomSheet, Button, Input } from '@/shared/components/ui'
import { useCreateDataFile } from '../hooks/useDataFiles'
import { useToast } from '@/shared/hooks/useToast'

export interface UploadDataFileSheetProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
}

export const UploadDataFileSheet: React.FC<UploadDataFileSheetProps> = ({
  isOpen,
  onClose,
  groupId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: uploadFile, isPending } = useCreateDataFile(groupId)
  const { warning } = useToast()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [columnMapping, setColumnMapping] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file extension
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      const allowed = ['.xlsx', '.xlsm', '.xltx', '.xltm', '.xlsb', '.xls', '.csv']
      if (!allowed.includes(ext)) {
        warning('يرجى اختيار ملف إكسل بصيغة مدعومة (.xlsx, .csv, ...)')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      warning('يرجى اختيار ملف أولاً')
      return
    }

    try {
      await uploadFile({
        file: selectedFile,
        password: password.trim() ? password : undefined,
        columnMapping: columnMapping.trim() ? columnMapping : undefined,
      })
      // Reset & close
      setSelectedFile(null)
      setPassword('')
      setColumnMapping('')
      onClose()
    } catch {
      // Handled in hook onError
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="رفع ملف إكسل جديد">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop / Choose File Box */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xlsm,.xltx,.xltm,.xlsb,.xls,.csv"
          onChange={handleFileChange}
          className="hidden"
          id="upload-file-input"
        />

        {!selectedFile ? (
          <label
            htmlFor="upload-file-input"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-850/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-200">
              اضغط لاختيار ملف إكسل من هاتفك
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
              onClick={clearSelectedFile}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-full transition-colors"
              aria-label="إلغاء الملف المختار"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Optional Password */}
        <Input
          label="كلمة مرور الملف (اختياري)"
          type="password"
          placeholder="اترك فارغاً إذا لم يكن الملف محمياً"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightIcon={<Lock className="w-4 h-4 text-slate-400" />}
          hint="إذا كان ملف الإكسل مشفراً بكلمة سر"
        />

        {/* Action Button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isPending}
          disabled={!selectedFile || isPending}
          leftIcon={<UploadCloud className="w-5 h-5" />}
          className="mt-4"
        >
          {isPending ? 'جاري رفع ومعالجة الملف...' : 'رفع الملف وبدء المعالجة'}
        </Button>
      </form>
    </BottomSheet>
  )
}
