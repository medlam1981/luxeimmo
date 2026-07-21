'use client';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/theme/LanguageSwitcher';
import { logoutAdmin } from '@/app/actions/authActions';

export default function AdminLayoutClient({ children, translations, isAdmin }: { children: React.ReactNode, translations: any, isAdmin: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <header className="flex w-full items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{translations.adminLabel || 'Admin'}</div>
        
        <div className="flex items-center gap-3 md:gap-4 text-sm">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            onClick={async () => {
              try {
                await logoutAdmin();
              } catch (err: any) {
                if (err.message?.includes('Failed to find Server Action')) {
                  window.location.reload();
                }
              }
            }}
            className="text-red-600 dark:text-red-400 font-medium hover:opacity-80 transition-opacity"
          >
            {translations.logout}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-w-0 w-full">
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
