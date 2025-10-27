import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-800"></div>
      <p className="mt-4 text-slate-600">{message || 'Loading...'}</p>
    </div>
  );
};