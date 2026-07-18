const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    Search: {
      searchResults: "Search Results",
      foundProperties: "Found {count} properties matching your criteria",
      noProperties: "No properties found",
      adjustFilters: "Try adjusting your filters or searching in a different city.",
      location: "Location / City",
      locationPlaceholder: "e.g. Casablanca",
      propertyType: "Property Type",
      buy: "Buy",
      rent: "Rent",
      category: "Category",
      allCategories: "All Categories",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      applyFilters: "Apply Filters"
    }
  },
  fr: {
    Search: {
      searchResults: "Résultats de recherche",
      foundProperties: "{count} propriétés trouvées",
      noProperties: "Aucune propriété trouvée",
      adjustFilters: "Essayez de modifier vos filtres ou de chercher dans une autre ville.",
      location: "Emplacement / Ville",
      locationPlaceholder: "ex. Casablanca",
      propertyType: "Type de bien",
      buy: "Acheter",
      rent: "Louer",
      category: "Catégorie",
      allCategories: "Toutes les catégories",
      minPrice: "Prix minimum",
      maxPrice: "Prix maximum",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      applyFilters: "Appliquer les filtres"
    }
  },
  es: {
    Search: {
      searchResults: "Resultados de búsqueda",
      foundProperties: "{count} propiedades encontradas",
      noProperties: "No se encontraron propiedades",
      adjustFilters: "Intente ajustar sus filtros o buscar en otra ciudad.",
      location: "Ubicación / Ciudad",
      locationPlaceholder: "ej. Casablanca",
      propertyType: "Tipo de propiedad",
      buy: "Comprar",
      rent: "Alquilar",
      category: "Categoría",
      allCategories: "Todas las categorías",
      minPrice: "Precio mínimo",
      maxPrice: "Precio máximo",
      bedrooms: "Habitaciones",
      bathrooms: "Baños",
      applyFilters: "Aplicar filtros"
    }
  },
  ar: {
    Search: {
      searchResults: "نتائج البحث",
      foundProperties: "تم العثور على {count} عقارات",
      noProperties: "لم يتم العثور على عقارات",
      adjustFilters: "حاول تعديل عوامل التصفية أو البحث في مدينة أخرى.",
      location: "الموقع / المدينة",
      locationPlaceholder: "مثال: الدار البيضاء",
      propertyType: "نوع العقار",
      buy: "شراء",
      rent: "إيجار",
      category: "الفئة",
      allCategories: "جميع الفئات",
      minPrice: "الحد الأدنى للسعر",
      maxPrice: "الحد الأقصى للسعر",
      bedrooms: "غرف النوم",
      bathrooms: "الحمامات",
      applyFilters: "تطبيق عوامل التصفية"
    }
  }
};

for (const [lang, data] of Object.entries(locales)) {
  const file = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const existing = JSON.parse(fs.readFileSync(file, 'utf-8'));
    existing.Search = { ...existing.Search, ...data.Search };
    fs.writeFileSync(file, JSON.stringify(existing, null, 2));
  }
}
