import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { MobileLayout } from './MobileLayout'
import { HomeScreen } from './HomeScreen'
import { LoginScreen } from '@/features/auth/screens/LoginScreen'
import { ProfileScreen } from '@/features/auth/screens/ProfileScreen'
import { DataFilesScreen } from '@/features/dataFiles/screens/DataFilesScreen'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
      {
        path: 'data-files',
        element: <DataFilesScreen />,
      },
      {
        path: 'profile',
        element: <ProfileScreen />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}
