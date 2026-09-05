/**
 * Secure Token Storage Manager
 * Centralizes access to auth tokens with in-memory fallback and reactive events
 */

const ACCESS_TOKEN_KEY = 'bank_cars_access_token'
const REFRESH_TOKEN_KEY = 'bank_cars_refresh_token'
const USER_SESSION_KEY = 'bank_cars_user_session'

type AuthListener = (isAuthenticated: boolean) => void
const authListeners = new Set<AuthListener>()

export const tokenStorage = {
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    } catch {
      return null
    }
  },

  setAccessToken(token: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
      tokenStorage.notifyListeners(true)
    } catch (e) {
      console.error('Failed to save access token', e)
    }
  },

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch {
      return null
    }
  },

  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    } catch (e) {
      console.error('Failed to save refresh token', e)
    }
  },

  setTokens(accessToken: string, refreshToken?: string): void {
    tokenStorage.setAccessToken(accessToken)
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken)
    }
  },

  getUserSession<T = unknown>(): T | null {
    try {
      const raw = localStorage.getItem(USER_SESSION_KEY)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },

  setUserSession<T = unknown>(session: T): void {
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session))
    } catch (e) {
      console.error('Failed to save user session', e)
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_SESSION_KEY)
      tokenStorage.notifyListeners(false)
    } catch (e) {
      console.error('Failed to clear tokens', e)
    }
  },

  hasToken(): boolean {
    return Boolean(tokenStorage.getAccessToken())
  },

  subscribe(listener: AuthListener): () => void {
    authListeners.add(listener)
    return () => {
      authListeners.delete(listener)
    }
  },

  notifyListeners(isAuthenticated: boolean): void {
    authListeners.forEach((listener) => {
      try {
        listener(isAuthenticated)
      } catch (err) {
        console.error('Error in auth listener', err)
      }
    })
  },
}
