import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 shadow-button hover:shadow-button-hover',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 focus:ring-2 focus:ring-secondary-500/50 focus:ring-offset-2 shadow-button hover:shadow-button-hover',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 hover:shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-500/50',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-2 shadow-button hover:shadow-button-hover',
    success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 focus:ring-2 focus:ring-success-500/50 focus:ring-offset-2 shadow-button hover:shadow-button-hover',
    danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 focus:ring-2 focus:ring-error-500/50 focus:ring-offset-2 shadow-button hover:shadow-button-hover'
  };

  const sizeStyles = {
    xs: 'text-xs px-2 py-1 rounded',
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-base px-4 py-2 rounded-md',
    lg: 'text-lg px-6 py-3 rounded-lg',
    xl: 'text-xl px-8 py-4 rounded-lg'
  };

  const disabledStyles = 'opacity-60 cursor-not-allowed pointer-events-none filter grayscale';
  const loadingStyles = 'relative text-transparent pointer-events-none';
  const fullWidthStyles = 'w-full';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && disabledStyles,
        fullWidth && fullWidthStyles,
        className
      )}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      <span className={cn(isLoading && loadingStyles, 'flex items-center')}>
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </span>
    </button>
  );
};

export default Button;
