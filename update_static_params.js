const fs = require('fs');

const basicPages = [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/properties/page.tsx',
  'src/app/[locale]/blog/page.tsx',
  'src/app/[locale]/categories/page.tsx'
];

const basicSnippet = `
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
`;

basicPages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('generateStaticParams')) {
      if (!content.includes('import { routing }')) {
        content = `import { routing } from '@/i18n/routing';\n` + content;
      }
      content = content + `\n${basicSnippet}\n`;
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
});

const propertySlugPage = 'src/app/[locale]/properties/[slug]/page.tsx';
const propertySlugSnippet = `
export async function generateStaticParams() {
  const properties = await prisma.property.findMany({ select: { slug: true } });
  return routing.locales.flatMap(locale => 
    properties.map(p => ({ locale, slug: p.slug }))
  );
}
`;
if (fs.existsSync(propertySlugPage)) {
  let content = fs.readFileSync(propertySlugPage, 'utf8');
  if (!content.includes('generateStaticParams')) {
    if (!content.includes('import { routing }')) {
        content = `import { routing } from '@/i18n/routing';\n` + content;
    }
    content = content + `\n${propertySlugSnippet}\n`;
    fs.writeFileSync(propertySlugPage, content);
    console.log(`Updated ${propertySlugPage}`);
  }
}

const blogSlugPage = 'src/app/[locale]/blog/[slug]/page.tsx';
const blogSlugSnippet = `
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
`;
if (fs.existsSync(blogSlugPage)) {
  let content = fs.readFileSync(blogSlugPage, 'utf8');
  if (!content.includes('generateStaticParams')) {
    if (!content.includes('import { routing }')) {
        content = `import { routing } from '@/i18n/routing';\n` + content;
    }
    content = content + `\n${blogSlugSnippet}\n`;
    fs.writeFileSync(blogSlugPage, content);
    console.log(`Updated ${blogSlugPage}`);
  }
}
