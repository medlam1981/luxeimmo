import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

export const revalidate = 3600;

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'CategoriesPage' });
  
  const categories = [
    { slug: 'APARTMENT', name: t('apartment_name', { defaultMessage: 'Apartments' }), desc: t('apartment_desc', { defaultMessage: 'Modern apartments in the city center.' }), image: '/images/categories/apartments.jpg' },
    { slug: 'VILLA', name: t('villa_name', { defaultMessage: 'Luxury Villas' }), desc: t('villa_desc', { defaultMessage: 'Spacious villas with private pools.' }), image: '/images/categories/villas.jpg' },
    { slug: 'COMMERCIAL', name: t('commercial_name', { defaultMessage: 'Commercial Spaces' }), desc: t('commercial_desc', { defaultMessage: 'Prime locations for your business.' }), image: '/images/categories/commercial.jpg' },
    { slug: 'LAND', name: t('land_name', { defaultMessage: 'Land & Plots' }), desc: t('land_desc', { defaultMessage: 'Build your dream project.' }), image: '/images/categories/land.jpg' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 w-full pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight font-sans">
              {t('title', { defaultMessage: 'Browse by Category' })}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('subtitle', { defaultMessage: 'Explore our curated real estate categories.' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.slug} 
                href={`/properties?category=${category.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-start">
                  <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                  <p className="text-gray-200 text-lg opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {category.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

