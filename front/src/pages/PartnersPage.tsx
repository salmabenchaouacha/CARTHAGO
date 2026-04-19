import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartnerCard } from '@/components/Cards';
import SectionTitle from '@/components/SectionTitle';
import { getPartners } from '@/services/partnerService';
import { type PartnerList } from '@/types';        // ← import

const ACTIVITY_TYPES = [
  { value: '', label: 'Tous' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'guesthouse', label: "Maisons d'hôtes" },
  { value: 'artisan', label: 'Artisans' },
  { value: 'guide', label: 'Guides' },
  { value: 'experience', label: 'Expériences' },
];

const PartnersPage = () => {
  const [searchParams] = useSearchParams();
  const [partners, setPartners] = useState<PartnerList[]>([]);  // ← PartnerList
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [regionFilter, setRegionFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getPartners({ activity_type: typeFilter || undefined, region: regionFilter || undefined, q: search || undefined })
      .then(data => setPartners(data))
      .finally(() => setLoading(false));
  }, [typeFilter, regionFilter, search]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitle title="Nos partenaires" subtitle="Restaurants, hébergements, artisans et guides locaux à travers la Tunisie" />
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm flex-1" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm">
            {ACTIVITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((p, i) => <PartnerCard key={p.id} partner={p} index={i} />)}
            </div>
            {partners.length === 0 && <p className="text-center text-muted-foreground py-20">Aucun partenaire trouvé avec ces critères.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default PartnersPage;