import { httpClient } from '@/core/api/httpClient'
import type { ApiResponse } from '@/core/api/types'
import type {
  DataFilesListResponseDto,
  CreateDataFileRequest,
  AppendDataFileRequest,
  ReorderDataFilesRequestDto,
} from '../types/dataFiles.types'

export const DEFAULT_GROUP_ID = '11111111-1111-1111-1111-111111111111'

export const dataFilesService = {
  /**
   * GET /api/groups/{groupId}/data-files
   * Retrieves all data files and summary header for a group
   */
  async getGroupDataFiles(groupId: string = DEFAULT_GROUP_ID): Promise<DataFilesListResponseDto> {
    const response = await httpClient.get<ApiResponse<DataFilesListResponseDto>>(
      `/api/groups/${groupId}/data-files`
    )

    if (!response.success || !response.data) {
      throw new Error(response.message || 'فشل جلب ملفات البيانات')
    }

    return response.data
  },

  /**
   * POST /api/groups/{groupId}/data-files
   * Uploads a new data file with multipart/form-data
   */
  async createDataFile(
    groupId: string = DEFAULT_GROUP_ID,
    request: CreateDataFileRequest
  ): Promise<{ dataFileId: string; message: string }> {
    const formData = new FormData()
    formData.append('File', request.file)
    if (request.password) {
      formData.append('Password', request.password)
    }
    if (request.columnMapping) {
      formData.append('ColumnMapping', request.columnMapping)
    }

    const response = await httpClient.postForm<ApiResponse<string>>(
      `/api/groups/${groupId}/data-files`,
      formData
    )

    if (!response.success) {
      throw new Error(response.message || 'فشل رفع الملف')
    }

    return {
      dataFileId: response.data,
      message: response.message || 'الملف اتقبل وبدأ يتعالج في الخلفية.',
    }
  },

  /**
   * POST /api/groups/{groupId}/data-files/{dataFileId}/append
   * Appends rows from another file to an existing data file
   */
  async appendDataFile(
    groupId: string = DEFAULT_GROUP_ID,
    dataFileId: string,
    request: AppendDataFileRequest
  ): Promise<{ success: boolean; message: string }> {
    const formData = new FormData()
    formData.append('File', request.file)

    const response = await httpClient.postForm<ApiResponse<boolean>>(
      `/api/groups/${groupId}/data-files/${dataFileId}/append`,
      formData
    )

    if (!response.success) {
      throw new Error(response.message || 'فشل إلحاق البيانات بالملف')
    }

    return {
      success: true,
      message: response.message || 'جاري إلحاق البيانات في الخلفية.',
    }
  },

  /**
   * PATCH /api/groups/{groupId}/data-files/{dataFileId}/toggle-active
   * Toggles the active status of a file for matching and filtering
   */
  async toggleActive(
    groupId: string = DEFAULT_GROUP_ID,
    dataFileId: string
  ): Promise<boolean> {
    const response = await httpClient.patch<ApiResponse<boolean>>(
      `/api/groups/${groupId}/data-files/${dataFileId}/toggle-active`
    )

    if (!response.success) {
      throw new Error(response.message || 'فشل تغيير حالة تفعيل الملف')
    }

    return response.data
  },

  /**
   * PATCH /api/groups/{groupId}/data-files/reorder
   * Updates sortOrder sequence of data files
   */
  async reorderDataFiles(
    groupId: string = DEFAULT_GROUP_ID,
    request: ReorderDataFilesRequestDto
  ): Promise<boolean> {
    const response = await httpClient.patch<ApiResponse<boolean>, ReorderDataFilesRequestDto>(
      `/api/groups/${groupId}/data-files/reorder`,
      request
    )

    if (!response.success) {
      throw new Error(response.message || 'فشل حفظ ترتيب الملفات')
    }

    return response.data
  },

  /**
   * DELETE /api/groups/{groupId}/data-files/{dataFileId}
   * Deletes a data file (Requires SuperAdmin or Admin role)
   */
  async deleteDataFile(
    groupId: string = DEFAULT_GROUP_ID,
    dataFileId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.delete<ApiResponse<boolean>>(
      `/api/groups/${groupId}/data-files/${dataFileId}`
    )

    if (!response.success) {
      throw new Error(response.message || 'فشل حذف الملف')
    }

    return {
      success: true,
      message: response.message || 'جاري حذف الملف والبيانات المرتبطة به في الخلفية.',
    }
  },

  /**
   * GET /api/groups/{groupId}/data-files/{dataFileId}/download
   * Downloads the spreadsheet binary file
   */
  async downloadDataFile(
    groupId: string = DEFAULT_GROUP_ID,
    dataFileId: string
  ): Promise<{ blob: Blob; fileName: string }> {
    return httpClient.download(`/api/groups/${groupId}/data-files/${dataFileId}/download`)
  },
}
