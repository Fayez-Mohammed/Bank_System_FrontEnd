import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { tokenStorage } from '@/core/api/tokenStorage'
import { authService } from '../api/authService'
import { parseJwtClaims } from '../utils/jwtHelper'
import type { LoginRequestDto, LoginResponseDto, UserLoginDto, UserPermissions } from '../types/auth.types'

interface SessionData {
  userLogin: UserLoginDto
  expireAt: string
}

interface AuthContextType {
  user: UserLoginDto | null
  token: string | null
  permissions: UserPermissions
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequestDto) => Promise<LoginResponseDto>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => tokenStorage.getAccessToken())
  const [user, setUser] = useState<UserLoginDto | null>(() => {
    const session = tokenStorage.getUserSession<SessionData>()
    return session?.userLogin ?? null
  })
  const [permissions, setPermissions] = useState<UserPermissions>(() =>
    parseJwtClaims(tokenStorage.getAccessToken())
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Sync state when token changes or when 401 clears storage
  useEffect(() => {
    const unsubscribe = tokenStorage.subscribe((authenticated) => {
      if (!authenticated) {
        setToken(null)
        setUser(null)
        setPermissions(parseJwtClaims(null))
      } else {
        const currentToken = tokenStorage.getAccessToken()
        const session = tokenStorage.getUserSession<SessionData>()
        setToken(currentToken)
        setUser(session?.userLogin ?? null)
        setPermissions(parseJwtClaims(currentToken))
      }
    })

    return unsubscribe
  }, [])

  const login = useCallback(async (credentials: LoginRequestDto): Promise<LoginResponseDto> => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      setToken(response.accessToken)
      setUser(response.userLogin)
      setPermissions(parseJwtClaims(response.accessToken))
      return response
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setToken(null)
    setUser(null)
    setPermissions(parseJwtClaims(null))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
