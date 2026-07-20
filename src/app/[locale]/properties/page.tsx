import { Suspense } from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { PropertyCard } from '@/components/storefront/PropertyCard';
import prisma from '@/lib/prisma';
import { Property } from '@/types';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    alternates: {
      canonical: `https://luxeimmo.com/${locale}/properties`,
      languages: {
        en: `https://luxeimmo.com/en/properties`,
        fr: `https://luxeimmo.com/fr/properties`,
        es: `https://luxeimmo.com/es/properties`,
        ar: `https://luxeimmo.com/ar/properties`,
        'x-default': `https://luxeimmo.com/en/properties`,
      },
    },
  };
}

async function PropertiesPageContent({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ category?: string, type?: string, city?: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { category, type, city } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'PropertiesPage' });

  const where: any = { status: 'APPROVED' };
  if (category) {
    // Upper case the category string to match enum
    const uppercaseCat = category.toUpperCase();
    if (['APARTMENT', 'VILLA', 'COMMERCIAL', 'LAND'].includes(uppercaseCat)) {
        where.category = uppercaseCat;
    }
  }
  if (type) {
    const uppercaseType = type.toUpperCase();
    if (['RENT', 'SALE'].includes(uppercaseType)) {
        where.propertyType = uppercaseType;
    }
  }
  if (city) {
    where.city = { contains: city, mode: 'insensitive' };
  }

  let properties: Property[] = [];
  try {
      const dbProperties = await prisma.property.findMany({
        where,
        take: 8,
        orderBy: { createdAt: 'desc' }
      });

      properties = dbProperties.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        propertyType: p.propertyType,
        category: p.category,
        city: p.city,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        areaSqm: p.areaSqm,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80'],
        isFeatured: p.isFeatured
      })) as Property[];
  } catch (error) {
      console.log('Database error when fetching properties.');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight font-sans">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
          
          {properties.length === 0 ? (
            <div className="text-center text-gray-500 py-20 text-xl font-medium">
              {t('empty')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}


export default async function PropertiesPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ category?: string, type?: string, city?: string }> }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <PropertiesPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
