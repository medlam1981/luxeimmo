export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  propertyType: 'SALE' | 'RENT';
  rentalPeriod?: string | null;
  ownerPhone: string;
  category: 'APARTMENT' | 'VILLA' | 'COMMERCIAL' | 'LAND';
  city: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm: number;
  images: string[];
  isFeatured: boolean;
}

export interface SavedProperty extends Property {
  savedAt: string;
}

