import { httpClient } from '@/core/api/httpClient'
import { tokenStorage } from '@/core/api/tokenStorage'
import type { ApiResponse } from '@/core/api/types'
import type { LoginRequestDto, LoginResponseDto } from '../types/auth.types'

export const authService = {
  /**
   * Authenticates a user with email and password
   * Endpoint: POST /api/Auth/login
   */
  async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await httpClient.post<ApiResponse<LoginResponseDto>>(
      '/api/Auth/login',
      credentials
    )

    if (!response.success || !response.data) {
      throw new Error(response.message || 'فشل تسجيل الدخول')
    }

    const { accessToken, expireAt, userLogin } = response.data

    // Store auth credentials in storage
    tokenStorage.setAccessToken(accessToken)
    tokenStorage.setUserSession({ userLogin, expireAt })

    return response.data
  },

  /**
   * Logs out the user by clearing local storage session
   */
  logout(): void {
    tokenStorage.clearAll()
  },
}
