const fs = require('fs');

const basicPages = [
  'src/app/[locale]/search/page.tsx',
  'src/app/[locale]/privacy-policy/page.tsx'
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
