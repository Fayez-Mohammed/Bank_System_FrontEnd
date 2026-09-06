/**
 * DataFiles Feature Types
 * Matches exactly the backend DTOs from TheEndPointsFile.txt
 */

export type ImportStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | string

export interface DataFileSummaryDto {
  id: string
  fileName: string
  rowCount: number
  isActiveForFiltering: boolean
  sortOrder: number
  requiresPassword: boolean
  ownerName: string
  importStatus: ImportStatus
  createdAt: string
}

export interface DataFilesHeaderDto {
  totalFilesCount: number
  groupTotalRows: number
  currentUserRows: number
  groupName: string
}

export interface DataFilesListResponseDto {
  header: DataFilesHeaderDto
  items: DataFileSummaryDto[]
}

export interface CreateDataFileRequest {
  file: File
  password?: string
  columnMapping?: string
}

export interface AppendDataFileRequest {
  file: File
}

export interface ReorderItemDto {
  id: string
  sortOrder: number
}

export interface ReorderDataFilesRequestDto {
  items: ReorderItemDto[]
}
