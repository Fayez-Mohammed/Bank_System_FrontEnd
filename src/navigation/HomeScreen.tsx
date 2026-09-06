import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileSpreadsheet,
  UploadCloud,
  ArrowLeft,
  Layers,
  Database,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/components/ui'
import { TopBar } from './TopBar'
import { env } from '@/core/config/env'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useDataFiles } from '@/features/dataFiles/hooks/useDataFiles'
import { formatArabicNumber } from '@/shared/utils/formatters'

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { data: filesData } = useDataFiles()

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="تتبع سيارات المصرف"
        subtitle="لوحة التحكم والعمليات"
        actions={
          <Badge variant="success" dot>
            {isAuthenticated ? 'متصل' : 'زائر'}
          </Badge>
        }
      />

      <div className="p-4 space-y-4 pb-12">
        {/* Welcome / User Greeting Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-850 to-slate-900 p-5 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <span className="inline-block px-2.5 py-1 text-2xs font-semibold rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
              نظام مطابقة لوحات السيارات
            </span>
            <h2 className="text-xl font-bold leading-tight">
              {isAuthenticated ? `أهلاً بك، ${user?.fullName}` : 'نظام تتبع وإدارة أسطول المصرف'}
            </h2>
            <p className="text-xs text-blue-100/80 leading-relaxed max-w-xs">
              إدارة ملفات البيانات ومطابقة لوحات السيارات لحظياً عبر واجهة الهاتف المحمول.
            </p>
          </div>
          <FileSpreadsheet className="absolute -bottom-4 -left-4 w-32 h-32 text-blue-500/15 pointer-events-none" />
        </div>

        {/* Quick Access to DataFiles */}
        <Card interactive onClick={() => navigate('/data-files')} className="border-blue-900/50 bg-slate-850/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  ملفات البيانات (Data Files)
                </h3>
                <p className="text-2xs text-slate-400 mt-0.5">
                  {filesData?.header
                    ? `${formatArabicNumber(filesData.header.totalFilesCount)} ملفات مسجلة • ${formatArabicNumber(filesData.header.groupTotalRows)} سجل`
                    : 'عرض، رفع، وتحميل ملفات الإكسل'}
                </p>
              </div>
            </div>

            <div className="flex items-center text-blue-400">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Live System Stats Summary */}
        {filesData?.header && (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-750/70 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-medium">سجلات المجموعة</span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-emerald-300 font-mono">
                {formatArabicNumber(filesData.header.groupTotalRows)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-750/70 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-medium">الملفات المفعلة</span>
                <UploadCloud className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-lg font-bold text-blue-300 font-mono">
                {formatArabicNumber(
                  filesData.items.filter((f) => f.isActiveForFiltering).length
                )}
              </span>
            </div>
          </div>
        )}

        {/* API Backend Connection Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <CardTitle className="text-xs">اتصال الخادم (Backend)</CardTitle>
            </div>
            <Badge variant="success">متصل</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">خادم الـ API:</span>
                <span className="font-mono text-blue-400 text-2xs dir-ltr">
                  {env.apiBaseUrl}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">حالة المصادقة:</span>
                <span className="text-slate-200">
                  {isAuthenticated ? (
                    <strong className="text-emerald-400">{user?.fullName} ({user?.role})</strong>
                  ) : (
                    <span className="text-amber-400">لم يتم تسجيل الدخول</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">المجموعة الحالية:</span>
                <span className="text-slate-200 font-medium">
                  {filesData?.header?.groupName || 'فرحات مكه'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        {!isAuthenticated ? (
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/login')}
            leftIcon={<User className="w-5 h-5" />}
          >
            تسجيل الدخول للنظام
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate('/data-files')}
            leftIcon={<FileSpreadsheet className="w-5 h-5" />}
          >
            الانتقال إلى ملفات البيانات
          </Button>
        )}
      </div>
    </div>
  )
}
