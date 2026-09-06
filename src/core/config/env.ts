/**
 * Application Environment Configuration
 * Centralized and type-safe environment variables
 */

export const env = {
  /**
   * Backend API base URL. Defaults to https://live-track.runasp.net
   */
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'https://live-track.runasp.net',

  /**
   * Application name in Arabic
   */
  appName: (import.meta.env.VITE_APP_NAME as string) || 'نظام تتبع سيارات المصرف',

  /**
   * Runtime environment mode ('development' | 'production' | 'test')
   */
  mode: import.meta.env.MODE || 'development',

  /**
   * Convenience boolean checks
   */
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
