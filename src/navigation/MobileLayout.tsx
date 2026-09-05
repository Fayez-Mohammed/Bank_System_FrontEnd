import React from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { cn } from '@/shared/utils/cn'

export interface MobileLayoutProps {
  showBottomNav?: boolean
  children?: React.ReactNode
  className?: string
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  showBottomNav = true,
  children,
  className,
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex justify-center text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Mobile Frame Container (Full width on mobile, max-w-md centered on desktop) */}
      <div
        className={cn(
          'w-full max-w-md min-h-screen flex flex-col bg-slate-900 border-x border-slate-800/40 shadow-2xl relative',
          showBottomNav ? 'pb-20' : '',
          className
        )}
      >
        {/* Main View Area */}
        <main className="flex-1 flex flex-col w-full overflow-x-hidden">
          {children || <Outlet />}
        </main>

        {/* Mobile Bottom Navigation */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  )
}
