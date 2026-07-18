const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    PropertiesPage: {
      title: "Real Estate Properties",
      subtitle: "Find the best property that fits your needs.",
      empty: "No properties found."
    }
  },
  ar: {
    PropertiesPage: {
      title: "العقارات",
      subtitle: "ابحث عن أفضل عقار يناسب احتياجاتك.",
      empty: "لم يتم العثور على عقارات."
    }
  },
  fr: {
    PropertiesPage: {
      title: "Propriétés immobilières",
      subtitle: "Trouvez la meilleure propriété qui correspond à vos besoins.",
      empty: "Aucune propriété trouvée."
    }
  },
  es: {
    PropertiesPage: {
      title: "Propiedades Inmobiliarias",
      subtitle: "Encuentra la mejor propiedad que se adapte a tus necesidades.",
      empty: "No se encontraron propiedades."
    }
  }
};

for (const [lang, translations] of Object.entries(locales)) {
  const file = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.PropertiesPage = { ...translations.PropertiesPage };
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json for PropertiesPage`);
  }
}
