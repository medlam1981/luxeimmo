import { routing } from '@/i18n/routing';
import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { Link } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { connection } from 'next/server';
import { unstable_cache } from 'next/cache';

const parseLocalized = (str: string, locale: string) => {
  try {
    const parsed = JSON.parse(str);
    return parsed[locale] || parsed.en || Object.values(parsed)[0] || str;
  } catch {
    return str;
  }
};

const getCachedPosts = (page: number, limit: number, locale: string) => unstable_cache(
  async () => {
    let posts: any[] = [];
    try {
      posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          coverImage: true,
          createdAt: true,
        }
      });
    } catch (error) {
      console.log('Database connection failed in blog cache.');
      const { unstable_noStore } = await import('next/cache');
      unstable_noStore();
    }

    const optimizedPosts = posts.map(post => {
      const displayTitle = parseLocalized(post.title, locale);
      const displaySlug = parseLocalized(post.slug, locale);

      return {
        id: post.id,
        slug: displaySlug,
        title: displayTitle,
        coverImage: post.coverImage,
        createdAt: post.createdAt,
      };
    });

    return optimizedPosts;
  },
  [`blog-posts-index-${locale}-${page}-${limit}`],
  { tags: ['post'], revalidate: 86400 }
)();


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: 'Real Estate Blog & Guides | LuxeImmo',
    description: 'Read our latest articles, guides, and tips on buying, selling, and renting properties in Morocco.',
    alternates: {
      canonical: `https://luxeimmo.com/${locale}/blog`,
      languages: {
        en: `https://luxeimmo.com/en/blog`,
        fr: `https://luxeimmo.com/fr/blog`,
        es: `https://luxeimmo.com/es/blog`,
        ar: `https://luxeimmo.com/ar/blog`,
        'x-default': `https://luxeimmo.com/en/blog`,
      },
    },
  };
}

export default async function BlogIndexPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogIndex' });

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 pt-20">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-12 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-4 md:gap-8 mb-6 md:mb-12">
          {/* Dynamic Title Area: Aligns Right in AR, Left in EN/FR/ES */}
          <div className="hidden lg:flex flex-col items-start text-start w-full lg:w-1/2">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight text-balance">
              {t('title')}
            </h1>
            <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>

          {/* Advertisement Placeholder */}
          <div className="w-full lg:w-1/2 min-h-[120px] bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 premium-card">
            <span className="text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase text-center px-4">
              Advertisement Space
            </span>
          </div>
        </div>

        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <BlogList searchParams={searchParams} locale={locale} />
        </Suspense>
      </div>

      <Footer locale={locale} />
    </main>
  );
}

async function BlogList({ searchParams, locale }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>, locale: string }) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;

  const posts = await getCachedPosts(validPage, 12, locale);
  const t = await getTranslations({ locale, namespace: 'BlogIndex' });

  return (
    <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {posts.map((post: any, index: number) => {
            return (
              <article key={post.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden group flex flex-col premium-card premium-interactive">
                {post.coverImage ? (
                  <div className="aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority={index < 4}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] md:aspect-[16/9] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                    <span className="text-xl md:text-4xl text-indigo-200 dark:text-gray-700 font-serif">LuxeImmo</span>
                  </div>
                )}
                
                <div className="p-2 md:p-6 flex flex-col flex-grow">
                  <div className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 mb-1 md:mb-3 flex items-center justify-between">
                    <span>{new Date(post.createdAt).toLocaleDateString(locale)}</span>
                    <span className="hidden sm:inline">{locale === 'ar' ? 'بواسطة لوكس إيمو' : 'By LuxeImmo'}</span>
                  </div>
                  <h2 dir="auto" className="text-xs md:text-xl font-semibold md:font-bold text-gray-900 dark:text-white mb-1 md:mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <Link prefetch={true} href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <div 
                    dir="auto"
                    className="text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-3 mb-2 md:mb-6 text-[10px] sm:text-xs md:text-sm"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  <div className="mt-auto pt-2 md:pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Link 
                      href={`/blog/${post.slug}`}
                      prefetch={true}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] sm:text-xs md:text-sm hover:underline"
                      dangerouslySetInnerHTML={{ __html: t('readMore') }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('empty')}</p>
          </div>
        )}
    </>
  );
}


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}



