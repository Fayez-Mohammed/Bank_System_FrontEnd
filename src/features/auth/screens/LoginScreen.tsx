import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react'
import { Button, Input, Card } from '@/shared/components/ui'
import { useAuth } from '../context/AuthContext'
import { useToast } from '@/shared/hooks/useToast'
import { ApiError } from '@/core/api/apiError'

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { success, error: toastError } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!email.trim()) {
      setFormError('يرجى إدخال البريد الإلكتروني')
      return
    }
    if (!password) {
      setFormError('يرجى إدخال كلمة المرور')
      return
    }

    try {
      const result = await login({ email: email.trim(), password })
      success(`مرحباً بك ${result.userLogin.fullName}`)
      navigate('/data-files')
    } catch (err: unknown) {
      const apiErr = ApiError.from(err)
      const msg = apiErr.message || 'فشل تسجيل الدخول، يرجى التأكد من صحة البيانات'
      setFormError(msg)
      toastError(msg)
    }
  }

  // Helper for quick testing with the accounts from TheEndPointsFile.txt
  const fillCredentials = (accEmail: string, accPass: string) => {
    setEmail(accEmail)
    setPassword(accPass)
    setFormError(null)
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100">
      {/* Top Brand Area */}
      <div className="pt-8 pb-4 flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100 leading-tight">
            نظام تتبع سيارات المصرف
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تسجيل الدخول لإدارة ومطابقة ملفات الأسطول
          </p>
        </div>
      </div>

      {/* Main Login Form Card */}
      <div className="w-full max-w-sm mx-auto my-auto">
        <Card className="bg-slate-850/90 border-slate-750/80 shadow-2xl p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Email Field */}
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@bank.com"
              autoComplete="email"
              dir="ltr"
              className="text-left font-mono"
              rightIcon={<Mail className="w-4 h-4 text-slate-400" />}
              onClear={() => setEmail('')}
              disabled={isLoading}
            />

            {/* Password Field */}
            <div className="space-y-1.5 text-right">
              <Input
                label="كلمة المرور"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                dir="ltr"
                className="text-left font-mono"
                rightIcon={<Lock className="w-4 h-4 text-slate-400" />}
                leftIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              leftIcon={<LogIn className="w-5 h-5" />}
              className="mt-2"
            >
              تسجيل الدخول
            </Button>
          </form>
        </Card>

        {/* Quick Test Accounts Switcher (from TheEndPointsFile.txt) */}
        <div className="mt-5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-2xs text-slate-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>حسابات الاختبار السريع (من مواصفات الـ Backend):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@gmail.com', '**AAaa010')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-2xs text-slate-200 border border-slate-700/60 text-center transition-colors"
            >
              <span className="font-semibold block text-blue-400">المشرف العام</span>
              <span className="text-[10px] text-slate-400 font-mono">SuperAdmin</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('ahmed.user@bank.com', '**AAaa010')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-2xs text-slate-200 border border-slate-700/60 text-center transition-colors"
            >
              <span className="font-semibold block text-emerald-400">مستخدم عادي</span>
              <span className="text-[10px] text-slate-400 font-mono">أحمد (User)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Safe Area */}
      <div className="py-2 text-center text-2xs text-slate-500 safe-bottom">
        <span>نظام تتبع المصرف © 2026</span>
      </div>
    </div>
  )
}
