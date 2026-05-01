import React, { useEffect, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import { RegionCard } from '@/components/Cards';
import { getRegions } from '@/services/regionService';
import { type RegionList } from '@/types';

const RegionsPage = () => {
  const [regions, setRegions] = useState<RegionList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRegions()
      .then(setRegions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Régions de Tunisie"
          subtitle="Du nord méditerranéen au grand sud saharien, chaque région a sa personnalité"
        />
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((r, i) => <RegionCard key={r.id} region={r} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionsPage;