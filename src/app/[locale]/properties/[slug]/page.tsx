import { routing } from '@/i18n/routing';
import { Suspense } from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { MapPin, BedDouble, Bath, Square, Calendar, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { ContactOwnerButton } from '@/components/storefront/ContactOwnerButton';
import { ImageGallery } from '@/components/storefront/ImageGallery';
import MapWrapper from '@/components/storefront/MapWrapper';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

const parseLocalized = (str: string, locale: string) => {
  try {
    const parsed = JSON.parse(str);
    return parsed[locale] || parsed.en || str;
  } catch {
    return str;
  }
};

import { connection } from 'next/server';
import { unstable_cache } from 'next/cache';

const getCachedProperty = unstable_cache(
  async (slug: string) => {
    const property = await prisma.property.findUnique({ where: { slug } });
    return property ? JSON.parse(JSON.stringify(property)) : null;
  },
  ['property-metadata'],
  { tags: ['property'], revalidate: 86400 }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const property = await getCachedProperty(slug);

  if (!property) {
    return {
      title: 'Property Not Found | LuxeImmo',
      description: 'This property listing could not be found.',
    };
  }

  const displayTitle = parseLocalized(property.title, locale);
  const displayDesc = parseLocalized(property.description, locale);
  const BASE_URL_ENV = process.env.NEXTAUTH_URL || 'https://luxeimmo.com';
  const BASE_URL = BASE_URL_ENV.replace(/\/$/, '');
  const canonicalUrl = `${BASE_URL}/${locale}/properties/${slug}`;
  const ogImageRaw = property.images.length > 0 ? property.images[0] : `/images/hero/slide-1.jpg`;
  const ogImage = ogImageRaw.startsWith('http') ? ogImageRaw : `${BASE_URL}${ogImageRaw}`;
  
  const priceFormatted = formatCurrency(Number(property.price));
  const seoDescription = `${property.propertyType === 'RENT' ? 'For Rent' : 'For Sale'}: ${displayTitle} in ${property.city}. Price: ${priceFormatted} MAD. ${displayDesc.slice(0, 100)}...`;

  return {
    title: `${displayTitle} – ${property.city} | LuxeImmo`,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${BASE_URL}/en/properties/${slug}`,
        fr: `${BASE_URL}/fr/properties/${slug}`,
        es: `${BASE_URL}/es/properties/${slug}`,
        ar: `${BASE_URL}/ar/properties/${slug}`,
        'x-default': `${BASE_URL}/en/properties/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      siteName: 'LuxeImmo',
      title: `${displayTitle} | LuxeImmo`,
      description: seoDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
      locale: locale === 'ar' ? 'ar_MA' : locale === 'fr' ? 'fr_MA' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayTitle} | LuxeImmo`,
      description: seoDescription,
      images: [ogImage],
      site: '@LuxeImmo',
    },
  };
}

async function PropertyPageContent({ params }: Props) {
  const { slug, locale } = await params;
  const property = await prisma.property.findUnique({ where: { slug } });

  if (!property) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: 'Property' });
  const te = await getTranslations({ locale, namespace: 'enums' });
  
  const displayTitle = parseLocalized(property.title, locale);
  const displayDesc = parseLocalized(property.description, locale);

  let priceDisplay = formatCurrency(Number(property.price));
  if (property.propertyType === 'RENT') {
    if (property.rentalPeriod === 'DAILY') {
      priceDisplay += t('perDay');
    } else if (property.rentalPeriod === 'MONTHLY') {
      priceDisplay += t('perMonth');
    }
  }

  const badgeType = te(`propertyType.${property.propertyType}` as any);
  const badgeCategory = te(`category.${property.category}` as any);

  const BASE_URL = process.env.NEXTAUTH_URL || 'https://luxeimmo.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: displayTitle,
    description: displayDesc,
    image: property.images.map((img: string) => img.startsWith('http') ? img : `${BASE_URL}${img}`),
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.areaSqm,
      unitCode: 'MTK' // Square meters
    },
    offers: {
      '@type': 'Offer',
      price: property.price.toString(),
      priceCurrency: 'MAD',
      url: `${BASE_URL}/${locale}/properties/${property.slug}`,
      availability: 'https://schema.org/InStock'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressCountry: 'MA'
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex-grow pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Left Column: Images, Details, Map */}
            <div className="w-full lg:w-2/3 space-y-12">
              <ImageGallery images={property.images} title={displayTitle} propertyId={property.id} />
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {badgeType}
                  </span>
                  <span className="px-4 py-1.5 bg-gray-100 text-black dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {badgeCategory}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                  {displayTitle}
                </h1>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPin className="w-6 h-6 mr-3 text-black dark:text-white" />
                  <span className="text-xl font-medium">{property.city}, Morocco</span>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms != null && (
                  <div className="flex flex-col gap-2 p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl items-center text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                    <BedDouble className="w-8 h-8 text-black dark:text-white" />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('bedrooms')}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex flex-col gap-2 p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl items-center text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Bath className="w-8 h-8 text-black dark:text-white" />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('bathrooms')}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</span>
                  </div>
                )}
                <div className="flex flex-col gap-2 p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl items-center text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                  <Square className="w-8 h-8 text-black dark:text-white" />
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('areaSqm')}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{property.areaSqm} m²</span>
                </div>
                {property.rentalPeriod && (
                  <div className="flex flex-col gap-2 p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl items-center text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                    <Calendar className="w-8 h-8 text-black dark:text-white" />
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{t('rentalPeriod')}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white capitalize">{property.rentalPeriod === 'DAILY' ? t('daily') : t('monthly')}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('aboutThisProperty')}</h3>
                <p className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-400">
                  {displayDesc}
                </p>
              </div>

              {/* Interactive Map */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t('location')}</h3>
                <MapWrapper city={property.city} lat={property.latitude} lng={property.longitude} />
              </div>

            </div>

            {/* Right Column: Sticky Contact Card */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-28 bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col relative overflow-hidden">
                
                <div className="mb-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-3">{t('askingPrice')}</p>
                  <p className="text-4xl lg:text-5xl font-extrabold text-black dark:text-white tracking-tight">{priceDisplay}</p>
                </div>
                
                <div className="w-full">
                  <ContactOwnerButton 
                    propertyId={property.id}
                    ownerPhone={property.ownerPhone}
                    propertyTitle={displayTitle}
                    propertyCity={property.city}
                    propertySlug={property.slug}
                  />
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <ShieldCheck className="w-5 h-5 text-green-500" /> {t('secureContact')}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <MapPin className="w-5 h-5 text-blue-500" /> {t('verifiedListing')}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <Footer locale={locale} />
    </main>
  );
}


import { setRequestLocale } from 'next-intl/server';

export default async function PropertyPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <PropertyPageContent params={params} />
    </Suspense>
  );
}


export async function generateStaticParams() {
  const properties = await prisma.property.findMany({ select: { slug: true } });
  if (properties.length === 0) {
    return routing.locales.map(locale => ({ locale, slug: 'dummy-property' }));
  }
  return routing.locales.flatMap(locale => 
    properties.map(p => ({ locale, slug: p.slug }))
  );
}

