import React from 'react'
import { Car, ShieldCheck, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components/ui'
import { TopBar } from './TopBar'
import { env } from '@/core/config/env'

export const HomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="تتبع سيارات المصرف"
        subtitle="لوحة التحكم والعمليات"
        actions={
          <Badge variant="success" dot>
            متصل
          </Badge>
        }
      />

      <div className="p-4 space-y-4">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-850 to-slate-900 p-5 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <span className="inline-block px-2.5 py-1 text-2xs font-semibold rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
              واجهة الهاتف المحمول
            </span>
            <h2 className="text-xl font-bold leading-tight">
              نظام إدارة وتتبع أسطول السيارات
            </h2>
            <p className="text-xs text-blue-100/80 leading-relaxed max-w-xs">
              منصة مخصصة لتشغيل وإدارة أسطول سيارات المصرف بكفاءة وسرعة عبر الهاتف المحمول.
            </p>
          </div>
          <Car className="absolute -bottom-4 -left-4 w-32 h-32 text-blue-500/15 pointer-events-none" />
        </div>

        {/* System Architecture Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <CardTitle>جاهزية البنية التحتية (Architecture)</CardTitle>
            </div>
            <Badge variant="info">مكتمل</Badge>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">عنوان خادم الـ API:</span>
                <span className="font-mono text-blue-400 text-2xs dir-ltr">
                  {env.apiBaseUrl}
                </span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">طبقة الاتصال والاعتراض:</span>
                <span className="text-emerald-400 font-medium">
                  Axios + Auth Interceptors
                </span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">إدارة الحالة والتخزين المؤقت:</span>
                <span className="text-emerald-400 font-medium">
                  TanStack Query v5
                </span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">التصميم وتجربة المستخدم:</span>
                <span className="text-emerald-400 font-medium">
                  Mobile-First RTL (Cairo Font)
                </span>
              </li>
              <li className="flex items-center justify-between py-1">
                <span className="text-slate-400">حالة المسارات والـ Endpoints:</span>
                <span className="text-amber-400 font-medium">
                  بانتظار مواصفات الـ Endpoints
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Readiness Info Card */}
        <Card className="bg-slate-850/50 border-blue-900/40">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-100">
                جاهز لربط واجهات الـ Backend
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                تم تجهيز كافة المكونات القابلة لإعادة الاستخدام، وإدارة الأخطاء، ونماذج التنبيه، ونظام الرموز المميزة. أرسل مواصفات الـ Endpoints لبدء البناء المباشر.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
