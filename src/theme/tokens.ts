/**
 * Theme & Design Tokens for Mobile First Experience
 * High contrast, accessible colors, and touch-optimized dimensions
 */

export const theme = {
  colors: {
    // Primary Brand (Bank trust blue)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    // Background & Surfaces
    surface: {
      background: '#0b0f19',
      card: '#131b2e',
      cardHover: '#1a243d',
      border: '#1e293b',
      input: '#151f33',
    },
    // Status colors
    status: {
      active: '#10b981',     // Green
      idle: '#f59e0b',       // Amber
      maintenance: '#ef4444',// Red
      offline: '#64748b',    // Slate
    },
  },
  touchTarget: {
    minHeight: '48px',
    minWidth: '48px',
  },
} as const
