import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileSpreadsheet,
  UploadCloud,
  ArrowLeft,
  Layers,
  Database,
  User,
  Radio,
  CheckCircle2,
  Files,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/components/ui'
import { env } from '@/core/config/env'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useDataFiles } from '@/features/dataFiles/hooks/useDataFiles'
import { formatArabicNumber } from '@/shared/utils/formatters'

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { data: filesData } = useDataFiles()

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 backdrop-blur-sm">
              نظام مطابقة أرقام لوحات السيارات
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>الخادم متصل</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            {isAuthenticated ? `أهلاً بك مجدداً، ${user?.fullName}` : 'نظام تتبع وإدارة أسطول المصرف'}
          </h1>

          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed">
            منصة متكاملة لإدارة ملفات إكسل، معالجة السجلات في الخلفية، وتصفية ومطابقة لوحات السيارات لحظياً بدقة وسرعة عالية.
          </p>

          <div className="flex items-center gap-3 pt-2">
            {!isAuthenticated ? (
              <Button
                size="md"
                variant="primary"
                onClick={() => navigate('/login')}
                leftIcon={<User className="w-4 h-4" />}
                className="bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-950 font-bold shadow-lg"
              >
                تسجيل الدخول للنظام
              </Button>
            ) : (
              <Button
                size="md"
                variant="primary"
                onClick={() => navigate('/data-files')}
                leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                className="bg-white text-blue-900 hover:bg-blue-50 hover:text-blue-950 font-bold shadow-lg"
              >
                استعراض ملفات البيانات
              </Button>
            )}
          </div>
        </div>

        <FileSpreadsheet className="absolute -bottom-6 -left-6 w-48 h-48 text-blue-500/10 pointer-events-none" />
      </div>

      {/* 3 Key Stats Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block mb-1">
                إجمالي الملفات
              </span>
              <span className="text-2xl font-bold text-slate-100 font-mono">
                {filesData?.header ? formatArabicNumber(filesData.header.totalFilesCount) : '—'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Files className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xs text-slate-500 mt-3 pt-3 border-t border-slate-800">
            ملفات الإكسل المحملة بالمجموعة
          </p>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block mb-1">
                سجلات المجموعة
              </span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {filesData?.header ? formatArabicNumber(filesData.header.groupTotalRows) : '—'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xs text-slate-500 mt-3 pt-3 border-t border-slate-800">
            إجمالي السجلات المفحوصة
          </p>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block mb-1">
                الملفات المفعلة للتصفية
              </span>
              <span className="text-2xl font-bold text-sky-400 font-mono">
                {filesData?.items
                  ? formatArabicNumber(filesData.items.filter((f) => f.isActiveForFiltering).length)
                  : '—'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-600/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <UploadCloud className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xs text-slate-500 mt-3 pt-3 border-t border-slate-800">
            نشطة في مطابقة اللوحات الآن
          </p>
        </Card>
      </div>

      {/* Two Column Grid: Main Modules & System Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-200">
            الوحدات والعمليات السريعة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Data Files Card */}
            <Card
              interactive
              onClick={() => navigate('/data-files')}
              className="p-5 bg-slate-900 border-slate-800 hover:border-blue-600/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100">
                      ملفات البيانات
                    </h3>
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    رفع ملفات إكسل جديدة، إلحاق بيانات، وتفعيل/تعطيل الملفات للتصفية.
                  </p>
                  <span className="text-2xs text-blue-400 font-medium inline-block pt-1">
                    فتح الوحدة ←
                  </span>
                </div>
              </div>
            </Card>

            {/* Profile & Permissions Card */}
            <Card
              interactive
              onClick={() => navigate('/profile')}
              className="p-5 bg-slate-900 border-slate-800 hover:border-blue-600/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100">
                      الحساب والصلاحيات
                    </h3>
                    <ArrowLeft className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    معاينة بيانات المستخدم وصلاحيات التحميل وتفعيل الملفات والحذف.
                  </p>
                  <span className="text-2xs text-blue-400 font-medium inline-block pt-1">
                    عرض الحساب ←
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right 1 Col: Backend & System Status */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-200">
            حالة الخادم والبنية
          </h2>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <CardTitle className="text-xs">تفاصيل الاتصال</CardTitle>
              </div>
              <Badge variant="success">نشط</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">عنوان الـ API:</span>
                  <span className="font-mono text-blue-400 text-2xs dir-ltr">
                    {env.apiBaseUrl}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">حالة الجلسة:</span>
                  <span className="text-slate-200">
                    {isAuthenticated ? (
                      <strong className="text-emerald-400">{user?.fullName}</strong>
                    ) : (
                      <span className="text-amber-400">زائر</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">المجموعة الافتراضية:</span>
                  <span className="text-slate-200 font-medium">
                    {filesData?.header?.groupName || 'فرحات مكه'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 text-emerald-400 text-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>الخادم والواجهات تعمل بكفاءة 100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
