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

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

async function HomeCategories({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'CategoriesPage' });
  const categories = [
    { slug: 'APARTMENT', name: t('apartment_name', { defaultMessage: 'Apartments' }), desc: t('apartment_desc', { defaultMessage: 'Modern apartments in the city center.' }), image: '/images/categories/apartments.jpg' },
    { slug: 'VILLA', name: t('villa_name', { defaultMessage: 'Luxury Villas' }), desc: t('villa_desc', { defaultMessage: 'Spacious villas with private pools.' }), image: '/images/categories/villas.jpg' },
    { slug: 'COMMERCIAL', name: t('commercial_name', { defaultMessage: 'Commercial Spaces' }), desc: t('commercial_desc', { defaultMessage: 'Prime locations for your business.' }), image: '/images/categories/commercial.jpg' },
    { slug: 'LAND', name: t('land_name', { defaultMessage: 'Land & Plots' }), desc: t('land_desc', { defaultMessage: 'Build your dream project.' }), image: '/images/categories/land.jpg' }
  ];

  return (
    <div id="categories" className="w-full bg-gray-50 dark:bg-gray-900 pt-20 pb-4 md:pt-0 md:pb-0 md:min-h-[calc(100vh-80px)] md:flex md:flex-col md:justify-center md:items-center md:mt-[80px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Advertisement Container */}
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-xl mb-4 md:mb-12 h-16 md:h-24 flex items-center justify-center border border-gray-300 dark:border-gray-700">
          <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">Advertisement Space</p>
        </div>

        <div className="text-center mb-4 md:mb-16">
          <h2 className="text-lg md:text-5xl font-extrabold text-gray-900 dark:text-white mb-1 md:mb-4 tracking-tight font-sans">
            {t('title', { defaultMessage: 'Browse by Category' })}
          </h2>
          <p className="text-xs md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle', { defaultMessage: 'Explore our curated real estate categories.' })}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/properties?category=${category.slug}`}
              className="group relative h-40 md:h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>
              
              <div className="absolute inset-0 p-3 md:p-8 flex flex-col justify-end text-start">
                <h3 className="text-sm md:text-3xl font-bold text-white mb-1 md:mb-2">{category.name}</h3>
                <p className="text-[10px] md:text-lg text-gray-200 opacity-100 md:opacity-0 transform md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 line-clamp-2 md:line-clamp-none">
                  {category.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <HomeCategories locale={locale} />
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

