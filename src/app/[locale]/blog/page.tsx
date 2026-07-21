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
    const posts = await prisma.post.findMany({
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

    const optimizedPosts = posts.map(post => {
      const displayTitle = parseLocalized(post.title, locale);
      const displaySlug = parseLocalized(post.slug, locale);

      return {
        id: post.id,
        slug: displaySlug,
        title: displayTitle,
        content: "", // Content is completely dropped from DB fetch as requested
        coverImage: post.coverImage,
        createdAt: post.createdAt,
      };
    });

    return optimizedPosts;
  },
  [`blog-posts-index-${locale}-${page}-${limit}`],
  { tags: ['post'] }
)();

export const revalidate = 60;

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

  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;

  const posts = await getCachedPosts(validPage, 12, locale);

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 pt-20">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-8 mb-12">
          {/* Dynamic Title Area: Aligns Right in AR, Left in EN/FR/ES */}
          <div className="flex flex-col items-start text-start w-full lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight text-balance">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>

          {/* Advertisement Placeholder */}
          <div className="w-full lg:w-1/2 min-h-[120px] bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase text-center px-4">
              Advertisement Space
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any, index: number) => {
            return (
              <article key={post.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                {post.coverImage ? (
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority={index < 4}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                    <span className="text-4xl text-indigo-200 dark:text-gray-700 font-serif">LuxeImmo</span>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between">
                    <span>{new Date(post.createdAt).toLocaleDateString(locale)}</span>
                    <span>{locale === 'ar' ? 'بواسطة لوكس إيمو' : 'By LuxeImmo'}</span>
                  </div>
                  <h2 dir="auto" className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <Link prefetch={true} href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <div 
                    dir="auto"
                    className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 text-sm"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Link 
                      href={`/blog/${post.slug}`}
                      prefetch={true}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline"
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
      </div>

      <Footer locale={locale} />
    </main>
  );
}
