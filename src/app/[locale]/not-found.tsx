'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';

const REDIRECT_DELAY = 10; // seconds before auto-redirect

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  // Decrement the countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Separate effect: redirect only when countdown reaches zero
  useEffect(() => {
    if (countdown === 0) {
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <>
      {/* SEO title tag — valid inside a client component */}
      <title>404 – Page Not Found | LuxeImmo</title>

      <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-950">
        <div className="max-w-lg w-full text-center space-y-8">

          {/* Layered 404 text */}
          <div className="relative">
            <p className="text-[9rem] font-black tracking-tighter leading-none text-gray-100 dark:text-gray-900 select-none">
              404
            </p>
            <p className="absolute inset-0 flex items-center justify-center text-[9rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 select-none">
              404
            </p>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              The page you are looking for doesn&apos;t exist, has been moved, or is
              temporarily unavailable.
            </p>
          </div>

          {/* Auto-redirect countdown */}
          <p className="text-sm text-gray-400 dark:text-gray-600">
            Redirecting to homepage in{' '}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {countdown}s
            </span>
          </p>

          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-black dark:bg-white rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((REDIRECT_DELAY - countdown) / REDIRECT_DELAY) * 100}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity font-medium text-sm shadow-lg"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>

            <button
              onClick={() => router.push('/search')}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors font-medium text-sm"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
