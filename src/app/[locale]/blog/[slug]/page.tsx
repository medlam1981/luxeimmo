import { routing } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { connection } from 'next/server';
import { unstable_cache } from 'next/cache';
import { ShareButtons } from '@/components/blog/ShareButtons';

const parseLocalized = (str: string, locale: string) => {
  try {
    const parsed = JSON.parse(str);
    return parsed[locale] || parsed.en || Object.values(parsed)[0] || str;
  } catch {
    return str;
  }
};

const getCachedPost = unstable_cache(
  async (slug: string) => {
    // Because slug is stored as a JSON string for new posts, we use contains.
    // For older posts, the slug is just a raw string. We use OR to check both.
    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { slug: slug },
          { slug: { contains: `"${slug}"` } }
        ]
      },
    });
    return post ? JSON.parse(JSON.stringify(post)) : null;
  },
  ['blog-post-metadata'],
  { tags: ['post'] }
);
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  
  const post = await getCachedPost(slug);
  if (!post || !post.published) return { title: 'Not Found' };

  const displayTitle = parseLocalized(post.title, locale);
  const displayContent = parseLocalized(post.content, locale);
  const excerpt = displayContent.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';
  
  const BASE_URL_ENV = process.env.NEXTAUTH_URL || 'https://luxeimmo.com';
  const BASE_URL = BASE_URL_ENV.replace(/\/$/, '');
  const url = `${BASE_URL}/${locale}/blog/${slug}`;

  // Generate alternate language links using the translated slugs
  let alternates: Record<string, string> = {};
  try {
    const slugs = JSON.parse(post.slug);
    alternates = {
      en: `${BASE_URL}/en/blog/${slugs.en}`,
      fr: `${BASE_URL}/fr/blog/${slugs.fr}`,
      es: `${BASE_URL}/es/blog/${slugs.es}`,
      ar: `${BASE_URL}/ar/blog/${slugs.ar}`,
      'x-default': `${BASE_URL}/en/blog/${slugs.en}`,
    };
  } catch {
    alternates = {
      en: `${BASE_URL}/en/blog/${slug}`,
      fr: `${BASE_URL}/fr/blog/${slug}`,
      es: `${BASE_URL}/es/blog/${slug}`,
      ar: `${BASE_URL}/ar/blog/${slug}`,
      'x-default': `${BASE_URL}/en/blog/${slug}`,
    };
  }

  return {
    title: `${displayTitle} | LuxeImmo Blog`,
    description: excerpt,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title: displayTitle,
      description: excerpt,
      type: 'article',
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      url,
      images: post.coverImage ? [post.coverImage.startsWith('http') ? post.coverImage : `${BASE_URL}${post.coverImage}`] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: excerpt,
      images: post.coverImage ? [post.coverImage.startsWith('http') ? post.coverImage : `${BASE_URL}${post.coverImage}`] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Blog' });

  const post = await getCachedPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const displayTitle = parseLocalized(post.title, locale);
  const displayContent = parseLocalized(post.content, locale);

  // Schema.org Article JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: displayTitle,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: [{
      '@type': 'Organization',
      name: 'LuxeImmo',
    }]
  };

  const sanitizedContent = displayContent
    .replace(/dir=(["'])[a-z]+\1/gi, '')
    .replace(/text-align:\s*left;?/gi, 'text-align: start;')
    .replace(/text-align:\s*right;?/gi, 'text-align: end;');

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 pt-20">
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-start">
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {locale === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
          </Link>
        </div>

        <header className="flex flex-col lg:flex-row justify-between items-start w-full gap-8 mb-12">
          <div className="flex flex-col items-start text-start w-full lg:w-[60%]">
            <h1 dir="auto" className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-snug lg:leading-tight text-balance text-start mb-6">
              {displayTitle}
            </h1>
            
            <div className="flex items-center justify-start text-gray-600 dark:text-gray-400 space-x-4 text-sm md:text-base">
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {new Date(post.createdAt).toLocaleDateString(locale, { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
                <>
                  <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  <span>{locale === 'ar' ? 'بواسطة لوكس إيمو' : 'By LuxeImmo'}</span>
                </>
            </div>
          </div>

          {/* Header Advertisement */}
          <div className="w-full lg:w-[40%] min-h-[120px] bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase text-center px-4">
              Advertisement Space
            </span>
          </div>
        </header>

        {post.coverImage && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 relative w-full" style={{ height: 'auto', maxHeight: '600px', aspectRatio: '16/9' }}>
            <Image
              src={post.coverImage}
              alt={displayTitle}
              fill
              priority={true}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 w-full">
          <div className="w-full lg:w-[70%]">
            {/* Tiptap uses standard HTML tags, so we wrap in 'prose' for Tailwind Typography styling */}
            <div 
              dir="auto"
              className="prose prose-lg dark:prose-invert max-w-3xl prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl prose-indigo mx-auto lg:mx-0"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            
            {/* Mobile Horizontal Ad (Hidden on Desktop) */}
            <div className="w-full h-[90px] my-8 bg-gray-100 dark:bg-gray-900/40 flex lg:hidden items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase text-center px-4">
                Advertisement Space
              </span>
            </div>

            <ShareButtons title={displayTitle} shareText={t('shareThisPost')} />
          </div>

          <aside className="hidden lg:block lg:w-[30%]">
            <div className="sticky top-24 w-full min-h-[600px] bg-gray-100 dark:bg-gray-900/40 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase text-center px-4">
                Advertisement Space
              </span>
            </div>
          </aside>
        </div>
      </article>

      <Footer locale={locale} />
    </main>
  );
}


export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ select: { slug: true } });
  return routing.locales.flatMap(locale => 
    posts.map(p => {
      // Handle localized slugs in DB
      let slug = p.slug;
      try {
        const parsed = JSON.parse(slug);
        slug = parsed[locale] || parsed.en || Object.values(parsed)[0];
      } catch (e) {}
      return { locale, slug };
    })
  );
}

