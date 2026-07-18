"use client";

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/storefront/PropertyMap'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 w-full h-64 rounded-md flex items-center justify-center">Loading Map...</div>
});

interface MapWrapperProps {
  city: string;
  lat?: number | null;
  lng?: number | null;
}

export default function MapWrapper({ city, lat, lng }: MapWrapperProps) {
  return <PropertyMap city={city} lat={lat} lng={lng} />;
}
