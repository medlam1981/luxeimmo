'use client';

import { LayoutDashboard, Package, Menu, X, Tags, FileText } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/theme/LanguageSwitcher';
import { logoutAdmin } from '@/app/actions/authActions';

export default function AdminLayoutClient({ children, translations, isAdmin }: { children: React.ReactNode, translations: any, isAdmin: boolean }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: translations.overview, href: '/admin', icon: LayoutDashboard },
    { label: translations.manageProperties, href: '/admin/properties', icon: Package }
  ];

  if (isAdmin) {
    navItems.push({ label: 'Review Properties', href: '/admin/review', icon: Tags });
    navItems.push({ label: 'Blog Posts', href: '/admin/posts', icon: FileText });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 start-0 bg-white dark:bg-gray-900 w-64 border-e border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/admin" className="font-bold text-xl text-blue-600 dark:text-blue-400">
              LuxeImmo Admin
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Because pathname includes the locale (e.g. /en/admin), we check if it ends with or includes the href
              const isActive = pathname === item.href || pathname?.startsWith(`/${pathname.split('/')[1]}${item.href}`);
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher dropup={true} />
            </div>
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
              className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              {translations.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 p-2 -ms-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <span className="font-bold text-lg">{translations.adminLabel}</span>
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
