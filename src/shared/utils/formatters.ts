/**
 * Arabic Localization and Formatting Utilities
 */

/**
 * Format a date string or Date object into a readable Arabic format
 */
export function formatArabicDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a date with time in Arabic
 */
export function formatArabicDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Format relative time in Arabic (e.g. منذ ٥ دقائق)
 */
export function formatArabicRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'الآن'
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`
  return formatArabicDate(d)
}

/**
 * Format numbers in Arabic locale
 */
export function formatArabicNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '٠'
  return new Intl.NumberFormat('ar-EG').format(value)
}

/**
 * Format currency amount with currency symbol
 */
export function formatArabicCurrency(amount: number | null | undefined, currency = 'ج.م'): string {
  if (amount === null || amount === undefined || isNaN(amount)) return `٠ ${currency}`
  return `${formatArabicNumber(amount)} ${currency}`
}
