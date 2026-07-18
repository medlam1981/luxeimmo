const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    Admin: {
      rentalPeriod: "Rental Period",
      daily: "Daily",
      monthly: "Monthly"
    },
    Property: {
      perDay: " / Day",
      perMonth: " / Month",
      sale: "Sale",
      rent: "Rent",
      apartment: "Apartment",
      villa: "Villa",
      commercial: "Commercial",
      land: "Land",
      contactAgent: "Contact Agent"
    }
  },
  ar: {
    Admin: {
      rentalPeriod: "فترة الإيجار",
      daily: "يومي",
      monthly: "شهري"
    },
    Property: {
      perDay: " / يوم",
      perMonth: " / شهر",
      sale: "للبيع",
      rent: "للإيجار",
      apartment: "شقة",
      villa: "فيلا",
      commercial: "تجاري",
      land: "أرض",
      contactAgent: "اتصل بالوكيل"
    }
  },
  fr: {
    Admin: {
      rentalPeriod: "Période de Location",
      daily: "Journalier",
      monthly: "Mensuel"
    },
    Property: {
      perDay: " / Jour",
      perMonth: " / Mois",
      sale: "Vente",
      rent: "Location",
      apartment: "Appartement",
      villa: "Villa",
      commercial: "Commercial",
      land: "Terrain",
      contactAgent: "Contacter l'Agent"
    }
  },
  es: {
    Admin: {
      rentalPeriod: "Período de Alquiler",
      daily: "Diario",
      monthly: "Mensual"
    },
    Property: {
      perDay: " / Día",
      perMonth: " / Mes",
      sale: "Venta",
      rent: "Alquiler",
      apartment: "Apartamento",
      villa: "Villa",
      commercial: "Comercial",
      land: "Terreno",
      contactAgent: "Contactar Agente"
    }
  }
};

for (const [lang, translations] of Object.entries(locales)) {
  const file = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!data.Admin) data.Admin = {};
    data.Admin = { ...data.Admin, ...translations.Admin };
    
    data.Property = { ...translations.Property };
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
}
