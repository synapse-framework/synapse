// Simple UI Library Export
export interface ButtonProps {
  children?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children?: string;
  title?: string;
  className?: string;
}

// Theme system
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#111827'
  }
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#9ca3af',
    background: '#111827',
    text: '#f9fafb'
  }
};

// Utility functions
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}