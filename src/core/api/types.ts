/**
 * Core API Type Definitions
 * Clean contracts matching the ASP.NET Core backend ApiResponse<T>
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string | null
  errors?: string[] | null
  traceId?: string
  statusCode?: number
}

export interface PaginatedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginationParams {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
  sortBy?: string
  isDescending?: boolean
}

export interface ApiValidationErrorDetail {
  field: string
  messages: string[]
}

export interface ApiErrorResponse {
  message?: string
  title?: string
  status?: number
  errors?: Record<string, string[]> | string[]
  detail?: string
  traceId?: string
  statusCode?: number
}
