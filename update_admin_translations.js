const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    Admin: {
      totalProperties: "Total Properties",
      propertiesForRent: "Properties for Rent",
      propertiesForSale: "Properties for Sale",
      manageProperties: "Manage Properties",
      propertyTitle: "Property Title",
      propertyType: "Type",
      deleteConfirm: "Are you sure you want to delete this property?",
      delete: "Delete",
      deleting: "Deleting...",
      noProperties: "No properties found."
    }
  },
  ar: {
    Admin: {
      totalProperties: "إجمالي العقارات",
      propertiesForRent: "عقارات للإيجار",
      propertiesForSale: "عقارات للبيع",
      manageProperties: "إدارة العقارات",
      propertyTitle: "عنوان العقار",
      propertyType: "النوع",
      deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا العقار؟",
      delete: "حذف",
      deleting: "جاري الحذف...",
      noProperties: "لم يتم العثور على عقارات."
    }
  },
  fr: {
    Admin: {
      totalProperties: "Total des Propriétés",
      propertiesForRent: "Propriétés à Louer",
      propertiesForSale: "Propriétés à Vendre",
      manageProperties: "Gérer les Propriétés",
      propertyTitle: "Titre de la Propriété",
      propertyType: "Type",
      deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette propriété ?",
      delete: "Supprimer",
      deleting: "Suppression...",
      noProperties: "Aucune propriété trouvée."
    }
  },
  es: {
    Admin: {
      totalProperties: "Total de Propiedades",
      propertiesForRent: "Propiedades en Alquiler",
      propertiesForSale: "Propiedades en Venta",
      manageProperties: "Gestionar Propiedades",
      propertyTitle: "Título de la Propiedad",
      propertyType: "Tipo",
      deleteConfirm: "¿Estás seguro de que quieres eliminar esta propiedad?",
      delete: "Eliminar",
      deleting: "Eliminando...",
      noProperties: "No se encontraron propiedades."
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
    console.log(`Updated ${lang}.json for Admin`);
  }
}
