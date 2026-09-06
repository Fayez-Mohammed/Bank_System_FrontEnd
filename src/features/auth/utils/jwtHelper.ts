import type { UserPermissions } from '../types/auth.types'

/**
 * Decodes JWT payload safely and extracts user role and permission claims
 */
export function parseJwtClaims(token: string | null): UserPermissions {
  const defaultPermissions: UserPermissions = {
    canDownload: false,
    canToggleFiles: false,
    canAppendToTeamFiles: false,
    canFilter: false,
    isAdmin: false,
    isSuperAdmin: false,
  }

  if (!token) return defaultPermissions

  try {
    const parts = token.split('.')
    if (parts.length < 2) return defaultPermissions

    // Decode base64 URL
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const payload = JSON.parse(jsonPayload) as Record<string, unknown>

    const role =
      (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string) ||
      (payload['role'] as string) ||
      ''

    const isSuperAdmin = role.toLowerCase() === 'superadmin'
    const isAdmin = isSuperAdmin || role.toLowerCase() === 'admin'

    const canDownload =
      isAdmin ||
      payload['CanDownload'] === 'true' ||
      payload['CanDownload'] === true

    const canToggleFiles =
      isAdmin ||
      payload['CanToggleFiles'] === 'true' ||
      payload['CanToggleFiles'] === true

    const canAppendToTeamFiles =
      isAdmin ||
      payload['CanAppendToTeamFiles'] === 'true' ||
      payload['CanAppendToTeamFiles'] === true

    const canFilter =
      isAdmin ||
      payload['CanFilter'] === 'true' ||
      payload['CanFilter'] === true

    return {
      canDownload,
      canToggleFiles,
      canAppendToTeamFiles,
      canFilter,
      isAdmin,
      isSuperAdmin,
    }
  } catch (error) {
    console.error('Failed to parse JWT claims:', error)
    return defaultPermissions
  }
}
