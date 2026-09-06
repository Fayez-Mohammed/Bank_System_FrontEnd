import React from 'react'
import { AppLayout } from './AppLayout'

export const MobileLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <AppLayout>{children}</AppLayout>
}
