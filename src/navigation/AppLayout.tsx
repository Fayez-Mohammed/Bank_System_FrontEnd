import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { cn } from '@/shared/utils/cn'

export interface AppLayoutProps {
  children?: React.ReactNode
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation Header */}
      <Navbar />

      {/* Responsive Main Content Area - Full width with max-w-7xl on desktop */}
      <main
        className={cn(
          'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-10',
          className
        )}
      >
        {children || <Outlet />}
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block border-t border-slate-850 bg-slate-900/50 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>نظام تتبع وإدارة سيارات المصرف © 2026</span>
          <span className="font-mono text-2xs text-slate-400">
            Backend API: https://live-track.runasp.net
          </span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - Visible ONLY on small screens (md:hidden) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
