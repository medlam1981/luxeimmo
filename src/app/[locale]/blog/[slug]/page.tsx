import prisma from '@/lib/prisma';
import { Navbar } from '@/components/storefront/Navbar';
import { Footer } from '@/components/storefront/Footer';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: 'Not Found' };

  const excerpt = post.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';
  const url = `https://luxeimmo.com/${locale}/blog/${slug}`;

  return {
    title: `${post.title} | LuxeImmo Blog`,
    description: excerpt,
    alternates: {
      canonical: url,
      languages: {
        en: `https://luxeimmo.com/en/blog/${slug}`,
        fr: `https://luxeimmo.com/fr/blog/${slug}`,
        es: `https://luxeimmo.com/es/blog/${slug}`,
        ar: `https://luxeimmo.com/ar/blog/${slug}`,
        'x-default': `https://luxeimmo.com/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
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
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Schema.org Article JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
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
            Back to Blog
          </Link>
        </div>

        <header className="mb-12 text-center">
          <h1 dir="auto" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
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
              alt={post.title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>
        )}

        {/* Tiptap uses standard HTML tags, so we wrap in 'prose' for Tailwind Typography styling */}
        <div 
          dir="auto"
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl prose-indigo mx-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <Footer locale={locale} />
    </main>
  );
}
