import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'translate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure translate engine
translate.engine = 'google';

const LOCALES = ['ar', 'fr', 'es'];
const MESSAGES_DIR = path.join(__dirname, '../messages');

// Recursively traverse base object, find missing keys in target object, and translate them
async function syncTranslations(baseObj, targetObj, targetLang) {
  let updated = false;

  for (const [key, value] of Object.entries(baseObj)) {
    if (typeof value === 'object' && value !== null) {
      if (!targetObj[key] || typeof targetObj[key] !== 'object') {
        targetObj[key] = {};
        updated = true;
      }
      const childUpdated = await syncTranslations(value, targetObj[key], targetLang);
      if (childUpdated) updated = true;
    } else if (typeof value === 'string') {
      if (targetObj[key] === undefined) {
        try {
          console.log(`Translating to ${targetLang}: "${value}"`);
          const translatedText = await translate(value, { from: 'en', to: targetLang });
          targetObj[key] = translatedText;
          updated = true;
        } catch (error) {
          console.error(`Failed to translate "${value}" to ${targetLang}:`, error);
        }
      }
    }
  }
  return updated;
}

async function main() {
  console.log('Starting automated i18n sync...');
  const enPath = path.join(MESSAGES_DIR, 'en.json');
  
  if (!fs.existsSync(enPath)) {
    console.error('Base English file not found at:', enPath);
    process.exit(1);
  }

  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  for (const lang of LOCALES) {
    const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
    let langData = {};
    
    if (fs.existsSync(langPath)) {
      langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    }

    console.log(`\n--- Syncing ${lang.toUpperCase()} ---`);
    const wasUpdated = await syncTranslations(enData, langData, lang);

    if (wasUpdated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2) + '\n');
      console.log(`✅ Updated ${lang}.json`);
    } else {
      console.log(`✨ ${lang}.json is already up to date.`);
    }
  }
  
  console.log('\nAll translations synced successfully!');
}

main().catch(console.error);
