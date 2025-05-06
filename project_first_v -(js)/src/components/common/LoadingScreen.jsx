import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
