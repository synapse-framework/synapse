// Comprehensive UI Library Export
export * from './components/index.js';
export * from './utils/index.js';

// Re-export themes for convenience
export const lightTheme = {
  name: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#111827'
  }
};

export const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#9ca3af',
    background: '#111827',
    text: '#f9fafb'
  }
};