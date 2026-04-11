import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import { regions, partners } from '@/data/mockData';
import { PartnerCard } from '@/components/Cards';
import SectionTitle from '@/components/SectionTitle';

const RegionDetailPage = () => {
  const { id } = useParams();
  const region = regions.find(r => r.id === id);

  if (!region) return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-display">Région non trouvée</h2><Link to="/regions" className="text-primary mt-4 inline-block">Retour aux régions</Link></div>;

  const regionPartners = partners.filter(p => p.region === region.id);

  return (
    <div>
      <section className="relative h-[45vh] flex items-end">
        <img src={region.image} alt={region.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-10">
          <Link to="/regions" className="inline-flex items-center gap-1 text-primary-foreground/80 text-sm mb-4 hover:text-primary-foreground"><ArrowLeft className="h-4 w-4" />Toutes les régions</Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-2">{region.name}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{region.description}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">Spécialités culinaires</h3>
              <div className="flex flex-wrap gap-2">
                {region.specialties.map(s => (
                  <span key={s} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold mb-4">Activités</h3>
              <div className="flex flex-wrap gap-2">
                {region.activities.map(a => (
                  <span key={a} className="px-4 py-2 rounded-full bg-mediterranean-light text-primary font-medium">{a}</span>
                ))}
              </div>
            </div>
          </div>

          {regionPartners.length > 0 && (
            <>
              <SectionTitle title="Lieux recommandés" subtitle={`Nos partenaires à ${region.name}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regionPartners.map((p, i) => <PartnerCard key={p.id} partner={p} index={i} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default RegionDetailPage;
