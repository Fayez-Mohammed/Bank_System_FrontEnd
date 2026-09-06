import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  LayoutDashboard,
  FileSpreadsheet,
  User,
  LogOut,
  Menu,
  X,
  Radio,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Badge, Button } from '@/shared/components/ui'
import { cn } from '@/shared/utils/cn'

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'الرئيسة', icon: LayoutDashboard },
    { to: '/data-files', label: 'ملفات البيانات', icon: FileSpreadsheet },
    { to: '/profile', label: 'حسابي والصلاحيات', icon: User },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors leading-tight">
                  نظام تتبع المصرف
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                  إدارة ومطابقة أسطول السيارات
                </span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="شريط التنقل الرئيسي">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* User Profile & Actions Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live Backend Connection Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-2xs text-slate-300">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>الخادم مباشر</span>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5 pl-1 border-r border-slate-800 pr-3">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[130px] text-right">
                    {user.fullName}
                  </span>
                  <span className="text-2xs text-blue-400 font-mono text-right">
                    {user.role}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors"
                  title="تسجيل الخروج"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/login')}
                leftIcon={<User className="w-4 h-4" />}
              >
                تسجيل الدخول
              </Button>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (When expanded on phones) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {isAuthenticated && user ? (
              <>
                <div>
                  <span className="text-xs font-bold text-slate-100 block">
                    {user.fullName}
                  </span>
                  <Badge variant="info" className="mt-0.5 text-2xs">
                    {user.role}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  خروج
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                size="sm"
                variant="primary"
                onClick={() => {
                  navigate('/login')
                  setMobileMenuOpen(false)
                }}
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
