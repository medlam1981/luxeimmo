import { Metadata } from 'next';
import { Navbar } from '@/components/storefront/Navbar';
import { Hero } from '@/components/storefront/Hero';
import { PropertyGrid } from '@/components/storefront/PropertyGrid';
import { Features } from '@/components/storefront/Features';
import { Footer } from '@/components/storefront/Footer';
import prisma from '@/lib/prisma';
import { Property } from '@/types';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `https://luxeimmo.com/${locale}`,
    },
  };
}

export default async function Home() {
  let properties: Property[] = [];
  let heroProperty: Property | null = null;
  
  try {
    const dbProperties = await prisma.property.findMany({
      where: { status: 'APPROVED' },
      orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
      take: 8
    });
    
    properties = dbProperties.map(p => ({
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

    const dbHeroProperty = await prisma.property.findFirst({
      where: { isFeatured: true, status: 'APPROVED' }
    }) || dbProperties[0];

    if (dbHeroProperty) {
      heroProperty = {
        id: dbHeroProperty.id,
        title: dbHeroProperty.title,
        slug: dbHeroProperty.slug,
        description: dbHeroProperty.description,
        price: Number(dbHeroProperty.price),
        propertyType: dbHeroProperty.propertyType,
        ownerPhone: dbHeroProperty.ownerPhone,
        category: dbHeroProperty.category,
        city: dbHeroProperty.city,
        bedrooms: dbHeroProperty.bedrooms,
        bathrooms: dbHeroProperty.bathrooms,
        areaSqm: dbHeroProperty.areaSqm,
        images: dbHeroProperty.images.length > 0 ? dbHeroProperty.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'],
        isFeatured: dbHeroProperty.isFeatured
      } as Property;
    }

  } catch (error) {
    console.log('Database connection failed.');
  }

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <Hero heroProperty={heroProperty} />
      <Features />
      <PropertyGrid properties={properties} />
      <Footer />
    </main>
  );
}
