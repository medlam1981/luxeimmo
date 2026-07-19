import { getTranslations } from 'next-intl/server';
import AdminLayoutClient from './AdminLayoutClient';
import { Suspense } from 'react';

export default async function AdminLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin' });

  const translations = {
    overview: t('overview'),
    manageProperties: t('manageProperties'),
    logout: t('logout')
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AdminLayoutClient translations={translations}>{children}</AdminLayoutClient>
    </Suspense>
  );
}
