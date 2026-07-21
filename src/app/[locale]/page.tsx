import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { Navbar } from '@/components/storefront/Navbar';
import { Hero } from '@/components/storefront/Hero';
import { PropertyGrid } from '@/components/storefront/PropertyGrid';
import { Features } from '@/components/storefront/Features';
import { Footer } from '@/components/storefront/Footer';
import prisma from '@/lib/prisma';
import { Property } from '@/types';

import { setRequestLocale } from 'next-intl/server';


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    alternates: {
      canonical: `https://luxeimmo.com/${locale}`,
      languages: {
        en: `https://luxeimmo.com/en`,
        fr: `https://luxeimmo.com/fr`,
        es: `https://luxeimmo.com/es`,
        ar: `https://luxeimmo.com/ar`,
        'x-default': `https://luxeimmo.com/en`,
      },
    },
  };
}

import { Suspense } from 'react';

async function HomeProperties() {
  let properties: Property[] = [];
  
  try {
    const dbProperties = await prisma.property.findMany({
      where: { status: 'APPROVED' },
      orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
      take: 8
    });
    
    properties = dbProperties.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      propertyType: p.propertyType,
      ownerPhone: p.ownerPhone,
      category: p.category,
      city: p.city,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      areaSqm: p.areaSqm,
      images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'],
      isFeatured: p.isFeatured
    })) as Property[];

  } catch (error) {
    console.log('Database connection failed.');
  }

  return <PropertyGrid properties={properties} />;
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <Hero />
      <Features />
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <HomeProperties />
      </Suspense>
      <Footer locale={locale} />
    </main>
  );
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

