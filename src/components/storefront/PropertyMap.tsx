'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PropertyMapProps {
  city: string;
  lat?: number | null;
  lng?: number | null;
}

const CITY_COORDS: Record<string, [number, number]> = {
  'Casablanca': [33.5731, -7.5898],
  'Marrakech': [31.6295, -7.9811],
  'Rabat': [34.0209, -6.8416],
  'Tangier': [35.7595, -5.8340],
  'Agadir': [30.4278, -9.5981],
  'Fes': [34.0331, -5.0003]
};

export default function PropertyMap({ city, lat, lng }: PropertyMapProps) {
  const coords: [number, number] = (lat != null && lng != null) ? [lat, lng] : (CITY_COORDS[city] || [33.5731, -7.5898]); 
  return (
    <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 relative z-0">
      <MapContainer center={coords} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>{city}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
