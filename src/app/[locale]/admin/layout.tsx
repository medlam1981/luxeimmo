'use client';

import { LayoutDashboard, Package, ShoppingCart, Menu, X, Tags, Settings } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';
import { useState, Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/theme/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { logoutAdmin } from '@/app/actions/authActions';
import { useSession } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Admin');
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { data: session } = useSession();

  const navItems = [
    { label: t('overview'), href: '/admin', icon: LayoutDashboard },
    { label: t('manageProperties'), href: '/admin/properties', icon: Package }
  ];

  if (session?.user && (session.user as any).role === 'ADMIN') {
    navItems.push({ label: 'Review Properties', href: '/admin/review', icon: Tags });
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
      <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-900 w-64 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white tracking-tight font-sans text-nowrap">
            {t('adminBrandName')}
          </Link>
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Handle pathname matches for active state
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href as any}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-black dark:bg-white text-white dark:text-black' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 me-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <div className="hidden lg:flex items-center justify-between px-2">
             <LanguageSwitcher dropup={true} align="start" />
             <ThemeToggle />
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center px-4 py-3 rounded-xl transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
            >
              <X className="w-5 h-5 me-3" />
              <span>{t('logout')}</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 lg:px-8 justify-between lg:hidden">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ms-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg dark:text-white font-sans">{t('adminBrandName')}</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
