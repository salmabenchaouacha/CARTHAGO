import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import { RegionCard } from '@/components/Cards';
import { regions } from '@/data/mockData';

const RegionsPage = () => (
  <div className="py-12">
    <div className="container mx-auto px-4">
      <SectionTitle title="Régions de Tunisie" subtitle="Du nord méditerranéen au grand sud saharien, chaque région a sa personnalité" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((r, i) => <RegionCard key={r.id} region={r} index={i} />)}
      </div>
    </div>
  </div>
);

export default RegionsPage;
