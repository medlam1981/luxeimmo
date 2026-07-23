const fs = require('fs');
const file = 'src/app/[locale]/properties/page.tsx';
let data = fs.readFileSync(file, 'utf8');

// Add export const revalidate = 60
if (!data.includes('export const revalidate')) {
  data = data.replace('export async function generateMetadata', 'export const revalidate = 60;\n\nexport async function generateMetadata');
}

// Add page parameter to getCachedProperties
data = data.replace('async (category?: string, type?: string, city?: string) => {', 'async (category?: string, type?: string, city?: string, page: number = 1) => {');

data = data.replace('[' + "'properties-search-cache'" + ']', '[\'properties-search-cache\', String(page)]');
data = data.replace(/const dbProperties = await prisma\.property\.findMany\(\{[\s\S]*?take: 8,[\s\S]*?orderBy: \{ createdAt: 'desc' \}\s*\}\);/, `const dbProperties = await prisma.property.findMany({
      where,
      take: 12,
      skip: (page - 1) * 12,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        propertyType: true,
        rentalPeriod: true,
        category: true,
        city: true,
        bedrooms: true,
        bathrooms: true,
        areaSqm: true,
        images: true,
        isFeatured: true,
        ownerPhone: true,
      }
    });`);

data = data.replace(/return dbProperties\.map\(\(p: any\) => \(\{[\s\S]*?\}\)\) as Property\[\];/, `return dbProperties.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: Number(p.price),
      propertyType: p.propertyType,
      rentalPeriod: p.rentalPeriod,
      category: p.category,
      city: p.city,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      areaSqm: p.areaSqm,
      images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80'],
      isFeatured: p.isFeatured,
      ownerPhone: p.ownerPhone
    })) as Property[];`);

data = data.replace(/searchParams: Promise<\{ category\?: string, type\?: string, city\?: string \}>/g, 'searchParams: Promise<{ category?: string, type?: string, city?: string, page?: string }>');
data = data.replace(/const \{ category, type, city \} = await searchParams;/, `const { category, type, city, page } = await searchParams;\n  const currentPage = page ? parseInt(page, 10) : 1;`);
data = data.replace(/properties = await getCachedProperties\(category, type, city\);/, `properties = await getCachedProperties(category, type, city, currentPage);`);

fs.writeFileSync(file, data);
