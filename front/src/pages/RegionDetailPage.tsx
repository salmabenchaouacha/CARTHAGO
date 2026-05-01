import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getRegionDetail } from '@/services/regionService';
import { getPartners } from '@/services/partnerService';
import { PartnerCard } from '@/components/Cards';
import SectionTitle from '@/components/SectionTitle';
import { type RegionList } from '@/types';
import { type PartnerList } from '@/types';

const RegionDetailPage = () => {
  const { id } = useParams();
  const [region, setRegion] = useState<RegionList | null>(null);
  const [partners, setPartners] = useState<PartnerList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRegionDetail(Number(id))
      .then(data => {
        setRegion(data);
        // Charger les partenaires de cette région
        return getPartners({ region: data.slug });
      })
      .then(setPartners)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
      Chargement...
    </div>
  );

  if (!region) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-display">Région non trouvée</h2>
      <Link to="/regions" className="text-primary mt-4 inline-block">Retour aux régions</Link>
    </div>
  );

  return (
    <div>
      <section className="relative h-[45vh] flex items-end">
        {region.image ? (
         <img
  src={region.image}
  alt={region.name}
  className="absolute inset-0 w-full h-full object-cover"
/>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-10">
          <Link to="/regions" className="inline-flex items-center gap-1 text-primary-foreground/80 text-sm mb-4 hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" />Toutes les régions
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
            {region.name}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{region.description}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">

          {(region.specialties.length > 0 || region.activities.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {region.specialties.length > 0 && (
                <div>
                  <h3 className="font-display text-2xl font-bold mb-4">Spécialités culinaires</h3>
                  <div className="flex flex-wrap gap-2">
                    {region.specialties.map(s => (
                      <span key={s} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {region.activities.length > 0 && (
                <div>
                  <h3 className="font-display text-2xl font-bold mb-4">Activités</h3>
                  <div className="flex flex-wrap gap-2">
                    {region.activities.map(a => (
                      <span key={a} className="px-4 py-2 rounded-full bg-mediterranean-light text-primary font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {partners.length > 0 && (
            <>
              <SectionTitle title="Lieux recommandés" subtitle={`Nos partenaires à ${region.name}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((p, i) => <PartnerCard key={p.id} partner={p} index={i} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default RegionDetailPage;