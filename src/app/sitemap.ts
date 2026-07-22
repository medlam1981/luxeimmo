import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://luxeimmo.com';
const LOCALES = ['en', 'fr', 'ar', 'es'];


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all property slugs
  const properties = await prisma.property.findMany({
    where: { status: 'APPROVED' },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  // Fetch all published blog posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  // Static pages common to every locale
  const staticPaths = ['', '/properties', '/search', '/blog'];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : path === '/properties' ? 0.8 : 0.6,
    }))
  );

  // One entry per property × locale
  const propertyEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    properties.map((p: any) => ({
      url: `${BASE_URL}/${locale}/properties/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }))
  );

  // One entry per post × locale
  const postEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    posts.map((p: any) => {
      let slugToUse = p.slug;
      try {
        const parsedSlugs = JSON.parse(p.slug);
        slugToUse = parsedSlugs[locale] || parsedSlugs.en || Object.values(parsedSlugs)[0] || p.slug;
      } catch (e) {
        // Fallback to raw slug
      }
      return {
        url: `${BASE_URL}/${locale}/blog/${slugToUse}`,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    })
  );

  return [...staticEntries, ...propertyEntries, ...postEntries];
}
