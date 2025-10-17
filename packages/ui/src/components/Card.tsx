import React from 'react';
import { cn } from '../utils';

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className,
  variant = 'default',
  hoverable = false,
  padding = 'md',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg border transition-all duration-200';
  
  const variantClasses = {
    default: 'border-gray-200 shadow-sm',
    elevated: 'border-gray-200 shadow-lg',
    outlined: 'border-gray-300 shadow-none'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn('text-lg font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
};
