/**
 * Standardized API Error Model
 * Normalizes HTTP, network, and backend validation errors into user-friendly Arabic messages
 */

import type { AxiosError } from 'axios'
import type { ApiErrorResponse, ApiValidationErrorDetail } from './types'

export class ApiError extends Error {
  public readonly status: number
  public readonly isNetworkError: boolean
  public readonly isValidationError: boolean
  public readonly validationErrors: ApiValidationErrorDetail[]
  public readonly rawData?: unknown

  constructor(params: {
    message: string
    status?: number
    isNetworkError?: boolean
    isValidationError?: boolean
    validationErrors?: ApiValidationErrorDetail[]
    rawData?: unknown
  }) {
    super(params.message)
    this.name = 'ApiError'
    this.status = params.status ?? 0
    this.isNetworkError = params.isNetworkError ?? false
    this.isValidationError = params.isValidationError ?? false
    this.validationErrors = params.validationErrors ?? []
    this.rawData = params.rawData
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  /**
   * Helper to retrieve a single error string for a specific form field
   */
  public getFieldError(field: string): string | undefined {
    const error = this.validationErrors.find(
      (e) => e.field.toLowerCase() === field.toLowerCase()
    )
    return error?.messages[0]
  }

  /**
   * Transforms an AxiosError or unknown error into a structured ApiError
   */
  public static from(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    const axiosError = error as AxiosError<ApiErrorResponse>

    // Network / Offline / Timeout failure
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
        return new ApiError({
          message: 'انتهت مهلة الاتصال بالخادم، يرجى المحاولة مرة أخرى.',
          status: 408,
          isNetworkError: true,
        })
      }

      return new ApiError({
        message: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وتشغيل الخادم.',
        status: 0,
        isNetworkError: true,
      })
    }

    const status = axiosError.response.status
    const data = axiosError.response.data
    const validationErrors: ApiValidationErrorDetail[] = []

    // Parse validation errors if present (ASP.NET Core ProblemDetails format)
    if (data && typeof data === 'object') {
      if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
        for (const [key, value] of Object.entries(data.errors)) {
          if (Array.isArray(value)) {
            validationErrors.push({
              field: key,
              messages: value.map(String),
            })
          }
        }
      } else if (Array.isArray(data.errors)) {
        validationErrors.push({
          field: 'general',
          messages: data.errors.map(String),
        })
      }
    }

    // Default Arabic message based on HTTP status code
    let userMessage = data?.message || data?.title || data?.detail

    if (!userMessage) {
      switch (status) {
        case 400:
          userMessage = validationErrors.length > 0
            ? 'يرجى التأكد من صحة البيانات المدخلة'
            : 'البيانات المرسلة غير صحيحة'
          break
        case 401:
          userMessage = 'انتهت جلستك أو غير مصرح لك بالدخول، يرجى تسجيل الدخول مجدداً'
          break
        case 403:
          userMessage = 'ليس لديك الصلاحية الكافية لتنفيذ هذا الإجراء'
          break
        case 404:
          userMessage = 'العنصر المطلوب غير موجود'
          break
        case 409:
          userMessage = 'يوجد تعارض مع البيانات الحالية'
          break
        case 422:
          userMessage = 'تعذر معالجة البيانات، يرجى مراجعة الحقول المطلوبة'
          break
        case 500:
        case 502:
        case 503:
          userMessage = 'حدث خطأ غير متوقع في الخادم، يرجى المحاولة لاحقاً'
          break
        default:
          userMessage = 'حدث خطأ غير متوقع أثناء معالجة الطلب'
          break
      }
    }

    return new ApiError({
      message: userMessage,
      status,
      isValidationError: validationErrors.length > 0 || status === 400 || status === 422,
      validationErrors,
      rawData: data,
    })
  }
}
