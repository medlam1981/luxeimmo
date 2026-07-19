import { getTranslations } from 'next-intl/server';
import AdminLayoutClient from './AdminLayoutClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Suspense } from 'react';

async function AdminLayoutContent({ children, locale }: { children: React.ReactNode, locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Admin' });
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

  const translations = {
    overview: t('overview'),
    manageProperties: t('manageProperties'),
    logout: t('logout')
  };

  return <AdminLayoutClient translations={translations} isAdmin={!!isAdmin}>{children}</AdminLayoutClient>;
}

export default async function AdminLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AdminLayoutContent locale={locale}>{children}</AdminLayoutContent>
    </Suspense>
  );
}
