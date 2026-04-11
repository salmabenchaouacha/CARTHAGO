import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartnerCard } from '@/components/Cards';
import SectionTitle from '@/components/SectionTitle';
import { partners, regions } from '@/data/mockData';

const PartnersPage = () => {
  const [searchParams] = useSearchParams();
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [regionFilter, setRegionFilter] = useState('');
  const [search, setSearch] = useState('');

  const types = [
    { value: '', label: 'Tous' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'guesthouse', label: 'Maisons d\'hôtes' },
    { value: 'artisan', label: 'Artisans' },
    { value: 'guide', label: 'Guides' },
    { value: 'experience', label: 'Expériences' },
  ];

  const filtered = partners.filter(p => {
    if (typeFilter && p.type !== typeFilter) return false;
    if (regionFilter && p.region !== regionFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitle title="Nos partenaires" subtitle="Restaurants, hébergements, artisans et guides locaux à travers la Tunisie" />

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm flex-1"
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm">
            {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm">
            <option value="">Toutes les régions</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => <PartnerCard key={p.id} partner={p} index={i} />)}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">Aucun partenaire trouvé avec ces critères.</p>
        )}
      </div>
    </div>
  );
};

export default PartnersPage;
