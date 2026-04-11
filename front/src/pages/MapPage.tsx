import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { partners, regions } from '@/data/mockData';
import { Star } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const typeLabels: Record<string, string> = {
  restaurant: 'Restaurant', guesthouse: 'Maison d\'hôte', artisan: 'Artisan', guide: 'Guide', experience: 'Expérience'
};

const MapPage = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const filtered = typeFilter ? partners.filter(p => p.type === typeFilter) : partners;
  const types = [
    { value: '', label: 'Tous' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'guesthouse', label: 'Maisons d\'hôtes' },
    { value: 'artisan', label: 'Artisans' },
    { value: 'guide', label: 'Guides' },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitle title="Carte interactive" subtitle="Explorez les lieux et partenaires à travers la Tunisie" />
        <div className="flex gap-2 mb-6 flex-wrap">
          {types.map(t => (
            <button key={t.value} onClick={() => setTypeFilter(t.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === t.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-border'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden border" style={{ height: '70vh' }}>
          <MapContainer center={[34.5, 9.5]} zoom={6} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <div className="min-w-[200px]">
                    <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded mb-2" />
                    <span className="text-xs font-medium text-primary">{typeLabels[p.type]}</span>
                    <h3 className="font-bold text-sm">{p.name}</h3>
                    <div className="flex items-center gap-1 my-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{p.rating}</span>
                    </div>
                    <Link to={`/partenaires/${p.id}`} className="text-xs text-primary hover:underline">Voir détails →</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
