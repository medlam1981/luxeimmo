import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { FavoritesClient } from '@/components/storefront/FavoritesClient';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Favorites' });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 md:mb-8">{t('title')}</h1>
        <FavoritesClient locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
export async function generateStaticParams() {
  const { routing } = await import('@/i18n/routing');
  return routing.locales.map((locale) => ({ locale }));
}
