/**
 * Authentication Feature Types
 * Matches backend contracts exactly from TheEndPointsFile.txt
 */

export interface LoginRequestDto {
  email: string
  password: string
}

export interface UserLoginDto {
  id: string
  fullName: string
  role: 'SuperAdmin' | 'Admin' | 'User' | string
}

export interface LoginResponseDto {
  accessToken: string
  expireAt: string
  userLogin: UserLoginDto
}

export interface UserPermissions {
  canDownload: boolean
  canToggleFiles: boolean
  canAppendToTeamFiles: boolean
  canFilter: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}
