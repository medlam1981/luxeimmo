import prisma from '@/lib/prisma';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { Link } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

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

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 pt-20">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            LuxeImmo Insights
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Expert advice, market trends, and legal guides for the Moroccan real estate market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              {post.coverImage ? (
                <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  {post.author?.name && <span>By {post.author.name}</span>}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <div 
                  className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 text-sm"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>?/gm, '') }}
                />
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline"
                  >
                    Read full article &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No articles published yet. Check back soon!</p>
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </main>
  );
}
