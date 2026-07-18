const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    CategoriesPage: {
      title: "Browse by Property Type",
      subtitle: "Explore our curated real estate categories tailored to your needs.",
      apartment_name: "Apartments",
      apartment_desc: "Modern apartments in the city center.",
      villa_name: "Luxury Villas",
      villa_desc: "Spacious villas with private pools.",
      commercial_name: "Commercial Spaces",
      commercial_desc: "Prime locations for your business.",
      land_name: "Land & Plots",
      land_desc: "Build your dream project."
    }
  },
  ar: {
    CategoriesPage: {
      title: "تصفح حسب نوع العقار",
      subtitle: "استكشف فئات العقارات المنسقة المصممة لتلبية احتياجاتك.",
      apartment_name: "شقق",
      apartment_desc: "شقق حديثة في وسط المدينة.",
      villa_name: "فلل فاخرة",
      villa_desc: "فلل واسعة مع مسابح خاصة.",
      commercial_name: "مساحات تجارية",
      commercial_desc: "مواقع رئيسية لعملك.",
      land_name: "أراضي ومخططات",
      land_desc: "ابنِ مشروع أحلامك."
    }
  },
  fr: {
    CategoriesPage: {
      title: "Parcourir par type de propriété",
      subtitle: "Explorez nos catégories immobilières adaptées à vos besoins.",
      apartment_name: "Appartements",
      apartment_desc: "Appartements modernes en centre-ville.",
      villa_name: "Villas de Luxe",
      villa_desc: "Villas spacieuses avec piscines privées.",
      commercial_name: "Espaces Commerciaux",
      commercial_desc: "Emplacements de choix pour votre entreprise.",
      land_name: "Terrains",
      land_desc: "Construisez le projet de vos rêves."
    }
  },
  es: {
    CategoriesPage: {
      title: "Buscar por Tipo de Propiedad",
      subtitle: "Explore nuestras categorías inmobiliarias adaptadas a sus necesidades.",
      apartment_name: "Apartamentos",
      apartment_desc: "Apartamentos modernos en el centro de la ciudad.",
      villa_name: "Villas de Lujo",
      villa_desc: "Villas espaciosas con piscinas privadas.",
      commercial_name: "Espacios Comerciales",
      commercial_desc: "Ubicaciones privilegiadas para su negocio.",
      land_name: "Terrenos",
      land_desc: "Construya el proyecto de sus sueños."
    }
  }
};

for (const [lang, translations] of Object.entries(locales)) {
  const file = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    // Update CategoriesPage
    data.CategoriesPage = { ...data.CategoriesPage, ...translations.CategoriesPage };
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
}
