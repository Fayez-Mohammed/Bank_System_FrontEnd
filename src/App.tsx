import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/shared/hooks/useToast'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { AppRouter } from '@/navigation/AppRouter'

// Initialize TanStack Query Client with mobile-optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Save bandwidth on mobile screen unlocks
      staleTime: 1000 * 60 * 2,    // 2 minutes cache validity
      gcTime: 1000 * 60 * 15,      // 15 minutes garbage collection
    },
    mutations: {
      retry: 0,
    },
  },
})

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
