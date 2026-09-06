/**
 * Centralized HTTP Client
 * Built with Axios, includes request/response interceptors, automatic token injection,
 * unified Arabic error handling, multipart uploads, and blob downloads.
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
  timeout: 30000, // 30s timeout for large file operations
  headers: {
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

  async postForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    })
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

  /**
   * Download a file as a Blob with UTF-8 filename extraction
   */
  async download(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<{ blob: Blob; fileName: string }> {
    const response = await axiosInstance.get(url, {
      ...config,
      responseType: 'blob',
    })

    let fileName = 'file.xlsx'
    const disposition = response.headers['content-disposition'] as string | undefined
    if (disposition) {
      const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
      if (utf8Match && utf8Match[1]) {
        fileName = decodeURIComponent(utf8Match[1])
      } else {
        const standardMatch = disposition.match(/filename="?([^";]+)"?/i)
        if (standardMatch && standardMatch[1]) {
          fileName = standardMatch[1]
        }
      }
    }

    return { blob: response.data as Blob, fileName }
  },
}
