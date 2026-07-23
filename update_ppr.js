const fs = require('fs');

const pprPages = [
  'src/app/[locale]/properties/page.tsx',
  'src/app/[locale]/blog/page.tsx',
  'src/app/[locale]/search/page.tsx'
];

const pprSnippet = `
export const experimental_ppr = true;
`;

pprPages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('experimental_ppr = true')) {
      content = content + `\n${pprSnippet}\n`;
      fs.writeFileSync(file, content);
      console.log(`Updated ${file} with experimental_ppr`);
    }
  }
});
