import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dataFilesService, DEFAULT_GROUP_ID } from '../api/dataFilesService'
import type {
  CreateDataFileRequest,
  AppendDataFileRequest,
  ReorderDataFilesRequestDto,
  DataFilesListResponseDto,
} from '../types/dataFiles.types'
import { useToast } from '@/shared/hooks/useToast'
import { ApiError } from '@/core/api/apiError'

export const DATA_FILES_QUERY_KEY = 'data-files'

/**
 * Query hook to fetch group data files
 * Includes intelligent background polling when files are processing
 */
export function useDataFiles(groupId: string = DEFAULT_GROUP_ID) {
  return useQuery({
    queryKey: [DATA_FILES_QUERY_KEY, groupId],
    queryFn: () => dataFilesService.getGroupDataFiles(groupId),
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data?.items) return false

      // If any file is currently pending or processing, poll every 4 seconds
      const hasProcessingFiles = data.items.some(
        (item) =>
          item.importStatus.toLowerCase() === 'pending' ||
          item.importStatus.toLowerCase() === 'processing'
      )
      return hasProcessingFiles ? 4000 : false
    },
  })
}

/**
 * Mutation hook to upload a new data file
 */
export function useCreateDataFile(groupId: string = DEFAULT_GROUP_ID) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (request: CreateDataFileRequest) =>
      dataFilesService.createDataFile(groupId, request),
    onSuccess: (res) => {
      success(res.message || 'تم قبول الملف وبدأت معالجته في الخلفية')
      queryClient.invalidateQueries({ queryKey: [DATA_FILES_QUERY_KEY, groupId] })
    },
    onError: (err: unknown) => {
      const apiErr = ApiError.from(err)
      error(apiErr.message || 'حدث خطأ أثناء رفع الملف')
    },
  })
}

/**
 * Mutation hook to append records to an existing file
 */
export function useAppendDataFile(groupId: string = DEFAULT_GROUP_ID) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: ({
      dataFileId,
      request,
    }: {
      dataFileId: string
      request: AppendDataFileRequest
    }) => dataFilesService.appendDataFile(groupId, dataFileId, request),
    onSuccess: (res) => {
      success(res.message || 'جاري إلحاق البيانات في الخلفية')
      queryClient.invalidateQueries({ queryKey: [DATA_FILES_QUERY_KEY, groupId] })
    },
    onError: (err: unknown) => {
      const apiErr = ApiError.from(err)
      error(apiErr.message || 'حدث خطأ أثناء إلحاق البيانات')
    },
  })
}

/**
 * Mutation hook to toggle active filtering status (Optimistic update)
 */
export function useToggleDataFileActive(groupId: string = DEFAULT_GROUP_ID) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (dataFileId: string) =>
      dataFilesService.toggleActive(groupId, dataFileId),
    onMutate: async (dataFileId: string) => {
      await queryClient.cancelQueries({ queryKey: [DATA_FILES_QUERY_KEY, groupId] })
      const previousData = queryClient.getQueryData<DataFilesListResponseDto>([
        DATA_FILES_QUERY_KEY,
        groupId,
      ])

      if (previousData) {
        queryClient.setQueryData<DataFilesListResponseDto>(
          [DATA_FILES_QUERY_KEY, groupId],
          {
            ...previousData,
            items: previousData.items.map((item) =>
              item.id === dataFileId
                ? { ...item, isActiveForFiltering: !item.isActiveForFiltering }
                : item
            ),
          }
        )
      }

      return { previousData }
    },
    onSuccess: () => {
      success('تم تحديث حالة تفعيل الملف بنجاح')
    },
    onError: (err: unknown, _dataFileId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [DATA_FILES_QUERY_KEY, groupId],
          context.previousData
        )
      }
      const apiErr = ApiError.from(err)
      error(apiErr.message || 'فشل تحديث حالة الملف')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [DATA_FILES_QUERY_KEY, groupId] })
    },
  })
}

/**
 * Mutation hook to reorder files
 */
export function useReorderDataFiles(groupId: string = DEFAULT_GROUP_ID) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (request: ReorderDataFilesRequestDto) =>
      dataFilesService.reorderDataFiles(groupId, request),
    onSuccess: () => {
      success('تم حفظ الترتيب الجديد للملفات بنجاح')
      queryClient.invalidateQueries({ queryKey: [DATA_FILES_QUERY_KEY, groupId] })
    },
    onError: (err: unknown) => {
      const apiErr = ApiError.from(err)
      error(apiErr.message || 'فشل حفظ ترتيب الملفات')
    },
  })
}

/**
 * Mutation hook to delete a data file
 */
export function useDeleteDataFile(groupId: string = DEFAULT_GROUP_ID) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: (dataFileId: string) =>
      dataFilesService.deleteDataFile(groupId, dataFileId),
    onSuccess: (res) => {
      success(res.message || 'تم حذف الملف بنجاح')
      queryClient.invalidateQueries({ queryKey: [DATA_FILES_QUERY_KEY, groupId] })
    },
    onError: (err: unknown) => {
      const apiErr = ApiError.from(err)
      if (apiErr.status === 403) {
        error('غير مصرح لك بحذف الملفات. هذه الصلاحية للمشرف العام فقط.')
      } else {
        error(apiErr.message || 'فشل حذف الملف')
      }
    },
  })
}

/**
 * Helper hook to download a data file
 */
export function useDownloadDataFile(groupId: string = DEFAULT_GROUP_ID) {
  const { info, success, error } = useToast()

  const downloadFile = async (dataFileId: string, fallbackFileName?: string) => {
    info('جاري بدء تحميل الملف...')
    try {
      const { blob, fileName } = await dataFilesService.downloadDataFile(
        groupId,
        dataFileId
      )

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName || fallbackFileName || 'data-file.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      success('تم تحميل الملف بنجاح')
    } catch (err: unknown) {
      const apiErr = ApiError.from(err)
      if (apiErr.status === 403) {
        error('ليس لديك صلاحية تحميل هذا الملف.')
      } else {
        error(apiErr.message || 'فشل تحميل الملف')
      }
    }
  }

  return { downloadFile }
}
