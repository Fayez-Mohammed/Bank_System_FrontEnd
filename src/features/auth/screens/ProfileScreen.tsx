import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Shield,
  LogOut,
  Download,
  ToggleLeft,
  PlusCircle,
  Filter,
  CheckCircle2,
  XCircle,
  KeyRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Card, Button, Badge } from '@/shared/components/ui'
import { TopBar } from '@/navigation/TopBar'
import { useToast } from '@/shared/hooks/useToast'

export const ProfileScreen: React.FC = () => {
  const { user, permissions, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { info } = useToast()

  const handleLogout = () => {
    logout()
    info('تم تسجيل الخروج بنجاح')
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="الملف الشخصي" subtitle="بيانات الحساب والصلاحيات" />

      <div className="p-4 space-y-4 pb-12">
        {/* User Card */}
        <Card className="p-5 bg-gradient-to-br from-slate-850 to-slate-900 border-slate-750">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <User className="w-7 h-7" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-100 truncate">
                {user?.fullName || (isAuthenticated ? 'مستخدم' : 'زائر')}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={permissions.isSuperAdmin ? 'danger' : permissions.isAdmin ? 'warning' : 'info'}>
                  {user?.role || 'بدون دور'}
                </Badge>
                {user?.id && (
                  <span className="text-2xs text-slate-500 font-mono truncate max-w-[120px]">
                    {user.id}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Permissions List */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Shield className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              صلاحيات المستخدم الحالية (JWT Claims)
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">تحميل ملفات البيانات</span>
              </div>
              {permissions.canDownload ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <div className="flex items-center gap-2">
                <ToggleLeft className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">تفعيل/تعطيل ملفات التصفية</span>
              </div>
              {permissions.canToggleFiles ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">إلحاق بيانات بملفات الفريق</span>
              </div>
              {permissions.canAppendToTeamFiles ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">تصفية ومطابقة اللوحات</span>
              </div>
              {permissions.canFilter ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-400" />
                <span className="text-slate-200">حذف الملفات (إدارة النظام)</span>
              </div>
              {permissions.isAdmin ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {isAuthenticated ? (
            <Button
              variant="danger"
              fullWidth
              size="lg"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-5 h-5" />}
            >
              تسجيل الخروج
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => navigate('/login')}
              leftIcon={<User className="w-5 h-5" />}
            >
              تسجيل الدخول
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
