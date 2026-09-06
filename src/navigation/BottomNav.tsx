import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileSpreadsheet, User } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface NavTabItem {
  key: string
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const defaultTabs: NavTabItem[] = [
  {
    key: 'dashboard',
    label: 'الرئيسة',
    to: '/',
    icon: LayoutDashboard,
  },
  {
    key: 'dataFiles',
    label: 'الملفات',
    to: '/data-files',
    icon: FileSpreadsheet,
  },
  {
    key: 'profile',
    label: 'حسابي',
    to: '/profile',
    icon: User,
  },
]

export interface BottomNavProps {
  items?: NavTabItem[]
}

export const BottomNav: React.FC<BottomNavProps> = ({ items = defaultTabs }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/90 safe-bottom"
      aria-label="شريط التنقل السفلي"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 h-16">
        {items.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.key}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center justify-center flex-1 h-full py-1 text-2xs font-medium rounded-xl transition-colors duration-150',
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-150',
                        isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                      )}
                    />
                    {Boolean(tab.badge && tab.badge > 0) && (
                      <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 leading-none">{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0.5 w-6 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
