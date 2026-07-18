const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    Admin: {
      addNewProperty: "Add New Property",
      description: "Description",
      price: "Price",
      city: "City",
      forSale: "For Sale",
      forRent: "For Rent",
      category: "Category",
      apartment_name: "Apartment",
      villa_name: "Villa",
      commercial_name: "Commercial",
      land_name: "Land",
      areaSqm: "Area (sqm)",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      image: "Property Image",
      saving: "Saving...",
      saveProperty: "Save Property"
    }
  },
  ar: {
    Admin: {
      addNewProperty: "إضافة عقار جديد",
      description: "الوصف",
      price: "السعر",
      city: "المدينة",
      forSale: "للبيع",
      forRent: "للإيجار",
      category: "الفئة",
      apartment_name: "شقة",
      villa_name: "فيلا",
      commercial_name: "تجاري",
      land_name: "أرض",
      areaSqm: "المساحة (متر مربع)",
      bedrooms: "غرف النوم",
      bathrooms: "الحمامات",
      image: "صورة العقار",
      saving: "جاري الحفظ...",
      saveProperty: "حفظ العقار"
    }
  },
  fr: {
    Admin: {
      addNewProperty: "Ajouter une Propriété",
      description: "Description",
      price: "Prix",
      city: "Ville",
      forSale: "À Vendre",
      forRent: "À Louer",
      category: "Catégorie",
      apartment_name: "Appartement",
      villa_name: "Villa",
      commercial_name: "Commercial",
      land_name: "Terrain",
      areaSqm: "Surface (m²)",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      image: "Image de la Propriété",
      saving: "Enregistrement...",
      saveProperty: "Enregistrer la Propriété"
    }
  },
  es: {
    Admin: {
      addNewProperty: "Añadir Nueva Propiedad",
      description: "Descripción",
      price: "Precio",
      city: "Ciudad",
      forSale: "En Venta",
      forRent: "En Alquiler",
      category: "Categoría",
      apartment_name: "Apartamento",
      villa_name: "Villa",
      commercial_name: "Comercial",
      land_name: "Terreno",
      areaSqm: "Superficie (m²)",
      bedrooms: "Dormitorios",
      bathrooms: "Baños",
      image: "Imagen de la Propiedad",
      saving: "Guardando...",
      saveProperty: "Guardar Propiedad"
    }
  }
};

for (const [lang, translations] of Object.entries(locales)) {
  const file = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data.Admin) data.Admin = {};
    data.Admin = { ...data.Admin, ...translations.Admin };
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json with Form keys`);
  }
}
