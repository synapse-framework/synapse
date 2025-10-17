import React from 'react';
import { cn } from '../utils';

export interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  value = '',
  placeholder,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error = false,
  errorMessage,
  helperText,
  label,
  type = 'text',
  leftIcon,
  rightIcon,
  clearable = false,
  className,
  size = 'md',
  ...props
}) => {
  const baseClasses = 'block w-full rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  
  const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white';

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          className={cn(
            baseClasses,
            sizeClasses[size],
            stateClasses,
            disabledClasses,
            leftIcon && 'pl-10',
            (rightIcon || clearable) && 'pr-10',
            className
          )}
          {...props}
        />
        {(rightIcon || clearable) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {rightIcon && !clearable && (
              <span className="text-gray-400">{rightIcon}</span>
            )}
          </div>
        )}
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
