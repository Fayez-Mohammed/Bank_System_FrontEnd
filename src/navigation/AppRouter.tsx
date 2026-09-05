import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MobileLayout } from './MobileLayout'
import { HomeScreen } from './HomeScreen'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
      {
        path: 'cars',
        element: <HomeScreen />,
      },
      {
        path: 'tracking',
        element: <HomeScreen />,
      },
      {
        path: 'alerts',
        element: <HomeScreen />,
      },
      {
        path: 'profile',
        element: <HomeScreen />,
      },
    ],
  },
])

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}
