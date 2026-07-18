'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-3xl border border-red-100 dark:border-red-900/50 max-w-md w-full">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-sans">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The Admin Dashboard encountered an unexpected error. This might be due to a database connection issue.
        </p>
        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 font-medium shadow-sm"
        >
          <RotateCcw className="w-5 h-5 me-2" />
          Try Again
        </button>
      </div>
    </div>
  );
}
