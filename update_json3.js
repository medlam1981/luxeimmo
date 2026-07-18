const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    Property: {
      bathrooms: "Bathrooms",
      bedrooms: "Bedrooms",
      areaSqm: "Area",
      askingPrice: "Asking Price",
      secureContact: "Secure Direct Contact",
      verifiedListing: "Verified Listing",
      aboutThisProperty: "About this Property",
      location: "Location",
      rentalPeriod: "Rental Period",
      daily: "Daily",
      monthly: "Monthly"
    }
  },
  fr: {
    Property: {
      bathrooms: "Salles de bain",
      bedrooms: "Chambres",
      areaSqm: "Surface",
      askingPrice: "Prix demandé",
      secureContact: "Contact direct sécurisé",
      verifiedListing: "Annonce vérifiée",
      aboutThisProperty: "À propos de cette propriété",
      location: "Emplacement",
      rentalPeriod: "Période de location",
      daily: "Par jour",
      monthly: "Par mois"
    }
  },
  es: {
    Property: {
      bathrooms: "Baños",
      bedrooms: "Habitaciones",
      areaSqm: "Área",
      askingPrice: "Precio de venta",
      secureContact: "Contacto directo seguro",
      verifiedListing: "Anuncio verificado",
      aboutThisProperty: "Acerca de esta propiedad",
      location: "Ubicación",
      rentalPeriod: "Período de alquiler",
      daily: "Diario",
      monthly: "Mensual"
    }
  },
  ar: {
    Property: {
      bathrooms: "الحمامات",
      bedrooms: "غرف النوم",
      areaSqm: "المساحة",
      askingPrice: "السعر المطلوب",
      secureContact: "تواصل مباشر آمن",
      verifiedListing: "قائمة تم التحقق منها",
      aboutThisProperty: "حول هذه الخاصية",
      location: "موقع",
      rentalPeriod: "فترة الإيجار",
      daily: "يوميا",
      monthly: "شهريا"
    }
  }
};

for (const [lang, data] of Object.entries(locales)) {
  const file = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const existing = JSON.parse(fs.readFileSync(file, 'utf-8'));
    existing.Property = { ...existing.Property, ...data.Property };
    fs.writeFileSync(file, JSON.stringify(existing, null, 2));
  }
}
