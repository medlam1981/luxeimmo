import prisma from '@/lib/prisma';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { connection } from 'next/server';
import { unstable_cache } from 'next/cache';

const parseLocalized = (str: string, locale: string) => {
  try {
    const parsed = JSON.parse(str);
    return parsed[locale] || parsed.en || str;
  } catch {
    return str;
  }
};

const getCachedPost = unstable_cache(
  async (slug: string) => {
    // Because slug is stored as a JSON string, we use contains to find the post
    return await prisma.post.findFirst({
      where: { slug: { contains: `"${slug}"` } },
      include: { author: true },
    });
  },
  ['blog-post-metadata'],
  { tags: ['post'] }
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  await connection();
  const { slug, locale } = await params;
  setRequestLocale(locale);
  
  const post = await getCachedPost(slug);
  if (!post || !post.published) return { title: 'Not Found' };

  const displayTitle = parseLocalized(post.title, locale);
  const displayContent = parseLocalized(post.content, locale);
  const excerpt = displayContent.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';
  
  const BASE_URL = process.env.NEXTAUTH_URL || 'https://luxeimmo.com';
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
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      url,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  await connection();
  const { slug, locale } = await params;
  setRequestLocale(locale);

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
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: [{
      '@type': 'Person',
      name: post.author?.name || 'LuxeImmo Expert',
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 pt-20">
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {locale === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
          </Link>
        </div>

        <header className="mb-12 text-center">
          <h1 dir="auto" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            {displayTitle}
          </h1>
          
          <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 space-x-4 text-sm md:text-base">
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString(locale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            {post.author?.name && (
              <>
                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <span>By {post.author.name}</span>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
            <img
              src={post.coverImage}
              alt={displayTitle}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}

        {/* Tiptap uses standard HTML tags, so we wrap in 'prose' for Tailwind Typography styling */}
        <div 
          dir="auto"
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl prose-indigo mx-auto"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      </article>

      <Footer locale={locale} />
    </main>
  );
}
