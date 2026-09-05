/**
 * Centralized HTTP Client
 * Built with Axios, includes request/response interceptors, automatic token injection,
 * and unified Arabic error handling.
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/core/config/env'
import { ApiError } from './apiError'
import { tokenStorage } from './tokenStorage'

// Create Axios Instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'ar',
  },
})

// Request Interceptor: Attach Auth Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(ApiError.from(error))
  }
)

// Response Interceptor: Handle Errors & Token Expiry
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: unknown) => {
    const apiError = ApiError.from(error)

    // Handle 401 Unauthorized globally
    if (apiError.status === 401) {
      tokenStorage.clearAll()
      // You can also dispatch a global unauthorized event if needed
    }

    return Promise.reject(apiError)
  }
)

// Centralized strongly-typed HTTP methods wrapper
export const httpClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, config)
    return response.data
  },

  async post<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config)
    return response.data
  },

  async put<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<T>(url, data, config)
    return response.data
  },

  async patch<T, B = unknown>(url: string, data?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data, config)
    return response.data
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config)
    return response.data
  },
}
