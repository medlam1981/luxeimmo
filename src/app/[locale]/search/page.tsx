import { routing } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { PropertyCard } from '@/components/storefront/PropertyCard';
import { Metadata } from 'next';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { SearchFilters } from '@/components/storefront/SearchFilters';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    alternates: {
      canonical: `https://luxeimmo.com/${locale}/search`,
      languages: {
        en: `https://luxeimmo.com/en/search`,
        fr: `https://luxeimmo.com/fr/search`,
        es: `https://luxeimmo.com/es/search`,
        ar: `https://luxeimmo.com/ar/search`,
        'x-default': `https://luxeimmo.com/en/search`,
      },
    },
  };
}

async function SearchPageContent({ params, searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ locale: string }>; }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Search' });
  
  const city = sp.city || '';
  const type = sp.type || 'SALE';
  const category = sp.category;
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice) : undefined;
  const bedrooms = sp.bedrooms ? parseInt(sp.bedrooms, 10) : undefined;
  const bathrooms = sp.bathrooms ? parseInt(sp.bathrooms, 10) : undefined;

  const where: any = { status: 'APPROVED' };
  
  if (type) where.propertyType = type as 'SALE' | 'RENT';
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (category) where.category = category;
  if (bedrooms) where.bedrooms = { gte: bedrooms };
  if (bathrooms) where.bathrooms = { gte: bathrooms };
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  const properties = await prisma.property.findMany({ where, orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }] });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('searchResults')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{t('foundProperties', { count: properties.length })}</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4">
            <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>}>
              <SearchFilters initialFilters={{ city, type, category, minPrice, maxPrice, bedrooms, bathrooms }} />
            </Suspense>
          </aside>
          
          <div className="w-full lg:w-3/4">
             {properties.length === 0 ? (
               <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('noProperties')}</h2>
                 <p className="text-gray-500 dark:text-gray-400">{t('adjustFilters')}</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                 {properties.map((p: any) => <PropertyCard key={p.id} property={p} />)}
               </div>
             )}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}


export default async function SearchPage({ params, searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ locale: string }>; }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <SearchPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}



