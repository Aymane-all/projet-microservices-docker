import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  // Définition des tailles
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  // Définition des couleurs
  const colors = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-500',
    white: 'border-white'
  };

  const spinnerSize = sizes[size] || sizes.md;
  const spinnerColor = colors[color] || colors.primary;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className={`${spinnerSize} rounded-full border-t-transparent ${spinnerColor} animate-spin`}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${spinnerSize} rounded-full border-t-transparent ${spinnerColor} animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
